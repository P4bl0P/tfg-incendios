import type { WeatherData } from './weatherTypes';

export interface WeatherLocation {
  id: string | number;
  latitude: number;
  longitude: number;
}

export interface FireWeatherData {
  id: string;
  latitude: number;
  longitude: number;
  weather: WeatherData | null;
  error?: string;
}

export interface WeatherBatchResponse {
  locations: FireWeatherData[];
  updatedAt: string;
}