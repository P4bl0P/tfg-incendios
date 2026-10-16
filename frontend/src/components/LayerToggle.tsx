import {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  MAP_LAYERS,
  type LayerType,
} from './BaseMapLayer';

interface LayerToggleProps {
  activeLayer: LayerType;
  setLayer: (layer: LayerType) => void;
}

function MapLayerIcon({
  layer,
}: {
  layer: LayerType;
}) {
  if (layer === 'satellite') {
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

  if (layer === 'topographic') {
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
        <path d="m3 19 6-8 4 5 3-4 5 7" />
        <path d="M3 19h18" />
        <path d="m14 7 2-3 5 6" />
      </svg>
    );
  }

  if (layer === 'relief') {
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
        <path d="m3 18 6-8 4 4 3-5 5 9" />
        <path d="M3 18h18" />
        <path d="M8 10h.01" />
      </svg>
    );
  }

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
      <path d="M4 19h16" />
      <path d="M5 19v-6l4-3 3 2 4-5 3 3v9" />
      <path d="M8 19v-3" />
      <path d="M12 19v-4" />
      <path d="M16 19v-6" />
    </svg>
  );
}

function ChevronIcon({
  open,
}: {
  open: boolean;
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
        'h-4 w-4 transition-transform duration-200',
        open ? 'rotate-180' : 'rotate-0',
      ].join(' ')}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export default function LayerToggle({
  activeLayer,
  setLayer,
}: LayerToggleProps) {
  const [isOpen, setIsOpen] = useState(false);

  const containerRef =
    useRef<HTMLDivElement>(null);

  const activeLayerData =
    MAP_LAYERS.find(
      (layer) => layer.id === activeLayer,
    ) ?? MAP_LAYERS[0];

  useEffect(() => {
    const handlePointerDown = (
      event: PointerEvent,
    ) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(
          event.target as Node,
        )
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener(
      'pointerdown',
      handlePointerDown,
    );

    document.addEventListener(
      'keydown',
      handleKeyDown,
    );

    return () => {
      document.removeEventListener(
        'pointerdown',
        handlePointerDown,
      );

      document.removeEventListener(
        'keydown',
        handleKeyDown,
      );
    };
  }, []);

  const handleLayerChange = (
    layer: LayerType,
  ) => {
    setLayer(layer);
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className="absolute right-4 top-4 z-[1000]"
    >
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Mapa actual: ${activeLayerData.label}`}
        onClick={() => setIsOpen((value) => !value)}
        className={[
          'group flex h-9 min-w-[132px] items-center',
          'justify-between gap-2 rounded-xl',
          'border border-white/80',
          'bg-white/95 px-3',
          'text-slate-600',
          'shadow-[0_4px_12px_rgba(15,23,42,0.2)]',
          'backdrop-blur-xl',
          'transition-all duration-200 ease-out',
          'hover:-translate-y-0.5 hover:scale-[1.02]',
          'hover:text-blue-600',
          'hover:shadow-[0_6px_16px_rgba(37,99,235,0.25)]',
          'active:scale-[0.98]',
          'focus:outline-none focus-visible:ring-2',
          'focus-visible:ring-blue-400/60',
        ].join(' ')}
      >
        <span className="flex items-center gap-2">
          <MapLayerIcon layer={activeLayer} />

          <span className="text-xs font-semibold">
            {activeLayerData.label}
          </span>
        </span>

        <ChevronIcon open={isOpen} />
      </button>

      <div
        role="listbox"
        aria-label="Tipos de mapa disponibles"
        className={[
          'absolute right-0 top-[calc(100%+8px)]',
          'w-64 origin-top-right',
          'rounded-2xl border border-white/70',
          'bg-white/95 p-1.5',
          'shadow-[0_12px_30px_rgba(15,23,42,0.22)]',
          'backdrop-blur-xl',
          'transition-all duration-200 ease-out',
          isOpen
            ? 'visible translate-y-0 scale-100 opacity-100'
            : 'invisible -translate-y-2 scale-95 opacity-0',
        ].join(' ')}
      >
        {MAP_LAYERS.map((layer) => {
          const isActive = layer.id === activeLayer;

          return (
            <button
              key={layer.id}
              type="button"
              role="option"
              aria-selected={isActive}
              onClick={() => handleLayerChange(layer.id)}
              className={[
                'flex w-full items-center gap-3',
                'rounded-xl px-3 py-2.5 text-left',
                'transition-all duration-150 ease-out',
                'hover:-translate-y-0.5',
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600',
              ].join(' ')}
            >
              <span
                className={[
                  'flex h-8 w-8 shrink-0 items-center',
                  'justify-center rounded-lg',
                  'transition-colors duration-150',
                  isActive
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-slate-100 text-slate-500',
                ].join(' ')}
              >
                <MapLayerIcon layer={layer.id} />
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-xs font-semibold">
                  {layer.label}
                </span>

                <span className="mt-0.5 block truncate text-[11px] text-slate-400">
                  {layer.description}
                </span>
              </span>

              {isActive && (
                <span
                  aria-hidden="true"
                  className="
                    h-2 w-2 shrink-0 rounded-full
                    bg-blue-500
                    shadow-[0_0_0_3px_rgba(59,130,246,0.15)]
                  "
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}