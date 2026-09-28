import { useCallback, useState } from 'react';
import { useMap } from 'react-leaflet';

export type UserPosition = [number, number];

export type LocationStatus =
  | 'idle'
  | 'loading'
  | 'success'
  | 'error';

function getLocationErrorMessage(
  error: GeolocationPositionError,
): string {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return 'Has bloqueado el permiso de ubicación. Puedes activarlo desde la configuración del navegador.';

    case error.POSITION_UNAVAILABLE:
      return 'No se ha podido obtener tu ubicación actual.';

    case error.TIMEOUT:
      return 'La solicitud de ubicación ha tardado demasiado.';

    default:
      return 'Se ha producido un error al obtener tu ubicación.';
  }
}

export default function useGeolocation() {
  const map = useMap();

  const [position, setPosition] =
    useState<UserPosition | null>(null);

  const [accuracy, setAccuracy] =
    useState<number | null>(null);

  const [status, setStatus] =
    useState<LocationStatus>('idle');

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  const locateUser = useCallback(() => {
    if (!navigator.geolocation) {
      setStatus('error');
      setErrorMessage(
        'Tu navegador no admite geolocalización.',
      );
      return;
    }

    setStatus('loading');
    setErrorMessage(null);

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const nextPosition: UserPosition = [
          coords.latitude,
          coords.longitude,
        ];

        setPosition(nextPosition);
        setAccuracy(coords.accuracy);
        setStatus('success');

        map.flyTo(
          nextPosition,
          Math.max(map.getZoom(), 14),
          {
            animate: true,
            duration: 1.2,
          },
        );
      },
      (error) => {
        setStatus('error');
        setErrorMessage(
          getLocationErrorMessage(error),
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      },
    );
  }, [map]);

  return {
    position,
    accuracy,
    status,
    errorMessage,
    locateUser,
  };
}