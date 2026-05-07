import React, { useState, useMemo } from 'react'
import { useGetMenuQuery } from '../store/api/menuApi'

const categories = ['All','Breakfast','Fasting Lunch','Non-Fasting Lunch','Cold Drinks','Hot Drinks','Juices','Pizza','Burger']

function SkeletonCard(){
  return (
    <div className="animate-pulse bg-white border border-[#e8e4de] rounded-xl p-4">
      <div className="h-24 sm:h-40 bg-[#f0ede8] rounded-lg mb-3" />
      <div className="h-4 bg-[#f0ede8] rounded mb-2 w-3/4" />
      <div className="h-3 bg-[#f0ede8] rounded w-1/2" />
    </div>
  )
}

function MenuCard({item}){
  return (
    <div className="bg-white border border-[#e8e4de] rounded-xl overflow-hidden shadow-subtle">
      <div className="relative">
        <img src={item.image_url} alt={item.name} className="w-full h-24 sm:h-40 object-cover bg-[#f0ede8]" />
        <span className={`absolute top-2 right-2 text-[9px] sm:text-xs font-medium px-1.5 py-0.5 rounded ${
          item.is_available ? 'bg-[#e6f2e8] text-[#3a7a42]' : 'bg-[#fde8e8] text-[#a32d2d]'
        }`}>
          {item.is_available ? 'Available' : 'Out'}
        </span>
      </div>
      <div className="p-2 sm:p-3">
        <h3 className="text-sm sm:text-base font-medium text-[#1a1a1a] truncate mb-1">{item.name}</h3>
        <p className="text-[10px] sm:text-xs text-gray-400 line-clamp-1 sm:line-clamp-2 mb-2">{item.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm sm:text-base font-medium text-[#c77e3a]">${item.price}</span>
          <span className="bg-[#fdf3e8] text-[#a0621a] text-[9px] sm:text-xs px-2 py-0.5 rounded">{item.category}</span>
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
    return selTokens.every(tok => {
      if(!tok) return true
      if(normItem.includes(tok)) return true
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
    <div className="min-h-screen bg-[#fafaf8]">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#e8e4de]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3">
          {/* Top row: logo, title, admin button */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[#6b3e26] rounded-lg flex items-center justify-center flex-shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
                  <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
                  <line x1="6" y1="2" x2="6" y2="4" />
                  <line x1="10" y1="2" x2="10" y2="4" />
                  <line x1="14" y1="2" x2="14" y2="4" />
                </svg>
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-medium text-[#1a1a1a] leading-tight">Café Menu</h1>
                <p className="text-[10px] sm:text-xs text-gray-400 leading-tight">Premium selections</p>
              </div>
            </div>
            <a
              href="/admin"
              className="border border-[#c77e3a] text-[#c77e3a] bg-[#fff9f2] px-3.5 py-1.5 rounded-full text-xs font-medium hover:opacity-90 transition-opacity flex-shrink-0"
            >
              Admin
            </a>
          </div>

          {/* Search bar */}
          <div className="relative mb-3">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search dishes..."
              value={q}
              onChange={e=>setQ(e.target.value)}
              className="w-full bg-[#f5f3ef] rounded-lg pl-9 pr-4 py-2.5 text-sm text-[#1a1a1a] placeholder-gray-400 border-0 focus:ring-2 focus:ring-[#c77e3a]/20"
            />
          </div>

          {/* Category chips */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
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
        </div>
      </header>

      {/* Menu Grid */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-6">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-4">
            {Array.from({length:6}).map((_,i)=> <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length===0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-sm">No items found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-4">
            {filtered.map(item=> <MenuCard key={item.id} item={item} />)}
          </div>
        )}
      </main>
    </div>
  )
}