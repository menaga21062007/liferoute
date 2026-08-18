import React from 'react';
import { useApp } from '../context/AppContext';
import { SharedMap } from './SharedMap';
import {
  HeartPulse,
  Ambulance,
  Building2,
  TrafficCone,
  Bed,
  Activity,
  ArrowRight,
  CheckCircle2,
  ShieldAlert,
  Zap,
  Play,
  Navigation,
  Clock,
  UserCheck,
  Stethoscope,
  ChevronRight,
  Radio,
  Sliders,
  Sparkles,
  MapPin
} from 'lucide-react';

export const LandingPage = ({ onLaunchDemo, onLogin }) => {
  const { setActiveRole } = useApp();

  const handleLaunch = () => {
    if (onLaunchDemo) onLaunchDemo();
    else setActiveRole('command');
  };

  const handleHowItWorks = () => {
    const el = document.getElementById('how-it-works');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#071225] text-slate-100 font-sans selection:bg-brand-blue selection:text-white overflow-x-hidden">
      
      {/* HEADER / NAVIGATION */}
      <header className="sticky top-0 z-50 bg-[#071225]/85 backdrop-blur-xl border-b border-slate-800/80 px-6 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={handleLaunch}>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-brand-blue via-blue-600 to-brand-red flex items-center justify-center shadow-lg shadow-brand-red/20 ring-2 ring-white/10 group-hover:scale-105 transition-transform">
              <HeartPulse className="h-6 w-6 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight text-white">LifeRoute</span>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase flex items-center space-x-1">
                  <Sparkles className="h-3 w-3 animate-spin text-emerald-400" />
                  <span>DEMO v3.0</span>
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Smart Response Simulation</p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center space-x-8 text-xs font-semibold text-slate-300">
            <a href="#home" className="hover:text-white transition-colors">Home</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#modules" className="hover:text-white transition-colors">Modules</a>
            <a href="#preview" className="hover:text-white transition-colors">Live Map</a>
            <a href="#demo-flow" className="hover:text-white transition-colors">Demo Timeline</a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onLogin || handleLaunch}
              className="text-xs font-bold text-slate-300 hover:text-white px-3.5 py-2 rounded-xl transition-colors"
            >
              Login
            </button>
            <button
              onClick={handleLaunch}
              className="bg-gradient-to-r from-brand-blue to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-brand-blue/30 flex items-center space-x-1.5 transition-all transform hover:-translate-y-0.5 active:scale-95"
            >
              <span>Launch Demo</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

        </div>
      </header>

      {/* HERO SECTION WITH FULL-SCREEN BACKGROUND IMAGE & DARK NAVY OVERLAY */}
      <section
        id="home"
        className="relative min-h-[90vh] flex items-center py-20 px-6 overflow-hidden"
        style={{
          backgroundImage: "url('/images/hospital-emergency.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Dark Navy 90-degree Gradient Overlay */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background: 'linear-gradient(90deg, rgba(7, 18, 37, 0.95) 0%, rgba(7, 18, 37, 0.85) 50%, rgba(7, 18, 37, 0.45) 100%)'
          }}
        />
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#071225] via-transparent to-[#071225]/70" />

        <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Darker background side for crisp text readability */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 rounded-full text-xs font-black text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span>SIMULATED EMERGENCY NETWORK • DEMO MODE</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-none">
              Every Second Matters.<br />
              <span className="bg-gradient-to-r from-brand-red via-red-400 to-emerald-400 bg-clip-text text-transparent">
                Every Route Saves a Life.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-medium leading-relaxed max-w-2xl">
              LifeRoute is a unified ambulance tracking, hospital resource, bed-management, and virtual green-corridor simulation platform built for emergency-response demonstrations.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={handleLaunch}
                className="bg-gradient-to-r from-brand-red to-red-600 hover:from-red-600 hover:to-red-700 text-white font-black text-sm px-7 py-3.5 rounded-xl shadow-xl shadow-red-600/30 flex items-center space-x-2 transition-all transform hover:-translate-y-0.5 active:scale-95"
              >
                <Play className="h-4 w-4 fill-white" />
                <span>Launch Demo Dashboard</span>
              </button>

              <button
                onClick={handleHowItWorks}
                className="bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 font-extrabold text-sm px-7 py-3.5 rounded-xl transition-all"
              >
                <span>Explore How It Works</span>
              </button>
            </div>

            {/* Trust / Feature Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-800/80 max-w-2xl">
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Simulated GPS</span>
              </div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Virtual Signal Radar</span>
              </div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Live Bed Management</span>
              </div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Real-Time Demo Sync</span>
              </div>
            </div>

          </div>

          {/* Right Column: Floating Glass Dashboard Card */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900/85 backdrop-blur-xl border border-slate-700/80 p-6 rounded-3xl shadow-2xl space-y-5 relative group animate-float">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Live System Status</div>
                  <h3 className="text-lg font-black text-white">Emergency Network Monitor</h3>
                </div>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-black px-2.5 py-1 rounded-full uppercase flex items-center space-x-1">
                  <Radio className="h-3 w-3 animate-pulse" />
                  <span>SIMULATION ACTIVE</span>
                </span>
              </div>

              {/* Fictional Metrics Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 hover:border-brand-red/60 transition-all">
                  <div className="flex items-center space-x-2 text-brand-red text-xs font-bold mb-1">
                    <Ambulance className="h-4 w-4 animate-bounce" />
                    <span>Active Units</span>
                  </div>
                  <div className="text-2xl font-black text-white">02 <span className="text-xs text-slate-400 font-normal">En-Route</span></div>
                </div>

                <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 hover:border-emerald-500/60 transition-all">
                  <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold mb-1">
                    <Bed className="h-4 w-4" />
                    <span>Free ER Beds</span>
                  </div>
                  <div className="text-2xl font-black text-white">14 <span className="text-xs text-slate-400 font-normal">Available</span></div>
                </div>

                <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 hover:border-blue-400/60 transition-all">
                  <div className="flex items-center space-x-2 text-blue-400 text-xs font-bold mb-1">
                    <Activity className="h-4 w-4" />
                    <span>Free ICU Beds</span>
                  </div>
                  <div className="text-2xl font-black text-white">03 <span className="text-xs text-slate-400 font-normal">Ready</span></div>
                </div>

                <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 hover:border-amber-400/60 transition-all">
                  <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold mb-1">
                    <TrafficCone className="h-4 w-4" />
                    <span>Green Corridor</span>
                  </div>
                  <div className="text-2xl font-black text-white">01 <span className="text-xs text-slate-400 font-normal">Active</span></div>
                </div>
              </div>

              {/* Route Progress Preview */}
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <Navigation className="h-4 w-4 text-emerald-400 animate-pulse" />
                  <span className="font-bold text-white">AMB-101 → Metropolitan Hospital</span>
                </div>
                <span className="font-mono text-emerald-400 font-extrabold text-xs">ETA ~4m</span>
              </div>

              <button
                onClick={handleLaunch}
                className="w-full bg-brand-blue hover:bg-blue-700 text-white font-extrabold text-xs py-3 rounded-xl shadow-lg flex items-center justify-center space-x-2 transition-all transform hover:scale-[1.01]"
              >
                <span>OPEN INTERACTIVE DEMO SYSTEM</span>
                <ChevronRight className="h-4 w-4" />
              </button>

            </div>
          </div>

        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-20 px-6 bg-slate-900/60 border-t border-b border-slate-800/80 relative">
        <div className="max-w-7xl mx-auto space-y-12 relative z-10">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="bg-blue-500/10 text-blue-400 border border-blue-500/30 text-xs font-extrabold px-3 py-1 rounded-full uppercase">
              End-to-End Coordination
            </span>
            <h2 className="text-3xl font-black text-white">How LifeRoute Operates</h2>
            <p className="text-slate-400 text-sm font-medium">
              Synchronized 4-step workflow connecting the ambulance crew, AI hospital selection, bed allocation, and virtual traffic corridors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-4 hover:border-brand-red transition-all transform hover:-translate-y-1">
              <div className="h-12 w-12 rounded-2xl bg-brand-red/20 text-brand-red border border-brand-red/40 flex items-center justify-center font-black text-lg">
                1
              </div>
              <h3 className="font-black text-white text-base">Ambulance Crew Intake</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                Paramedic crew inputs patient demographics, emergency severity category, and live vitals telemetry.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-4 hover:border-blue-500 transition-all transform hover:-translate-y-1">
              <div className="h-12 w-12 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/40 flex items-center justify-center font-black text-lg">
                2
              </div>
              <h3 className="font-black text-white text-base">AI Hospital Match</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                System evaluates distance, free ICU beds/OTs, and specialty capability (e.g. Cardiac, Trauma) to recommend top hospital.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-4 hover:border-emerald-500 transition-all transform hover:-translate-y-1">
              <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-black text-lg">
                3
              </div>
              <h3 className="font-black text-white text-base">Resource Reservation</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                Hospital ER dashboard automatically reserves an ICU Bed and Operating Theater (OT) before ambulance arrival.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-4 hover:border-amber-500 transition-all transform hover:-translate-y-1">
              <div className="h-12 w-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-black text-lg">
                4
              </div>
              <h3 className="font-black text-white text-base">Virtual Green Corridor</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                Proximity radar detects ambulance within 300m and automatically triggers virtual traffic signals to GREEN.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* CORE MODULES SECTION WITH BACKGROUND IMAGES */}
      <section id="modules" className="py-20 px-6 max-w-7xl mx-auto space-y-12">
        
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-extrabold px-3 py-1 rounded-full uppercase">
            Platform Capabilities
          </span>
          <h2 className="text-3xl font-black text-white">Four Integrated Modules</h2>
          <p className="text-slate-400 text-sm font-medium">
            Designed for seamless role-based presentation switching during demonstrations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Module 1 */}
          <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl group hover:border-brand-red transition-all">
            <img
              src="https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80"
              alt="Ambulance Night Dispatch"
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
            />
            <div className="relative z-10 p-7 bg-gradient-to-t from-slate-950 via-slate-950/90 to-slate-950/60 space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-brand-red/30 text-white border border-brand-red/50">
                  <Ambulance className="h-6 w-6" />
                </div>
                <span className="text-[10px] font-black text-brand-red bg-brand-red/20 border border-brand-red/40 px-2.5 py-0.5 rounded-full uppercase">
                  Module 01
                </span>
              </div>
              <h3 className="text-xl font-black text-white">Ambulance Application</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                Mobile-first intake app featuring patient registration forms, severity scoring, live vitals telemetry (HR, BP, SpO2, ECG pattern), and simulated GPS route tracking.
              </p>
              <div className="pt-2 flex items-center space-x-2 text-xs text-emerald-400 font-bold">
                <CheckCircle2 className="h-4 w-4" />
                <span>Simulated GPS & Live Telemetry Stream</span>
              </div>
            </div>
          </div>

          {/* Module 2 */}
          <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl group hover:border-brand-blue transition-all">
            <img
              src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80"
              alt="Hospital ER Trauma Bay"
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
            />
            <div className="relative z-10 p-7 bg-gradient-to-t from-slate-950 via-slate-950/90 to-slate-950/60 space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-brand-blue/30 text-white border border-brand-blue/50">
                  <Building2 className="h-6 w-6" />
                </div>
                <span className="text-[10px] font-black text-blue-400 bg-blue-500/20 border border-blue-500/40 px-2.5 py-0.5 rounded-full uppercase">
                  Module 02
                </span>
              </div>
              <h3 className="text-xl font-black text-white">Hospital ER Coordination</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                Real-time incoming ambulance queue, patient lifecycle status progression, countdown ETAs, and 1-click staff actions (*Team Ready, Patient Received*).
              </p>
              <div className="pt-2 flex items-center space-x-2 text-xs text-emerald-400 font-bold">
                <CheckCircle2 className="h-4 w-4" />
                <span>Incoming Queue & ER Status Updates</span>
              </div>
            </div>
          </div>

          {/* Module 3 */}
          <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl group hover:border-emerald-500 transition-all">
            <img
              src="https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=800&q=80"
              alt="Hospital Bed Ward"
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
            />
            <div className="relative z-10 p-7 bg-gradient-to-t from-slate-950 via-slate-950/90 to-slate-950/60 space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-emerald-500/30 text-white border border-emerald-500/50">
                  <Bed className="h-6 w-6" />
                </div>
                <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 rounded-full uppercase">
                  Module 03
                </span>
              </div>
              <h3 className="text-xl font-black text-white">Bed & Resource Management</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                Visual bed board (Emergency, ICU, Ward), Operating Theater (OT) scheduling, doctor roster load balancing, and real-time audit activity log timeline.
              </p>
              <div className="pt-2 flex items-center space-x-2 text-xs text-emerald-400 font-bold">
                <CheckCircle2 className="h-4 w-4" />
                <span>Visual Bed Board & OT Scheduling</span>
              </div>
            </div>
          </div>

          {/* Module 4 */}
          <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl group hover:border-amber-500 transition-all">
            <img
              src="https://images.unsplash.com/photo-1508873696983-2df515122519?auto=format&fit=crop&w=800&q=80"
              alt="City Night Traffic Signals"
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
            />
            <div className="relative z-10 p-7 bg-gradient-to-t from-slate-950 via-slate-950/90 to-slate-950/60 space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-amber-500/30 text-white border border-amber-500/50">
                  <TrafficCone className="h-6 w-6" />
                </div>
                <span className="text-[10px] font-black text-amber-400 bg-amber-500/20 border border-amber-500/40 px-2.5 py-0.5 rounded-full uppercase">
                  Demo Only
                </span>
              </div>
              <h3 className="text-xl font-black text-white">Virtual Traffic Simulation</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                Proximity radar automation detecting ambulances within 300m to trigger virtual green corridors with countdown timers (30s) and manual force green/red overrides.
              </p>
              <div className="pt-2 flex items-center space-x-2 text-xs text-amber-400 font-bold">
                <CheckCircle2 className="h-4 w-4 text-amber-400" />
                <span>Virtual Corridor Timers & Manual Overrides</span>
              </div>
            </div>
          </div>

        </div>

      </section>

      {/* LIVE SHARED MAP PREVIEW SECTION */}
      <section id="preview" className="py-16 px-6 max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="bg-brand-blue/20 text-brand-lightBlue border border-brand-blue/40 text-xs font-extrabold px-3 py-1 rounded-full uppercase">
            Universal Map Engine
          </span>
          <h2 className="text-3xl font-black text-white">Interactive Live Shared Map</h2>
          <p className="text-slate-400 text-sm font-medium">
            Shared coordinate system rendering moving ambulances, hospitals with bed status rings, and virtual traffic corridors in real-time.
          </p>
        </div>

        <SharedMap height="h-[480px]" />
      </section>

      {/* DEMO FLOW TIMELINE SECTION */}
      <section id="demo-flow" className="py-20 px-6 bg-slate-900/60 border-t border-b border-slate-800">
        <div className="max-w-7xl mx-auto space-y-10">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-extrabold px-3 py-1 rounded-full uppercase">
              Presentation Workflow
            </span>
            <h2 className="text-3xl font-black text-white">Sample Demonstration Lifecycle</h2>
            <p className="text-slate-400 text-sm font-medium">
              Step through the full operational scenario during live presentation demonstrations.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-extrabold">
            {['Patient Registered', 'Hospital Selected', 'Bed Reserved', 'Ambulance En Route', 'Virtual Signal Green', 'Patient Arrives', 'Treatment Begins', 'Resources Released'].map((step, idx) => (
              <React.Fragment key={step}>
                <div className="bg-slate-950 border border-slate-800 text-slate-200 px-3.5 py-2 rounded-xl flex items-center space-x-1.5 shadow transform hover:scale-105 transition-transform">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{step}</span>
                </div>
                {idx < 7 && <ChevronRight className="h-4 w-4 text-slate-600 hidden sm:inline" />}
              </React.Fragment>
            ))}
          </div>

        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden border border-blue-500/40 shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=1920&q=80"
            alt="Emergency Vehicle Night Lights"
            className="absolute inset-0 w-full h-full object-cover object-center animate-pulse-glow"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-blue/95 via-slate-950/90 to-slate-950/95" />

          <div className="relative z-10 p-10 md:p-14 text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Ready to Experience the LifeRoute Demo?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base font-medium max-w-2xl mx-auto leading-relaxed">
              Explore the complete simulated emergency response flow from ambulance dispatch to hospital treatment.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                onClick={handleLaunch}
                className="bg-brand-red hover:bg-red-600 text-white font-black text-sm px-8 py-3.5 rounded-xl shadow-xl shadow-red-600/30 flex items-center space-x-2 transition-all transform hover:scale-105 active:scale-95"
              >
                <span>Start Interactive Demo</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={onLogin || handleLaunch}
                className="bg-slate-950/90 hover:bg-slate-900 text-white border border-slate-700 font-extrabold text-sm px-8 py-3.5 rounded-xl transition-all"
              >
                <span>Sign In with Quick Roles</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-900 bg-slate-950 py-12 px-6 text-slate-400 text-xs font-medium">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center space-x-2">
              <div className="h-7 w-7 rounded-lg bg-brand-blue flex items-center justify-center text-white">
                <HeartPulse className="h-4 w-4" />
              </div>
              <span className="font-extrabold text-base text-white">LifeRoute</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Academic & demonstration simulation platform for ambulance tracking, AI hospital routing, and virtual green-corridor traffic control.
            </p>
          </div>

          <div className="space-y-2">
            <div className="font-extrabold text-white uppercase text-[10px] tracking-wider">Quick Navigation</div>
            <ul className="space-y-1 text-slate-400">
              <li><a href="#home" className="hover:text-white">Home Overview</a></li>
              <li><a href="#how-it-works" className="hover:text-white">How It Works</a></li>
              <li><a href="#modules" className="hover:text-white">System Modules</a></li>
              <li><a href="#demo-flow" className="hover:text-white">Demo Timeline</a></li>
            </ul>
          </div>

          <div className="space-y-2">
            <div className="font-extrabold text-white uppercase text-[10px] tracking-wider">Legal & Disclaimer</div>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              LifeRoute is an academic demonstration platform. It does not control real emergency vehicles, hospital equipment, traffic signals, or public infrastructure.
            </p>
          </div>

        </div>

        <div className="max-w-7xl mx-auto border-t border-slate-900 mt-8 pt-6 text-center text-slate-600">
          © 2026 LifeRoute Demo Platform • Educational Simulation Model
        </div>
      </footer>

    </div>
  );
};
