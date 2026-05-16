import pkg from 'pg'
const { Pool } = pkg
import './env.js'

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
})

export async function verifyDatabaseConnection() {
  const result = await pool.query('SELECT NOW() AS server_time')
  console.log(`[db] Neon connected at ${result.rows[0].server_time}`)
  return result.rows[0]
}

export async function ensureMenuTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS menu_items (
      id BIGSERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      price NUMERIC(10,2) NOT NULL DEFAULT 0,
      category TEXT NOT NULL,
      image_url TEXT,
      is_available BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)
  console.log('[db] menu_items table ready')
}

export async function ensureCommentsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS comments (
      id BIGSERIAL PRIMARY KEY,
      name TEXT,
      comment TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)
  console.log('[db] comments table ready')
}
