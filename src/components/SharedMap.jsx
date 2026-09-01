import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { useApp } from '../context/AppContext';

// Shared SVG Marker Creators with Proper Ambulance SVG & High Z-Index
const createAmbulanceIcon = (code, status) => {
  const isEnRoute = status === 'EN_ROUTE';
  return L.divIcon({
    className: 'shared-ambulance-marker-icon',
    html: `
      <div style="position: relative; display: flex; align-items: center; justify-content: center; z-index: 1000;">
        ${isEnRoute ? `<div style="position: absolute; inset: -8px; border-radius: 9999px; background: rgba(239, 68, 68, 0.4); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>` : ''}
        <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 38px; height: 38px; border-radius: 9999px; border: 2px solid #ffffff; background: ${isEnRoute ? '#EF4444' : '#334155'}; color: #ffffff; box-shadow: 0 10px 25px rgba(239,68,68,0.5);">
          <!-- Proper Ambulance Truck SVG Icon -->
          <svg style="width: 22px; height: 22px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8h4l3 3v5h-2m-4 0h-4M7 8h2m-2 3h2"></path>
          </svg>
        </div>
        <div style="position: absolute; bottom: -20px; background: rgba(15, 23, 42, 0.95); color: #ffffff; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 4px; border: 1px solid #334155; white-space: nowrap; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
          🚑 ${code}
        </div>
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19]
  });
};

const createHospitalIcon = (code, status, beds) => {
  let borderCol = '#22C55E';
  let badgeBg = '#22C55E';
  if (status === 'LIMITED') {
    borderCol = '#F59E0B';
    badgeBg = '#F59E0B';
  } else if (status === 'CRITICAL') {
    borderCol = '#EF4444';
    badgeBg = '#EF4444';
  }

  return L.divIcon({
    className: 'shared-hospital-marker-icon',
    html: `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center; z-index: 950;">
        <div style="display: flex; align-items: center; justify-content: center; width: 38px; height: 38px; border-radius: 12px; background: #020617; border: 2px solid ${borderCol}; box-shadow: 0 10px 25px rgba(0,0,0,0.6); color: #60A5FA;">
          <svg style="width: 22px; height: 22px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
          </svg>
        </div>
        <div style="position: absolute; top: -6px; right: -6px; background: ${badgeBg}; color: #020617; font-size: 10px; font-weight: 900; width: 18px; height: 18px; border-radius: 9999px; display: flex; align-items: center; justify-content: center; border: 1.5px solid #ffffff;">
          ${beds}
        </div>
        <div style="margin-top: 2px; background: rgba(2, 6, 23, 0.95); color: #ffffff; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 4px; border: 1px solid #1E293B; white-space: nowrap;">
          🏥 ${code}
        </div>
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19]
  });
};

const createSignalIcon = (code, status, mode, distance, countdown) => {
  const isGreen = status === 'GREEN';
  const isCorridorActive = mode === 'GREEN_CORRIDOR_ACTIVE' || mode === 'EMERGENCY_GREEN';

  return L.divIcon({
    className: 'shared-signal-marker-icon',
    html: `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center; z-index: 900;">
        ${isCorridorActive ? `<div style="position: absolute; inset: -10px; border-radius: 9999px; background: rgba(34, 197, 94, 0.3); animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;"></div>` : ''}
        <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 8px; background: #020617; border: 2px solid ${isGreen ? '#22C55E' : '#EF4444'}; box-shadow: 0 4px 12px rgba(0,0,0,0.5);">
          <div style="width: 14px; height: 14px; border-radius: 9999px; background: ${isGreen ? '#22C55E' : '#EF4444'}; box-shadow: 0 0 10px ${isGreen ? '#22C55E' : '#EF4444'};"></div>
        </div>
        ${isCorridorActive ? `
          <div style="margin-top: 2px; background: rgba(5, 46, 22, 0.95); color: #86EFAC; border: 1px solid #15803D; font-size: 9px; font-weight: 900; padding: 2px 6px; border-radius: 4px; white-space: nowrap;">
            🟢 GREEN CORRIDOR ${countdown > 0 ? `(${countdown}s)` : ''}
          </div>
        ` : `
          <div style="margin-top: 2px; background: rgba(15, 23, 42, 0.9); color: #94A3B8; border: 1px solid #1E293B; font-size: 9px; font-weight: 700; padding: 1px 4px; border-radius: 4px;">
            🚥 ${code}
          </div>
        `}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
};

/**
 * Universal Shared Map Component
 */
export const SharedMap = ({
  showAmbulances = true,
  showHospitals = true,
  showSignals = true,
  showRoutes = true,
  focusedEntityId = null,
  replayRoute = null,
  height = "h-full",
  isMiniMap = false
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupRef = useRef(null);

  const { hospitals, ambulances, trafficSignals } = useApp();

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      const map = L.map(mapRef.current, {
        center: [9.9252, 78.1200],

        zoom: isMiniMap ? 12 : 13,
        zoomControl: !isMiniMap,
        dragging: !isMiniMap,
        scrollWheelZoom: !isMiniMap
      });

      if (!isMiniMap) {
        L.control.zoom({ position: 'bottomright' }).addTo(map);
      }

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; CARTO • OpenStreetMap',
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      const layerGroup = L.layerGroup().addTo(map);
      layerGroupRef.current = layerGroup;

      mapInstanceRef.current = map;

      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 200);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        layerGroupRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    // 1. Ambulances Layer
    if (showAmbulances && ambulances) {
      ambulances.forEach((amb) => {
        if (!amb.currentLocation) return;
        const { lat, lng } = amb.currentLocation;
        const icon = createAmbulanceIcon(amb.code, amb.status);

        const marker = L.marker([lat, lng], { icon });
        marker.bindPopup(`
          <div style="padding: 4px; font-family: Inter, sans-serif; color: #0f172a;">
            <div style="font-weight: 900; font-size: 13px; color: #dc2626;">🚑 ${amb.code} (${amb.unitName})</div>
            <div style="font-size: 11px; font-weight: 700; color: #475569; margin-top: 2px;">Status: ${amb.status}</div>
            ${amb.patient ? `
              <div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid #e2e8f0; font-size: 11px;">
                <div style="font-weight: 800;">${amb.patient.name} (${amb.patient.age}y ${amb.patient.gender})</div>
                <div style="color: #dc2626; font-weight: 800;">${amb.patient.conditionCategory}</div>
                <div style="color: #64748b; margin-top: 2px;">ETA: ~${amb.etaMinutes} mins</div>
              </div>
            ` : ''}
          </div>
        `);
        layerGroup.addLayer(marker);

        if (showRoutes && amb.status === 'EN_ROUTE' && amb.route && amb.route.length > 0) {
          const coords = amb.route.map(pt => [pt.lat, pt.lng]);
          const glowLine = L.polyline(coords, { color: '#EF4444', weight: 6, opacity: 0.4 });
          const activeLine = L.polyline(coords, { color: '#22C55E', weight: 4, opacity: 0.95, dashArray: '8, 8' });
          layerGroup.addLayer(glowLine);
          layerGroup.addLayer(activeLine);
        }
      });
    }

    // 2. Hospitals Layer
    if (showHospitals && hospitals) {
      hospitals.forEach((hosp) => {
        if (!hosp.location) return;
        const { lat, lng } = hosp.location;
        const icon = createHospitalIcon(hosp.code, hosp.status, hosp.availableBeds);

        const marker = L.marker([lat, lng], { icon });
        marker.bindPopup(`
          <div style="padding: 4px; font-family: Inter, sans-serif; color: #0f172a;">
            <div style="font-weight: 900; font-size: 13px; color: #1e3a8a;">🏥 ${hosp.name}</div>
            <div style="font-size: 11px; color: #475569; margin-top: 2px;">${hosp.address}</div>
            <div style="margin-top: 6px; font-size: 11px; display: flex; gap: 6px;">
              <span style="background: #dcfce7; color: #166534; font-weight: 800; padding: 2px 6px; border-radius: 4px;">Beds: ${hosp.availableBeds}/${hosp.totalBeds}</span>
              <span style="background: #dbeafe; color: #1e40af; font-weight: 800; padding: 2px 6px; border-radius: 4px;">OTs: ${hosp.availableOTs}/${hosp.totalOTs}</span>
            </div>
          </div>
        `);
        layerGroup.addLayer(marker);
      });
    }

    // 3. Traffic Signals Layer
    if (showSignals && trafficSignals) {
      trafficSignals.forEach((sig) => {
        if (!sig.location) return;
        const { lat, lng } = sig.location;
        const icon = createSignalIcon(sig.code, sig.status, sig.mode, sig.distanceToAmbulance, sig.countdownSeconds);

        const marker = L.marker([lat, lng], { icon });
        layerGroup.addLayer(marker);
      });
    }

    // 4. Replay Route Layer
    if (replayRoute && replayRoute.length > 0) {
      const replayCoords = replayRoute.map(pt => [pt.lat, pt.lng]);
      const replayLine = L.polyline(replayCoords, { color: '#3B82F6', weight: 5, opacity: 0.95 });
      layerGroup.addLayer(replayLine);
      map.fitBounds(replayLine.getBounds(), { padding: [30, 30] });
    }

  }, [ambulances, hospitals, trafficSignals, showAmbulances, showHospitals, showSignals, showRoutes, replayRoute]);

  useEffect(() => {
    if (focusedEntityId && mapInstanceRef.current) {
      const amb = ambulances?.find(a => a.id === focusedEntityId || a.code === focusedEntityId);
      if (amb && amb.currentLocation) {
        mapInstanceRef.current.flyTo([amb.currentLocation.lat, amb.currentLocation.lng], 15, { duration: 1.2 });
      }
    }
  }, [focusedEntityId, ambulances]);

  return (
    <div className={`relative w-full ${height} rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950`}>
      <div ref={mapRef} className="w-full h-full z-0" />
      
      {!isMiniMap && (
        <div className="absolute top-3 left-3 z-10 bg-slate-900/95 backdrop-blur border border-slate-800 p-2.5 rounded-xl text-[10px] space-y-1 text-slate-300 shadow-xl">
          <div className="font-extrabold text-white uppercase tracking-wider mb-1">Live Map Legend</div>
          <div className="flex items-center space-x-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-ping" />
            <span>Ambulance Unit</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            <span>Hospital ER Hub</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Traffic Signal</span>
          </div>
        </div>
      )}
    </div>
  );
};
