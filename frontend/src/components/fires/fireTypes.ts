export type FireOrigin = 'satelite' | 'manual';

export interface FireFeature {
  type: 'Feature';

  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };

  properties: {
    id?: number;
    estado?: string;
    origen?: FireOrigin;
    intensidad_frp?: number | string | null;
    fecha_deteccion?: string;
    [key: string]: unknown;
  };
}

export interface FiresGeoJSON {
  type: 'FeatureCollection';
  features: FireFeature[];
}

export interface ReverseGeocodingResult {
  municipio: string | null;
  provincia: string | null;
  comunidad: string | null;
  displayName: string | null;
}