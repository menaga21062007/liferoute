import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { TrafficCone, Radio, CheckCircle, AlertTriangle, ShieldCheck, Navigation } from 'lucide-react';
import L from 'leaflet';

export const GreenCorridorDemo = () => {
  const { ambulances, hospitals, trafficSignals } = useApp();
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
    [9.917000, 78.113000],
    [9.924000, 78.098000],
    [9.929500, 78.126500],
    [9.951000, 78.151000],
    [9.927500, 78.125000]
  ];

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

  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    // Green Corridor Polyline
    const polyline = L.polyline(routePolyline, { color: '#059669', weight: 6, opacity: 0.85, dashArray: '10, 6' });
    layerGroup.addLayer(polyline);

    // Patient Pickup Marker
    const pickupIcon = L.divIcon({
      className: 'custom-pickup-marker',
      html: `<div style="background-color: #dc2626; color: white; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 16px; border: 3px solid white; box-shadow: 0 4px 10px rgba(220,38,38,0.6);">📍</div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });
    const pm = L.marker([pickupCoords.lat, pickupCoords.lng], { icon: pickupIcon });
    pm.bindPopup('<b>Patient Pickup Point</b><br/>Madurai Central');
    layerGroup.addLayer(pm);

    // Government Hospital Drop Marker
    const dropHospitalIcon = L.divIcon({
      className: 'custom-drop-hosp-marker',
      html: `<div style="background-color: #064e3b; color: white; width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 22px; border: 3px solid white; box-shadow: 0 4px 12px rgba(6,78,59,0.7);">🏥</div>`,
      iconSize: [44, 44],
      iconAnchor: [22, 22]
    });
    const hm = L.marker([hospitalCoords.lat, hospitalCoords.lng], { icon: dropHospitalIcon });
    hm.bindPopup(`<b>${hospitals[0]?.name || 'Govt Hospital'}</b><br/>Emergency Bay Drop`);
    layerGroup.addLayer(hm);

    // Moving Ambulance Marker
    if (activeAmbulance && activeAmbulance.currentLocation) {
      const movingAmbIcon = L.divIcon({
        className: 'custom-moving-amb-marker',
        html: `<div style="background-color: #059669; color: white; width: 42px; height: 42px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 22px; border: 3px solid white; box-shadow: 0 0 16px rgba(5, 150, 105, 1);">🚑</div>`,
        iconSize: [42, 42],
        iconAnchor: [21, 21]
      });
      const am = L.marker([activeAmbulance.currentLocation.lat, activeAmbulance.currentLocation.lng], { icon: movingAmbIcon });
      am.bindPopup(`<b>Ambulance ${activeAmbulance.code}</b><br/>Driver: ${activeAmbulance.driverName}`);
      layerGroup.addLayer(am);
    }

    // PROMINENT HIGH-VISIBILITY TRAFFIC SIGNAL MARKERS
    trafficSignals.forEach((sig) => {
      if (!sig.location) return;
      const isBlue = sig.blueLightActive;

      const signalIcon = L.divIcon({
        className: 'custom-traffic-signal-icon',
        html: `
          <div style="
            background-color: ${isBlue ? '#1d4ed8' : '#334155'};
            color: white;
            width: 44px;
            height: 44px;
            border-radius: 12px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-weight: 900;
            border: 3px solid ${isBlue ? '#93c5fd' : '#94a3b8'};
            box-shadow: ${isBlue ? '0 0 20px #2563eb, 0 0 40px #2563eb' : '0 4px 8px rgba(0,0,0,0.3)'};
            transition: all 0.3s ease;
          ">
            <span style="font-size: 18px; line-height: 1;">${isBlue ? '🟦' : '🚦'}</span>
            <span style="font-size: 9px; font-weight: 900; text-transform: uppercase; margin-top: 1px;">${sig.code}</span>
          </div>
        `,
        iconSize: [44, 44],
        iconAnchor: [22, 22]
      });

      const sm = L.marker([sig.location.lat, sig.location.lng], { icon: signalIcon });
      sm.bindPopup(`
        <div style="padding: 4px; text-align: center;">
          <h4 style="margin: 0; color: #0f172a; font-size: 13px; font-weight: 800;">${sig.code} - ${sig.name}</h4>
          <p style="margin: 4px 0 0 0; font-size: 11px; font-weight: 700; color: ${isBlue ? '#1d4ed8' : '#64748b'};">
            ${isBlue ? '⚡ BLUE LIGHT ACTIVE (<200m)' : '🚦 SIGNAL NORMAL'}
          </p>
        </div>
      `);
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
            Madurai Traffic Signal Controller Monitor
          </h2>

          <div className="space-y-3">
            {trafficSignals.map((sig) => {
              const isBlueOn = sig.blueLightActive;
              return (
                <div
                  key={sig.id}
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
                          isBlueOn ? 'bg-blue-600 text-white animate-pulse' : 'bg-slate-700 text-white'
                        }`}
                      >
                        {isBlueOn ? '🟦' : '🚦'}
                      </div>
                      <div>
                        <h3 className="font-bold text-xs text-slate-900">{sig.code} - {sig.name}</h3>
                        <p className="text-[10px] text-slate-500 font-semibold">Madurai Junction Signal</p>
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
                      {sig.distanceToAmbulanceKm !== null && sig.distanceToAmbulanceKm !== undefined
                        ? `${sig.distanceToAmbulanceKm} km`
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
              <span>Live Madurai Green Corridor Map View</span>
            </h2>
            <div className="flex items-center space-x-3 text-[10px] font-bold text-slate-600">
              <span className="flex items-center space-x-1">
                <span className="h-3 w-3 bg-red-600 rounded-full inline-block" />
                <span>Pickup (P)</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="h-3 w-3 bg-slate-700 rounded-sm inline-block" />
                <span>Signal (🚦)</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="h-3 w-3 bg-blue-600 rounded-sm inline-block" />
                <span>Blue Light (🟦)</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="h-3 w-3 bg-emerald-800 rounded-md inline-block" />
                <span>Hospital (H)</span>
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
              <strong>Green Corridor Protocol:</strong> When an active ambulance unit is within 200 metres (&lt;0.2km) of a Madurai traffic signal, the signal automatically activates its Blue Light signal to clear traffic.
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
