import { useEffect, useState } from 'react';

import type { FiresGeoJSON } from './fireTypes';

interface UseFiresResult {
  incendios: FiresGeoJSON | null;
  loading: boolean;
  error: string | null;
}

export default function useFires(): UseFiresResult {
  const [incendios, setIncendios] =
    useState<FiresGeoJSON | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch('http://localhost:3001/api/incendios', {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error HTTP: ${res.status}`);
        }

        return res.json() as Promise<FiresGeoJSON>;
      })
      .then((data) => {
        setIncendios(data);
        setError(null);
      })
      .catch((err: unknown) => {
        if (
          err instanceof DOMException &&
          err.name === 'AbortError'
        ) {
          return;
        }

        console.error('Error cargando incendios:', err);
        setError('No se han podido cargar los incendios.');
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, []);

  return {
    incendios,
    loading,
    error,
  };
}