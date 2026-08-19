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
  const [activeRole, setActiveRole] = useState('hospital'); // Active View
  const [selectedHospitalId, setSelectedHospitalId] = useState('hosp-1');
  const [hospitals, setHospitals] = useState(INITIAL_HOSPITALS);
  const [ambulances, setAmbulances] = useState(INITIAL_AMBULANCES);
  const [trafficSignals, setTrafficSignals] = useState(INITIAL_TRAFFIC_SIGNALS);
  const [alerts, setAlerts] = useState([
    { id: "alt-1", timestamp: "10:15:00 AM", title: "Hospital ER & Bed Management Connected", message: "Live sync active for all 4 hospitals.", severity: "NORMAL" }
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

  // Standalone Ambulance Movement Ticker
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

  // Main Emergency Trip Starter
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

    setHospitals((prev) =>
      prev.map((hosp) => {
        if (hosp.id === targetHospId || hosp.code === targetHospId) {
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

    setAlerts((prev) => [
      {
        id: 'alt-' + Date.now(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        title: '🚨 Emergency Dispatch Started',
        message: `AMB-101 en route with ${patientObj.name} (${patientObj.conditionCategory}) to ${targetHosp.name}`,
        severity: 'HIGH'
      },
      ...prev
    ]);
  };

  // Hospital ER & Bed Management Actions
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

    setAlerts((prev) => [
      {
        id: 'alt-' + Date.now(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        title: '🛏️ Bed Status Override',
        message: `Bed ${bedId} updated to ${newStatus}`,
        severity: 'NORMAL'
      },
      ...prev
    ]);
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

    // If treatmentStatus is DISCHARGED, release bed back to AVAILABLE
    if (treatmentStatus === 'DISCHARGED') {
      setHospitals((prev) =>
        prev.map((hosp) => {
          const updatedBeds = (hosp.beds || []).map((b, idx) =>
            idx === 0 ? { ...b, status: 'AVAILABLE', patientName: null } : b
          );
          return {
            ...hosp,
            beds: updatedBeds,
            availableBeds: updatedBeds.filter((b) => b.status === 'AVAILABLE').length
          };
        })
      );
    }

    setAlerts((prev) => [
      {
        id: 'alt-' + Date.now(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        title: `🏥 Patient Lifecycle: ${treatmentStatus}`,
        message: `Patient treatment status updated to ${treatmentStatus}`,
        severity: 'NORMAL'
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

    startTrip({
      ambulanceId: match.ambulance.id,
      patientName: unassigned.patientName,
      age: unassigned.age,
      conditionCategory: unassigned.emergencyType,
      hospitalId: 'hosp-1'
    });
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
        generateRandomRequests: () => {},
        generateCriticalRequest: () => {},
        clearEmergencyRequests: () => setEmergencyRequests([]),
        resetDemoData,
        runDbscanAnalysis,
        resetHotspots: () => setDbscanHotspots([]),
        dispatchNextRequest,
        autoDispatchAll: dispatchNextRequest,
        manualAssignAmbulance: () => {},
        unassignAmbulance: () => {},
        resetDispatchQueue: resetDemoData,
        toggleRoadBlock: () => {},
        stepDijkstraAnimation: () => {},
        startEmergencyTrip: startTrip,
        startTrip,
        stepCheckpoint: () => {},
        simulateArrival: () => updatePatientStatus('pat-1', 'ARRIVED'),
        simulateDischarge: () => updatePatientStatus('pat-1', 'DISCHARGED'),
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
