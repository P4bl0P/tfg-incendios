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

/**
 * Silueta aproximada de la España peninsular.
 *
 * Las coordenadas están expresadas como:
 * [longitud, latitud]
 *
 * Es una máscara visual aproximada para evitar que
 * la rejilla tenga forma rectangular.
 */
const SPAIN_MAINLAND_POLYGON: [
  number,
  number,
][] = [
  // Galicia y costa cantábrica
  [-9.35, 43.80],
  [-8.80, 43.85],
  [-8.20, 43.75],
  [-7.60, 43.65],
  [-6.80, 43.65],
  [-6.00, 43.55],
  [-5.20, 43.55],
  [-4.40, 43.50],
  [-3.60, 43.55],
  [-2.80, 43.55],
  [-2.00, 43.45],
  [-1.20, 43.40],
  [-0.40, 43.25],
  [0.20, 42.95],

  // Frontera mediterránea y Cataluña
  [0.65, 42.60],
  [0.55, 42.15],
  [1.10, 41.75],
  [1.75, 41.45],
  [2.00, 41.00],
  [1.85, 40.55],
  [1.45, 40.15],
  [0.90, 39.75],
  [0.35, 39.40],
  [0.05, 38.95],
  [-0.15, 38.45],
  [-0.45, 38.00],
  [-0.80, 37.60],
  [-1.35, 37.20],
  [-2.00, 36.90],
  [-2.80, 36.70],
  [-3.70, 36.60],
  [-4.60, 36.65],
  [-5.40, 36.80],
  [-6.20, 37.00],
  [-6.85, 37.20],
  [-7.35, 37.45],

  // Frontera occidental y Portugal
  [-7.55, 37.85],
  [-7.75, 38.30],
  [-7.55, 38.80],
  [-7.35, 39.30],
  [-7.25, 39.80],
  [-7.15, 40.30],
  [-7.10, 40.80],
  [-7.20, 41.30],
  [-7.45, 41.75],
  [-7.70, 42.15],
  [-8.05, 42.50],
  [-8.45, 42.85],
  [-8.75, 43.20],
  [-9.10, 43.45],
];

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

function isPointInsidePolygon(
  latitude: number,
  longitude: number,
  polygon: [number, number][],
): boolean {
  let inside = false;

  for (
    let index = 0,
      previous = polygon.length - 1;
    index < polygon.length;
    previous = index++
  ) {
    const [
      currentLongitude,
      currentLatitude,
    ] = polygon[index];

    const [
      previousLongitude,
      previousLatitude,
    ] = polygon[previous];

    const intersects =
      currentLatitude > latitude !==
        previousLatitude > latitude &&
      longitude <
        ((previousLongitude - currentLongitude) *
          (latitude - currentLatitude)) /
          (previousLatitude - currentLatitude) +
          currentLongitude;

    if (intersects) {
      inside = !inside;
    }
  }

  return inside;
}

function createGrid(): GridCoordinate[] {
  const latitudes = createRange(
    36,
    44,
    0.5,
  );

  const longitudes = createRange(
    -10,
    4,
    0.5,
  );

  const coordinates: GridCoordinate[] = [];

  for (const latitude of latitudes) {
    for (const longitude of longitudes) {
      if (
        isPointInsidePolygon(
          latitude,
          longitude,
          SPAIN_MAINLAND_POLYGON,
        )
      ) {
        coordinates.push({
          latitude,
          longitude,
        });
      }
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