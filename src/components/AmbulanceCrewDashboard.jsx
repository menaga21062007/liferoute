import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Ambulance, Navigation, ShieldCheck, HeartPulse, User, Phone } from 'lucide-react';

export const AmbulanceCrewDashboard = () => {
  const { ambulances, hospitals, updatePatientSceneDetails, updateAmbulanceStatus } = useApp();
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
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
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

      {/* Assigned Emergency Text Card (STRICTLY NO MAP DISPLAYED) */}
      {activeAmb.patient ? (
        <div className="bg-white border-2 border-emerald-600 rounded-3xl p-4 shadow-md space-y-3">
          <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">ASSIGNED DISPATCH INSTRUCTION</span>
            <span className="text-xs font-bold text-amber-600">{activeAmb.status}</span>
          </div>

          <div className="bg-emerald-50/70 p-3 rounded-2xl border border-emerald-200 space-y-2 text-xs">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Patient Name & Info</span>
              <p className="text-sm font-bold text-slate-900 font-serif">{activeAmb.patient.name} ({activeAmb.patient.age} y/o {activeAmb.patient.gender})</p>
            </div>

            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Pickup Location Address</span>
              <p className="text-xs font-bold text-red-700">{activeAmb.patient.pickupLocation?.address || 'District 1 Pickup Point'}</p>
            </div>

            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Target Government Hospital</span>
              <p className="text-xs font-bold text-emerald-800">{targetHospital.name}</p>
            </div>
          </div>

          {/* Native Phone Map Launcher Button */}
          <button
            onClick={handleNativeNavigation}
            className="w-full py-3.5 bg-[#064e3b] hover:bg-emerald-900 text-white rounded-2xl font-bold text-xs uppercase tracking-wider shadow-md flex items-center justify-center space-x-2 transition-all"
          >
            <Navigation className="h-4 w-4 text-emerald-300" />
            <span>NAVIGATE TO PATIENT (OPEN PHONE MAPS)</span>
          </button>

          {/* Action Buttons: Mark On Board & Arrived */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={handleMarkPatientOnBoard}
              className="py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl uppercase shadow-sm"
            >
              PATIENT ON BOARD
            </button>
            <button
              onClick={handleMarkArrivedAtHospital}
              className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl uppercase shadow-sm"
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
            className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-xs font-bold text-emerald-800 border border-emerald-300 rounded-xl"
          >
            UPDATE PATIENT SCENE VITALS
          </button>
        </form>
      )}

    </div>
  );
};
