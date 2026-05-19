import React, { useState, useMemo } from 'react'
import AdminNavbar from '../components/AdminNavbar'
import { useGetMenuQuery, useAddMenuItemMutation, useUpdateMenuItemMutation, useDeleteMenuItemMutation } from '../store/api/menuApi'
const categories = ['All','Breakfast','Fasting Lunch','Non-Fasting Lunch','Cold Drinks','Hot Drinks','Juices','Pizza','Burger']

function Modal({open,onClose,children}){
  if(!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/35" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-lg border border-[#e8e4de] p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-end mb-4">
          <button onClick={onClose} className="text-gray-400 text-sm hover:text-[#1a1a1a] transition-colors flex items-center gap-1">Close</button>
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
    <div className="min-h-screen bg-[#fafaf8]">
      <AdminNavbar page="dashboard" onGoHome={() => { window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')) }} onGoComments={() => { window.history.pushState({}, '', '/admin/comments'); window.dispatchEvent(new PopStateEvent('popstate')) }} />

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
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
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-4">
            {filteredItems.map(it => (
              <div key={it.id} className="bg-white border border-[#e8e4de] rounded-xl overflow-hidden shadow-subtle">
                {/* Image */}
                <div className="relative">
                  <img src={it.image_url || 'https://via.placeholder.com/200'} alt={it.name} className="w-full h-24 sm:h-32 object-cover bg-[#f0ede8] rounded-t-xl" />
                </div>

                {/* Content */}
                <div className="p-2.5 sm:p-3">
                  <h3 className="text-sm sm:text-base font-medium text-[#1a1a1a] truncate mb-2">
                    {it.name}
                  </h3>
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm sm:text-base font-medium text-[#c77e3a]">
                      Birr {it.price}
                    </span>
                    <span className="bg-[#fdf3e8] text-[#a0621a] text-[9px] sm:text-xs px-2 py-0.5 rounded">
                      {it.category}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] sm:text-xs ${
                      it.is_available ? 'text-[#3a7a42]' : 'text-[#a32d2d]'
                    }`}>
                      {it.is_available ? '● Available' : '● Out of stock'}
                    </span>
                    <div className="flex gap-1.5">
                      <button 
                        onClick={()=>{ 
                          setForm({name:it.name, description:it.description||'', price:it.price, category:it.category||'Breakfast', image_url:it.image_url||'', is_available:!!it.is_available})
                          setEditingId(it.id)
                          setOpen(true)
                        }} 
                        className="bg-[#e8f0fb] text-[#2563b8] rounded px-2 py-1 text-[10px] sm:text-xs font-medium hover:opacity-90 transition-opacity"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={()=>del(it.id)} 
                        className="bg-[#fbe8e8] text-[#b82525] rounded px-2 py-1 text-[10px] sm:text-xs font-medium hover:opacity-90 transition-opacity"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      <Modal open={open} onClose={()=>{ setOpen(false); setEditingId(null); }}>
        <form onSubmit={handleSave} className="space-y-4">
          <h2 className="text-lg font-medium text-[#1a1a1a] mb-6">
            {editingId ? 'Edit Menu Item' : 'Add New Item'}
          </h2>

          <div>
            <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Item Name</label>
            <input 
              placeholder="e.g., Espresso Coffee" 
              value={form.name} 
              onChange={e=>setForm({...form,name:e.target.value})} 
              className="w-full bg-[#f5f3ef] border border-[#e8e4de] rounded-lg px-4 py-2.5 text-sm text-[#1a1a1a] placeholder-gray-400 focus:ring-2 focus:ring-[#c77e3a]/20"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Description</label>
            <textarea 
              placeholder="Brief description..." 
              value={form.description} 
              onChange={e=>setForm({...form,description:e.target.value})} 
              className="w-full bg-[#f5f3ef] border border-[#e8e4de] rounded-lg px-4 py-2.5 text-sm text-[#1a1a1a] placeholder-gray-400 focus:ring-2 focus:ring-[#c77e3a]/20 resize-none"
              rows="3"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Price (Birr)</label>
              <input 
                type="number" 
                step="0.01"
                min="0"
                placeholder="5.99" 
                value={form.price} 
                onChange={e=>setForm({...form,price:parseFloat(e.target.value)})} 
                className="w-full bg-[#f5f3ef] border border-[#e8e4de] rounded-lg px-4 py-2.5 text-sm text-[#1a1a1a] placeholder-gray-400 focus:ring-2 focus:ring-[#c77e3a]/20"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Category</label>
              <select 
                value={form.category} 
                onChange={e=>setForm({...form,category:e.target.value})} 
                className="w-full bg-[#f5f3ef] border border-[#e8e4de] rounded-lg px-4 py-2.5 text-sm text-[#1a1a1a] focus:ring-2 focus:ring-[#c77e3a]/20"
              >
                {categories.map(c=> (<option key={c} value={c} className="bg-white">{c}</option>))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Image URL</label>
            <input 
              type="url"
              placeholder="https://images.unsplash.com/..." 
              value={form.image_url} 
              onChange={e=>setForm({...form,image_url:e.target.value})} 
              className="w-full bg-[#f5f3ef] border border-[#e8e4de] rounded-lg px-4 py-2.5 text-sm text-[#1a1a1a] placeholder-gray-400 focus:ring-2 focus:ring-[#c77e3a]/20"
            />
            {form.image_url && (
              <div className="mt-3 rounded-lg overflow-hidden w-32 h-32 border border-[#e8e4de]">
                <img src={form.image_url} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                id="available" 
                type="checkbox" 
                checked={form.is_available} 
                onChange={e=>setForm({...form,is_available:e.target.checked})} 
                className="w-4 h-4 rounded border-gray-300 text-[#c77e3a] focus:ring-[#c77e3a]/20"
              />
              <span className="text-sm text-[#1a1a1a]">Available for sale</span>
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button 
              type="button" 
              onClick={()=>{ setOpen(false); setEditingId(null); }} 
              className="flex-1 bg-[#f0ede8] text-[#6b3e26] rounded-lg py-2.5 text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 bg-[#c77e3a] text-white rounded-lg py-2.5 text-sm font-medium hover:opacity-90 transition-opacity"
            >
              {editingId ? 'Save Changes' : 'Add Item'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}