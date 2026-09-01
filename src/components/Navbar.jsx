import React from 'react';
import { useApp } from '../context/AppContext';
import {
  AlertCircle,
  PhoneCall,
  Ambulance,
  Building2,
  TrafficCone,
  HeartPulse,
  Sparkles,
  Phone
} from 'lucide-react';

export const Navbar = () => {
  const { activeRole, setActiveRole } = useApp();

  const roles = [
    { id: 'sos', label: '1. Patient Emergency', icon: AlertCircle },

    { id: 'callcentre', label: '2. Call Centre', icon: PhoneCall },
    { id: 'ambulance', label: '3. Ambulance Crew', icon: Ambulance },
    { id: 'hospital', label: '4. Hospital Desk', icon: Building2 },
    { id: 'corridor', label: '5. Green Corridor', icon: TrafficCone }
  ];

  return (
    <header className="bg-[#064e3b] border-b-2 border-emerald-500 text-white sticky top-0 z-50 px-6 py-3 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        
        {/* Brand Logo - WellCare / LifeRoute Emergency Center */}
        <div
          className="flex items-center space-x-3 cursor-pointer group"
          onClick={() => setActiveRole('sos')}
        >
          <div className="h-10 w-10 rounded-xl bg-emerald-600 border border-emerald-400 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <HeartPulse className="h-6 w-6 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-xl tracking-tight text-white font-serif">LifeRoute</span>
              <span className="bg-emerald-800 text-emerald-200 border border-emerald-500 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase flex items-center space-x-1">
                <Sparkles className="h-3 w-3 text-emerald-300" />
                <span>WellCare Emergency</span>
              </span>
            </div>
            <p className="text-[11px] text-emerald-200 font-medium">Emergency Response & Medical Center</p>
          </div>
        </div>

        {/* Role Navigation Switcher */}
        <div className="flex flex-wrap items-center bg-[#043e2f] p-1.5 rounded-xl border border-emerald-700/80 gap-1 shadow-inner">
          {roles.map((role) => {
            const Icon = role.icon;
            const isActive = activeRole === role.id;
            return (
              <button
                key={role.id}
                onClick={() => setActiveRole(role.id)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow ring-2 ring-emerald-300'
                    : 'text-emerald-200 hover:text-white hover:bg-emerald-800'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-emerald-300'}`} />
                <span>{role.label}</span>
              </button>
            );
          })}
        </div>

        {/* Quick Phone Action */}
        <div className="hidden lg:flex items-center space-x-2 bg-emerald-800/80 border border-emerald-600/80 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white shadow">
          <Phone className="h-4 w-4 text-emerald-300 animate-bounce" />
          <span>Toll-Free Emergency: <span className="text-emerald-200 font-black">108 / 123-456-7890</span></span>
        </div>

      </div>
    </header>
  );
};
