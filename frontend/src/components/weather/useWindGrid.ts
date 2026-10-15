import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import type {
  WindGridPoint,
  WindGridResponse,
} from './weatherTypes';

const WIND_GRID_URL =
  'http://localhost:3001/api/meteorologia/viento-mapa';

const REFRESH_INTERVAL_MS =
  10 * 60 * 1000;

interface UseWindGridOptions {
  enabled: boolean;
}

interface UseWindGridResult {
  points: WindGridPoint[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refresh: () => void;
}

function isWindGridResponse(
  value: unknown,
): value is WindGridResponse {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const data = value as Record<string, unknown>;

  return (
    Array.isArray(data.points) &&
    typeof data.updatedAt === 'string'
  );
}

export default function useWindGrid({
  enabled,
}: UseWindGridOptions): UseWindGridResult {
  const [points, setPoints] =
    useState<WindGridPoint[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [lastUpdated, setLastUpdated] =
    useState<Date | null>(null);

  const [refreshToken, setRefreshToken] =
    useState(0);

  const refresh = useCallback(() => {
    setRefreshToken(
      (value) => value + 1,
    );
  }, []);

  useEffect(() => {
    if (!enabled) {
      setPoints([]);
      setLoading(false);
      setError(null);
      setLastUpdated(null);
      return;
    }

    const controller =
      new AbortController();

    const isForcedRefresh =
      refreshToken > 0;

    async function loadWindGrid() {
      setLoading(true);
      setError(null);

      try {
        const url = new URL(
          WIND_GRID_URL,
        );

        if (isForcedRefresh) {
          url.searchParams.set(
            'refresh',
            '1',
          );
        }

        const response = await fetch(
          url,
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

        if (!isWindGridResponse(body)) {
          throw new Error(
            'La respuesta de viento no tiene un formato válido.',
          );
        }

        setPoints(body.points);
        setLastUpdated(
          new Date(body.updatedAt),
        );
        setError(null);
      } catch (requestError: unknown) {
        if (
          requestError instanceof DOMException &&
          requestError.name === 'AbortError'
        ) {
          return;
        }

        console.error(
          'Error cargando la rejilla de viento:',
          requestError,
        );

        setError(
          'No se ha podido cargar la capa de viento.',
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadWindGrid();

    const intervalId =
      window.setInterval(
        () => {
          const intervalController =
            new AbortController();

          fetch(WIND_GRID_URL, {
            signal: intervalController.signal,
          })
            .then(async (response) => {
              if (!response.ok) {
                throw new Error(
                  `Error HTTP: ${response.status}`,
                );
              }

              const body: unknown =
                await response.json();

              if (!isWindGridResponse(body)) {
                throw new Error(
                  'La respuesta de viento no tiene un formato válido.',
                );
              }

              setPoints(body.points);
              setLastUpdated(
                new Date(body.updatedAt),
              );
              setError(null);
            })
            .catch((intervalError: unknown) => {
              if (
                intervalError instanceof DOMException &&
                intervalError.name === 'AbortError'
              ) {
                return;
              }

              console.error(
                'Error actualizando la rejilla de viento:',
                intervalError,
              );

              setError(
                'No se ha podido actualizar la capa de viento.',
              );
            });
        },
        REFRESH_INTERVAL_MS,
      );

    return () => {
      controller.abort();
      window.clearInterval(intervalId);
    };
  }, [
    enabled,
    refreshToken,
  ]);

  return {
    points,
    loading,
    error,
    lastUpdated,
    refresh,
  };
}