import MarkerClusterGroup from 'react-leaflet-cluster';
import * as L from 'leaflet';

import useFires from './useFires';
import FireMarker from './FireMarker';

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

export default function FireLayer() {
  const {
    incendios,
    loading,
    error,
  } = useFires();

  const features = incendios?.features ?? [];

  if (loading) {
    return null;
  }

  if (error) {
    console.error(error);
    return null;
  }

  return (
    <MarkerClusterGroup
      chunkedLoading
      maxClusterRadius={60}
      showCoverageOnHover={false}
      zoomToBoundsOnClick
      spiderfyOnMaxZoom
      removeOutsideVisibleBounds
      animate
      iconCreateFunction={(
        cluster: {
          getChildCount: () => number;
        },
      ) =>
        createClusterIcon(
          cluster.getChildCount(),
        )
      }
    >
      {features.map((feature, index) => (
        <FireMarker
          key={`${feature.geometry.coordinates.join('-')}-${index}`}
          feature={feature}
          index={index}
        />
      ))}
    </MarkerClusterGroup>
  );
}