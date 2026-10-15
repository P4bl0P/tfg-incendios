import { Marker, Popup } from 'react-leaflet';
import * as L from 'leaflet';

import useWindGrid from './useWindGrid';
import type { WindGridPoint } from './weatherTypes';

interface WindGridLayerProps {
  enabled: boolean;
}

function getDirectionTo(
  directionFrom: number | null,
): number {
  if (directionFrom === null) {
    return 0;
  }

  return (directionFrom + 180) % 360;
}

function getDirectionLabel(
  degrees: number | null,
): string {
  if (degrees === null) {
    return 'Sin datos';
  }

  const directions = [
    'N',
    'NNE',
    'NE',
    'ENE',
    'E',
    'ESE',
    'SE',
    'SSE',
    'S',
    'SSO',
    'SO',
    'OSO',
    'O',
    'ONO',
    'NO',
    'NNO',
  ];

  const normalizedDegrees =
    ((degrees % 360) + 360) % 360;

  const index = Math.round(
    normalizedDegrees / 22.5,
  ) % 16;

  return directions[index];
}

function getWindColor(
  speed: number | null,
): string {
  if (speed === null) {
    return '#94a3b8';
  }

  if (speed < 10) {
    return '#38bdf8';
  }

  if (speed < 20) {
    return '#22d3ee';
  }

  if (speed < 30) {
    return '#facc15';
  }

  if (speed < 45) {
    return '#f97316';
  }

  return '#ef4444';
}

function createWindIcon(
  point: WindGridPoint,
): L.DivIcon {
  const directionTo = getDirectionTo(
    point.windDirection,
  );

  const color = getWindColor(
    point.windSpeed,
  );

  const speedScale =
    point.windSpeed === null
      ? 1
      : Math.min(
          1.35,
          Math.max(
            0.85,
            0.85 + point.windSpeed / 100,
          ),
        );

  return L.divIcon({
    className: '',
    iconSize: [42, 42],
    iconAnchor: [21, 21],
    popupAnchor: [0, -22],
    html: `
      <div
        style="
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        "
      >
        <span
          style="
            display: block;
            color: ${color};
            font-family: Arial, sans-serif;
            font-size: 30px;
            font-weight: 900;
            line-height: 1;
            text-shadow:
              0 1px 3px rgba(15, 23, 42, 0.5);
            transform:
              rotate(${directionTo}deg)
              scale(${speedScale});
            transition:
              transform 500ms ease,
              color 300ms ease;
          "
        >
          ➜
        </span>
      </div>
    `,
  });
}

function formatSpeed(
  speed: number | null,
): string {
  if (speed === null) {
    return 'Sin datos';
  }

  return `${speed.toFixed(1)} km/h`;
}

function formatTemperature(
  temperature: number | null,
): string {
  if (temperature === null) {
    return 'Sin datos';
  }

  return `${temperature.toFixed(1)} °C`;
}

function formatObservedAt(
  observedAt: string,
): string {
  const date = new Date(observedAt);

  if (Number.isNaN(date.getTime())) {
    return 'Hora no disponible';
  }

  return new Intl.DateTimeFormat('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export default function WindGridLayer({
  enabled,
}: WindGridLayerProps) {
  const {
    points,
    loading,
    error,
    lastUpdated,
    refresh,
  } = useWindGrid({
    enabled,
  });

  if (!enabled) {
    return null;
  }

  if (loading && points.length === 0) {
    return (
      <div
        className="
          pointer-events-none absolute
          bottom-5 left-1/2 z-[1000]
          -translate-x-1/2
          rounded-2xl border border-white/70
          bg-white/90 px-4 py-3
          text-xs font-medium text-slate-600
          shadow-xl backdrop-blur-xl
        "
      >
        Cargando condiciones del viento…
      </div>
    );
  }

  if (error && points.length === 0) {
    return (
      <div
        role="alert"
        className="
          pointer-events-auto absolute
          bottom-5 left-1/2 z-[1000]
          flex -translate-x-1/2
          items-center gap-3
          rounded-2xl border border-red-200
          bg-white/95 px-4 py-3
          text-xs text-red-700
          shadow-xl backdrop-blur-xl
        "
      >
        <span>{error}</span>

        <button
          type="button"
          onClick={refresh}
          className="
            rounded-lg bg-red-50 px-2.5 py-1.5
            font-semibold text-red-700
            hover:bg-red-100
          "
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <>
      {points.map((point) => (
        <Marker
          key={`${point.latitude}-${point.longitude}`}
          position={[
            point.latitude,
            point.longitude,
          ]}
          icon={createWindIcon(point)}
          zIndexOffset={-50}
        >
          <Popup>
            <div className="min-w-[210px] font-sans text-sm text-slate-800">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-xl">
                  🌬️
                </span>

                <strong>Condiciones del viento</strong>
              </div>

              <p className="mb-1">
                <strong>Dirección:</strong>{' '}
                {getDirectionLabel(
                  getDirectionTo(
                    point.windDirection,
                  ),
                )}
              </p>

              <p className="mb-1">
                <strong>Velocidad:</strong>{' '}
                {formatSpeed(point.windSpeed)}
              </p>

              <p className="mb-1">
                <strong>Temperatura:</strong>{' '}
                {formatTemperature(
                  point.temperature,
                )}
              </p>

              {point.windGusts !== null && (
                <p className="mb-1">
                  <strong>Ráfagas:</strong>{' '}
                  {formatSpeed(point.windGusts)}
                </p>
              )}

              <p className="mt-2 text-xs text-slate-400">
                Observado a las{' '}
                {formatObservedAt(
                  point.observedAt,
                )}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}