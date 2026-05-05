import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

const candidatePaths = [
  path.resolve(process.cwd(), '.env.local'),
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), '..', '.env.local'),
  path.resolve(process.cwd(), '..', '.env'),
]

for (const envPath of candidatePaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath, override: false })
  }
}

if (!process.env.SUPABASE_URL && process.env.VITE_SUPABASE_URL) {
  process.env.SUPABASE_URL = process.env.VITE_SUPABASE_URL
}

if (!process.env.SUPABASE_ANON_KEY && process.env.VITE_SUPABASE_PUBLISHABLE_KEY) {
  process.env.SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY
}

if (!process.env.DATABASE_URL && process.env.NEON_DB_URL) {
  process.env.DATABASE_URL = process.env.NEON_DB_URL
}
