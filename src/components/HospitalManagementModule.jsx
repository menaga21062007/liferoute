import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SharedMap } from './SharedMap';
import {
  Building2,
  Bed,
  Stethoscope,
  UserCheck,
  FileCheck2,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const HospitalManagementModule = () => {
  const { hospitals, selectedHospitalId, setSelectedHospitalId, activityLogs, updateBedStatus } = useApp();
  const [activeTab, setActiveTab] = useState('beds'); // 'beds' | 'ots' | 'doctors' | 'logs'

  // Safely extract selected hospital or fallback
  const currentHospital = hospitals.find(h => h.id === selectedHospitalId || h.code === selectedHospitalId) || hospitals[0] || {
    id: 'hosp-1',
    name: 'Velammal Global Hospital',
    beds: [],
    ots: [],
    doctors: []
  };

  const beds = currentHospital.beds || [
    { id: "b-1", bedNumber: "EMG-01", type: "Emergency", category: "Emergency", ward: "A1", status: "OCCUPIED", patientName: "Robert Davis" },
    { id: "b-2", bedNumber: "EMG-02", type: "Emergency", category: "Emergency", ward: "A1", status: "AVAILABLE", patientName: null },
    { id: "b-3", bedNumber: "ICU-01", type: "ICU", category: "Cardiac ICU", ward: "ICU-B", status: "RESERVED", patientName: "David Miller" },
    { id: "b-4", bedNumber: "ICU-02", type: "ICU", category: "Cardiac ICU", ward: "ICU-B", status: "AVAILABLE", patientName: null },
    { id: "b-5", bedNumber: "WRD-101", type: "Ward", category: "General Ward", ward: "W-1", status: "OCCUPIED", patientName: "James Wilson" },
    { id: "b-6", bedNumber: "WRD-102", type: "Ward", category: "General Ward", ward: "W-1", status: "CLEANING", patientName: null }
  ];

  const otSuites = currentHospital.ots || [
    { id: "ot-1", code: "OT-1", otNumber: "OT-1 (Cardiac)", name: "Cardiac Operating Theater", specialty: "Cardiology", status: "In_Use" },
    { id: "ot-2", code: "OT-2", otNumber: "OT-2 (Trauma)", name: "Trauma Emergency Suite", specialty: "Trauma Surgery", status: "READY" },
    { id: "ot-3", code: "OT-3", otNumber: "OT-3 (General)", name: "General Surgery Suite", specialty: "General Surgery", status: "READY" }
  ];

  const doctorRoster = currentHospital.doctors || [
    { id: "doc-1", name: "Dr. Aris Thorne", specialty: "Cardiology & ER Lead", activePatients: 4, status: "ON_DUTY", phone: "Ext. 401" },
    { id: "doc-2", name: "Dr. Sarah Lin", specialty: "Chief Trauma Surgeon", activePatients: 2, status: "IN_OT", phone: "Ext. 402" },
    { id: "doc-3", name: "Dr. Marcus Vance", specialty: "Neurology Specialist", activePatients: 1, status: "ON_DUTY", phone: "Ext. 403" }
  ];

  const logs = activityLogs || [];

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6 animate-fade-in text-slate-100 font-sans">
      
      {/* Header Banner & Hospital Selector Dropdown */}
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-5 rounded-3xl flex flex-wrap items-center justify-between gap-4 shadow-2xl">
        <div className="flex items-center space-x-3.5">
          <div className="p-3.5 rounded-2xl bg-brand-blue/20 text-brand-lightBlue border border-brand-blue/40">
            <FileCheck2 className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <select
                value={selectedHospitalId}
                onChange={(e) => setSelectedHospitalId(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-1.5 text-lg font-black text-white focus:outline-none focus:border-brand-blue"
              >
                {hospitals.map(h => (
                  <option key={h.id} value={h.id}>🏥 {h.name} ({h.code})</option>
                ))}
              </select>
            </div>
            <p className="text-xs text-slate-300 font-semibold mt-1">Resource & Bed Allocation Board</p>
          </div>
        </div>

        {/* Tab Selector Buttons */}
        <div className="flex items-center bg-slate-950 p-1 rounded-2xl border border-slate-800">
          {[
            { id: 'beds', label: 'Bed Board', icon: Bed },
            { id: 'ots', label: 'OT Suites', icon: Stethoscope },
            { id: 'doctors', label: 'Doctor Roster', icon: UserCheck },
            { id: 'logs', label: 'Audit Timeline', icon: Clock }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
                  isActive ? 'bg-brand-blue text-white shadow-lg' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Management Content */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* TAB 1: BED BOARD */}
          {activeTab === 'beds' && (
            <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-6 rounded-3xl shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-lg font-black text-white tracking-tight">Visual Emergency & ICU Bed Board ({beds.length} Beds)</h3>
                <span className="text-xs font-extrabold text-emerald-400">Available: {beds.filter(b => b.status === 'AVAILABLE').length}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {beds.map((bed) => {
                  let statusBg = 'bg-emerald-500/25 text-emerald-300 border-emerald-500/40';
                  if (bed.status === 'RESERVED') statusBg = 'bg-blue-500/25 text-blue-300 border-blue-500/40';
                  if (bed.status === 'OCCUPIED') statusBg = 'bg-red-500/25 text-red-300 border-red-500/40';
                  if (bed.status === 'CLEANING') statusBg = 'bg-amber-500/25 text-amber-300 border-amber-500/40';

                  return (
                    <div key={bed.id} className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-2xl space-y-2 hover:border-slate-700 transition-all">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-base text-white">🛏️ {bed.bedNumber || bed.code}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border uppercase ${statusBg}`}>
                          {bed.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-300 font-bold">{bed.category || bed.type}</div>

                      {/* Status Override Selector */}
                      <select
                        value={bed.status}
                        onChange={(e) => updateBedStatus(currentHospital.id, bed.id, e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-[10px] font-bold text-white focus:outline-none"
                      >
                        <option value="AVAILABLE">AVAILABLE</option>
                        <option value="RESERVED">RESERVED</option>
                        <option value="OCCUPIED">OCCUPIED</option>
                        <option value="CLEANING">CLEANING</option>
                      </select>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: OT SUITES */}
          {activeTab === 'ots' && (
            <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-6 rounded-3xl shadow-2xl space-y-4">
              <h3 className="text-lg font-black text-white tracking-tight">Operating Theater (OT) Suites</h3>
              <div className="space-y-3">
                {otSuites.map((ot) => (
                  <div key={ot.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-black text-base text-white">🏥 {ot.otNumber || ot.name}</div>
                      <div className="text-slate-300 font-semibold mt-0.5">Specialty: {ot.specialty || 'Surgery'}</div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-black ${
                      ot.status === 'Free' || ot.status === 'READY' ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/40' : 'bg-red-500/25 text-red-300 border border-red-500/40'
                    }`}>
                      {ot.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: DOCTOR ROSTER */}
          {activeTab === 'doctors' && (
            <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-6 rounded-3xl shadow-2xl space-y-4">
              <h3 className="text-lg font-black text-white tracking-tight">On-Call Specialist Roster</h3>
              <div className="space-y-3">
                {doctorRoster.map((doc) => (
                  <div key={doc.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-black text-base text-white">👨‍⚕️ {doc.name}</div>
                      <div className="text-slate-300 font-semibold mt-0.5">{doc.specialty}</div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-black ${
                      doc.status === 'ON_DUTY' || doc.status === 'AVAILABLE' ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/40' : 'bg-amber-500/25 text-amber-300 border border-amber-500/40'
                    }`}>
                      {doc.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: AUDIT TIMELINE */}
          {activeTab === 'logs' && (
            <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-6 rounded-3xl shadow-2xl space-y-4">
              <h3 className="text-lg font-black text-white tracking-tight">System Activity Audit Timeline</h3>
              <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                {logs.map((log) => (
                  <div key={log.id} className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-xs space-y-1">
                    <div className="flex items-center justify-between font-black text-white">
                      <span>{log.event}</span>
                      <span className="text-slate-400 font-mono text-[10px]">{log.timestamp}</span>
                    </div>
                    <p className="text-slate-300 font-semibold">{log.details}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Universal Shared Map */}
        <div className="lg:col-span-5 space-y-4">
          <SharedMap height="h-[580px]" />
        </div>

      </div>

    </div>
  );
};
