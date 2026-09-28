import { useEffect, useState } from 'react';
import {
  Circle,
  Marker,
  Popup,
  useMap,
} from 'react-leaflet';
import * as L from 'leaflet';

import MapControlButton from './MapControlButton';
import useGeolocation from './useGeolocation';

const MAX_VISIBLE_ACCURACY = 1000;

const userLocationIcon = L.divIcon({
  className: '',
  iconSize: [42, 42],
  iconAnchor: [21, 21],
  popupAnchor: [0, -22],
  html: `
    <div style="
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 42px;
      height: 42px;
    ">
      <div style="
        position: absolute;
        width: 36px;
        height: 36px;
        border-radius: 9999px;
        background: rgba(59, 130, 246, 0.3);
        animation: location-pulse 1.8s ease-out infinite;
      "></div>

      <div style="
        position: relative;
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
        border: 3px solid white;
        border-radius: 9999px;
        background: #2563eb;
        box-shadow:
          0 0 0 3px rgba(37, 99, 235, 0.45),
          0 4px 12px rgba(15, 23, 42, 0.4);
      ">
        <span style="
          width: 5px;
          height: 5px;
          border-radius: 9999px;
          background: #dbeafe;
        "></span>
      </div>
    </div>
  `,
});

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <path d="M5 12h14" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-[18px] w-[18px]"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3" />
      <path d="M12 19v3" />
      <path d="M2 12h3" />
      <path d="M19 12h3" />
    </svg>
  );
}

function LoadingIcon() {
  return (
    <span
      aria-hidden="true"
      className="
        h-4 w-4 animate-spin rounded-full
        border-2 border-blue-200 border-t-blue-600
      "
    />
  );
}

export default function MapControls() {
  const map = useMap();

  const {
    position,
    accuracy,
    status,
    errorMessage,
    isCentering,
    locateUser,
  } = useGeolocation();

  const [zoom, setZoom] = useState(map.getZoom());

  useEffect(() => {
    const handleZoomEnd = () => {
      setZoom(map.getZoom());
    };

    map.on('zoomend', handleZoomEnd);

    return () => {
      map.off('zoomend', handleZoomEnd);
    };
  }, [map]);

  const canZoomIn =
    zoom < map.getMaxZoom();

  const canZoomOut =
    zoom > map.getMinZoom();

  const shouldShowAccuracyCircle =
    position !== null &&
    accuracy !== null &&
    accuracy <= MAX_VISIBLE_ACCURACY &&
    !isCentering;

  return (
    <>
      <div
        className="
          pointer-events-none absolute left-2 top-5 z-[1000]
          flex flex-col gap-1.5
        "
      >
        <MapControlButton
          aria-label="Acercar mapa"
          title="Acercar mapa"
          disabled={!canZoomIn}
          onClick={() => map.zoomIn()}
          className="pointer-events-auto"
        >
          <PlusIcon />
        </MapControlButton>

        <MapControlButton
          aria-label="Alejar mapa"
          title="Alejar mapa"
          disabled={!canZoomOut}
          onClick={() => map.zoomOut()}
          className="pointer-events-auto"
        >
          <MinusIcon />
        </MapControlButton>

        <div className="group relative pointer-events-auto">
          <MapControlButton
            aria-label="Centrar mapa en mi ubicación"
            title="Centrar mapa en mi ubicación"
            aria-busy={status === 'loading'}
            disabled={status === 'loading'}
            active={status === 'success'}
            onClick={locateUser}
          >
            {status === 'loading' ? (
              <LoadingIcon />
            ) : (
              <LocationIcon />
            )}

            {status === 'success' && (
              <span
                aria-hidden="true"
                className="
                  absolute right-0.5 top-0.5 z-20
                  h-2 w-2 rounded-full
                  border border-white bg-emerald-500
                "
              />
            )}
          </MapControlButton>

          <span
            className="
              pointer-events-none absolute left-[calc(100%+10px)]
              top-1/2 z-[1000] hidden -translate-y-1/2
              whitespace-nowrap rounded-xl
              border border-white/10 bg-slate-950/90
              px-3 py-2 text-xs font-medium text-white
              opacity-0 shadow-xl backdrop-blur-xl
              transition-all duration-200
              group-hover:block group-hover:opacity-100
            "
          >
            {status === 'loading'
              ? 'Obteniendo ubicación…'
              : status === 'success'
                ? 'Volver a mi ubicación'
                : 'Centrar en mi ubicación'}
          </span>
        </div>
      </div>

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
          {shouldShowAccuracyCircle && (
            <Circle
              center={position}
              radius={accuracy}
              pathOptions={{
                color: '#60a5fa',
                fillColor: '#3b82f6',
                fillOpacity: 0.08,
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
                  <strong>📍 Tu ubicación actual</strong>
                </div>

                <p className="text-xs text-slate-600">
                  <strong>Latitud:</strong>{' '}
                  {position[0].toFixed(5)}
                </p>

                <p className="text-xs text-slate-600">
                  <strong>Longitud:</strong>{' '}
                  {position[1].toFixed(5)}
                </p>

                {accuracy !== null && (
                  <p className="mt-1 text-xs text-slate-600">
                    <strong>Precisión:</strong>{' '}
                    aproximadamente {Math.round(accuracy)} m
                  </p>
                )}

                {accuracy !== null &&
                  accuracy > MAX_VISIBLE_ACCURACY && (
                    <p className="mt-2 text-xs text-amber-600">
                      La precisión actual es baja, por eso no se muestra
                      el área de precisión en el mapa.
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