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

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
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

  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    // Polyline
    const polyline = L.polyline(routePolyline, { color: '#059669', weight: 5, opacity: 0.8 });
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
      html: `<div style="background-color: #064e3b; color: white; width: 30px; height: 30px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid white;">H</div>`,
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
        html: `<div style="background-color: #059669; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 0 12px rgba(5, 150, 105, 1);">🚑</div>`,
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
        html: `<div style="background-color: ${isBlue ? '#2563eb' : '#64748b'}; color: white; width: 26px; height: 26px; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid white; box-shadow: ${isBlue ? '0 0 14px #2563eb' : 'none'};">${isBlue ? '🟦' : '🚦'}</div>`,
        iconSize: [26, 26],
        iconAnchor: [13, 13]
      });

      const sm = L.marker([sig.location.lat, sig.location.lng], { icon: signalIcon });
      sm.bindPopup(`<b>${sig.code} — ${sig.name}</b><br/>Blue Light: ${isBlue ? 'ACTIVE (<200m)' : 'OFF'}`);
      layerGroup.addLayer(sm);
    });
  }, [activeAmbulance, trafficSignals, hospitalCoords, pickupCoords]);

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

        <div className="bg-emerald-900 px-4 py-2 rounded-2xl border border-emerald-600 text-xs font-bold flex items-center space-x-2">
          <Radio className="h-4 w-4 text-emerald-300 animate-pulse" />
          <span>Tracking Active Unit: <strong className="text-emerald-200">{activeAmbulance.code}</strong></span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column: Traffic Signal Controller Table (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-emerald-200 rounded-3xl p-4 space-y-3 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 uppercase tracking-wider font-serif">
            Signal Blue Light Controller Monitor
          </h2>

          <div className="space-y-3">
            {trafficSignals.map((sig) => {
              const isBlueOn = sig.blueLightActive;
              return (
                <div
                  key={sig.id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    isBlueOn
                      ? 'bg-blue-50 border-blue-500 shadow-md ring-2 ring-blue-400'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-900 font-serif">{sig.code} — {sig.name}</span>
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                      isBlueOn ? 'bg-blue-600 text-white animate-pulse' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {isBlueOn ? 'BLUE LIGHT ON' : 'OFF'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-medium text-slate-600">
                    <span>Distance to Ambulance:</span>
                    <span className={`font-extrabold ${isBlueOn ? 'text-blue-700' : 'text-slate-500'}`}>
                      {sig.distanceToAmbulanceKm !== null ? `${(sig.distanceToAmbulanceKm * 1000).toFixed(0)} meters` : 'N/A'}
                    </span>
                  </div>

                  {isBlueOn && (
                    <p className="text-[11px] font-extrabold text-blue-900 mt-2 bg-blue-100 p-1.5 rounded-xl border border-blue-300 text-center">
                      🚨 Ambulance approaching (&lt;200m). Blue light activated automatically!
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Live Route Map (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-emerald-200 rounded-3xl p-2 h-[560px] relative overflow-hidden shadow-sm">
          <div ref={mapRef} className="w-full h-full rounded-2xl z-0" />
        </div>

      </div>
    </div>
  );
};
