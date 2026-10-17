import { useEffect, useState } from 'react';
import { MapContainer } from 'react-leaflet';

import LayerToggle from './LayerToggle';
import BaseMapLayer, {
  type LayerType,
} from './BaseMapLayer';
import MapControls from './map-controls/MapControls';
import FireLayer from './fires/FireLayer';
import FireDetailsSidebar from './fires/FireDetailsSidebar';
import useFires from './fires/useFires';
import useReverseGeocoding from './fires/useReverseGeocoding';
import WindGridLayer from './weather/WindGridLayer';
import EvacuationLayer from './evacuation/EvacuationLayer';
import useEvacuation from './evacuation/useEvacuation';

import type { FireFeature } from './fires/fireTypes';

import 'leaflet/dist/leaflet.css';
import 'react-leaflet-cluster/dist/assets/MarkerCluster.css';
import 'react-leaflet-cluster/dist/assets/MarkerCluster.Default.css';

export default function Map() {
  const [layerType, setLayerType] =
    useState<LayerType>('street');

  const [weatherEnabled, setWeatherEnabled] =
    useState(false);

  const [evacuationEnabled, setEvacuationEnabled] =
    useState(false);

  const [selectedFire, setSelectedFire] =
    useState<FireFeature | null>(null);

  const {
    incendios,
    loading: firesLoading,
    error: firesError,
  } = useFires();

  const {
    evacuation,
    loading: evacuationLoading,
    error: evacuationError,
  } = useEvacuation();

  const features = incendios?.features ?? [];

  const evacuationRoutes =
    evacuation?.routes ?? [];

  const meetingPoints =
    evacuation?.meetingPoints ?? [];

  const selectedCoordinates =
    selectedFire?.geometry.coordinates ?? null;

  const {
    location,
    loading: locationLoading,
    error: locationError,
  } = useReverseGeocoding(selectedCoordinates);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedFire(null);
      }
    };

    document.addEventListener(
      'keydown',
      handleEscape,
    );

    return () => {
      document.removeEventListener(
        'keydown',
        handleEscape,
      );
    };
  }, []);

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

        <EvacuationLayer
          enabled={evacuationEnabled}
          routes={evacuationRoutes}
          meetingPoints={meetingPoints}
          loading={evacuationLoading}
          error={evacuationError}
        />

        <WindGridLayer enabled={weatherEnabled} />

        <MapControls
          weatherEnabled={weatherEnabled}
          setWeatherEnabled={setWeatherEnabled}
          evacuationEnabled={evacuationEnabled}
          setEvacuationEnabled={setEvacuationEnabled}
        />

        <FireLayer
          features={features}
          loading={firesLoading}
          error={firesError}
          onSelect={setSelectedFire}
        />
      </MapContainer>

      {selectedFire && (
        <FireDetailsSidebar
          feature={selectedFire}
          location={location}
          locationLoading={locationLoading}
          locationError={locationError}
          onClose={() => setSelectedFire(null)}
        />
      )}
    </div>
  );
}