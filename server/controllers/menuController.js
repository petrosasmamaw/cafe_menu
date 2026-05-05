import { pool } from '../config/db.js'

export async function getMenu(req, res) {
  try {
    const { rows } = await pool.query('SELECT * FROM menu_items ORDER BY created_at DESC')
    res.json({ menu: rows })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}

export async function addMenuItem(req, res) {
  const { name, description, price, category, image_url, is_available } = req.body
  if (!name) return res.status(400).json({ error: 'Missing name' })
  try {
    const { rows } = await pool.query(
      'INSERT INTO menu_items(name, description, price, category, image_url, is_available) VALUES($1,$2,$3,$4,$5,$6) RETURNING *',
      [name, description, price, category, image_url, is_available]
    )
    res.json({ item: rows[0] })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}

export async function updateMenuItem(req, res) {
  const { id } = req.params
  const fields = req.body
  const sets = Object.keys(fields).map((k, i) => `${k}=$${i + 1}`).join(', ')
  const vals = Object.values(fields)
  try {
    const { rows } = await pool.query(`UPDATE menu_items SET ${sets} WHERE id=$${vals.length + 1} RETURNING *`, [...vals, id])
    res.json({ item: rows[0] })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}

export async function deleteMenuItem(req, res) {
  const { id } = req.params
  try {
    await pool.query('DELETE FROM menu_items WHERE id=$1', [id])
    res.json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}
