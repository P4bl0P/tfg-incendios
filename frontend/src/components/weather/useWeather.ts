import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import type { WeatherData } from './weatherTypes';

const WEATHER_API_URL =
  'http://localhost:3001/api/meteorologia';

const REFRESH_INTERVAL_MS = 10 * 60 * 1000;

interface UseWeatherOptions {
  latitude: number | null;
  longitude: number | null;
  enabled?: boolean;
}

interface UseWeatherResult {
  weather: WeatherData | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refresh: () => void;
}

function isWeatherData(
  value: unknown,
): value is WeatherData {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const data = value as Record<string, unknown>;

  return (
    typeof data.latitude === 'number' &&
    typeof data.longitude === 'number' &&
    typeof data.temperature === 'number' &&
    (data.feelsLike === null ||
      typeof data.feelsLike === 'number') &&
    (data.humidity === null ||
      typeof data.humidity === 'number') &&
    (data.windSpeed === null ||
      typeof data.windSpeed === 'number') &&
    (data.windDirection === null ||
      typeof data.windDirection === 'number') &&
    (data.windGust === null ||
      typeof data.windGust === 'number') &&
    (data.weatherDescription === null ||
      typeof data.weatherDescription === 'string') &&
    (data.weatherIcon === null ||
      typeof data.weatherIcon === 'string') &&
    typeof data.observedAt === 'string'
  );
}

export default function useWeather({
  latitude,
  longitude,
  enabled = true,
}: UseWeatherOptions): UseWeatherResult {
  const [weather, setWeather] =
    useState<WeatherData | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [lastUpdated, setLastUpdated] =
    useState<Date | null>(null);

  const [refreshToken, setRefreshToken] =
    useState(0);

  const refresh = useCallback(() => {
    setRefreshToken((value) => value + 1);
  }, []);

  useEffect(() => {
    if (
      !enabled ||
      latitude === null ||
      longitude === null
    ) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    async function loadWeather() {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          lat: String(latitude),
          lon: String(longitude),
        });

        const response = await fetch(
          `${WEATHER_API_URL}?${params.toString()}`,
          {
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error(
            `Error HTTP: ${response.status}`,
          );
        }

        const body: unknown =
          await response.json();

        if (!isWeatherData(body)) {
          throw new Error(
            'La respuesta meteorológica no tiene un formato válido.',
          );
        }

        setWeather(body);
        setLastUpdated(new Date());
        setError(null);
      } catch (requestError: unknown) {
        if (
          requestError instanceof DOMException &&
          requestError.name === 'AbortError'
        ) {
          return;
        }

        console.error(
          'Error cargando meteorología:',
          requestError,
        );

        setError(
          'No se han podido cargar los datos meteorológicos.',
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadWeather();

    const intervalId = window.setInterval(
      loadWeather,
      REFRESH_INTERVAL_MS,
    );

    return () => {
      controller.abort();
      window.clearInterval(intervalId);
    };
  }, [
    enabled,
    latitude,
    longitude,
    refreshToken,
  ]);

  return {
    weather,
    loading,
    error,
    lastUpdated,
    refresh,
  };
}