export interface FireFeature {
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

export interface FiresGeoJSON {
  type: 'FeatureCollection';
  features: FireFeature[];
}