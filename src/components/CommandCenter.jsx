import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SharedMap } from './SharedMap';
import { VitalsMonitor } from './VitalsMonitor';
import { Ambulance, Building2, Zap, Radio, Activity, CheckCircle2 } from 'lucide-react';

export const CommandCenter = () => {
  const { ambulances, hospitals, activityLogs } = useApp();
  const [focusedAmbulanceId, setFocusedAmbulanceId] = useState(null);

  const activeAmbulance = ambulances.find((a) => a.status === 'EN_ROUTE') || ambulances[0];

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6 animate-fade-in text-slate-100 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Sidebar: Active Fleet & Hospital Capacity */}
        <div className="space-y-5">
          
          {/* Active Fleet Card */}
          <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-5 rounded-3xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/40">
                  <Ambulance className="h-5 w-5 animate-bounce" />
                </div>
                <span className="font-black text-white text-base tracking-tight">Active Fleet ({ambulances.length})</span>
              </div>
              <span className="bg-red-500/20 text-red-300 border border-red-500/40 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                DISPATCH LIVE
              </span>
            </div>

            <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
              {ambulances.map((amb) => {
                const isEnRoute = amb.status === 'EN_ROUTE';
                return (
                  <div
                    key={amb.id}
                    onClick={() => setFocusedAmbulanceId(amb.id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      focusedAmbulanceId === amb.id
                        ? 'bg-slate-950/95 border-brand-blue ring-2 ring-blue-500/40 shadow-xl'
                        : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:scale-[1.01]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-black text-sm text-white flex items-center space-x-2">
                        <span>🚑 {amb.code}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          isEnRoute ? 'bg-red-500/25 text-red-300 border border-red-500/50' : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}>
                          {amb.status}
                        </span>
                      </div>
                      {isEnRoute && <span className="text-xs font-black text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-lg border border-emerald-800">~{amb.etaMinutes}m ETA</span>}
                    </div>
                    {amb.patient && (
                      <div className="mt-2 text-xs text-slate-200 font-bold truncate">
                        {amb.patient.name} • <span className="text-red-400 font-extrabold">{amb.patient.conditionCategory}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Hospital Capacity Card */}
          <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-5 rounded-3xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/40">
                  <Building2 className="h-5 w-5" />
                </div>
                <span className="font-black text-white text-base tracking-tight">Hospital Capacity</span>
              </div>
            </div>

            <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
              {hospitals.map((hosp) => (
                <div key={hosp.id} className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 text-xs space-y-1.5 hover:border-slate-700 transition-colors">
                  <div className="flex items-center justify-between font-black text-white text-xs">
                    <span>🏥 {hosp.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                      hosp.status === 'AVAILABLE' ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/40' : 'bg-amber-500/25 text-amber-300 border border-amber-500/40'
                    }`}>
                      {hosp.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-300 font-semibold pt-1">
                    <span>Beds: <strong className="text-white font-extrabold">{hosp.availableBeds}/{hosp.totalBeds}</strong></span>
                    <span>OTs: <strong className="text-white font-extrabold">{hosp.availableOTs}/{hosp.totalOTs}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center: Universal Live Shared Map */}
        <div className="lg:col-span-2 space-y-4">
          <SharedMap focusedEntityId={focusedAmbulanceId} height="h-[600px]" />
        </div>

        {/* Right Sidebar: Telemetry & Activity Summary */}
        <div className="space-y-5">
          {activeAmbulance && activeAmbulance.patient && (
            <VitalsMonitor patient={activeAmbulance.patient} />
          )}

          {/* Activity Log Summary Card */}
          <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-5 rounded-3xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/40">
                  <Activity className="h-5 w-5" />
                </div>
                <span className="font-black text-white text-base tracking-tight">System Activity Audit Log</span>
              </div>
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {activityLogs && activityLogs.slice(0, 6).map((log) => (
                <div key={log.id} className="bg-slate-950/80 border border-slate-800 p-3 rounded-2xl text-[11px] space-y-1">
                  <div className="flex items-center justify-between font-bold text-white">
                    <span>{log.event}</span>
                    <span className="text-slate-400 font-mono text-[9px]">{log.timestamp}</span>
                  </div>
                  <p className="text-slate-300 font-medium">{log.details}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
