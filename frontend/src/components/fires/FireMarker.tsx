import { Marker, Popup } from 'react-leaflet';
import * as L from 'leaflet';

import type { FireFeature } from './fireTypes';

interface FireMarkerProps {
  feature: FireFeature;
  index: number;
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

export default function FireMarker({
  feature,
  index,
}: FireMarkerProps) {
  const [longitude, latitude] =
    feature.geometry.coordinates;

  const { estado, intensidad_frp } =
    feature.properties;

  return (
    <Marker
      key={`${latitude}-${longitude}-${index}`}
      position={[latitude, longitude]}
      icon={createFireIcon(estado)}
    >
      <Popup>
        <div className="font-sans text-sm">
          <p className="mb-1">
            <strong>Estado:</strong>{' '}
            {estado ?? 'Desconocido'}
          </p>

          <p>
            <strong>Intensidad FRP:</strong>{' '}
            {intensidad_frp ?? 'Sin datos'}
          </p>
        </div>
      </Popup>
    </Marker>
  );
}