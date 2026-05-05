import React, { useState, useMemo } from 'react'
import { useGetMenuQuery } from '../store/api/menuApi'

const categories = ['All','Breakfast','Fasting Lunch','Non-Fasting Lunch','Cold Drinks','Hot Drinks','Juices','Pizza','Burger']

function SkeletonCard(){
  return (
    <div className="animate-pulse bg-white rounded-2xl shadow p-4">
      <div className="h-40 bg-gray-200 rounded-lg mb-4" />
      <div className="h-4 bg-gray-200 rounded mb-2 w-3/4" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
    </div>
  )
}

function MenuCard({item}){
  return (
    <div className="bg-white rounded-2xl shadow hover:shadow-lg transform hover:scale-105 transition duration-300 overflow-hidden">
      <img src={item.image_url} alt="" className="w-full h-44 object-cover" />
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-lg">{item.name}</h3>
          <span className="text-amber-600 font-semibold">${item.price}</span>
        </div>
        <p className="text-sm text-gray-600 mt-2">{item.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="px-2 py-1 bg-[var(--muted)] rounded-full text-xs">{item.category}</span>
          <span className={`text-sm ${item.is_available? 'text-green-600':'text-red-500'}`}>{item.is_available? 'Available':'Unavailable'}</span>
        </div>
      </div>
    </div>
  )
}

export default function Home(){
  const { data, isLoading } = useGetMenuQuery()
  const [q,setQ] = useState('')
  const [cat,setCat] = useState('All')

  const items = data?.menu || []

  function normalize(str){
    return String(str || '').toLowerCase().replace(/-/g,' ').replace(/\s+/g,' ').trim()
  }

  function matchesCategory(itemCategory, selectedCategory){
    const normItem = normalize(itemCategory)
    const normSel = normalize(selectedCategory)
    if(normSel === 'all') return true
    const selTokens = normSel.split(' ').filter(Boolean)
    // every token in the selected category should be present in the item category (allow plural/singular)
    return selTokens.every(tok => {
      if(!tok) return true
      if(normItem.includes(tok)) return true
      // allow matching plural/singular (drinks -> drink)
      if(tok.endsWith('s') && normItem.includes(tok.slice(0,-1))) return true
      if(tok.endsWith('ing') && normItem.includes(tok.replace(/ing$/,''))) return true
      return false
    })
  }

  const filtered = useMemo(()=>{
    return items.filter(i=>{
      if(!matchesCategory(i.category, cat)) return false
      if(q.trim() && !(`${i.name} ${i.description}`.toLowerCase().includes(q.toLowerCase()))) return false
      return true
    })
  },[items,q,cat])

  return (
    <div className="container mx-auto p-6">
      <header className="sticky top-0 bg-[var(--bg)] backdrop-blur py-4 z-10">
        <div className="flex items-center gap-4">
          <div className="text-2xl font-extrabold text-[var(--primary)]">Café</div>
          <div className="flex-1 relative">
            <span className="absolute left-3 top-3 text-gray-400 text-sm">⌕</span>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search menu..." className="w-full pl-10 pr-4 py-3 rounded-full shadow focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition" />
          </div>
          <a href="/admin/login" className="px-4 py-2 bg-[var(--primary)] text-white rounded-full">Admin</a>
        </div>
        <div className="mt-4 overflow-x-auto flex gap-3">
          {categories.map(c=> (
            <button key={c} onClick={()=>setCat(c)} className={`whitespace-nowrap px-4 py-2 rounded-full ${cat===c? 'bg-[var(--primary)] text-white':'bg-white'}`}>{c}</button>
          ))}
        </div>
      </header>

      <main className="mt-6">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({length:6}).map((_,i)=>(<SkeletonCard key={i} />))}
          </div>
        ) : filtered.length===0 ? (
          <div className="text-center py-20">
            <div className="text-2xl">No items found ☕</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(item=> <MenuCard key={item.id} item={item} />)}
          </div>
        )}
      </main>
    </div>
  )
}
