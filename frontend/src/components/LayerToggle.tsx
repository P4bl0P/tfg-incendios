import type { Dispatch, SetStateAction } from 'react';

export type LayerType = 'dark' | 'satellite';

interface LayerToggleProps {
  activeLayer: LayerType;
  setLayer: Dispatch<SetStateAction<LayerType>>;
}

function TerrainIcon() {
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
      <path d="M3 19h18L14 8l-4 5-2-2-5 8Z" />
      <path d="m14 8 2-3 5 7" />
    </svg>
  );
}

function SatelliteIcon() {
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
      <circle cx="12" cy="12" r="3" />
      <path d="M5.64 5.64a9 9 0 0 0 0 12.72" />
      <path d="M18.36 5.64a9 9 0 0 1 0 12.72" />
      <path d="M2.81 2.81a13 13 0 0 0 0 18.38" />
      <path d="M21.19 2.81a13 13 0 0 1 0 18.38" />
    </svg>
  );
}

export default function LayerToggle({
  activeLayer,
  setLayer,
}: LayerToggleProps) {
  const isSatellite = activeLayer === 'satellite';

  return (
    <div
      role="group"
      aria-label="Capa base del mapa"
      className="
        absolute right-4 top-4 z-[1000]
        flex h-9 w-[150px] items-center
        overflow-hidden rounded-xl
        border border-white/80
        bg-white/95 p-1
        shadow-[0_4px_12px_rgba(15,23,42,0.2)]
        backdrop-blur-xl
        sm:right-4 sm:top-4
      "
    >
      {/* Indicador animado de la opción activa */}
      <span
        aria-hidden="true"
        className={[
          'pointer-events-none absolute inset-y-1 left-1',
          'w-[calc(50%-4px)] rounded-lg',
          'bg-blue-50 text-blue-600',
          'shadow-[0_2px_8px_rgba(37,99,235,0.18)]',
          'transition-transform duration-300 ease-out',
          isSatellite ? 'translate-x-full' : 'translate-x-0',
        ].join(' ')}
      />

      <button
        type="button"
        aria-pressed={!isSatellite}
        aria-label="Usar mapa de relieve"
        onClick={() => setLayer('dark')}
        className={[
          'relative z-10 flex h-full w-1/2 items-center',
          'justify-center gap-1',
          'rounded-lg px-1',
          'text-[11px] font-semibold',
          'transition-all duration-200 ease-out',
          'hover:-translate-y-0.5',
          'focus:outline-none focus-visible:ring-2',
          'focus-visible:ring-blue-400/60',
          !isSatellite
            ? 'text-blue-600'
            : 'text-slate-500 hover:text-blue-600',
        ].join(' ')}
      >
        <TerrainIcon />
        <span>Relieve</span>
      </button>

      <button
        type="button"
        aria-pressed={isSatellite}
        aria-label="Usar mapa satélite"
        onClick={() => setLayer('satellite')}
        className={[
          'relative z-10 flex h-full w-1/2 items-center',
          'justify-center gap-1',
          'rounded-lg px-1',
          'text-[11px] font-semibold',
          'transition-all duration-200 ease-out',
          'hover:-translate-y-0.5',
          'focus:outline-none focus-visible:ring-2',
          'focus-visible:ring-blue-400/60',
          isSatellite
            ? 'text-blue-600'
            : 'text-slate-500 hover:text-blue-600',
        ].join(' ')}
      >
        <SatelliteIcon />
        <span>Satélite</span>
      </button>
    </div>
  );
}