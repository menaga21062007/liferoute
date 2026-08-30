import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AlertCircle, MapPin, CheckCircle2, Phone, HeartPulse, Send } from 'lucide-react';

export const PatientSosView = () => {
  const { createSosEmergency, sosEmergencies } = useApp();
  
  const [patientName, setPatientName] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('42');
  const [emergencyType, setEmergencyType] = useState('Accident');
  const [address, setAddress] = useState('123 Wellness Blvd, Health City');
  const [submittedSos, setSubmittedSos] = useState(null);

  const handleTriggerSos = (e) => {
    e.preventDefault();
    const sos = createSosEmergency({
      patientName: patientName || 'Citizen Patient',
      phone: phone || '123-456-7890',
      age: parseInt(age) || 40,
      emergencyType,
      pickupLocation: {
        lat: 40.715000,
        lng: -73.955000,
        address: address || 'Suburban Pickup Point'
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
              <span className="font-bold text-slate-600">Patient:</span>
              <span className="font-bold text-slate-900">{activeUserSos.patientName}</span>
            </div>
            <div>
              <span className="font-bold text-slate-600 block mb-0.5">Location:</span>
              <span className="text-slate-900 font-medium">{activeUserSos.pickupLocation?.address}</span>
            </div>
          </div>

          <p className="text-xs text-slate-600">
            Call centre operator has received your request. Stay calm and keep phone line open.
          </p>

          <button
            onClick={() => setSubmittedSos(null)}
            className="w-full py-2.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-xs rounded-xl"
          >
            Submit Another SOS Request
          </button>
        </div>
      ) : (
        <form onSubmit={handleTriggerSos} className="bg-white border border-emerald-200 rounded-3xl p-6 shadow-md space-y-4">
          <h2 className="text-base font-bold font-serif text-slate-900 border-b border-slate-100 pb-2">
            Trigger Immediate Ambulance Dispatch
          </h2>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Patient Name</label>
            <input
              type="text"
              placeholder="Enter patient full name"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-600"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number</label>
              <input
                type="text"
                placeholder="123-456-7890"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-600"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Patient Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Emergency Type</label>
            <select
              value={emergencyType}
              onChange={(e) => setEmergencyType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
            >
              <option value="Accident">Accident Trauma</option>
              <option value="Heart issue">Heart Issue / Cardiac</option>
              <option value="Breathing issue">Breathing Distress</option>
              <option value="Stroke">Stroke Emergency</option>
              <option value="Other">Other Medical Emergency</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Pickup Location Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-600"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold text-sm uppercase tracking-wider shadow-lg flex items-center justify-center space-x-2 transition-all transform hover:scale-[1.01]"
          >
            <AlertCircle className="h-5 w-5 animate-pulse" />
            <span>SOS – TRIGGER EMERGENCY DISPATCH</span>
          </button>
        </form>
      )}

    </div>
  );
};
