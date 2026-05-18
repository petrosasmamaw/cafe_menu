import React, { useEffect, useState } from 'react'

export default function OfflineBanner() {
  const [online, setOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true)

  useEffect(() => {
    const onOnline = () => setOnline(true)
    const onOffline = () => setOnline(false)
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)
    return () => {
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
    }
  }, [])

  return (
    <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-full text-sm font-medium transition-all ${
      online ? 'bg-emerald-600 text-white shadow-lg' : 'bg-amber-400 text-black'
    }`}>
      {online ? 'Online' : 'Offline — Showing saved menu'}
    </div>
  )
}
