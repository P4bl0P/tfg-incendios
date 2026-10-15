import {
  fetchWindGrid,
} from './openMeteoClient';

import type {
  WindGridPoint,
} from './openMeteoTypes';

interface WindGridCache {
  data: WindGridPoint[];
  expiresAt: number;
}

const CACHE_DURATION_MS =
  10 * 60 * 1000;

let cache: WindGridCache | null = null;

export async function getWindGrid(): Promise<
  WindGridPoint[]
> {
  if (
    cache &&
    Date.now() < cache.expiresAt
  ) {
    return cache.data;
  }

  const data = await fetchWindGrid();

  cache = {
    data,
    expiresAt:
      Date.now() + CACHE_DURATION_MS,
  };

  return data;
}