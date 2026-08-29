import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PhoneCall, MapPin, Ambulance, Building2, CheckCircle2, Clock } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const patientIcon = L.divIcon({
  className: 'custom-patient-icon',
  html: `<div style="background-color: #dc2626; color: white; width: 28px; height: 28px; borderRadius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid white; box-shadow: 0 0 10px rgba(220, 38, 38, 0.8);">SOS</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14]
});

const ambulanceIcon = L.divIcon({
  className: 'custom-amb-icon',
  html: `<div style="background-color: #2563eb; color: white; width: 30px; height: 30px; borderRadius: 6px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid white; box-shadow: 0 0 10px rgba(37, 99, 235, 0.8);">AMB</div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});

export const CallCentreDashboard = () => {
  const { sosEmergencies, ambulances, hospitals, assignAmbulance } = useApp();
  const [selectedSosId, setSelectedSosId] = useState(sosEmergencies[0]?.id || null);
  const [selectedAmbulanceCode, setSelectedAmbulanceCode] = useState('AMB-101');
  const [selectedHospitalId, setSelectedHospitalId] = useState('hosp-1');

  const selectedSos = sosEmergencies.find((s) => s.id === selectedSosId) || sosEmergencies[0];

  const handleDispatch = (e) => {
    e.preventDefault();
    if (!selectedSos) return;
    assignAmbulance(selectedSos.id, selectedAmbulanceCode, selectedHospitalId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
      
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between text-white">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-blue-700 rounded-lg">
            <PhoneCall className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white">AMBULANCE CALL CENTRE OPERATOR DESK</h1>
            <p className="text-xs text-slate-400">City Emergency Control Room • Live Emergency Intake & Dispatch System</p>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-xs font-bold">
          <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            Active Emergencies: <span className="text-red-400 font-black">{sosEmergencies.length}</span>
          </div>
          <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            Available Ambulances: <span className="text-emerald-400 font-black">{ambulances.filter(a => a.status === 'AVAILABLE').length}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column: Active SOS List (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
          <h2 className="text-sm font-black text-slate-200 border-b border-slate-800 pb-2 uppercase tracking-wider flex items-center justify-between">
            <span>Incoming Active Emergency Requests</span>
            <span className="text-xs text-blue-400 font-normal">Real-time List</span>
          </h2>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {sosEmergencies.map((sos) => {
              const isSelected = selectedSos?.id === sos.id;
              return (
                <div
                  key={sos.id}
                  onClick={() => setSelectedSosId(sos.id)}
                  className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-950/80 border-blue-500 shadow-md ring-1 ring-blue-400'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-black text-red-400 uppercase tracking-wider">{sos.id}</span>
                    <span className="text-[10px] text-slate-400 font-medium flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{sos.timestamp}</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-white">{sos.patientName} ({sos.age} y/o)</span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ${
                      sos.status === 'PENDING_DISPATCH' ? 'bg-red-950 border border-red-700 text-red-300' : 'bg-emerald-950 border border-emerald-700 text-emerald-300'
                    }`}>
                      {sos.status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-300 space-y-1">
                    <p className="flex items-center space-x-1 text-slate-400">
                      <MapPin className="h-3.5 w-3.5 text-red-500 flex-shrink-0" />
                      <span className="truncate">{sos.pickupLocation?.address}</span>
                    </p>
                    <p className="text-[11px] font-semibold text-blue-300">
                      Emergency Type: {sos.emergencyType} • Phone: {sos.phone}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Dispatch Panel & Map (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Dispatch Control Form */}
          {selectedSos && (
            <form onSubmit={handleDispatch} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
              <h3 className="text-xs font-black text-blue-400 uppercase tracking-wider border-b border-slate-800 pb-1">
                Dispatch Ambulance to Emergency Request [{selectedSos.id}]
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 font-bold block mb-1">Select Available Ambulance</label>
                  <select
                    value={selectedAmbulanceCode}
                    onChange={(e) => setSelectedAmbulanceCode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-blue-500"
                  >
                    {ambulances.map((amb) => (
                      <option key={amb.id} value={amb.code}>
                        {amb.code} — {amb.unitName} ({amb.status})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-bold block mb-1">Select Target Hospital Drop</label>
                  <select
                    value={selectedHospitalId}
                    onChange={(e) => setSelectedHospitalId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-blue-500"
                  >
                    {hospitals.map((hosp) => (
                      <option key={hosp.id} value={hosp.id}>
                        {hosp.name} ({hosp.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-black text-sm uppercase tracking-wider shadow-lg flex items-center justify-center space-x-2"
              >
                <Ambulance className="h-5 w-5" />
                <span>DISPATCH AMBULANCE {selectedAmbulanceCode} TO {selectedSos.patientName}</span>
              </button>
            </form>
          )}

          {/* Interactive Map View */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-2 h-[420px] relative overflow-hidden">
            <MapContainer
              center={[40.722, -73.950]}
              zoom={13}
              style={{ height: '100%', width: '100%', borderRadius: '8px' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />

              {/* Patient Location Marker */}
              {selectedSos && selectedSos.pickupLocation && (
                <Marker position={[selectedSos.pickupLocation.lat, selectedSos.pickupLocation.lng]} icon={patientIcon}>
                  <Popup>
                    <div className="text-xs font-bold text-slate-900">
                      <p className="font-black text-red-600">{selectedSos.id}</p>
                      <p>{selectedSos.patientName}</p>
                      <p>{selectedSos.pickupLocation.address}</p>
                    </div>
                  </Popup>
                </Marker>
              )}

              {/* Ambulance Markers */}
              {ambulances.map((amb) => (
                <Marker key={amb.id} position={[amb.currentLocation.lat, amb.currentLocation.lng]} icon={ambulanceIcon}>
                  <Popup>
                    <div className="text-xs font-bold text-slate-900">
                      <p className="font-black text-blue-600">{amb.code}</p>
                      <p>{amb.unitName}</p>
                      <p>Status: {amb.status}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

        </div>

      </div>
    </div>
  );
};
