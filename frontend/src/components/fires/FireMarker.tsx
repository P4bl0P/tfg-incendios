import { Marker } from 'react-leaflet';
import * as L from 'leaflet';

import type { FireFeature } from './fireTypes';

interface FireMarkerProps {
  feature: FireFeature;
  index: number;
  onSelect: (feature: FireFeature) => void;
}

function createFireIcon(estado?: string) {
  const isActive = estado === 'Activo';

  const glow = isActive
    ? 'rgba(239, 68, 68, 0.45)'
    : 'rgba(249, 115, 22, 0.4)';

  return L.divIcon({
    className: '',
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    html: `
      <span
        role="img"
        aria-label="Foco de incendio"
        style="
          display: flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          font-size: 25px;
          line-height: 1;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.92);
          border: 2px solid #ffffff;
          box-shadow:
            0 0 0 3px ${glow},
            0 3px 10px rgba(15, 23, 42, 0.35);
          filter: drop-shadow(
            0 1px 1px rgba(15, 23, 42, 0.35)
          );
        "
      >
        🔥
      </span>
    `,
  });
}

export default function FireMarker({
  feature,
  index,
  onSelect,
}: FireMarkerProps) {
  const [longitude, latitude] =
    feature.geometry.coordinates;

  const { estado } = feature.properties;

  return (
    <Marker
      key={`${latitude}-${longitude}-${index}`}
      position={[latitude, longitude]}
      icon={createFireIcon(estado)}
      eventHandlers={{
        click: () => onSelect(feature),
      }}
    />
  );
}