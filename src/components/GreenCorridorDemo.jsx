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
    status: "active",
    branch: "Signal 1"
  },
  {
    id: "sig-02",
    code: "TS-02",
    name: "Periyar Bus Stand Junction (Madurai)",
    lat: 9.925000,
    lng: 78.125000,
    status: "active",
    branch: "Signal 2"
  },
  {
    id: "sig-03",
    code: "TS-03",
    name: "Mattuthavani Junction (Madurai)",
    lat: 9.930000,
    lng: 78.135000,
    status: "active",
    branch: "Signal 3"
  },
  {
    id: "sig-04",
    code: "TS-04",
    name: "Kalavasal Junction (Madurai)",
    lat: 9.935000,
    lng: 78.145000,
    status: "active",
    branch: "Signal 4 (Hospital Entrance)"
  }
];

export const GreenCorridorDemo = () => {
  const { ambulances, hospitals, trafficSignals } = useApp();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // Dedicated Leaflet Layer Groups for clean layer ordering & toggle capability
  const routePolylineLayerRef = useRef(null);
  const trafficSignalLayerRef = useRef(null);
  const ambulanceMarkerLayerRef = useRef(null);

  const activeAmbulance = ambulances.find(
    (a) => a.status === 'EN_ROUTE_TO_PATIENT' || a.status === 'PATIENT_ON_BOARD' || a.status === 'ON_WAY_TO_HOSPITAL'
  ) || ambulances[0];

  // Government Hospital is placed at the end of the 4th Signal (TS-04)
  const hospitalCoords = { lat: 9.938000, lng: 78.150000 };

  // Perfectly Straight Line Green Corridor Route connecting Signal 1 -> Signal 2 -> Signal 3 -> Signal 4 -> Hospital
  const straightCorridorRoute = [
    [9.915000, 78.105000], // Start / Pickup
    [9.920000, 78.115000], // TS-01 (Signal 1)
    [9.925000, 78.125000], // TS-02 (Signal 2)
    [9.930000, 78.135000], // TS-03 (Signal 3)
    [9.935000, 78.145000], // TS-04 (Signal 4)
    [9.938000, 78.150000]  // Govt Hospital Drop at the end of Signal 4
  ];

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

      // Create Dedicated Layer Groups in order: Route Polyline -> Signal Markers -> Ambulance/Hospital Markers
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

  useEffect(() => {
    const map = mapInstanceRef.current;
    const routeLayer = routePolylineLayerRef.current;
    const signalLayer = trafficSignalLayerRef.current;
    const ambLayer = ambulanceMarkerLayerRef.current;

    if (!map || !routeLayer || !signalLayer || !ambLayer) return;

    routeLayer.clearLayers();
    signalLayer.clearLayers();
    ambLayer.clearLayers();

    // 1. RENDER PERFECTLY STRAIGHT GREEN CORRIDOR ROUTE POLYLINE
    const straightPolyline = L.polyline(straightCorridorRoute, {
      color: '#059669',
      weight: 7,
      opacity: 0.9,
      dashArray: '12, 6'
    });
    routeLayer.addLayer(straightPolyline);

    // 2. RENDER GOVERNMENT HOSPITAL DROP MARKER (AT THE END OF THE 4TH SIGNAL)
    const dropHospitalIcon = L.divIcon({
      className: 'custom-drop-hosp-marker',
      html: `<div style="background-color: #064e3b; color: white; width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 22px; border: 3px solid white; box-shadow: 0 4px 12px rgba(6,78,59,0.7);">🏥</div>`,
      iconSize: [44, 44],
      iconAnchor: [22, 22]
    });
    const hm = L.marker([hospitalCoords.lat, hospitalCoords.lng], { icon: dropHospitalIcon });
    hm.bindPopup(`<b>${hospitals[0]?.name || 'Govt Rajaji Hospital'}</b><br/>Emergency Bay Drop (At end of Signal 4)`);
    ambLayer.addLayer(hm);

    // 3. RENDER MOVING AMBULANCE MARKER
    if (activeAmbulance && activeAmbulance.currentLocation) {
      const movingAmbIcon = L.divIcon({
        className: 'custom-moving-amb-marker',
        html: `<div style="background-color: #059669; color: white; width: 42px; height: 42px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 22px; border: 3px solid white; box-shadow: 0 0 16px rgba(5, 150, 105, 1);">🚑</div>`,
        iconSize: [42, 42],
        iconAnchor: [21, 21]
      });
      const am = L.marker([activeAmbulance.currentLocation.lat, activeAmbulance.currentLocation.lng], { icon: movingAmbIcon });
      am.bindPopup(`<b>Ambulance ${activeAmbulance.code}</b><br/>Driver: ${activeAmbulance.driverName}`);
      ambLayer.addLayer(am);
    }

    // 4. RENDER TRAFFIC SIGNAL MARKERS IN A STRAIGHT LINE ON DEDICATED trafficSignalLayer
    // Dark navy rounded badge + vertical 3-dot traffic light (🔴🟡🟢) + bold signal code label (TS-##)
    GREEN_CORRIDOR_SIGNALS_CONFIG.forEach((sigConfig) => {
      const stateSignal = trafficSignals.find((s) => s.code === sigConfig.code) || sigConfig;
      const isBlue = stateSignal.blueLightActive;

      const signalDivIcon = L.divIcon({
        className: 'traffic-signal-badge-icon',
        html: `
          <div style="
            background-color: #0f172a;
            border: 2.5px solid ${isBlue ? '#60a5fa' : '#ffffff'};
            border-radius: 12px;
            width: 38px;
            padding: 4px 2px 2px 2px;
            box-shadow: ${isBlue ? '0 0 20px #2563eb, 0 0 40px #2563eb' : '0 4px 12px rgba(0,0,0,0.4)'};
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          ">
            <!-- Vertical Traffic Light Dots (Red, Yellow, Green) -->
            <div style="display: flex; flex-direction: column; items-center; justify-content: center; gap: 2px; background: #020617; padding: 3px 5px; border-radius: 6px; width: 22px;">
              <span style="width: 7px; height: 7px; border-radius: 50%; background-color: #ef4444; display: block; box-shadow: 0 0 4px #ef4444;"></span>
              <span style="width: 7px; height: 7px; border-radius: 50%; background-color: #eab308; display: block; box-shadow: 0 0 4px #eab308;"></span>
              <span style="width: 7px; height: 7px; border-radius: 50%; background-color: #22c55e; display: block; box-shadow: 0 0 4px #22c55e;"></span>
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
          </div>
        `,
        iconSize: [38, 48],
        iconAnchor: [19, 24]
      });

      const sm = L.marker([sigConfig.lat, sigConfig.lng], { icon: signalDivIcon, zIndexOffset: 800 });
      sm.bindPopup(`
        <div style="padding: 6px; text-align: center; font-family: sans-serif;">
          <h4 style="margin: 0; color: #0f172a; font-size: 13px; font-weight: 900;">${sigConfig.code} — ${sigConfig.name}</h4>
          <p style="margin: 4px 0 2px 0; font-size: 11px; font-weight: 700; color: #64748b;">Sequence: ${sigConfig.branch}</p>
          <div style="margin-top: 6px; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 800; background: ${isBlue ? '#dbeafe' : '#f1f5f9'}; color: ${isBlue ? '#1d4ed8' : '#334155'};">
            ${isBlue ? '⚡ BLUE LIGHT ACTIVE (<200m)' : '🚦 SIGNAL NORMAL (CLEAR)'}
          </div>
        </div>
      `);
      signalLayer.addLayer(sm);
    });

  }, [activeAmbulance, trafficSignals, hospitalCoords]);

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
              const stateSig = trafficSignals.find((s) => s.code === sigConfig.code);
              const isBlueOn = stateSig?.blueLightActive;
              return (
                <div
                  key={sigConfig.id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    isBlueOn
                      ? 'bg-blue-50 border-blue-500 shadow-md ring-2 ring-blue-300'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div
                        className={`h-9 w-9 rounded-xl flex items-center justify-center font-black text-xs ${
                          isBlueOn ? 'bg-blue-600 text-white animate-pulse' : 'bg-slate-900 text-white border border-slate-700'
                        }`}
                      >
                        {isBlueOn ? '🟦' : '🚦'}
                      </div>
                      <div>
                        <h3 className="font-bold text-xs text-slate-900">{sigConfig.code} - {sigConfig.name}</h3>
                        <p className="text-[10px] text-slate-500 font-semibold">{sigConfig.branch}</p>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        isBlueOn
                          ? 'bg-blue-600 text-white animate-bounce'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {isBlueOn ? 'BLUE LIGHT ON' : 'NORMAL'}
                    </span>
                  </div>

                  <div className="mt-2 text-[11px] font-medium text-slate-600 flex justify-between items-center border-t border-slate-200/60 pt-1.5">
                    <span>Distance to Ambulance:</span>
                    <span className={`font-bold ${isBlueOn ? 'text-blue-700 text-xs' : 'text-slate-800'}`}>
                      {stateSig?.distanceToAmbulanceKm !== null && stateSig?.distanceToAmbulanceKm !== undefined
                        ? `${stateSig.distanceToAmbulanceKm} km`
                        : 'Tracking...'}
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
                <span className="h-3 w-3 bg-blue-600 rounded-sm inline-block" />
                <span>Blue Light (🟦)</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="h-3 w-3 bg-emerald-800 rounded-md inline-block" />
                <span>Hospital (End of Signal 4)</span>
              </span>
            </div>
          </div>

          <div
            ref={mapRef}
            className="w-full h-[440px] rounded-2xl border border-slate-200 shadow-inner z-0 overflow-hidden"
          />

          <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200 text-xs font-medium text-emerald-950 flex items-center space-x-2">
            <ShieldCheck className="h-5 w-5 text-emerald-700 shrink-0" />
            <span>
              <strong>Straight Green Corridor Protocol:</strong> Ambulance travels straight through Signal 1 (TS-01) ➔ Signal 2 (TS-02) ➔ Signal 3 (TS-03) ➔ Signal 4 (TS-04) and reaches Government Rajaji Hospital at the end of the 4th signal.
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
