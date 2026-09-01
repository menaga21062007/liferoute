import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { PhoneCall, MapPin, Ambulance, Building2, Clock, CheckCircle2 } from 'lucide-react';
import L from 'leaflet';

export const CallCentreDashboard = () => {
  const { sosEmergencies = [], ambulances = [], hospitals = [], trafficSignals = [], assignAmbulance } = useApp();
  const [selectedSosId, setSelectedSosId] = useState(sosEmergencies[0]?.id || null);
  const [selectedAmbulanceCode, setSelectedAmbulanceCode] = useState('AMB-101');

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupRef = useRef(null);

  const selectedSos = sosEmergencies.find((s) => s.id === selectedSosId) || sosEmergencies[0];

  // Initialize Leaflet Map Engine (Identical to Hospital Desk Dashboard)
  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      if (mapRef.current._leaflet_id) {
        mapRef.current._leaflet_id = null;
      }

      const map = L.map(mapRef.current, {
        center: [9.9252, 78.1200],
        zoom: 13,
        zoomControl: true
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(map);

      const layerGroup = L.layerGroup().addTo(map);
      layerGroupRef.current = layerGroup;
      mapInstanceRef.current = map;

      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 200);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        layerGroupRef.current = null;
      }
    };
  }, []);

  // Update map markers, route polylines, and icons (Identical to Hospital Desk Map)
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    // 1. Draw All Hospitals on Map (Same as Hospital Desk)
    hospitals.forEach((hosp) => {
      if (!hosp.location) return;
      const hospitalIcon = L.divIcon({
        className: 'custom-hosp-icon-lg',
        html: `<div style="background-color: #064e3b; color: white; width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 16px; border: 3px solid white; box-shadow: 0 0 14px rgba(6, 78, 59, 0.9);">🏥</div>`,
        iconSize: [44, 44],
        iconAnchor: [22, 22]
      });

      const hm = L.marker([hosp.location.lat, hosp.location.lng], { icon: hospitalIcon });
      hm.bindPopup(`<b>${hosp.name}</b><br/>Beds Available: ${hosp.availableBeds}/${hosp.totalBeds}`);
      layerGroup.addLayer(hm);
    });

    // 2. Draw Patient Emergency Pickup Point
    if (selectedSos && selectedSos.pickupLocation) {
      const patientIcon = L.divIcon({
        className: 'custom-patient-icon-lg',
        html: `<div style="background-color: #dc2626; color: white; width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 16px; border: 3px solid white; box-shadow: 0 0 16px rgba(220, 38, 38, 1);">📍</div>`,
        iconSize: [38, 38],
        iconAnchor: [19, 19]
      });

      const m = L.marker([selectedSos.pickupLocation.lat, selectedSos.pickupLocation.lng], { icon: patientIcon });
      m.bindPopup(`<b>Emergency ID: ${selectedSos.id}</b><br/>Patient: ${selectedSos.patientName}<br/>Location: ${selectedSos.pickupLocation.address}`);
      layerGroup.addLayer(m);
    }

    // 3. Draw Active Ambulances + Route Lines (Same as Hospital Desk)
    ambulances.forEach((amb) => {
      if (!amb.currentLocation) return;
      const isSelectedAmb = amb.code === selectedAmbulanceCode;

      if (amb.patient && amb.targetHospitalId) {
        const targetH = hospitals.find((h) => h.id === amb.targetHospitalId);
        if (targetH && targetH.location) {
          const routeCoords = [
            [amb.currentLocation.lat, amb.currentLocation.lng],
            [targetH.location.lat, targetH.location.lng]
          ];
          const routeLine = L.polyline(routeCoords, {
            color: '#059669',
            weight: 5,
            opacity: 0.85,
            dashArray: '8, 8'
          });
          layerGroup.addLayer(routeLine);
        }
      }

      const ambIcon = L.divIcon({
        className: 'custom-amb-icon-lg',
        html: `<div style="background-color: ${isSelectedAmb ? '#dc2626' : '#059669'}; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 18px; border: 3px solid white; box-shadow: 0 0 16px ${isSelectedAmb ? 'rgba(220, 38, 38, 1)' : 'rgba(5, 150, 105, 0.9)'};">🚑</div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

      const am = L.marker([amb.currentLocation.lat, amb.currentLocation.lng], { icon: ambIcon });
      am.bindPopup(`<b>Ambulance ${amb.code}</b><br/>Status: ${amb.status}<br/>Driver: ${amb.driverName}`);
      layerGroup.addLayer(am);
    });

    // 4. Draw Traffic Signal Markers (Same as Hospital Desk)
    trafficSignals.forEach((sig) => {
      if (!sig.location) return;
      const isBlue = sig.blueLightActive;
      const signalIcon = L.divIcon({
        className: 'custom-sig-icon',
        html: `
          <div style="
            background: ${isBlue ? 'linear-gradient(135deg, #1e40af, #3b82f6)' : 'linear-gradient(135deg, #1e293b, #334155)'};
            color: white;
            width: 44px;
            height: 44px;
            border-radius: 12px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            border: 3px solid ${isBlue ? '#60a5fa' : '#94a3b8'};
            box-shadow: ${isBlue ? '0 0 20px #3b82f6, 0 0 40px #2563eb' : '0 4px 6px rgba(0,0,0,0.3)'};
          ">
            <span>${isBlue ? '🚨' : '🚦'}</span>
            <span style="font-size: 9px; font-weight: 900; background: rgba(0,0,0,0.6); padding: 0 4px; border-radius: 4px; margin-top: -2px;">${sig.code}</span>
          </div>
        `,
        iconSize: [44, 44],
        iconAnchor: [22, 22]
      });

      const sm = L.marker([sig.location.lat, sig.location.lng], { icon: signalIcon });
      sm.bindPopup(`<b>${sig.code} — ${sig.name}</b><br/>Blue Light: ${isBlue ? '🔵 ACTIVE GREEN CORRIDOR (<200m)' : '⚪ NORMAL (OFF)'}`);
      layerGroup.addLayer(sm);
    });

    setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 200);

  }, [selectedSos, ambulances, hospitals, trafficSignals, selectedAmbulanceCode]);

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
            <span>Pending Calls: <strong className="text-red-400">{sosEmergencies.filter((s) => s.status === 'PENDING_DISPATCH').length}</strong></span>
          </div>
          <div className="bg-emerald-900/80 px-3.5 py-1.5 rounded-xl border border-emerald-600">
            <span>Active Ambulances: <strong className="text-emerald-300">{ambulances.length} Units</strong></span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Col: Pending Emergency Calls List (4 Cols) */}
        <div className="lg:col-span-4 bg-white border border-emerald-200 rounded-3xl p-4 shadow-sm space-y-3">
          <div className="border-b border-emerald-100 pb-2 flex items-center justify-between">
            <h2 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Incoming SOS Calls</h2>
            <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {sosEmergencies.length} Requests
            </span>
          </div>

          <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
            {sosEmergencies.map((sos) => {
              const isSelected = sos.id === selectedSosId;
              return (
                <div
                  key={sos.id}
                  onClick={() => setSelectedSosId(sos.id)}
                  className={`p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-600 shadow-md ring-2 ring-emerald-300'
                      : 'bg-slate-50 border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-extrabold text-xs text-red-600">{sos.id}</span>
                    <span className="text-[10px] font-bold text-slate-500">{sos.timestamp}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-xs">{sos.patientName} ({sos.age} y/o)</h3>
                  <p className="text-[11px] text-emerald-800 font-semibold mt-0.5 flex items-center space-x-1">
                    <MapPin className="h-3 w-3 text-red-500 shrink-0" />
                    <span className="truncate">{sos.pickupLocation?.address}</span>
                  </p>

                  <div className="mt-2 flex items-center justify-between pt-1 border-t border-slate-200/60">
                    <span className="text-[10px] font-extrabold text-slate-700">{sos.emergencyType}</span>
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase ${
                      sos.status === 'ASSIGNED' ? 'bg-emerald-200 text-emerald-900' : 'bg-red-100 text-red-700 animate-pulse'
                    }`}>
                      {sos.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 8 Cols: Map & Dispatch Control Panel */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Dispatch Action Panel */}
          {selectedSos && (
            <div className="bg-white border-2 border-emerald-600 rounded-3xl p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
                <div>
                  <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Selected Emergency</span>
                  <h2 className="text-base font-extrabold text-slate-900">{selectedSos.patientName} — {selectedSos.id}</h2>
                </div>
                <span className="bg-emerald-100 text-emerald-900 text-xs font-bold px-3 py-1 rounded-full">
                  Pickup: {selectedSos.pickupLocation?.address}
                </span>
              </div>

              <form onSubmit={handleDispatch} className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center space-x-2 flex-1 min-w-[240px]">
                  <label className="text-xs font-bold text-slate-700 shrink-0">Assign Ambulance Unit:</label>
                  <select
                    value={selectedAmbulanceCode}
                    onChange={(e) => setSelectedAmbulanceCode(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                  >
                    {ambulances.map((amb) => (
                      <option key={amb.id} value={amb.code}>
                        {amb.code} — {amb.unitName} ({amb.status})
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#064e3b] hover:bg-emerald-900 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center space-x-2"
                >
                  <Ambulance className="h-4 w-4 text-emerald-300" />
                  <span>DISPATCH AMBULANCE NOW</span>
                </button>
              </form>
            </div>
          )}

          {/* Interactive Live Map matching Hospital Desk Map */}
          <div className="bg-white border border-emerald-200 rounded-3xl p-3 shadow-sm flex flex-col">
            <div className="flex items-center justify-between px-3 py-2 border-b border-emerald-100 mb-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Dispatch Center Interactive Map</span>
              <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                Madurai, Tamil Nadu
              </span>
            </div>

            <div
              ref={mapRef}
              className="w-full h-[400px] rounded-2xl overflow-hidden border border-slate-200 shadow-inner z-0"
            />
          </div>

        </div>

      </div>

    </div>
  );
};
