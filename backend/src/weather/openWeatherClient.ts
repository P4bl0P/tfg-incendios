import type {
  OpenWeatherResponse,
  WeatherData,
} from './weatherTypes';

const OPENWEATHER_URL =
  'https://api.openweathermap.org/data/2.5/weather';

function getApiKey(): string {
  const apiKey = process.env.OPENWEATHER_API_KEY?.trim();

  if (!apiKey) {
    throw new Error(
      'Falta la variable de entorno OPENWEATHER_API_KEY',
    );
  }

  return apiKey;
}

function isOpenWeatherResponse(
  value: unknown,
): value is OpenWeatherResponse {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const data = value as Record<string, unknown>;
  const main = data.main;
  const wind = data.wind;
  const coord = data.coord;

  if (
    !coord ||
    typeof coord !== 'object' ||
    !main ||
    typeof main !== 'object' ||
    !wind ||
    typeof wind !== 'object'
  ) {
    return false;
  }

  const coordData = coord as Record<string, unknown>;
  const mainData = main as Record<string, unknown>;
  const windData = wind as Record<string, unknown>;

  return (
    typeof coordData.lat === 'number' &&
    typeof coordData.lon === 'number' &&
    typeof mainData.temp === 'number' &&
    (windData.speed === undefined ||
      typeof windData.speed === 'number') &&
    (windData.deg === undefined ||
      typeof windData.deg === 'number')
  );
}

function toWeatherData(
  data: OpenWeatherResponse,
): WeatherData {
  const weather = data.weather?.[0];

  return {
    latitude: data.coord.lat,
    longitude: data.coord.lon,
    temperature: data.main.temp,
    feelsLike: data.main.feels_like ?? null,
    humidity: data.main.humidity ?? null,
    windSpeed: data.wind.speed ?? null,
    windDirection: data.wind.deg ?? null,
    windGust: data.wind.gust ?? null,
    weatherDescription: weather?.description ?? null,
    weatherIcon: weather?.icon ?? null,
    observedAt: new Date(data.dt * 1000).toISOString(),
  };
}

export async function fetchWeather(
  latitude: number,
  longitude: number,
): Promise<WeatherData> {
  const url = new URL(OPENWEATHER_URL);

  url.searchParams.set('lat', String(latitude));
  url.searchParams.set('lon', String(longitude));
  url.searchParams.set('appid', getApiKey());
  url.searchParams.set('units', 'metric');
  url.searchParams.set('lang', 'es');

  const response = await fetch(url);

  if (!response.ok) {
    const errorBody = await response.text();

    throw new Error(
      `OpenWeather respondió con ${response.status}: ${errorBody}`,
    );
  }

  const body: unknown = await response.json();

  if (!isOpenWeatherResponse(body)) {
    throw new Error(
      'La respuesta de OpenWeather tiene un formato inesperado',
    );
  }

  return toWeatherData(body);
}