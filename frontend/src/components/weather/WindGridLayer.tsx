import { useState } from 'react';
import { Marker } from 'react-leaflet';
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

  const index =
    Math.round(normalizedDegrees / 22.5) % 16;

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
          1.2,
          Math.max(
            0.85,
            0.85 + point.windSpeed / 120,
          ),
        );

  const animationDelay =
    ((Math.abs(point.latitude * 13) +
      Math.abs(point.longitude * 17)) %
      1200) /
    1000;

  return L.divIcon({
    className: '',
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    html: `
      <div
        style="
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: auto;
          transform:
            rotate(${directionTo}deg)
            scale(${speedScale});
          transform-origin: center;
          filter:
            drop-shadow(0 1px 2px rgba(15, 23, 42, 0.35));
        "
      >
        <div
          class="wind-arrow-flow"
          style="
            display: flex;
            align-items: center;
            justify-content: center;
            width: 38px;
            height: 38px;
            animation-delay: -${animationDelay}s;
          "
        >
          <svg
            width="38"
            height="38"
            viewBox="0 0 38 38"
            aria-hidden="true"
            style="
              overflow: visible;
              display: block;
            "
          >
            <line
              x1="7"
              y1="19"
              x2="29"
              y2="19"
              stroke="${color}"
              stroke-width="2.2"
              stroke-linecap="round"
            />

            <polyline
              points="22,12 29,19 22,26"
              fill="none"
              stroke="${color}"
              stroke-width="2.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
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

function WindIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-4 w-4"
    >
      <path d="M3 8h11a3 3 0 1 0-3-3" />
      <path d="M3 12h15a3 3 0 1 1-3 3" />
      <path d="M3 16h8a3 3 0 1 0-3 3" />
    </svg>
  );
}

function RefreshIcon({
  loading,
}: {
  loading: boolean;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={[
        'h-4 w-4',
        loading ? 'animate-spin' : '',
      ].join(' ')}
    >
      <path d="M20 11a8.1 8.1 0 0 0-15.5-2" />
      <path d="M4 4v5h5" />
      <path d="M4 13a8.1 8.1 0 0 0 15.5 2" />
      <path d="M20 20v-5h-5" />
    </svg>
  );
}

function WindLegend() {
  const items = [
    {
      color: '#38bdf8',
      range: '< 10',
      meaning: 'Flojo',
    },
    {
      color: '#22d3ee',
      range: '10–20',
      meaning: 'Moderado',
    },
    {
      color: '#facc15',
      range: '20–30',
      meaning: 'Fuerte',
    },
    {
      color: '#f97316',
      range: '30–45',
      meaning: 'Muy fuerte',
    },
    {
      color: '#ef4444',
      range: '≥ 45',
      meaning: 'Extremo',
    },
  ];

  return (
    <div className="border-b border-slate-200/80 px-3 py-2.5">
      <p className="mb-2 text-center text-[9px] font-bold uppercase tracking-wide text-slate-400">
        Intensidad del viento · km/h
      </p>

      <div className="grid grid-cols-5 gap-1">
        {items.map((item) => (
          <div
            key={item.range}
            className="min-w-0 text-center"
          >
            <span
              className="
                mx-auto block h-2 w-full
                rounded-full ring-1 ring-black/5
              "
              style={{
                backgroundColor: item.color,
              }}
              aria-label={`${item.range} km/h: ${item.meaning}`}
              title={`${item.range} km/h: ${item.meaning}`}
            />

            <p className="mt-1 truncate text-[9px] font-bold text-slate-700">
              {item.range}
            </p>

            <p className="truncate text-[8px] leading-tight text-slate-500">
              {item.meaning}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-2 text-center text-[9px] leading-tight text-slate-400">
        La flecha indica la dirección del viento.
      </p>
    </div>
  );
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

  const [
    selectedPoint,
    setSelectedPoint,
  ] = useState<WindGridPoint | null>(null);

  if (!enabled) {
    return null;
  }

  if (loading && points.length === 0) {
    return (
      <div
        className="
          pointer-events-none absolute
          bottom-5 left-4 z-[1000]
          w-[min(360px,calc(100%-2rem))]
          rounded-3xl border border-white/70
          bg-white/90 px-4 py-4
          text-xs font-medium text-slate-600
          shadow-[0_16px_40px_rgba(15,23,42,0.24)]
          backdrop-blur-xl
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
          bottom-5 left-4 z-[1000]
          w-[min(360px,calc(100%-2rem))]
          rounded-3xl border border-red-200
          bg-white/95 px-4 py-4
          text-xs text-red-700
          shadow-[0_16px_40px_rgba(15,23,42,0.24)]
          backdrop-blur-xl
        "
      >
        <p>{error}</p>

        <button
          type="button"
          onClick={refresh}
          className="
            mt-3 rounded-xl bg-red-50 px-3 py-2
            font-semibold text-red-700
            transition-colors hover:bg-red-100
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
          eventHandlers={{
            click: () => {
              setSelectedPoint(point);
            },
          }}
        />
      ))}

      <div
        className="
          pointer-events-auto absolute
          bottom-5 left-4 z-[1000]
          w-[min(360px,calc(100%-2rem))]
          overflow-hidden rounded-3xl
          border border-white/70
          bg-white/90
          shadow-[0_16px_40px_rgba(15,23,42,0.24)]
          backdrop-blur-xl
        "
      >
        <div
          className="
            flex items-center justify-between
            border-b border-slate-200/80
            px-4 py-3
          "
        >
          <div className="flex items-center gap-2">
            <span
              className="
                flex h-8 w-8 items-center justify-center
                rounded-xl bg-cyan-50 text-cyan-600
              "
            >
              <WindIcon />
            </span>

            <div>
              <p className="text-xs font-bold text-slate-800">
                Capa de viento
              </p>

              <p className="text-[10px] text-slate-400">
                Pulsa una flecha para consultar sus datos
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={refresh}
            disabled={loading}
            aria-label="Actualizar capa de viento"
            title="Actualizar capa de viento"
            className="
              rounded-xl p-2 text-slate-400
              transition-colors hover:bg-slate-100
              hover:text-cyan-600
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <RefreshIcon loading={loading} />
          </button>
        </div>

        <WindLegend />

        {selectedPoint ? (
          <div className="px-4 py-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                  Punto seleccionado
                </p>

                <p className="mt-1 text-sm font-bold text-slate-800">
                  {selectedPoint.latitude.toFixed(2)}° N,{' '}
                  {selectedPoint.longitude.toFixed(2)}° O
                </p>
              </div>

              <span
                className="text-3xl"
                style={{
                  color: getWindColor(
                    selectedPoint.windSpeed,
                  ),
                }}
              >
                ➜
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-2xl bg-slate-50 px-3 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                  Dirección
                </p>

                <p className="mt-1 text-sm font-bold text-slate-800">
                  {getDirectionLabel(
                    getDirectionTo(
                      selectedPoint.windDirection,
                    ),
                  )}
                </p>

                <p className="mt-1 text-[11px] text-slate-500">
                  Hacia{' '}
                  {getDirectionTo(
                    selectedPoint.windDirection,
                  ).toFixed(0)}
                  °
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 px-3 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                  Velocidad
                </p>

                <p className="mt-1 text-sm font-bold text-slate-800">
                  {formatSpeed(
                    selectedPoint.windSpeed,
                  )}
                </p>

                <p className="mt-1 text-[11px] text-slate-500">
                  Viento actual
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 px-3 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                  Temperatura
                </p>

                <p className="mt-1 text-sm font-bold text-slate-800">
                  {formatTemperature(
                    selectedPoint.temperature,
                  )}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 px-3 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                  Ráfagas
                </p>

                <p className="mt-1 text-sm font-bold text-slate-800">
                  {formatSpeed(
                    selectedPoint.windGusts,
                  )}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <p className="text-[10px] text-slate-400">
                Observado a las{' '}
                {formatObservedAt(
                  selectedPoint.observedAt,
                )}
              </p>

              <button
                type="button"
                onClick={() => {
                  setSelectedPoint(null);
                }}
                className="
                  text-[11px] font-semibold
                  text-cyan-700 hover:text-cyan-900
                "
              >
                Cerrar
              </button>
            </div>
          </div>
        ) : (
          <div className="px-4 py-4">
            <p className="text-xs leading-relaxed text-slate-500">
              Selecciona una flecha del mapa para consultar
              la dirección, velocidad, temperatura y ráfagas
              de ese punto.
            </p>

            {lastUpdated && (
              <p className="mt-3 text-[10px] text-slate-400">
                Última actualización:{' '}
                {lastUpdated.toLocaleTimeString('es-ES', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            )}
          </div>
        )}

        {error && points.length > 0 && (
          <div className="border-t border-amber-200 bg-amber-50 px-4 py-2">
            <p className="text-[10px] text-amber-700">
              No se han podido actualizar todos los datos.
            </p>
          </div>
        )}
      </div>
    </>
  );
}