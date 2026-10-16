import { useEffect, useState } from 'react';

import type { ReverseGeocodingResult } from './fireTypes';

interface UseReverseGeocodingResult {
  location: ReverseGeocodingResult | null;
  loading: boolean;
  error: string | null;
}

export default function useReverseGeocoding(
  coordinates: [number, number] | null,
): UseReverseGeocodingResult {
  const [location, setLocation] =
    useState<ReverseGeocodingResult | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    if (!coordinates) {
      setLocation(null);
      setLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();
    const [longitude, latitude] = coordinates;

    setLoading(true);
    setError(null);

    fetch(
      `http://localhost:3001/api/geocodificacion-inversa?lat=${latitude}&lon=${longitude}`,
      {
        signal: controller.signal,
      },
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Error HTTP: ${response.status}`,
          );
        }

        return response.json() as Promise<ReverseGeocodingResult>;
      })
      .then((data) => {
        setLocation(data);
      })
      .catch((reason: unknown) => {
        if (
          reason instanceof DOMException &&
          reason.name === 'AbortError'
        ) {
          return;
        }

        console.error(
          'Error en la geocodificación inversa:',
          reason,
        );

        setError(
          'No se ha podido obtener el municipio.',
        );
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [coordinates]);

  return {
    location,
    loading,
    error,
  };
}