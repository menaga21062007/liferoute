import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SharedMap } from './SharedMap';
import { History, Search, Ambulance, Building2, Play } from 'lucide-react';

export const TripHistoryView = () => {
  const { tripHistory } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrip, setSelectedTrip] = useState(tripHistory[0] || null);

  const filteredTrips = tripHistory.filter((t) => {
    const term = searchTerm.toLowerCase();
    return (
      t.patientName?.toLowerCase().includes(term) ||
      t.ambulanceCode?.toLowerCase().includes(term) ||
      t.conditionCategory?.toLowerCase().includes(term) ||
      t.hospitalName?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6 animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-5 rounded-3xl flex flex-wrap items-center justify-between gap-4 shadow-2xl">
        <div className="flex items-center space-x-3.5">
          <div className="p-3.5 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/40">
            <History className="h-7 w-7" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">Emergency Trip History & Map Route Replay</h2>
            <p className="text-xs text-slate-300 font-semibold mt-0.5">Search historical ambulance dispatches, outcomes, and view map route replays</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search patient, ambulance, hospital..."
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-brand-blue transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Filtered Trip List */}
        <div className="space-y-3">
          <div className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">
            Completed Trips ({filteredTrips.length})
          </div>

          <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
            {filteredTrips.map((trip) => {
              const isSelected = selectedTrip?.id === trip.id;
              return (
                <div
                  key={trip.id}
                  onClick={() => setSelectedTrip(trip)}
                  className={`p-4 rounded-3xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-950/95 border-purple-500 ring-2 ring-purple-500/40 shadow-2xl'
                      : 'bg-slate-900/90 backdrop-blur-md border border-slate-700/80 hover:border-slate-600 hover:scale-[1.01]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-base text-white">{trip.patientName}</span>
                    <span className="text-[11px] font-mono font-bold text-slate-300">{trip.tripDate}</span>
                  </div>
                  <div className="text-xs text-red-400 font-extrabold mt-0.5">{trip.conditionCategory}</div>
                  
                  <div className="mt-2.5 text-xs text-slate-200 font-bold space-y-1">
                    <div className="flex items-center space-x-1.5">
                      <Ambulance className="h-4 w-4 text-slate-400" />
                      <span>{trip.ambulanceCode} ({trip.driverName})</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <Building2 className="h-4 w-4 text-slate-400" />
                      <span>{trip.hospitalName}</span>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="mt-3 pt-2 border-t border-purple-900/50 flex items-center text-purple-300 text-xs font-black space-x-1.5">
                      <Play className="h-4 w-4 animate-pulse fill-purple-400 text-purple-400" />
                      <span>Map Route Replay Active</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Route Replay Map & Outcome Details */}
        <div className="lg:col-span-2 space-y-4">
          {selectedTrip ? (
            <div className="space-y-4 animate-scale-up">
              <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-5 rounded-3xl flex flex-wrap items-center justify-between gap-3 shadow-2xl">
                <div>
                  <div className="text-xl font-black text-white">{selectedTrip.patientName} ({selectedTrip.age}y {selectedTrip.gender})</div>
                  <div className="text-xs text-slate-200 font-bold mt-0.5">{selectedTrip.conditionCategory} • Duration: {selectedTrip.durationMins} mins</div>
                </div>
                <div className="bg-emerald-950/90 border border-emerald-700 text-emerald-300 text-xs font-black px-4 py-2 rounded-2xl shadow">
                  {selectedTrip.outcome}
                </div>
              </div>

              {/* Shared Map Route Replay */}
              <SharedMap replayRoute={selectedTrip.route} height="h-[480px]" />
            </div>
          ) : (
            <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-12 rounded-3xl text-center text-slate-300 font-bold">
              Select a trip to replay route on the map.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
