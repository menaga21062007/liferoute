import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Building2, Ambulance, UserCheck, Activity, MapPin } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const hospitalIcon = L.divIcon({
  className: 'custom-hosp-icon',
  html: `<div style="background-color: #059669; color: white; width: 32px; height: 32px; borderRadius: 8px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid white; box-shadow: 0 0 10px rgba(5, 150, 105, 0.8);">HOSP</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

const incomingAmbIcon = L.divIcon({
  className: 'custom-inc-amb-icon',
  html: `<div style="background-color: #dc2626; color: white; width: 28px; height: 28px; borderRadius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid white; box-shadow: 0 0 10px rgba(220, 38, 38, 0.8);">AMB</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14]
});

export const HospitalDeskDashboard = () => {
  const { hospitals, ambulances } = useApp();
  const [selectedHospitalId, setSelectedHospitalId] = useState(hospitals[0]?.id || 'hosp-1');

  const currentHospital = hospitals.find((h) => h.id === selectedHospitalId) || hospitals[0];

  // Filter ONLY ambulances coming to THIS hospital
  const incomingAmbulances = ambulances.filter(
    (a) => a.targetHospitalId === currentHospital.id && a.patient
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
      
      {/* Hospital Selector Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-wrap items-center justify-between gap-4 text-white">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-700 rounded-lg">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white">{currentHospital.name}</h1>
            <p className="text-xs text-slate-400">Emergency Desk & Trauma Receiving Terminal • {currentHospital.address}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <label className="text-xs font-bold text-slate-400">Switch Government Hospital:</label>
          <select
            value={selectedHospitalId}
            onChange={(e) => setSelectedHospitalId(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-emerald-500"
          >
            {hospitals.map((h) => (
              <option key={h.id} value={h.id}>{h.name} ({h.code})</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column: Incoming Ambulances to THIS hospital (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
          <h2 className="text-sm font-black text-slate-200 border-b border-slate-800 pb-2 uppercase tracking-wider flex items-center justify-between">
            <span>Incoming Ambulance Intakes</span>
            <span className="text-xs text-emerald-400 font-bold">{incomingAmbulances.length} Units En Route</span>
          </h2>

          <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
            {incomingAmbulances.length > 0 ? (
              incomingAmbulances.map((amb) => (
                <div key={amb.id} className="bg-slate-950 border border-slate-800 rounded-lg p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-blue-400">{amb.code} — {amb.unitName}</span>
                    <span className="text-[10px] font-black bg-emerald-950 border border-emerald-700 text-emerald-300 px-2 py-0.5 rounded uppercase">
                      ETA ~4 Mins
                    </span>
                  </div>

                  <div className="text-xs space-y-1">
                    <p className="font-bold text-white">Patient: {amb.patient.name} ({amb.patient.age} y/o {amb.patient.gender})</p>
                    <p className="text-slate-400">Chief Complaint: <span className="text-amber-300 font-medium">{amb.patient.chiefComplaint || 'Accident Trauma'}</span></p>
                  </div>

                  {/* Scene Vitals if entered by crew */}
                  <div className="bg-slate-900 p-2 rounded border border-slate-800 grid grid-cols-3 gap-1 text-[11px] text-center font-bold">
                    <div className="bg-slate-950 py-1 rounded">
                      <span className="text-[9px] text-slate-400 block font-normal">BP</span>
                      <span className="text-white">{amb.patient.vitals?.bp || '120/80'}</span>
                    </div>
                    <div className="bg-slate-950 py-1 rounded">
                      <span className="text-[9px] text-slate-400 block font-normal">SpO2</span>
                      <span className="text-emerald-400">{amb.patient.vitals?.spo2 || '98%'}</span>
                    </div>
                    <div className="bg-slate-950 py-1 rounded">
                      <span className="text-[9px] text-slate-400 block font-normal">Pulse</span>
                      <span className="text-blue-400">{amb.patient.vitals?.pulse || '78 bpm'}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center bg-slate-950 rounded-lg border border-slate-800 text-slate-400 text-xs">
                No active ambulances currently assigned to bring patients to {currentHospital.name}.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Map Tracking ONLY for incoming units (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-2 h-[560px] relative overflow-hidden">
          <MapContainer
            center={[currentHospital.location.lat, currentHospital.location.lng]}
            zoom={13}
            style={{ height: '100%', width: '100%', borderRadius: '8px' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />

            {/* Target Hospital Marker */}
            <Marker position={[currentHospital.location.lat, currentHospital.location.lng]} icon={hospitalIcon}>
              <Popup>
                <div className="text-xs font-bold text-slate-900">
                  <p className="font-black text-emerald-700">{currentHospital.name}</p>
                  <p>{currentHospital.address}</p>
                </div>
              </Popup>
            </Marker>

            {/* ONLY Incoming Ambulances Markers */}
            {incomingAmbulances.map((amb) => (
              <Marker key={amb.id} position={[amb.currentLocation.lat, amb.currentLocation.lng]} icon={incomingAmbIcon}>
                <Popup>
                  <div className="text-xs font-bold text-slate-900">
                    <p className="font-black text-red-600">{amb.code}</p>
                    <p>Patient: {amb.patient.name}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

      </div>
    </div>
  );
};
