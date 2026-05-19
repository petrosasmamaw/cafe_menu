import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useGetMenuQuery } from '../store/api/menuApi'
import { useAddCommentMutation } from '../store/api/commentsApi'

const categories = ['All','Breakfast','Fasting Lunch','Non-Fasting Lunch','Cold Drinks','Hot Drinks','Juices','Pizza','Burger']

function SkeletonCard(){
  return (
    <div className="animate-pulse glass p-4">
      <div className="h-24 sm:h-40 bg-[#f0ede8] rounded-lg mb-3" />
      <div className="h-4 bg-[#f0ede8] rounded mb-2 w-3/4" />
      <div className="h-3 bg-[#f0ede8] rounded w-1/2" />
    </div>
  )
}

function MenuCard({item}){
  return (
    <motion.div whileHover={{ scale: 1.02 }} className="card-hover glass overflow-hidden">
      <div className="relative">
        <img src={item.image_url} alt={item.name} className="w-full h-36 sm:h-48 object-cover bg-[#f0ede8]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
        <span className={`absolute top-3 left-3 text-xs font-semibold px-2 py-1 rounded ${item.is_available ? 'bg-white/80 text-[#2f5a36]' : 'bg-white/80 text-[#8b2b2b]'}`}>
          {item.is_available ? 'Available' : 'Out'}
        </span>
        <div className="absolute top-3 right-3 price-badge">${item.price}</div>
      </div>
      <div className="p-4">
        <h3 className="text-sm sm:text-base lux-heading mb-1">{item.name}</h3>
        <p className="text-[11px] sm:text-sm text-gray-500 line-clamp-2 mb-3">{item.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 px-2 py-1 rounded-full bg-white/40">{item.category}</span>
          <button className="text-sm text-[#6b3e26] font-medium">Order</button>
        </div>
      </div>
    </motion.div>
  )
}

export default function Home(){
  const { data, isLoading } = useGetMenuQuery()
  const [addComment] = useAddCommentMutation()
  const [commentOpen, setCommentOpen] = useState(false)
  const [commentForm, setCommentForm] = useState({ name: '', comment: '' })
  const [q,setQ] = useState('')
  const [cat,setCat] = useState('All')

  const items = data?.menu || []

  async function checkAdmin() {
    const rawApiBase = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'
    const apiBase = rawApiBase.endsWith('/api') ? rawApiBase : rawApiBase.replace(/\/$/, '') + '/api'
    try {
      const res = await fetch(`${apiBase}/auth/me`, { credentials: 'include' })
      const d = await res.json()
      if (d?.user) {
        window.history.pushState({}, '', '/admin')
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
    <div className="min-h-screen luxury-bg">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-6">
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
                  <h1 className="text-base sm:text-lg font-medium text-[#1a1a1a] leading-tight">LOL Café Menu</h1>
                  <p className="text-[10px] sm:text-xs text-gray-400 leading-tight">Premium selections</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCommentOpen(true)}
                  className="border border-[#6b7280] text-[#374151] bg-white px-3 py-1.5 rounded-full text-xs font-medium hover:opacity-90 transition-opacity"
                >
                  Comment
                </button>
                <button
                  onClick={checkAdmin}
                  className="border border-[#c77e3a] text-[#c77e3a] bg-[#fff9f2] px-3.5 py-1.5 rounded-full text-xs font-medium hover:opacity-90 transition-opacity flex-shrink-0"
                >
                  Admin
                </button>
              </div>
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

        {/* Comment Modal */}
        {commentOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/40" onClick={() => setCommentOpen(false)} />
            <div className="relative bg-white rounded-2xl w-full max-w-lg border border-[#e8e4de] p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-[#1a1a1a]">Send a comment</h2>
                <button onClick={() => setCommentOpen(false)} className="text-gray-400">Close</button>
              </div>
              <form onSubmit={async (e) => {
                e.preventDefault()
                try {
                  await addComment(commentForm).unwrap()
                  setCommentForm({ name: '', comment: '' })
                  setCommentOpen(false)
                  alert('Thanks — your comment was submitted!')
                } catch (err) {
                  console.error('Comment submit error', err)
                  alert('Failed to submit comment')
                }
              }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Your name</label>
                  <input
                    value={commentForm.name}
                    onChange={(e) => setCommentForm({...commentForm, name: e.target.value})}
                    placeholder="Optional"
                    className="w-full bg-[#f5f3ef] border border-[#e8e4de] rounded-lg px-4 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Comment</label>
                  <textarea
                    value={commentForm.comment}
                    onChange={(e) => setCommentForm({...commentForm, comment: e.target.value})}
                    placeholder="Share your feedback..."
                    required
                    rows={4}
                    className="w-full bg-[#f5f3ef] border border-[#e8e4de] rounded-lg px-4 py-2.5 text-sm resize-none"
                  />
                </div>
                <div className="flex justify-end">
                  <button type="submit" className="bg-[#c77e3a] text-white rounded-lg py-2.5 px-4 text-sm font-medium">Send</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Menu Grid */}
        <main className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-6">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {Array.from({length:6}).map((_,i)=> <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length===0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-sm">No items found</p>
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