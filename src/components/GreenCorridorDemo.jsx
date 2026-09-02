import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { TrafficCone, Radio, ShieldCheck, Navigation } from 'lucide-react';
import L from 'leaflet';

/**
 * ============================================================================
 * TRAFFIC SIGNAL DATA CONFIGURATION (MADURAI STRAIGHT CORRIDOR)
 * ============================================================================
 * 4 Traffic Signals Aligned in a Straight Line (TS-01 -> TS-02 -> TS-03 -> TS-04)
 * Government Hospital is positioned directly at the end of the 4th Signal (TS-04).
 * ============================================================================
 */
export const GREEN_CORRIDOR_SIGNALS_CONFIG = [
  {
    id: "sig-01",
    code: "TS-01",
    name: "Goripalayam Junction (Madurai)",
    lat: 9.920000,
    lng: 78.115000,
    branch: "Signal 1"
  },
  {
    id: "sig-02",
    code: "TS-02",
    name: "Periyar Bus Stand Junction (Madurai)",
    lat: 9.925000,
    lng: 78.125000,
    branch: "Signal 2"
  },
  {
    id: "sig-03",
    code: "TS-03",
    name: "Mattuthavani Junction (Madurai)",
    lat: 9.930000,
    lng: 78.135000,
    branch: "Signal 3"
  },
  {
    id: "sig-04",
    code: "TS-04",
    name: "Kalavasal Junction (Madurai)",
    lat: 9.935000,
    lng: 78.145000,
    branch: "Signal 4 (Hospital Entrance)"
  }
];

// GENERATE 50 SMOOTH MICRO-STEPS ALONG THE STRAIGHT CORRIDOR ROUTE
const TOTAL_STEPS = 50;
const START_POINT = { lat: 9.915000, lng: 78.105000 };
const END_POINT   = { lat: 9.938000, lng: 78.150000 }; // Hospital Drop at end of 4th Signal

const DEMO_WAYPOINTS = Array.from({ length: TOTAL_STEPS }, (_, i) => {
  const ratio = i / (TOTAL_STEPS - 1);
  return {
    lat: START_POINT.lat + (END_POINT.lat - START_POINT.lat) * ratio,
    lng: START_POINT.lng + (END_POINT.lng - START_POINT.lng) * ratio
  };
});

// Calculate distance in kilometers
const calcDistKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const GreenCorridorDemo = () => {
  const { ambulances, hospitals } = useApp();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // Dedicated Leaflet Layer Groups for clean layer ordering
  const routePolylineLayerRef = useRef(null);
  const trafficSignalLayerRef = useRef(null);
  const ambulanceMarkerLayerRef = useRef(null);

  // Smooth client-side step counter (0 to 49)
  const [stepIndex, setStepIndex] = useState(0);

  const activeAmbulance = ambulances.find(
    (a) => a.status === 'EN_ROUTE_TO_PATIENT' || a.status === 'PATIENT_ON_BOARD' || a.status === 'ON_WAY_TO_HOSPITAL'
  ) || ambulances[0];

  const currentAmbLocation = DEMO_WAYPOINTS[stepIndex];

  // Government Hospital is placed at the end of the 4th Signal (TS-04)
  const hospitalCoords = { lat: 9.938000, lng: 78.150000 };

  // Perfectly Straight Line Green Corridor Polyline
  const straightCorridorRoute = [
    [9.915000, 78.105000], // Start / Pickup
    [9.920000, 78.115000], // TS-01 (Signal 1)
    [9.925000, 78.125000], // TS-02 (Signal 2)
    [9.930000, 78.135000], // TS-03 (Signal 3)
    [9.935000, 78.145000], // TS-04 (Signal 4)
    [9.938000, 78.150000]  // Govt Hospital Drop at the end of Signal 4
  ];

  // 1. SMOOTH ANIMATION TIMER: Advance stepIndex every 700ms
  useEffect(() => {
    const timer = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % TOTAL_STEPS);
    }, 700);
    return () => clearInterval(timer);
  }, []);

  // 2. LEAFLET MAP INITIALIZATION
  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      if (mapRef.current._leaflet_id) {
        mapRef.current._leaflet_id = null;
      }

      const map = L.map(mapRef.current, {
        center: [9.9265, 78.1275],
        zoom: 13,
        zoomControl: true
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(map);

      routePolylineLayerRef.current = L.layerGroup().addTo(map);
      trafficSignalLayerRef.current = L.layerGroup().addTo(map);
      ambulanceMarkerLayerRef.current = L.layerGroup().addTo(map);

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
        routePolylineLayerRef.current = null;
        trafficSignalLayerRef.current = null;
        ambulanceMarkerLayerRef.current = null;
      }
    };
  }, []);

  // 3. RENDER / UPDATE MAP MARKERS & SIGNALS GLOW STATE ON EACH STEP
  useEffect(() => {
    const map = mapInstanceRef.current;
    const routeLayer = routePolylineLayerRef.current;
    const signalLayer = trafficSignalLayerRef.current;
    const ambLayer = ambulanceMarkerLayerRef.current;

    if (!map || !routeLayer || !signalLayer || !ambLayer) return;

    routeLayer.clearLayers();
    signalLayer.clearLayers();
    ambLayer.clearLayers();

    // RENDER ANIMATED FLOWING GREEN CORRIDOR ROUTE POLYLINE
    const straightPolyline = L.polyline(straightCorridorRoute, {
      className: 'animate-polyline-flow',
      color: '#059669',
      weight: 8,
      opacity: 0.95
    });
    routeLayer.addLayer(straightPolyline);

    // RENDER GOVERNMENT HOSPITAL DROP MARKER WITH PULSING AURA (AT THE END OF THE 4TH SIGNAL)
    const dropHospitalIcon = L.divIcon({
      className: 'custom-drop-hosp-marker',
      html: `
        <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; inset: -8px; background: rgba(6, 78, 59, 0.35); border-radius: 16px;" class="animate-pulse"></div>
          <div style="background-color: #064e3b; color: white; width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 22px; border: 3px solid white; box-shadow: 0 0 20px rgba(6,78,59,0.9); z-index: 10;">🏥</div>
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 22]
    });
    const hm = L.marker([hospitalCoords.lat, hospitalCoords.lng], { icon: dropHospitalIcon });
    hm.bindPopup(`<b>${hospitals[0]?.name || 'Govt Rajaji Hospital'}</b><br/>Emergency Bay Drop (At end of Signal 4)`);
    ambLayer.addLayer(hm);

    // RENDER MOVING AMBULANCE MARKER WITH EXPANDING RIPPLE ANIMATION
    const movingAmbIcon = L.divIcon({
      className: 'custom-moving-amb-marker',
      html: `
        <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; inset: -12px; background: rgba(5, 150, 105, 0.45); border-radius: 50%;" class="animate-amb-ripple"></div>
          <div style="background-color: #059669; color: white; width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 22px; border: 3px solid white; box-shadow: 0 0 24px #059669; z-index: 10;">🚑</div>
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 22]
    });
    const am = L.marker([currentAmbLocation.lat, currentAmbLocation.lng], { icon: movingAmbIcon, zIndexOffset: 1000 });
    am.bindPopup(`<b>Ambulance ${activeAmbulance.code}</b><br/>Driver: ${activeAmbulance.driverName}<br/>Status: MOVING ON GREEN CORRIDOR`);
    ambLayer.addLayer(am);

    // RENDER ULTRA-HIGHLIGHTED TRAFFIC SIGNAL MARKERS (< 0.35 km / 350m)
    GREEN_CORRIDOR_SIGNALS_CONFIG.forEach((sigConfig) => {
      const distKm = calcDistKm(
        currentAmbLocation.lat,
        currentAmbLocation.lng,
        sigConfig.lat,
        sigConfig.lng
      );
      const isBlue = distKm <= 0.35; // Blue light glows when ambulance is within 350 meters

      const signalDivIcon = L.divIcon({
        className: 'traffic-signal-badge-icon',
        html: `
          <div style="
            position: relative;
            background-color: ${isBlue ? '#1d4ed8' : '#0f172a'};
            border: 3px solid ${isBlue ? '#93c5fd' : '#ffffff'};
            border-radius: 14px;
            width: 44px;
            padding: 5px 2px 3px 2px;
            box-shadow: ${isBlue ? '0 0 30px #2563eb, 0 0 60px #2563eb, 0 0 90px #60a5fa' : '0 4px 12px rgba(0,0,0,0.4)'};
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            transform: ${isBlue ? 'scale(1.28)' : 'scale(1.0)'};
          " class="${isBlue ? 'animate-blue-beacon' : ''}">
            
            <!-- HIGHLY HIGHLIGHTED BLUE LIGHT BEACON / SIREN ON TOP WHEN ACTIVE -->
            <div style="
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              gap: 3px;
              background: ${isBlue ? '#020617' : '#020617'};
              padding: 4px 6px;
              border-radius: 8px;
              width: 28px;
            ">
              <!-- TOP GLOWING BLUE SIREN LIGHT -->
              <span style="
                width: ${isBlue ? '12px' : '7px'};
                height: ${isBlue ? '12px' : '7px'};
                border-radius: 50%;
                background-color: ${isBlue ? '#60a5fa' : '#ef4444'};
                display: block;
                box-shadow: ${isBlue ? '0 0 14px #60a5fa, 0 0 24px #3b82f6' : '0 0 4px #ef4444'};
                transition: all 0.3s ease;
              "></span>

              <!-- MIDDLE LIGHT -->
              <span style="
                width: 7px;
                height: 7px;
                border-radius: 50%;
                background-color: ${isBlue ? '#93c5fd' : '#eab308'};
                display: block;
                box-shadow: ${isBlue ? '0 0 8px #93c5fd' : '0 0 4px #eab308'};
              "></span>

              <!-- BOTTOM LIGHT -->
              <span style="
                width: 7px;
                height: 7px;
                border-radius: 50%;
                background-color: ${isBlue ? '#2563eb' : '#22c55e'};
                display: block;
                box-shadow: ${isBlue ? '0 0 8px #2563eb' : '0 0 4px #22c55e'};
              "></span>
            </div>
            
            <!-- Signal Code Label (e.g. TS-01, TS-02) -->
            <div style="
              color: #ffffff;
              font-weight: 900;
              font-size: 10px;
              font-family: monospace;
              letter-spacing: -0.5px;
              margin-top: 3px;
              text-align: center;
            ">
              ${sigConfig.code}
            </div>

            <!-- HIGHLY VISIBLE "BLUE ON" BADGE BELOW MARKER -->
            ${isBlue ? `
              <div style="
                position: absolute;
                bottom: -18px;
                background: #2563eb;
                color: #ffffff;
                font-size: 8px;
                font-weight: 900;
                padding: 1px 4px;
                border-radius: 4px;
                border: 1px solid #93c5fd;
                white-space: nowrap;
                box-shadow: 0 0 10px #2563eb;
              ">
                BLUE ON ⚡
              </div>
            ` : ''}
          </div>
        `,
        iconSize: [44, 54],
        iconAnchor: [22, 27]
      });

      const sm = L.marker([sigConfig.lat, sigConfig.lng], { icon: signalDivIcon, zIndexOffset: isBlue ? 950 : 800 });
      sm.bindPopup(`
        <div style="padding: 6px; text-align: center; font-family: sans-serif;">
          <h4 style="margin: 0; color: #0f172a; font-size: 13px; font-weight: 900;">${sigConfig.code} — ${sigConfig.name}</h4>
          <p style="margin: 4px 0 2px 0; font-size: 11px; font-weight: 700; color: #64748b;">Distance: ${distKm.toFixed(2)} km</p>
          <div style="margin-top: 6px; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 900; background: ${isBlue ? '#2563eb' : '#f1f5f9'}; color: ${isBlue ? '#ffffff' : '#334155'}; shadow: ${isBlue ? '0 0 12px #2563eb' : 'none'};">
            ${isBlue ? '⚡ ULTRA BLUE LIGHT ACTIVE (<200m)' : '🚦 SIGNAL NORMAL (CLEAR)'}
          </div>
        </div>
      `);
      signalLayer.addLayer(sm);
    });

  }, [stepIndex, currentAmbLocation, activeAmbulance, hospitals]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 space-y-4 text-slate-800">
      
      {/* Header Bar */}
      <div className="bg-[#064e3b] text-white p-4 rounded-3xl flex flex-wrap items-center justify-between gap-4 shadow-md border border-emerald-700">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-600 rounded-xl">
            <TrafficCone className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-serif text-white">GREEN CORRIDOR AUTOMATED SIGNAL DEMO</h1>
            <p className="text-xs text-emerald-200 font-medium">Automatic Traffic Signal Blue Light Activation (Straight Line Corridor TS-01 ➔ TS-02 ➔ TS-03 ➔ TS-04 ➔ Hospital)</p>
          </div>
        </div>

        <div className="bg-emerald-900 px-4 py-2 rounded-2xl border border-emerald-600 text-xs font-bold flex items-center space-x-2">
          <Radio className="h-4 w-4 text-emerald-300 animate-pulse" />
          <span>Tracking Active Unit: <strong className="text-emerald-200">{activeAmbulance.code}</strong></span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column: Traffic Signal Controller Table (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-emerald-200 rounded-3xl p-4 space-y-3 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 uppercase tracking-wider font-serif">
            Madurai Traffic Signal Controller Monitor
          </h2>

          <div className="space-y-3">
            {GREEN_CORRIDOR_SIGNALS_CONFIG.map((sigConfig) => {
              const distKm = calcDistKm(
                currentAmbLocation.lat,
                currentAmbLocation.lng,
                sigConfig.lat,
                sigConfig.lng
              );
              const isBlueOn = distKm <= 0.35;

              return (
                <div
                  key={sigConfig.id}
                  className={`p-3.5 rounded-2xl border transition-all duration-300 ${
                    isBlueOn
                      ? 'bg-blue-600 border-blue-400 text-white shadow-xl shadow-blue-600/40 ring-4 ring-blue-300 scale-[1.03] animate-pulse'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div
                        className={`h-10 w-10 rounded-xl flex items-center justify-center font-black text-sm transition-all ${
                          isBlueOn ? 'bg-white text-blue-700 animate-bounce shadow-lg shadow-white/80' : 'bg-slate-900 text-white border border-slate-700'
                        }`}
                      >
                        {isBlueOn ? '🟦' : '🚦'}
                      </div>
                      <div>
                        <h3 className={`font-black text-xs ${isBlueOn ? 'text-white' : 'text-slate-900'}`}>{sigConfig.code} - {sigConfig.name}</h3>
                        <p className={`text-[10px] font-semibold ${isBlueOn ? 'text-blue-100' : 'text-slate-500'}`}>{sigConfig.branch}</p>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider transition-all ${
                        isBlueOn
                          ? 'bg-white text-blue-900 shadow-md font-extrabold animate-bounce'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {isBlueOn ? '⚡ BLUE LIGHT ON' : 'NORMAL'}
                    </span>
                  </div>

                  <div className={`mt-2 text-[11px] font-medium flex justify-between items-center border-t pt-1.5 ${isBlueOn ? 'border-blue-400/80 text-blue-100' : 'border-slate-200/60 text-slate-600'}`}>
                    <span>Distance to Ambulance:</span>
                    <span className={`font-extrabold ${isBlueOn ? 'text-white text-xs underline decoration-2' : 'text-slate-800'}`}>
                      {distKm.toFixed(2)} km
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Live Interactive Green Corridor Map (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-emerald-200 rounded-3xl p-4 shadow-sm flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-serif flex items-center space-x-2">
              <Navigation className="h-4 w-4 text-emerald-700" />
              <span>Straight Corridor Map (TS-01 ➔ TS-02 ➔ TS-03 ➔ TS-04 ➔ Hospital)</span>
            </h2>
            <div className="flex items-center space-x-3 text-[10px] font-bold text-slate-600">
              <span className="flex items-center space-x-1">
                <span className="h-3.5 w-3.5 bg-slate-900 border border-white rounded-sm inline-block text-[8px] text-center leading-none text-white">🚦</span>
                <span>Signal (TS-##)</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="h-3 w-3 bg-blue-600 rounded-sm inline-block shadow-sm shadow-blue-500" />
                <span className="text-blue-700 font-extrabold">Blue Light (🟦)</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="h-3 w-3 bg-emerald-800 rounded-md inline-block" />
                <span>Hospital (End of Signal 4)</span>
              </span>
            </div>
          </div>

          <div
            ref={mapRef}
            className="w-full h-[480px] rounded-2xl border border-slate-200 shadow-inner z-0 overflow-hidden"
          />
        </div>


      </div>

    </div>
  );
};
