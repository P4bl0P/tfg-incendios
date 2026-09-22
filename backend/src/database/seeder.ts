import fs from 'fs';
import path from 'path';
import { pool } from './db';

const runSeeder = async () => {
  try {
    console.log('⏳ Conectando a la base de datos...');
    
    // 1. Ejecutar el esquema (creación de tablas)
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('🏗️  Creando esquema y tablas...');
    await pool.query(schemaSql);
    console.log('✅ Tablas creadas con éxito.');

    // 2. Zona reservada para los Populates (mock data)
    // Cuando quieras meter datos de prueba, lo haremos aquí.
    
    console.log('🌱 Insertando datos de prueba...');
    await pool.query(`
      INSERT INTO focos_activos (estado, intensidad_frp, geom) 
      VALUES ('Activo', 85.5, ST_SetSRID(ST_MakePoint(-4.4, 39.0), 4326))
    `);
    console.log('✅ Datos inyectados.');
    

  } catch (error) {
    console.error('❌ Error al ejecutar el seeder:', error);
  } finally {
    await pool.end(); // Cerrar la conexión para que el script termine
    console.log('🛑 Conexión cerrada.');
  }
};

runSeeder();