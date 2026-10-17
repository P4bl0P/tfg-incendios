export type ReliabilityLevel =
  | 'muy_alta'
  | 'alta'
  | 'media'
  | 'baja'
  | 'informativa';

export type EvacuationPointType =
  | 'evacuacion_ciudadana'
  | 'autoproteccion'
  | 'recurso_infoca'
  | 'assembly_point_osm'
  | 'informativo';

export interface EvacuationMetadata {
  municipio: string;
  provincia: string;
  fuente: string;
  organismo: string | null;
  fiabilidad: ReliabilityLevel;
  fechaVerificacion: string | null;
  urlFuente: string | null;
  observaciones: string | null;
}

export interface EvacuationRouteFeature {
  type: 'Feature';

  geometry: {
    type: 'LineString';
    coordinates: Array<[number, number]>;
  };

  properties: EvacuationMetadata & {
    id: number;
    nombre: string;
    color: string;
    tipoEmergencia: string;
    estado: string;
  };
}

export interface MeetingPointFeature {
  type: 'Feature';

  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };

  properties: EvacuationMetadata & {
    id: number;
    nombre: string;
    capacidad: number | null;
    tipoPunto: EvacuationPointType;
  };
}

export interface EvacuationResponse {
  routes: EvacuationRouteFeature[];
  meetingPoints: MeetingPointFeature[];
}