import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  CheckCircle2,
  LogOut,
  AlertTriangle,
  Radio,
  Sliders
} from 'lucide-react';

export const DemoControlsPanel = () => {
  const {
    isSimulationRunning,
    toggleSimulation,
    resetSimulation,
    stepCheckpoint,
    simulateArrival,
    simulateDischarge,
    triggerAlert
  } = useApp();

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 p-2 px-3 rounded-2xl shadow-2xl flex items-center space-x-2 text-white">
      
      {/* Demo Badge */}
      <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-xl text-[10px] font-black uppercase tracking-wider">
        <Radio className="h-3 w-3 animate-pulse" />
        <span>DEMO CONTROLS</span>
      </div>

      <div className="h-6 w-px bg-slate-800" />

      {/* Play / Pause */}
      <button
        onClick={toggleSimulation}
        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1 transition-all ${
          isSimulationRunning ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
        }`}
      >
        {isSimulationRunning ? (
          <>
            <Pause className="h-3.5 w-3.5" />
            <span>Pause</span>
          </>
        ) : (
          <>
            <Play className="h-3.5 w-3.5" />
            <span>Resume</span>
          </>
        )}
      </button>

      {/* Step to Next Checkpoint */}
      <button
        onClick={stepCheckpoint}
        title="Advance ambulance to next checkpoint"
        className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-700 rounded-xl text-xs font-extrabold text-blue-400 flex items-center space-x-1 transition-all"
      >
        <SkipForward className="h-3.5 w-3.5" />
        <span>Next Checkpoint</span>
      </button>

      {/* Simulate Arrival */}
      <button
        onClick={simulateArrival}
        title="Simulate ambulance arrival at ER bay"
        className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-700 rounded-xl text-xs font-extrabold text-emerald-400 flex items-center space-x-1 transition-all"
      >
        <CheckCircle2 className="h-3.5 w-3.5" />
        <span>Simulate Arrival</span>
      </button>

      {/* Simulate Patient Discharge */}
      <button
        onClick={simulateDischarge}
        title="Simulate discharge & release reserved beds/OTs"
        className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-700 rounded-xl text-xs font-extrabold text-purple-400 flex items-center space-x-1 transition-all"
      >
        <LogOut className="h-3.5 w-3.5" />
        <span>Simulate Discharge</span>
      </button>

      {/* Reset Simulation */}
      <button
        onClick={resetSimulation}
        title="Reset entire demo state to baseline"
        className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
      >
        <RotateCcw className="h-4 w-4" />
      </button>

    </div>
  );
};
