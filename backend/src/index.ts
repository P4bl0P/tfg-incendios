import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './database/db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Ruta de comprobación
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// HU-01: Endpoint para servir focos activos en formato GeoJSON
app.get('/api/incendios', async (req: Request, res: Response) => {
  try {
    const query = `
      SELECT json_build_object(
        'type', 'FeatureCollection',
        'features', COALESCE(json_agg(ST_AsGeoJSON(t.*)::json), '[]'::json)
      ) AS geojson
      FROM (
        SELECT id, estado, intensidad_frp, fecha_deteccion, geom 
        FROM focos_activos
      ) AS t;
    `;
    const { rows } = await pool.query(query);
    res.json(rows[0].geojson);
  } catch (error) {
    console.error('Error al consultar PostGIS:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.listen(PORT, () => {
  console.log(`⚡ Servidor backend corriendo en http://localhost:${PORT}`);
});