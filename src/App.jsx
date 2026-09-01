import React from 'react';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { PatientSosView } from './components/PatientSosView';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-800 selection:bg-emerald-600 selection:text-white justify-center items-center py-4">
      <main className="w-full flex-1 flex flex-col justify-center items-center">
        <PatientSosView />
      </main>

      <footer className="w-full py-2 text-center text-[10px] text-slate-500 font-medium mt-auto">
        WellCare Emergency Network • Toll-Free 108
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
