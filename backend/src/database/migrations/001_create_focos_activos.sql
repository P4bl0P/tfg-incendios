CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE IF NOT EXISTS focos_activos (
  id SERIAL PRIMARY KEY,
  estado VARCHAR(50) NOT NULL DEFAULT 'Activo',
  intensidad_frp NUMERIC,
  fecha_deteccion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  geom GEOMETRY(Point, 4326) NOT NULL
);

CREATE INDEX IF NOT EXISTS focos_activos_geom_idx
ON focos_activos
USING GIST (geom);