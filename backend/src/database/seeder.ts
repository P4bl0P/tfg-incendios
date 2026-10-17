import { pool } from './db';

interface FireSeed {
  estado: string;
  origen: 'satelite' | 'manual';
  intensidadFrp: number | null;
  longitude: number;
  latitude: number;
  detectedAt: string;
}

interface EvacuationRouteSeed {
  nombre: string;
  color: string;
  coordinates: Array<[number, number]>;
}

interface MeetingPointSeed {
  nombre: string;
  capacidad: number | null;
  longitude: number;
  latitude: number;
}

const fires: FireSeed[] = [
  {
    estado: 'Activo',
    origen: 'satelite',
    intensidadFrp: 85.5,
    longitude: -4.4,
    latitude: 39.0,
    detectedAt: '2026-10-16T08:15:00Z',
  },
  {
    estado: 'Activo',
    origen: 'satelite',
    intensidadFrp: 112.8,
    longitude: -5.9845,
    latitude: 37.3891,
    detectedAt: '2026-10-16T08:35:00Z',
  },
  {
    estado: 'Activo',
    origen: 'satelite',
    intensidadFrp: 64.2,
    longitude: -3.7038,
    latitude: 40.4168,
    detectedAt: '2026-10-16T08:50:00Z',
  },
  {
    estado: 'Activo',
    origen: 'satelite',
    intensidadFrp: 137.6,
    longitude: -6.3708,
    latitude: 39.4753,
    detectedAt: '2026-10-16T09:05:00Z',
  },
  {
    estado: 'Estabilizado',
    origen: 'satelite',
    intensidadFrp: 42.7,
    longitude: -2.9447,
    latitude: 43.2627,
    detectedAt: '2026-10-16T09:20:00Z',
  },
  {
    estado: 'Activo',
    origen: 'satelite',
    intensidadFrp: 96.4,
    longitude: -1.1307,
    latitude: 37.9922,
    detectedAt: '2026-10-16T09:40:00Z',
  },
  {
    estado: 'Controlado',
    origen: 'manual',
    intensidadFrp: null,
    longitude: -3.6921,
    latitude: 40.3476,
    detectedAt: '2026-10-16T09:50:00Z',
  },
  {
    estado: 'Activo',
    origen: 'manual',
    intensidadFrp: null,
    longitude: -4.7794,
    latitude: 37.8882,
    detectedAt: '2026-10-16T10:05:00Z',
  },
  {
    estado: 'Activo',
    origen: 'satelite',
    intensidadFrp: 73.9,
    longitude: -4.4214,
    latitude: 36.7213,
    detectedAt: '2026-10-16T10:15:00Z',
  },
  {
    estado: 'Estabilizado',
    origen: 'manual',
    intensidadFrp: null,
    longitude: -5.6635,
    latitude: 40.9701,
    detectedAt: '2026-10-16T10:25:00Z',
  },
  {
    estado: 'Activo',
    origen: 'satelite',
    intensidadFrp: 151.3,
    longitude: -7.0087,
    latitude: 42.3399,
    detectedAt: '2026-10-16T10:40:00Z',
  },
  {
    estado: 'Activo',
    origen: 'satelite',
    intensidadFrp: 58.6,
    longitude: -8.5448,
    latitude: 42.8782,
    detectedAt: '2026-10-16T10:55:00Z',
  },
  {
    estado: 'Controlado',
    origen: 'manual',
    intensidadFrp: null,
    longitude: -0.3768,
    latitude: 39.4699,
    detectedAt: '2026-10-16T11:10:00Z',
  },
  {
    estado: 'Activo',
    origen: 'satelite',
    intensidadFrp: 104.1,
    longitude: -0.8891,
    latitude: 41.6488,
    detectedAt: '2026-10-16T11:25:00Z',
  },
  {
    estado: 'Activo',
    origen: 'manual',
    intensidadFrp: null,
    longitude: -1.6177,
    latitude: 42.8169,
    detectedAt: '2026-10-16T11:40:00Z',
  },
  {
    estado: 'Estabilizado',
    origen: 'satelite',
    intensidadFrp: 37.8,
    longitude: -3.597,
    latitude: 37.1773,
    detectedAt: '2026-10-16T11:55:00Z',
  },
  {
    estado: 'Activo',
    origen: 'satelite',
    intensidadFrp: 126.4,
    longitude: -4.2518,
    latitude: 37.6167,
    detectedAt: '2026-10-16T12:10:00Z',
  },
  {
    estado: 'Controlado',
    origen: 'manual',
    intensidadFrp: null,
    longitude: -5.9305,
    latitude: 37.2636,
    detectedAt: '2026-10-16T12:25:00Z',
  },
  {
    estado: 'Activo',
    origen: 'satelite',
    intensidadFrp: 88.3,
    longitude: -6.9447,
    latitude: 38.8794,
    detectedAt: '2026-10-16T12:40:00Z',
  },
  {
    estado: 'Activo',
    origen: 'manual',
    intensidadFrp: null,
    longitude: -2.17,
    latitude: 41.7667,
    detectedAt: '2026-10-16T12:55:00Z',
  },
  {
    estado: 'Activo',
    origen: 'satelite',
    intensidadFrp: 69.5,
    longitude: -3.1661,
    latitude: 38.9861,
    detectedAt: '2026-10-16T13:10:00Z',
  },
  {
    estado: 'Estabilizado',
    origen: 'manual',
    intensidadFrp: null,
    longitude: -2.6833,
    latitude: 42.8467,
    detectedAt: '2026-10-16T13:25:00Z',
  },
  {
    estado: 'Activo',
    origen: 'satelite',
    intensidadFrp: 143.2,
    longitude: -5.8494,
    latitude: 43.3614,
    detectedAt: '2026-10-16T13:40:00Z',
  },
  {
    estado: 'Activo',
    origen: 'satelite',
    intensidadFrp: 91.7,
    longitude: -1.1398,
    latitude: 37.9838,
    detectedAt: '2026-10-16T13:55:00Z',
  },
];

const evacuationRoutes: EvacuationRouteSeed[] = [
  {
    nombre: 'Ruta de evacuación norte',
    color: '#16a34a',
    coordinates: [
      [-4.42, 39.02],
      [-4.36, 39.08],
      [-4.28, 39.14],
      [-4.18, 39.20],
    ],
  },
  {
    nombre: 'Ruta de evacuación oeste',
    color: '#2563eb',
    coordinates: [
      [-4.75, 38.98],
      [-4.67, 39.04],
      [-4.58, 39.10],
      [-4.48, 39.16],
    ],
  },
  {
    nombre: 'Ruta de evacuación sur',
    color: '#f59e0b',
    coordinates: [
      [-4.44, 38.92],
      [-4.38, 38.86],
      [-4.31, 38.80],
      [-4.24, 38.75],
    ],
  },
];

const meetingPoints: MeetingPointSeed[] = [
  {
    nombre: 'Punto de encuentro municipal',
    capacidad: 250,
    longitude: -4.18,
    latitude: 39.20,
  },
  {
    nombre: 'Pabellón deportivo',
    capacidad: 500,
    longitude: -4.48,
    latitude: 39.16,
  },
  {
    nombre: 'Área recreativa segura',
    capacidad: null,
    longitude: -4.24,
    latitude: 38.75,
  },
];

async function runSeeder() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await client.query(
      'TRUNCATE TABLE focos_activos RESTART IDENTITY',
    );

    for (const fire of fires) {
      await client.query(
        `
          INSERT INTO focos_activos (
            estado,
            origen,
            intensidad_frp,
            fecha_deteccion,
            geom
          )
          VALUES (
            $1,
            $2,
            $3,
            $4,
            ST_SetSRID(
              ST_MakePoint($5, $6),
              4326
            )
          )
        `,
        [
          fire.estado,
          fire.origen,
          fire.intensidadFrp,
          fire.detectedAt,
          fire.longitude,
          fire.latitude,
        ],
      );
    }

    await client.query(
      `
        TRUNCATE TABLE
          rutas_evacuacion,
          puntos_encuentro
        RESTART IDENTITY
      `,
    );

    for (const route of evacuationRoutes) {
      await client.query(
        `
          INSERT INTO rutas_evacuacion (
            nombre,
            color,
            geom
          )
          VALUES (
            $1,
            $2,
            ST_SetSRID(
              ST_GeomFromGeoJSON($3),
              4326
            )
          )
        `,
        [
          route.nombre,
          route.color,
          JSON.stringify({
            type: 'LineString',
            coordinates: route.coordinates,
          }),
        ],
      );
    }

    for (const point of meetingPoints) {
      await client.query(
        `
          INSERT INTO puntos_encuentro (
            nombre,
            capacidad,
            geom
          )
          VALUES (
            $1,
            $2,
            ST_SetSRID(
              ST_MakePoint($3, $4),
              4326
            )
          )
        `,
        [
          point.nombre,
          point.capacidad,
          point.longitude,
          point.latitude,
        ],
      );
    }

    await client.query('COMMIT');

    console.log(
      `✅ Se han insertado ${fires.length} focos, ` +
      `${evacuationRoutes.length} rutas y ` +
      `${meetingPoints.length} puntos de encuentro.`,
    );
  } catch (error) {
    await client.query('ROLLBACK');

    console.error(
      '❌ Error ejecutando el seeder:',
      error,
    );

    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

runSeeder();