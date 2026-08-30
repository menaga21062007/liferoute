import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { LandingPage } from './components/LandingPage';
import { Navbar } from './components/Navbar';
import { PatientSosView } from './components/PatientSosView';
import { CallCentreDashboard } from './components/CallCentreDashboard';
import { AmbulanceCrewDashboard } from './components/AmbulanceCrewDashboard';
import { HospitalDeskDashboard } from './components/HospitalDeskDashboard';
import { GreenCorridorDemo } from './components/GreenCorridorDemo';

const MainLayout = () => {
  const [viewMode, setViewMode] = useState('landing');
  const { activeRole } = useApp();

  if (viewMode === 'landing') {
    return (
      <div>
        <Navbar
          onOpenLanding={() => setViewMode('landing')}
          onSelectRole={() => setViewMode('dashboard')}
        />
        <LandingPage onLaunchDemo={() => setViewMode('dashboard')} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-800 selection:bg-emerald-600 selection:text-white pb-8">
      <Navbar
        onOpenLanding={() => setViewMode('landing')}
        onSelectRole={() => setViewMode('dashboard')}
      />


      <main className="flex-1 py-4">
        {activeRole === 'sos' && <PatientSosView />}
        {activeRole === 'callcentre' && <CallCentreDashboard />}
        {activeRole === 'ambulance' && <AmbulanceCrewDashboard />}
        {activeRole === 'hospital' && <HospitalDeskDashboard />}
        {activeRole === 'corridor' && <GreenCorridorDemo />}
      </main>

      <footer className="border-t border-emerald-800/80 bg-[#064e3b] py-3 text-center text-xs text-emerald-200 font-medium">
        WellCare Medical Center & LifeRoute Emergency Response Network • Toll-Free 108 / (123) 456-7890
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



