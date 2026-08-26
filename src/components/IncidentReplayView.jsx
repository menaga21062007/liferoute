import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { SharedMap } from './SharedMap';
import { Play, Pause, RotateCcw, FastForward, Clock, Heart, Activity, TrafficCone, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const IncidentReplayView = () => {
  const { tripHistory, hospitals } = useApp();
  const selectedTrip = tripHistory[0] || {};
  const replayFrames = selectedTrip.replayData || [];

  const [currentFrameIdx, setCurrentFrameIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1); // 1x, 2x, 4x

  const currentFrame = replayFrames[currentFrameIdx] || replayFrames[0] || {
    timeSec: 0,
    timeLabel: "00:00",
    location: { lat: 40.718, lng: -73.950 },
    speedKm: 65,
    hr: 135,
    spo2: 92,
    signal: "TS-01 (GREEN)",
    event: "Dispatch Initiated"
  };

  useEffect(() => {
    if (!isPlaying) return;

    const intervalMs = 1000 / playbackSpeed;
    const timer = setInterval(() => {
      setCurrentFrameIdx((prev) => {
        if (prev >= replayFrames.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed, replayFrames]);

  // Construct Leaflet markers for replay
  const replayAmbulances = [
    {
      id: "replay-amb",
      code: selectedTrip.ambulanceCode || "AMB-101",
      status: "EN_ROUTE",
      currentLocation: currentFrame.location,
      etaMinutes: Math.max(0, Math.round((replayFrames.length - 1 - currentFrameIdx) * 0.5)),
      speedKm: currentFrame.speedKm,
      patient: {
        name: selectedTrip.patientName || "John Sterling",
        conditionCategory: selectedTrip.conditionCategory || "Cardiac Emergency"
      }
    }
  ];

  const replayRouteCoords = replayFrames.map(f => f.location);

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl backdrop-blur shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Clock className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-extrabold text-lg text-white">Incident Replay Mode</h2>
              <span className="bg-purple-950 text-purple-300 border border-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                Post-Trip Audit & Training
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Trip #{selectedTrip.id} • {selectedTrip.patientName} ({selectedTrip.conditionCategory}) • Driver: {selectedTrip.driverName}
            </p>
          </div>
        </div>

        {/* Speed Selector */}
        <div className="flex items-center space-x-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs">
          <span className="text-slate-400 font-semibold px-2">Speed:</span>
          {[1, 2, 4].map((spd) => (
            <button
              key={spd}
              onClick={() => setPlaybackSpeed(spd)}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                playbackSpeed === spd
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {spd}x
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Replay Map + Keyframe Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Left Column: Interactive Map View */}
        <div className="lg:col-span-2 space-y-4">
          <div className="h-[420px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative">
            <SharedMap
              ambulances={replayAmbulances}
              hospitals={hospitals}
              trafficSignals={[]}
              activeDijkstraRoute={{ polylineCoords: replayRouteCoords }}
              center={currentFrame.location}
              zoom={14}
            />

            {/* Replay Event Badge Overlay */}
            <div className="absolute top-4 left-4 z-[400] bg-slate-900/90 backdrop-blur border border-slate-800 p-3 rounded-xl shadow-xl max-w-sm">
              <div className="flex items-center space-x-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-bold text-slate-200">Replay Timeline: {currentFrame.timeLabel}</span>
              </div>
              <p className="text-xs font-semibold text-brand-lightBlue mt-1">
                {currentFrame.event}
              </p>
            </div>
          </div>

          {/* Timeline Scrubber Controls */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-colors shadow-lg shadow-purple-600/30"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
                </button>
                <button
                  onClick={() => { setCurrentFrameIdx(0); setIsPlaying(false); }}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="Reset to 00:00"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
                <span>Timestamp: <span className="text-purple-400">{currentFrame.timeLabel}</span> / 03:30</span>
              </div>

              <div className="text-right">
                <span>Transit Speed: <strong className="text-white">{currentFrame.speedKm} km/h</strong></span>
              </div>
            </div>

            {/* Range Slider Scrubber */}
            <input
              type="range"
              min="0"
              max={replayFrames.length - 1}
              value={currentFrameIdx}
              onChange={(e) => setCurrentFrameIdx(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>
        </div>

        {/* Right Column: Telemetry Cards & Timeline Keyframes */}
        <div className="space-y-4">
          
          {/* Vitals & Telemetry at Current Frame */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl space-y-3">
            <h3 className="font-bold text-sm text-white flex items-center space-x-2">
              <Activity className="h-4 w-4 text-purple-400" />
              <span>Frame Telemetry Snapshot</span>
            </h3>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Heart Rate</span>
                <span className="text-lg font-extrabold text-rose-400 flex items-center space-x-1">
                  <Heart className="h-4 w-4 animate-pulse text-rose-500" />
                  <span>{currentFrame.hr} <small className="text-xs font-normal">BPM</small></span>
                </span>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Oxygen SpO2</span>
                <span className="text-lg font-extrabold text-cyan-400">
                  {currentFrame.spo2}%
                </span>
              </div>

              <div className="col-span-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Traffic Signal State</span>
                  <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1.5 mt-0.5">
                    <TrafficCone className="h-3.5 w-3.5 text-emerald-400" />
                    <span>{currentFrame.signal}</span>
                  </span>
                </div>
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              </div>
            </div>
          </div>

          {/* Keyframe Log List */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl space-y-3">
            <h3 className="font-bold text-sm text-white flex items-center justify-between">
              <span>Audit Event Keyframes</span>
              <span className="text-xs font-normal text-slate-400">{replayFrames.length} events</span>
            </h3>

            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {replayFrames.map((frame, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentFrameIdx(idx)}
                  className={`w-full text-left p-2 rounded-xl border text-xs transition-all flex items-center justify-between ${
                    currentFrameIdx === idx
                      ? 'bg-purple-950/80 border-purple-600 text-white font-bold ring-1 ring-purple-500/40'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="px-1.5 py-0.5 bg-slate-900 rounded font-mono text-[10px] text-purple-400 border border-slate-800">
                      {frame.timeLabel}
                    </span>
                    <span className="truncate max-w-[170px]">{frame.event}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">{frame.speedKm} km/h</span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
