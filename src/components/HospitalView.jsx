import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UniversalSharedMap } from './UniversalSharedMap';
import {
  Building2,
  Ambulance,
  CheckCircle2,
  Clock,
  UserCheck,
  Stethoscope,
  Radio,
  Bed,
  PlusCircle,
  AlertTriangle,
  Heart,
  Activity,
  Wind,
  Thermometer,
  RotateCcw
} from 'lucide-react';

export const HospitalView = () => {
  const {
    hospitals,
    ambulances,
    selectedHospitalId,
    setSelectedHospitalId,
    updatePatientTreatmentStatus,
    startTrip
  } = useApp();

  const currentHospital = hospitals.find(h => h.id === selectedHospitalId || h.code === selectedHospitalId) || hospitals[0] || {
    id: "hosp-1",
    name: "Velammal Global Hospital",
    code: "VGH",
    address: "500 Healthcare Blvd, Metro City",
    availableBeds: 18,
    totalBeds: 120,
    availableOTs: 4,
    totalOTs: 12
  };

  // Filter incoming ambulances and patients STRICTLY for this selected hospital alone!
  const incomingForThisHospital = ambulances.filter(a =>
    (a.status === 'EN_ROUTE' || a.status === 'ARRIVED') &&
    (a.destinationHospitalId === currentHospital.id || a.destinationHospitalId === currentHospital.code || a.destinationHospitalId === selectedHospitalId)
  );

  // Standby demonstration patient specific to this hospital if no active dispatch
  const standbyPatient = {
    id: `amb-standby-${currentHospital.code}`,
    code: `AMB-101`,
    patient: {
      id: `pat-demo-${currentHospital.code}`,
      name: `Emergency Patient (${currentHospital.code})`,
      age: 54,
      gender: 'Male',
      bloodGroup: 'O+',
      conditionCategory: 'Cardiac Emergency',
      treatmentStatus: 'En route',
      vitals: { hr: 117, bp: '148/94', spo2: '94%', temp: '37.2°C', ecgStatus: 'Live Telemetry Active' }
    },
    etaMinutes: 4,
    status: 'EN_ROUTE'
  };

  const displayList = incomingForThisHospital.length > 0 ? incomingForThisHospital : [standbyPatient];

  const handleSimulateIncoming = () => {
    startTrip({
      ambulanceId: 'amb-101',
      patientName: 'Menaga',
      age: 54,
      gender: 'Male',
      bloodGroup: 'O+',
      conditionCategory: 'Cardiac Emergency',
      hospitalId: currentHospital.id
    });
  };

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
            <p className="text-xs text-slate-300 font-semibold mt-1">{currentHospital.address} • Trauma Level 1 Emergency Hub</p>
          </div>
        </div>

        {/* Live ER Metrics & Quick Demo Button */}
        <div className="flex items-center space-x-4">
          <button
            onClick={handleSimulateIncoming}
            className="bg-gradient-to-r from-red-600 to-brand-red hover:from-red-500 hover:to-red-600 text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-red-600/30 flex items-center space-x-2 transition-all"
          >
            <PlusCircle className="h-4 w-4" />
            <span>DISPATCH TO {currentHospital.code}</span>
          </button>

          <div className="flex items-center space-x-4 bg-slate-950/90 p-2.5 px-4 rounded-2xl border border-slate-800 shadow-xl">
            <div className="text-center">
              <div className="text-[10px] text-slate-400 font-extrabold uppercase">Available Beds</div>
              <div className="text-xl font-black text-emerald-400">{currentHospital.availableBeds} / {currentHospital.totalBeds}</div>
            </div>
            <div className="h-7 w-px bg-slate-800" />
            <div className="text-center">
              <div className="text-[10px] text-slate-400 font-extrabold uppercase">Available OTs</div>
              <div className="text-2xl font-black text-blue-400">{currentHospital.availableOTs} / {currentHospital.totalOTs}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Triage Queue & Patient Vitals Telemetry for THIS Hospital Alone */}
        <div className="lg:col-span-6 space-y-5">
          
          <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-6 rounded-3xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Ambulance className="h-5 w-5 text-red-400 animate-bounce" />
                <h3 className="text-lg font-black text-white tracking-tight">{currentHospital.name} ER Triage Queue</h3>
              </div>
              <span className="bg-red-500/25 text-red-300 border border-red-500/50 text-[10px] font-black px-2.5 py-1 rounded-full uppercase">
                {currentHospital.code} EXCLUSIVE
              </span>
            </div>

            <div className="space-y-4 max-h-[520px] overflow-y-auto pr-1">
              {displayList.map((amb) => {
                const patient = amb.patient || standbyPatient.patient;
                const status = patient.treatmentStatus || 'En route';
                const vitals = patient.vitals || { hr: 117, bp: '148/94', spo2: '94%', temp: '37.2°C' };

                return (
                  <div key={amb.id} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-black text-red-400">🚑 {amb.code || 'AMB-101'}</span>
                          <span className="bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                            {status}
                          </span>
                        </div>
                        <h4 className="text-xl font-black text-white mt-1">{patient.name}</h4>
                        <p className="text-xs text-slate-200 font-bold mt-0.5">{patient.age} Yrs • {patient.gender} • Blood: <strong className="text-red-400 font-black">{patient.bloodGroup}</strong></p>
                      </div>

                      <div className="text-right">
                        <div className="text-[10px] text-slate-400 font-black uppercase">ETA Countdown</div>
                        <div className="text-xl font-black text-emerald-400 font-mono">~{amb.etaMinutes || 3} mins</div>
                      </div>
                    </div>

                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <div className="text-[10px] text-slate-400 font-black uppercase">Emergency Category</div>
                        <div className="text-sm font-black text-red-400 mt-0.5">{patient.conditionCategory}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-slate-400 font-black uppercase">Target Hospital</div>
                        <div className="text-xs font-black text-white">{currentHospital.code}</div>
                      </div>
                    </div>

                    {/* LIVE PATIENT VITALS TELEMETRY MONITOR FOR THIS HOSPITAL */}
                    <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <div className="flex items-center space-x-2">
                          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                          <span className="font-extrabold text-white text-xs">PATIENT TELEMETRY VITALS</span>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-400 font-bold">STREAM LIVE</span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                          <div className="text-[9px] text-red-400 font-black flex items-center justify-center space-x-1">
                            <Heart className="h-3 w-3 fill-red-500 text-red-500 animate-ping" />
                            <span>HR</span>
                          </div>
                          <div className="text-lg font-black text-white mt-0.5">{vitals.hr || 117} <span className="text-[9px] text-slate-400">BPM</span></div>
                        </div>

                        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                          <div className="text-[9px] text-blue-400 font-black flex items-center justify-center space-x-1">
                            <Activity className="h-3 w-3" />
                            <span>BP</span>
                          </div>
                          <div className="text-lg font-black text-white mt-0.5">{vitals.bp || '148/94'}</div>
                        </div>

                        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                          <div className="text-[9px] text-emerald-400 font-black flex items-center justify-center space-x-1">
                            <Wind className="h-3 w-3" />
                            <span>SPO2</span>
                          </div>
                          <div className="text-lg font-black text-white mt-0.5">{vitals.spo2 || '94%'}</div>
                        </div>

                        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                          <div className="text-[9px] text-amber-400 font-black flex items-center justify-center space-x-1">
                            <Thermometer className="h-3 w-3" />
                            <span>TEMP</span>
                          </div>
                          <div className="text-lg font-black text-white mt-0.5">{vitals.temp || '37.2°C'}</div>
                        </div>
                      </div>
                    </div>

                    {/* Interactive Patient Lifecycle Buttons */}
                    <div className="pt-2 border-t border-slate-800 space-y-2">
                      <div className="text-xs font-black text-slate-300 uppercase">Hospital Preparation Lifecycle</div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => updatePatientTreatmentStatus(patient.id || amb.id, 'HOSPITAL_PREPARED')}
                          className="bg-blue-950/90 hover:bg-blue-900 text-blue-200 border border-blue-700 font-black text-xs p-3 rounded-xl flex items-center justify-center space-x-1.5 transition-all shadow-lg active:scale-95"
                        >
                          <CheckCircle2 className="h-4 w-4 text-blue-400" />
                          <span>1. Team Prepared</span>
                        </button>

                        <button
                          onClick={() => updatePatientTreatmentStatus(patient.id || amb.id, 'ARRIVED')}
                          className="bg-emerald-950/90 hover:bg-emerald-900 text-emerald-200 border border-emerald-700 font-black text-xs p-3 rounded-xl flex items-center justify-center space-x-1.5 transition-all shadow-lg active:scale-95"
                        >
                          <UserCheck className="h-4 w-4 text-emerald-400" />
                          <span>2. Patient Arrived</span>
                        </button>

                        <button
                          onClick={() => updatePatientTreatmentStatus(patient.id || amb.id, 'IN_OT')}
                          className="bg-purple-950/90 hover:bg-purple-900 text-purple-200 border border-purple-700 font-black text-xs p-3 rounded-xl flex items-center justify-center space-x-1.5 transition-all shadow-lg active:scale-95"
                        >
                          <Stethoscope className="h-4 w-4 text-purple-400" />
                          <span>3. Transferred to OT</span>
                        </button>

                        <button
                          onClick={() => updatePatientTreatmentStatus(patient.id || amb.id, 'DISCHARGED')}
                          className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-black text-xs p-3 rounded-xl flex items-center justify-center space-x-1.5 transition-all shadow-lg active:scale-95"
                        >
                          <RotateCcw className="h-4 w-4 text-slate-400" />
                          <span>4. Discharged</span>
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>

        </div>

        {/* Right Column: Universal Shared Map */}
        <div className="lg:col-span-6 space-y-4">
          <UniversalSharedMap height="h-[580px]" />
        </div>

      </div>

    </div>
  );
};
