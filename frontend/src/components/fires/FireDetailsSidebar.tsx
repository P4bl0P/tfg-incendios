import type {
  FireFeature,
  ReverseGeocodingResult,
} from './fireTypes';

interface FireDetailsSidebarProps {
  feature: FireFeature;
  location: ReverseGeocodingResult | null;
  locationLoading: boolean;
  locationError: string | null;
  onClose: () => void;
}

export default function FireDetailsSidebar({
  feature,
  location,
  locationLoading,
  locationError,
  onClose,
}: FireDetailsSidebarProps) {
  const {
    estado,
    origen,
    intensidad_frp,
    fecha_deteccion,
  } = feature.properties;

  const [longitude, latitude] =
    feature.geometry.coordinates;

  const isSatellite = origen === 'satelite';

  return (
    <aside
      aria-label="Detalle del foco seleccionado"
      className="
        pointer-events-auto absolute
        bottom-5 right-4 z-[1000]
        w-[min(360px,calc(100%-2rem))]
        max-h-[calc(100vh-6rem)]
        overflow-y-auto
        rounded-3xl
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
              rounded-xl bg-orange-50 text-orange-600
            "
          >
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
              <path d="M12 3s5 5.2 5 10a5 5 0 1 1-10 0c0-2.8 2-5.7 5-10Z" />
              <path d="M12 12c1.2 1.2 1.8 2.3 1.8 3.3a1.8 1.8 0 1 1-3.6 0c0-.9.6-2 1.8-3.3Z" />
            </svg>
          </span>

          <div>
            <p className="text-xs font-bold text-slate-800">
              Detalle del foco
            </p>

            <p className="text-[10px] text-slate-400">
              Información de la detección seleccionada
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar detalle del foco"
          title="Cerrar"
          className="
            rounded-xl p-2 text-slate-400
            transition-colors
            hover:bg-slate-100
            hover:text-orange-600
          "
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="h-4 w-4"
          >
            <path d="M6 6l12 12" />
            <path d="M18 6 6 18" />
          </svg>
        </button>
      </div>

      <div className="px-4 py-4">
        <div className="mb-4">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            Ubicación
          </p>

          {locationLoading && (
            <p className="mt-1 text-sm text-slate-500">
              Consultando municipio...
            </p>
          )}

          {locationError && (
            <p className="mt-1 text-sm text-red-600">
              {locationError}
            </p>
          )}

          {!locationLoading && !locationError && location && (
            <div className="mt-1">
              <p className="text-sm font-bold text-slate-800">
                {location.municipio ?? 'Municipio desconocido'}
              </p>

              <p className="text-xs text-slate-500">
                {location.provincia ?? 'Provincia desconocida'}
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-2xl bg-slate-50 px-3 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Origen
            </p>

            <p className="mt-1 text-sm font-bold text-slate-800">
              {isSatellite ? 'Satélite' : 'Manual'}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 px-3 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              {isSatellite ? 'FRP' : 'Estado'}
            </p>

            <p className="mt-1 text-sm font-bold text-orange-600">
              {isSatellite
                ? intensidad_frp != null
                  ? `${intensidad_frp} MW`
                  : 'Sin datos'
                : estado ?? 'Desconocido'}
            </p>
          </div>
        </div>

        <div className="mt-2 rounded-2xl bg-slate-50 px-3 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            Coordenadas
          </p>

          <p className="mt-1 font-mono text-xs text-slate-700">
            {latitude.toFixed(5)}, {longitude.toFixed(5)}
          </p>
        </div>

        {fecha_deteccion && (
          <div className="mt-2 rounded-2xl bg-slate-50 px-3 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Fecha de detección
            </p>

            <p className="mt-1 text-xs text-slate-700">
              {new Date(fecha_deteccion).toLocaleString(
                'es-ES',
              )}
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}