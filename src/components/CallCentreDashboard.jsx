import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { PhoneCall, MapPin, Ambulance, Building2, Clock, CheckCircle2 } from 'lucide-react';
import L from 'leaflet';

export const CallCentreDashboard = () => {
  const { sosEmergencies, ambulances, assignAmbulance } = useApp();
  const [selectedSosId, setSelectedSosId] = useState(sosEmergencies[0]?.id || null);
  const [selectedAmbulanceCode, setSelectedAmbulanceCode] = useState('AMB-101');

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupRef = useRef(null);

  const selectedSos = sosEmergencies.find((s) => s.id === selectedSosId) || sosEmergencies[0];

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      const map = L.map(mapRef.current, {
        center: [40.722, -73.950],
        zoom: 13,
        zoomControl: true
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      const layerGroup = L.layerGroup().addTo(map);
      layerGroupRef.current = layerGroup;
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        layerGroupRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    // Patient Marker
    if (selectedSos && selectedSos.pickupLocation) {
      const patientIcon = L.divIcon({
        className: 'custom-patient-icon',
        html: `<div style="background-color: #dc2626; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid white; box-shadow: 0 0 10px rgba(220, 38, 38, 0.8);">SOS</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const m = L.marker([selectedSos.pickupLocation.lat, selectedSos.pickupLocation.lng], { icon: patientIcon });
      m.bindPopup(`<b>${selectedSos.id}</b><br/>${selectedSos.patientName}`);
      layerGroup.addLayer(m);
    }

    // Ambulance Markers
    ambulances.forEach((amb) => {
      if (!amb.currentLocation) return;
      const ambIcon = L.divIcon({
        className: 'custom-amb-icon',
        html: `<div style="background-color: #059669; color: white; width: 30px; height: 30px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid white; box-shadow: 0 0 10px rgba(5, 150, 105, 0.8);">AMB</div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });

      const m = L.marker([amb.currentLocation.lat, amb.currentLocation.lng], { icon: ambIcon });
      m.bindPopup(`<b>${amb.code}</b><br/>Status: ${amb.status}`);
      layerGroup.addLayer(m);
    });
  }, [selectedSos, ambulances]);

  const handleDispatch = (e) => {
    e.preventDefault();
    if (!selectedSos) return;
    assignAmbulance(selectedSos.id, selectedAmbulanceCode);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 space-y-4 text-slate-800">
      
      {/* Top Banner */}
      <div className="bg-[#064e3b] text-white p-4 rounded-3xl flex flex-wrap items-center justify-between gap-4 shadow-md border border-emerald-700">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-600 rounded-xl">
            <PhoneCall className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-serif text-white">AMBULANCE CALL CENTRE OPERATOR DESK</h1>
            <p className="text-xs text-emerald-200 font-medium">City Emergency Control Room • Rapid Ambulance Dispatch Unit</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs font-bold">
          <div className="bg-emerald-900/80 px-3.5 py-1.5 rounded-xl border border-emerald-600">
            Active Emergencies: <span className="text-red-300 font-extrabold">{sosEmergencies.length}</span>
          </div>
          <div className="bg-emerald-900/80 px-3.5 py-1.5 rounded-xl border border-emerald-600">
            Available Units: <span className="text-emerald-200 font-extrabold">{ambulances.filter(a => a.status === 'AVAILABLE').length}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column: Active SOS List (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-emerald-200 rounded-3xl p-4 space-y-3 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 uppercase tracking-wider flex items-center justify-between font-serif">
            <span>Incoming Active Emergency Requests</span>
            <span className="text-xs text-emerald-700 font-normal">Real-time Queue</span>
          </h2>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {sosEmergencies.map((sos) => {
              const isSelected = selectedSos?.id === sos.id;
              return (
                <div
                  key={sos.id}
                  onClick={() => setSelectedSosId(sos.id)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-600 shadow-md ring-2 ring-emerald-400'
                      : 'bg-slate-50 border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-extrabold text-red-600 uppercase tracking-wider">{sos.id}</span>
                    <span className="text-[10px] text-slate-500 font-medium flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{sos.timestamp}</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-slate-900 font-serif">{sos.patientName} ({sos.age} y/o)</span>
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                      sos.status === 'PENDING_DISPATCH' ? 'bg-red-100 border border-red-300 text-red-800' : 'bg-emerald-100 border border-emerald-300 text-emerald-800'
                    }`}>
                      {sos.status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1">
                    <p className="flex items-center space-x-1 text-slate-600">
                      <MapPin className="h-3.5 w-3.5 text-red-500 flex-shrink-0" />
                      <span className="truncate">{sos.pickupLocation?.address}</span>
                    </p>
                    <p className="text-[11px] font-bold text-emerald-800">
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
          
          {/* Dispatch Control Form (Hospital Selection Removed) */}
          {selectedSos && (
            <form onSubmit={handleDispatch} className="bg-white border border-emerald-200 rounded-3xl p-4 space-y-3 shadow-sm">
              <h3 className="text-xs font-bold text-emerald-800 uppercase tracking-wider border-b border-slate-100 pb-1">
                Dispatch Ambulance to Emergency Request [{selectedSos.id}]
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-700 font-bold block mb-1">Select Available Ambulance</label>
                  <select
                    value={selectedAmbulanceCode}
                    onChange={(e) => setSelectedAmbulanceCode(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600 cursor-pointer"
                  >
                    {ambulances.map((amb) => (
                      <option key={amb.id} value={amb.code}>
                        {amb.code} — {amb.unitName} ({amb.status})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 flex flex-col justify-center">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Hospital Allocation Method</span>
                  <p className="text-xs font-extrabold text-emerald-900 flex items-center space-x-1 mt-0.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Auto-Assigned by Bed Availability</span>
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#064e3b] hover:bg-emerald-900 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-md flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <Ambulance className="h-4 w-4" />
                <span>DISPATCH AMBULANCE {selectedAmbulanceCode} TO {selectedSos.patientName}</span>
              </button>
            </form>
          )}

          {/* Direct DOM Leaflet Map Container */}
          <div className="bg-white border border-emerald-200 rounded-3xl p-2 h-[420px] relative overflow-hidden shadow-sm">
            <div ref={mapRef} className="w-full h-full rounded-2xl z-0" />
          </div>

        </div>

      </div>
    </div>
  );
};
