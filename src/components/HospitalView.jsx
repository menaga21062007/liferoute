import React from 'react';
import { useApp } from '../context/AppContext';
import { SharedMap } from './SharedMap';
import {
  Building2,
  Ambulance,
  CheckCircle2,
  Clock,
  UserCheck,
  Stethoscope,
  Radio,
  Bed,
  ChevronDown
} from 'lucide-react';

export const HospitalView = () => {
  const { hospitals, ambulances, selectedHospitalId, setSelectedHospitalId, updatePatientTreatmentStatus } = useApp();

  const currentHospital = hospitals.find(h => h.id === selectedHospitalId || h.code === selectedHospitalId) || hospitals[0] || {
    id: "hosp-1",
    name: "Velammal Global Hospital",
    code: "VGH",
    address: "500 Healthcare Blvd, Metro City",
    availableBeds: 8,
    totalBeds: 50,
    availableOTs: 2,
    totalOTs: 6
  };

  const incomingAmbulances = ambulances.filter(a => a.status === 'EN_ROUTE' || a.status === 'Assigned');

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6 animate-fade-in text-slate-100 font-sans">
      
      {/* Header Banner & Hospital Selector Dropdown */}
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-5 rounded-3xl flex flex-wrap items-center justify-between gap-4 shadow-2xl">
        <div className="flex items-center space-x-3.5">
          <div className="p-3.5 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/40">
            <Building2 className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              {/* Hospital Selector Dropdown */}
              <select
                value={selectedHospitalId}
                onChange={(e) => setSelectedHospitalId(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-1.5 text-lg font-black text-white focus:outline-none focus:border-brand-blue"
              >
                {hospitals.map(h => (
                  <option key={h.id} value={h.id}>🏥 {h.name} ({h.code})</option>
                ))}
              </select>
              <span className="bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 text-xs font-black px-3 py-1 rounded-full uppercase">
                ER BAY OPERATIONAL
              </span>
            </div>
            <p className="text-xs text-slate-300 font-semibold mt-1">{currentHospital.address} • Trauma Level 1 Center</p>
          </div>
        </div>

        <div className="flex items-center space-x-4 bg-slate-950/90 p-3 px-5 rounded-2xl border border-slate-800 shadow-xl">
          <div className="text-center">
            <div className="text-[10px] text-slate-400 font-extrabold uppercase">Available ER Beds</div>
            <div className="text-2xl font-black text-emerald-400">{currentHospital.availableBeds} / {currentHospital.totalBeds}</div>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div className="text-center">
            <div className="text-[10px] text-slate-400 font-extrabold uppercase">Available OTs</div>
            <div className="text-2xl font-black text-blue-400">{currentHospital.availableOTs} / {currentHospital.totalOTs}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Incoming Queue & Patient Lifecycle Actions */}
        <div className="lg:col-span-6 space-y-5">
          
          <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-6 rounded-3xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Ambulance className="h-5 w-5 text-red-400 animate-bounce" />
                <h3 className="text-lg font-black text-white tracking-tight">Incoming Ambulance Triage Queue ({incomingAmbulances.length})</h3>
              </div>
              <span className="bg-red-500/25 text-red-300 border border-red-500/50 text-[10px] font-black px-2.5 py-1 rounded-full uppercase">
                EN ROUTE
              </span>
            </div>

            {incomingAmbulances.length > 0 ? (
              incomingAmbulances.map((amb) => (
                <div key={amb.id} className="bg-slate-950/90 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-black text-red-400">🚑 {amb.code}</span>
                      <h4 className="text-xl font-black text-white mt-0.5">{amb.patient ? amb.patient.name : 'Emergency Patient'}</h4>
                      {amb.patient && (
                        <p className="text-xs text-slate-200 font-bold">{amb.patient.age} Yrs • {amb.patient.gender} • Blood: {amb.patient.bloodGroup}</p>
                      )}
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 font-black uppercase">ETA Countdown</div>
                      <div className="text-xl font-black text-emerald-400 font-mono">~{amb.etaMinutes || 4} mins</div>
                    </div>
                  </div>

                  {amb.patient && (
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                      <div className="text-[10px] text-slate-400 font-black uppercase">Emergency Category</div>
                      <div className="text-sm font-black text-red-400 mt-0.5">{amb.patient.conditionCategory}</div>
                    </div>
                  )}

                  {/* Lifecycle Action Buttons */}
                  <div className="pt-2 border-t border-slate-800 space-y-2">
                    <div className="text-xs font-black text-slate-300 uppercase">Hospital Preparation Lifecycle</div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => updatePatientTreatmentStatus(amb.patient?.id || amb.id, 'HOSPITAL_PREPARED')}
                        className="bg-blue-950/80 hover:bg-blue-900 text-blue-200 border border-blue-700 font-black text-xs p-2.5 rounded-xl flex items-center justify-center space-x-1.5 transition-all"
                      >
                        <CheckCircle2 className="h-4 w-4 text-blue-400" />
                        <span>Team Prepared</span>
                      </button>

                      <button
                        onClick={() => updatePatientTreatmentStatus(amb.patient?.id || amb.id, 'ARRIVED')}
                        className="bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 border border-emerald-700 font-black text-xs p-2.5 rounded-xl flex items-center justify-center space-x-1.5 transition-all"
                      >
                        <UserCheck className="h-4 w-4 text-emerald-400" />
                        <span>Patient Arrived</span>
                      </button>

                      <button
                        onClick={() => updatePatientTreatmentStatus(amb.patient?.id || amb.id, 'IN_OT')}
                        className="bg-purple-950/80 hover:bg-purple-900 text-purple-200 border border-purple-700 font-black text-xs p-2.5 rounded-xl flex items-center justify-center space-x-1.5 transition-all"
                      >
                        <Stethoscope className="h-4 w-4 text-purple-400" />
                        <span>Transferred to OT</span>
                      </button>

                      <button
                        onClick={() => updatePatientTreatmentStatus(amb.patient?.id || amb.id, 'DISCHARGED')}
                        className="bg-slate-950 hover:bg-slate-900 text-slate-200 border border-slate-700 font-black text-xs p-2.5 rounded-xl flex items-center justify-center space-x-1.5 transition-all"
                      >
                        <CheckCircle2 className="h-4 w-4 text-slate-400" />
                        <span>Discharged</span>
                      </button>
                    </div>
                  </div>

                </div>
              ))
            ) : (
              <div className="text-center py-10 bg-slate-950/60 rounded-2xl border border-slate-800 text-slate-300 font-semibold">
                No active ambulances en route at this moment.
              </div>
            )}

          </div>

        </div>

        {/* Right Column: Universal Shared Map */}
        <div className="lg:col-span-6 space-y-4">
          <SharedMap height="h-[580px]" />
        </div>

      </div>

    </div>
  );
};
