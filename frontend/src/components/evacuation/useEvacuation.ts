import { useEffect, useState } from 'react';

import type { EvacuationResponse } from './evacuationTypes';

interface UseEvacuationResult {
  evacuation: EvacuationResponse | null;
  loading: boolean;
  error: string | null;
}

export default function useEvacuation(): UseEvacuationResult {
  const [evacuation, setEvacuation] =
    useState<EvacuationResponse | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch('http://localhost:3001/api/evacuacion', {
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Error HTTP: ${response.status}`,
          );
        }

        return response.json() as Promise<EvacuationResponse>;
      })
      .then((data) => {
        setEvacuation(data);
        setError(null);
      })
      .catch((reason: unknown) => {
        if (
          reason instanceof DOMException &&
          reason.name === 'AbortError'
        ) {
          return;
        }

        console.error(
          'Error cargando la evacuación:',
          reason,
        );

        setError(
          'No se han podido cargar las rutas de evacuación.',
        );
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, []);

  return {
    evacuation,
    loading,
    error,
  };
}