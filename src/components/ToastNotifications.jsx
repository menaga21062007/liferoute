import React from 'react';
import { useApp } from '../context/AppContext';
import { AlertTriangle, CheckCircle2, Info, X, Zap } from 'lucide-react';

export const ToastNotifications = () => {
  const { alerts } = useApp();

  // Display top 3 most recent alerts as floating toasts
  const recentAlerts = (alerts || []).slice(0, 3);

  if (recentAlerts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2.5 max-w-sm w-full pointer-events-none font-sans">
      {recentAlerts.map((alt) => {
        const isCritical = alt.severity === 'HIGH' || alt.severity === 'CRITICAL' || alt.type === 'CRITICAL';
        const isSuccess = alt.type === 'SUCCESS' || alt.severity === 'NORMAL';

        return (
          <div
            key={alt.id}
            className={`pointer-events-auto p-4 rounded-2xl border shadow-2xl backdrop-blur-md flex items-start space-x-3 transition-all transform animate-slide-up ${
              isCritical
                ? 'bg-slate-900/95 border-red-500/80 text-red-100 ring-2 ring-red-500/30'
                : isSuccess
                ? 'bg-slate-900/95 border-emerald-500/80 text-emerald-100 ring-1 ring-emerald-500/30'
                : 'bg-slate-900/95 border-slate-700/80 text-slate-100'
            }`}
          >
            <div className={`p-2 rounded-xl shrink-0 ${
              isCritical ? 'bg-red-500/20 text-red-400' : isSuccess ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
            }`}>
              {isCritical ? <AlertTriangle className="h-4 w-4 animate-bounce" /> : isSuccess ? <CheckCircle2 className="h-4 w-4" /> : <Info className="h-4 w-4" />}
            </div>

            <div className="flex-1 space-y-0.5">
              <div className="flex items-center justify-between font-black text-xs">
                <span>{alt.title}</span>
                <span className="text-[9px] text-slate-400 font-mono">{alt.timestamp || alt.time}</span>
              </div>
              <p className="text-xs text-slate-300 font-semibold leading-snug">{alt.message}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
