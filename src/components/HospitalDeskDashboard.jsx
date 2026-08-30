import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Building2, Ambulance } from 'lucide-react';
import L from 'leaflet';

export const HospitalDeskDashboard = () => {
  const { hospitals, ambulances } = useApp();
  const [selectedHospitalId, setSelectedHospitalId] = useState(hospitals[0]?.id || 'hosp-1');

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupRef = useRef(null);

  const currentHospital = hospitals.find((h) => h.id === selectedHospitalId) || hospitals[0];
  const incomingAmbulances = ambulances.filter(
    (a) => a.targetHospitalId === currentHospital.id && a.patient
  );

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      const map = L.map(mapRef.current, {
        center: [currentHospital.location.lat, currentHospital.location.lng],
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

    // Target Hospital Marker
    const hospitalIcon = L.divIcon({
      className: 'custom-hosp-icon',
      html: `<div style="background-color: #064e3b; color: white; width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid white; box-shadow: 0 0 10px rgba(6, 78, 59, 0.8);">HOSP</div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    const hm = L.marker([currentHospital.location.lat, currentHospital.location.lng], { icon: hospitalIcon });
    hm.bindPopup(`<b>${currentHospital.name}</b><br/>${currentHospital.address}`);
    layerGroup.addLayer(hm);

    // Incoming Ambulances Markers ONLY
    incomingAmbulances.forEach((amb) => {
      if (!amb.currentLocation) return;
      const incomingAmbIcon = L.divIcon({
        className: 'custom-inc-amb-icon',
        html: `<div style="background-color: #dc2626; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid white; box-shadow: 0 0 10px rgba(220, 38, 38, 0.8);">AMB</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const am = L.marker([amb.currentLocation.lat, amb.currentLocation.lng], { icon: incomingAmbIcon });
      am.bindPopup(`<b>${amb.code}</b><br/>Patient: ${amb.patient?.name}`);
      layerGroup.addLayer(am);
    });

    map.panTo([currentHospital.location.lat, currentHospital.location.lng]);
  }, [currentHospital, incomingAmbulances]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 space-y-4 text-slate-800">
      
      {/* Hospital Selector Bar */}
      <div className="bg-[#064e3b] text-white p-4 rounded-3xl flex flex-wrap items-center justify-between gap-4 shadow-md border border-emerald-700">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-600 rounded-xl">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-serif text-white">{currentHospital.name}</h1>
            <p className="text-xs text-emerald-200 font-medium">Emergency Desk & Trauma Receiving Terminal • {currentHospital.address}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <label className="text-xs font-bold text-emerald-100">Switch Hospital:</label>
          <select
            value={selectedHospitalId}
            onChange={(e) => setSelectedHospitalId(e.target.value)}
            className="bg-emerald-900 border border-emerald-600 rounded-xl px-3 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-emerald-400"
          >
            {hospitals.map((h) => (
              <option key={h.id} value={h.id}>{h.name} ({h.code})</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column: Incoming Ambulances to THIS hospital (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-emerald-200 rounded-3xl p-4 space-y-3 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 uppercase tracking-wider flex items-center justify-between font-serif">
            <span>Incoming Ambulance Intakes</span>
            <span className="text-xs text-emerald-700 font-bold">{incomingAmbulances.length} Units En Route</span>
          </h2>

          <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
            {incomingAmbulances.length > 0 ? (
              incomingAmbulances.map((amb) => (
                <div key={amb.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-emerald-900">{amb.code} — {amb.unitName}</span>
                    <span className="text-[10px] font-extrabold bg-emerald-100 border border-emerald-300 text-emerald-900 px-2.5 py-0.5 rounded-full uppercase">
                      ETA ~4 Mins
                    </span>
                  </div>

                  <div className="text-xs space-y-1">
                    <p className="font-bold text-slate-900 font-serif">Patient: {amb.patient.name} ({amb.patient.age} y/o {amb.patient.gender})</p>
                    <p className="text-slate-600">Chief Complaint: <span className="text-amber-700 font-medium">{amb.patient.chiefComplaint || 'Accident Trauma'}</span></p>
                  </div>

                  {/* Scene Vitals if entered by crew */}
                  <div className="bg-white p-2 rounded-xl border border-emerald-200 grid grid-cols-3 gap-1 text-[11px] text-center font-bold">
                    <div className="bg-emerald-50/60 py-1 rounded-lg">
                      <span className="text-[9px] text-slate-500 block font-normal">BP</span>
                      <span className="text-slate-900">{amb.patient.vitals?.bp || '120/80'}</span>
                    </div>
                    <div className="bg-emerald-50/60 py-1 rounded-lg">
                      <span className="text-[9px] text-slate-500 block font-normal">SpO2</span>
                      <span className="text-emerald-700">{amb.patient.vitals?.spo2 || '98%'}</span>
                    </div>
                    <div className="bg-emerald-50/60 py-1 rounded-lg">
                      <span className="text-[9px] text-slate-500 block font-normal">Pulse</span>
                      <span className="text-blue-700">{amb.patient.vitals?.pulse || '78 bpm'}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs font-medium">
                No active ambulances currently assigned to bring patients to {currentHospital.name}.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Map Tracking ONLY for incoming units (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-emerald-200 rounded-3xl p-2 h-[560px] relative overflow-hidden shadow-sm">
          <div ref={mapRef} className="w-full h-full rounded-2xl z-0" />
        </div>

      </div>
    </div>
  );
};
