import React from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import {
  Ambulance,
  Building2,
  TrafficCone,
  LayoutDashboard,
  Play,
  Pause,
  RotateCcw,
  Radio,
  HeartPulse,
  Bed,
  History,
  FileCheck2,
  LogOut,
  User,
  Home,
  Zap
} from 'lucide-react';

export const Navbar = ({ onOpenLanding }) => {
  const {
    activeRole,
    setActiveRole,
    hospitals,
    ambulances,
    trafficSignals,
    isSimulationRunning,
    toggleSimulation,
    resetSimulation
  } = useApp();

  const { user, logout } = useAuth();

  const activeAmbulancesCount = ambulances.filter((a) => a.status === 'EN_ROUTE' || a.status === 'Assigned').length;
  const activeGreenCorridorsCount = trafficSignals.filter((s) => s.mode === 'GREEN_CORRIDOR_ACTIVE' || s.mode === 'EMERGENCY_GREEN').length;
  const totalFreeBeds = hospitals.reduce((sum, h) => sum + (h.availableBeds || 0), 0);

  // Tab Order: Emergency Intelligence -> Command Center -> Ambulance Crew -> Traffic Control -> Hospital ER -> Hospital Admin & Beds -> Trip History & Replay
  const roles = [
    { id: 'intelligence', label: 'Emergency Intelligence', icon: Zap },
    { id: 'command', label: 'Command Center', icon: LayoutDashboard },
    { id: 'ambulance', label: 'Ambulance Crew', icon: Ambulance },
    { id: 'traffic', label: 'Traffic Control', icon: TrafficCone },
    { id: 'hospital', label: 'Hospital ER', icon: Building2 },
    { id: 'management', label: 'Hospital Admin & Beds', icon: FileCheck2 },
    { id: 'history', label: 'Trip History & Replay', icon: History },
  ];

  return (
    <header className="bg-slate-900/95 backdrop-blur border-b border-slate-800 text-white sticky top-0 z-50 px-4 py-2">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        
        {/* Brand Logo & Tagline */}
        <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => setActiveRole('intelligence')}>
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-brand-blue to-brand-red flex items-center justify-center shadow-lg shadow-brand-red/20 ring-2 ring-white/10">
            <HeartPulse className="h-5 w-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-lg tracking-tight text-white">LifeRoute</span>
              <span className="bg-brand-blue/30 text-brand-lightBlue border border-brand-blue/50 text-[9px] font-semibold px-1.5 py-0.2 rounded-full uppercase">
                v3.0 Demo
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">Smart Emergency Response Platform</p>
          </div>
        </div>

        {/* Live Metrics Quick Badges */}
        <div className="hidden xl:flex items-center space-x-2 bg-slate-950/60 p-1.5 rounded-xl border border-slate-800/80 text-xs">
          <div className="flex items-center space-x-1.5 px-2.5 py-0.5 bg-slate-900 rounded-lg border border-slate-800">
            <Ambulance className="h-3.5 w-3.5 text-brand-red animate-bounce" />
            <span><strong className="text-white">{activeAmbulancesCount}</strong> Active Units</span>
          </div>

          <div className="flex items-center space-x-1.5 px-2.5 py-0.5 bg-slate-900 rounded-lg border border-slate-800">
            <TrafficCone className="h-3.5 w-3.5 text-brand-green" />
            <span><strong className="text-brand-green">{activeGreenCorridorsCount}</strong> Green Corridors</span>
          </div>

          <div className="flex items-center space-x-1.5 px-2.5 py-0.5 bg-slate-900 rounded-lg border border-slate-800">
            <Bed className="h-3.5 w-3.5 text-blue-400" />
            <span><strong className="text-white">{totalFreeBeds}</strong> Free ICU Beds</span>
          </div>
        </div>

        {/* Module Nav Tabs */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto">
          {onOpenLanding && (
            <button
              onClick={onOpenLanding}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900 whitespace-nowrap transition-all mr-1 border-r border-slate-800 pr-2"
            >
              <Home className="h-3.5 w-3.5 text-brand-red" />
              <span>Landing Page</span>
            </button>
          )}

          {roles.map((role) => {
            const Icon = role.icon;
            const isActive = activeRole === role.id;
            return (
              <button
                key={role.id}
                onClick={() => setActiveRole(role.id)}
                className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-brand-blue text-white shadow ring-1 ring-blue-400/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="hidden md:inline">{role.label}</span>
              </button>
            );
          })}
        </div>

        {/* User Info & Controls */}
        <div className="flex items-center space-x-2">
          {user && (
            <div className="hidden lg:flex items-center space-x-2 bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800 text-xs">
              <User className="h-3.5 w-3.5 text-blue-400" />
              <div className="text-left">
                <div className="font-bold text-white leading-none text-[11px]">{user.name.split(' ')[0]}</div>
                <div className="text-[9px] text-slate-400 uppercase font-semibold">{user.role}</div>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={toggleSimulation}
              title={isSimulationRunning ? "Pause Simulation" : "Resume Simulation"}
              className={`p-1.5 rounded text-xs transition-colors ${
                isSimulationRunning ? 'text-amber-400 hover:bg-amber-500/20' : 'text-emerald-400 hover:bg-emerald-500/20'
              }`}
            >
              {isSimulationRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            </button>
            <button
              onClick={resetSimulation}
              title="Reset Demo State"
              className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="flex items-center space-x-1 px-2 py-1 rounded-full border bg-emerald-950/60 text-emerald-400 border-emerald-800/80 text-[11px] font-bold">
            <Radio className="h-3 w-3 animate-pulse" />
            <span className="hidden md:inline">SYNC</span>
          </div>

          {user && (
            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-800 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
