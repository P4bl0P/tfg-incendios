import { useState } from 'react';
import { MapContainer } from 'react-leaflet';

import LayerToggle from './LayerToggle';
import BaseMapLayer, {
  type LayerType,
} from './BaseMapLayer';
import MapControls from './map-controls/MapControls';
import FireLayer from './fires/FireLayer';
import useFires from './fires/useFires';
import WindGridLayer from './weather/WindGridLayer';

import 'leaflet/dist/leaflet.css';
import 'react-leaflet-cluster/dist/assets/MarkerCluster.css';
import 'react-leaflet-cluster/dist/assets/MarkerCluster.Default.css';

export default function Map() {
  const [layerType, setLayerType] =
    useState<LayerType>('street');

  const [weatherEnabled, setWeatherEnabled] =
    useState(false);

  const {
    incendios,
    loading: firesLoading,
    error: firesError,
  } = useFires();

  const features =
    incendios?.features ?? [];

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

        <WindGridLayer
          enabled={weatherEnabled}
        />

        <MapControls
          weatherEnabled={weatherEnabled}
          setWeatherEnabled={setWeatherEnabled}
        />

        <FireLayer
          features={features}
          loading={firesLoading}
          error={firesError}
        />
      </MapContainer>

      <div
        className="
          pointer-events-none absolute bottom-2
          right-2 z-[1000]
          rounded-lg bg-white/80
          px-2 py-1 text-[10px]
          text-slate-600 backdrop-blur-sm
        "
      >
        Datos meteorológicos:
        <span className="font-semibold">
          {' '}Open-Meteo.com
        </span>
      </div>
    </div>
  );
}