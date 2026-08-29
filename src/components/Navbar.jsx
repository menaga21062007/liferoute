import React from 'react';
import { useApp } from '../context/AppContext';
import {
  AlertCircle,
  PhoneCall,
  Ambulance,
  Building2,
  TrafficCone,
  ShieldAlert
} from 'lucide-react';

export const Navbar = () => {
  const { activeRole, setActiveRole } = useApp();

  const roles = [
    { id: 'sos', label: '1. Patient SOS', icon: AlertCircle },
    { id: 'callcentre', label: '2. Call Centre Operator', icon: PhoneCall },
    { id: 'ambulance', label: '3. Ambulance Crew', icon: Ambulance },
    { id: 'hospital', label: '4. Hospital Desk', icon: Building2 },
    { id: 'corridor', label: '5. Green Corridor Demo', icon: TrafficCone }
  ];

  return (
    <header className="bg-slate-900 border-b-2 border-blue-600 text-white sticky top-0 z-50 px-4 py-3 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        
        {/* Government Header Title */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveRole('sos')}>
          <div className="h-10 w-10 rounded-lg bg-blue-700 border border-blue-400 flex items-center justify-center shadow">
            <ShieldAlert className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg text-white tracking-wide uppercase">LifeRoute</span>
              <span className="bg-blue-800 text-blue-200 border border-blue-500 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                Govt Portal
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium">Government City Emergency Response & Dispatch Network</p>
          </div>
        </div>

        {/* Role Navigation Buttons */}
        <div className="flex flex-wrap items-center bg-slate-950 p-1.5 rounded-lg border border-slate-700 gap-1">
          {roles.map((role) => {
            const Icon = role.icon;
            const isActive = activeRole === role.id;
            return (
              <button
                key={role.id}
                onClick={() => setActiveRole(role.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow ring-2 ring-blue-300'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-blue-400'}`} />
                <span>{role.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};


