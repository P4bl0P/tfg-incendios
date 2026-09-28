import { useCallback, useEffect, useState } from 'react';
import {
  Circle,
  Marker,
  Popup,
  useMap,
} from 'react-leaflet';
import * as L from 'leaflet';

type UserPosition = [number, number];

type LocationStatus =
  | 'idle'
  | 'loading'
  | 'success'
  | 'error';

const userLocationIcon = L.divIcon({
  className: '',
  iconSize: [42, 42],
  iconAnchor: [21, 21],
  popupAnchor: [0, -22],
  html: `
    <div class="relative flex h-[42px] w-[42px] items-center justify-center">
      <div class="absolute h-9 w-9 animate-ping rounded-full bg-blue-500/30"></div>

      <div class="relative z-10 flex h-5 w-5 items-center justify-center rounded-full border-[3px] border-white bg-blue-600 shadow-[0_0_0_3px_rgba(37,99,235,0.45),0_4px_12px_rgba(15,23,42,0.4)]">
        <div class="h-[5px] w-[5px] rounded-full bg-blue-100"></div>
      </div>
    </div>
  `,
});

function getLocationErrorMessage(
  error: GeolocationPositionError,
) {
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

function getLocationIcon() {
  return `
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="h-5 w-5"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M12 2v3"></path>
      <path d="M12 19v3"></path>
      <path d="M2 12h3"></path>
      <path d="M19 12h3"></path>
    </svg>
  `;
}

function getLoadingIcon() {
  return `
    <span
      class="h-5 w-5 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600"
      aria-hidden="true"
    ></span>
  `;
}

export default function GeolocationControl() {
  const map = useMap();

  const [position, setPosition] =
    useState<UserPosition | null>(null);

  const [accuracy, setAccuracy] = useState<number | null>(
    null,
  );

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
        setErrorMessage(getLocationErrorMessage(error));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      },
    );
  }, [map]);

  useEffect(() => {
    const geolocationControl = new L.Control({
      position: 'topleft',
    });

    geolocationControl.onAdd = () => {
      const container = L.DomUtil.create(
        'div',
        'group relative !mt-5 !ml-2',
      );

      const button = L.DomUtil.create(
        'button',
        [
          'relative flex h-11 w-11 items-center justify-center',
          'overflow-hidden rounded-2xl',
          'border border-white/80',
          'bg-white/95 text-slate-600',
          'shadow-[0_8px_20px_rgba(15,23,42,0.25)]',
          'backdrop-blur-xl',
          'transition-all duration-200 ease-out',
          'hover:-translate-y-0.5 hover:scale-105',
          'hover:text-blue-600',
          'hover:shadow-[0_12px_26px_rgba(15,23,42,0.3)]',
          'focus:outline-none focus-visible:ring-4',
          'focus-visible:ring-blue-400/40',
          'active:scale-95',
          'disabled:cursor-wait disabled:opacity-80',
        ].join(' '),
        container,
      ) as HTMLButtonElement;

      button.type = 'button';
      button.disabled = status === 'loading';

      button.setAttribute(
        'aria-label',
        'Centrar mapa en mi ubicación',
      );

      button.setAttribute(
        'aria-busy',
        String(status === 'loading'),
      );

      if (status === 'success') {
        button.className = [
          'relative flex h-11 w-11 items-center justify-center',
          'overflow-hidden rounded-2xl',
          'border border-blue-200',
          'bg-blue-50 text-blue-600',
          'shadow-[0_8px_22px_rgba(37,99,235,0.25)]',
          'backdrop-blur-xl',
          'transition-all duration-200 ease-out',
          'hover:-translate-y-0.5 hover:scale-105',
          'hover:shadow-[0_12px_26px_rgba(37,99,235,0.35)]',
          'focus:outline-none focus-visible:ring-4',
          'focus-visible:ring-blue-400/40',
          'active:scale-95',
        ].join(' ');
      }

      button.innerHTML =
        status === 'loading'
          ? getLoadingIcon()
          : getLocationIcon();

      const statusIndicator =
        status === 'success'
          ? `
            <span
              class="absolute right-1 top-1 z-20 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500 shadow-sm"
              aria-hidden="true"
            ></span>
          `
          : '';

      button.insertAdjacentHTML(
        'beforeend',
        statusIndicator,
      );

      const tooltip = L.DomUtil.create(
        'span',
        [
          'pointer-events-none absolute left-[calc(100%+10px)]',
          'top-1/2 z-[1000] hidden -translate-y-1/2',
          'whitespace-nowrap rounded-xl',
          'border border-white/10 bg-slate-950/90',
          'px-3 py-2 text-xs font-medium text-white',
          'opacity-0 shadow-xl backdrop-blur-xl',
          'transition-all duration-200',
          'group-hover:block group-hover:opacity-100',
        ].join(' '),
        container,
      );

      tooltip.textContent =
        status === 'loading'
          ? 'Obteniendo ubicación…'
          : status === 'success'
            ? 'Volver a mi ubicación'
            : 'Centrar en mi ubicación';

      L.DomEvent.disableClickPropagation(container);
      L.DomEvent.disableScrollPropagation(container);

      L.DomEvent.on(button, 'click', locateUser);

      return container;
    };

    geolocationControl.addTo(map);

    return () => {
      const container =
        geolocationControl.getContainer();

      if (container) {
        const button =
          container.querySelector('button');

        if (button) {
          L.DomEvent.off(
            button,
            'click',
            locateUser,
          );
        }
      }

      geolocationControl.remove();
    };
  }, [map, locateUser, status]);

  return (
    <>
      {errorMessage && (
        <div
          role="alert"
          aria-live="assertive"
          className="
            absolute left-4 top-28 z-[1000]
            max-w-[290px]
            rounded-2xl border border-red-300/30
            bg-slate-950/90 px-4 py-3
            text-xs leading-relaxed text-red-100
            shadow-2xl shadow-black/30
            backdrop-blur-xl
          "
        >
          <div className="mb-1 flex items-center gap-2 font-semibold">
            <span
              className="h-2 w-2 rounded-full bg-red-400"
              aria-hidden="true"
            />
            No se pudo obtener la ubicación
          </div>

          <p className="text-red-100/80">
            {errorMessage}
          </p>
        </div>
      )}

      {position && (
        <>
          {accuracy && (
            <Circle
              center={position}
              radius={accuracy}
              pathOptions={{
                color: '#60a5fa',
                fillColor: '#3b82f6',
                fillOpacity: 0.12,
                weight: 1.5,
              }}
            />
          )}

          <Marker
            position={position}
            icon={userLocationIcon}
          >
            <Popup>
              <div className="min-w-[220px] font-sans text-sm text-slate-800">
                <div className="mb-3 flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                  <strong>Tu ubicación actual</strong>
                </div>

                <p className="text-xs text-slate-600">
                  <strong>Latitud:</strong>{' '}
                  {position[0].toFixed(5)}
                </p>

                <p className="text-xs text-slate-600">
                  <strong>Longitud:</strong>{' '}
                  {position[1].toFixed(5)}
                </p>

                {accuracy && (
                  <p className="mt-1 text-xs text-slate-600">
                    <strong>Precisión:</strong>{' '}
                    aproximadamente {Math.round(accuracy)} m
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        </>
      )}
    </>
  );
}