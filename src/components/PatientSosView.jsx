import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AlertCircle, CheckCircle2, Phone, MapPin, Send } from 'lucide-react';

export const PatientSosView = () => {
  const { createSosEmergency, sosEmergencies } = useApp();
  
  const [patientName, setPatientName] = useState('Citizen Patient');
  const [phone, setPhone] = useState('123-456-7890');
  const [emergencyType, setEmergencyType] = useState('Accident Trauma');
  const [address, setAddress] = useState('123 Wellness Blvd, Health City');
  const [submittedSos, setSubmittedSos] = useState(null);

  const handleTriggerSos = (e) => {
    if (e) e.preventDefault();
    const sos = createSosEmergency({
      patientName: patientName || 'Citizen Patient',
      phone: phone || '123-456-7890',
      age: 42,
      emergencyType,
      pickupLocation: {
        lat: 40.715000,
        lng: -73.955000,
        address: address || '123 Wellness Blvd, Health City'
      }
    });
    setSubmittedSos(sos);
  };

  const activeUserSos = submittedSos
    ? sosEmergencies.find((s) => s.id === submittedSos.id) || submittedSos
    : null;

  return (
    <div className="max-w-xl mx-auto px-4 py-6 space-y-6 text-slate-800">
      
      {/* Header Banner */}
      <div className="bg-[#064e3b] text-white p-6 rounded-3xl shadow-md border border-emerald-700 text-center space-y-2">
        <div className="h-12 w-12 rounded-2xl bg-red-600 border border-red-400 flex items-center justify-center mx-auto shadow-md">
          <AlertCircle className="h-7 w-7 text-white animate-bounce" />
        </div>
        <h1 className="text-2xl font-bold font-serif text-white">CITIZEN EMERGENCY SOS PORTAL</h1>
        <p className="text-xs text-emerald-200 font-medium">WellCare Emergency Dispatch Network • Toll-Free 108</p>
      </div>

      {activeUserSos ? (
        <div className="bg-white border-2 border-emerald-600 rounded-3xl p-6 shadow-md space-y-4 text-center">
          <CheckCircle2 className="h-12 w-12 text-emerald-600 mx-auto animate-pulse" />
          <h2 className="text-xl font-bold font-serif text-slate-900">EMERGENCY SOS BROADCASTED!</h2>

          <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-left space-y-2 text-xs">
            <div className="flex justify-between border-b border-emerald-200 pb-1">
              <span className="font-bold text-slate-600">Reference ID:</span>
              <span className="font-extrabold text-red-600">{activeUserSos.id}</span>
            </div>
            <div className="flex justify-between border-b border-emerald-200 pb-1">
              <span className="font-bold text-slate-600">Dispatch Status:</span>
              <span className="font-extrabold text-emerald-800">{activeUserSos.status}</span>
            </div>
            <div className="flex justify-between border-b border-emerald-200 pb-1">
              <span className="font-bold text-slate-600">Patient Name:</span>
              <span className="font-bold text-slate-900">{activeUserSos.patientName}</span>
            </div>
            <div>
              <span className="font-bold text-slate-600 block mb-0.5">Pickup Location:</span>
              <span className="text-slate-900 font-medium">{activeUserSos.pickupLocation?.address}</span>
            </div>
          </div>

          <p className="text-xs text-slate-600">
            Call centre operator has received your request. Stay calm and an ambulance unit is being assigned.
          </p>

          <button
            onClick={() => setSubmittedSos(null)}
            className="w-full py-2.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-xs rounded-xl"
          >
            Trigger Another SOS Request
          </button>
        </div>
      ) : (
        <div className="bg-white border border-emerald-200 rounded-3xl p-6 shadow-md space-y-5 text-center">
          
          <div>
            <h2 className="text-xl font-bold font-serif text-slate-900 mb-1">
              1-Tap Emergency SOS Trigger
            </h2>
            <p className="text-xs text-slate-500">
              Press the big red button below to send your location immediately to the Call Centre Operator.
            </p>
          </div>

          {/* Optional Details Collapsible / Card */}
          <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-3 text-left space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-900 uppercase text-[10px] tracking-wider">Pickup Address & Details</span>
              <span className="text-[10px] text-emerald-700 font-medium">GPS Auto-Detected</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Pickup Address"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
              />
              <select
                value={emergencyType}
                onChange={(e) => setEmergencyType(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
              >
                <option value="Accident Trauma">Accident Trauma</option>
                <option value="Heart Issue">Heart Issue / Cardiac</option>
                <option value="Breathing Issue">Breathing Distress</option>
                <option value="Stroke Emergency">Stroke Emergency</option>
              </select>
            </div>
          </div>

          {/* GIANT 1-TAP SOS BUTTON */}
          <button
            onClick={handleTriggerSos}
            type="button"
            className="w-full py-6 bg-red-600 hover:bg-red-700 text-white rounded-3xl font-extrabold text-lg uppercase tracking-wider shadow-xl flex items-center justify-center space-x-3 transition-all transform hover:scale-[1.02] active:scale-95 cursor-pointer ring-4 ring-red-100"
          >
            <AlertCircle className="h-8 w-8 animate-bounce" />
            <span>SOS – TRIGGER EMERGENCY DISPATCH</span>
          </button>

          <p className="text-[11px] text-slate-400 font-medium">
            Emergency Toll-Free Direct Hotline: <strong className="text-emerald-800">108 / (123) 456-7890</strong>
          </p>

        </div>
      )}

    </div>
  );
};
