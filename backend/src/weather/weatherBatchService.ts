import { fetchWeather } from './openWeatherClient';
import {
  getCachedWeather,
  setCachedWeather,
} from './weatherCache';
import type {
  FireWeatherData,
  WeatherLocation,
} from './weatherBatchTypes';

const MAX_LOCATIONS_PER_REQUEST = 100;

function createLocationKey(
  latitude: number,
  longitude: number,
): string {
  return `${latitude.toFixed(2)},${longitude.toFixed(2)}`;
}

function isValidLatitude(
  latitude: number,
): boolean {
  return (
    Number.isFinite(latitude) &&
    latitude >= -90 &&
    latitude <= 90
  );
}

function isValidLongitude(
  longitude: number,
): boolean {
  return (
    Number.isFinite(longitude) &&
    longitude >= -180 &&
    longitude <= 180
  );
}

function normalizeLocationId(
  id: string | number,
): string {
  return String(id);
}

export async function fetchWeatherForLocations(
  locations: WeatherLocation[],
): Promise<FireWeatherData[]> {
  if (
    locations.length === 0 ||
    locations.length > MAX_LOCATIONS_PER_REQUEST
  ) {
    throw new Error(
      `El número de ubicaciones debe estar entre 1 y ${MAX_LOCATIONS_PER_REQUEST}.`,
    );
  }

  const uniqueWeatherRequests = new Map<
    string,
    Promise<ReturnType<typeof fetchWeather> extends Promise<
      infer T
    >
      ? T
      : never>
  >();

  const results: FireWeatherData[] = [];

  for (const location of locations) {
    const latitude = Number(location.latitude);
    const longitude = Number(location.longitude);
    const id = normalizeLocationId(location.id);

    if (
      !isValidLatitude(latitude) ||
      !isValidLongitude(longitude)
    ) {
      results.push({
        id,
        latitude,
        longitude,
        weather: null,
        error: 'Las coordenadas no son válidas.',
      });

      continue;
    }

    const cacheKey = createLocationKey(
      latitude,
      longitude,
    );

    const cachedWeather =
      getCachedWeather<
        Awaited<ReturnType<typeof fetchWeather>>
      >(latitude, longitude);

    if (cachedWeather) {
      results.push({
        id,
        latitude,
        longitude,
        weather: cachedWeather,
      });

      continue;
    }

    let weatherRequest =
      uniqueWeatherRequests.get(cacheKey);

    if (!weatherRequest) {
      weatherRequest = fetchWeather(
        latitude,
        longitude,
      );

      uniqueWeatherRequests.set(
        cacheKey,
        weatherRequest,
      );
    }

    try {
      const weather = await weatherRequest;

      setCachedWeather(
        latitude,
        longitude,
        weather,
      );

      results.push({
        id,
        latitude,
        longitude,
        weather,
      });
    } catch (error) {
      console.error(
        `Error meteorológico para el foco ${id}:`,
        error,
      );

      results.push({
        id,
        latitude,
        longitude,
        weather: null,
        error:
          'No se han podido obtener los datos meteorológicos de esta ubicación.',
      });
    }
  }

  return results;
}