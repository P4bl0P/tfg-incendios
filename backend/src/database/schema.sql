-- Habilitar PostGIS si no está activo
CREATE EXTENSION IF NOT EXISTS postgis;

-- Limpiar la tabla si ya existe (útil al reiniciar el entorno)
DROP TABLE IF EXISTS focos_activos CASCADE;

-- Crear la tabla para los incendios (HU-01)
CREATE TABLE focos_activos (
  id SERIAL PRIMARY KEY,
  estado VARCHAR(50) DEFAULT 'Activo', -- Activo, Estabilizado, Controlado, Extinguido
  intensidad_frp NUMERIC,              -- Potencia radiativa (NASA)
  fecha_deteccion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  geom GEOMETRY(Point, 4326)           -- Columna espacial para lat/lon
);

-- Aquí añadiremos más tablas en el futuro (usuarios, rutas, etc.)