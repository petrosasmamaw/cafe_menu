import { pool } from '../config/db.js'

export async function createComment(req, res) {
  try {
    const { name, comment } = req.body
    if (!comment || !String(comment).trim()) return res.status(400).json({ error: 'Comment is required' })

    const result = await pool.query(
      'INSERT INTO comments(name, comment) VALUES($1, $2) RETURNING id, name, comment, created_at',
      [name || null, comment]
    )

    return res.status(201).json({ comment: result.rows[0] })
  } catch (err) {
    console.error('createComment error', err)
    return res.status(500).json({ error: 'Server error' })
  }
}

export async function listComments(req, res) {
  try {
    const result = await pool.query('SELECT id, name, comment, created_at FROM comments ORDER BY created_at DESC')
    return res.json({ comments: result.rows })
  } catch (err) {
    console.error('listComments error', err)
    return res.status(500).json({ error: 'Server error' })
  }
}
