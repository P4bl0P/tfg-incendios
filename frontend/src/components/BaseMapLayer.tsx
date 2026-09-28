import { TileLayer } from 'react-leaflet';

export type LayerType = 'dark' | 'satellite';

interface BaseMapLayerProps {
  layerType: LayerType;
}

const layers = {
  dark: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri',
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles © Esri',
  },
} satisfies Record<
  LayerType,
  {
    url: string;
    attribution: string;
  }
>;

export default function BaseMapLayer({
  layerType,
}: BaseMapLayerProps) {
  const layer = layers[layerType];

  return (
    <TileLayer
      key={layerType}
      url={layer.url}
      attribution={layer.attribution}
    />
  );
}