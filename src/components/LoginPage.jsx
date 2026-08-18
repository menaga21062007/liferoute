import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { HeartPulse, Ambulance, Building2, TrafficCone, ShieldCheck, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';

export const LoginPage = ({ onLoginSuccess, onBackToLanding }) => {
  const { login, quickRoleLogin } = useAuth();
  const { setActiveRole } = useApp();

  const [email, setEmail] = useState('admin@liferoute.org');
  const [password, setPassword] = useState('demo1234');

  const handleSubmit = (e) => {
    e.preventDefault();
    const res = login(email, password);
    if (res.user) {
      setActiveRole(res.user.role);
      if (onLoginSuccess) onLoginSuccess();
    }
  };

  const handleQuickRole = (role) => {
    quickRoleLogin(role);
    setActiveRole(role);
    if (onLoginSuccess) onLoginSuccess();
  };

  return (
    <div className="min-h-screen bg-[#071225] flex flex-col items-center justify-center p-4 relative overflow-hidden text-slate-100">
      
      {/* Ambient background lights with animation */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[32rem] h-[32rem] bg-brand-blue/20 rounded-full blur-3xl animate-pulse-glow pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-brand-red/15 rounded-full blur-3xl animate-pulse-glow pointer-events-none" />

      {onBackToLanding && (
        <button
          onClick={onBackToLanding}
          className="absolute top-6 left-6 text-xs font-bold text-slate-400 hover:text-white flex items-center space-x-1 bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-800 transition-all hover:border-slate-700"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Landing Page</span>
        </button>
      )}

      <div className="max-w-md w-full space-y-6 relative z-10 animate-scale-up">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-tr from-brand-blue via-blue-600 to-brand-red shadow-2xl shadow-brand-red/30 ring-4 ring-white/10 mb-1 animate-float">
            <HeartPulse className="h-9 w-9 text-white animate-pulse" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">LifeRoute</h1>
          <p className="text-xs font-bold text-emerald-400 flex items-center justify-center space-x-1">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400 animate-spin" />
            <span>Interactive Demo Authentication</span>
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 p-6 rounded-3xl shadow-2xl space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">User Email / Credentials</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm font-semibold text-white focus:outline-none focus:border-brand-blue transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm font-semibold text-white focus:outline-none focus:border-brand-blue transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-brand-blue hover:bg-blue-700 text-white font-extrabold py-3 rounded-xl shadow-lg shadow-brand-blue/30 flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5 active:scale-95"
            >
              <span>SIGN IN TO DISPATCH SYSTEM</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Quick Demo Role Selector */}
          <div className="pt-3 border-t border-slate-800 space-y-3">
            <div className="text-center text-xs font-extrabold text-slate-400 uppercase tracking-wider">
              ⚡ Presentation Quick Role Login
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleQuickRole('ambulance')}
                className="bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-brand-red/60 p-2.5 rounded-xl text-left transition-all group transform hover:-translate-y-0.5"
              >
                <div className="flex items-center space-x-2 text-brand-red font-bold text-xs">
                  <Ambulance className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span>Ambulance</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Crew Intake App</div>
              </button>

              <button
                onClick={() => handleQuickRole('hospital')}
                className="bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-blue-400/60 p-2.5 rounded-xl text-left transition-all group transform hover:-translate-y-0.5"
              >
                <div className="flex items-center space-x-2 text-blue-400 font-bold text-xs">
                  <Building2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span>Hospital</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">ER Bed & OT Board</div>
              </button>

              <button
                onClick={() => handleQuickRole('traffic')}
                className="bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-emerald-400/60 p-2.5 rounded-xl text-left transition-all group transform hover:-translate-y-0.5"
              >
                <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs">
                  <TrafficCone className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span>Traffic</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Green Corridor Radar</div>
              </button>

              <button
                onClick={() => handleQuickRole('command')}
                className="bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-400/60 p-2.5 rounded-xl text-left transition-all group transform hover:-translate-y-0.5"
              >
                <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs">
                  <ShieldCheck className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span>Admin</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Master Overview</div>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
