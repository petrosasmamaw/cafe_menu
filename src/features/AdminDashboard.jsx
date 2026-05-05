import React, { useState } from 'react'
const categories = ['Breakfast','Fasting Lunch','Non-Fasting Lunch','Cold Drinks','Hot Drinks','Juices','Pizza','Burger']
import { useGetMenuQuery, useAddMenuItemMutation, useUpdateMenuItemMutation, useDeleteMenuItemMutation } from '../store/api/menuApi'

function Modal({open,onClose,children}){
  if(!open) return null
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-6">
      <div className="glass rounded-3xl p-8 w-full max-w-2xl backdrop-blur-xl border border-white/40">
        <div className="flex justify-end mb-6">
          <button onClick={onClose} className="px-4 py-2 bg-white/30 hover:bg-white/50 text-gray-900 rounded-xl transition-smooth font-semibold">✕ Close</button>
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
        background: 'linear-gradient(135deg, #3a3a3a 0%, #2a2a2a 15%, #5a5a5a 30%, #a0a0a0 50%, #d4a574 75%, #f5f1e8 100%)',
        backgroundColor: '#f5f1e8'
      }}
    >
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-orange-400/10 blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 rounded-full bg-amber-400/10 blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-yellow-400/10 blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
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
                className="px-4 py-2 glass text-gray-900 rounded-full font-semibold hover:bg-white/40 transition-smooth"
              >
                ← Back
              </button>
              <div>
                <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                  <span className="text-4xl">⚙️</span> Admin Dashboard
                </h1>
                <p className="text-gray-700 text-sm mt-1">Manage menu items, images and availability</p>
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
          <div className="glass rounded-3xl overflow-hidden backdrop-blur-xl border border-white/40">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/20 border-b border-white/30">
                  <tr>
                    <th className="px-6 py-4 text-left text-gray-900 font-bold">Image</th>
                    <th className="px-6 py-4 text-left text-gray-900 font-bold">Name</th>
                    <th className="px-6 py-4 text-left text-gray-900 font-bold">Category</th>
                    <th className="px-6 py-4 text-center text-gray-900 font-bold">Price</th>
                    <th className="px-6 py-4 text-center text-gray-900 font-bold">Status</th>
                    <th className="px-6 py-4 text-center text-gray-900 font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/20">
                  {isLoading ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-gray-700">Loading...</td>
                    </tr>
                  ) : items.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-gray-700">No items yet. Add your first menu item!</td>
                    </tr>
                  ) : items.map(it=> (
                    <tr key={it.id} className="hover:bg-white/10 transition-smooth">
                      <td className="px-6 py-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-white/20 flex items-center justify-center">
                          <img src={it.image_url || 'https://via.placeholder.com/80'} alt={it.name} className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">{it.name}</p>
                        <p className="text-sm text-gray-700 line-clamp-1">{it.description}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 text-xs rounded-full bg-[var(--accent)]/20 text-[var(--accent)] font-semibold">{it.category}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-lg font-bold text-[var(--accent)]">${it.price}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`text-xs font-bold ${it.is_available? 'text-green-700':'text-red-700'}`}>
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
                            className="px-3 py-1 text-sm bg-blue-300/40 hover:bg-blue-300/60 text-blue-800 rounded-lg transition-smooth font-semibold"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={()=>del(it.id)} 
                            className="px-3 py-1 text-sm bg-red-300/40 hover:bg-red-300/60 text-red-800 rounded-lg transition-smooth font-semibold"
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {editingId ? '✏️ Edit Item' : '✨ Add New Item'}
          </h2>

          <div>
            <label className="text-sm font-semibold text-gray-800 mb-2 block">Item Name</label>
            <input 
              placeholder="e.g., Espresso Coffee" 
              value={form.name} 
              onChange={e=>setForm({...form,name:e.target.value})} 
              className="w-full p-3 bg-white/50 border border-white/60 rounded-xl focus:ring-2 focus:ring-[var(--accent)] outline-none text-gray-900 placeholder:text-gray-600 transition-smooth"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-800 mb-2 block">Description</label>
            <textarea 
              placeholder="Brief description..." 
              value={form.description} 
              onChange={e=>setForm({...form,description:e.target.value})} 
              className="w-full p-3 bg-white/50 border border-white/60 rounded-xl focus:ring-2 focus:ring-[var(--accent)] outline-none text-gray-900 placeholder:text-gray-600 transition-smooth resize-none h-20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-800 mb-2 block">Price ($)</label>
              <input 
                type="number" 
                placeholder="5.99" 
                value={form.price} 
                onChange={e=>setForm({...form,price:parseFloat(e.target.value)})} 
                className="w-full p-3 bg-white/50 border border-white/60 rounded-xl focus:ring-2 focus:ring-[var(--accent)] outline-none text-gray-900 placeholder:text-gray-600 transition-smooth"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-800 mb-2 block">Category</label>
              <select 
                value={form.category} 
                onChange={e=>setForm({...form,category:e.target.value})} 
                className="w-full p-3 bg-white/50 border border-white/60 rounded-xl focus:ring-2 focus:ring-[var(--accent)] outline-none text-gray-900 transition-smooth"
              >
                {categories.map(c=> (<option key={c} value={c} className="bg-gray-100">{c}</option>))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-800 mb-2 block">Image URL</label>
            <input 
              placeholder="https://images.unsplash.com/..." 
              value={form.image_url} 
              onChange={e=>setForm({...form,image_url:e.target.value})} 
              className="w-full p-3 bg-white/50 border border-white/60 rounded-xl focus:ring-2 focus:ring-[var(--accent)] outline-none text-gray-900 placeholder:text-gray-600 transition-smooth"
            />
            {form.image_url && (
              <div className="mt-3 rounded-xl overflow-hidden w-32 h-32">
                <img src={form.image_url} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 bg-white/30 p-4 rounded-xl border border-white/40">
            <input 
              id="available" 
              type="checkbox" 
              checked={form.is_available} 
              onChange={e=>setForm({...form,is_available:e.target.checked})} 
              className="w-5 h-5 accent-[var(--accent)]"
            />
            <label htmlFor="available" className="text-gray-900 font-semibold cursor-pointer">Available for sale</label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button 
              type="button" 
              onClick={()=>{ setOpen(false); setEditingId(null); }} 
              className="px-6 py-2 bg-white/30 hover:bg-white/50 text-gray-900 rounded-xl transition-smooth font-semibold"
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
