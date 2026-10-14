export interface WeatherData {
  latitude: number;
  longitude: number;
  temperature: number;
  feelsLike: number | null;
  humidity: number | null;
  windSpeed: number | null;
  windDirection: number | null;
  windGust: number | null;
  weatherDescription: string | null;
  weatherIcon: string | null;
  observedAt: string;
}