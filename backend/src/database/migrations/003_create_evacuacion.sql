CREATE TABLE IF NOT EXISTS rutas_evacuacion (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  color VARCHAR(20) NOT NULL DEFAULT '#16a34a',
  geom GEOMETRY(LineString, 4326) NOT NULL
);

CREATE TABLE IF NOT EXISTS puntos_encuentro (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  capacidad INTEGER,
  geom GEOMETRY(Point, 4326) NOT NULL
);

CREATE INDEX IF NOT EXISTS rutas_evacuacion_geom_idx
  ON rutas_evacuacion
  USING GIST (geom);

CREATE INDEX IF NOT EXISTS puntos_encuentro_geom_idx
  ON puntos_encuentro
  USING GIST (geom);