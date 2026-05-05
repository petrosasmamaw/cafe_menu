import React, { useState } from 'react'
const categories = ['Breakfast','Fasting Lunch','Non-Fasting Lunch','Cold Drinks','Hot Drinks','Juices','Pizza','Burger']
import { useGetMenuQuery, useAddMenuItemMutation, useUpdateMenuItemMutation, useDeleteMenuItemMutation } from '../store/api/menuApi'

function Modal({open,onClose,children}){
  if(!open) return null
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6">
      <div className="glass rounded-3xl p-8 w-full max-w-2xl backdrop-blur-xl border border-white/30">
        <div className="flex justify-end mb-6">
          <button onClick={onClose} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-smooth">✕ Close</button>
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

  return (
    <div className="min-h-screen relative"
      style={{
        background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.85) 0%, rgba(26, 26, 26, 0.9) 100%), radial-gradient(circle at 20% 50%, rgba(212, 165, 116, 0.1) 0%, transparent 50%)',
        backgroundColor: '#1a1a1a'
      }}
    >
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[var(--accent)]/8 blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 rounded-full bg-[var(--accent)]/5 blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-green-500/5 blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
      </div>

      {/* Content */}
      <div className="relative z-10 p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => { 
                  window.history.pushState({}, '', '/'); 
                  window.dispatchEvent(new PopStateEvent('popstate')) 
                }} 
                className="px-4 py-2 glass text-white rounded-full font-semibold hover:bg-white/20 transition-smooth"
              >
                ← Back
              </button>
              <div>
                <h1 className="text-3xl font-black text-white flex items-center gap-3">
                  <span className="text-4xl">⚙️</span> Admin Dashboard
                </h1>
                <p className="text-white/60 text-sm mt-1">Manage menu items, images and availability</p>
              </div>
            </div>
            <button 
              onClick={()=>{ 
                setForm({name:'',description:'',price:0,category:'Breakfast',image_url:'',is_available:true})
                setEditingId(null)
                setOpen(true)
              }} 
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-2xl hover:opacity-90 transition-smooth shadow-lg whitespace-nowrap"
            >
              + Add New Item
            </button>
          </div>

          {/* Table */}
          <div className="glass rounded-3xl overflow-hidden backdrop-blur-xl border border-white/30">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/10 border-b border-white/20">
                  <tr>
                    <th className="px-6 py-4 text-left text-white font-bold">Image</th>
                    <th className="px-6 py-4 text-left text-white font-bold">Name</th>
                    <th className="px-6 py-4 text-left text-white font-bold">Category</th>
                    <th className="px-6 py-4 text-center text-white font-bold">Price</th>
                    <th className="px-6 py-4 text-center text-white font-bold">Status</th>
                    <th className="px-6 py-4 text-center text-white font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {isLoading ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-white/60">Loading...</td>
                    </tr>
                  ) : items.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-white/60">No items yet. Add your first menu item!</td>
                    </tr>
                  ) : items.map(it=> (
                    <tr key={it.id} className="hover:bg-white/5 transition-smooth">
                      <td className="px-6 py-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-white/10 flex items-center justify-center">
                          <img src={it.image_url || 'https://via.placeholder.com/80'} alt={it.name} className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-white">{it.name}</p>
                        <p className="text-sm text-white/60 line-clamp-1">{it.description}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 text-xs rounded-full bg-[var(--accent)]/20 text-[var(--accent)] font-semibold">{it.category}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-lg font-bold text-[var(--accent)]">${it.price}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`text-xs font-bold ${it.is_available? 'text-green-400':'text-red-400'}`}>
                          {it.is_available? '✓ Available':'✗ Out'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex gap-2 justify-center">
                          <button 
                            onClick={()=>{ 
                              setForm({name:it.name, description:it.description||'', price:it.price, category:it.category||'Breakfast', image_url:it.image_url||'', is_available:!!it.is_available})
                              setEditingId(it.id)
                              setOpen(true)
                            }} 
                            className="px-3 py-1 text-sm bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-smooth"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={()=>del(it.id)} 
                            className="px-3 py-1 text-sm bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-smooth"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal open={open} onClose={()=>{ setOpen(false); setEditingId(null); }}>
        <form onSubmit={handleSave} className="space-y-5">
          <h2 className="text-2xl font-bold text-white mb-6">
            {editingId ? '✏️ Edit Item' : '✨ Add New Item'}
          </h2>

          <div>
            <label className="text-sm font-semibold text-white/80 mb-2 block">Item Name</label>
            <input 
              placeholder="e.g., Espresso Coffee" 
              value={form.name} 
              onChange={e=>setForm({...form,name:e.target.value})} 
              className="w-full p-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-[var(--accent)] outline-none text-white placeholder:text-white/50 transition-smooth"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-white/80 mb-2 block">Description</label>
            <textarea 
              placeholder="Brief description..." 
              value={form.description} 
              onChange={e=>setForm({...form,description:e.target.value})} 
              className="w-full p-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-[var(--accent)] outline-none text-white placeholder:text-white/50 transition-smooth resize-none h-20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-white/80 mb-2 block">Price ($)</label>
              <input 
                type="number" 
                placeholder="5.99" 
                value={form.price} 
                onChange={e=>setForm({...form,price:parseFloat(e.target.value)})} 
                className="w-full p-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-[var(--accent)] outline-none text-white placeholder:text-white/50 transition-smooth"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-white/80 mb-2 block">Category</label>
              <select 
                value={form.category} 
                onChange={e=>setForm({...form,category:e.target.value})} 
                className="w-full p-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-[var(--accent)] outline-none text-white transition-smooth"
              >
                {categories.map(c=> (<option key={c} value={c} className="bg-gray-900">{c}</option>))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-white/80 mb-2 block">Image URL</label>
            <input 
              placeholder="https://images.unsplash.com/..." 
              value={form.image_url} 
              onChange={e=>setForm({...form,image_url:e.target.value})} 
              className="w-full p-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-[var(--accent)] outline-none text-white placeholder:text-white/50 transition-smooth"
            />
            {form.image_url && (
              <div className="mt-3 rounded-xl overflow-hidden w-32 h-32">
                <img src={form.image_url} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/10">
            <input 
              id="available" 
              type="checkbox" 
              checked={form.is_available} 
              onChange={e=>setForm({...form,is_available:e.target.checked})} 
              className="w-5 h-5 accent-[var(--accent)]"
            />
            <label htmlFor="available" className="text-white font-semibold cursor-pointer">Available for sale</label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button 
              type="button" 
              onClick={()=>{ setOpen(false); setEditingId(null); }} 
              className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-smooth font-semibold"
            >
              Cancel
            </button>
            <button 
              className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:opacity-90 transition-smooth font-bold"
            >
              {editingId? '✓ Update Item' : '✨ Add Item'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
