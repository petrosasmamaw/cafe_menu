import React from 'react'
import { motion } from 'framer-motion'
import { MapPin, Navigation } from 'lucide-react'

export default function BranchCard({ branch, selected, onSelect, onNavigate }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={() => onSelect(branch.id)}
      className={`cursor-pointer p-4 rounded-2xl border bg-white/5 backdrop-blur-md border-white/6 shadow-md hover:shadow-xl transition-colors flex items-start gap-4 ${
        selected ? 'ring-2 ring-rose-400/60 bg-white/6' : ''
      }`}
    >
      <div className="flex-shrink-0">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-400 to-rose-500 flex items-center justify-center text-white shadow">
          <MapPin size={20} />
        </div>
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between gap-3">
          <h4 className="text-sm md:text-base font-semibold">{branch.name}</h4>
          <div className="text-xs text-slate-400">{branch.hours}</div>
        </div>
        <p className="text-xs text-slate-400 mt-1">{branch.desc}</p>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs bg-amber-300/20 text-amber-300 px-2 py-1 rounded-full">Nearest Branch</span>
          </div>
          <div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onNavigate && onNavigate(branch)
              }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-600 text-white text-sm font-medium shadow-sm hover:brightness-95 transition"
            >
              <span>Navigate</span>
              <Navigation size={14} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
