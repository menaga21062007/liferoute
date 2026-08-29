import React, { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { TrafficCone, Radio } from 'lucide-react';
import L from 'leaflet';

export const GreenCorridorDemo = () => {
  const { trafficSignals, ambulances, hospitals } = useApp();

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupRef = useRef(null);

  const activeAmbulance = ambulances.find(
    (a) => a.status === 'EN_ROUTE_TO_PATIENT' || a.status === 'PATIENT_ON_BOARD' || a.status === 'ON_WAY_TO_HOSPITAL'
  ) || ambulances[0];

  const pickupCoords = { lat: 40.715000, lng: -73.955000 };
  const hospitalCoords = hospitals[0]?.location || { lat: 40.730610, lng: -73.935242 };

  const routePolyline = [
    [40.715000, -73.955000],
    [40.718000, -73.950000],
    [40.722000, -73.945000],
    [40.727000, -73.939000],
    [40.730000, -73.936000],
    [40.730610, -73.935242]
  ];

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      const map = L.map(mapRef.current, {
        center: [40.722, -73.945],
        zoom: 13,
        zoomControl: true
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      const layerGroup = L.layerGroup().addTo(map);
      layerGroupRef.current = layerGroup;
      mapInstanceRef.current = map;
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

    // Polyline
    const polyline = L.polyline(routePolyline, { color: '#2563eb', weight: 5, opacity: 0.8 });
    layerGroup.addLayer(polyline);

    // Pickup Marker
    const pickupIcon = L.divIcon({
      className: 'custom-pickup',
      html: `<div style="background-color: #dc2626; color: white; width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid white;">P</div>`,
      iconSize: [26, 26],
      iconAnchor: [13, 13]
    });
    const pm = L.marker([pickupCoords.lat, pickupCoords.lng], { icon: pickupIcon });
    pm.bindPopup('Patient Pickup Point');
    layerGroup.addLayer(pm);

    // Hospital Drop Marker
    const dropHospitalIcon = L.divIcon({
      className: 'custom-drop-hosp',
      html: `<div style="background-color: #059669; color: white; width: 30px; height: 30px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid white;">H</div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });
    const hm = L.marker([hospitalCoords.lat, hospitalCoords.lng], { icon: dropHospitalIcon });
    hm.bindPopup('Government Hospital Drop');
    layerGroup.addLayer(hm);

    // Moving Ambulance Marker
    if (activeAmbulance && activeAmbulance.currentLocation) {
      const movingAmbIcon = L.divIcon({
        className: 'custom-moving-amb',
        html: `<div style="background-color: #2563eb; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 0 12px rgba(37, 99, 235, 1);">🚑</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });
      const am = L.marker([activeAmbulance.currentLocation.lat, activeAmbulance.currentLocation.lng], { icon: movingAmbIcon });
      am.bindPopup(`Ambulance ${activeAmbulance.code}`);
      layerGroup.addLayer(am);
    }

    // Traffic Signal Markers
    trafficSignals.forEach((sig) => {
      if (!sig.location) return;
      const isBlue = sig.blueLightActive;
      const signalIcon = L.divIcon({
        className: 'custom-sig-icon',
        html: `<div style="background-color: ${isBlue ? '#2563eb' : '#475569'}; color: white; width: 26px; height: 26px; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid white; box-shadow: ${isBlue ? '0 0 14px #2563eb' : 'none'};">${isBlue ? '🟦' : '🚦'}</div>`,
        iconSize: [26, 26],
        iconAnchor: [13, 13]
      });

      const sm = L.marker([sig.location.lat, sig.location.lng], { icon: signalIcon });
      sm.bindPopup(`<b>${sig.code} — ${sig.name}</b><br/>Blue Light: ${isBlue ? 'ACTIVE (<200m)' : 'OFF'}`);
      layerGroup.addLayer(sm);
    });
  }, [activeAmbulance, trafficSignals, hospitalCoords, pickupCoords]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
      
      {/* Header Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between text-white shadow">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-blue-600 rounded-lg shadow">
            <TrafficCone className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black">GREEN CORRIDOR AUTOMATED SIGNAL DEMO</h1>
            <p className="text-xs text-slate-400">Automatic Traffic Signal Blue Light Activation (Distance Threshold &lt; 200m)</p>
          </div>
        </div>

        <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-xs font-bold flex items-center space-x-2">
          <Radio className="h-4 w-4 text-blue-400 animate-pulse" />
          <span>Tracking Active Unit: <strong className="text-blue-400">{activeAmbulance.code}</strong></span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column: Traffic Signal Controller Table (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
          <h2 className="text-sm font-black text-slate-200 border-b border-slate-800 pb-2 uppercase tracking-wider">
            Signal Blue Light Controller Monitor
          </h2>

          <div className="space-y-3">
            {trafficSignals.map((sig) => {
              const isBlueOn = sig.blueLightActive;
              return (
                <div
                  key={sig.id}
                  className={`p-3.5 rounded-lg border transition-all ${
                    isBlueOn
                      ? 'bg-blue-950/90 border-blue-500 shadow-lg ring-2 ring-blue-400'
                      : 'bg-slate-950 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-black text-slate-200">{sig.code} — {sig.name}</span>
                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded uppercase ${
                      isBlueOn ? 'bg-blue-600 text-white animate-pulse' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {isBlueOn ? 'BLUE LIGHT ON' : 'OFF'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-medium text-slate-300">
                    <span>Distance to Ambulance:</span>
                    <span className={`font-black ${isBlueOn ? 'text-blue-400' : 'text-slate-400'}`}>
                      {sig.distanceToAmbulanceKm !== null ? `${(sig.distanceToAmbulanceKm * 1000).toFixed(0)} meters` : 'N/A'}
                    </span>
                  </div>

                  {isBlueOn && (
                    <p className="text-[11px] font-extrabold text-blue-300 mt-2 bg-blue-900/40 p-1.5 rounded border border-blue-700/60 text-center">
                      🚨 Ambulance approaching (&lt;200m). Blue light activated automatically!
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Live Route Map (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-2 h-[560px] relative overflow-hidden">
          <div ref={mapRef} className="w-full h-full rounded-lg z-0" />
        </div>

      </div>
    </div>
  );
};
