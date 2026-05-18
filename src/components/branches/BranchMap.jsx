import React, { useEffect, useRef, useImperativeHandle, forwardRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import branches from '../../data/branchData';
import { MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

// Fix default icon paths for Vite / ESM
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

// Create a coffee-like divIcon using inline SVG so it's easy to replace later
const createCoffeeIcon = (id) =>
  L.divIcon({
    className: 'coffee-marker',
    html: `
      <div class="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-rose-500 text-white shadow-lg ring-1 ring-white/20 transform transition-all animate-bounce">
        <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"feather feather-coffee\"><path d=\"M18 8h1a3 3 0 0 1 0 6h-1\"></path><path d=\"M2 8h14v9a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V8z\"></path></svg>
      </div>
    `,
    iconSize: [48, 48],
    iconAnchor: [24, 48],
  });

const BranchMap = forwardRef(({ onMapReady }, ref) => {
  const mapRef = useRef(null);
  const markerRefs = useRef({});
  const [userLocation, setUserLocation] = useState(null);

  useImperativeHandle(ref, () => ({
    flyToBranch: (id) => {
      const b = branches.find((br) => br.id === id);
      if (!b || !mapRef.current) return;
      const map = mapRef.current;
      map.flyTo(b.coords, 16, { duration: 1.2 });
      const mr = markerRefs.current[id];
      if (mr && mr.openPopup) mr.openPopup();
    },
    getMap: () => mapRef.current,
  }));

  useEffect(() => {
    // attempt geolocation
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude]);
      },
      () => {},
      { enableHighAccuracy: true, maximumAge: 1000 * 60 * 5 }
    );
  }, []);

  const center = branches.length ? branches[0].coords : [40.7128, -74.006];

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/10">
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '100%', minHeight: '320px' }}
        whenCreated={(mapInstance) => {
          mapRef.current = mapInstance;
          onMapReady && onMapReady(mapInstance);
        }}
        zoomControl={false}
        scrollWheelZoom={typeof window !== 'undefined' ? window.innerWidth > 640 : true}
      >
        <ZoomControl position="topright" />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {branches.map((b) => (
          <Marker
            key={b.id}
            position={b.coords}
            icon={createCoffeeIcon(b.id)}
            ref={(el) => {
              if (el) markerRefs.current[b.id] = el;
            }}
          >
            <Popup className="max-w-xs bg-white/95 text-slate-900 rounded-xl shadow-xl border border-slate-200">
              <div className="p-3">
                <h3 className="text-lg font-semibold">{b.name}</h3>
                <p className="text-sm text-slate-600 mt-1">{b.desc}</p>
                <div className="mt-3 flex items-center justify-between">
                  <a
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-rose-600 text-white text-sm font-medium shadow-sm hover:brightness-95 transition"
                    href={b.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Get Directions
                  </a>
                  <span className="text-xs text-slate-500">{b.hours}</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {userLocation && (
          <>
            <Marker
              position={userLocation}
              icon={L.divIcon({
                className: 'user-marker',
                html: '<div class="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-rose-600 shadow-md">⬤</div>',
                iconSize: [32, 32],
                iconAnchor: [16, 16],
              })}
            />
            <Circle center={userLocation} radius={60} pathOptions={{ color: '#f43f5e', opacity: 0.12 }} />
          </>
        )}
      </MapContainer>
    </div>
  );
});

export default BranchMap;
