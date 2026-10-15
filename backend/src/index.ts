import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './database/db';
import { fetchWeather } from './weather/openWeatherClient';
import { getCachedWeather, setCachedWeather } from './weather/weatherCache';
import { fetchWeatherForLocations } from './weather/weatherBatchService';
import type { WeatherBatchResponse, WeatherLocation } from './weather/weatherBatchTypes'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

app.get(
  '/api/incendios',
  async (req: Request, res: Response) => {
    try {
      const query = `
        SELECT json_build_object(
          'type', 'FeatureCollection',
          'features', COALESCE(
            json_agg(ST_AsGeoJSON(t.*)::json),
            '[]'::json
          )
        ) AS geojson
        FROM (
          SELECT
            id,
            estado,
            intensidad_frp,
            fecha_deteccion,
            geom
          FROM focos_activos
        ) AS t;
      `;

      const { rows } = await pool.query(query);

      res.json(rows[0].geojson);
    } catch (error) {
      console.error('Error al consultar PostGIS:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
      });
    }
  },
);

app.get(
  '/api/meteorologia',
  async (req: Request, res: Response) => {
    const latitude = Number(req.query.lat);
    const longitude = Number(req.query.lon);

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) {
      res.status(400).json({
        error:
          'Los parámetros lat y lon deben ser números válidos.',
      });

      return;
    }

    if (latitude < -90 || latitude > 90) {
      res.status(400).json({
        error: 'La latitud debe estar entre -90 y 90.',
      });

      return;
    }

    if (longitude < -180 || longitude > 180) {
      res.status(400).json({
        error: 'La longitud debe estar entre -180 y 180.',
      });

      return;
    }

    try {
      const cachedWeather = getCachedWeather(
        latitude,
        longitude,
      );

      if (cachedWeather) {
        res.setHeader('X-Weather-Cache', 'HIT');
        res.json(cachedWeather);
        return;
      }

      const weather = await fetchWeather(
        latitude,
        longitude,
      );

      setCachedWeather(
        latitude,
        longitude,
        weather,
      );

      res.setHeader('X-Weather-Cache', 'MISS');
      res.json(weather);
    } catch (error) {
      console.error(
        'Error obteniendo datos meteorológicos:',
        error,
      );

      res.status(502).json({
        error:
          'No se han podido obtener los datos meteorológicos.',
      });
    }
  },
);

app.post(
  '/api/meteorologia/focos',
  async (req: Request, res: Response) => {
    const body: unknown = req.body;

    if (
      !body ||
      typeof body !== 'object' ||
      !Array.isArray(
        (body as { locations?: unknown }).locations,
      )
    ) {
      res.status(400).json({
        error:
          'El cuerpo debe incluir un array llamado locations.',
      });

      return;
    }

    const locations = (
      body as {
        locations: unknown[];
      }
    ).locations;

    const normalizedLocations: WeatherLocation[] = [];

    for (const location of locations) {
      if (
        !location ||
        typeof location !== 'object'
      ) {
        res.status(400).json({
          error:
            'Cada ubicación debe ser un objeto válido.',
        });

        return;
      }

      const data = location as {
        id?: unknown;
        latitude?: unknown;
        longitude?: unknown;
      };

      if (
        data.id === undefined ||
        data.latitude === undefined ||
        data.longitude === undefined
      ) {
        res.status(400).json({
          error:
            'Cada ubicación debe incluir id, latitude y longitude.',
        });

        return;
      }

      const latitude = Number(data.latitude);
      const longitude = Number(data.longitude);

      if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude)
      ) {
        res.status(400).json({
          error:
            'La latitud y la longitud deben ser números válidos.',
        });

        return;
      }

      if (
        latitude < -90 ||
        latitude > 90
      ) {
        res.status(400).json({
          error:
            'La latitud debe estar entre -90 y 90.',
        });

        return;
      }

      if (
        longitude < -180 ||
        longitude > 180
      ) {
        res.status(400).json({
          error:
            'La longitud debe estar entre -180 y 180.',
        });

        return;
      }

      normalizedLocations.push({
        id: String(data.id),
        latitude,
        longitude,
      });
    }

    if (
      normalizedLocations.length === 0
    ) {
      res.status(400).json({
        error:
          'Debes enviar al menos una ubicación.',
      });

      return;
    }

    if (
      normalizedLocations.length > 100
    ) {
      res.status(400).json({
        error:
          'No puedes enviar más de 100 ubicaciones por petición.',
      });

      return;
    }

    try {
      const locations =
        await fetchWeatherForLocations(
          normalizedLocations,
        );

      const response: WeatherBatchResponse = {
        locations,
        updatedAt: new Date().toISOString(),
      };

      res.json(response);
    } catch (error) {
      console.error(
        'Error obteniendo meteorología de los focos:',
        error,
      );

      res.status(502).json({
        error:
          'No se han podido obtener los datos meteorológicos de los focos.',
      });
    }
  },
);

app.listen(PORT, () => {
  console.log(
    `⚡ Servidor backend corriendo en http://localhost:${PORT}`,
  );
});