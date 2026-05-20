import React, { useState, useMemo } from 'react'
import AdminNavbar from '../components/AdminNavbar'
import { useGetMenuQuery, useAddMenuItemMutation, useUpdateMenuItemMutation, useDeleteMenuItemMutation } from '../store/api/menuApi'
const categories = ['All','Breakfast','Fasting Lunch','Non-Fasting Lunch','Cold Drinks','Hot Drinks','Juices','Pizza','Burger']

function Modal({open,onClose,children}){
  if(!open) return null
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(30,15,4,0.45)', backdropFilter: 'blur(8px)' }} onClick={onClose} />
      <div style={{ position: 'relative', background: '#ffffff', border: '1px solid #f0e8dc', borderRadius: '22px', width: '100%', maxWidth: '520px', padding: '24px', boxShadow: '0 32px 80px rgba(30,15,4,0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
          <div />
          <button onClick={onClose} style={{ background: '#f5f0e8', border: '1px solid #ede5d8', borderRadius: 8, padding: '6px 10px', color: '#9a8878', cursor: 'pointer' }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}

export default function AdminDashboard(){
  const { data, isLoading } = useGetMenuQuery()
  const [add] = useAddMenuItemMutation()
  const [update] = useUpdateMenuItemMutation()
  const [del] = useDeleteMenuItemMutation()

  const items = data?.menu || []
  const [open,setOpen] = useState(false)
  const [form,setForm] = useState({name:'',description:'',price:0,category:'Breakfast',image_url:'',is_available:true})
  const [editingId, setEditingId] = useState(null)
  const [cat, setCat] = useState('All')

  async function handleSave(e){
    e.preventDefault()
    try{
      if(editingId){
        await update({ id: editingId, ...form }).unwrap()
      }else{
        await add(form).unwrap()
      }
      setOpen(false)
      setEditingId(null)
      setForm({name:'',description:'',price:0,category:'Breakfast',image_url:'',is_available:true})
    }catch(err){
      console.error('Save failed', err)
    }
  }

  function normalize(str){
    return String(str || '').toLowerCase().replace(/-/g,' ').replace(/\s+/g,' ').trim()
  }

  function matchesCategory(itemCategory, selectedCategory){
    const normItem = normalize(itemCategory)
    const normSel = normalize(selectedCategory)
    if(normSel === 'all') return true
    const selTokens = normSel.split(' ').filter(Boolean)
    return selTokens.every(tok => {
      if(!tok) return true
      if(normItem.includes(tok)) return true
      if(tok.endsWith('s') && normItem.includes(tok.slice(0,-1))) return true
      if(tok.endsWith('ing') && normItem.includes(tok.replace(/ing$/,''))) return true
      return false
    })
  }

  async function checkComments() {
    const rawApiBase = import.meta.env.VITE_API_BASE || 'http://localhost:4002/api'
    const apiBase = rawApiBase.endsWith('/api') ? rawApiBase : rawApiBase.replace(/\/$/, '') + '/api'
    try {
      const res = await fetch(`${apiBase}/auth/me`, { credentials: 'include' })
      const d = await res.json()
      if (d?.user) {
        window.history.pushState({}, '', '/admin/comments')
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

  const filteredItems = useMemo(()=>{
    return items.filter(i => matchesCategory(i.category, cat))
  }, [items, cat])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; }
        .lol-root { min-height: 100vh; background: #faf7f2; background-image: radial-gradient(ellipse 70% 40% at 50% 0%, rgba(201,144,58,0.07) 0%, transparent 60%), radial-gradient(ellipse 50% 30% at 90% 10%, rgba(180,110,30,0.05) 0%, transparent 50%); }
        .lol-header { position: sticky; top: 0; z-index: 50; background: rgba(250,247,242,0.92); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border-bottom: 1px solid rgba(201,144,58,0.15); }
        .lol-card { background: #ffffff; border: 1px solid #f0e8dc; border-radius: 16px; overflow: hidden; }
        .lol-chip { padding: 8px 15px; border-radius: 30px; font-size: 12px; font-weight: 500; cursor: pointer; transition: all 0.2s ease; white-space: nowrap; border: 1px solid transparent; font-family: 'DM Sans', sans-serif; letter-spacing: 0.02em; display: inline-flex; align-items: center; gap: 5px; }
        .lol-chip-active { background: linear-gradient(135deg, #c9903a, #e8b86d); color: #fff; font-weight: 600; box-shadow: 0 4px 14px rgba(201,144,58,0.3); border-color: transparent; }
        .lol-chip-inactive { background: #f5f0e8; color: #9a8878; border-color: #ede5d8; }
        .lol-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
        @media (min-width: 1024px) { .lol-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
      `}</style>

      <div className="lol-root">
        <header className="lol-header" style={{ padding: '14px 20px' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
              <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #c9903a, #a06820)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(201,144,58,0.3)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1" /><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" /><line x1="6" y1="2" x2="6" y2="4" /><line x1="10" y1="2" x2="10" y2="4" /><line x1="14" y1="2" x2="14" y2="4" /></svg>
              </div>
              <div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '17px', fontWeight: '600', color: '#1e0f04' }}>LOL Café Admin</div>
                <div style={{ fontSize: '10px', color: '#c4b8a8', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Manage Menu</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => { window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')) }} style={{ background: '#f5f0e8', border: '1px solid #ede5d8', color: '#9a8878', borderRadius: '20px', padding: '7px 16px', fontSize: '12px' }}>Back to menu</button>
              <button onClick={checkComments} style={{ background: 'linear-gradient(135deg, #c9903a, #e8b86d)', border: 'none', color: '#fff', borderRadius: '20px', padding: '7px 18px', fontSize: '12px', fontWeight: 600 }}>Comments</button>
            </div>
          </div>
        </header>

        <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '28px 16px 64px' }}>
        {/* Category filter chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4 pb-1">
          {categories.map(c => (
            <button
              key={c}
              onClick={()=>setCat(c)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                cat === c
                  ? 'bg-[#c77e3a] text-white'
                  : 'bg-[#f0ede8] text-[#7a6a5a]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {isLoading && !items.length ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-sm">Loading...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-sm mb-4">No menu items found</p>
          </div>
        ) : (
          <div className="lol-grid">
            {filteredItems.map(it => (
              <div key={it.id} className="lol-card">
                <div style={{ position: 'relative', height: '180px', overflow: 'hidden', borderRadius: '16px 16px 0 0' }}>
                  <img src={it.image_url || 'https://via.placeholder.com/400'} alt={it.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(255,255,255,0.95)', color: '#9a6020', fontWeight: 700, fontSize: '13px', padding: '4px 11px', borderRadius: '20px' }}>Birr {it.price}</div>
                  <div style={{ position: 'absolute', top: '12px', left: '12px', background: it.is_available ? 'rgba(220,252,231,0.95)' : 'rgba(254,226,226,0.95)', color: it.is_available ? '#16a34a' : '#dc2626', fontSize: '10px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px', textTransform: 'uppercase' }}>{it.is_available ? 'Available' : 'Sold Out'}</div>
                </div>
                <div style={{ padding: '16px 18px 18px' }}>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '17px', fontWeight: 600, color: '#2c1a0a', marginBottom: '6px' }}>{it.name}</h3>
                  <p style={{ fontSize: '12px', color: '#9a8878', lineHeight: 1.6, marginBottom: '12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{it.description}</p>
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <button
                      onClick={()=>{ setForm({name:it.name, description:it.description||'', price:it.price, category:it.category||'Breakfast', image_url:it.image_url||'', is_available:!!it.is_available}); setEditingId(it.id); setOpen(true) }}
                      style={{ background: 'transparent', border: '1px solid rgba(37,99,184,0.14)', color: '#2563b8', padding: '6px 12px', borderRadius: '8px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', minWidth: '72px', textAlign: 'center' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(37,99,184,0.06)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={()=>del(it.id)}
                      style={{ background: 'transparent', border: '1px solid rgba(184,37,37,0.12)', color: '#b82525', padding: '6px 12px', borderRadius: '8px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', minWidth: '72px', textAlign: 'center' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(184,37,37,0.06)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        </main>

      {/* Modal */}
      <Modal open={open} onClose={()=>{ setOpen(false); setEditingId(null); }}>
        <form onSubmit={handleSave} style={{ display: 'grid', gap: '10px' }}>
          <div style={{ marginBottom: 6 }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 600, color: '#1a1a1a' }}>{editingId ? 'Edit Menu Item' : 'Add New Item'}</h2>
            <p style={{ fontSize: 12, color: '#c4b8a8', marginTop: 4 }}>Keep it short and sweet — changes save instantly on submit.</p>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, color: '#1a1a1a', marginBottom: 6, fontWeight: 600 }}>Item Name</label>
            <input placeholder="e.g., Espresso Coffee" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required style={{ width: '100%', background: '#f8f4ee', border: '1px solid #ede5d8', borderRadius: 10, padding: '9px 12px', fontSize: 13, color: '#1a1a1a' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, color: '#1a1a1a', marginBottom: 6, fontWeight: 600 }}>Description</label>
            <textarea placeholder="Brief description..." value={form.description} onChange={e=>setForm({...form,description:e.target.value})} rows={2} style={{ width: '100%', background: '#f8f4ee', border: '1px solid #ede5d8', borderRadius: 10, padding: '9px 12px', fontSize: 13, color: '#1a1a1a', resize: 'none' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#1a1a1a', marginBottom: 6, fontWeight: 600 }}>Price (Birr)</label>
              <input type="number" step="0.01" min="0" placeholder="5.99" value={form.price} onChange={e=>setForm({...form,price:parseFloat(e.target.value)})} required style={{ width: '100%', background: '#f8f4ee', border: '1px solid #ede5d8', borderRadius: 10, padding: '9px 12px', fontSize: 13 }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#1a1a1a', marginBottom: 6, fontWeight: 600 }}>Category</label>
              <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} style={{ width: '100%', background: '#f8f4ee', border: '1px solid #ede5d8', borderRadius: 10, padding: '9px 12px', fontSize: 13 }}>
                {categories.map(c=> (<option key={c} value={c}>{c}</option>))}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 12, color: '#1a1a1a', marginBottom: 6, fontWeight: 600 }}>Image URL</label>
              <input type="url" placeholder="https://images.unsplash.com/..." value={form.image_url} onChange={e=>setForm({...form,image_url:e.target.value})} style={{ width: '100%', background: '#f8f4ee', border: '1px solid #ede5d8', borderRadius: 10, padding: '9px 12px', fontSize: 13 }} />
            </div>
            {form.image_url && (
              <div style={{ width: 72, height: 72, borderRadius: 10, overflow: 'hidden', border: '1px solid #e8e4de' }}>
                <img src={form.image_url} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input id="available" type="checkbox" checked={form.is_available} onChange={e=>setForm({...form,is_available:e.target.checked})} style={{ width: 16, height: 16 }} />
              <span style={{ fontSize: 13, color: '#1a1a1a' }}>Available for sale</span>
            </label>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
            <button type="button" onClick={()=>{ setOpen(false); setEditingId(null); }} style={{ flex: 1, background: 'transparent', border: '1px solid rgba(107,62,38,0.12)', color: '#6b3e26', borderRadius: 10, padding: '10px 12px', fontWeight: 600 }}>Cancel</button>
            <button type="submit" style={{ flex: 1, background: 'linear-gradient(135deg, #c9903a, #e8b86d)', border: 'none', color: '#fff', borderRadius: 10, padding: '10px 12px', fontWeight: 700 }}>{editingId ? 'Save Changes' : 'Add Item'}</button>
          </div>
        </form>
      </Modal>
    </div>
    </>
  )
}