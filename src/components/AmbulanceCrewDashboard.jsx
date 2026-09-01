import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Ambulance, Navigation, ShieldCheck, HeartPulse, Building2, CheckCircle2, RefreshCw } from 'lucide-react';

export const AmbulanceCrewDashboard = () => {
  const { ambulances, hospitals, updatePatientSceneDetails, updateAmbulanceStatus, findBestAvailableHospital } = useApp();
  const [activeAmbulanceCode, setActiveAmbulanceCode] = useState('AMB-101');

  // Scene Vitals Form State
  const [sceneName, setSceneName] = useState('');
  const [sceneAge, setSceneAge] = useState('');
  const [sceneSex, setSceneSex] = useState('Male');
  const [chiefComplaint, setChiefComplaint] = useState('Chest pain, STEMI suspected');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [bp, setBp] = useState('120/80');
  const [spo2, setSpo2] = useState('98%');
  const [pulse, setPulse] = useState('78 bpm');

  const activeAmb = ambulances.find((a) => a.code === activeAmbulanceCode || a.id === activeAmbulanceCode) || ambulances[0];
  
  // Find target hospital matched automatically by bed availability
  const targetHospital = hospitals.find((h) => h.id === activeAmb?.targetHospitalId) || hospitals[0];

  const handleNativeNavigation = () => {
    if (!activeAmb?.patient?.pickupLocation) return;
    const { lat, lng } = activeAmb.patient.pickupLocation;
    const nativeMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(nativeMapsUrl, '_blank');
  };

  const handleSaveSceneVitals = (e) => {
    e.preventDefault();
    updatePatientSceneDetails(activeAmb.code, {
      name: sceneName,
      age: sceneAge,
      sex: sceneSex,
      chiefComplaint,
      bloodGroup,
      bp,
      spo2,
      pulse
    });
    alert(`Patient Scene Vitals & Details Saved for ${activeAmb.code}!`);
  };

  const handleMarkPatientOnBoard = () => {
    updateAmbulanceStatus(activeAmb.code, 'PATIENT_ON_BOARD');
  };

  const handleMarkArrivedAtHospital = () => {
    updateAmbulanceStatus(activeAmb.code, 'ARRIVED_AT_HOSPITAL');
  };

  const handleReMatchHospital = () => {
    const best = findBestAvailableHospital(activeAmb?.patient?.pickupLocation);
    if (best) {
      alert(`⚡ System matched best hospital with available beds: ${best.name} (${best.availableBeds} beds available)`);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-4 space-y-4 text-slate-800">
      
      {/* Active Ambulance Selector Bar */}
      <div className="bg-white border border-emerald-200 rounded-3xl p-3 shadow-sm flex items-center justify-between">
        <span className="text-xs font-bold text-[#064e3b] font-serif uppercase tracking-wider">Select Active Ambulance Unit:</span>
        <div className="flex space-x-1">
          {ambulances.map((a) => {
            const isSelected = activeAmb.code === a.code;
            return (
              <button
                key={a.id}
                onClick={() => setActiveAmbulanceCode(a.code)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#064e3b] text-white shadow ring-2 ring-emerald-400'
                    : 'bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                {a.code}
              </button>
            );
          })}
        </div>
      </div>

      {/* Unit Header Bar */}
      <div className="bg-[#064e3b] text-white rounded-3xl p-4 flex items-center justify-between shadow-md border border-emerald-700">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-600 rounded-xl">
            <Ambulance className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold font-serif text-white">{activeAmb.code}</h1>
            <p className="text-xs text-emerald-200 font-medium">{activeAmb.unitName}</p>
          </div>
        </div>

        <div className="text-right">
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
            activeAmb.status === 'AVAILABLE' ? 'bg-emerald-800 text-emerald-200' : 'bg-emerald-100 text-emerald-900 font-extrabold'
          }`}>
            {activeAmb.status}
          </span>
          <p className="text-[10px] text-emerald-200 mt-1 font-medium">Crew: {activeAmb.driverName}</p>
        </div>
      </div>

      {/* Assigned Emergency Text Card */}
      {activeAmb.patient ? (
        <div className="bg-white border-2 border-emerald-600 rounded-3xl p-4 shadow-md space-y-3">
          <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">ASSIGNED DISPATCH INSTRUCTION</span>
            <span className="text-xs font-bold text-amber-600">{activeAmb.status}</span>
          </div>

          <div className="bg-emerald-50/70 p-3 rounded-2xl border border-emerald-200 space-y-2.5 text-xs">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Patient Name & Info</span>
              <p className="text-sm font-bold text-slate-900 font-serif">{activeAmb.patient.name} ({activeAmb.patient.age} y/o {activeAmb.patient.gender})</p>
            </div>

            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Pickup Location Address</span>
              <p className="text-xs font-bold text-red-700">{activeAmb.patient.pickupLocation?.address || 'District 1 Pickup Point'}</p>
            </div>

            {/* AUTOMATED HOSPITAL ALLOCATION CARD BY BED AVAILABILITY */}
            <div className="bg-white p-3 rounded-xl border border-emerald-300 space-y-1.5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-emerald-900 uppercase tracking-wider flex items-center space-x-1">
                  <Building2 className="h-3.5 w-3.5 text-emerald-700" />
                  <span>Auto-Allocated Hospital (Bed Available)</span>
                </span>
                <span className="bg-emerald-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                  {targetHospital.availableBeds} Beds Free
                </span>
              </div>

              <p className="text-xs font-extrabold text-emerald-950 font-serif">{targetHospital.name}</p>
              <p className="text-[10px] text-slate-500 font-medium">{targetHospital.address}</p>

              <button
                type="button"
                onClick={handleReMatchHospital}
                className="w-full mt-1 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-[10px] font-bold rounded-lg border border-emerald-300 flex items-center justify-center space-x-1 cursor-pointer"
              >
                <RefreshCw className="h-3 w-3 text-emerald-700" />
                <span>Re-Analyze Bed Availability & Match Best Hospital</span>
              </button>
            </div>

          </div>

          {/* Action Buttons: Mark On Board & Arrived */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">

            <button
              onClick={handleMarkPatientOnBoard}
              className="py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl uppercase shadow-sm cursor-pointer"
            >
              PATIENT ON BOARD
            </button>
            <button
              onClick={handleMarkArrivedAtHospital}
              className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl uppercase shadow-sm cursor-pointer"
            >
              ARRIVED AT HOSPITAL
            </button>
          </div>

        </div>
      ) : (
        <div className="bg-white border border-emerald-200 rounded-3xl p-6 text-center space-y-2 shadow-sm">
          <ShieldCheck className="h-10 w-10 text-emerald-600 mx-auto" />
          <h3 className="text-base font-bold font-serif text-slate-900">UNIT {activeAmb.code} STANDBY</h3>
          <p className="text-xs text-slate-500 font-medium">Waiting for Call Centre dispatch assignment...</p>
        </div>
      )}

      {/* Scene Patient Details Form */}
      {activeAmb.patient && (
        <form onSubmit={handleSaveSceneVitals} className="bg-white border border-emerald-200 rounded-3xl p-4 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-1">
            Paramedic Patient Intake at Scene ({activeAmb.code})
          </h3>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-slate-500 font-bold block mb-0.5">Patient Name</label>
              <input
                type="text"
                placeholder={activeAmb.patient.name}
                value={sceneName}
                onChange={(e) => setSceneName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 font-bold block mb-0.5">Age</label>
              <input
                type="number"
                placeholder={activeAmb.patient.age?.toString()}
                value={sceneAge}
                onChange={(e) => setSceneAge(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] text-slate-500 font-bold block mb-0.5">Chief Complaint</label>
            <input
              type="text"
              value={chiefComplaint}
              onChange={(e) => setChiefComplaint(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[10px] text-slate-500 font-bold block mb-0.5">BP</label>
              <input
                type="text"
                value={bp}
                onChange={(e) => setBp(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-1 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 font-bold block mb-0.5">SpO2</label>
              <input
                type="text"
                value={spo2}
                onChange={(e) => setSpo2(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-1 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 font-bold block mb-0.5">Pulse</label>
              <input
                type="text"
                value={pulse}
                onChange={(e) => setPulse(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-1 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-xs font-bold text-emerald-800 border border-emerald-300 rounded-xl cursor-pointer"
          >
            UPDATE PATIENT SCENE VITALS
          </button>
        </form>
      )}

    </div>
  );
};
