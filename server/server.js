import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import './config/env.js'
import authRoutes from './routes/authRoutes.js'
import menuRoutes from './routes/menuRoutes.js'
import commentsRoutes from './routes/commentsRoutes.js'
import { verifyDatabaseConnection, ensureMenuTable, ensureCommentsTable } from './config/db.js'

const app = express()
app.use(express.json())
app.use(cookieParser())
// Allow Express to trust proxy headers (needed when running behind platforms like Render)
app.set('trust proxy', 1)
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5273',
  'https://cafe-menu-sable.vercel.app',
  // allow frontend origin from env when deployed
  process.env.FRONTEND_URL,
].filter(Boolean)

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true)
    // debug log for origin checks
    console.log('[cors] incoming origin:', origin, 'allowed?', allowedOrigins.includes(origin))
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}

app.use(cors(corsOptions))

app.use('/api/auth', authRoutes)
app.use('/api/menu', menuRoutes)
app.use('/api/comments', commentsRoutes)

const port = process.env.PORT || 4000

async function startServer() {
  try {
    console.log('[server] verifying Neon database connection...')
    await verifyDatabaseConnection()
    await ensureMenuTable()
    await ensureCommentsTable()
    app.listen(port, () => console.log(`[server] listening on ${port}`))
  } catch (error) {
    console.warn('[server] warning: failed to initialize database — continuing without DB')
    console.warn(error)
    // Start server even if DB checks fail so endpoints that do not depend on DB (auth via Supabase)
    // can still be used during local development.
    app.listen(port, () => console.log(`[server] listening on ${port} (DB unavailable)`))
  }
}

startServer()
