export interface EvacuationRouteFeature {
  type: 'Feature';

  geometry: {
    type: 'LineString';
    coordinates: Array<[number, number]>;
  };

  properties: {
    id: number;
    nombre: string;
    color: string;
  };
}

export interface MeetingPointFeature {
  type: 'Feature';

  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };

  properties: {
    id: number;
    nombre: string;
    capacidad: number | null;
  };
}

export interface EvacuationResponse {
  routes: EvacuationRouteFeature[];
  meetingPoints: MeetingPointFeature[];
}