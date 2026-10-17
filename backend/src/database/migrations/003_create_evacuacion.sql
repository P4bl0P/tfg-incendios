CREATE TABLE IF NOT EXISTS rutas_evacuacion (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(160) NOT NULL,
  color VARCHAR(20) NOT NULL DEFAULT '#16a34a',
  municipio VARCHAR(120) NOT NULL,
  provincia VARCHAR(120) NOT NULL DEFAULT 'Huelva',
  tipo_emergencia VARCHAR(60) NOT NULL,
  estado VARCHAR(30) NOT NULL DEFAULT 'informativa',
  fuente VARCHAR(50) NOT NULL,
  organismo VARCHAR(180),
  fiabilidad VARCHAR(20) NOT NULL,
  fecha_verificacion DATE,
  url_fuente TEXT,
  observaciones TEXT,
  geom GEOMETRY(LineString, 4326) NOT NULL,

  CONSTRAINT rutas_evacuacion_fuente_check
    CHECK (
      fuente IN (
        'plan_municipal',
        'plan_autoproteccion',
        'junta_andalucia',
        'dera',
        'openstreetmap',
        'calculada'
      )
    ),

  CONSTRAINT rutas_evacuacion_fiabilidad_check
    CHECK (
      fiabilidad IN (
        'muy_alta',
        'alta',
        'media',
        'baja',
        'informativa'
      )
    ),

  CONSTRAINT rutas_evacuacion_estado_check
    CHECK (
      estado IN (
        'vigente',
        'temporal',
        'pendiente_validacion',
        'informativa'
      )
    )
);

CREATE TABLE IF NOT EXISTS puntos_encuentro (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(160) NOT NULL,
  capacidad INTEGER,
  tipo_punto VARCHAR(50) NOT NULL,
  municipio VARCHAR(120) NOT NULL,
  provincia VARCHAR(120) NOT NULL DEFAULT 'Huelva',
  fuente VARCHAR(50) NOT NULL,
  organismo VARCHAR(180),
  fiabilidad VARCHAR(20) NOT NULL,
  fecha_verificacion DATE,
  url_fuente TEXT,
  observaciones TEXT,
  geom GEOMETRY(Point, 4326) NOT NULL,

  CONSTRAINT puntos_encuentro_tipo_check
    CHECK (
      tipo_punto IN (
        'evacuacion_ciudadana',
        'autoproteccion',
        'recurso_infoca',
        'assembly_point_osm',
        'informativo'
      )
    ),

  CONSTRAINT puntos_encuentro_fuente_check
    CHECK (
      fuente IN (
        'plan_municipal',
        'plan_autoproteccion',
        'junta_andalucia',
        'dera',
        'openstreetmap',
        'calculada'
      )
    ),

  CONSTRAINT puntos_encuentro_fiabilidad_check
    CHECK (
      fiabilidad IN (
        'muy_alta',
        'alta',
        'media',
        'baja',
        'informativa'
      )
    )
);

CREATE INDEX IF NOT EXISTS rutas_evacuacion_geom_idx
  ON rutas_evacuacion
  USING GIST (geom);

CREATE INDEX IF NOT EXISTS puntos_encuentro_geom_idx
  ON puntos_encuentro
  USING GIST (geom);

CREATE INDEX IF NOT EXISTS rutas_evacuacion_municipio_idx
  ON rutas_evacuacion (municipio);

CREATE INDEX IF NOT EXISTS puntos_encuentro_municipio_idx
  ON puntos_encuentro (municipio);