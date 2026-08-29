import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Ambulance, Navigation, CheckCircle2, UserCheck, Activity, Phone, ShieldCheck } from 'lucide-react';

export const AmbulanceCrewDashboard = () => {
  const { ambulances, hospitals, updatePatientSceneDetails, updateAmbulanceStatus } = useApp();
  const [activeAmbulanceCode, setActiveAmbulanceCode] = useState('AMB-101');
  const [isLoggedIn, setIsLoggedIn] = useState(true);

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
    alert("Patient Scene Vitals & Details Saved!");
  };

  const handleMarkPatientOnBoard = () => {
    updateAmbulanceStatus(activeAmb.code, 'PATIENT_ON_BOARD');
  };

  const handleMarkArrivedAtHospital = () => {
    updateAmbulanceStatus(activeAmb.code, 'ARRIVED_AT_HOSPITAL');
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-white space-y-4">
          <div className="text-center pb-3 border-b border-slate-800">
            <Ambulance className="h-10 w-10 text-blue-500 mx-auto mb-2" />
            <h2 className="text-xl font-black">AMBULANCE CREW LOGIN</h2>
            <p className="text-xs text-slate-400">Government City Emergency Service</p>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 block mb-1">Select Unit ID</label>
            <select
              value={activeAmbulanceCode}
              onChange={(e) => setActiveAmbulanceCode(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-bold"
            >
              {ambulances.map((a) => (
                <option key={a.id} value={a.code}>{a.code} — {a.unitName}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setIsLoggedIn(true)}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 font-black text-sm uppercase rounded-lg shadow"
          >
            LOGIN TO UNIT
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-4 space-y-4 text-white">
      
      {/* Unit Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Ambulance className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black">{activeAmb.code}</h1>
            <p className="text-xs text-slate-400">{activeAmb.unitName}</p>
          </div>
        </div>

        <div className="text-right">
          <span className={`text-[10px] font-black px-2.5 py-1 rounded uppercase ${
            activeAmb.status === 'AVAILABLE' ? 'bg-slate-800 text-slate-300' : 'bg-emerald-950 border border-emerald-700 text-emerald-400'
          }`}>
            {activeAmb.status}
          </span>
          <p className="text-[10px] text-slate-400 mt-1">Crew: {activeAmb.driverName}</p>
        </div>
      </div>

      {/* Assigned Emergency Text Card (STRICTLY NO MAP DISPLAYED) */}
      {activeAmb.patient ? (
        <div className="bg-slate-900 border-2 border-blue-600 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-black text-blue-400 uppercase tracking-wider">ASSIGNED DISPATCH INSTRUCTION</span>
            <span className="text-xs font-bold text-amber-400">{activeAmb.status}</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Patient Name & Info</span>
              <p className="text-sm font-black text-white">{activeAmb.patient.name} ({activeAmb.patient.age} y/o {activeAmb.patient.gender})</p>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Pickup Location Address</span>
              <p className="text-xs font-bold text-red-400">{activeAmb.patient.pickupLocation?.address || 'District 1 Pickup Point'}</p>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Target Government Hospital</span>
              <p className="text-xs font-bold text-emerald-400">{targetHospital.name}</p>
            </div>
          </div>

          {/* Native Phone Map Launcher Button */}
          <button
            onClick={handleNativeNavigation}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white rounded-xl font-black text-sm uppercase tracking-wider shadow-lg flex items-center justify-center space-x-2"
          >
            <Navigation className="h-5 w-5" />
            <span>NAVIGATE TO PATIENT (OPEN PHONE MAPS)</span>
          </button>

          {/* Action Buttons: Mark On Board & Arrived */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
            <button
              onClick={handleMarkPatientOnBoard}
              className="py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg uppercase"
            >
              PATIENT ON BOARD
            </button>
            <button
              onClick={handleMarkArrivedAtHospital}
              className="py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg uppercase"
            >
              ARRIVED AT HOSPITAL
            </button>
          </div>

        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center space-y-2">
          <ShieldCheck className="h-10 w-10 text-emerald-500 mx-auto" />
          <h3 className="text-base font-bold">UNIT STANDBY</h3>
          <p className="text-xs text-slate-400">Waiting for Call Centre dispatch assignment...</p>
        </div>
      )}

      {/* Scene Patient Details Form */}
      {activeAmb.patient && (
        <form onSubmit={handleSaveSceneVitals} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
          <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-1">
            Paramedic Patient Intake at Scene
          </h3>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-slate-400 font-bold block mb-0.5">Patient Name</label>
              <input
                type="text"
                placeholder={activeAmb.patient.name}
                value={sceneName}
                onChange={(e) => setSceneName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold block mb-0.5">Age</label>
              <input
                type="number"
                placeholder={activeAmb.patient.age?.toString()}
                value={sceneAge}
                onChange={(e) => setSceneAge(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 font-bold block mb-0.5">Chief Complaint</label>
            <input
              type="text"
              value={chiefComplaint}
              onChange={(e) => setChiefComplaint(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white font-medium"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[10px] text-slate-400 font-bold block mb-0.5">BP</label>
              <input
                type="text"
                value={bp}
                onChange={(e) => setBp(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold block mb-0.5">SpO2</label>
              <input
                type="text"
                value={spo2}
                onChange={(e) => setSpo2(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold block mb-0.5">Pulse</label>
              <input
                type="text"
                value={pulse}
                onChange={(e) => setPulse(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-blue-300 border border-slate-700 rounded"
          >
            UPDATE PATIENT SCENE VITALS
          </button>
        </form>
      )}

    </div>
  );
};
