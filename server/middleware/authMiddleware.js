import { createClient } from '@supabase/supabase-js'
import '../config/env.js'

function getSupa(){
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY
  if(!url || !key) return null
  return createClient(url, key)
}

export async function requireAuth(req, res, next) {
  try {
    const supa = getSupa()
    if(!supa) return res.status(500).json({ error: 'Supabase not configured' })
    const token = req.cookies.token
    if (!token) return res.status(401).json({ error: 'Not authenticated' })
    const { data, error } = await supa.auth.getUser(token)
    if (error || !data?.user) return res.status(401).json({ error: 'Invalid token' })
    req.user = data.user
    next()
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}
