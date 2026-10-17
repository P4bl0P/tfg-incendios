import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useMap } from 'react-leaflet';

export type UserPosition = [number, number];

export type LocationStatus =
  | 'idle'
  | 'loading'
  | 'success'
  | 'error';

const ERROR_VISIBLE_TIME = 5000;

function getLocationErrorMessage(
  error: GeolocationPositionError,
): string {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return 'Has rechazado el permiso de ubicación.';

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

  const [isCentering, setIsCentering] =
    useState(false);

  const errorTimeoutRef =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearErrorTimeout = useCallback(() => {
    if (errorTimeoutRef.current !== null) {
      clearTimeout(errorTimeoutRef.current);
      errorTimeoutRef.current = null;
    }
  }, []);

  const clearLocationError = useCallback(() => {
    clearErrorTimeout();
    setErrorMessage(null);
    setStatus('idle');
  }, [clearErrorTimeout]);

  const showTemporaryError = useCallback(
    (message: string) => {
      clearErrorTimeout();

      setStatus('error');
      setIsCentering(false);
      setErrorMessage(message);

      errorTimeoutRef.current = setTimeout(() => {
        setErrorMessage(null);
        setStatus('idle');
        errorTimeoutRef.current = null;
      }, ERROR_VISIBLE_TIME);
    },
    [clearErrorTimeout],
  );

  useEffect(() => {
    return () => {
      clearErrorTimeout();
    };
  }, [clearErrorTimeout]);

  const locateUser = useCallback(() => {
    clearLocationError();

    if (!navigator.geolocation) {
      showTemporaryError(
        'Tu navegador no admite geolocalización.',
      );
      return;
    }

    setStatus('loading');
    setIsCentering(false);

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        clearErrorTimeout();

        const nextPosition: UserPosition = [
          coords.latitude,
          coords.longitude,
        ];

        setPosition(nextPosition);
        setAccuracy(coords.accuracy);
        setStatus('success');
        setIsCentering(true);
        setErrorMessage(null);

        const handleMoveEnd = () => {
          setIsCentering(false);
          map.off('moveend', handleMoveEnd);
        };

        map.on('moveend', handleMoveEnd);

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
        showTemporaryError(
          getLocationErrorMessage(error),
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      },
    );
  }, [
    clearErrorTimeout,
    clearLocationError,
    map,
    showTemporaryError,
  ]);

  return {
    position,
    accuracy,
    status,
    errorMessage,
    isCentering,
    locateUser,
  };
}