import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import './config/env.js'
import authRoutes from './routes/authRoutes.js'
import menuRoutes from './routes/menuRoutes.js'
import { verifyDatabaseConnection, ensureMenuTable } from './config/db.js'

const app = express()
app.use(express.json())
app.use(cookieParser())
const allowedOrigins = ['http://localhost:5273', 'https://cafe-menu-sable.vercel.app']

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true)
    
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

const port = process.env.PORT || 4000

async function startServer() {
	try {
		console.log('[server] verifying Neon database connection...')
		await verifyDatabaseConnection()
		await ensureMenuTable()
		app.listen(port, () => console.log(`[server] listening on ${port}`))
	} catch (error) {
		console.error('[server] failed to connect to Neon database')
		console.error(error)
		process.exit(1)
	}
}

startServer()
