import { useState } from 'react';
import { MapContainer } from 'react-leaflet';

import LayerToggle from './LayerToggle';
import BaseMapLayer, {
  type LayerType,
} from './BaseMapLayer';
import MapControls from './map-controls/MapControls';
import FireLayer from './fires/FireLayer';

import 'leaflet/dist/leaflet.css';
import 'react-leaflet-cluster/dist/assets/MarkerCluster.css';
import 'react-leaflet-cluster/dist/assets/MarkerCluster.Default.css';

export default function Map() {
  const [layerType, setLayerType] =
    useState<LayerType>('street');

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <LayerToggle
        activeLayer={layerType}
        setLayer={setLayerType}
      />

      <MapContainer
        center={[39.5, -3.0]}
        zoom={6}
        minZoom={4}
        zoomControl={false}
        maxBounds={[
          [-85, -180],
          [85, 180],
        ]}
        maxBoundsViscosity={1}
        style={{
          height: '100%',
          width: '100%',
        }}
        className="relative z-0 h-full w-full"
      >
        <BaseMapLayer layerType={layerType} />

        <MapControls />

        <FireLayer />
      </MapContainer>
    </div>
  );
}