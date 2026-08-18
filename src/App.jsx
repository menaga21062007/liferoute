import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LandingPage } from './components/LandingPage';
import { Navbar } from './components/Navbar';
import { LoginPage } from './components/LoginPage';
import { CommandCenter } from './components/CommandCenter';
import { AmbulanceView } from './components/AmbulanceView';
import { HospitalView } from './components/HospitalView';
import { HospitalManagementModule } from './components/HospitalManagementModule';
import { TrafficView } from './components/TrafficView';
import { TripHistoryView } from './components/TripHistoryView';
import { DemoControlsPanel } from './components/DemoControlsPanel';

const MainLayout = () => {
  const [viewMode, setViewMode] = useState('landing');
  const { activeRole } = useApp();
  const { user } = useAuth();

  if (viewMode === 'landing') {
    return (
      <LandingPage
        onLaunchDemo={() => setViewMode('dashboard')}
        onLogin={() => setViewMode('login')}
      />
    );
  }

  if (viewMode === 'login' || (!user && viewMode === 'dashboard')) {
    return (
      <LoginPage
        onLoginSuccess={() => setViewMode('dashboard')}
        onBackToLanding={() => setViewMode('landing')}
      />
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col bg-[#071225] text-slate-100 selection:bg-brand-blue selection:text-white pb-16 relative overflow-x-hidden"
      style={{
        backgroundImage: "url('/images/hospital-emergency.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Exact Same 90-Degree Dark Navy Overlay as the Landing Page */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: 'linear-gradient(90deg, rgba(7, 18, 37, 0.95) 0%, rgba(7, 18, 37, 0.85) 50%, rgba(7, 18, 37, 0.45) 100%)'
        }}
      />
      <div className="fixed inset-0 bg-gradient-to-t from-[#071225] via-transparent to-[#071225]/70 pointer-events-none z-0" />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar onOpenLanding={() => setViewMode('landing')} />

        <main className="flex-1 py-4">
          {activeRole === 'command' && <CommandCenter />}
          {activeRole === 'ambulance' && <AmbulanceView />}
          {activeRole === 'hospital' && <HospitalView />}
          {activeRole === 'management' && <HospitalManagementModule />}
          {activeRole === 'traffic' && <TrafficView />}
          {activeRole === 'history' && <TripHistoryView />}
        </main>

        <DemoControlsPanel />

        <footer className="border-t border-slate-900 bg-slate-950/90 backdrop-blur py-3 text-center text-xs text-slate-500 font-medium">
          LifeRoute Emergency Response & Smart Traffic Platform
        </footer>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <MainLayout />
      </AppProvider>
    </AuthProvider>
  );
}
