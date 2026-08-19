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
  const [activeRole, setActiveRole] = useState('intelligence'); // Active View
  const [selectedHospitalId, setSelectedHospitalId] = useState('hosp-1');
  const [hospitals, setHospitals] = useState(INITIAL_HOSPITALS);
  const [ambulances, setAmbulances] = useState(INITIAL_AMBULANCES);
  const [trafficSignals, setTrafficSignals] = useState(INITIAL_TRAFFIC_SIGNALS);
  const [alerts, setAlerts] = useState([
    { id: "alt-1", timestamp: "10:15:00 AM", title: "Emergency Intelligence Active", message: "All 3 ambulance units ready for dispatch.", severity: "NORMAL" }
  ]);
  const [activityLogs, setActivityLogs] = useState(INITIAL_ACTIVITY_LOGS);
  const [tripHistory, setTripHistory] = useState(INITIAL_TRIP_HISTORY);

  const [emergencyRequests, setEmergencyRequests] = useState(INITIAL_EMERGENCY_REQUESTS);
  const [dbscanConfig, setDbscanConfig] = useState({ eps: 1.2, minSamples: 3 });
  const [dbscanHotspots, setDbscanHotspots] = useState([]);
  const [roadGraph, setRoadGraph] = useState(FICTIONAL_ROAD_GRAPH);
  const [blockedEdges, setBlockedEdges] = useState([]);

  // Helper to compute Dijkstra 2-stage route
  const computeDijkstraRoute = (ambLoc, reqLoc, hospId, currentBlocked = []) => {
    const startNode = findNearestGraphNode(roadGraph, ambLoc || { lat: 40.718, lng: -73.950 }) || roadGraph.nodes[1]; // N2
    const emergencyNode = findNearestGraphNode(roadGraph, reqLoc || { lat: 40.722, lng: -73.945 }) || roadGraph.nodes[2]; // N3

    let hospitalNodeId = 'N5'; // Velammal Global Hospital Hub (VGH)
    if (hospId === 'hosp-2' || hospId === 'VH') hospitalNodeId = 'N8';
    if (hospId === 'hosp-3' || hospId === 'MHVI') hospitalNodeId = 'N9';
    if (hospId === 'hosp-4' || hospId === 'CCPH') hospitalNodeId = 'N10';

    const stage1 = findDijkstraShortestPath(roadGraph, startNode.id, emergencyNode.id, currentBlocked);
    const stage2 = findDijkstraShortestPath(roadGraph, emergencyNode.id, hospitalNodeId, currentBlocked);

    const stage1Coords = (stage1 && stage1.polylineCoords) ? stage1.polylineCoords : [];
    const stage2Coords = (stage2 && stage2.polylineCoords) ? stage2.polylineCoords : [];

    const combinedCoords = [...stage1Coords, ...stage2Coords.slice(1)];
    const combinedDist = parseFloat(((stage1?.totalDistanceKm || 1.2) + (stage2?.totalDistanceKm || 1.4)).toFixed(2));
    const combinedEstMins = Math.max(2, Math.round(combinedDist * 1.8));

    const targetHosp = hospitals.find(h => h.id === hospId || h.code === hospId) || hospitals[0];

    return {
      startNodeName: startNode.name,
      emergencyNodeName: emergencyNode.name,
      targetHospitalName: targetHosp.name,
      targetHospitalId: targetHosp.id,
      pathNodes: combinedCoords,
      polylineCoords: combinedCoords,
      totalDistanceKm: combinedDist,
      estMins: combinedEstMins,
      isRecalculated: currentBlocked.length > 0
    };
  };

  // Initial Dijkstra Route state for baseline display
  const [activeDijkstraRoute, setActiveDijkstraRoute] = useState(() => 
    computeDijkstraRoute({ lat: 40.718, lng: -73.950 }, { lat: 40.722, lng: -73.945 }, 'hosp-1', [])
  );

  const [isSimulationRunning, setIsSimulationRunning] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const res = runDBSCANClustering(emergencyRequests, dbscanConfig.eps, dbscanConfig.minSamples);
    setDbscanHotspots(res.clusters);
  }, [emergencyRequests, dbscanConfig]);

  const dispatchQueue = sortPriorityQueue(emergencyRequests, dbscanHotspots);

  // Standalone Ambulance Movement Ticker (Moves ALL 3 EN_ROUTE Ambulances)
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

          const newEta = Math.max(1, Math.round((route.length - nextIdx) * 0.8));

          // Fluctuating live vitals telemetry
          const currentVitals = amb.patient?.vitals || { hr: 117, bp: '148/94', spo2: '94%', temp: '37.2°C' };
          const newHr = Math.min(160, Math.max(75, (currentVitals.hr || 117) + Math.floor(Math.random() * 5) - 2));

          return {
            ...amb,
            currentWaypointIndex: nextIdx,
            currentLocation: nextLoc,
            etaMinutes: newEta,
            patient: amb.patient ? {
              ...amb.patient,
              vitals: { ...currentVitals, hr: newHr }
            } : null
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

  // Main Emergency Trip Starter - Supports ALL 3 Ambulances (AMB-101, AMB-102, AMB-103)
  const startTrip = (tripData) => {
    const targetHospId = tripData.hospitalId || 'hosp-1';
    const targetHosp = hospitals.find((h) => h.id === targetHospId || h.code === targetHospId) || hospitals[0];

    // Pick target ambulance or next available unit
    let ambToUseId = tripData.ambulanceId;
    if (!ambToUseId) {
      const availAmb = ambulances.find(a => a.status === 'AVAILABLE' || a.status === 'IDLE') || ambulances[0];
      ambToUseId = availAmb.id;
    }

    const ambObj = ambulances.find(a => a.id === ambToUseId || a.code === ambToUseId) || ambulances[0];
    const reqLoc = tripData.location || { lat: 40.722, lng: -73.945 };
    const ambLoc = ambObj.currentLocation || { lat: 40.718, lng: -73.950 };

    // Compute Dijkstra 2-Stage Route for this specific trip
    const dijkstraRoute = computeDijkstraRoute(ambLoc, reqLoc, targetHospId, blockedEdges);
    setActiveDijkstraRoute(dijkstraRoute);

    const patientObj = {
      id: 'pat-' + Date.now() + '-' + Math.floor(Math.random()*100),
      name: tripData.patientName || 'Emergency Patient',
      age: tripData.age || 54,
      gender: tripData.gender || 'Male',
      bloodGroup: tripData.bloodGroup || 'O+',
      conditionCategory: tripData.conditionCategory || 'Cardiac Emergency',
      treatmentStatus: 'En route',
      destinationHospitalId: targetHosp.id,
      vitals: { hr: 117, bp: '148/94', spo2: '94%', temp: '37.2°C', ecgStatus: 'Live Telemetry Active' }
    };

    // Update the chosen ambulance state to EN_ROUTE
    setAmbulances((prev) =>
      prev.map((amb) => {
        if (amb.id === ambObj.id || amb.code === ambObj.code) {
          return {
            ...amb,
            status: 'EN_ROUTE',
            destinationHospitalId: targetHosp.id,
            route: dijkstraRoute.polylineCoords,
            currentWaypointIndex: 0,
            currentLocation: dijkstraRoute.polylineCoords[0] || ambLoc,
            etaMinutes: dijkstraRoute.estMins,
            patient: patientObj
          };
        }
        return amb;
      })
    );

    // Update request state
    setEmergencyRequests((prev) =>
      prev.map((r) => {
        if (r.id === tripData.requestId || r.patientName === tripData.patientName) {
          return { ...r, status: 'Ambulance En Route', assignedAmbulanceId: ambObj.code };
        }
        return r;
      })
    );

    // Reserve Bed at Target Hospital
    setHospitals((prev) =>
      prev.map((hosp) => {
        if (hosp.id === targetHosp.id || hosp.code === targetHosp.code) {
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

    // Trigger Green Corridor on Traffic Signals
    setTrafficSignals((prev) =>
      prev.map((sig) => {
        if (sig.code === 'TS-01' || sig.code === 'TS-02') {
          return {
            ...sig,
            status: 'GREEN',
            mode: 'GREEN_CORRIDOR_ACTIVE',
            countdownSeconds: 30,
            activeAmbulanceId: ambObj.code
          };
        }
        return sig;
      })
    );
  };

  const selectRequestAndComputeDijkstra = (reqId) => {
    const req = emergencyRequests.find((r) => r.id === reqId);
    if (!req) return;

    const availAmb = ambulances.find(a => a.status === 'AVAILABLE' || a.status === 'IDLE') || ambulances[0];
    const route = computeDijkstraRoute(availAmb.currentLocation, req.location, 'hosp-1', blockedEdges);
    setActiveDijkstraRoute(route);
  };

  const dispatchNextRequest = () => {
    const sorted = sortPriorityQueue(emergencyRequests, dbscanHotspots);
    const unassigned = sorted.find((r) => r.status === 'Waiting' || r.status === 'Queued');
    if (!unassigned) return;

    // Pick next available ambulance from ALL 3 units
    const availAmb = ambulances.find(a => a.status === 'AVAILABLE' || a.status === 'IDLE') || ambulances[0];

    // Pick target hospital based on category requirement
    let targetHospId = 'hosp-1';
    if (unassigned.emergencyType.includes('Trauma') || unassigned.emergencyType.includes('Accident')) targetHospId = 'hosp-2';
    if (unassigned.emergencyType.includes('Stroke') || unassigned.emergencyType.includes('Cardiac')) targetHospId = 'hosp-3';
    if (unassigned.emergencyType.includes('Pediatric') || unassigned.emergencyType.includes('Respiratory')) targetHospId = 'hosp-4';

    startTrip({
      requestId: unassigned.id,
      ambulanceId: availAmb.id,
      patientName: unassigned.patientName,
      age: unassigned.age,
      conditionCategory: unassigned.emergencyType,
      location: unassigned.location,
      hospitalId: targetHospId
    });
  };

  const toggleRoadBlock = () => {
    const edgeToBlock = 'E3';
    const isAlreadyBlocked = blockedEdges.includes(edgeToBlock);
    const newBlocked = isAlreadyBlocked ? [] : [edgeToBlock];
    setBlockedEdges(newBlocked);

    const req = emergencyRequests[0] || { location: { lat: 40.722, lng: -73.945 } };
    const newRoute = computeDijkstraRoute({ lat: 40.718, lng: -73.950 }, req.location, 'hosp-1', newBlocked);
    setActiveDijkstraRoute(newRoute);
  };

  const updateBedStatus = (hospitalId, bedId, newStatus) => {
    setHospitals((prev) =>
      prev.map((hosp) => {
        if (hosp.id === hospitalId || hosp.code === hospitalId) {
          const updatedBeds = (hosp.beds || []).map((b) => (b.id === bedId ? { ...b, status: newStatus } : b));
          const availableBedsCount = updatedBeds.filter((b) => b.status === 'AVAILABLE').length;
          const occupiedBedsCount = updatedBeds.filter((b) => b.status === 'OCCUPIED' || b.status === 'RESERVED').length;
          return {
            ...hosp,
            beds: updatedBeds,
            availableBeds: availableBedsCount,
            occupiedBeds: occupiedBedsCount
          };
        }
        return hosp;
      })
    );
  };

  const updatePatientStatus = (patientId, treatmentStatus) => {
    setAmbulances((prev) =>
      prev.map((amb) => {
        if (amb.patient && (amb.patient.id === patientId || amb.id === patientId)) {
          let nextAmbStatus = amb.status;
          if (treatmentStatus === 'ARRIVED') nextAmbStatus = 'ARRIVED';
          if (treatmentStatus === 'DISCHARGED') nextAmbStatus = 'AVAILABLE';

          return {
            ...amb,
            status: nextAmbStatus,
            patient: treatmentStatus === 'DISCHARGED' ? null : { ...amb.patient, treatmentStatus }
          };
        }
        return amb;
      })
    );
  };

  const resetDemoData = () => {
    setHospitals(INITIAL_HOSPITALS);
    setAmbulances(INITIAL_AMBULANCES);
    setTrafficSignals(INITIAL_TRAFFIC_SIGNALS);
    setEmergencyRequests(INITIAL_EMERGENCY_REQUESTS);
    setActivityLogs(INITIAL_ACTIVITY_LOGS);
    setTripHistory(INITIAL_TRIP_HISTORY);
    setBlockedEdges([]);
    setActiveDijkstraRoute(computeDijkstraRoute({ lat: 40.718, lng: -73.950 }, { lat: 40.722, lng: -73.945 }, 'hosp-1', []));
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
        createEmergencyRequest: () => {},
        generateRandomRequests: () => {},
        generateCriticalRequest: () => {},
        clearEmergencyRequests: () => setEmergencyRequests([]),
        resetDemoData,
        runDbscanAnalysis: (eps, minSamples) => {
          setDbscanConfig({ eps, minSamples });
          const res = runDBSCANClustering(emergencyRequests, eps, minSamples);
          setDbscanHotspots(res.clusters);
        },
        resetHotspots: () => setDbscanHotspots([]),
        selectRequestAndComputeDijkstra,
        dispatchNextRequest,
        autoDispatchAll: () => {
          dispatchNextRequest();
          setTimeout(() => dispatchNextRequest(), 500);
        },
        manualAssignAmbulance: (reqId) => {
          const req = emergencyRequests.find(r => r.id === reqId);
          if (!req) return;
          const availAmb = ambulances.find(a => a.status === 'AVAILABLE' || a.status === 'IDLE') || ambulances[0];
          startTrip({
            requestId: req.id,
            ambulanceId: availAmb.id,
            patientName: req.patientName,
            age: req.age,
            conditionCategory: req.emergencyType,
            location: req.location,
            hospitalId: 'hosp-1'
          });
        },
        unassignAmbulance: (reqId) => {
          setEmergencyRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: 'Waiting', assignedAmbulanceId: null } : r));
        },
        resetDispatchQueue: resetDemoData,
        toggleRoadBlock,
        stepDijkstraAnimation: () => {
          setAmbulances(prev => prev.map(a => {
            if (a.status === 'EN_ROUTE' && a.route) {
              const nextIdx = ((a.currentWaypointIndex || 0) + 1) % a.route.length;
              return { ...a, currentWaypointIndex: nextIdx, currentLocation: a.route[nextIdx] };
            }
            return a;
          }));
        },
        startEmergencyTrip: startTrip,
        startTrip,
        updatePatientStatus,
        updatePatientTreatmentStatus: updatePatientStatus,
        updateBedStatus,
        toggleSimulation: () => setIsSimulationRunning(prev => !prev),
        resetSimulation: resetDemoData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
