export interface WindGridPoint {
  latitude: number;
  longitude: number;
  temperature: number | null;
  windSpeed: number | null;
  windDirection: number | null;
  windGusts: number | null;
  observedAt: string;
}

export interface WindGridResponse {
  points: WindGridPoint[];
  updatedAt: string;
}