import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import {
  INITIAL_HOSPITALS,
  INITIAL_AMBULANCES,
  INITIAL_TRAFFIC_SIGNALS,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_TRIP_HISTORY,
  INITIAL_EMERGENCY_REQUESTS,
  FICTIONAL_ROAD_GRAPH
} from '../../server/mockData';
import { runDBSCANClustering } from '../utils/dbscan';
import { findDijkstraShortestPath, findNearestGraphNode } from '../utils/dijkstra';
import { sortPriorityQueue, findBestAmbulanceForRequest } from '../utils/priorityQueue';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [activeRole, setActiveRole] = useState('intelligence'); // Default to Emergency Intelligence Dashboard
  const [selectedHospitalId, setSelectedHospitalId] = useState('hosp-1');
  const [hospitals, setHospitals] = useState(INITIAL_HOSPITALS);
  const [ambulances, setAmbulances] = useState(INITIAL_AMBULANCES);
  const [trafficSignals, setTrafficSignals] = useState(INITIAL_TRAFFIC_SIGNALS);
  const [alerts, setAlerts] = useState([
    { id: "alt-1", timestamp: "10:15:00 AM", title: "Emergency Intelligence Active", message: "Loaded 8 emergency requests. DBSCAN hotspot analysis ready.", severity: "NORMAL" }
  ]);
  const [activityLogs, setActivityLogs] = useState(INITIAL_ACTIVITY_LOGS);
  const [tripHistory, setTripHistory] = useState(INITIAL_TRIP_HISTORY);

  // New Emergency Intelligence State
  const [emergencyRequests, setEmergencyRequests] = useState(INITIAL_EMERGENCY_REQUESTS);
  const [dbscanConfig, setDbscanConfig] = useState({ eps: 1.2, minSamples: 3 });
  const [dbscanHotspots, setDbscanHotspots] = useState([]);
  const [roadGraph, setRoadGraph] = useState(FICTIONAL_ROAD_GRAPH);
  const [blockedEdges, setBlockedEdges] = useState([]);
  const [activeDijkstraRoute, setActiveDijkstraRoute] = useState(null);

  const [isSimulationRunning, setIsSimulationRunning] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  // Auto-run initial DBSCAN clustering on mount
  useEffect(() => {
    const res = runDBSCANClustering(emergencyRequests, dbscanConfig.eps, dbscanConfig.minSamples);
    setDbscanHotspots(res.clusters);
  }, [emergencyRequests, dbscanConfig]);

  // Compute Priority Dispatch Queue dynamically
  const dispatchQueue = sortPriorityQueue(emergencyRequests, dbscanHotspots);

  // Socket.io & REST state updates
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
      if (data.emergencyRequests && data.emergencyRequests.length > 0) setEmergencyRequests(data.emergencyRequests);
    });

    return () => socketInstance.disconnect();
  }, []);

  // Standalone simulation loop for moving ambulances and updating waiting times
  useEffect(() => {
    if (!isSimulationRunning) return;

    const interval = setInterval(() => {
      // Increment waiting times for unassigned requests
      setEmergencyRequests((prev) =>
        prev.map((req) => (req.status === 'Waiting' ? { ...req, waitingTimeMins: req.waitingTimeMins + 1 } : req))
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
    }, 3000);

    return () => clearInterval(interval);
  }, [isSimulationRunning]);

  // Request Management Actions
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
    setAlerts((prev) => [
      {
        id: 'alt-' + Date.now(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        title: 'New Emergency Request Created',
        message: `${newRequest.id}: ${newRequest.patientName} (${newRequest.emergencyType}) at ${newRequest.location.name}`,
        severity: newRequest.severity
      },
      ...prev
    ]);
  };

  const generateRandomRequests = () => {
    const types = ['Cardiac Emergency', 'Road Accident', 'Stroke', 'Trauma', 'Respiratory Distress', 'Fire/Burn Injury'];
    const severities = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
    const names = ['Anita Roy', 'Siddharth Patel', 'Pooja Kumar', 'Vikas Sharma', 'Karthik Raja'];

    const newReqs = [];
    for (let i = 0; i < 3; i++) {
      const idx = Math.floor(Math.random() * roadGraph.nodes.length);
      const node = roadGraph.nodes[idx];
      newReqs.push({
        id: `ER-${String(emergencyRequests.length + i + 1).padStart(3, '0')}`,
        patientName: names[i % names.length],
        age: 20 + Math.floor(Math.random() * 50),
        gender: i % 2 === 0 ? 'Male' : 'Female',
        bloodGroup: 'O+',
        emergencyType: types[Math.floor(Math.random() * types.length)],
        severity: severities[Math.floor(Math.random() * severities.length)],
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
      location: { lat: 40.718, lng: -73.950, name: 'Grand Ave & 5th St' },
      notes: 'Unresponsive, cardiac arrest confirmed'
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

  // Dispatch Actions
  const dispatchNextRequest = () => {
    const sorted = sortPriorityQueue(emergencyRequests, dbscanHotspots);
    const unassigned = sorted.find((r) => r.status === 'Waiting' || r.status === 'Queued');
    if (!unassigned) return;

    const match = findBestAmbulanceForRequest(unassigned, ambulances);
    if (!match) return;

    const amb = match.ambulance;
    assignAmbulanceToRequestInternal(unassigned.id, amb.id);
  };

  const autoDispatchAll = () => {
    const sorted = sortPriorityQueue(emergencyRequests, dbscanHotspots);
    sorted.forEach((req) => {
      if (req.status === 'Waiting' || req.status === 'Queued') {
        const match = findBestAmbulanceForRequest(req, ambulances);
        if (match) {
          assignAmbulanceToRequestInternal(req.id, match.ambulance.id);
        }
      }
    });
  };

  const manualAssignAmbulance = (reqId) => {
    const req = emergencyRequests.find((r) => r.id === reqId);
    if (!req) return;
    const match = findBestAmbulanceForRequest(req, ambulances);
    if (match) {
      assignAmbulanceToRequestInternal(reqId, match.ambulance.id);
    }
  };

  const unassignAmbulance = (reqId) => {
    setEmergencyRequests((prev) =>
      prev.map((r) => (r.id === reqId ? { ...r, status: 'Waiting', assignedAmbulanceId: null } : r))
    );
    setAmbulances((prev) =>
      prev.map((a) => (a.assignedRequestId === reqId ? { ...a, status: 'AVAILABLE', assignedRequestId: null } : a))
    );
  };

  const resetDispatchQueue = () => {
    setEmergencyRequests((prev) => prev.map((r) => ({ ...r, status: 'Waiting', assignedAmbulanceId: null })));
    setAmbulances((prev) => prev.map((a) => ({ ...a, status: 'AVAILABLE', assignedRequestId: null })));
    setActiveDijkstraRoute(null);
  };

  const assignAmbulanceToRequestInternal = (reqId, ambulanceId) => {
    const req = emergencyRequests.find((r) => r.id === reqId);
    const amb = ambulances.find((a) => a.id === ambulanceId);
    if (!req || !amb) return;

    // Update Request & Ambulance Status
    setEmergencyRequests((prev) =>
      prev.map((r) => (r.id === reqId ? { ...r, status: 'Ambulance Assigned', assignedAmbulanceId: amb.code } : r))
    );

    setAmbulances((prev) =>
      prev.map((a) => (a.id === ambulanceId ? { ...a, status: 'Assigned', assignedRequestId: reqId } : a))
    );

    // Compute Dijkstra Route: Ambulance Node -> Emergency Node -> Velammal Hospital Node
    const startNode = findNearestGraphNode(roadGraph, amb.currentLocation) || roadGraph.nodes[0];
    const reqNode = findNearestGraphNode(roadGraph, req.location) || roadGraph.nodes[1];
    const hospNode = roadGraph.nodes.find((n) => n.id === 'N5') || roadGraph.nodes[4]; // VGH

    const route1 = findDijkstraShortestPath(roadGraph, startNode.id, reqNode.id, blockedEdges);
    const route2 = findDijkstraShortestPath(roadGraph, reqNode.id, hospNode.id, blockedEdges);

    const combinedCoords = [...(route1?.polylineCoords || []), ...(route2?.polylineCoords || [])];
    const totalDist = (route1?.totalDistanceKm || 0) + (route2?.totalDistanceKm || 0);

    setActiveDijkstraRoute({
      requestId: reqId,
      ambulanceCode: amb.code,
      polylineCoords: combinedCoords,
      totalDistanceKm: parseFloat(totalDist.toFixed(2)),
      estMins: Math.max(2, Math.round(totalDist * 1.8))
    });

    setAlerts((prev) => [
      {
        id: 'alt-' + Date.now(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        title: 'Ambulance Assigned',
        message: `${amb.code} assigned to ${req.severity} Request ${req.id} (${req.patientName})`,
        severity: 'HIGH'
      },
      ...prev
    ]);
  };

  // Dynamic Road Block Simulator
  const toggleRoadBlock = () => {
    const edgeToBlock = roadGraph.edges[2].id; // E3 Grand Corridor
    const isAlreadyBlocked = blockedEdges.includes(edgeToBlock);

    const newBlocked = isAlreadyBlocked ? [] : [edgeToBlock];
    setBlockedEdges(newBlocked);

    if (activeDijkstraRoute) {
      // Re-run Dijkstra with blocked edge excluded
      const amb = ambulances[0];
      const startNode = roadGraph.nodes[0];
      const reqNode = roadGraph.nodes[2];
      const hospNode = roadGraph.nodes[4];

      const route1 = findDijkstraShortestPath(roadGraph, startNode.id, reqNode.id, newBlocked);
      const route2 = findDijkstraShortestPath(roadGraph, reqNode.id, hospNode.id, newBlocked);
      const combined = [...(route1?.polylineCoords || []), ...(route2?.polylineCoords || [])];

      setActiveDijkstraRoute((prev) => ({
        ...prev,
        polylineCoords: combined,
        totalDistanceKm: parseFloat(((route1?.totalDistanceKm || 0) + (route2?.totalDistanceKm || 0)).toFixed(2))
      }));
    }

    setAlerts((prev) => [
      {
        id: 'alt-' + Date.now(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        title: 'Road Block Alert',
        message: isAlreadyBlocked
          ? 'Simulated road block cleared. Standard Dijkstra routes active.'
          : 'Simulated road block activated on Grand Corridor (E3). Route recalculated.',
        severity: 'HIGH'
      },
      ...prev
    ]);
  };

  const stepDijkstraAnimation = () => {
    if (!activeDijkstraRoute || !activeDijkstraRoute.polylineCoords) return;
    setAmbulances((prev) =>
      prev.map((amb) => {
        if (amb.code === activeDijkstraRoute.ambulanceCode) {
          const nextIdx = (amb.currentWaypointIndex + 1) % activeDijkstraRoute.polylineCoords.length;
          return {
            ...amb,
            currentWaypointIndex: nextIdx,
            currentLocation: activeDijkstraRoute.polylineCoords[nextIdx]
          };
        }
        return amb;
      })
    );
  };

  const startTrip = async (tripData) => {
    createEmergencyRequest({
      patientName: tripData.patientName || 'Menaga',
      age: tripData.age || 54,
      emergencyType: tripData.conditionCategory || 'Cardiac Emergency',
      severity: 'CRITICAL'
    });
  };

  const toggleSimulation = () => setIsSimulationRunning((prev) => !prev);
  const resetSimulation = () => resetDemoData();

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
        updatePatientStatus: () => {},
        updatePatientTreatmentStatus: () => {},
        updateBedStatus: () => {},
        toggleTrafficSignal: () => {},
        toggleSimulation,
        resetSimulation
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
