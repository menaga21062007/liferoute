import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SharedMap } from './SharedMap';
import {
  Ambulance,
  Building2,
  CheckCircle2,
  Play,
  Heart,
  Activity,
  Wind,
  Thermometer,
  Zap,
  Navigation
} from 'lucide-react';

export const AmbulanceView = () => {
  const { ambulances, hospitals, startTrip } = useApp();

  const activeAmbulance = ambulances.find((a) => a.code === 'AMB-101') || ambulances[0];
  const isEnRoute = activeAmbulance?.status === 'EN_ROUTE';

  const [patientName, setPatientName] = useState('Menaga');
  const [age, setAge] = useState('54');
  const [gender, setGender] = useState('Male');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [conditionCategory, setConditionCategory] = useState('Cardiac Arrest / STEMI');
  const [selectedHospitalId, setSelectedHospitalId] = useState('hosp-1');

  const emergencyCategories = [
    'Cardiac Arrest / STEMI',
    'Acute Ischemic Stroke',
    'Severe Polytrauma',
    'Respiratory Distress',
    'Third-Degree Burns',
    'Pediatric Emergency'
  ];

  const handleStartEmergencyTrip = (e) => {
    e.preventDefault();
    startTrip({
      ambulanceId: activeAmbulance.id,
      patientName,
      age: parseInt(age, 10),
      gender,
      bloodGroup,
      conditionCategory,
      hospitalId: selectedHospitalId
    });
  };

  const targetHospital = hospitals.find(h => h.id === activeAmbulance.destinationHospitalId) || hospitals[0];

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6 animate-fade-in text-slate-100 font-sans">
      
      {/* Active Trip Header Banner */}
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-5 rounded-3xl flex flex-wrap items-center justify-between gap-4 shadow-2xl">
        <div className="flex items-center space-x-3">
          <div className="p-3.5 rounded-2xl bg-red-500/20 text-red-400 border border-red-500/40">
            <Ambulance className="h-7 w-7 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-2xl font-black text-white tracking-tight">{activeAmbulance.code} ({activeAmbulance.unitName})</h2>
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                isEnRoute ? 'bg-red-500/25 text-red-300 border border-red-500/50 animate-pulse' : 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/40'
              }`}>
                {activeAmbulance.status}
              </span>
            </div>
            <p className="text-xs text-slate-300 font-semibold mt-0.5">Crew: Marcus Vance & Elena Rostova • Lead Paramedic</p>
          </div>
        </div>

        {isEnRoute && (
          <div className="flex items-center space-x-4 bg-slate-950/90 p-3 px-5 rounded-2xl border border-slate-800 shadow-xl">
            <div className="text-center">
              <div className="text-[10px] text-slate-400 font-extrabold uppercase">Arrival ETA</div>
              <div className="text-xl font-black text-emerald-400 font-mono">~{activeAmbulance.etaMinutes} Mins</div>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="text-center">
              <div className="text-[10px] text-slate-400 font-extrabold uppercase">Target Hospital</div>
              <div className="text-sm font-black text-white">{targetHospital.name}</div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Intake Form / Active Dispatch Info */}
        <div className="lg:col-span-5 space-y-6">
          
          {!isEnRoute ? (
            <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-6 rounded-3xl shadow-2xl space-y-5">
              <div className="flex items-center space-x-2.5 border-b border-slate-800 pb-3">
                <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/40">
                  <Zap className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-black text-white tracking-tight">Patient Registration & Dispatch Intake</h3>
              </div>

              <form onSubmit={handleStartEmergencyTrip} className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-slate-200 uppercase mb-1">Patient Full Name</label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-brand-blue"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs font-black text-slate-200 uppercase mb-1">Age</label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm font-bold text-white focus:outline-none focus:border-brand-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-200 uppercase mb-1">Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm font-bold text-white focus:outline-none focus:border-brand-blue"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-200 uppercase mb-1">Blood</label>
                    <select
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm font-bold text-white focus:outline-none focus:border-brand-blue"
                    >
                      {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-200 uppercase mb-1">Emergency Category</label>
                  <select
                    value={conditionCategory}
                    onChange={(e) => setConditionCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-brand-blue"
                  >
                    {emergencyCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-200 uppercase mb-1">Hospital Destination Match</label>
                  <select
                    value={selectedHospitalId}
                    onChange={(e) => setSelectedHospitalId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-brand-blue"
                  >
                    {hospitals.map(h => (
                      <option key={h.id} value={h.id}>
                        🏥 {h.name} (Beds: {h.availableBeds}/{h.totalBeds})
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-600 to-brand-red hover:from-red-500 hover:to-red-600 text-white font-black text-sm py-3.5 rounded-2xl shadow-xl shadow-red-600/30 flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5 active:scale-95"
                >
                  <Play className="h-4 w-4 fill-white" />
                  <span>START EMERGENCY TRIP & GREEN CORRIDOR</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-5">
              
              {/* Active Dispatch Details Card */}
              <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-6 rounded-3xl shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="text-xs font-extrabold text-slate-300 uppercase">Active Patient Dispatch</div>
                  <span className="bg-red-500/25 text-red-300 border border-red-500/50 text-[10px] font-black px-2.5 py-1 rounded-full uppercase">EN ROUTE</span>
                </div>

                <div>
                  <h3 className="text-2xl font-black text-white">{activeAmbulance.patient ? activeAmbulance.patient.name : 'Menaga'}</h3>
                  <p className="text-xs text-slate-200 font-bold mt-0.5">{activeAmbulance.patient?.age || 54} Yrs • {activeAmbulance.patient?.gender || 'Male'} • Blood: <strong className="text-red-400 font-black">{activeAmbulance.patient?.bloodGroup || 'O+'}</strong></p>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                  <div className="text-[10px] text-slate-400 font-black uppercase">Chief Emergency Complaint</div>
                  <div className="text-sm font-black text-red-400 mt-0.5">{activeAmbulance.patient?.conditionCategory || 'Cardiac Arrest / STEMI'}</div>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                  <div className="text-[10px] text-slate-400 font-black uppercase">Target Hospital Destination</div>
                  <div className="text-sm font-black text-white mt-0.5">🏥 {targetHospital.name}</div>
                </div>
              </div>

              {/* Live Telemetry Card */}
              <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-6 rounded-3xl shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center space-x-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="font-extrabold text-white text-xs">LIVE TELEMETRY STREAM</span>
                  </div>
                  <span className="bg-red-500/25 text-red-300 border border-red-500/50 text-[10px] font-black px-2 py-0.5 rounded-full">CRITICAL</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                    <div className="text-[10px] text-red-400 font-extrabold flex items-center justify-between">
                      <span>HEART RATE</span>
                      <Heart className="h-3.5 w-3.5 fill-red-500 text-red-500 animate-ping" />
                    </div>
                    <div className="text-2xl font-black text-white mt-1">117 <span className="text-xs text-slate-400">BPM</span></div>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                    <div className="text-[10px] text-blue-400 font-extrabold flex items-center justify-between">
                      <span>BP PRESS.</span>
                      <Activity className="h-3.5 w-3.5" />
                    </div>
                    <div className="text-2xl font-black text-white mt-1">148/94</div>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                    <div className="text-[10px] text-emerald-400 font-extrabold flex items-center justify-between">
                      <span>SPO2 SAT.</span>
                      <Wind className="h-3.5 w-3.5" />
                    </div>
                    <div className="text-2xl font-black text-white mt-1">94%</div>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                    <div className="text-[10px] text-amber-400 font-extrabold flex items-center justify-between">
                      <span>TEMP</span>
                      <Thermometer className="h-3.5 w-3.5" />
                    </div>
                    <div className="text-2xl font-black text-white mt-1">37.2°C</div>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Right Column: Universal Shared Map */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-4 rounded-3xl shadow-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-white font-extrabold text-sm">
                <Navigation className="h-4 w-4 text-emerald-400 animate-pulse" />
                <span>Live Shared Ambulance GPS Simulation Map</span>
              </div>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                SIMULATED GPS ACTIVE
              </span>
            </div>

            <SharedMap height="h-[560px]" />
          </div>
        </div>

      </div>

    </div>
  );
};
