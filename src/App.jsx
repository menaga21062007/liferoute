import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LandingPage } from './components/LandingPage';
import { Navbar } from './components/Navbar';
import { LoginPage } from './components/LoginPage';
import { CommandCenter } from './components/CommandCenter';
import { AmbulanceView } from './components/AmbulanceView';
import { HospitalView } from './components/HospitalView';
import { TrafficView } from './components/TrafficView';
import { IncidentReplayView } from './components/IncidentReplayView';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { DemoControlsPanel } from './components/DemoControlsPanel';
import { ToastNotifications } from './components/ToastNotifications';
import { WifiOff } from 'lucide-react';

const MainLayout = () => {
  const [viewMode, setViewMode] = useState('landing');
  const { activeRole, isOfflineMode } = useApp();
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
      {/* 90-Degree Dark Navy Overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: 'linear-gradient(90deg, rgba(7, 18, 37, 0.95) 0%, rgba(7, 18, 37, 0.85) 50%, rgba(7, 18, 37, 0.45) 100%)'
        }}
      />
      <div className="fixed inset-0 bg-gradient-to-t from-[#071225] via-transparent to-[#071225]/70 pointer-events-none z-0" />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar onOpenLanding={() => setViewMode('landing')} />

        {/* Offline Mode Warning Banner */}
        {isOfflineMode && (
          <div className="bg-amber-950/90 border-b border-amber-700/80 px-4 py-1.5 text-center text-xs font-extrabold text-amber-300 flex items-center justify-center space-x-2">
            <WifiOff className="h-4 w-4 text-amber-400 animate-pulse" />
            <span>OFFLINE LOCAL CACHE SIMULATION ACTIVE — All maps and hospital data running from local IndexedDB cache</span>
          </div>
        )}

        <main className="flex-1 py-4">
          {activeRole === 'intelligence' && <CommandCenter />}
          {activeRole === 'ambulance' && <AmbulanceView />}
          {activeRole === 'hospital' && <HospitalView />}
          {activeRole === 'traffic' && <TrafficView />}
          {activeRole === 'replay' && <IncidentReplayView />}
        </main>

        <ToastNotifications />
        <DemoControlsPanel />
        <VoiceAssistantModal />

        <footer className="border-t border-slate-900 bg-slate-950/90 backdrop-blur py-3 text-center text-xs text-slate-500 font-medium">
          LifeRoute Unified Emergency Response & Smart Traffic Platform v3.5
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

