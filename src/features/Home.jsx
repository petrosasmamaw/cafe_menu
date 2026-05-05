import React, { useState, useMemo } from 'react'
import { useGetMenuQuery } from '../store/api/menuApi'

const categories = ['All','Breakfast','Fasting Lunch','Non-Fasting Lunch','Cold Drinks','Hot Drinks','Juices','Pizza','Burger']

// Background images for different categories - using free stock images
const categoryBackgrounds = {
  'All': 'linear-gradient(135deg, rgba(26, 26, 26, 0.7) 0%, rgba(26, 26, 26, 0.8) 100%), radial-gradient(circle at 20% 50%, rgba(212, 165, 116, 0.1) 0%, transparent 50%)',
  'Breakfast': 'linear-gradient(135deg, rgba(26, 26, 26, 0.7) 0%, rgba(26, 26, 26, 0.8) 100%), radial-gradient(circle at 20% 50%, rgba(212, 165, 116, 0.15) 0%, transparent 50%)',
  'Fasting Lunch': 'linear-gradient(135deg, rgba(26, 26, 26, 0.75) 0%, rgba(26, 26, 26, 0.85) 100%), radial-gradient(circle at 80% 50%, rgba(212, 165, 116, 0.1) 0%, transparent 50%)',
  'Non-Fasting Lunch': 'linear-gradient(135deg, rgba(26, 26, 26, 0.75) 0%, rgba(26, 26, 26, 0.85) 100%), radial-gradient(circle at 80% 50%, rgba(212, 165, 116, 0.1) 0%, transparent 50%)',
  'Cold Drinks': 'linear-gradient(135deg, rgba(26, 26, 26, 0.7) 0%, rgba(26, 26, 26, 0.8) 100%), radial-gradient(circle at 50% 0%, rgba(100, 200, 255, 0.1) 0%, transparent 50%)',
  'Hot Drinks': 'linear-gradient(135deg, rgba(26, 26, 26, 0.7) 0%, rgba(26, 26, 26, 0.8) 100%), radial-gradient(circle at 30% 70%, rgba(255, 150, 80, 0.1) 0%, transparent 50%)',
  'Juices': 'linear-gradient(135deg, rgba(26, 26, 26, 0.7) 0%, rgba(26, 26, 26, 0.8) 100%), radial-gradient(circle at 70% 50%, rgba(255, 200, 100, 0.1) 0%, transparent 50%)',
  'Pizza': 'linear-gradient(135deg, rgba(26, 26, 26, 0.75) 0%, rgba(26, 26, 26, 0.85) 100%), radial-gradient(circle at 50% 50%, rgba(212, 100, 50, 0.1) 0%, transparent 50%)',
  'Burger': 'linear-gradient(135deg, rgba(26, 26, 26, 0.75) 0%, rgba(26, 26, 26, 0.85) 100%), radial-gradient(circle at 50% 50%, rgba(200, 150, 100, 0.1) 0%, transparent 50%)'
}

function SkeletonCard(){
  return (
    <div className="animate-pulse glass rounded-3xl p-5">
      <div className="h-40 bg-white/20 rounded-2xl mb-4" />
      <div className="h-4 bg-white/20 rounded mb-3 w-3/4" />
      <div className="h-3 bg-white/20 rounded w-1/2" />
    </div>
  )
}

function MenuCard({item}){
  return (
    <div className="group glass rounded-3xl overflow-hidden hover:shadow-2xl transition-smooth hover:-translate-y-1">
      <div className="relative overflow-hidden h-48">
        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-smooth duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-smooth" />
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start gap-2 mb-2">
          <h3 className="font-bold text-lg text-white group-hover:text-[var(--accent)] transition-smooth">{item.name}</h3>
          <span className="text-[var(--accent)] font-bold text-lg whitespace-nowrap">${item.price}</span>
        </div>
        <p className="text-sm text-white/70 mb-3 line-clamp-2">{item.description}</p>
        <div className="flex items-center justify-between pt-3 border-t border-white/10">
          <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-white/80 font-medium">{item.category}</span>
          <span className={`text-xs font-semibold ${item.is_available? 'text-green-400':'text-red-400'}`}>
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

  const bgGradient = categoryBackgrounds[cat] || categoryBackgrounds['All']

  return (
    <div className="min-h-screen relative overflow-x-hidden"
      style={{
        background: bgGradient,
        backgroundColor: '#1a1a1a'
      }}
    >
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-[var(--accent)]/5 blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 rounded-full bg-[var(--accent)]/5 blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
        <div className="absolute bottom-0 right-1/3 w-96 h-96 rounded-full bg-[var(--accent)]/3 blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 glass-dark z-20 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="text-4xl">☕</div>
                <div>
                  <h1 className="text-3xl font-black text-white">Café Menu</h1>
                  <p className="text-sm text-white/60">Premium selections</p>
                </div>
              </div>
              <a href="/admin/login" className="px-6 py-2 bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-black font-semibold rounded-full transition-smooth shadow-lg">Admin</a>
            </div>

            {/* Search */}
            <div className="relative mb-6">
              <span className="absolute left-4 top-3.5 text-white/50">🔍</span>
              <input 
                value={q} 
                onChange={e=>setQ(e.target.value)} 
                placeholder="Search your favorite dish..." 
                className="w-full pl-12 pr-6 py-3 glass rounded-full outline-none focus:ring-2 focus:ring-[var(--accent)]/50 text-white placeholder:text-white/50 transition-smooth"
              />
            </div>

            {/* Category filters */}
            <div className="overflow-x-auto pb-2 scrollbar-hide">
              <div className="flex gap-2">
                {categories.map(c=> (
                  <button 
                    key={c} 
                    onClick={()=>setCat(c)} 
                    className={`whitespace-nowrap px-5 py-2 rounded-full font-semibold transition-smooth ${
                      cat===c
                        ? 'bg-[var(--accent)] text-black shadow-lg'
                        : 'glass text-white hover:bg-white/20'
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
        <main className="max-w-6xl mx-auto px-6 py-12">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({length:6}).map((_,i)=>(<SkeletonCard key={i} />))}
            </div>
          ) : filtered.length===0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🍽️</div>
              <div className="text-2xl text-white font-semibold mb-2">No items found</div>
              <p className="text-white/60">Try a different search or category</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(item=> <MenuCard key={item.id} item={item} />)}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
