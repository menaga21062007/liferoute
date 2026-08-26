import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UniversalSharedMap } from './UniversalSharedMap';
import {
  Building2,
  Ambulance,
  CheckCircle2,
  UserCheck,
  Stethoscope,
  Bed,
  PlusCircle,
  Heart,
  Activity,
  Wind,
  Thermometer,
  RotateCcw,
  Globe,
  Share2,
  Layers,
  Sparkles,
  Zap,
  ArrowRight
} from 'lucide-react';

export const HospitalView = () => {
  const {
    hospitals,
    ambulances,
    selectedHospitalId,
    setSelectedHospitalId,
    updatePatientTreatmentStatus,
    updateBedStatus,
    marketplaceResources,
    requestResourceTransfer,
    startTrip
  } = useApp();

  const [activeTab, setActiveTab] = useState('triage'); // 'triage' | 'beds' | 'marketplace'

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

  const incomingForThisHospital = ambulances.filter(a =>
    (a.status === 'EN_ROUTE' || a.status === 'ARRIVED') &&
    (a.destinationHospitalId === currentHospital.id || a.destinationHospitalId === currentHospital.code || a.destinationHospitalId === selectedHospitalId)
  );

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
    <div className="max-w-7xl mx-auto p-4 space-y-5 animate-fade-in text-slate-100 font-sans">
      
      {/* Header Banner & Hospital Selector Dropdown */}
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-5 rounded-3xl flex flex-wrap items-center justify-between gap-4 shadow-2xl">
        <div className="flex items-center space-x-3.5">
          <div className="p-3.5 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/40">
            <Building2 className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
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
                UNIFIED HOSPITAL HUB
              </span>
            </div>
            <p className="text-xs text-slate-300 font-semibold mt-1">{currentHospital.address} • Trauma Level 1 Emergency Hub</p>
          </div>
        </div>

        {/* Tab Navigation Switches */}
        <div className="flex items-center bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('triage')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-1.5 ${
              activeTab === 'triage'
                ? 'bg-brand-blue text-white shadow ring-1 ring-blue-400/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Ambulance className="h-3.5 w-3.5" />
            <span>ER Triage & Telemetry</span>
          </button>

          <button
            onClick={() => setActiveTab('beds')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-1.5 ${
              activeTab === 'beds'
                ? 'bg-brand-blue text-white shadow ring-1 ring-blue-400/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bed className="h-3.5 w-3.5" />
            <span>Beds & OTs ({currentHospital.availableBeds} Free)</span>
          </button>

          <button
            onClick={() => setActiveTab('marketplace')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-1.5 ${
              activeTab === 'marketplace'
                ? 'bg-purple-600 text-white shadow ring-1 ring-purple-400/40'
                : 'text-purple-300 hover:text-white'
            }`}
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>Resource Marketplace</span>
          </button>
        </div>

        {/* Quick Dispatch Button */}
        <button
          onClick={handleSimulateIncoming}
          className="bg-gradient-to-r from-red-600 to-brand-red hover:from-red-500 hover:to-red-600 text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-red-600/30 flex items-center space-x-2 transition-all"
        >
          <PlusCircle className="h-4 w-4" />
          <span>DISPATCH TO {currentHospital.code}</span>
        </button>
      </div>

      {/* TAB 1: ER TRIAGE & TELEMETRY */}
      {activeTab === 'triage' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
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

                      {/* LIVE PATIENT VITALS TELEMETRY MONITOR */}
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

          <div className="lg:col-span-6 space-y-4">
            <UniversalSharedMap height="h-[580px]" />
          </div>
        </div>
      )}

      {/* TAB 2: BED & OT CAPACITY MANAGEMENT */}
      {activeTab === 'beds' && (
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-6 rounded-3xl shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-xl font-extrabold text-white">ICU Bed & Operating Theater (OT) Capacity</h3>
              <p className="text-xs text-slate-400">Live bed status management for {currentHospital.name}</p>
            </div>
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-full text-xs font-bold">
                {currentHospital.availableBeds} Beds Available
              </span>
              <span className="px-3 py-1 bg-blue-950 text-blue-400 border border-blue-800 rounded-full text-xs font-bold">
                {currentHospital.availableOTs} OTs Ready
              </span>
            </div>
          </div>

          {/* Beds Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {(currentHospital.beds || []).map((bed) => (
              <div key={bed.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-white">{bed.bedNumber}</span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                    bed.status === 'AVAILABLE' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                    bed.status === 'RESERVED' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                    'bg-rose-950 text-rose-400 border border-rose-800'
                  }`}>
                    {bed.status}
                  </span>
                </div>

                <div className="text-xs text-slate-400">
                  <div>Type: <strong className="text-slate-200">{bed.category || bed.type}</strong></div>
                  <div>Patient: <strong className="text-white">{bed.patientName || 'None'}</strong></div>
                </div>

                <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-slate-800 text-[10px]">
                  <button
                    onClick={() => updateBedStatus(currentHospital.id, bed.id, 'AVAILABLE')}
                    className="p-1 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded font-semibold"
                  >
                    Set Available
                  </button>
                  <button
                    onClick={() => updateBedStatus(currentHospital.id, bed.id, 'RESERVED')}
                    className="p-1 bg-amber-950 hover:bg-amber-900 text-amber-300 rounded font-semibold"
                  >
                    Set Reserved
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: HOSPITAL RESOURCE MARKETPLACE */}
      {activeTab === 'marketplace' && (
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-6 rounded-3xl shadow-2xl space-y-6">
          <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-4 gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <Share2 className="h-5 w-5 text-purple-400" />
                <h3 className="text-xl font-extrabold text-white">Hospital Network Resource Marketplace</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Inter-hospital resource exchange platform for ventilator, bed, ECMO, and specialist surge sharing.
              </p>
            </div>

            <span className="bg-purple-950 text-purple-300 border border-purple-700 text-xs font-bold px-3 py-1 rounded-full uppercase">
              4 Network Hospitals Connected
            </span>
          </div>

          {/* Marketplace Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {marketplaceResources.map((resItem) => (
              <div key={resItem.id} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">{resItem.category}</span>
                    <h4 className="text-lg font-bold text-white mt-0.5">{resItem.resourceType}</h4>
                  </div>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                    resItem.status === 'AVAILABLE' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                  }`}>
                    {resItem.status}
                  </span>
                </div>

                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1 text-xs">
                  <div className="text-slate-400">Host Hospital: <strong className="text-white">{resItem.hospitalName}</strong></div>
                  <div className="text-slate-400">Units Available: <strong className="text-emerald-400 font-extrabold">{resItem.availableUnits} units</strong></div>
                  <div className="text-slate-400">Contact: <span className="font-mono text-slate-300">{resItem.contactPhone}</span></div>
                </div>

                <button
                  disabled={resItem.availableUnits <= 0}
                  onClick={() => requestResourceTransfer(resItem.id, currentHospital.name, 1)}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all ${
                    resItem.availableUnits > 0
                      ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <ArrowRight className="h-4 w-4" />
                  <span>Request Transfer to {currentHospital.code}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

