import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UniversalSharedMap } from './UniversalSharedMap';
import { SEVERITY_COLORS } from '../utils/priorityQueue';
import {
  ShieldAlert,
  Zap,
  Activity,
  Radio,
  PlusCircle,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  AlertTriangle,
  Ambulance,
  Building2,
  Navigation,
  Layers,
  ChevronRight,
  CheckCircle2,
  ListFilter
} from 'lucide-react';

export const EmergencyIntelligenceDashboard = () => {
  const {
    emergencyRequests,
    dbscanHotspots,
    dbscanConfig,
    dispatchQueue,
    ambulances,
    hospitals,
    roadGraph,
    activeDijkstraRoute,
    blockedEdges,
    isSimulationRunning,
    createEmergencyRequest,
    generateRandomRequests,
    generateCriticalRequest,
    clearEmergencyRequests,
    resetDemoData,
    runDbscanAnalysis,
    resetHotspots,
    dispatchNextRequest,
    autoDispatchAll,
    manualAssignAmbulance,
    unassignAmbulance,
    resetDispatchQueue,
    toggleRoadBlock,
    stepDijkstraAnimation,
    toggleSimulation,
    resetSimulation
  } = useApp();

  // Intake Form State
  const [patientName, setPatientName] = useState('Menaga');
  const [age, setAge] = useState('54');
  const [emergencyType, setEmergencyType] = useState('Cardiac Emergency');
  const [severity, setSeverity] = useState('CRITICAL');
  const [selectedLocationNodeId, setSelectedLocationNodeId] = useState('N3');
  const [notes, setNotes] = useState('Chest pressure, STEMI suspected');

  // Map Layer Toggles
  const [showAmbulances, setShowAmbulances] = useState(true);
  const [showHospitals, setShowHospitals] = useState(true);
  const [showEmergencyRequests, setShowEmergencyRequests] = useState(true);
  const [showHotspots, setShowHotspots] = useState(true);
  const [showRoutes, setShowRoutes] = useState(true);
  const [showTrafficSignals, setShowTrafficSignals] = useState(true);
  const [showRoadGraph, setShowRoadGraph] = useState(true);

  // Selection Focus State
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [selectedAmbulanceId, setSelectedAmbulanceId] = useState(null);

  // Configurable DBSCAN Sliders State
  const [eps, setEps] = useState(dbscanConfig?.eps || 1.2);
  const [minSamples, setMinSamples] = useState(dbscanConfig?.minSamples || 3);

  const handleCreateRequest = (e) => {
    e.preventDefault();
    const nodeObj = (roadGraph?.nodes || []).find(n => n.id === selectedLocationNodeId) || { lat: 40.722, lng: -73.945, name: 'Grand Ave Crossing' };
    createEmergencyRequest({
      patientName,
      age: parseInt(age, 10),
      emergencyType,
      severity,
      location: { lat: nodeObj.lat, lng: nodeObj.lng, name: nodeObj.name },
      notes
    });
  };

  const handleRunDBSCAN = () => {
    runDbscanAnalysis(eps, minSamples);
  };

  const criticalCount = emergencyRequests.filter(r => r.severity === 'CRITICAL').length;
  const unassignedCount = emergencyRequests.filter(r => r.status === 'Waiting' || r.status === 'Queued').length;

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6 animate-fade-in text-slate-100 font-sans">
      
      {/* REQUIRED ACADEMIC DEMO DISCLAIMER BANNER */}
      <div className="bg-slate-900/95 border border-slate-700/80 p-4 rounded-3xl flex items-start space-x-3.5 shadow-2xl">
        <ShieldAlert className="h-6 w-6 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed text-slate-300 font-medium">
          <strong className="text-amber-400 font-black uppercase tracking-wide">Academic Simulation Disclaimer:</strong> This is an academic demonstration platform for presentation purposes only. Emergency requests, patients, ambulances, locations, GPS coordinates, hospitals, routes, road networks, DBSCAN hotspot analysis, dispatch decisions, and travel times are fictional and generated inside the application. No real emergency services, vehicles, hospitals, traffic systems, or public infrastructure are connected.
        </div>
      </div>

      {/* TOP METRICS DASHBOARD CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-5 rounded-3xl shadow-xl space-y-1">
          <div className="flex items-center justify-between text-xs font-black text-slate-300">
            <span>ACTIVE REQUESTS</span>
            <Activity className="h-4 w-4 text-blue-400 animate-pulse" />
          </div>
          <div className="text-3xl font-black text-white">{emergencyRequests.length} <span className="text-xs font-normal text-slate-400">Total</span></div>
          <div className="text-[10px] text-slate-400 font-semibold">{unassignedCount} Unassigned in Queue</div>
        </div>

        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-5 rounded-3xl shadow-xl space-y-1">
          <div className="flex items-center justify-between text-xs font-black text-slate-300">
            <span>DBSCAN HOTSPOTS</span>
            <Zap className="h-4 w-4 text-amber-400 animate-bounce" />
          </div>
          <div className="text-3xl font-black text-amber-400">{dbscanHotspots.length} <span className="text-xs font-normal text-slate-400">Zones</span></div>
          <div className="text-[10px] text-amber-300 font-semibold">Density Spatial Cluster Radar</div>
        </div>

        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-5 rounded-3xl shadow-xl space-y-1">
          <div className="flex items-center justify-between text-xs font-black text-slate-300">
            <span>CRITICAL CASES</span>
            <AlertTriangle className="h-4 w-4 text-red-400 animate-ping" />
          </div>
          <div className="text-3xl font-black text-red-400">{criticalCount} <span className="text-xs font-normal text-slate-400">Critical</span></div>
          <div className="text-[10px] text-red-300 font-semibold">Highest Priority Dispatch</div>
        </div>

        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-5 rounded-3xl shadow-xl space-y-1">
          <div className="flex items-center justify-between text-xs font-black text-slate-300">
            <span>FLEET STATUS</span>
            <Ambulance className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400">
            {ambulances.filter(a => a.status === 'AVAILABLE' || a.status === 'IDLE').length} <span className="text-xs font-normal text-slate-400">/ {ambulances.length} Ready</span>
          </div>
          <div className="text-[10px] text-emerald-300 font-semibold">Available Units</div>
        </div>
      </div>

      {/* SECTION 1: INTAKE FORM & DEMO GENERATORS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Request Intake Form */}
        <div className="lg:col-span-6 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-6 rounded-3xl shadow-2xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/40">
                <PlusCircle className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-black text-white tracking-tight">Create Emergency Request</h3>
            </div>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black px-2.5 py-1 rounded-full uppercase">
              INTAKE ACTIVE
            </span>
          </div>

          <form onSubmit={handleCreateRequest} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-black text-slate-200 uppercase mb-1">Patient Name</label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm font-bold text-white focus:outline-none focus:border-brand-blue"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-200 uppercase mb-1">Patient Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm font-bold text-white focus:outline-none focus:border-brand-blue"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-black text-slate-200 uppercase mb-1">Emergency Category</label>
                <select
                  value={emergencyType}
                  onChange={(e) => setEmergencyType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-bold text-white focus:outline-none focus:border-brand-blue"
                >
                  {['Cardiac Emergency', 'Road Accident', 'Stroke', 'Trauma', 'Respiratory Distress', 'Fire/Burn Injury', 'Other Emergency'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-200 uppercase mb-1">Severity Priority</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-bold text-white focus:outline-none focus:border-brand-blue"
                >
                  <option value="CRITICAL">CRITICAL (Red)</option>
                  <option value="HIGH">HIGH (Orange)</option>
                  <option value="MEDIUM">MEDIUM (Yellow)</option>
                  <option value="LOW">LOW (Blue)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-200 uppercase mb-1">Fictional Map Location</label>
              <select
                value={selectedLocationNodeId}
                onChange={(e) => setSelectedLocationNodeId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-bold text-white focus:outline-none focus:border-brand-blue"
              >
                {(roadGraph?.nodes || []).map(n => (
                  <option key={n.id} value={n.id}>📍 {n.name} ({n.id})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-200 uppercase mb-1">Paramedic Notes</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-bold text-white focus:outline-none focus:border-brand-blue"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-red-600 to-brand-red hover:from-red-500 hover:to-red-600 text-white font-black text-xs py-3 rounded-xl shadow-xl shadow-red-600/30 flex items-center justify-center space-x-2 transition-all"
            >
              <PlusCircle className="h-4 w-4" />
              <span>CREATE EMERGENCY REQUEST</span>
            </button>
          </form>

          {/* Quick Demo Request Generators */}
          <div className="pt-3 border-t border-slate-800 space-y-2">
            <div className="text-xs font-black text-slate-400 uppercase tracking-wider">⚡ Instant Presentation Generators</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-bold">
              <button
                onClick={generateRandomRequests}
                className="bg-slate-950 hover:bg-slate-800 border border-slate-800 text-blue-300 p-2 rounded-xl text-center transition-all"
              >
                +3 Random
              </button>
              <button
                onClick={generateCriticalRequest}
                className="bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-200 p-2 rounded-xl text-center transition-all"
              >
                +1 Critical
              </button>
              <button
                onClick={clearEmergencyRequests}
                className="bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 p-2 rounded-xl text-center transition-all"
              >
                Clear Requests
              </button>
              <button
                onClick={resetDemoData}
                className="bg-slate-950 hover:bg-slate-800 border border-slate-800 text-amber-300 p-2 rounded-xl text-center transition-all"
              >
                Reset All
              </button>
            </div>
          </div>

        </div>

        {/* DBSCAN Hotspot Analysis Card */}
        <div className="lg:col-span-6 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-6 rounded-3xl shadow-2xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
                <Sliders className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white tracking-tight">DBSCAN Spatial Hotspot Clustering</h3>
                <p className="text-[11px] text-slate-300 font-semibold">Density-based Spatial Clustering of Applications with Noise</p>
              </div>
            </div>
            <button
              onClick={handleRunDBSCAN}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs px-3.5 py-2 rounded-xl shadow-lg transition-all"
            >
              RUN ANALYSIS
            </button>
          </div>

          {/* Slider Controls */}
          <div className="grid grid-cols-2 gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs">
            <div>
              <div className="flex justify-between font-black text-slate-200 mb-1">
                <span>Cluster Radius (eps):</span>
                <span className="text-amber-400 font-mono">{eps} km</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="3.0"
                step="0.1"
                value={eps}
                onChange={(e) => setEps(parseFloat(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between font-black text-slate-200 mb-1">
                <span>Min Samples (minPts):</span>
                <span className="text-amber-400 font-mono">{minSamples}</span>
              </div>
              <input
                type="range"
                min="2"
                max="6"
                step="1"
                value={minSamples}
                onChange={(e) => setMinSamples(parseInt(e.target.value, 10))}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>
          </div>

          {/* Detected Hotspot Cluster Cards */}
          <div className="space-y-3">
            <div className="text-xs font-black text-slate-300 uppercase tracking-wider">
              Detected Hotspot Zones ({dbscanHotspots.length})
            </div>

            {dbscanHotspots.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[220px] overflow-y-auto pr-1">
                {dbscanHotspots.map((zone) => (
                  <div
                    key={zone.id}
                    className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1.5 shadow-lg"
                    style={{ borderLeftColor: zone.color, borderLeftWidth: '4px' }}
                  >
                    <div className="flex items-center justify-between font-black text-xs text-white">
                      <span>🔥 {zone.zoneName} ({zone.label})</span>
                      <span className="text-amber-400 font-mono">Score: {zone.priorityScore}</span>
                    </div>
                    <div className="text-[11px] text-slate-300 font-semibold">
                      Requests: <strong className="text-white">{zone.totalRequests}</strong> | Critical: <strong className="text-red-400">{zone.criticalCount}</strong>
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium">
                      Oldest Wait: {zone.oldestWaitMins}m | Avg Severity: {zone.avgSeverityWeight}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-slate-950/60 rounded-2xl border border-slate-800 text-slate-400 text-xs font-semibold">
                No dense hotspots detected. Click "Run Analysis" or "+3 Random" requests.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* SECTION 2: UNIVERSAL MAP & LAYER CONTROLS */}
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-5 rounded-3xl shadow-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2 text-white font-extrabold text-base">
            <Layers className="h-5 w-5 text-emerald-400" />
            <span>Universal Shared Demo Map Controls</span>
          </div>

          {/* Layer Toggle Switches */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
            <button
              onClick={() => setShowHospitals(!showHospitals)}
              className={`px-3 py-1 rounded-xl border transition-all ${showHospitals ? 'bg-emerald-500/25 text-emerald-300 border-emerald-500/50' : 'bg-slate-950 text-slate-500 border-slate-800'}`}
            >
              🏥 Hospitals (All 4)
            </button>
            <button
              onClick={() => setShowAmbulances(!showAmbulances)}
              className={`px-3 py-1 rounded-xl border transition-all ${showAmbulances ? 'bg-blue-500/25 text-blue-300 border-blue-500/50' : 'bg-slate-950 text-slate-500 border-slate-800'}`}
            >
              🚑 Ambulances
            </button>
            <button
              onClick={() => setShowEmergencyRequests(!showEmergencyRequests)}
              className={`px-3 py-1 rounded-xl border transition-all ${showEmergencyRequests ? 'bg-red-500/25 text-red-300 border-red-500/50' : 'bg-slate-950 text-slate-500 border-slate-800'}`}
            >
              🚨 Emergency Requests
            </button>
            <button
              onClick={() => setShowHotspots(!showHotspots)}
              className={`px-3 py-1 rounded-xl border transition-all ${showHotspots ? 'bg-amber-500/25 text-amber-300 border-amber-500/50' : 'bg-slate-950 text-slate-500 border-slate-800'}`}
            >
              🔥 DBSCAN Hotspots
            </button>
            <button
              onClick={() => setShowRoutes(!showRoutes)}
              className={`px-3 py-1 rounded-xl border transition-all ${showRoutes ? 'bg-emerald-500/25 text-emerald-300 border-emerald-500/50' : 'bg-slate-950 text-slate-500 border-slate-800'}`}
            >
              🛣️ Dijkstra Routes
            </button>
            <button
              onClick={() => setShowRoadGraph(!showRoadGraph)}
              className={`px-3 py-1 rounded-xl border transition-all ${showRoadGraph ? 'bg-slate-800 text-slate-200 border-slate-700' : 'bg-slate-950 text-slate-500 border-slate-800'}`}
            >
              🌐 City Road Graph
            </button>
          </div>
        </div>

        {/* Universal Map Render */}
        <UniversalSharedMap
          showAmbulances={showAmbulances}
          showHospitals={showHospitals}
          showEmergencyRequests={showEmergencyRequests}
          showHotspots={showHotspots}
          showRoutes={showRoutes}
          showTrafficSignals={showTrafficSignals}
          showRoadGraph={showRoadGraph}
          selectedAmbulanceId={selectedAmbulanceId}
          selectedRequestId={selectedRequestId}
          height="h-[580px]"
        />
      </div>

      {/* SECTION 3: PRIORITY DISPATCH QUEUE & DIJKSTRA ROUTE SIMULATION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Priority Dispatch Queue Table */}
        <div className="lg:col-span-8 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-6 rounded-3xl shadow-2xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-brand-blue/20 text-brand-lightBlue border border-brand-blue/40">
                <ListFilter className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-black text-white tracking-tight">Ambulance Dispatch Priority Queue ({dispatchQueue.length})</h3>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={dispatchNextRequest}
                className="bg-brand-blue hover:bg-blue-600 text-white font-black text-xs px-3.5 py-2 rounded-xl shadow-lg transition-all"
              >
                DISPATCH NEXT
              </button>
              <button
                onClick={autoDispatchAll}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-3.5 py-2 rounded-xl shadow-lg transition-all"
              >
                AUTO DISPATCH ALL
              </button>
              <button
                onClick={resetDispatchQueue}
                className="bg-slate-950 hover:bg-slate-800 text-slate-400 font-bold text-xs p-2 rounded-xl transition-all"
                title="Reset Queue"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] font-black tracking-wider">
                  <th className="py-2.5 px-3">Rank</th>
                  <th className="py-2.5 px-3">Req ID</th>
                  <th className="py-2.5 px-3">Emergency Type</th>
                  <th className="py-2.5 px-3">Severity</th>
                  <th className="py-2.5 px-3">Location</th>
                  <th className="py-2.5 px-3">Wait</th>
                  <th className="py-2.5 px-3">Assigned Unit</th>
                  <th className="py-2.5 px-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {dispatchQueue.map((req, idx) => {
                  const colors = SEVERITY_COLORS[req.severity?.toUpperCase()] || SEVERITY_COLORS.LOW;
                  const isAssigned = req.status === 'Ambulance Assigned' || req.status === 'Ambulance En Route';

                  return (
                    <tr
                      key={req.id}
                      onClick={() => setSelectedRequestId(req.id)}
                      className={`hover:bg-slate-950/80 transition-colors cursor-pointer ${selectedRequestId === req.id ? 'bg-slate-950 font-bold' : ''}`}
                    >
                      <td className="py-3 px-3 font-black text-slate-300">#{idx + 1}</td>
                      <td className="py-3 px-3 font-black text-white">🚨 {req.id}</td>
                      <td className="py-3 px-3 font-bold text-slate-200">{req.emergencyType}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border uppercase ${colors.bg} ${colors.text} ${colors.border}`}>
                          {req.severity}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-300 font-semibold truncate max-w-[140px]">{req.location.name}</td>
                      <td className="py-3 px-3 font-mono text-amber-400 font-bold">{req.waitingTimeMins}m</td>
                      <td className="py-3 px-3 font-bold">
                        {req.assignedAmbulanceId ? (
                          <span className="text-emerald-400">🚑 {req.assignedAmbulanceId}</span>
                        ) : (
                          <span className="text-slate-500 font-normal">Unassigned</span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        {!isAssigned ? (
                          <button
                            onClick={() => manualAssignAmbulance(req.id)}
                            className="bg-brand-blue hover:bg-blue-600 text-white font-black text-[10px] px-2.5 py-1 rounded-lg"
                          >
                            Assign Unit
                          </button>
                        ) : (
                          <button
                            onClick={() => unassignAmbulance(req.id)}
                            className="bg-slate-950 hover:bg-slate-800 text-rose-400 font-bold text-[10px] px-2 py-1 rounded-lg border border-slate-800"
                          >
                            Unassign
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dijkstra Route Simulator Panel */}
        <div className="lg:col-span-4 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-6 rounded-3xl shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Navigation className="h-5 w-5 text-emerald-400 animate-pulse" />
              <h3 className="text-lg font-black text-white tracking-tight">Dijkstra Route Planning</h3>
            </div>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black px-2.5 py-1 rounded-full uppercase">
              GRAPH ACTIVE
            </span>
          </div>

          {activeDijkstraRoute ? (
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-white">Route Distance:</span>
                  <span className="font-mono font-black text-emerald-400">{activeDijkstraRoute.totalDistanceKm} km</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-white">Estimated Transit:</span>
                  <span className="font-mono font-black text-emerald-400">~{activeDijkstraRoute.estMins} mins</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-white">Target Hospital:</span>
                  <span className="font-bold text-blue-400">🏥 Velammal Global Hospital</span>
                </div>
              </div>

              {/* Road Block Simulator Button */}
              <button
                onClick={toggleRoadBlock}
                className={`w-full py-2.5 rounded-xl font-black text-xs flex items-center justify-center space-x-2 transition-all ${
                  blockedEdges && blockedEdges.length > 0
                    ? 'bg-red-600 hover:bg-red-700 text-white shadow-xl shadow-red-600/30'
                    : 'bg-slate-950 hover:bg-slate-800 text-amber-300 border border-slate-800'
                }`}
              >
                <AlertTriangle className="h-4 w-4" />
                <span>{blockedEdges && blockedEdges.length > 0 ? 'ROAD BLOCK ACTIVE (RE-ROUTED)' : 'SIMULATE ROAD BLOCK'}</span>
              </button>

              {/* Route Controls */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800">
                <button
                  onClick={toggleSimulation}
                  className="flex-1 bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs py-2 rounded-xl flex items-center justify-center space-x-1"
                >
                  {isSimulationRunning ? <Pause className="h-3.5 w-3.5 text-amber-400" /> : <Play className="h-3.5 w-3.5 text-emerald-400" />}
                  <span>{isSimulationRunning ? 'Pause' : 'Resume'}</span>
                </button>
                <button
                  onClick={stepDijkstraAnimation}
                  className="flex-1 bg-brand-blue hover:bg-blue-600 text-white font-bold text-xs py-2 rounded-xl flex items-center justify-center space-x-1"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                  <span>Next Step</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 bg-slate-950/60 rounded-2xl border border-slate-800 text-slate-400 text-xs font-semibold">
              Select a dispatch to compute Dijkstra shortest path route.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
