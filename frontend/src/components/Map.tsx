import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // Imprescindible para que el mapa no se rompa

export default function Map() {
  const [incendios, setIncendios] = useState<any>(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/incendios')
      .then((res) => res.json())
      .then((data) => setIncendios(data))
      .catch((err) => console.error('Error cargando incendios:', err));
  }, []);

  const pointToLayer = (feature: any, latlng: L.LatLng) => {
    return L.circleMarker(latlng, {
      radius: 8,
      fillColor: feature.properties.estado === 'Activo' ? '#ef4444' : '#f97316', // Colores de Tailwind (red-500, orange-500)
      color: '#ffffff',
      weight: 2,
      opacity: 1,
      fillOpacity: 0.8,
    }).bindPopup(`
      <div class="font-sans text-sm">
        <strong class="font-bold text-gray-800">Estado:</strong> ${feature.properties.estado}<br/>
        <strong class="font-bold text-gray-800">Intensidad (FRP):</strong> ${feature.properties.intensidad_frp}
      </div>
    `);
  };

  return (
    <MapContainer 
      center={[39.5, -3.0]} 
      zoom={6} 
      style={{ height: '100vh', width: '100vw' }} // Medidas absolutas del viewport
      className="z-0"
    >
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
        attribution='Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
      />
      
      {incendios && (
        <GeoJSON 
          data={incendios} 
          pointToLayer={pointToLayer} 
        />
      )}
    </MapContainer>
  );
}