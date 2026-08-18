import React, { useEffect, useState } from 'react';
import { Activity, Heart, Thermometer, Wind, AlertCircle } from 'lucide-react';

export const VitalsMonitor = ({ patient }) => {
  const [heartRate, setHeartRate] = useState(patient?.heartRate || 117);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeartRate((prev) => Math.max(90, Math.min(135, prev + Math.floor(Math.random() * 5) - 2)));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-5 rounded-3xl shadow-2xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            <Activity className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-black text-white text-base tracking-tight">Live Telemetry Stream</h3>
            <p className="text-xs text-slate-300 font-semibold">{patient?.name || 'Patient'} ({patient?.conditionCategory})</p>
          </div>
        </div>
        <span className="bg-red-500/25 text-red-300 border border-red-500/50 text-[10px] font-black px-2.5 py-1 rounded-full uppercase flex items-center space-x-1">
          <AlertCircle className="h-3.5 w-3.5 text-red-400 animate-bounce" />
          <span>CRITICAL STREAM</span>
        </span>
      </div>

      {/* ECG Pattern Monitor Canvas simulation */}
      <div className="bg-slate-950/90 border border-slate-800 p-4 rounded-2xl space-y-2">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
          <span>ECG LEAD II (1mV/10mm)</span>
          <span className="text-emerald-400 font-mono">STEMI Confirmed</span>
        </div>
        
        {/* Animated ECG Pulse Line SVG */}
        <div className="h-16 w-full flex items-center justify-center overflow-hidden">
          <svg className="w-full h-full text-emerald-400" viewBox="0 0 400 60" preserveAspectRatio="none">
            <path
              d="M 0 30 L 40 30 L 50 10 L 60 50 L 70 30 L 120 30 L 130 10 L 140 50 L 150 30 L 200 30 L 210 10 L 220 50 L 230 30 L 280 30 L 290 10 L 300 50 L 310 30 L 400 30"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* Vitals Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-red-400 font-extrabold mb-1">
            <span>HEART RATE</span>
            <Heart className="h-4 w-4 fill-red-500 text-red-500 animate-ping" />
          </div>
          <div className="text-3xl font-black text-white tracking-tight">{heartRate} <span className="text-xs font-bold text-slate-300">BPM</span></div>
          <div className="text-[10px] text-slate-400 font-semibold mt-1">Target: 60-100</div>
        </div>

        <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-blue-400 font-extrabold mb-1">
            <span>BLOOD PRESS.</span>
            <Activity className="h-4 w-4" />
          </div>
          <div className="text-3xl font-black text-white tracking-tight">{patient?.vitals?.bp || '148/94'} <span className="text-xs font-bold text-slate-300">mmHg</span></div>
          <div className="text-[10px] text-amber-400 font-bold mt-1">Sys Elevated</div>
        </div>

        <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-emerald-400 font-extrabold mb-1">
            <span>SPO2 SAT.</span>
            <Wind className="h-4 w-4" />
          </div>
          <div className="text-3xl font-black text-white tracking-tight">{patient?.vitals?.spo2 || '94'} <span className="text-xs font-bold text-slate-300">%</span></div>
          <div className="text-[10px] text-emerald-400 font-bold mt-1">O2 Therapy Req</div>
        </div>

        <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-amber-400 font-extrabold mb-1">
            <span>BODY TEMP</span>
            <Thermometer className="h-4 w-4" />
          </div>
          <div className="text-3xl font-black text-white tracking-tight">{patient?.vitals?.temp || '37.2'} <span className="text-xs font-bold text-slate-300">°C</span></div>
          <div className="text-[10px] text-slate-300 font-bold mt-1">Afebrile</div>
        </div>
      </div>

    </div>
  );
};
