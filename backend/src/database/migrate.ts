import fs from 'fs';
import path from 'path';

import { pool } from './db';

async function runMigrations() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version VARCHAR(255) PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const migrationsDirectory = path.resolve(
      process.cwd(),
      'src/database/migrations',
    );

    const migrationFiles = fs
      .readdirSync(migrationsDirectory)
      .filter((fileName) => fileName.endsWith('.sql'))
      .sort();

    for (const fileName of migrationFiles) {
      const alreadyApplied = await client.query(
        `
          SELECT version
          FROM schema_migrations
          WHERE version = $1
        `,
        [fileName],
      );

      if (alreadyApplied.rowCount && alreadyApplied.rowCount > 0) {
        console.log(`⏭️  Migración ya aplicada: ${fileName}`);
        continue;
      }

      const migrationPath = path.join(
        migrationsDirectory,
        fileName,
      );

      const migrationSql = fs.readFileSync(
        migrationPath,
        'utf8',
      );

      console.log(`🚀 Ejecutando migración: ${fileName}`);

      await client.query(migrationSql);

      await client.query(
        `
          INSERT INTO schema_migrations (version)
          VALUES ($1)
        `,
        [fileName],
      );

      console.log(`✅ Migración aplicada: ${fileName}`);
    }

    await client.query('COMMIT');

    console.log('✅ Todas las migraciones han terminado correctamente.');
  } catch (error) {
    await client.query('ROLLBACK');

    console.error(
      '❌ Error ejecutando las migraciones:',
      error,
    );

    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations();