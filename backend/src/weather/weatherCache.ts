interface CachedWeather<T> {
  data: T;
  expiresAt: number;
}

const weatherCache = new Map<
  string,
  CachedWeather<unknown>
>();

const CACHE_DURATION_MS = 10 * 60 * 1000;

function createCacheKey(
  latitude: number,
  longitude: number,
): string {
  const roundedLatitude = latitude.toFixed(2);
  const roundedLongitude = longitude.toFixed(2);

  return `${roundedLatitude},${roundedLongitude}`;
}

export function getCachedWeather<T>(
  latitude: number,
  longitude: number,
): T | null {
  const key = createCacheKey(latitude, longitude);
  const cached = weatherCache.get(key);

  if (!cached) {
    return null;
  }

  if (Date.now() >= cached.expiresAt) {
    weatherCache.delete(key);
    return null;
  }

  return cached.data as T;
}

export function setCachedWeather<T>(
  latitude: number,
  longitude: number,
  data: T,
): void {
  const key = createCacheKey(latitude, longitude);

  weatherCache.set(key, {
    data,
    expiresAt: Date.now() + CACHE_DURATION_MS,
  });
}