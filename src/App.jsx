import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { PatientSosView } from './components/PatientSosView';
import { CallCentreDashboard } from './components/CallCentreDashboard';
import { AmbulanceCrewDashboard } from './components/AmbulanceCrewDashboard';
import { HospitalDeskDashboard } from './components/HospitalDeskDashboard';
import { GreenCorridorDemo } from './components/GreenCorridorDemo';

const MainLayout = () => {
  const { activeRole } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#071225] text-slate-100 selection:bg-blue-600 selection:text-white pb-8">
      <Navbar />

      <main className="flex-1 py-4">
        {activeRole === 'sos' && <PatientSosView />}
        {activeRole === 'callcentre' && <CallCentreDashboard />}
        {activeRole === 'ambulance' && <AmbulanceCrewDashboard />}
        {activeRole === 'hospital' && <HospitalDeskDashboard />}
        {activeRole === 'corridor' && <GreenCorridorDemo />}
      </main>

      <footer className="border-t border-slate-900 bg-slate-950 py-3 text-center text-xs text-slate-400 font-medium">
        Government City Emergency Response & Smart Traffic Network • Emergency Toll-Free 108
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


