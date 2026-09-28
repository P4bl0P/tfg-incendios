import { TileLayer } from 'react-leaflet';

export type LayerType =
  | 'street'
  | 'satellite'
  | 'topographic'
  | 'relief';

export interface MapLayerOption {
  id: LayerType;
  label: string;
  description: string;
  url: string;
  attribution: string;
}

export const MAP_LAYERS: MapLayerOption[] = [
  {
    id: 'street',
    label: 'Calles',
    description: 'Carreteras, ciudades y lugares',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri',
  },
  {
    id: 'satellite',
    label: 'Satélite',
    description: 'Imagen real del terreno',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles © Esri',
  },
  {
    id: 'topographic',
    label: 'Topográfico',
    description: 'Relieve, caminos y curvas de nivel',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri',
  },
  {
    id: 'relief',
    label: 'Relieve',
    description: 'Visualización sombreada del terreno',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri',
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
      noWrap
      bounds={worldBounds}
    />
  );
}