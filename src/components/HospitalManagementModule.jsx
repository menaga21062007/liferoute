import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UniversalSharedMap } from './UniversalSharedMap';
import {
  Building2,
  Bed,
  Stethoscope,
  UserCheck,
  FileCheck2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Activity,
  ShieldCheck,
  Phone
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

  const beds = currentHospital.beds || [];
  const otSuites = currentHospital.ots || [];
  const doctorRoster = currentHospital.doctors || [];
  const logs = activityLogs || [];

  const availableCount = beds.filter(b => b.status === 'AVAILABLE').length;
  const occupiedCount = beds.filter(b => b.status === 'OCCUPIED' || b.status === 'RESERVED').length;
  const cleaningCount = beds.filter(b => b.status === 'CLEANING').length;

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6 animate-fade-in text-slate-100 font-sans">
      
      {/* Header Banner & Hospital Selector Dropdown */}
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-5 rounded-3xl flex flex-wrap items-center justify-between gap-4 shadow-2xl">
        <div className="flex items-center space-x-3.5">
          <div className="p-3.5 rounded-2xl bg-brand-blue/20 text-brand-lightBlue border border-brand-blue/40 shadow-lg shadow-blue-500/10">
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
            <p className="text-xs text-slate-300 font-semibold mt-1">Resource & Bed Allocation Board • {currentHospital.address}</p>
          </div>
        </div>

        {/* Tab Selector Buttons */}
        <div className="flex items-center bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
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
                  isActive ? 'bg-brand-blue text-white shadow-lg shadow-blue-500/20 ring-1 ring-blue-400/40' : 'text-slate-400 hover:text-white hover:bg-slate-900'
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
                <div>
                  <h3 className="text-lg font-black text-white tracking-tight">Visual Emergency & ICU Bed Board ({beds.length} Managed Beds)</h3>
                  <div className="flex items-center space-x-3 text-xs font-bold mt-1">
                    <span className="text-emerald-400">🟢 Available: {availableCount}</span>
                    <span className="text-red-400">🔴 Occupied: {occupiedCount}</span>
                    <span className="text-amber-400">🟡 Cleaning: {cleaningCount}</span>
                  </div>
                </div>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black px-2.5 py-1 rounded-full uppercase">
                  LIVE CAPACITY
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {beds.map((bed) => {
                  let statusBg = 'bg-emerald-500/25 text-emerald-300 border-emerald-500/40';
                  if (bed.status === 'RESERVED') statusBg = 'bg-blue-500/25 text-blue-300 border-blue-500/40';
                  if (bed.status === 'OCCUPIED') statusBg = 'bg-red-500/25 text-red-300 border-red-500/40';
                  if (bed.status === 'CLEANING') statusBg = 'bg-amber-500/25 text-amber-300 border-amber-500/40';

                  return (
                    <div key={bed.id} className="bg-slate-950/90 border border-slate-800 p-3.5 rounded-2xl space-y-2 hover:border-slate-700 transition-all shadow-md">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-sm text-white">🛏️ {bed.bedNumber || bed.code}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border uppercase ${statusBg}`}>
                          {bed.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-300 font-bold truncate">{bed.category || bed.type}</div>
                      {bed.patientName && (
                        <div className="text-[10px] text-red-400 font-extrabold truncate">Patient: {bed.patientName}</div>
                      )}

                      {/* Status Override Selector */}
                      <select
                        value={bed.status}
                        onChange={(e) => updateBedStatus(currentHospital.id, bed.id, e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-[10px] font-bold text-white focus:outline-none focus:border-brand-blue"
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
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-lg font-black text-white tracking-tight">Operating Theater (OT) Suites ({otSuites.length})</h3>
                <span className="text-xs font-extrabold text-blue-400">Available: {currentHospital.availableOTs} / {currentHospital.totalOTs}</span>
              </div>
              <div className="space-y-3">
                {otSuites.map((ot) => (
                  <div key={ot.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between text-xs hover:border-slate-700 transition-all">
                    <div>
                      <div className="font-black text-base text-white">🏥 {ot.otNumber || ot.name}</div>
                      <div className="text-slate-300 font-semibold mt-0.5">Specialty: {ot.specialty || 'Surgery'}</div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase border ${
                      ot.status === 'Free' || ot.status === 'READY' ? 'bg-emerald-500/25 text-emerald-300 border-emerald-500/40' : 'bg-red-500/25 text-red-300 border-red-500/40'
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
                  <div key={doc.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between text-xs hover:border-slate-700 transition-all">
                    <div>
                      <div className="font-black text-base text-white">👨‍⚕️ {doc.name}</div>
                      <div className="text-slate-300 font-semibold mt-0.5">{doc.specialty} • Contact: {doc.phone || 'Ext. 401'}</div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase border ${
                      doc.status === 'ON_DUTY' || doc.status === 'AVAILABLE' ? 'bg-emerald-500/25 text-emerald-300 border-emerald-500/40' : 'bg-amber-500/25 text-amber-300 border-amber-500/40'
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
          <UniversalSharedMap height="h-[580px]" />
        </div>

      </div>

    </div>
  );
};
