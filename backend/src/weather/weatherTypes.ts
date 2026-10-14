export interface OpenWeatherResponse {
  coord: {
    lon: number;
    lat: number;
  };
  weather?: Array<{
    description?: string;
    icon?: string;
  }>;
  main: {
    temp: number;
    feels_like?: number;
    humidity?: number;
  };
  wind: {
    speed?: number;
    deg?: number;
    gust?: number;
  };
  dt: number;
}

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