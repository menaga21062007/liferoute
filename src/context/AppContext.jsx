import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import {
  INITIAL_HOSPITALS,
  INITIAL_AMBULANCES,
  INITIAL_TRAFFIC_SIGNALS,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_TRIP_HISTORY,
  INITIAL_EMERGENCY_REQUESTS,
  FICTIONAL_ROAD_GRAPH,
  PREDEFINED_ROUTES
} from '../../server/mockData';
import { runDBSCANClustering } from '../utils/dbscan';
import { findDijkstraShortestPath, findNearestGraphNode } from '../utils/dijkstra';
import { sortPriorityQueue, findBestAmbulanceForRequest } from '../utils/priorityQueue';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [activeRole, setActiveRole] = useState('ambulance'); // Default role
  const [selectedHospitalId, setSelectedHospitalId] = useState('hosp-1');
  const [hospitals, setHospitals] = useState(INITIAL_HOSPITALS);
  const [ambulances, setAmbulances] = useState(INITIAL_AMBULANCES);
  const [trafficSignals, setTrafficSignals] = useState(INITIAL_TRAFFIC_SIGNALS);
  const [alerts, setAlerts] = useState([
    { id: "alt-1", timestamp: "10:15:00 AM", title: "Emergency System Active", message: "Paramedic crew ready for intake. System connected.", severity: "NORMAL" }
  ]);
  const [activityLogs, setActivityLogs] = useState(INITIAL_ACTIVITY_LOGS);
  const [tripHistory, setTripHistory] = useState(INITIAL_TRIP_HISTORY);

  const [emergencyRequests, setEmergencyRequests] = useState(INITIAL_EMERGENCY_REQUESTS);
  const [dbscanConfig, setDbscanConfig] = useState({ eps: 1.2, minSamples: 3 });
  const [dbscanHotspots, setDbscanHotspots] = useState([]);
  const [roadGraph, setRoadGraph] = useState(FICTIONAL_ROAD_GRAPH);
  const [blockedEdges, setBlockedEdges] = useState([]);
  const [activeDijkstraRoute, setActiveDijkstraRoute] = useState(null);

  const [isSimulationRunning, setIsSimulationRunning] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const res = runDBSCANClustering(emergencyRequests, dbscanConfig.eps, dbscanConfig.minSamples);
    setDbscanHotspots(res.clusters);
  }, [emergencyRequests, dbscanConfig]);

  const dispatchQueue = sortPriorityQueue(emergencyRequests, dbscanHotspots);

  // Socket.io connection fallback
  useEffect(() => {
    const socketInstance = io(window.location.origin, {
      reconnectionAttempts: 3,
      timeout: 3000,
    });

    socketInstance.on('connect', () => setIsConnected(true));
    socketInstance.on('disconnect', () => setIsConnected(false));

    socketInstance.on('STATE_UPDATE', (data) => {
      if (data.hospitals && data.hospitals.length > 0) setHospitals(data.hospitals);
      if (data.ambulances && data.ambulances.length > 0) setAmbulances(data.ambulances);
      if (data.trafficSignals && data.trafficSignals.length > 0) setTrafficSignals(data.trafficSignals);
      if (data.alerts && data.alerts.length > 0) setAlerts(data.alerts);
      if (data.activityLogs && data.activityLogs.length > 0) setActivityLogs(data.activityLogs);
      if (data.tripHistory && data.tripHistory.length > 0) setTripHistory(data.tripHistory);
    });

    return () => socketInstance.disconnect();
  }, []);

  // Standalone Ambulance Movement Ticker (Moves EN_ROUTE ambulances along waypoints every 2 seconds)
  useEffect(() => {
    if (!isSimulationRunning) return;

    const interval = setInterval(() => {
      setAmbulances((prevAmbs) =>
        prevAmbs.map((amb) => {
          if (amb.status !== 'EN_ROUTE') return amb;

          const route = (amb.route && amb.route.length > 0) ? amb.route : PREDEFINED_ROUTES.routeAlpha;
          const currIdx = amb.currentWaypointIndex || 0;
          const nextIdx = (currIdx + 1) % route.length;
          const nextLoc = route[nextIdx];

          // Calculate remaining ETA
          const newEta = Math.max(1, Math.round((route.length - nextIdx) * 0.8));

          return {
            ...amb,
            currentWaypointIndex: nextIdx,
            currentLocation: nextLoc,
            etaMinutes: newEta
          };
        })
      );

      // Decrement traffic signal countdowns
      setTrafficSignals((prevSigs) =>
        prevSigs.map((sig) => {
          if (sig.countdownSeconds > 0) {
            const nextCount = sig.countdownSeconds - 1;
            return {
              ...sig,
              countdownSeconds: nextCount,
              status: nextCount === 0 ? 'RED' : sig.status,
              mode: nextCount === 0 ? 'AUTO_NORMAL' : sig.mode
            };
          }
          return sig;
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [isSimulationRunning]);

  // Main Emergency Trip Starter - Fully Connected to Hospitals, Map & Signals
  const startTrip = (tripData) => {
    const targetHospId = tripData.hospitalId || 'hosp-1';
    const targetHosp = hospitals.find((h) => h.id === targetHospId) || hospitals[0];
    const selectedRoute = targetHospId === 'hosp-2' ? PREDEFINED_ROUTES.routeBeta : PREDEFINED_ROUTES.routeAlpha;

    const patientObj = {
      id: 'pat-' + Date.now(),
      name: tripData.patientName || 'Menaga',
      age: tripData.age || 54,
      gender: tripData.gender || 'Male',
      bloodGroup: tripData.bloodGroup || 'O+',
      conditionCategory: tripData.conditionCategory || 'Cardiac Arrest / STEMI',
      treatmentStatus: 'En route',
      vitals: { hr: 117, bp: '148/94', spo2: '94%', temp: '37.2°C' }
    };

    // 1. Update Ambulance State
    setAmbulances((prev) =>
      prev.map((amb) => {
        if (amb.code === 'AMB-101' || amb.id === tripData.ambulanceId || amb.id === 'amb-101') {
          return {
            ...amb,
            status: 'EN_ROUTE',
            destinationHospitalId: targetHospId,
            route: selectedRoute,
            currentWaypointIndex: 0,
            currentLocation: selectedRoute[0],
            etaMinutes: 4,
            patient: patientObj
          };
        }
        return amb;
      })
    );

    // 2. Reserve Bed & Update Hospital Data in Real-Time
    setHospitals((prev) =>
      prev.map((hosp) => {
        if (hosp.id === targetHospId) {
          const updatedBeds = (hosp.beds || []).map((b, idx) =>
            idx === 0 ? { ...b, status: 'RESERVED', patientName: patientObj.name } : b
          );
          return {
            ...hosp,
            availableBeds: Math.max(0, hosp.availableBeds - 1),
            beds: updatedBeds
          };
        }
        return hosp;
      })
    );

    // 3. Trigger Green Corridor on Traffic Signals TS-01 & TS-02
    setTrafficSignals((prev) =>
      prev.map((sig) => {
        if (sig.code === 'TS-01' || sig.code === 'TS-02') {
          return {
            ...sig,
            status: 'GREEN',
            mode: 'GREEN_CORRIDOR_ACTIVE',
            countdownSeconds: 30,
            activeAmbulanceId: 'AMB-101'
          };
        }
        return sig;
      })
    );

    // 4. Post Live Alert & Activity Log
    const newAlert = {
      id: 'alt-' + Date.now(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title: '🚨 Emergency Dispatch Started',
      message: `AMB-101 en route with ${patientObj.name} (${patientObj.conditionCategory}) to ${targetHosp.name}`,
      severity: 'HIGH'
    };

    setAlerts((prev) => [newAlert, ...prev]);
    setActivityLogs((prev) => [
      {
        id: 'log-' + Date.now(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        event: 'Emergency Trip Started',
        actor: 'AMB-101 Paramedic Crew',
        category: 'AMBULANCE',
        details: `Dispatched ${patientObj.name} to ${targetHosp.name}`
      },
      ...prev
    ]);
  };

  const createEmergencyRequest = (newReqData) => {
    const newId = `ER-${String(emergencyRequests.length + 1).padStart(3, '0')}`;
    const newRequest = {
      id: newId,
      patientName: newReqData.patientName || 'Emergency Patient',
      age: newReqData.age || 40,
      gender: 'Other',
      bloodGroup: 'O+',
      emergencyType: newReqData.emergencyType || 'Cardiac Emergency',
      severity: newReqData.severity || 'CRITICAL',
      location: newReqData.location || { lat: 40.722, lng: -73.945, name: 'Grand Ave Crossing' },
      requestTimestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      waitingTimeMins: 0,
      patientSummary: newReqData.notes || 'Emergency request generated',
      status: 'Waiting',
      assignedAmbulanceId: null
    };
    setEmergencyRequests((prev) => [newRequest, ...prev]);
  };

  const generateRandomRequests = () => {
    const types = ['Cardiac Emergency', 'Road Accident', 'Stroke', 'Trauma', 'Respiratory Distress'];
    const severities = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
    const names = ['Anita Roy', 'Siddharth Patel', 'Pooja Kumar'];

    const newReqs = [];
    for (let i = 0; i < 3; i++) {
      const node = roadGraph.nodes[i % roadGraph.nodes.length];
      newReqs.push({
        id: `ER-${String(emergencyRequests.length + i + 1).padStart(3, '0')}`,
        patientName: names[i % names.length],
        age: 25 + i * 10,
        gender: 'Male',
        bloodGroup: 'O+',
        emergencyType: types[i % types.length],
        severity: severities[i % severities.length],
        location: { lat: node.lat, lng: node.lng, name: node.name },
        requestTimestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        waitingTimeMins: Math.floor(Math.random() * 8),
        patientSummary: 'Simulated emergency request',
        status: 'Waiting',
        assignedAmbulanceId: null
      });
    }
    setEmergencyRequests((prev) => [...newReqs, ...prev]);
  };

  const generateCriticalRequest = () => {
    createEmergencyRequest({
      patientName: 'Critical Patient',
      age: 58,
      emergencyType: 'Cardiac Emergency',
      severity: 'CRITICAL',
      location: { lat: 40.718, lng: -73.950, name: 'Grand Ave & 5th St' }
    });
  };

  const clearEmergencyRequests = () => {
    setEmergencyRequests([]);
    setDbscanHotspots([]);
    setActiveDijkstraRoute(null);
  };

  const resetDemoData = () => {
    setHospitals(INITIAL_HOSPITALS);
    setAmbulances(INITIAL_AMBULANCES);
    setTrafficSignals(INITIAL_TRAFFIC_SIGNALS);
    setEmergencyRequests(INITIAL_EMERGENCY_REQUESTS);
    setActivityLogs(INITIAL_ACTIVITY_LOGS);
    setTripHistory(INITIAL_TRIP_HISTORY);
    setBlockedEdges([]);
    setActiveDijkstraRoute(null);
  };

  const runDbscanAnalysis = (newEps = 1.2, newMinSamples = 3) => {
    setDbscanConfig({ eps: newEps, minSamples: newMinSamples });
    const res = runDBSCANClustering(emergencyRequests, newEps, newMinSamples);
    setDbscanHotspots(res.clusters);
  };

  const dispatchNextRequest = () => {
    const sorted = sortPriorityQueue(emergencyRequests, dbscanHotspots);
    const unassigned = sorted.find((r) => r.status === 'Waiting' || r.status === 'Queued');
    if (!unassigned) return;

    const match = findBestAmbulanceForRequest(unassigned, ambulances);
    if (!match) return;

    const amb = match.ambulance;
    startTrip({
      ambulanceId: amb.id,
      patientName: unassigned.patientName,
      age: unassigned.age,
      conditionCategory: unassigned.emergencyType,
      hospitalId: 'hosp-1'
    });
  };

  const autoDispatchAll = () => {
    dispatchNextRequest();
  };

  const manualAssignAmbulance = (reqId) => {
    const req = emergencyRequests.find((r) => r.id === reqId);
    if (!req) return;
    startTrip({
      ambulanceId: 'amb-101',
      patientName: req.patientName,
      age: req.age,
      conditionCategory: req.emergencyType,
      hospitalId: 'hosp-1'
    });
  };

  const unassignAmbulance = (reqId) => {
    setEmergencyRequests((prev) =>
      prev.map((r) => (r.id === reqId ? { ...r, status: 'Waiting', assignedAmbulanceId: null } : r))
    );
    setAmbulances((prev) =>
      prev.map((a) => (a.assignedRequestId === reqId ? { ...a, status: 'AVAILABLE', patient: null } : a))
    );
  };

  const resetDispatchQueue = () => resetDemoData();

  const toggleRoadBlock = () => {
    const edgeToBlock = roadGraph.edges[2].id;
    const isAlreadyBlocked = blockedEdges.includes(edgeToBlock);
    setBlockedEdges(isAlreadyBlocked ? [] : [edgeToBlock]);
  };

  const stepDijkstraAnimation = () => {
    setAmbulances((prev) =>
      prev.map((amb) => {
        if (amb.status === 'EN_ROUTE') {
          const route = amb.route || PREDEFINED_ROUTES.routeAlpha;
          const nextIdx = (amb.currentWaypointIndex + 1) % route.length;
          return {
            ...amb,
            currentWaypointIndex: nextIdx,
            currentLocation: route[nextIdx]
          };
        }
        return amb;
      })
    );
  };

  const updatePatientStatus = (patientId, treatmentStatus) => {
    setAmbulances((prev) =>
      prev.map((amb) => {
        if (amb.patient && (amb.patient.id === patientId || amb.id === patientId)) {
          return {
            ...amb,
            patient: { ...amb.patient, treatmentStatus }
          };
        }
        return amb;
      })
    );
  };

  const updateBedStatus = (hospitalId, bedId, newStatus) => {
    setHospitals((prev) =>
      prev.map((hosp) => {
        if (hosp.id === hospitalId) {
          const updatedBeds = (hosp.beds || []).map((b) => (b.id === bedId ? { ...b, status: newStatus } : b));
          return {
            ...hosp,
            beds: updatedBeds,
            availableBeds: updatedBeds.filter((b) => b.status === 'AVAILABLE').length
          };
        }
        return hosp;
      })
    );
  };

  return (
    <AppContext.Provider
      value={{
        activeRole,
        setActiveRole,
        selectedHospitalId,
        setSelectedHospitalId,
        hospitals,
        ambulances,
        trafficSignals,
        alerts,
        activityLogs,
        tripHistory,
        emergencyRequests,
        dbscanHotspots,
        dbscanConfig,
        dispatchQueue,
        roadGraph,
        activeDijkstraRoute,
        blockedEdges,
        isSimulationRunning,
        isConnected,
        createEmergencyRequest,
        generateRandomRequests,
        generateCriticalRequest,
        clearEmergencyRequests,
        resetDemoData,
        runDbscanAnalysis,
        resetHotspots: () => setDbscanHotspots([]),
        dispatchNextRequest,
        autoDispatchAll,
        manualAssignAmbulance,
        unassignAmbulance,
        resetDispatchQueue,
        toggleRoadBlock,
        stepDijkstraAnimation,
        startEmergencyTrip: startTrip,
        startTrip,
        stepCheckpoint: stepDijkstraAnimation,
        simulateArrival: () => {},
        simulateDischarge: () => {},
        updatePatientStatus,
        updatePatientTreatmentStatus: updatePatientStatus,
        updateBedStatus,
        toggleTrafficSignal: () => {},
        toggleSimulation: () => setIsSimulationRunning((prev) => !prev),
        resetSimulation: resetDemoData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
