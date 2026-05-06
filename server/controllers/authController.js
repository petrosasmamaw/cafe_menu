import { createClient } from '@supabase/supabase-js'
import '../config/env.js'

function getSupa() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

function authUnavailableMessage() {
  return 'Supabase not configured. Set SUPABASE_URL and either SUPABASE_SERVICE_ROLE or SUPABASE_ANON_KEY (or VITE_SUPABASE_PUBLISHABLE_KEY) in env.'
}

export async function login(req, res) {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Missing credentials' })

  const supa = getSupa()
  if (!supa) return res.status(500).json({ error: authUnavailableMessage() })

  try {
    // Attempt to sign in with password
    const { data: signInData, error: signInError } = await supa.auth.signInWithPassword({ email, password })
    if (signInError) return res.status(401).json({ error: signInError.message })

    const session = signInData.session
    res.cookie('token', session.access_token, { httpOnly: true, secure: false, sameSite: 'lax' })
    return res.json({ user: signInData.user })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Server error' })
  }
}

export async function register(req, res) {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Missing credentials' })

  const supa = getSupa()
  if (!supa) return res.status(500).json({ error: authUnavailableMessage() })

  try {
    const { data, error } = await supa.auth.signUp({ email, password })
    if (error) return res.status(400).json({ error: error.message })

    const accessToken = data.session?.access_token
    if (accessToken) {
      res.cookie('token', accessToken, { httpOnly: true, secure: false, sameSite: 'lax' })
    }

    return res.status(201).json({ user: data.user, session: Boolean(data.session) })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Server error' })
  }
}

export async function logout(req, res) {
  res.clearCookie('token')
  res.json({ ok: true })
}

export async function me(req, res) {
  const supa = getSupa()
  if (!supa) return res.status(500).json({ user: null, error: 'Supabase not configured' })
  try {
    const token = req.cookies.token
    if (!token) return res.status(401).json({ user: null })
    const { data: userData, error } = await supa.auth.getUser(token)
    if (error || !userData?.user) return res.status(401).json({ user: null })
    return res.json({ user: userData.user })
  } catch (err) {
    console.error(err)
    return res.status(401).json({ user: null })
  }
}
