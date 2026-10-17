import { Marker, Polyline, Popup } from 'react-leaflet';
import * as L from 'leaflet';

import type {
  EvacuationRouteFeature,
  MeetingPointFeature,
} from './evacuationTypes';

interface EvacuationLayerProps {
  enabled: boolean;
  routes: EvacuationRouteFeature[];
  meetingPoints: MeetingPointFeature[];
  loading: boolean;
  error: string | null;
}

function createMeetingPointIcon() {
  return L.divIcon({
    className: '',
    iconSize: [42, 42],
    iconAnchor: [21, 21],
    popupAnchor: [0, -22],
    html: `
      <div
        role="img"
        aria-label="Punto de encuentro"
        style="
          display: flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          border: 3px solid #ffffff;
          border-radius: 9999px;
          background: #0f766e;
          color: #ffffff;
          font-size: 22px;
          box-shadow:
            0 0 0 4px rgba(15, 118, 110, 0.28),
            0 5px 14px rgba(15, 23, 42, 0.35);
        "
      >
        ⛑
      </div>
    `,
  });
}

function EvacuationLegend() {
  return (
    <div
      aria-label="Leyenda de rutas de evacuación"
      className="
        pointer-events-auto absolute
        bottom-5 right-4 z-[1000]
        w-[min(270px,calc(100%-2rem))]
        rounded-3xl border border-white/70
        bg-white/90 px-4 py-3
        shadow-[0_16px_40px_rgba(15,23,42,0.24)]
        backdrop-blur-xl
      "
    >
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-bold text-slate-800">
          Rutas de evacuación
        </p>

        <span
          className="
            rounded-full bg-emerald-50 px-2 py-1
            text-[9px] font-bold uppercase
            tracking-wide text-emerald-700
          "
        >
          Activa
        </span>
      </div>

      <div className="flex items-center gap-2 text-[11px] text-slate-600">
        <span
          className="h-1.5 w-8 rounded-full bg-emerald-600"
          aria-hidden="true"
        />

        Ruta de evacuación
      </div>

      <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-600">
        <span
          className="
            flex h-6 w-6 items-center justify-center
            rounded-full bg-teal-700 text-xs text-white
          "
          aria-hidden="true"
        >
          ⛑
        </span>

        Punto de encuentro
      </div>

      <p className="mt-3 text-[10px] leading-relaxed text-slate-400">
        Consulta siempre las indicaciones de los servicios de emergencia.
      </p>
    </div>
  );
}

function EvacuationLoadingMessage() {
  return (
    <div
      className="
        pointer-events-none absolute
        bottom-5 right-4 z-[1000]
        rounded-3xl border border-white/70
        bg-white/90 px-4 py-3
        text-xs font-medium text-slate-600
        shadow-[0_16px_40px_rgba(15,23,42,0.24)]
        backdrop-blur-xl
      "
    >
      Cargando rutas de evacuación…
    </div>
  );
}

function EvacuationErrorMessage({
  error,
}: {
  error: string;
}) {
  return (
    <div
      role="alert"
      className="
        pointer-events-auto absolute
        bottom-5 right-4 z-[1000]
        w-[min(320px,calc(100%-2rem))]
        rounded-3xl border border-red-200
        bg-white/95 px-4 py-3
        text-xs text-red-700
        shadow-[0_16px_40px_rgba(15,23,42,0.24)]
        backdrop-blur-xl
      "
    >
      {error}
    </div>
  );
}

export default function EvacuationLayer({
  enabled,
  routes,
  meetingPoints,
  loading,
  error,
}: EvacuationLayerProps) {
  if (!enabled) {
    return null;
  }

  if (loading) {
    return <EvacuationLoadingMessage />;
  }

  if (error) {
    return <EvacuationErrorMessage error={error} />;
  }

  return (
    <>
      {routes.map((route) => (
        <Polyline
          key={`route-${route.properties.id}`}
          positions={route.geometry.coordinates.map(
            ([longitude, latitude]) => [
              latitude,
              longitude,
            ],
          )}
          pathOptions={{
            color: route.properties.color || '#16a34a',
            weight: 6,
            opacity: 0.9,
            lineCap: 'round',
            lineJoin: 'round',
          }}
        >
          <Popup>
            <div className="min-w-[190px] font-sans text-sm text-slate-800">
              <p className="font-bold">
                {route.properties.nombre}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Ruta de evacuación
              </p>
            </div>
          </Popup>
        </Polyline>
      ))}

      {meetingPoints.map((point) => {
        const [longitude, latitude] =
          point.geometry.coordinates;

        return (
          <Marker
            key={`meeting-point-${point.properties.id}`}
            position={[latitude, longitude]}
            icon={createMeetingPointIcon()}
          >
            <Popup>
              <div className="min-w-[210px] font-sans text-sm text-slate-800">
                <div className="mb-2 flex items-center gap-2">
                  <span
                    className="
                      flex h-7 w-7 items-center justify-center
                      rounded-lg bg-teal-50 text-teal-700
                    "
                    aria-hidden="true"
                  >
                    ⛑
                  </span>

                  <strong>
                    {point.properties.nombre}
                  </strong>
                </div>

                <p className="text-xs text-slate-600">
                  <strong>Tipo:</strong> Punto de encuentro
                </p>

                {point.properties.capacidad !== null ? (
                  <p className="mt-1 text-xs text-slate-600">
                    <strong>Capacidad:</strong>{' '}
                    {point.properties.capacidad} personas
                  </p>
                ) : (
                  <p className="mt-1 text-xs text-slate-500">
                    Capacidad no disponible
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        );
      })}

      <EvacuationLegend />
    </>
  );
}