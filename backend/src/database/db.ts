import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  user: process.env.DB_USER || 'admin',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'incendios_db',
  password: process.env.DB_PASSWORD || 'passwd',
  port: Number(process.env.DB_PORT) || 5432,
});

pool.on('error', (err) => {
  console.error('Error inesperado en el pool de la base de datos', err);
  process.exit(-1);
});