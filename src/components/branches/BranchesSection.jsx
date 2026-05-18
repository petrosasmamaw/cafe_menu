import React, { useRef, useState } from 'react';
import BranchMap from './BranchMap';
import BranchCard from './BranchCard';
import branches from '../../data/branchData';
import { motion } from 'framer-motion';

export default function BranchesSection() {
  const mapRef = useRef(null);
  const [selected, setSelected] = useState(branches[0]?.id || null);

  const handleSelect = (id) => {
    setSelected(id);
    if (mapRef.current && mapRef.current.flyToBranch) {
      mapRef.current.flyToBranch(id);
    }
  };

  const handleNavigate = (branch) => {
    // Try to get user's current location and open Google Maps directions
    const openDirections = (origin) => {
      const dest = `${branch.coords[0]},${branch.coords[1]}`;
      const originParam = origin ? `origin=${origin[0]},${origin[1]}&` : '';
      const url = `https://www.google.com/maps/dir/?api=1&${originParam}destination=${encodeURIComponent(
        dest
      )}&travelmode=driving`;
      window.open(url, '_blank');
    };

    if (!navigator.geolocation) {
      openDirections(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        openDirections([pos.coords.latitude, pos.coords.longitude]);
      },
      () => {
        // Fallback: open directions with only destination
        openDirections(null);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  return (
    <section className="w-full py-12 px-4 md:px-8 lg:px-16 bg-gradient-to-b from-slate-900/60 via-slate-900/40 to-transparent rounded-3xl">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">Find Your Nearest Cafe</h2>
          <p className="mt-2 text-sm text-slate-300 max-w-2xl">Explore our branches, get directions, and see your location on the map. Tap a card to fly to the cafe.</p>
        </motion.div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <motion.div className="md:col-span-2 h-[520px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}>
            <BranchMap ref={mapRef} onMapReady={(map) => { /* left for future */ }} />
          </motion.div>

          <div className="md:col-span-1 flex flex-col gap-4">
            {branches.map((b) => (
              <BranchCard
                key={b.id}
                branch={b}
                selected={selected === b.id}
                onSelect={handleSelect}
                onNavigate={handleNavigate}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
