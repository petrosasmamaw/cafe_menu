import React, { useState } from 'react'
const categories = ['Breakfast','Fasting Lunch','Non-Fasting Lunch','Cold Drinks','Hot Drinks','Juices','Pizza','Burger']
import { useGetMenuQuery, useAddMenuItemMutation, useUpdateMenuItemMutation, useDeleteMenuItemMutation } from '../store/api/menuApi'

function Modal({open,onClose,children}){
  if(!open) return null
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white/95 rounded-2xl p-6 w-full max-w-2xl shadow-2xl backdrop-blur-sm">
        <div className="flex justify-end">
          <button onClick={onClose} className="mb-4 px-3 py-1 rounded bg-gray-100">Close</button>
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
      // reset state
      setOpen(false)
      setEditingId(null)
      setForm({name:'',description:'',price:0,category:'Breakfast',image_url:'',is_available:true})
    }catch(err){
      console.error('Save failed', err)
    }
  }

  return (
    <div className="p-6 bg-gradient-to-br from-white to-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => { window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')) }} className="px-3 py-2 bg-white/80 rounded-lg shadow">Back to menu</button>
          <div>
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent">Admin Dashboard</h1>
            <p className="text-sm text-gray-600">Manage menu items, images and availability</p>
          </div>
        </div>
        <button onClick={()=>{ setForm({name:'',description:'',price:0,category:'Breakfast',image_url:'',is_available:true}); setEditingId(null); setOpen(true);} } className="px-4 py-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-2xl shadow">Add Item</button>
      </div>

      <div className="overflow-x-auto bg-white rounded-2xl shadow">
        <table className="w-full table-auto">
          <thead className="sticky top-0 bg-white">
            <tr>
              <th className="p-3 text-left">Image</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Available</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(it=> (
              <tr key={it.id} className="border-t hover:bg-gray-50">
                <td className="p-3">
                  <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100">
                    <img src={it.image_url || 'https://via.placeholder.com/80'} alt={it.name} className="w-full h-full object-cover" />
                  </div>
                </td>
                <td className="p-3">{it.name}</td>
                <td className="p-3"><span className="px-2 py-1 text-xs rounded-full bg-indigo-50 text-indigo-600">{it.category}</span></td>
                <td className="p-3">${it.price}</td>
                <td className="p-3">{it.is_available? <span className="text-sm text-green-600">Yes</span> : <span className="text-sm text-red-600">No</span>}</td>
                <td className="p-3">
                  <button onClick={()=>{ setForm({name:it.name, description:it.description||'', price:it.price, category:it.category||'Breakfast', image_url:it.image_url||'', is_available:!!it.is_available}); setEditingId(it.id); setOpen(true); }} className="mr-2 px-3 py-1 rounded bg-indigo-50 text-indigo-700">Edit</button>
                  <button onClick={()=>del(it.id)} className="px-3 py-1 rounded bg-red-50 text-red-700">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={open} onClose={()=>{ setOpen(false); setEditingId(null); }}>
        <form onSubmit={handleSave} className="space-y-4">
          <input placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-200 outline-none" />
          <input placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-200 outline-none" />
          <input type="number" placeholder="Price" value={form.price} onChange={e=>setForm({...form,price:parseFloat(e.target.value)})} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-200 outline-none" />
          <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-200 outline-none">
            {categories.map(c=> (<option key={c} value={c}>{c}</option>))}
          </select>
          <input placeholder="Image URL" value={form.image_url} onChange={e=>setForm({...form,image_url:e.target.value})} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-200 outline-none" />
          <div className="flex items-center gap-3">
            <label className="text-sm">Available</label>
            <input type="checkbox" checked={form.is_available} onChange={e=>setForm({...form,is_available:e.target.checked})} className="h-4 w-4" />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={()=>{ setOpen(false); setEditingId(null); }} className="px-4 py-2 rounded-lg bg-gray-100">Cancel</button>
            <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-500 text-white rounded-2xl">{editingId? 'Update' : 'Save'}</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
