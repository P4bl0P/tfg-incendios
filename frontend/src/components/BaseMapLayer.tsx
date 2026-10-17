import { TileLayer } from 'react-leaflet';

export type LayerType =
  | 'street'
  | 'dark'
  | 'satellite'
  | 'outdoor'
  | 'topographic';

export interface MapLayerOption {
  id: LayerType;
  label: string;
  description: string;
  url: string;
  attribution: string;
  maxZoom: number;
  maxNativeZoom: number;
}

const mapTilerKey =
  import.meta.env.VITE_MAPTILER_KEY as
    | string
    | undefined;

function createMapTilerUrl(
  mapId: string,
  format: 'png' | 'jpg' = 'png',
): string {
  const keyParameter = mapTilerKey
    ? `?key=${encodeURIComponent(mapTilerKey)}`
    : '';

  return (
    `https://api.maptiler.com/maps/` +
    `${mapId}/256/{z}/{x}/{y}.${format}` +
    keyParameter
  );
}

const mapTilerAttribution =
  '&copy; <a href="https://www.maptiler.com/copyright/" target="_blank" rel="noreferrer">MapTiler</a> ' +
  '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap contributors</a>';

export const MAP_LAYERS: MapLayerOption[] = [
  {
    id: 'street',
    label: 'Calles',
    description:
      'Mapa claro para carreteras, ciudades y lugares',
    url: createMapTilerUrl('streets-v4'),
    attribution: mapTilerAttribution,
    maxZoom: 20,
    maxNativeZoom: 18,
  },
  {
    id: 'satellite',
    label: 'Satélite',
    description:
      'Imagen satelital con nombres, carreteras y límites',
    url: createMapTilerUrl('hybrid-v4'),
    attribution: mapTilerAttribution,
    maxZoom: 20,
    maxNativeZoom: 18,
  },
  {
    id: 'outdoor',
    label: 'Natural',
    description:
      'Parques, caminos, zonas forestales y espacios naturales',
    url: createMapTilerUrl('outdoor-v4'),
    attribution: mapTilerAttribution,
    maxZoom: 20,
    maxNativeZoom: 18,
  },
  {
    id: 'topographic',
    label: 'Topográfico',
    description:
      'Curvas de nivel, relieve y caminos del terreno',
    url: createMapTilerUrl('topo-v4'),
    attribution: mapTilerAttribution,
    maxZoom: 20,
    maxNativeZoom: 18,
  },
  {
    id: 'dark',
    label: 'Oscuro',
    description:
      'Mapa oscuro para destacar incendios y capas activas',
    url: createMapTilerUrl('dataviz-v4-dark'),
    attribution: mapTilerAttribution,
    maxZoom: 20,
    maxNativeZoom: 18,
  },
];

interface BaseMapLayerProps {
  layerType: LayerType;
}

const worldBounds: [
  [number, number],
  [number, number],
] = [
  [-85, -180],
  [85, 180],
];

export default function BaseMapLayer({
  layerType,
}: BaseMapLayerProps) {
  const selectedLayer = MAP_LAYERS.find(
    (layer) => layer.id === layerType,
  );

  const layer = selectedLayer ?? MAP_LAYERS[0];

  return (
    <TileLayer
      key={layer.id}
      url={layer.url}
      attribution={layer.attribution}
      tileSize={256}
      maxZoom={layer.maxZoom}
      maxNativeZoom={layer.maxNativeZoom}
      updateWhenIdle
      updateWhenZooming={false}
      keepBuffer={2}
      noWrap
      bounds={worldBounds}
    />
  );
}