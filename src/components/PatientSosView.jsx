import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AlertCircle, MapPin, CheckCircle2, Phone, User, Activity } from 'lucide-react';

export const PatientSosView = () => {
  const { createSosEmergency, sosEmergencies } = useApp();
  const [patientName, setPatientName] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [emergencyType, setEmergencyType] = useState('Accident');
  const [locationAddress, setLocationAddress] = useState('5th Ave & Grand St Junction, District 1');
  const [activeSos, setActiveSos] = useState(null);
  const [isLocating, setIsLocating] = useState(false);

  const handleFetchLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsLocating(false);
          setLocationAddress(`GPS: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)} (Current GPS)`);
        },
        () => {
          setIsLocating(false);
          setLocationAddress('District 1 Emergency Sector (Grand Ave)');
        }
      );
    } else {
      setIsLocating(false);
      setLocationAddress('District 1 Emergency Sector (Grand Ave)');
    }
  };

  const handleTriggerSos = (e) => {
    e.preventDefault();
    const created = createSosEmergency({
      patientName: patientName || 'Emergency Citizen',
      phone: phone || '9876543210',
      age: age || 45,
      emergencyType,
      pickupLocation: {
        lat: 40.715000,
        lng: -73.955000,
        address: locationAddress
      }
    });
    setActiveSos(created);
  };

  const currentStatus = sosEmergencies.find((s) => s.id === activeSos?.id);

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <div className="bg-slate-900 border-2 border-red-600 rounded-xl shadow-2xl p-6 text-white">
        
        {/* Government Portal Header */}
        <div className="text-center pb-4 border-b border-slate-800 mb-6">
          <span className="bg-red-700 text-white text-xs font-black px-3 py-1 rounded-full tracking-widest uppercase">
            108 Emergency Portal
          </span>
          <h1 className="text-2xl font-black mt-2 text-red-500 tracking-tight">NATIONAL EMERGENCY SOS</h1>
          <p className="text-xs text-slate-400 font-medium">Government City Ambulance & Emergency Response Service</p>
        </div>

        {/* SOS Confirmation Banner */}
        {currentStatus ? (
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 mb-6 text-center space-y-4">
            <div className="inline-flex p-3 rounded-full bg-emerald-950 border border-emerald-600 text-emerald-400">
              <CheckCircle2 className="h-10 w-10 animate-pulse" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Emergency Reference ID</span>
              <h2 className="text-3xl font-black text-white tracking-wider">{currentStatus.id}</h2>
            </div>

            <div className="p-4 bg-slate-900 rounded-lg border border-slate-700 text-left space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className={`font-black uppercase ${
                  currentStatus.status === 'PENDING_DISPATCH' ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {currentStatus.status === 'PENDING_DISPATCH' ? 'Waiting Call Centre Dispatch' : currentStatus.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Assigned Unit:</span>
                <span className="font-bold text-blue-400">{currentStatus.assignedAmbulanceCode || 'Dispatch Pending...'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Emergency Type:</span>
                <span className="font-bold text-white">{currentStatus.emergencyType}</span>
              </div>
            </div>

            <p className="text-xs text-amber-300 font-medium bg-amber-950/60 p-3 rounded border border-amber-800">
              🚨 Stay where you are. Ambulance Call Centre has received your GPS coordinates and is dispatching the nearest unit.
            </p>

            <button
              onClick={() => setActiveSos(null)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 rounded-lg text-xs font-bold"
            >
              Trigger New Emergency SOS
            </button>
          </div>
        ) : (
          <form onSubmit={handleTriggerSos} className="space-y-4">
            
            {/* Big Red SOS Button */}
            <button
              type="submit"
              className="w-full py-6 bg-gradient-to-b from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white rounded-2xl font-black text-2xl tracking-wider shadow-lg border-2 border-red-400 flex items-center justify-center space-x-3 transition-transform active:scale-95"
            >
              <AlertCircle className="h-8 w-8 animate-ping" />
              <span>SOS – TRIGGER EMERGENCY</span>
            </button>

            {/* Location Section */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4 text-red-500" />
                  <span>EMERGENCY PICKUP LOCATION</span>
                </span>
                <button
                  type="button"
                  onClick={handleFetchLocation}
                  className="text-[11px] text-blue-400 hover:underline font-semibold"
                >
                  {isLocating ? 'Fetching GPS...' : 'Use Current GPS'}
                </button>
              </label>
              <input
                type="text"
                value={locationAddress}
                onChange={(e) => setLocationAddress(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-medium focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            {/* Optional Details Form */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block border-b border-slate-800 pb-1">
                Optional Patient Details
              </span>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 font-medium block mb-1">Patient Name</label>
                  <input
                    type="text"
                    placeholder="e.g. John Doe"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-medium block mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="10-digit phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 font-medium block mb-1">Age</label>
                  <input
                    type="number"
                    placeholder="e.g. 54"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-medium block mb-1">Emergency Type</label>
                  <select
                    value={emergencyType}
                    onChange={(e) => setEmergencyType(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-white focus:outline-none"
                  >
                    <option value="Accident">Accident</option>
                    <option value="Heart issue">Heart issue</option>
                    <option value="Breathing issue">Breathing issue</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
