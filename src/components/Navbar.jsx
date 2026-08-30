import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Activity,
  Ambulance,
  Building2,
  TrafficCone,
  Film,
  Bed,
  PhoneCall,
  AlertCircle,
  HeartPulse,
  Sparkles,
  Phone,
  Home
} from 'lucide-react';

export const Navbar = ({ onOpenLanding }) => {
  const { activeRole, setActiveRole } = useApp();

  const roles = [
    { id: 'intelligence', label: 'Command Center', icon: Activity },
    { id: 'ambulance', label: 'Ambulance HUD', icon: Ambulance },
    { id: 'hospital', label: 'Hospital Marketplace', icon: Building2 },
    { id: 'traffic', label: 'Traffic Control', icon: TrafficCone },
    { id: 'replay', label: 'Incident Replay', icon: Film },
    { id: 'management', label: 'Bed Board', icon: Bed },
    { id: 'callcentre', label: 'Call Centre', icon: PhoneCall },
    { id: 'sos', label: 'Patient SOS', icon: AlertCircle },
    { id: 'corridor', label: 'Corridor Demo', icon: TrafficCone }
  ];

  return (
    <header className="bg-[#064e3b] border-b-2 border-emerald-500 text-white sticky top-0 z-50 px-4 py-2.5 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        
        {/* Brand Logo */}
        <div
          className="flex items-center space-x-3 cursor-pointer group shrink-0"
          onClick={() => {
            if (onOpenLanding) onOpenLanding();
            else setActiveRole('intelligence');
          }}
        >
          <div className="h-9 w-9 rounded-xl bg-emerald-600 border border-emerald-400 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <HeartPulse className="h-5 w-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg tracking-tight text-white font-serif">LifeRoute</span>
              <span className="bg-emerald-800 text-emerald-200 border border-emerald-500 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase flex items-center space-x-1">
                <Sparkles className="h-3 w-3 text-emerald-300" />
                <span>Unified Platform</span>
              </span>
            </div>
            <p className="text-[10px] text-emerald-200 font-medium">Emergency Command & Healthcare Suite</p>
          </div>
        </div>

        {/* All Dashboard Roles Navigation */}
        <div className="flex flex-wrap items-center bg-[#043e2f] p-1 rounded-xl border border-emerald-700/80 gap-1 shadow-inner overflow-x-auto">
          {onOpenLanding && (
            <button
              onClick={onOpenLanding}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-bold text-emerald-200 hover:text-white hover:bg-emerald-800 transition-all border-r border-emerald-700 pr-2.5 mr-0.5"
            >
              <Home className="h-3.5 w-3.5 text-emerald-300" />
              <span>Portal</span>
            </button>
          )}

          {roles.map((role) => {
            const Icon = role.icon;
            const isActive = activeRole === role.id;
            return (
              <button
                key={role.id}
                onClick={() => setActiveRole(role.id)}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow ring-2 ring-emerald-300'
                    : 'text-emerald-200 hover:text-white hover:bg-emerald-800'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-white' : 'text-emerald-300'}`} />
                <span>{role.label}</span>
              </button>
            );
          })}
        </div>

        {/* Emergency Toll-Free Badge */}
        <div className="hidden xl:flex items-center space-x-2 bg-emerald-800/80 border border-emerald-600/80 px-3 py-1 rounded-xl text-xs font-bold text-white shadow shrink-0">
          <Phone className="h-3.5 w-3.5 text-emerald-300 animate-bounce" />
          <span>Toll-Free: <span className="text-emerald-200 font-black">108</span></span>
        </div>

      </div>
    </header>
  );
};
