import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SharedMap } from './SharedMap';
import { VitalsMonitor } from './VitalsMonitor';
import { Ambulance, Building2, Zap, Radio, Activity, CheckCircle2, TrendingUp, Compass, ShieldAlert, Sparkles } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export const CommandCenter = () => {
  const { ambulances, hospitals, activityLogs, predictiveAnalytics, dispatchNextRequest } = useApp();
  const [focusedAmbulanceId, setFocusedAmbulanceId] = useState(null);

  const activeAmbulance = ambulances.find((a) => a.status === 'EN_ROUTE') || ambulances[0];
  const peakData = predictiveAnalytics?.hourlySurge || predictiveAnalytics?.peakHours || [];
  const prepositionList = predictiveAnalytics?.recommendedPrepositioning || [];


  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6 animate-fade-in text-slate-100 font-sans">
      
      {/* Top Banner: Predictive AI Dispatch Recommendation Alert */}
      <div className="bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/80 border border-purple-800/60 p-4 rounded-3xl backdrop-blur-md shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/40">
            <Sparkles className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-extrabold text-base text-white">Predictive Emergency Intelligence & Fleet Optimization</h2>
              <span className="bg-rose-950 text-rose-300 border border-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                Rush Hour Peak Surge Warning
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium mt-0.5">
              Forecast predicts peak incident probability at 18:00 (22 incidents/hr). Pre-positioning AMB-101 recommended at TS-01.
            </p>
          </div>
        </div>

        <button
          onClick={dispatchNextRequest}
          className="bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-purple-600/30 flex items-center space-x-2 transition-all transform hover:-translate-y-0.5 active:scale-95"
        >
          <Zap className="h-4 w-4 fill-white" />
          <span>EXECUTE OPTIMAL PRE-POSITIONING</span>
        </button>
      </div>

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

          {/* AI Pre-positioning Recommendation Cards */}
          <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-5 rounded-3xl shadow-2xl space-y-4">
            <div className="flex items-center space-x-2.5 border-b border-slate-800 pb-3">
              <Compass className="h-5 w-5 text-purple-400" />
              <span className="font-black text-white text-sm">Standby Pre-positioning</span>
            </div>

            <div className="space-y-3">
              {prepositionList.map((item) => (
                <div key={item.id} className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between font-bold text-white">
                    <span>📍 {item.locationName}</span>
                    <span className="text-purple-400 font-extrabold">{item.probabilityScore}% Risk</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{item.reason}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center: Universal Live Shared Map + Predictive Area Chart */}
        <div className="lg:col-span-2 space-y-4">
          <SharedMap focusedEntityId={focusedAmbulanceId} height="h-[430px]" />

          {/* Recharts Peak Hours Forecast */}
          <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-4 rounded-3xl shadow-2xl space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-extrabold text-white">
                <TrendingUp className="h-4 w-4 text-purple-400" />
                <span>24-Hour Emergency Incident Surge Prediction</span>
              </div>
              <span className="text-[10px] font-bold text-purple-300">LSTM FREQUENCY FORECAST</span>
            </div>

            <div className="h-32 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={peakData}>
                  <defs>
                    <linearGradient id="surgeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="hour" stroke="#64748B" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }} />
                  <Area type="monotone" dataKey="incidents" stroke="#A78BFA" strokeWidth={2} fillOpacity={1} fill="url(#surgeGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
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

