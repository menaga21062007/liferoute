import React from 'react';
import { useApp } from '../context/AppContext';
import { Bell, Radio } from 'lucide-react';

export const AlertsPanel = () => {
  const { alerts, activityLogs } = useApp();

  return (
    <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-5 rounded-3xl shadow-2xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
            <Bell className="h-5 w-5 animate-bounce" />
          </div>
          <span className="font-black text-white text-base tracking-tight">Live Network Alert Stream</span>
        </div>
        <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black px-2.5 py-1 rounded-full uppercase flex items-center space-x-1">
          <Radio className="h-3 w-3 animate-pulse" />
          <span>SOCKET SYNC</span>
        </span>
      </div>

      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
        {alerts && alerts.length > 0 ? (
          alerts.map((alt) => (
            <div
              key={alt.id}
              className={`p-3.5 rounded-2xl border text-xs space-y-1 transition-all ${
                alt.severity === 'HIGH' || alt.severity === 'CRITICAL'
                  ? 'bg-red-950/70 border-red-700/80 text-red-100 shadow-lg'
                  : 'bg-slate-950/80 border-slate-800 text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between font-extrabold text-white">
                <span>{alt.title}</span>
                <span className="text-[10px] text-slate-300 font-mono">{alt.timestamp}</span>
              </div>
              <p className="text-slate-200 font-semibold leading-relaxed">{alt.message}</p>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-slate-400 text-xs font-semibold">
            No active network alerts.
          </div>
        )}

        {activityLogs && activityLogs.slice(0, 5).map((log) => (
          <div key={log.id} className="bg-slate-950/80 border border-slate-800 p-3 rounded-2xl text-[11px] space-y-1">
            <div className="flex items-center justify-between font-bold text-white">
              <span>{log.event}</span>
              <span className="text-slate-400 font-mono text-[9px]">{log.timestamp}</span>
            </div>
            <p className="text-slate-300 font-medium">{log.details}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
