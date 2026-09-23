import { useEffect, useState } from 'react';
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
} from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import * as L from 'leaflet';

import LayerToggle from './LayerToggle';

import 'leaflet/dist/leaflet.css';
import 'react-leaflet-cluster/dist/assets/MarkerCluster.css';
import 'react-leaflet-cluster/dist/assets/MarkerCluster.Default.css';

type LayerType = 'dark' | 'satellite';

interface FireFeature {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
  properties: {
    estado?: string;
    intensidad_frp?: number | string;
    [key: string]: unknown;
  };
}

interface FiresGeoJSON {
  type: 'FeatureCollection';
  features: FireFeature[];
}

function createFireIcon(estado?: string) {
  const isActive = estado === 'Activo';
  const color = isActive ? '#ef4444' : '#f97316';

  return L.divIcon({
    className: '',
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -10],
    html: `
      <span
        style="
          display: block;
          width: 16px;
          height: 16px;
          border-radius: 9999px;
          background: ${color};
          border: 2px solid #ffffff;
          box-shadow:
            0 0 0 2px ${color}55,
            0 2px 8px rgba(0, 0, 0, 0.45);
        "
      ></span>
    `,
  });
}

function createClusterIcon(count: number) {
  let size = 30;
  let background = '#FF6D1F';

  if (count >= 10 && count < 50) {
    size = 48;
    background = '#ea580c';
  }

  if (count >= 50) {
    size = 56;
    background = '#dc2626';
  }

  return L.divIcon({
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    html: `
      <div
        style="
          width: ${size}px;
          height: ${size}px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 9999px;
          color: #ffffff;
          font-family: Inter, ui-sans-serif, system-ui, sans-serif;
          font-size: ${count >= 100 ? '14px' : '16px'};
          font-weight: 800;
          border: 3px solid rgba(255, 255, 255, 0.95);
          background:
            radial-gradient(
              circle at 30% 25%,
              rgba(255, 255, 255, 0.35),
              transparent 32%
            ),
            ${background};
          box-shadow:
            0 0 0 5px ${background}33,
            0 6px 18px rgba(0, 0, 0, 0.38);
        "
      >
        ${count}
      </div>
    `,
  });
}

export default function Map() {
  const [incendios, setIncendios] =
    useState<FiresGeoJSON | null>(null);

  const [layerType, setLayerType] =
    useState<LayerType>('dark');

  useEffect(() => {
    fetch('http://localhost:3001/api/incendios')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error HTTP: ${res.status}`);
        }

        return res.json();
      })
      .then((data: FiresGeoJSON) => {
        setIncendios(data);
      })
      .catch((err) => {
        console.error('Error cargando incendios:', err);
      });
  }, []);

  const features = incendios?.features ?? [];

  return (
    <div className="relative h-full w-full">
      <LayerToggle
        activeLayer={layerType}
        setLayer={setLayerType}
      />

      <MapContainer
        center={[39.5, -3.0]}
        zoom={6}
        style={{ height: '100vh', width: '100vw' }}
        className="z-0"
      >
        {layerType === 'dark' ? (
          <TileLayer
            key="street"
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
            attribution="&copy; Esri"
          />
        ) : (
          <TileLayer
            key="satellite"
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution="Tiles © Esri"
          />
        )}

        <MarkerClusterGroup
          chunkedLoading
          maxClusterRadius={60}
          showCoverageOnHover={false}
          zoomToBoundsOnClick
          spiderfyOnMaxZoom
          removeOutsideVisibleBounds
          animate
          iconCreateFunction={(cluster: { getChildCount: () => number; }) =>
            createClusterIcon(cluster.getChildCount())
          }
        >
          {features.map((feature, index) => {
            const [longitude, latitude] =
              feature.geometry.coordinates;

            const properties = feature.properties;

            return (
              <Marker
                key={`${latitude}-${longitude}-${index}`}
                position={[latitude, longitude]}
                icon={createFireIcon(properties.estado)}
              >
                <Popup>
                  <div className="font-sans text-sm">
                    <p className="mb-1">
                      <strong>Estado:</strong>{' '}
                      {properties.estado ?? 'Desconocido'}
                    </p>

                    <p>
                      <strong>Intensidad FRP:</strong>{' '}
                      {properties.intensidad_frp ?? 'Sin datos'}
                    </p>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
}