import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Building2, Ambulance, Bed, Activity, CheckCircle2, RefreshCw, User, Edit3 } from 'lucide-react';
import L from 'leaflet';

export const HospitalDeskDashboard = () => {
  const { hospitals, ambulances, hospitalBedsMap, updateBedStatus } = useApp();
  const [selectedHospitalId, setSelectedHospitalId] = useState(hospitals[0]?.id || 'hosp-1');

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupRef = useRef(null);

  const currentHospital = hospitals.find((h) => h.id === selectedHospitalId) || hospitals[0];
  const currentBeds = hospitalBedsMap[selectedHospitalId] || [];

  const incomingAmbulances = ambulances.filter(
    (a) => a.targetHospitalId === currentHospital.id && a.patient
  );

  // Compute live bed statistics for THIS selected hospital
  const availableBedsCount = currentBeds.filter((b) => b.status === 'AVAILABLE').length;
  const reservedBedsCount = currentBeds.filter((b) => b.status === 'RESERVED').length;
  const cleaningBedsCount = currentBeds.filter((b) => b.status === 'CLEANING').length;
  const occupiedBedsCount = currentBeds.filter((b) => b.status === 'OCCUPIED').length;

  // Initialize Leaflet Map Engine (Identical to GreenCorridorDemo.jsx)
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

  // Update map markers, route polylines, and icons
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    // Draw All Hospitals on Map
    hospitals.forEach((hosp) => {
      if (!hosp.location) return;
      const isSelected = hosp.id === currentHospital.id;
      const hospitalIcon = L.divIcon({
        className: 'custom-hosp-icon-lg',
        html: `<div style="background-color: ${isSelected ? '#064e3b' : '#047857'}; color: white; width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 16px; border: 3px solid white; box-shadow: ${isSelected ? '0 0 16px rgba(6, 78, 59, 1)' : '0 0 8px rgba(0,0,0,0.3)'};">🏥</div>`,
        iconSize: [44, 44],
        iconAnchor: [22, 22]
      });

      const hm = L.marker([hosp.location.lat, hosp.location.lng], { icon: hospitalIcon });
      hm.bindPopup(`<b>${hosp.name}</b><br/>Beds: ${hosp.availableBeds}/${hosp.totalBeds}`);
      layerGroup.addLayer(hm);
    });

    // Draw Active Ambulances + Route Lines
    ambulances.forEach((amb) => {
      if (!amb.currentLocation) return;
      const isIncomingToCurrent = amb.targetHospitalId === currentHospital.id && amb.patient;

      if (amb.patient && amb.targetHospitalId) {
        const targetH = hospitals.find((h) => h.id === amb.targetHospitalId);
        if (targetH && targetH.location) {
          const routeCoords = [
            [amb.currentLocation.lat, amb.currentLocation.lng],
            [targetH.location.lat, targetH.location.lng]
          ];
          const routeLine = L.polyline(routeCoords, {
            color: isIncomingToCurrent ? '#059669' : '#3b82f6',
            weight: isIncomingToCurrent ? 6 : 4,
            opacity: 0.85,
            dashArray: '8, 8'
          });
          layerGroup.addLayer(routeLine);
        }
      }

      const ambIcon = L.divIcon({
        className: 'custom-amb-icon-lg',
        html: `<div style="background-color: ${isIncomingToCurrent ? '#dc2626' : '#2563eb'}; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 18px; border: 3px solid white; box-shadow: 0 0 14px ${isIncomingToCurrent ? 'rgba(220, 38, 38, 1)' : 'rgba(37, 99, 235, 0.8)'};">🚑</div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

      const am = L.marker([amb.currentLocation.lat, amb.currentLocation.lng], { icon: ambIcon });
      am.bindPopup(`<b>Ambulance ${amb.code}</b><br/>Status: ${amb.status}<br/>${amb.patient ? `Patient: ${amb.patient.name}` : 'No patient'}`);
      layerGroup.addLayer(am);
    });

    if (currentHospital && currentHospital.location) {
      map.panTo([currentHospital.location.lat, currentHospital.location.lng]);
    }

    setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 200);
  }, [currentHospital, ambulances, hospitals]);

  const handleEditPatientName = (bed) => {
    const newName = prompt(`Enter Patient Name for Bed ${bed.number}:`, bed.patientName !== 'Unassigned' ? bed.patientName : '');
    if (newName !== null && newName.trim() !== '') {
      updateBedStatus(selectedHospitalId, bed.id, bed.status === 'AVAILABLE' ? 'OCCUPIED' : bed.status, newName.trim());
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 space-y-4 text-slate-800">
      
      {/* Hospital Selector & Header Bar */}
      <div className="bg-[#064e3b] text-white p-4 rounded-3xl flex flex-wrap items-center justify-between gap-4 shadow-md border border-emerald-700">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-600 rounded-xl">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-serif text-white">{currentHospital.name}</h1>
            <p className="text-xs text-emerald-200 font-medium">Emergency Desk & Real-Time Bed Availability Board • {currentHospital.address}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <label className="text-xs font-bold text-emerald-100">Select Hospital Terminal:</label>
          <select
            value={selectedHospitalId}
            onChange={(e) => setSelectedHospitalId(e.target.value)}
            className="bg-emerald-900 border border-emerald-600 rounded-xl px-3 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-emerald-400 cursor-pointer"
          >
            {hospitals.map((h) => (
              <option key={h.id} value={h.id}>{h.name} ({h.code})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Real-Time Bed Availability Live Counters for Selected Hospital */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        
        <div className="bg-white p-3.5 rounded-2xl border border-emerald-200 shadow-sm flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-100 rounded-xl text-emerald-800">
            <Bed className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">AVAILABLE BEDS</p>
            <p className="text-lg font-extrabold text-emerald-800">{availableBedsCount} <span className="text-xs font-bold text-slate-400">/ {currentBeds.length}</span></p>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-amber-200 shadow-sm flex items-center space-x-3">
          <div className="p-2.5 bg-amber-100 rounded-xl text-amber-800">
            <Bed className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">RESERVED BEDS</p>
            <p className="text-lg font-extrabold text-amber-700">{reservedBedsCount}</p>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-blue-200 shadow-sm flex items-center space-x-3">
          <div className="p-2.5 bg-blue-100 rounded-xl text-blue-800">
            <RefreshCw className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">CLEANING / SANITIZING</p>
            <p className="text-lg font-extrabold text-blue-700">{cleaningBedsCount}</p>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-red-200 shadow-sm flex items-center space-x-3">
          <div className="p-2.5 bg-red-100 rounded-xl text-red-800">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">OCCUPIED BEDS</p>
            <p className="text-lg font-extrabold text-red-700">{occupiedBedsCount}</p>
          </div>
        </div>

      </div>

      {/* Interactive Hospital Bed Board Management with Patient Names */}
      <div className="bg-white border border-emerald-200 rounded-3xl p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-serif flex items-center space-x-2">
            <Bed className="h-4 w-4 text-emerald-700" />
            <span>Interactive Bed Board & Patient Name Roster — {currentHospital.name}</span>
          </h2>
          <span className="text-xs text-emerald-800 font-bold">Real-time Patient Roster</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {currentBeds.map((bed) => {
            let statusBg = 'bg-emerald-50 border-emerald-300 text-emerald-900';
            let badgeBg = 'bg-emerald-600 text-white';
            let nameTagBg = 'bg-emerald-100 text-emerald-900 border-emerald-200';

            if (bed.status === 'RESERVED') {
              statusBg = 'bg-amber-50 border-amber-300 text-amber-900';
              badgeBg = 'bg-amber-600 text-white';
              nameTagBg = 'bg-amber-100 text-amber-900 border-amber-300 font-bold';
            } else if (bed.status === 'CLEANING') {
              statusBg = 'bg-blue-50 border-blue-300 text-blue-900';
              badgeBg = 'bg-blue-600 text-white';
              nameTagBg = 'bg-blue-100 text-blue-900 border-blue-200';
            } else if (bed.status === 'OCCUPIED') {
              statusBg = 'bg-red-50 border-red-300 text-red-900';
              badgeBg = 'bg-red-600 text-white';
              nameTagBg = 'bg-red-100 text-red-900 border-red-300 font-extrabold';
            }

            return (
              <div key={bed.id} className={`p-3.5 rounded-2xl border ${statusBg} space-y-2.5 flex flex-col justify-between shadow-xs transition-all`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <span className="font-black text-sm font-serif">Bed {bed.number}</span>
                    <span className="text-[10px] text-slate-500 font-bold">({bed.type})</span>
                  </div>
                  <span className={`text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase ${badgeBg}`}>
                    {bed.status}
                  </span>
                </div>

                {/* Patient Name Display & Edit Trigger */}
                <div className={`p-2 rounded-xl border text-xs flex items-center justify-between ${nameTagBg}`}>
                  <div className="flex items-center space-x-1.5 overflow-hidden">
                    <User className="h-3.5 w-3.5 shrink-0 text-slate-600" />
                    <span className="truncate">
                      <strong>Patient:</strong> {bed.patientName || 'Unassigned'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleEditPatientName(bed)}
                    title="Edit Patient Name"
                    className="p-1 hover:bg-white/60 rounded-md transition-colors shrink-0 cursor-pointer"
                  >
                    <Edit3 className="h-3 w-3 text-slate-700" />
                  </button>
                </div>

                {/* Status Switcher Dropdown */}
                <div className="space-y-1">
                  <label className="text-[9px] font-extrabold uppercase text-slate-500 block">Change Status:</label>
                  <select
                    value={bed.status}
                    onChange={(e) => updateBedStatus(selectedHospitalId, bed.id, e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600 cursor-pointer"
                  >
                    <option value="AVAILABLE">AVAILABLE (Unassigned)</option>
                    <option value="RESERVED">RESERVED (Patient En Route)</option>
                    <option value="CLEANING">CLEANING (Sanitizing)</option>
                    <option value="OCCUPIED">OCCUPIED (Patient Admitted)</option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column: Incoming Ambulances to THIS hospital (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-emerald-200 rounded-3xl p-4 space-y-3 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 uppercase tracking-wider flex items-center justify-between font-serif">
            <span>Incoming Ambulance Intakes</span>
            <span className="text-xs text-emerald-700 font-bold">{incomingAmbulances.length} Units En Route</span>
          </h2>

          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {incomingAmbulances.length > 0 ? (
              incomingAmbulances.map((amb) => (
                <div key={amb.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-emerald-900">{amb.code} — {amb.unitName}</span>
                    <span className="text-[10px] font-extrabold bg-emerald-100 border border-emerald-300 text-emerald-900 px-2.5 py-0.5 rounded-full uppercase">
                      ETA ~4 Mins
                    </span>
                  </div>

                  <div className="text-xs space-y-1">
                    <p className="font-bold text-slate-900 font-serif">Patient: {amb.patient.name} ({amb.patient.age} y/o {amb.patient.gender})</p>
                    <p className="text-slate-600">Chief Complaint: <span className="text-amber-700 font-medium">{amb.patient.chiefComplaint || 'Accident Trauma'}</span></p>
                  </div>

                  {/* Scene Vitals if entered by crew */}
                  <div className="bg-white p-2 rounded-xl border border-emerald-200 grid grid-cols-3 gap-1 text-[11px] text-center font-bold">
                    <div className="bg-emerald-50/60 py-1 rounded-lg">
                      <span className="text-[9px] text-slate-500 block font-normal">BP</span>
                      <span className="text-slate-900">{amb.patient.vitals?.bp || '120/80'}</span>
                    </div>
                    <div className="bg-emerald-50/60 py-1 rounded-lg">
                      <span className="text-[9px] text-slate-500 block font-normal">SpO2</span>
                      <span className="text-emerald-700">{amb.patient.vitals?.spo2 || '98%'}</span>
                    </div>
                    <div className="bg-emerald-50/60 py-1 rounded-lg">
                      <span className="text-[9px] text-slate-500 block font-normal">Pulse</span>
                      <span className="text-blue-700">{amb.patient.vitals?.pulse || '78 bpm'}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs font-medium">
                No active ambulances currently assigned to bring patients to {currentHospital.name}.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Map Engine */}
        <div className="lg:col-span-7 bg-white border border-emerald-200 rounded-3xl p-2 h-[420px] relative overflow-hidden shadow-sm flex flex-col">
          <div className="text-[11px] font-bold text-emerald-900 px-3 py-1.5 bg-emerald-50 border-b border-emerald-200 rounded-t-2xl flex items-center justify-between">
            <span>Hospital Emergency Map Engine (Larger Markers)</span>
            <span className="text-[10px] text-emerald-700">Displaying Hospitals & Active Ambulances</span>
          </div>
          <div ref={mapRef} className="w-full flex-1 rounded-b-2xl z-0" />
        </div>

      </div>
    </div>
  );
};
