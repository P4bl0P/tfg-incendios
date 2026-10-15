import type {
  OpenMeteoCurrentResponse,
  WindGridPoint,
} from './openMeteoTypes';

const OPEN_METEO_URL =
  'https://api.open-meteo.com/v1/forecast';

interface GridCoordinate {
  latitude: number;
  longitude: number;
}

function createRange(
  start: number,
  end: number,
  step: number,
): number[] {
  const values: number[] = [];

  for (
    let value = start;
    value <= end;
    value += step
  ) {
    values.push(Number(value.toFixed(2)));
  }

  return values;
}

function createGrid(): GridCoordinate[] {
  const latitudes = createRange(36, 44, 1);
  const longitudes = createRange(-10, 4, 1);

  const coordinates: GridCoordinate[] = [];

  for (const latitude of latitudes) {
    for (const longitude of longitudes) {
      coordinates.push({
        latitude,
        longitude,
      });
    }
  }

  return coordinates;
}

const GRID_COORDINATES = createGrid();

function isOpenMeteoResponse(
  value: unknown,
): value is OpenMeteoCurrentResponse {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const data = value as Record<string, unknown>;
  const current = data.current;

  return (
    typeof data.latitude === 'number' &&
    typeof data.longitude === 'number' &&
    typeof current === 'object' &&
    current !== null
  );
}

function normalizeResponse(
  response: OpenMeteoCurrentResponse,
): WindGridPoint {
  const current = response.current;

  return {
    latitude: response.latitude,
    longitude: response.longitude,
    temperature:
      current.temperature_2m ?? null,
    windSpeed:
      current.wind_speed_10m ?? null,
    windDirection:
      current.wind_direction_10m ?? null,
    windGusts:
      current.wind_gusts_10m ?? null,
    observedAt: current.time,
  };
}

function normalizeResponseBody(
  body: unknown,
): OpenMeteoCurrentResponse[] {
  const values = Array.isArray(body)
    ? body
    : [body];

  return values.filter(
    isOpenMeteoResponse,
  );
}

export async function fetchWindGrid(): Promise<
  WindGridPoint[]
> {
  const url = new URL(OPEN_METEO_URL);

  const latitudes = GRID_COORDINATES.map(
    ({ latitude }) => latitude,
  );

  const longitudes = GRID_COORDINATES.map(
    ({ longitude }) => longitude,
  );

  url.searchParams.set(
    'latitude',
    latitudes.join(','),
  );

  url.searchParams.set(
    'longitude',
    longitudes.join(','),
  );

  url.searchParams.set(
    'current',
    [
      'temperature_2m',
      'wind_speed_10m',
      'wind_direction_10m',
      'wind_gusts_10m',
    ].join(','),
  );

  url.searchParams.set(
    'wind_speed_unit',
    'kmh',
  );

  url.searchParams.set(
    'timezone',
    'UTC',
  );

  const response = await fetch(url);

  if (!response.ok) {
    const errorBody = await response.text();

    throw new Error(
      `Open-Meteo respondió con ${response.status}: ${errorBody}`,
    );
  }

  const body: unknown =
    await response.json();

  const responses =
    normalizeResponseBody(body);

  if (responses.length === 0) {
    throw new Error(
      'Open-Meteo no devolvió puntos meteorológicos válidos.',
    );
  }

  return responses.map(normalizeResponse);
}