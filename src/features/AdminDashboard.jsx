import React, { useState } from 'react'
const categories = ['Breakfast','Fasting Lunch','Non-Fasting Lunch','Cold Drinks','Hot Drinks','Juices','Pizza','Burger']
import { useGetMenuQuery, useAddMenuItemMutation, useUpdateMenuItemMutation, useDeleteMenuItemMutation } from '../store/api/menuApi'

const bgImage = 'https://images.openai.com/static-rsc-4/6WeZC4eUWalWirG924LJPD6RR7ixBZ4-3-nfFmZvWGU4MvCsEBISmLXditOqTZpfQVEPVmGlnxb0TZyOCllRJQcPTPGq217HvV_-qCIBAUXfcwu5TCpbSvtuBw40f6MIBntYEblhaGsibQJI4W-5fvYjwgHVoSmSy6FXGiVG3bN39NDB-uxxgR0y65btrezd?purpose=fullsize'

function Modal({open,onClose,children}){
  if(!open) return null
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6">
      <div className="glass rounded-3xl p-6 sm:p-8 w-full max-w-2xl backdrop-blur-xl border border-white/40 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-end mb-4 sm:mb-6">
          <button onClick={onClose} className="px-3 sm:px-4 py-2 bg-white/30 hover:bg-white/50 text-gray-900 rounded-xl transition-smooth font-semibold text-sm sm:text-base">✕ Close</button>
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
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)), url('${bgImage}')`,
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Content */}
      <div className="relative z-10 p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
              <button 
                onClick={() => { 
                  window.history.pushState({}, '', '/'); 
                  window.dispatchEvent(new PopStateEvent('popstate')) 
                }} 
                className="px-3 sm:px-4 py-2 glass text-gray-900 rounded-full font-semibold hover:bg-white/40 transition-smooth text-sm sm:text-base"
              >
                ← Back
              </button>
              <div>
                <h1 className="text-xl sm:text-3xl font-black text-gray-900 flex items-center gap-2 sm:gap-3">
                  <span className="text-3xl sm:text-4xl">⚙️</span> <span className="hidden sm:inline">Admin Dashboard</span><span className="sm:hidden">Admin</span>
                </h1>
                <p className="text-gray-700 text-xs sm:text-sm mt-1">Manage menu items, images and availability</p>
              </div>
            </div>
            <button 
              onClick={()=>{ 
                setForm({name:'',description:'',price:0,category:'Breakfast',image_url:'',is_available:true})
                setEditingId(null)
                setOpen(true)
              }} 
              className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-2xl hover:opacity-90 transition-smooth shadow-lg whitespace-nowrap text-sm sm:text-base"
            >
              + Add Item
            </button>
          </div>

          {/* Items Container */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {isLoading ? (
              <div className="col-span-full text-center py-12 text-gray-700">Loading...</div>
            ) : items.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-700">No items yet. Add your first menu item!</div>
            ) : items.map(it=> (
              <div key={it.id} className="glass rounded-2xl p-4 sm:p-6 backdrop-blur-xl border border-white/40 hover:border-white/60 transition-smooth group">
                {/* Item Image */}
                <div className="w-full h-40 sm:h-48 rounded-xl overflow-hidden bg-white/20 flex items-center justify-center mb-4">
                  <img src={it.image_url || 'https://via.placeholder.com/200'} alt={it.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                </div>
                
                {/* Item Info */}
                <div className="mb-4">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h3 className="font-bold text-gray-900 text-base sm:text-lg leading-tight">{it.name}</h3>
                    <span className={`text-xs sm:text-sm font-bold whitespace-nowrap ${it.is_available? 'text-green-700':'text-red-700'}`}>
                      {it.is_available? '✓ In':'✗ Out'}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-700 line-clamp-2 mb-2">{it.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="px-3 py-1 text-xs rounded-full bg-[var(--accent)]/20 text-[var(--accent)] font-semibold">{it.category}</span>
                    <span className="text-lg sm:text-xl font-bold text-[var(--accent)]">${it.price}</span>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex gap-2 flex-col sm:flex-row">
                  <button 
                    onClick={()=>{ 
                      setForm({name:it.name, description:it.description||'', price:it.price, category:it.category||'Breakfast', image_url:it.image_url||'', is_available:!!it.is_available})
                      setEditingId(it.id)
                      setOpen(true)
                    }} 
                    className="flex-1 px-3 py-2 text-xs sm:text-sm bg-blue-300/40 hover:bg-blue-300/60 text-blue-800 rounded-lg transition-smooth font-semibold"
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    onClick={()=>del(it.id)} 
                    className="flex-1 px-3 py-2 text-xs sm:text-sm bg-red-300/40 hover:bg-red-300/60 text-red-800 rounded-lg transition-smooth font-semibold"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal open={open} onClose={()=>{ setOpen(false); setEditingId(null); }}>
        <form onSubmit={handleSave} className="space-y-4 sm:space-y-5">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
            {editingId ? '✏️ Edit Item' : '✨ Add New Item'}
          </h2>

          <div>
            <label className="text-xs sm:text-sm font-semibold text-gray-800 mb-2 block">Item Name</label>
            <input 
              placeholder="e.g., Espresso Coffee" 
              value={form.name} 
              onChange={e=>setForm({...form,name:e.target.value})} 
              className="w-full p-2 sm:p-3 bg-white/50 border border-white/60 rounded-xl focus:ring-2 focus:ring-[var(--accent)] outline-none text-gray-900 placeholder:text-gray-600 transition-smooth text-sm sm:text-base"
            />
          </div>

          <div>
            <label className="text-xs sm:text-sm font-semibold text-gray-800 mb-2 block">Description</label>
            <textarea 
              placeholder="Brief description..." 
              value={form.description} 
              onChange={e=>setForm({...form,description:e.target.value})} 
              className="w-full p-2 sm:p-3 bg-white/50 border border-white/60 rounded-xl focus:ring-2 focus:ring-[var(--accent)] outline-none text-gray-900 placeholder:text-gray-600 transition-smooth resize-none h-20 text-sm sm:text-base"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="text-xs sm:text-sm font-semibold text-gray-800 mb-2 block">Price ($)</label>
              <input 
                type="number" 
                placeholder="5.99" 
                value={form.price} 
                onChange={e=>setForm({...form,price:parseFloat(e.target.value)})} 
                className="w-full p-2 sm:p-3 bg-white/50 border border-white/60 rounded-xl focus:ring-2 focus:ring-[var(--accent)] outline-none text-gray-900 placeholder:text-gray-600 transition-smooth text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="text-xs sm:text-sm font-semibold text-gray-800 mb-2 block">Category</label>
              <select 
                value={form.category} 
                onChange={e=>setForm({...form,category:e.target.value})} 
                className="w-full p-2 sm:p-3 bg-white/50 border border-white/60 rounded-xl focus:ring-2 focus:ring-[var(--accent)] outline-none text-gray-900 transition-smooth text-sm sm:text-base"
              >
                {categories.map(c=> (<option key={c} value={c} className="bg-gray-100">{c}</option>))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs sm:text-sm font-semibold text-gray-800 mb-2 block">Image URL</label>
            <input 
              placeholder="https://images.unsplash.com/..." 
              value={form.image_url} 
              onChange={e=>setForm({...form,image_url:e.target.value})} 
              className="w-full p-2 sm:p-3 bg-white/50 border border-white/60 rounded-xl focus:ring-2 focus:ring-[var(--accent)] outline-none text-gray-900 placeholder:text-gray-600 transition-smooth text-sm sm:text-base"
            />
            {form.image_url && (
              <div className="mt-3 rounded-xl overflow-hidden w-32 h-32">
                <img src={form.image_url} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 bg-white/30 p-3 sm:p-4 rounded-xl border border-white/40">
            <input 
              id="available" 
              type="checkbox" 
              checked={form.is_available} 
              onChange={e=>setForm({...form,is_available:e.target.checked})} 
              className="w-5 h-5 accent-[var(--accent)]"
            />
            <label htmlFor="available" className="text-gray-900 font-semibold cursor-pointer text-sm sm:text-base">Available for sale</label>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
            <button 
              type="button" 
              onClick={()=>{ setOpen(false); setEditingId(null); }} 
              className="px-4 sm:px-6 py-2 bg-white/30 hover:bg-white/50 text-gray-900 rounded-xl transition-smooth font-semibold text-sm sm:text-base"
            >
              Cancel
            </button>
            <button 
              className="px-4 sm:px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:opacity-90 transition-smooth font-bold text-sm sm:text-base"
            >
              {editingId? '✓ Update Item' : '✨ Add Item'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
