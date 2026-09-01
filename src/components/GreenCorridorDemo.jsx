import React, { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { TrafficCone, Radio } from 'lucide-react';
import L from 'leaflet';

export const GreenCorridorDemo = () => {
  const { trafficSignals = [], ambulances = [], hospitals = [] } = useApp();

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupRef = useRef(null);

  const activeAmbulance = ambulances.find(
    (a) => a.status === 'EN_ROUTE_TO_PATIENT' || a.status === 'PATIENT_ON_BOARD' || a.status === 'ON_WAY_TO_HOSPITAL'
  ) || ambulances[0];

  const pickupCoords = { lat: 9.920000, lng: 78.116000 };
  const hospitalCoords = hospitals[0]?.location || { lat: 9.927500, lng: 78.125000 };

  const routePolyline = [
    [9.920000, 78.116000],
    [9.929500, 78.126500],
    [9.917000, 78.113000],
    [9.951000, 78.151000],
    [9.924000, 78.098000],
    [9.927500, 78.125000]
  ];

  // Initialize Leaflet Map Engine (Identical to Hospital Desk Dashboard)
  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      if (mapRef.current._leaflet_id) {
        mapRef.current._leaflet_id = null;
      }

      const map = L.map(mapRef.current, {
        center: [9.9252, 78.1200],
        zoom: 13,
        zoomControl: true
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
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

  // Update map markers, route polylines, and icons (Identical to Hospital Desk Map)
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    // 1. Draw Polyline Green Corridor Route
    const polyline = L.polyline(routePolyline, {
      color: '#059669',
      weight: 6,
      opacity: 0.85,
      dashArray: '8, 8'
    });
    layerGroup.addLayer(polyline);

    // 2. Draw Hospitals on Map (Same as Hospital Desk)
    hospitals.forEach((hosp) => {
      if (!hosp.location) return;
      const hospitalIcon = L.divIcon({
        className: 'custom-hosp-icon-lg',
        html: `<div style="background-color: #064e3b; color: white; width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 16px; border: 3px solid white; box-shadow: 0 0 14px rgba(6, 78, 59, 0.9);">🏥</div>`,
        iconSize: [44, 44],
        iconAnchor: [22, 22]
      });

      const hm = L.marker([hosp.location.lat, hosp.location.lng], { icon: hospitalIcon });
      hm.bindPopup(`<b>${hosp.name}</b><br/>Beds Available: ${hosp.availableBeds}/${hosp.totalBeds}`);
      layerGroup.addLayer(hm);
    });

    // 3. Draw Pickup Point Marker
    const pickupIcon = L.divIcon({
      className: 'custom-pickup-lg',
      html: `<div style="background-color: #dc2626; color: white; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 16px; border: 3px solid white; box-shadow: 0 0 12px rgba(220, 38, 38, 0.8);">📍</div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });
    const pm = L.marker([pickupCoords.lat, pickupCoords.lng], { icon: pickupIcon });
    pm.bindPopup('Patient Pickup Point (Madurai Central)');
    layerGroup.addLayer(pm);

    // 4. Draw Active Ambulances (Same as Hospital Desk)
    ambulances.forEach((amb) => {
      if (!amb.currentLocation) return;
      const ambIcon = L.divIcon({
        className: 'custom-amb-icon-lg',
        html: `<div style="background-color: #059669; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 18px; border: 3px solid white; box-shadow: 0 0 16px rgba(5, 150, 105, 1);">🚑</div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

      const am = L.marker([amb.currentLocation.lat, amb.currentLocation.lng], { icon: ambIcon });
      am.bindPopup(`<b>Ambulance ${amb.code}</b><br/>Status: ${amb.status}<br/>${amb.patient ? `Patient: ${amb.patient.name}` : 'Ready'}`);
      layerGroup.addLayer(am);
    });

    // 5. Draw Traffic Signal Markers (Same as Hospital Desk)
    trafficSignals.forEach((sig) => {
      if (!sig.location) return;
      const isBlue = sig.blueLightActive;
      const signalIcon = L.divIcon({
        className: 'custom-sig-icon',
        html: `
          <div style="
            background: ${isBlue ? 'linear-gradient(135deg, #1e40af, #3b82f6)' : 'linear-gradient(135deg, #1e293b, #334155)'};
            color: white;
            width: 44px;
            height: 44px;
            border-radius: 12px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            border: 3px solid ${isBlue ? '#60a5fa' : '#94a3b8'};
            box-shadow: ${isBlue ? '0 0 20px #3b82f6, 0 0 40px #2563eb' : '0 4px 6px rgba(0,0,0,0.3)'};
            position: relative;
          ">
            <span>${isBlue ? '🚨' : '🚦'}</span>
            <span style="font-size: 9px; font-weight: 900; background: rgba(0,0,0,0.6); padding: 0 4px; border-radius: 4px; margin-top: -2px;">${sig.code}</span>
            ${isBlue ? '<span style="position: absolute; top: -6px; right: -6px; width: 14px; height: 14px; background: #60a5fa; border-radius: 50%; border: 2px solid white; animation: ping 1s infinite;"></span>' : ''}
          </div>
        `,
        iconSize: [44, 44],
        iconAnchor: [22, 22]
      });

      const sm = L.marker([sig.location.lat, sig.location.lng], { icon: signalIcon });
      sm.bindPopup(`<b>${sig.code} — ${sig.name}</b><br/>Blue Light Status: ${isBlue ? '🔵 ACTIVE GREEN CORRIDOR (<200m)' : '⚪ NORMAL (OFF)'}`);
      layerGroup.addLayer(sm);
    });

    setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 200);

  }, [activeAmbulance, trafficSignals, hospitals, ambulances]);

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
            <p className="text-xs text-emerald-200 font-medium">Automatic Traffic Signal Blue Light Activation (Distance Threshold &lt; 200m)</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-emerald-800 border border-emerald-600 px-3.5 py-2 rounded-xl text-xs font-extrabold text-white shadow">
          <Radio className="h-4 w-4 text-emerald-300 animate-pulse" />
          <span>Active Dispatch Unit: <span className="text-emerald-200 font-black">{activeAmbulance ? activeAmbulance.code : 'AMB-101'}</span></span>
        </div>
      </div>

      {/* Main Grid: Left Traffic Signal Monitor, Right Interactive Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 5 Cols: Signal Controller Panel */}
        <div className="lg:col-span-5 bg-white border border-emerald-200 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="border-b border-emerald-100 pb-3">
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              Signal Blue Light Controller Monitor
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              4 Madurai Traffic Signals with automatic distance calculation
            </p>
          </div>

          <div className="space-y-3">
            {trafficSignals.map((sig) => {
              const isBlue = sig.blueLightActive;
              return (
                <div
                  key={sig.id}
                  className={`p-4 rounded-2xl border-2 transition-all space-y-2 ${
                    isBlue
                      ? 'bg-blue-50 border-blue-500 shadow-md ring-2 ring-blue-200'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-extrabold text-xs text-slate-900 block">{sig.code} — {sig.name}</span>
                      <span className="text-[11px] font-bold text-slate-500">
                        Distance to Ambulance: <strong className="text-slate-800">{sig.distanceToAmbulanceKm !== null ? `${Math.round(sig.distanceToAmbulanceKm * 1000)} meters` : 'Calculating...'}</strong>
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider ${
                        isBlue
                          ? 'bg-blue-600 text-white animate-pulse shadow-sm'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {isBlue ? 'BLUE LIGHT ON' : 'OFF'}
                    </span>
                  </div>

                  {isBlue && (
                    <div className="bg-blue-100 border border-blue-300 rounded-xl p-2 text-[11px] font-bold text-blue-900 flex items-center space-x-1.5 animate-bounce">
                      <span>🚨 Ambulance approaching (&lt;200m). Blue light activated automatically!</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 7 Cols: Interactive Map matching Hospital Desk Map */}
        <div className="lg:col-span-7 bg-white border border-emerald-200 rounded-3xl p-3 shadow-sm min-h-[500px] flex flex-col">
          <div className="flex items-center justify-between px-3 py-2 border-b border-emerald-100 mb-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Live Green Corridor Map Tracking</span>
            <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              Madurai, Tamil Nadu
            </span>
          </div>

          <div
            ref={mapRef}
            className="w-full h-[520px] rounded-2xl overflow-hidden border border-slate-200 shadow-inner z-0"
          />
        </div>

      </div>

    </div>
  );
};
