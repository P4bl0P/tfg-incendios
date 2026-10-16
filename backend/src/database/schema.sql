-- Habilitar PostGIS si no está activo
CREATE EXTENSION IF NOT EXISTS postgis;

DROP TABLE IF EXISTS focos_activos CASCADE;

CREATE TABLE focos_activos (
  id SERIAL PRIMARY KEY,

  estado VARCHAR(50) DEFAULT 'Activo',

  -- satelite o manual
  origen VARCHAR(20) NOT NULL DEFAULT 'manual'
    CHECK (origen IN ('satelite', 'manual')),

  -- Potencia radiativa del fuego detectada por satélite
  intensidad_frp NUMERIC,

  fecha_deteccion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  geom GEOMETRY(Point, 4326) NOT NULL
);

CREATE INDEX focos_activos_geom_idx
ON focos_activos
USING GIST (geom);