import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UniversalSharedMap } from './UniversalSharedMap';
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
  Navigation,
  RotateCcw,
  Sparkles,
  Eye,
  TrafficCone,
  Compass,
  ArrowUpRight
} from 'lucide-react';

export const AmbulanceView = () => {
  const { ambulances, hospitals, startTrip, updatePatientTreatmentStatus, isARHUDActive, setIsARHUDActive, t } = useApp();

  const [selectedAmbulanceCode, setSelectedAmbulanceCode] = useState('AMB-101');
  const activeAmbulance = ambulances.find((a) => a.code === selectedAmbulanceCode || a.id === selectedAmbulanceCode) || ambulances[0];
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
  const vitals = activeAmbulance?.patient?.vitals || { hr: 117, bp: '148/94', spo2: '94%', temp: '37.2°C' };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6 animate-fade-in text-slate-100 font-sans">
      
      {/* Header Banner & Ambulance Unit Selector */}
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-5 rounded-3xl flex flex-wrap items-center justify-between gap-4 shadow-2xl">
        <div className="flex items-center space-x-3.5">
          <div className="p-3.5 rounded-2xl bg-red-500/20 text-red-400 border border-red-500/40">
            <Ambulance className="h-7 w-7 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center space-x-3">
              <select
                value={selectedAmbulanceCode}
                onChange={(e) => setSelectedAmbulanceCode(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-1.5 text-lg font-black text-white focus:outline-none focus:border-brand-blue"
              >
                {ambulances.map(a => (
                  <option key={a.id} value={a.code}>🚑 {a.code} ({a.unitName})</option>
                ))}
              </select>

              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                isEnRoute ? 'bg-red-500/25 text-red-300 border border-red-500/50 animate-pulse' : 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/40'
              }`}>
                {activeAmbulance.status}
              </span>
            </div>
            <p className="text-xs text-slate-300 font-semibold mt-1">
              Driver: {activeAmbulance.driverName || 'Marcus Vance'} • Paramedic: {activeAmbulance.paramedicName || 'Elena Rostova'}
            </p>
          </div>
        </div>

        {/* AR Navigation HUD Toggle Button */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsARHUDActive(!isARHUDActive)}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl border text-xs font-extrabold shadow-lg transition-all ${
              isARHUDActive
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 border-cyan-400 text-white shadow-cyan-500/30 ring-2 ring-cyan-400/40 animate-pulse'
                : 'bg-slate-950 border-slate-700 text-cyan-400 hover:bg-slate-800'
            }`}
          >
            <Eye className="h-4 w-4" />
            <span>{isARHUDActive ? 'AR HUD OVERLAY ACTIVE' : 'ENABLE AR HUD NAV'}</span>
          </button>

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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Intake Form & Active Dispatch Info */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-6 rounded-3xl shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/40">
                  <Zap className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-black text-white tracking-tight">Patient Registration & Dispatch Intake</h3>
              </div>
              {isEnRoute && (
                <button
                  onClick={() => updatePatientTreatmentStatus(activeAmbulance.id, 'DISCHARGED')}
                  className="bg-slate-950 hover:bg-slate-800 border border-slate-700 text-amber-300 font-bold text-[10px] px-2.5 py-1 rounded-xl flex items-center space-x-1"
                  title="Clear Active Trip"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset Trip</span>
                </button>
              )}
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
                <span>DISPATCH {activeAmbulance.code} & GREEN CORRIDOR</span>
              </button>
            </form>
          </div>

          {/* Active Telemetry Card */}
          {isEnRoute && (
            <div className="space-y-5">
              <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-6 rounded-3xl shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="text-xs font-extrabold text-slate-300 uppercase">Active Patient Dispatch ({activeAmbulance.code})</div>
                  <span className="bg-red-500/25 text-red-300 border border-red-500/50 text-[10px] font-black px-2.5 py-1 rounded-full uppercase">EN ROUTE</span>
                </div>

                <div>
                  <h3 className="text-2xl font-black text-white">{activeAmbulance.patient ? activeAmbulance.patient.name : patientName}</h3>
                  <p className="text-xs text-slate-200 font-bold mt-0.5">{activeAmbulance.patient?.age || age} Yrs • {activeAmbulance.patient?.gender || gender} • Blood: <strong className="text-red-400 font-black">{activeAmbulance.patient?.bloodGroup || bloodGroup}</strong></p>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                  <div className="text-[10px] text-slate-400 font-black uppercase">Chief Emergency Complaint</div>
                  <div className="text-sm font-black text-red-400 mt-0.5">{activeAmbulance.patient?.conditionCategory || conditionCategory}</div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Universal Shared Map + AR HUD Overlay */}
        <div className="lg:col-span-7 space-y-4 relative">
          
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
            <UniversalSharedMap height="h-[640px]" selectedAmbulanceId={activeAmbulance.id} />

            {/* AR Navigation Overlay Visualizer (Heads-Up Display for Drivers) */}
            {isARHUDActive && (
              <div className="absolute inset-0 z-[500] pointer-events-none p-6 flex flex-col justify-between bg-gradient-to-b from-cyan-950/40 via-transparent to-slate-950/70 border-4 border-cyan-500/40 rounded-3xl animate-in fade-in duration-300">
                
                {/* HUD Top Bar */}
                <div className="flex items-center justify-between bg-slate-900/90 backdrop-blur border border-cyan-500/50 p-3.5 rounded-2xl shadow-2xl">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-xl bg-cyan-500/20 flex items-center justify-center border border-cyan-400/60">
                      <Compass className="h-5 w-5 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-widest block">AR HUD DRIVER HUD ACTIVE</span>
                      <span className="text-sm font-extrabold text-white flex items-center space-x-1.5">
                        <ArrowUpRight className="h-4 w-4 text-emerald-400" />
                        <span>TURN RIGHT ON GRAND AVE IN 300M</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="bg-emerald-950 text-emerald-300 border border-emerald-500/60 px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center space-x-1">
                      <TrafficCone className="h-3 w-3 text-emerald-400 animate-bounce" />
                      <span>TS-01 GREEN CORRIDOR ACTIVE</span>
                    </span>
                  </div>
                </div>

                {/* HUD Center Target Sight */}
                <div className="self-center flex flex-col items-center justify-center space-y-2 opacity-80">
                  <div className="h-24 w-24 rounded-full border-2 border-dashed border-cyan-400 flex items-center justify-center animate-spin" style={{ animationDuration: '15s' }}>
                    <div className="h-12 w-12 rounded-full border border-cyan-300 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                    </div>
                  </div>
                  <span className="text-[10px] font-extrabold text-cyan-300 bg-slate-900/90 px-2 py-0.5 rounded border border-cyan-500/40">
                    CLEAR PATH • RADAR SWEEP ACTIVE
                  </span>
                </div>

                {/* HUD Bottom Telemetry Bar */}
                <div className="flex items-center justify-between bg-slate-900/90 backdrop-blur border border-cyan-500/50 p-3.5 rounded-2xl shadow-2xl text-xs font-bold text-white">
                  <div className="flex items-center space-x-4">
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase block">TRANSIT SPEED</span>
                      <span className="text-lg font-black text-cyan-300">65 KM/H</span>
                    </div>
                    <div className="h-6 w-px bg-slate-700" />
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase block">TARGET DISTANCE</span>
                      <span className="text-lg font-black text-emerald-400">1.8 KM</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[9px] text-slate-400 uppercase block">HOSPITAL MATCH</span>
                    <span className="text-sm font-extrabold text-white">{targetHospital.code}</span>
                  </div>
                </div>

              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};

