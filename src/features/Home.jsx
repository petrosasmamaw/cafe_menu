import React, { useState, useMemo } from 'react'
import { useGetMenuQuery } from '../store/api/menuApi'

const categories = ['All','Breakfast','Fasting Lunch','Non-Fasting Lunch','Cold Drinks','Hot Drinks','Juices','Pizza','Burger']

// Background image URL for all pages
const bgImage = 'https://images.openai.com/static-rsc-4/6WeZC4eUWalWirG924LJPD6RR7ixBZ4-3-nfFmZvWGU4MvCsEBISmLXditOqTZpfQVEPVmGlnxb0TZyOCllRJQcPTPGq217HvV_-qCIBAUXfcwu5TCpbSvtuBw40f6MIBntYEblhaGsibQJI4W-5fvYjwgHVoSmSy6FXGiVG3bN39NDB-uxxgR0y65btrezd?purpose=fullsize'

function SkeletonCard(){
  return (
    <div className="animate-pulse glass rounded-3xl p-5">
      <div className="h-40 bg-gray-400/30 rounded-2xl mb-4" />
      <div className="h-4 bg-gray-400/30 rounded mb-3 w-3/4" />
      <div className="h-3 bg-gray-400/30 rounded w-1/2" />
    </div>
  )
}

function MenuCard({item}){
  return (
    <div className="group glass rounded-3xl overflow-hidden hover:shadow-2xl transition-smooth hover:-translate-y-1">
      <div className="relative overflow-hidden h-48">
        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-smooth duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-smooth" />
      </div>
      <div className="p-5 bg-white/20">
        <div className="flex justify-between items-start gap-2 mb-2">
          <h3 className="font-bold text-lg text-gray-900 group-hover:text-[var(--accent)] transition-smooth">{item.name}</h3>
          <span className="text-[var(--accent)] font-bold text-lg whitespace-nowrap">${item.price}</span>
        </div>
        <p className="text-sm text-gray-700 mb-3 line-clamp-2">{item.description}</p>
        <div className="flex items-center justify-between pt-3 border-t border-white/30">
          <span className="px-3 py-1 bg-white/30 rounded-full text-xs text-gray-800 font-medium">{item.category}</span>
          <span className={`text-xs font-semibold ${item.is_available? 'text-green-700':'text-red-700'}`}>
            {item.is_available? '✓ Available':'✗ Out'}
          </span>
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
    <div className="min-h-screen relative overflow-x-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)), url('${bgImage}')`,
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 glass-dark z-20 backdrop-blur-md max-sm:px-4">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="text-2xl sm:text-4xl">☕</div>
                <div>
                  <h1 className="text-xl sm:text-3xl font-black text-gray-900">Café Menu</h1>
                  <p className="text-xs sm:text-sm text-gray-600">Premium selections</p>
                </div>
              </div>
              <a href="/admin/login" className="px-4 sm:px-6 py-2 bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white font-semibold rounded-full transition-smooth shadow-lg text-sm sm:text-base whitespace-nowrap">Admin</a>
            </div>

            {/* Search */}
            <div className="relative mb-4 sm:mb-6">
              <span className="absolute left-3 sm:left-4 top-2.5 sm:top-3.5 text-gray-500 text-lg sm:text-base">🔍</span>
              <input 
                value={q} 
                onChange={e=>setQ(e.target.value)} 
                placeholder="Search your favorite dish..." 
                className="w-full pl-10 sm:pl-12 pr-4 sm:pr-6 py-2 sm:py-3 glass rounded-full outline-none focus:ring-2 focus:ring-[var(--accent)]/50 text-gray-900 placeholder:text-gray-600 transition-smooth text-sm sm:text-base"
              />
            </div>

            {/* Category filters - mobile optimized */}
            <div className="overflow-x-auto pb-2 scrollbar-hide">
              <div className="flex gap-1 sm:gap-2">
                {categories.map(c=> (
                  <button 
                    key={c} 
                    onClick={()=>setCat(c)} 
                    className={`whitespace-nowrap px-3 sm:px-5 py-1.5 sm:py-2 rounded-full font-semibold transition-smooth text-xs sm:text-sm ${
                      cat===c
                        ? 'bg-[var(--accent)] text-white shadow-lg'
                        : 'glass text-gray-900 hover:bg-white/40'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {Array.from({length:6}).map((_,i)=>(<SkeletonCard key={i} />))}
            </div>
          ) : filtered.length===0 ? (
            <div className="text-center py-12 sm:py-20">
              <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">🍽️</div>
              <div className="text-lg sm:text-2xl text-gray-900 font-semibold mb-1 sm:mb-2">No items found</div>
              <p className="text-sm sm:text-base text-gray-600">Try a different search or category</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filtered.map(item=> <MenuCard key={item.id} item={item} />)}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
