import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGetMenuQuery } from '../store/api/menuApi'
import { useAddCommentMutation } from '../store/api/commentsApi'

const categories = ['All','Breakfast','Fasting Lunch','Non-Fasting Lunch','Cold Drinks','Hot Drinks','Juices','Pizza','Burger']

const categoryIcons = {
  'All': '✦',
  'Breakfast': '🌅',
  'Fasting Lunch': '🌿',
  'Non-Fasting Lunch': '🍽️',
  'Cold Drinks': '🧊',
  'Hot Drinks': '☕',
  'Juices': '🍊',
  'Pizza': '🍕',
  'Burger': '🍔',
}

function SkeletonCard() {
  return (
    <div className="lol-card" style={{ animation: 'lol-pulse 1.5s ease-in-out infinite' }}>
      <div style={{ height: '210px', background: '#ede8e0', borderRadius: '16px 16px 0 0' }} />
      <div style={{ padding: '18px 20px' }}>
        <div style={{ height: '15px', background: '#ede8e0', borderRadius: '8px', marginBottom: '10px', width: '65%' }} />
        <div style={{ height: '11px', background: '#ede8e0', borderRadius: '8px', width: '45%' }} />
      </div>
    </div>
  )
}

function MenuCard({ item }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="lol-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hovered
          ? '0 20px 50px rgba(120,80,30,0.15), 0 4px 16px rgba(0,0,0,0.06)'
          : '0 2px 12px rgba(0,0,0,0.06)',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
      }}
    >
      <div style={{ position: 'relative', height: '210px', overflow: 'hidden', borderRadius: '16px 16px 0 0' }}>
        <img
          src={item.image_url}
          alt={item.name}
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            transform: hovered ? 'scale(1.07)' : 'scale(1)',
            transition: 'transform 0.5s ease',
          }}
          onError={e => { e.target.style.display = 'none' }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(40,20,5,0.55) 0%, rgba(40,20,5,0.1) 45%, transparent 100%)',
        }} />

        {/* Price */}
        <div style={{
          position: 'absolute', top: '12px', right: '12px',
          background: 'rgba(255,255,255,0.95)',
          color: '#9a6020',
          fontWeight: '700',
          fontSize: '13px',
          padding: '4px 11px',
          borderRadius: '20px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.12)',
          letterSpacing: '0.01em',
        }}>
          Birr {item.price}
        </div>

        {/* Availability */}
        <div style={{
          position: 'absolute', top: '12px', left: '12px',
          background: item.is_available ? 'rgba(220,252,231,0.95)' : 'rgba(254,226,226,0.95)',
          color: item.is_available ? '#16a34a' : '#dc2626',
          fontSize: '10px',
          fontWeight: '700',
          padding: '3px 10px',
          borderRadius: '20px',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}>
          {item.is_available ? 'Available' : 'Sold Out'}
        </div>

        {/* Category on image */}
        <div style={{
          position: 'absolute', bottom: '12px', left: '14px',
          color: 'rgba(255,248,235,0.9)',
          fontSize: '10px',
          fontWeight: '500',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}>
          {item.category}
        </div>
      </div>

      <div style={{ padding: '16px 18px 18px' }}>
        <h3 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '17px',
          fontWeight: '600',
          color: '#2c1a0a',
          marginBottom: '5px',
          lineHeight: '1.3',
          letterSpacing: '0.01em',
        }}>
          {item.name}
        </h3>
        <p style={{
          fontSize: '12px',
          color: '#9a8878',
          lineHeight: '1.6',
          marginBottom: '14px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {item.description}
        </p>
        <button
          className="lol-order-btn"
          style={{
            width: '100%',
            padding: '10px',
            background: hovered ? 'linear-gradient(135deg, #c9903a, #e8b86d)' : 'transparent',
            border: `1px solid ${hovered ? '#c9903a' : '#e8ddd0'}`,
            borderRadius: '10px',
            color: hovered ? '#fff' : '#b07830',
            fontSize: '12px',
            fontWeight: '700',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            fontFamily: "'DM Sans', sans-serif",
            boxShadow: hovered ? '0 4px 16px rgba(201,144,58,0.3)' : 'none',
          }}
        >
          Order Now
        </button>
      </div>
    </motion.div>
  )
}

export default function Home() {
  const { data, isLoading } = useGetMenuQuery()
  const [addComment] = useAddCommentMutation()
  const [commentOpen, setCommentOpen] = useState(false)
  const [commentForm, setCommentForm] = useState({ name: '', comment: '' })
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('All')

  const items = data?.menu || []

  async function checkAdmin() {
    const rawApiBase = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'
    const apiBase = rawApiBase.endsWith('/api') ? rawApiBase : rawApiBase.replace(/\/$/, '') + '/api'
    try {
      const res = await fetch(`${apiBase}/auth/me`, { credentials: 'include' })
      const d = await res.json()
      if (d?.user) {
        window.history.pushState({}, '', '/admin')
      } else {
        window.history.pushState({}, '', '/admin/login')
      }
      window.dispatchEvent(new PopStateEvent('popstate'))
    } catch (err) {
      console.error('Session check failed', err)
      window.history.pushState({}, '', '/admin/login')
      window.dispatchEvent(new PopStateEvent('popstate'))
    }
  }

  function normalize(str) {
    return String(str || '').toLowerCase().replace(/-/g, ' ').replace(/\s+/g, ' ').trim()
  }

  function matchesCategory(itemCategory, selectedCategory) {
    const normItem = normalize(itemCategory)
    const normSel = normalize(selectedCategory)
    if (normSel === 'all') return true
    const selTokens = normSel.split(' ').filter(Boolean)
    return selTokens.every(tok => {
      if (!tok) return true
      if (normItem.includes(tok)) return true
      if (tok.endsWith('s') && normItem.includes(tok.slice(0, -1))) return true
      if (tok.endsWith('ing') && normItem.includes(tok.replace(/ing$/, ''))) return true
      return false
    })
  }

  const filtered = useMemo(() => {
    return items.filter(i => {
      if (!matchesCategory(i.category, cat)) return false
      if (q.trim() && !((i.name + ' ' + (i.description || '')).toLowerCase().includes(q.toLowerCase()))) return false
      return true
    })
  }, [items, q, cat])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #faf7f2;
          font-family: 'DM Sans', sans-serif;
        }

        .lol-root {
          min-height: 100vh;
          background: #faf7f2;
          background-image:
            radial-gradient(ellipse 70% 40% at 50% 0%, rgba(201,144,58,0.07) 0%, transparent 60%),
            radial-gradient(ellipse 50% 30% at 90% 10%, rgba(180,110,30,0.05) 0%, transparent 50%);
        }

        .lol-header {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(250,247,242,0.92);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(201,144,58,0.15);
        }

        .lol-card {
          background: #ffffff;
          border: 1px solid #f0e8dc;
          border-radius: 16px;
          overflow: hidden;
          cursor: pointer;
        }

        .lol-chip {
          padding: 8px 15px;
          border-radius: 30px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
          border: 1px solid transparent;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.02em;
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }

        .lol-chip-active {
          background: linear-gradient(135deg, #c9903a, #e8b86d);
          color: #fff;
          font-weight: 600;
          box-shadow: 0 4px 14px rgba(201,144,58,0.3);
          border-color: transparent;
        }

        .lol-chip-inactive {
          background: #f5f0e8;
          color: #9a8878;
          border-color: #ede5d8;
        }

        .lol-chip-inactive:hover {
          background: #fef3e2;
          color: #b07830;
          border-color: rgba(201,144,58,0.3);
        }

        .lol-search {
          width: 100%;
          background: #f5f0e8;
          border: 1px solid #ede5d8;
          border-radius: 12px;
          padding: 11px 16px 11px 42px;
          font-size: 14px;
          color: #2c1a0a;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }

        .lol-search::placeholder { color: #c4b8a8; }

        .lol-search:focus {
          border-color: #c9903a;
          background: #fffdf9;
          box-shadow: 0 0 0 3px rgba(201,144,58,0.1);
        }

        .lol-modal-input {
          width: 100%;
          background: #f8f4ee;
          border: 1px solid #ede5d8;
          border-radius: 10px;
          padding: 11px 14px;
          font-size: 14px;
          color: #2c1a0a;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .lol-modal-input:focus {
          border-color: #c9903a;
          box-shadow: 0 0 0 3px rgba(201,144,58,0.1);
        }

        .lol-modal-input::placeholder { color: #c4b8a8; }

        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        .divider-gold {
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(201,144,58,0.25), transparent);
          max-width: 700px;
          margin: 0 auto;
        }

        @keyframes lol-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>

      <div className="lol-root">

        {/* ── HERO ── */}

        <div style={{ padding: '32px 16px 0' }}>
          <div className="divider-gold" />
        </div>

        {/* ── STICKY HEADER ── */}
        <header className="lol-header" id="menu-section">
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '14px 20px' }}>

            {/* Top row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
                <div style={{
                  width: '36px', height: '36px',
                  background: 'linear-gradient(135deg, #c9903a, #a06820)',
                  borderRadius: '10px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 4px 12px rgba(201,144,58,0.3)',
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
                    <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
                    <line x1="6" y1="2" x2="6" y2="4" />
                    <line x1="10" y1="2" x2="10" y2="4" />
                    <line x1="14" y1="2" x2="14" y2="4" />
                  </svg>
                </div>
                <div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '17px', fontWeight: '600', color: '#1e0f04', lineHeight: 1.2 }}>LOL Café</div>
                  <div style={{ fontSize: '10px', color: '#c4b8a8', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Premium Menu</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setCommentOpen(true)}
                  style={{
                    background: '#f5f0e8',
                    border: '1px solid #ede5d8',
                    color: '#9a8878',
                    borderRadius: '20px',
                    padding: '7px 16px',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    fontFamily: "'DM Sans', sans-serif",
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#fef3e2'; e.currentTarget.style.color = '#b07830'; e.currentTarget.style.borderColor = '#c9903a' }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#f5f0e8'; e.currentTarget.style.color = '#9a8878'; e.currentTarget.style.borderColor = '#ede5d8' }}
                >
                  ✦ Comment
                </button>
                <button
                  onClick={checkAdmin}
                  style={{
                    background: 'linear-gradient(135deg, #c9903a, #e8b86d)',
                    border: 'none',
                    color: '#fff',
                    borderRadius: '20px',
                    padding: '7px 18px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontFamily: "'DM Sans', sans-serif",
                    letterSpacing: '0.04em',
                    boxShadow: '0 3px 10px rgba(201,144,58,0.3)',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 5px 16px rgba(201,144,58,0.45)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 3px 10px rgba(201,144,58,0.3)'; e.currentTarget.style.transform = 'translateY(0)' }}
                >
                  Admin
                </button>
              </div>
            </div>

            {/* Search */}
            <div style={{ position: 'relative', marginBottom: '12px' }}>
              <svg style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '15px', height: '15px', pointerEvents: 'none' }} fill="none" viewBox="0 0 24 24" stroke="#c4b8a8" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search dishes..."
                value={q}
                onChange={e => setQ(e.target.value)}
                className="lol-search"
              />
            </div>

            {/* Category chips */}
            <div className="no-scrollbar" style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '2px' }}>
              {categories.map(c => (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={`lol-chip ${cat === c ? 'lol-chip-active' : 'lol-chip-inactive'}`}
                >
                  {categoryIcons[c]} {c}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* ── COMMENT MODAL ── */}
        <AnimatePresence>
          {commentOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed', inset: 0, zIndex: 100,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '16px',
              }}
            >
              <div
                style={{ position: 'absolute', inset: 0, background: 'rgba(30,15,4,0.45)', backdropFilter: 'blur(8px)' }}
                onClick={() => setCommentOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  position: 'relative',
                  background: '#ffffff',
                  border: '1px solid #f0e8dc',
                  borderRadius: '22px',
                  width: '100%', maxWidth: '460px',
                  padding: '32px',
                  boxShadow: '0 32px 80px rgba(30,15,4,0.2)',
                  maxHeight: '90vh', overflowY: 'auto',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '26px' }}>
                  <div>
                    <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '26px', fontWeight: '600', color: '#1e0f04', lineHeight: 1.2 }}>Leave a Comment</h2>
                    <p style={{ fontSize: '12px', color: '#c4b8a8', marginTop: '4px' }}>We'd love to hear from you</p>
                  </div>
                  <button
                    onClick={() => setCommentOpen(false)}
                    style={{
                      background: '#f5f0e8',
                      border: '1px solid #ede5d8',
                      borderRadius: '8px',
                      width: '32px', height: '32px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', color: '#9a8878', fontSize: '14px',
                      transition: 'all 0.2s', flexShrink: 0,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#fef3e2'; e.currentTarget.style.color = '#b07830' }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#f5f0e8'; e.currentTarget.style.color = '#9a8878' }}
                  >✕</button>
                </div>

                <form onSubmit={async (e) => {
                  e.preventDefault()
                  try {
                    await addComment(commentForm).unwrap()
                    setCommentForm({ name: '', comment: '' })
                    setCommentOpen(false)
                    alert('Thanks — your comment was submitted!')
                  } catch (err) {
                    console.error('Comment submit error', err)
                    alert('Failed to submit comment')
                  }
                }}>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '10px', color: '#b0a090', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '8px', fontWeight: '600' }}>
                      Your Name
                    </label>
                    <input
                      value={commentForm.name}
                      onChange={(e) => setCommentForm({ ...commentForm, name: e.target.value })}
                      placeholder="Optional"
                      className="lol-modal-input"
                    />
                  </div>
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '10px', color: '#b0a090', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '8px', fontWeight: '600' }}>
                      Comment
                    </label>
                    <textarea
                      value={commentForm.comment}
                      onChange={(e) => setCommentForm({ ...commentForm, comment: e.target.value })}
                      placeholder="Share your feedback..."
                      required
                      rows={4}
                      className="lol-modal-input"
                      style={{ resize: 'none' }}
                    />
                  </div>
                  <button
                    type="submit"
                    style={{
                      width: '100%',
                      background: 'linear-gradient(135deg, #c9903a, #e8b86d)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '14px',
                      fontSize: '12px',
                      fontWeight: '700',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      fontFamily: "'DM Sans', sans-serif",
                      boxShadow: '0 4px 18px rgba(201,144,58,0.35)',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 26px rgba(201,144,58,0.5)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 18px rgba(201,144,58,0.35)'; e.currentTarget.style.transform = 'translateY(0)' }}
                  >
                    Send Comment
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── MENU GRID ── */}
        <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '28px 16px 64px' }}>

          {!isLoading && filtered.length > 0 && (
            <div style={{ marginBottom: '22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '12px', color: '#c4b8a8' }}>
                <span style={{ color: '#c9903a', fontWeight: '600' }}>{filtered.length}</span>
                {' '}items{cat !== 'All' ? ` · ${cat}` : ''}
              </div>
              {q && (
                <button onClick={() => setQ('')} style={{ fontSize: '11px', color: '#c4b8a8', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontFamily: "'DM Sans', sans-serif" }}>
                  Clear search
                </button>
              )}
            </div>
          )}

          {isLoading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '80px 20px' }}>
              <div style={{ fontSize: '44px', marginBottom: '16px' }}>☕</div>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', color: '#c4b8a8', marginBottom: '8px' }}>Nothing found</p>
              <p style={{ fontSize: '13px', color: '#d4c8b8' }}>Try a different search or category</p>
            </motion.div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {filtered.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.4 }}
                >
                  <MenuCard item={item} />
                </motion.div>
              ))}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer style={{
          borderTop: '1px solid #f0e8dc',
          padding: '28px 24px',
          textAlign: 'center',
          background: '#fff',
        }}>
          <p style={{ fontSize: '11px', color: '#d4c8b8', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            ✦ LOL Café · Bahir Dar · Crafted with Love ✦
          </p>
        </footer>

      </div>
    </>
  )
}