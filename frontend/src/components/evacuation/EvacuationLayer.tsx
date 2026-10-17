import {
  Marker,
  Polyline,
  Popup,
} from 'react-leaflet';
import * as L from 'leaflet';

import type {
  EvacuationRouteFeature,
  MeetingPointFeature,
  ReliabilityLevel,
} from './evacuationTypes';

interface EvacuationLayerProps {
  enabled: boolean;
  routes: EvacuationRouteFeature[];
  meetingPoints: MeetingPointFeature[];
  loading: boolean;
  error: string | null;
}

const reliabilityLabels: Record<
  ReliabilityLevel,
  {
    label: string;
    color: string;
    description: string;
  }
> = {
  muy_alta: {
    label: 'Muy alta',
    color: '#15803d',
    description:
      'Fuente oficial municipal o plan de emergencia vigente.',
  },
  alta: {
    label: 'Alta',
    color: '#2563eb',
    description:
      'Fuente oficial autonómica o plan de autoprotección.',
  },
  media: {
    label: 'Media',
    color: '#d97706',
    description:
      'Cartografía oficial o dato pendiente de validación específica.',
  },
  baja: {
    label: 'Baja',
    color: '#dc2626',
    description:
      'Fuente colaborativa sin validación oficial.',
  },
  informativa: {
    label: 'Informativa',
    color: '#64748b',
    description:
      'Dato auxiliar o ruta calculada. No es una instrucción oficial.',
  },
};

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

function formatSource(source: string): string {
  const labels: Record<string, string> = {
    plan_municipal: 'Plan municipal',
    plan_autoproteccion: 'Plan de autoprotección',
    junta_andalucia: 'Junta de Andalucía',
    dera: 'DERA / IDEAndalucía',
    openstreetmap: 'OpenStreetMap',
    calculada: 'Ruta calculada',
  };

  return labels[source] ?? source;
}

function formatPointType(type: string): string {
  const labels: Record<string, string> = {
    evacuacion_ciudadana: 'Evacuación ciudadana',
    autoproteccion: 'Autoprotección',
    recurso_infoca: 'Recurso INFOCA',
    assembly_point_osm:
      'Punto de encuentro de OpenStreetMap',
    informativo: 'Punto informativo',
  };

  return labels[type] ?? type;
}

function formatStatus(status: string): string {
  const labels: Record<string, string> = {
    vigente: 'Vigente',
    temporal: 'Temporal',
    pendiente_validacion: 'Pendiente de validación',
    informativa: 'Informativa',
  };

  return labels[status] ?? status;
}

function ReliabilityBadge({
  level,
}: {
  level: ReliabilityLevel;
}) {
  const metadata = reliabilityLabels[level];

  return (
    <div
      className="
        mt-3 rounded-2xl bg-slate-50 px-3 py-3
      "
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
          Fiabilidad
        </span>

        <span
          className="
            rounded-full px-2 py-1
            text-[10px] font-bold text-white
          "
          style={{
            backgroundColor: metadata.color,
          }}
        >
          {metadata.label}
        </span>
      </div>

      <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
        {metadata.description}
      </p>
    </div>
  );
}

function SourceLink({
  url,
}: {
  url: string | null;
}) {
  if (!url) {
    return null;
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="
        mt-3 inline-block text-xs font-semibold
        text-blue-600 underline
        transition-colors hover:text-blue-800
      "
    >
      Consultar fuente
    </a>
  );
}

function EvacuationLoadingMessage() {
  return (
    <div
      className="
        pointer-events-none absolute
        right-4 top-20 z-[1000]
        rounded-3xl border border-white/70
        bg-white/90 px-4 py-4
        text-xs font-medium text-slate-600
        shadow-[0_16px_40px_rgba(15,23,42,0.24)]
        backdrop-blur-xl
      "
    >
      Cargando información de evacuación…
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
        right-4 top-20 z-[1000]
        w-[min(320px,calc(100%-2rem))]
        rounded-3xl border border-red-200
        bg-white/95 px-4 py-4
        text-xs text-red-700
        shadow-[0_16px_40px_rgba(15,23,42,0.24)]
        backdrop-blur-xl
      "
    >
      <p>{error}</p>
    </div>
  );
}

function RoutePopup({
  route,
}: {
  route: EvacuationRouteFeature;
}) {
  return (
    <Popup>
      <div className="min-w-[240px] font-sans text-sm text-slate-800">
        <div className="mb-3 flex items-center gap-2">
          <span
            className="
              flex h-8 w-8 items-center justify-center
              rounded-xl bg-emerald-50 text-emerald-600
            "
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M4 19h16" />
              <path d="M6 19V7l6-3 6 3v12" />
              <path d="M9 19v-5h6v5" />
              <path d="M12 9v3" />
              <path d="m10.5 10.5 1.5 1.5 1.5-1.5" />
            </svg>
          </span>

          <div>
            <p className="text-xs font-bold text-slate-800">
              {route.properties.nombre}
            </p>

            <p className="text-[10px] text-slate-400">
              Ruta de evacuación
            </p>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-xs text-slate-600">
            <strong>Municipio:</strong>{' '}
            {route.properties.municipio}
          </p>

          <p className="text-xs text-slate-600">
            <strong>Emergencia:</strong>{' '}
            {route.properties.tipoEmergencia}
          </p>

          <p className="text-xs text-slate-600">
            <strong>Estado:</strong>{' '}
            {formatStatus(route.properties.estado)}
          </p>

          <p className="text-xs text-slate-600">
            <strong>Fuente:</strong>{' '}
            {formatSource(route.properties.fuente)}
          </p>

          {route.properties.organismo && (
            <p className="text-xs text-slate-600">
              <strong>Organismo:</strong>{' '}
              {route.properties.organismo}
            </p>
          )}

          {route.properties.fechaVerificacion && (
            <p className="text-xs text-slate-600">
              <strong>Verificada:</strong>{' '}
              {route.properties.fechaVerificacion}
            </p>
          )}
        </div>

        {route.properties.observaciones && (
          <p className="mt-3 text-xs leading-relaxed text-slate-500">
            {route.properties.observaciones}
          </p>
        )}

        <SourceLink url={route.properties.urlFuente} />

        <ReliabilityBadge
          level={route.properties.fiabilidad}
        />
      </div>
    </Popup>
  );
}

function MeetingPointPopup({
  point,
}: {
  point: MeetingPointFeature;
}) {
  return (
    <Popup>
      <div className="min-w-[240px] font-sans text-sm text-slate-800">
        <div className="mb-3 flex items-center gap-2">
          <span
            className="
              flex h-8 w-8 items-center justify-center
              rounded-xl bg-teal-50 text-teal-700
            "
            aria-hidden="true"
          >
            ⛑
          </span>

          <div>
            <p className="text-xs font-bold text-slate-800">
              {point.properties.nombre}
            </p>

            <p className="text-[10px] text-slate-400">
              Punto de encuentro
            </p>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-xs text-slate-600">
            <strong>Municipio:</strong>{' '}
            {point.properties.municipio}
          </p>

          <p className="text-xs text-slate-600">
            <strong>Tipo:</strong>{' '}
            {formatPointType(point.properties.tipoPunto)}
          </p>

          <p className="text-xs text-slate-600">
            <strong>Capacidad:</strong>{' '}
            {point.properties.capacidad !== null
              ? `${point.properties.capacidad} personas`
              : 'No disponible'}
          </p>

          <p className="text-xs text-slate-600">
            <strong>Fuente:</strong>{' '}
            {formatSource(point.properties.fuente)}
          </p>

          {point.properties.organismo && (
            <p className="text-xs text-slate-600">
              <strong>Organismo:</strong>{' '}
              {point.properties.organismo}
            </p>
          )}

          {point.properties.fechaVerificacion && (
            <p className="text-xs text-slate-600">
              <strong>Verificado:</strong>{' '}
              {point.properties.fechaVerificacion}
            </p>
          )}
        </div>

        {point.properties.observaciones && (
          <p className="mt-3 text-xs leading-relaxed text-slate-500">
            {point.properties.observaciones}
          </p>
        )}

        <SourceLink url={point.properties.urlFuente} />

        <ReliabilityBadge
          level={point.properties.fiabilidad}
        />
      </div>
    </Popup>
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
          <RoutePopup route={route} />
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
            <MeetingPointPopup point={point} />
          </Marker>
        );
      })}
    </>
  );
}