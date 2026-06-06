const { Pool } = require('pg');

const isProduction = process.env.NODE_ENV === 'production';

const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: isProduction
        ? {
            rejectUnauthorized: false
          }
        : false
    })
  : new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT || 5434),
      database: process.env.DB_NAME || 'tienda_virtual',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || ''
    });

async function testConnection() {
  const result = await pool.query('SELECT NOW() AS fecha');
  console.log('Conexión PostgreSQL OK:', result.rows[0].fecha);
}

module.exports = { pool, testConnection };