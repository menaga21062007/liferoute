import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AlertCircle, CheckCircle2, MapPin } from 'lucide-react';

export const PatientSosView = () => {
  const { createSosEmergency, sosEmergencies } = useApp();
  
  const [patientName, setPatientName] = useState('Citizen Patient');
  const [phone, setPhone] = useState('123-456-7890');
  const [address, setAddress] = useState('123 Wellness Blvd, Health City');
  const [submittedSos, setSubmittedSos] = useState(null);

  const handleTriggerSos = (e) => {
    if (e) e.preventDefault();
    const sos = createSosEmergency({
      patientName: patientName || 'Citizen Patient',
      phone: phone || '123-456-7890',
      age: 42,
      emergencyType: 'Emergency SOS Call',
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
          <CheckCircle2 className="h-14 w-14 text-emerald-600 mx-auto animate-pulse" />
          <h2 className="text-2xl font-bold font-serif text-slate-900">EMERGENCY SOS BROADCASTED!</h2>

          <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-left space-y-2 text-xs">
            <div className="flex justify-between border-b border-emerald-200 pb-1">
              <span className="font-bold text-slate-600">Reference ID:</span>
              <span className="font-extrabold text-red-600 text-sm">{activeUserSos.id}</span>
            </div>
            <div className="flex justify-between border-b border-emerald-200 pb-1">
              <span className="font-bold text-slate-600">Dispatch Status:</span>
              <span className="font-extrabold text-emerald-800 text-sm">{activeUserSos.status}</span>
            </div>
            <div className="flex justify-between border-b border-emerald-200 pb-1">
              <span className="font-bold text-slate-600">Patient:</span>
              <span className="font-bold text-slate-900">{activeUserSos.patientName}</span>
            </div>
            <div>
              <span className="font-bold text-slate-600 block mb-0.5">Pickup Address:</span>
              <span className="text-slate-900 font-medium">{activeUserSos.pickupLocation?.address}</span>
            </div>
          </div>

          <p className="text-xs text-slate-600 font-medium">
            Call centre operator has received your location address and an available ambulance is being dispatched immediately.
          </p>

          <button
            onClick={() => setSubmittedSos(null)}
            className="w-full py-3 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-xs rounded-xl transition-all"
          >
            Trigger Another SOS Request
          </button>
        </div>
      ) : (
        <div className="bg-white border border-emerald-200 rounded-3xl p-6 shadow-md space-y-6 text-center">
          
          <div>
            <h2 className="text-xl font-bold font-serif text-slate-900 mb-1">
              1-Tap Immediate SOS Trigger
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Press the big red button below to broadcast your GPS location to the Call Centre Operator desk.
            </p>
          </div>

          {/* Pickup Address Card */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 text-left space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-900 uppercase text-[10px] tracking-wider">Pickup Location Address</span>
              <span className="text-[10px] text-emerald-700 font-bold flex items-center space-x-1">
                <MapPin className="h-3 w-3 text-red-500" />
                <span>GPS Auto-Detected</span>
              </span>
            </div>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter pickup address"
              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-600"
            />
          </div>

          {/* HUGE BIGGER SOS BUTTON */}
          <button
            onClick={handleTriggerSos}
            type="button"
            className="w-full py-8 bg-red-600 hover:bg-red-700 text-white rounded-3xl font-black text-xl sm:text-2xl uppercase tracking-wider shadow-2xl flex items-center justify-center space-x-3 transition-all transform hover:scale-[1.03] active:scale-95 cursor-pointer ring-8 ring-red-100"
          >
            <AlertCircle className="h-10 w-10 animate-bounce" />
            <span>SOS – TRIGGER EMERGENCY</span>
          </button>

          <p className="text-xs text-slate-500 font-medium pt-2">
            Emergency Toll-Free Direct Hotline: <strong className="text-emerald-900 font-black">108 / (123) 456-7890</strong>
          </p>

        </div>
      )}

    </div>
  );
};
