import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { useApp } from '../context/AppContext';

// Custom SVG Icons Generator for Leaflet Markers
const createAmbulanceIcon = (code, status) => {
  const isEnRoute = status === 'EN_ROUTE';
  const color = isEnRoute ? '#E63946' : '#64748B';
  
  return L.divIcon({
    className: 'custom-ambulance-marker',
    html: `
      <div class="relative group flex items-center justify-center">
        ${isEnRoute ? `<div class="absolute -inset-2 rounded-full bg-red-600/40 animate-ping"></div>` : ''}
        <div class="relative flex items-center justify-center w-10 h-10 rounded-full border-2 border-white shadow-xl ${isEnRoute ? 'bg-red-600 text-white' : 'bg-slate-700 text-slate-300'} shadow-red-900/50">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
        </div>
        <div class="absolute -bottom-6 bg-slate-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow border border-slate-700 whitespace-nowrap">
          ${code}
        </div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20]
  });
};

const createHospitalIcon = (code, status, beds) => {
  let statusBg = 'bg-emerald-500';
  let borderCol = 'border-emerald-400';
  if (status === 'LIMITED') {
    statusBg = 'bg-amber-500';
    borderCol = 'border-amber-400';
  } else if (status === 'CRITICAL') {
    statusBg = 'bg-rose-600';
    borderCol = 'border-rose-400';
  }

  return L.divIcon({
    className: 'custom-hospital-marker',
    html: `
      <div class="relative flex flex-col items-center group">
        <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-900 border-2 ${borderCol} shadow-2xl text-white">
          <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
          </svg>
        </div>
        <div class="absolute -top-2 -right-2 ${statusBg} text-slate-950 font-extrabold text-[10px] h-5 w-5 rounded-full flex items-center justify-center shadow-lg border border-white">
          ${beds}
        </div>
        <div class="mt-1 bg-slate-950/90 text-white text-[10px] font-bold px-2 py-0.5 rounded border border-slate-800 shadow whitespace-nowrap">
          ${code}
        </div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20]
  });
};

const createTrafficSignalIcon = (code, status, mode, distance) => {
  const isGreen = status === 'GREEN';
  const isCorridorActive = mode === 'GREEN_CORRIDOR_ACTIVE';

  return L.divIcon({
    className: 'custom-signal-marker',
    html: `
      <div class="relative flex flex-col items-center">
        ${isCorridorActive ? `<div class="absolute -inset-3 rounded-full bg-emerald-500/30 animate-pulse"></div>` : ''}
        <div class="relative flex items-center justify-center w-8 h-8 rounded-lg bg-slate-950 border ${isGreen ? 'border-emerald-400 shadow-emerald-500/50' : 'border-rose-500 shadow-rose-500/50'} shadow-lg">
          <div class="w-4 h-4 rounded-full ${isGreen ? 'bg-emerald-400 animate-pulse shadow-emerald-400' : 'bg-rose-500'}"></div>
        </div>
        ${isCorridorActive ? `
          <div class="mt-1 bg-emerald-950/90 text-emerald-300 border border-emerald-700/80 text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-tighter whitespace-nowrap">
            GREEN CORRIDOR (${distance}m)
          </div>
        ` : `
          <div class="mt-1 bg-slate-900/80 text-slate-400 border border-slate-800 text-[9px] font-semibold px-1 py-0.5 rounded">
            ${code}
          </div>
        `}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
};

export const MapView = ({ focusedAmbulanceId = null, height = "h-full" }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({ ambulances: {}, hospitals: {}, signals: {}, polylines: [] });

  const { hospitals, ambulances, trafficSignals } = useApp();

  // Initialize Map
  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      const map = L.map(mapRef.current, {
        center: [9.9252, 78.1200],

        zoom: 13,
        zoomControl: false
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Dark Mode Tile Layer for emergency dispatch look
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> & OpenStreetMap',
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers & Polylines dynamically when state changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing polylines
    markersRef.current.polylines.forEach(p => map.removeLayer(p));
    markersRef.current.polylines = [];

    // 1. Render / Update Ambulances
    ambulances.forEach((amb) => {
      if (!amb.currentLocation) return;
      const { lat, lng } = amb.currentLocation;
      const icon = createAmbulanceIcon(amb.code, amb.status);

      if (markersRef.current.ambulances[amb.id]) {
        markersRef.current.ambulances[amb.id].setLatLng([lat, lng]);
        markersRef.current.ambulances[amb.id].setIcon(icon);
      } else {
        const marker = L.marker([lat, lng], { icon }).addTo(map);
        marker.bindPopup(`
          <div class="p-1 text-slate-900 font-sans">
            <div class="font-extrabold text-sm text-red-600">${amb.code} (${amb.unitName})</div>
            <div class="text-xs text-slate-600 font-semibold mt-1">Status: ${amb.status}</div>
            ${amb.patient ? `
              <div class="mt-2 pt-2 border-t text-xs">
                <div class="font-bold">${amb.patient.name} (${amb.patient.age}y ${amb.patient.gender})</div>
                <div class="text-red-600 font-bold">${amb.patient.conditionCategory}</div>
                <div class="text-slate-500 mt-0.5">ETA: ~${amb.etaMinutes} mins</div>
              </div>
            ` : ''}
          </div>
        `);
        markersRef.current.ambulances[amb.id] = marker;
      }

      // Draw Polyline Route if en-route
      if (amb.status === 'EN_ROUTE' && amb.route && amb.route.length > 0) {
        const routeCoords = amb.route.map(pt => [pt.lat, pt.lng]);
        
        // Background glow line
        const glowPolyline = L.polyline(routeCoords, {
          color: '#E63946',
          weight: 8,
          opacity: 0.35,
          lineCap: 'round'
        }).addTo(map);

        // Neon active line
        const activePolyline = L.polyline(routeCoords, {
          color: '#2ECC71',
          weight: 4,
          opacity: 0.9,
          dashArray: '10, 10',
          dashOffset: '0'
        }).addTo(map);

        markersRef.current.polylines.push(glowPolyline, activePolyline);
      }
    });

    // 2. Render / Update Hospitals
    hospitals.forEach((hosp) => {
      if (!hosp.location) return;
      const { lat, lng } = hosp.location;
      const icon = createHospitalIcon(hosp.code, hosp.status, hosp.availableBeds);

      if (markersRef.current.hospitals[hosp.id]) {
        markersRef.current.hospitals[hosp.id].setLatLng([lat, lng]);
        markersRef.current.hospitals[hosp.id].setIcon(icon);
      } else {
        const marker = L.marker([lat, lng], { icon }).addTo(map);
        marker.bindPopup(`
          <div class="p-1 text-slate-900 font-sans">
            <div class="font-extrabold text-sm text-blue-900">${hosp.name}</div>
            <div class="text-xs text-slate-600 mt-1">${hosp.address}</div>
            <div class="mt-2 text-xs flex gap-2">
              <span class="bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">Beds: ${hosp.availableBeds}/${hosp.totalBeds}</span>
              <span class="bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded">OTs: ${hosp.availableOTs}/${hosp.totalOTs}</span>
            </div>
          </div>
        `);
        markersRef.current.hospitals[hosp.id] = marker;
      }
    });

    // 3. Render / Update Traffic Signals
    trafficSignals.forEach((sig) => {
      if (!sig.location) return;
      const { lat, lng } = sig.location;
      const icon = createTrafficSignalIcon(sig.code, sig.status, sig.mode, sig.distanceToAmbulance);

      if (markersRef.current.signals[sig.id]) {
        markersRef.current.signals[sig.id].setLatLng([lat, lng]);
        markersRef.current.signals[sig.id].setIcon(icon);
      } else {
        const marker = L.marker([lat, lng], { icon }).addTo(map);
        markersRef.current.signals[sig.id] = marker;
      }
    });

  }, [ambulances, hospitals, trafficSignals]);

  // Center map on focused ambulance if selected
  useEffect(() => {
    if (focusedAmbulanceId && mapInstanceRef.current) {
      const amb = ambulances.find(a => a.id === focusedAmbulanceId || a.code === focusedAmbulanceId);
      if (amb && amb.currentLocation) {
        mapInstanceRef.current.flyTo([amb.currentLocation.lat, amb.currentLocation.lng], 15, { duration: 1.2 });
      }
    }
  }, [focusedAmbulanceId, ambulances]);

  return (
    <div className={`relative w-full ${height} rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950`}>
      <div ref={mapRef} className="w-full h-full z-0" />
      
      {/* Map Legend Overlay */}
      <div className="absolute top-3 left-3 z-10 bg-slate-900/90 backdrop-blur border border-slate-800 p-2.5 rounded-xl text-[11px] space-y-1.5 text-slate-300 shadow-xl">
        <div className="font-extrabold text-white uppercase text-[10px] tracking-wider mb-1">Live Map Legend</div>
        <div className="flex items-center space-x-2">
          <span className="h-2.5 w-2.5 rounded-full bg-brand-red animate-ping" />
          <span>Active Ambulance (En-Route)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          <span>Hospital (Available Beds)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Green Corridor Signal</span>
        </div>
      </div>
    </div>
  );
};
