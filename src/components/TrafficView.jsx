import React from 'react';
import { useApp } from '../context/AppContext';
import { SharedMap } from './SharedMap';
import {
  TrafficCone,
  Sliders,
  Zap,
  PlusCircle,
  Radio
} from 'lucide-react';

export const TrafficView = () => {
  const { trafficSignals, toggleTrafficSignal } = useApp();

  const activeGreenCorridors = trafficSignals.filter(s => s.mode === 'GREEN_CORRIDOR_ACTIVE' || s.mode === 'EMERGENCY_GREEN');

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6 animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-5 rounded-3xl flex flex-wrap items-center justify-between gap-4 shadow-2xl">
        <div className="flex items-center space-x-3.5">
          <div className="p-3.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            <TrafficCone className="h-7 w-7 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-2xl font-black text-white tracking-tight">Green Corridor Traffic Signal System</h2>
              <span className="bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 text-xs font-black px-3 py-1 rounded-full uppercase flex items-center space-x-1">
                <Zap className="h-3.5 w-3.5" />
                <span>RADAR AUTOMATION ACTIVE</span>
              </span>
            </div>
            <p className="text-xs text-slate-300 font-semibold mt-0.5">Automatic green light signal corridor activation for approaching emergency ambulances.</p>
          </div>
        </div>

        <div className="bg-slate-950/90 p-3 px-5 rounded-2xl border border-slate-800 shadow-xl">
          <div className="text-[10px] text-slate-400 font-extrabold uppercase">Active Green Corridors</div>
          <div className="text-2xl font-black text-emerald-400">{activeGreenCorridors.length} Intersections</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Signal Cards */}
        <div className="space-y-3">
          <div className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">
            Monitored Intersections ({trafficSignals.length})
          </div>

          {trafficSignals.map((sig) => {
            const isGreen = sig.status === 'GREEN';
            const isCorridorActive = sig.mode === 'GREEN_CORRIDOR_ACTIVE' || sig.mode === 'EMERGENCY_GREEN';

            return (
              <div
                key={sig.id}
                className={`p-4 rounded-3xl border transition-all ${
                  isCorridorActive
                    ? 'bg-slate-950/95 border-emerald-500 ring-2 ring-emerald-500/40 shadow-2xl'
                    : 'bg-slate-900/90 backdrop-blur-md border border-slate-700/80'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex flex-col items-center bg-slate-950 p-2 rounded-2xl border border-slate-800 space-y-1.5 shadow">
                      <div className={`w-4 h-4 rounded-full ${!isGreen ? 'bg-red-500 animate-pulse shadow-red-500/50 shadow' : 'bg-slate-800'}`} />
                      <div className={`w-4 h-4 rounded-full ${isGreen ? 'bg-emerald-400 animate-pulse shadow-emerald-400/50 shadow' : 'bg-slate-800'}`} />
                    </div>

                    <div>
                      <div className="font-black text-base text-white">🚥 {sig.code} - {sig.name}</div>
                      <div className="text-xs text-slate-300 mt-0.5">Mode: <span className="font-extrabold text-white">{sig.mode}</span></div>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider ${isGreen ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/40' : 'bg-red-500/25 text-red-300 border border-red-500/40'}`}>
                    {sig.status}
                  </span>
                </div>

                {isCorridorActive && (
                  <div className="mt-3 bg-emerald-950/80 border border-emerald-700/80 p-3 rounded-2xl text-xs flex items-center justify-between text-emerald-200 shadow-xl">
                    <div className="font-extrabold flex items-center space-x-2">
                      <Zap className="h-4 w-4 text-emerald-400 animate-bounce" />
                      <span>{sig.activeAmbulanceId} Corridor ({sig.distanceToAmbulance}m)</span>
                    </div>
                    <span className="font-mono text-emerald-300 font-black text-base">{sig.countdownSeconds || 30}s</span>
                  </div>
                )}

                {/* Manual Override Controls */}
                <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => toggleTrafficSignal(sig.id, isGreen ? 'RED' : 'GREEN')}
                    className="bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-700 font-black text-xs px-3 py-1.5 rounded-xl flex items-center space-x-1.5 transition-all"
                  >
                    <Sliders className="h-4 w-4 text-brand-blue" />
                    <span>Force {isGreen ? 'RED' : 'GREEN'}</span>
                  </button>

                  {isCorridorActive && (
                    <button
                      onClick={() => toggleTrafficSignal(sig.id, 'GREEN', 15)}
                      className="bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700 font-black text-xs px-3 py-1.5 rounded-xl flex items-center space-x-1.5 transition-all"
                    >
                      <PlusCircle className="h-4 w-4" />
                      <span>+15s Green</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Universal Map View */}
        <div className="lg:col-span-2 space-y-4">
          <SharedMap height="h-[580px]" />
        </div>

      </div>

    </div>
  );
};
