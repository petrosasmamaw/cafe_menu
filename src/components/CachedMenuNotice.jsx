import React from 'react'

export default function CachedMenuNotice({ visible }) {
  if (!visible) return null
  return (
    <div className="fixed left-4 bottom-6 z-40 bg-white/6 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg border border-white/8 text-sm text-slate-100">
      Showing saved menu (offline)
    </div>
  )
}
