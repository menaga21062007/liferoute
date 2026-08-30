import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { LandingPage } from './components/LandingPage';
import { Navbar } from './components/Navbar';
import { CommandCenter } from './components/CommandCenter';
import { AmbulanceView } from './components/AmbulanceView';
import { HospitalView } from './components/HospitalView';
import { TrafficView } from './components/TrafficView';
import { IncidentReplayView } from './components/IncidentReplayView';
import { HospitalManagementModule } from './components/HospitalManagementModule';
import { PatientSosView } from './components/PatientSosView';
import { CallCentreDashboard } from './components/CallCentreDashboard';
import { AmbulanceCrewDashboard } from './components/AmbulanceCrewDashboard';
import { HospitalDeskDashboard } from './components/HospitalDeskDashboard';
import { GreenCorridorDemo } from './components/GreenCorridorDemo';
import { ToastNotifications } from './components/ToastNotifications';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { DemoControlsPanel } from './components/DemoControlsPanel';

const MainLayout = () => {
  const [viewMode, setViewMode] = useState('landing');
  const { activeRole } = useApp();

  if (viewMode === 'landing') {
    return (
      <div>
        <Navbar onOpenLanding={() => setViewMode('landing')} />
        <LandingPage onLaunchDemo={() => setViewMode('dashboard')} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#071225] text-slate-100 selection:bg-emerald-600 selection:text-white pb-8">
      <Navbar onOpenLanding={() => setViewMode('landing')} />

      <main className="flex-1 py-4">
        {activeRole === 'intelligence' && <CommandCenter />}
        {activeRole === 'ambulance' && <AmbulanceView />}
        {activeRole === 'hospital' && <HospitalView />}
        {activeRole === 'traffic' && <TrafficView />}
        {activeRole === 'replay' && <IncidentReplayView />}
        {activeRole === 'management' && <HospitalManagementModule />}
        {activeRole === 'callcentre' && <CallCentreDashboard />}
        {activeRole === 'sos' && <PatientSosView />}
        {activeRole === 'corridor' && <GreenCorridorDemo />}
      </main>

      <ToastNotifications />
      <DemoControlsPanel />
      <VoiceAssistantModal />

      <footer className="border-t border-slate-900 bg-slate-950 py-3 text-center text-xs text-slate-400 font-medium">
        WellCare Medical Center & LifeRoute Emergency Response Suite • Toll-Free 108 / (123) 456-7890
      </footer>
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
