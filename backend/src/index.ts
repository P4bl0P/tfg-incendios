import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './database/db';
import { fetchWeather } from './weather/openWeatherClient';
import { getCachedWeather, setCachedWeather } from './weather/weatherCache';

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

app.listen(PORT, () => {
  console.log(
    `⚡ Servidor backend corriendo en http://localhost:${PORT}`,
  );
});