import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PhoneCall, MapPin, Ambulance, Clock, CheckCircle2, ShieldCheck, User } from 'lucide-react';

export const CallCentreDashboard = () => {
  const { sosEmergencies, ambulances, assignAmbulance, hospitals } = useApp();
  const [selectedSosId, setSelectedSosId] = useState(sosEmergencies[0]?.id || null);
  const [selectedAmbulanceCode, setSelectedAmbulanceCode] = useState('AMB-101');

  const selectedSos = sosEmergencies.find((s) => s.id === selectedSosId) || sosEmergencies[0];

  const handleDispatch = (e) => {
    e.preventDefault();
    if (!selectedSos) return;
    assignAmbulance(selectedSos.id, selectedAmbulanceCode);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 space-y-4 text-slate-800">
      
      {/* Top Banner */}
      <div className="bg-[#064e3b] text-white p-4 rounded-3xl flex flex-wrap items-center justify-between gap-4 shadow-md border border-emerald-700">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-600 rounded-xl">
            <PhoneCall className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-serif text-white">AMBULANCE CALL CENTRE OPERATOR DESK</h1>
            <p className="text-xs text-emerald-200 font-medium">Madurai Emergency Control Room • Rapid Dispatch Unit</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs font-bold">
          <div className="bg-emerald-900/80 px-3.5 py-1.5 rounded-xl border border-emerald-600">
            Active Emergencies: <span className="text-red-300 font-extrabold">{sosEmergencies.length}</span>
          </div>
          <div className="bg-emerald-900/80 px-3.5 py-1.5 rounded-xl border border-emerald-600">
            Available Units: <span className="text-emerald-200 font-extrabold">{ambulances.filter(a => a.status === 'AVAILABLE').length}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column: Incoming Active SOS List (6 cols) */}
        <div className="lg:col-span-6 bg-white border border-emerald-200 rounded-3xl p-4 space-y-3 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 uppercase tracking-wider flex items-center justify-between font-serif">
            <span>Incoming Emergency Queue</span>
            <span className="text-xs text-emerald-700 font-normal">Real-time Queue</span>
          </h2>

          <div className="space-y-2.5 max-h-[550px] overflow-y-auto pr-1">
            {sosEmergencies.map((sos) => {
              const isSelected = selectedSos?.id === sos.id;
              return (
                <div
                  key={sos.id}
                  onClick={() => setSelectedSosId(sos.id)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-600 shadow-md ring-2 ring-emerald-400'
                      : 'bg-slate-50 border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-extrabold text-red-600 uppercase tracking-wider">{sos.id}</span>
                    <span className="text-[10px] text-slate-500 font-medium flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{sos.timestamp}</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-slate-900 font-serif">{sos.patientName} ({sos.age} y/o)</span>
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                      sos.status === 'PENDING_DISPATCH' ? 'bg-red-100 border border-red-300 text-red-800' : 'bg-emerald-100 border border-emerald-300 text-emerald-800'
                    }`}>
                      {sos.status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1">
                    <p className="flex items-center space-x-1 text-slate-600">
                      <MapPin className="h-3.5 w-3.5 text-red-500 flex-shrink-0" />
                      <span className="truncate">{sos.pickupLocation?.address}</span>
                    </p>
                    <p className="text-[11px] font-bold text-emerald-800">
                      Emergency Type: {sos.emergencyType} • Phone: {sos.phone}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Dispatch Action Control & Fleet Status (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Dispatch Control Form */}
          {selectedSos && (
            <form onSubmit={handleDispatch} className="bg-white border border-emerald-200 rounded-3xl p-5 space-y-4 shadow-sm">
              <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
                <h3 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                  Dispatch Control Desk [{selectedSos.id}]
                </h3>
                <span className="bg-red-100 text-red-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                  {selectedSos.status}
                </span>
              </div>

              {/* Patient Details Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 flex items-center space-x-1">
                    <User className="h-3.5 w-3.5 text-emerald-700" />
                    <span>Patient: {selectedSos.patientName}</span>
                  </span>
                  <span className="text-slate-500 font-semibold">{selectedSos.phone}</span>
                </div>
                <p className="text-slate-600 font-medium">
                  <strong>Pickup Location:</strong> {selectedSos.pickupLocation?.address}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="text-xs text-slate-700 font-bold block mb-1">Select Available Ambulance Unit</label>
                  <select
                    value={selectedAmbulanceCode}
                    onChange={(e) => setSelectedAmbulanceCode(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600 cursor-pointer"
                  >
                    {ambulances.map((amb) => (
                      <option key={amb.id} value={amb.code}>
                        {amb.code} — {amb.unitName} ({amb.status})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex flex-col justify-center">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Hospital Allocation Protocol</span>
                  <p className="text-xs font-extrabold text-emerald-900 flex items-center space-x-1 mt-0.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Auto-Assigned by Bed Availability to Ambulance Crew</span>
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#064e3b] hover:bg-emerald-900 text-white rounded-2xl font-bold text-xs uppercase tracking-wider shadow-md flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <Ambulance className="h-4 w-4 text-emerald-200" />
                <span>DISPATCH AMBULANCE {selectedAmbulanceCode} TO {selectedSos.patientName}</span>
              </button>
            </form>
          )}

          {/* Ambulance Fleet Units Status Board */}
          <div className="bg-white border border-emerald-200 rounded-3xl p-4 space-y-3 shadow-sm">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 font-serif">
              Government Ambulance Units Overview
            </h3>

            <div className="space-y-2">
              {ambulances.map((amb) => (
                <div key={amb.id} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 bg-emerald-100 rounded-xl text-emerald-900 font-black">
                      <Ambulance className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{amb.code} — {amb.unitName}</h4>
                      <p className="text-[10px] text-slate-500 font-medium">Driver: {amb.driverName} • Paramedic: {amb.paramedicName}</p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase ${
                    amb.status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-blue-100 text-blue-900 border border-blue-300'
                  }`}>
                    {amb.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-xs text-emerald-950 flex items-center space-x-2">
            <ShieldCheck className="h-5 w-5 text-emerald-700 shrink-0" />
            <span>
              <strong>Operator Dispatch Active:</strong> Once dispatched, the designated ambulance receives auto-allocated hospital bed confirmation.
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};
