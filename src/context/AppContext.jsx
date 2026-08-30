import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_HOSPITALS,
  INITIAL_AMBULANCES,
  INITIAL_TRAFFIC_SIGNALS,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_TRIP_HISTORY,
  INITIAL_EMERGENCY_REQUESTS,
  FICTIONAL_ROAD_GRAPH,
  PREDEFINED_ROUTES,
  PREDICTIVE_ANALYTICS_DATA,
  HOSPITAL_RESOURCE_MARKETPLACE,
  INITIAL_SOS_EMERGENCIES,
  SAMPLE_ROUTE_WAYPOINTS
} from '../../server/mockData';
import { runDBSCANClustering } from '../utils/dbscan';
import { findDijkstraShortestPath, findNearestGraphNode } from '../utils/dijkstra';
import { sortPriorityQueue } from '../utils/priorityQueue';

const AppContext = createContext();

const TRANSLATIONS = {
  en: {
    commandCenter: "Command Center & Intelligence",
    ambulanceCrew: "Ambulance Crew & AR HUD",
    hospitalBed: "Hospital & Bed Marketplace",
    trafficControl: "Green Corridor Traffic Control",
    tripHistory: "Incident Replay Mode",
    callCentre: "Government Call Centre",
    patientSos: "Patient SOS",
    activeUnits: "Active Units",
    greenCorridors: "Green Corridors",
    freeBeds: "Free ICU Beds",
    offlineMode: "Offline Mode",
    voiceCommands: "Voice Assistant",
    requestTransfer: "Request Resource Transfer",
    arHudActive: "AR HUD ACTIVE",
  }
};

export const AppProvider = ({ children }) => {
  const [activeRole, setActiveRole] = useState('intelligence'); // Default: Command Center Intelligence
  const [selectedHospitalId, setSelectedHospitalId] = useState('hosp-1');
  const [hospitals, setHospitals] = useState(INITIAL_HOSPITALS);
  const [ambulances, setAmbulances] = useState(INITIAL_AMBULANCES);
  const [trafficSignals, setTrafficSignals] = useState(INITIAL_TRAFFIC_SIGNALS);
  const [sosEmergencies, setSosEmergencies] = useState(INITIAL_SOS_EMERGENCIES);
  const [alerts, setAlerts] = useState([
    { id: "alt-1", timestamp: "10:15:00 AM", title: "Emergency Intelligence Active", message: "All 3 ambulance units ready for dispatch.", severity: "NORMAL" }
  ]);
  const [activityLogs, setActivityLogs] = useState(INITIAL_ACTIVITY_LOGS);
  const [tripHistory, setTripHistory] = useState(INITIAL_TRIP_HISTORY);
  const [marketplaceResources, setMarketplaceResources] = useState(HOSPITAL_RESOURCE_MARKETPLACE);
  const [predictiveAnalytics] = useState(PREDICTIVE_ANALYTICS_DATA);

  // Next-Gen Feature States
  const [language, setLanguage] = useState('en');
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isARHUDActive, setIsARHUDActive] = useState(false);

  const t = (key) => (TRANSLATIONS[language] && TRANSLATIONS[language][key]) || TRANSLATIONS.en[key] || key;

  const [emergencyRequests, setEmergencyRequests] = useState(INITIAL_EMERGENCY_REQUESTS);
  const [dbscanConfig, setDbscanConfig] = useState({ eps: 1.2, minSamples: 3 });
  const [dbscanHotspots, setDbscanHotspots] = useState([]);
  const [roadGraph, setRoadGraph] = useState(FICTIONAL_ROAD_GRAPH);
  const [blockedEdges, setBlockedEdges] = useState([]);

  // Calculate distance between two lat/lng pairs in kilometers
  const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Helper to compute Dijkstra 2-stage route
  const computeDijkstraRoute = (ambLoc, reqLoc, hospId, currentBlocked = []) => {
    const startNode = findNearestGraphNode(roadGraph, ambLoc || { lat: 40.718, lng: -73.950 }) || roadGraph.nodes[1];
    const emergencyNode = findNearestGraphNode(roadGraph, reqLoc || { lat: 40.722, lng: -73.945 }) || roadGraph.nodes[2];

    let hospitalNodeId = 'N5';
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

  const [activeDijkstraRoute, setActiveDijkstraRoute] = useState(() => 
    computeDijkstraRoute({ lat: 40.718, lng: -73.950 }, { lat: 40.722, lng: -73.945 }, 'hosp-1', [])
  );

  const [isSimulationRunning, setIsSimulationRunning] = useState(true);
  const dispatchQueue = sortPriorityQueue(emergencyRequests, dbscanHotspots);

  useEffect(() => {
    const res = runDBSCANClustering(emergencyRequests, dbscanConfig.eps, dbscanConfig.minSamples);
    setDbscanHotspots(res.clusters);
  }, [emergencyRequests, dbscanConfig]);

  // Simulation Ticker
  useEffect(() => {
    if (!isSimulationRunning) return;

    const interval = setInterval(() => {
      setAmbulances((prevAmbs) =>
        prevAmbs.map((amb) => {
          if (amb.status !== 'EN_ROUTE' && amb.status !== 'EN_ROUTE_TO_PATIENT' && amb.status !== 'PATIENT_ON_BOARD' && amb.status !== 'ON_WAY_TO_HOSPITAL') return amb;

          const route = (amb.route && amb.route.length > 0) ? amb.route : SAMPLE_ROUTE_WAYPOINTS;
          const currIdx = amb.currentWaypointIndex || 0;
          const nextIdx = (currIdx + 1) % route.length;
          const nextLoc = route[nextIdx];
          const newEta = Math.max(1, Math.round((route.length - nextIdx) * 0.8));

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

      // Signal Blue Light & Countdown Calculation
      setTrafficSignals((prevSignals) =>
        prevSignals.map((sig) => {
          const activeAmb = ambulances.find(
            (a) => a.status === 'EN_ROUTE' || a.status === 'EN_ROUTE_TO_PATIENT' || a.status === 'PATIENT_ON_BOARD' || a.status === 'ON_WAY_TO_HOSPITAL'
          );

          if (activeAmb && activeAmb.currentLocation && sig.location) {
            const distKm = calculateDistanceKm(
              activeAmb.currentLocation.lat,
              activeAmb.currentLocation.lng,
              sig.location.lat,
              sig.location.lng
            );
            return {
              ...sig,
              distanceToAmbulanceKm: parseFloat(distKm.toFixed(2)),
              blueLightActive: distKm <= 0.2
            };
          }

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
  }, [isSimulationRunning, ambulances]);

  const startTrip = (tripData) => {
    const targetHospId = tripData.hospitalId || 'hosp-1';
    const targetHosp = hospitals.find((h) => h.id === targetHospId || h.code === targetHospId) || hospitals[0];

    let ambToUseId = tripData.ambulanceId;
    if (!ambToUseId) {
      const availAmb = ambulances.find(a => a.status === 'AVAILABLE' || a.status === 'IDLE') || ambulances[0];
      ambToUseId = availAmb.id;
    }

    const ambObj = ambulances.find(a => a.id === ambToUseId || a.code === ambToUseId) || ambulances[0];
    const reqLoc = tripData.location || { lat: 40.722, lng: -73.945 };
    const ambLoc = ambObj.currentLocation || { lat: 40.718, lng: -73.950 };

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

    setEmergencyRequests((prev) =>
      prev.map((r) => {
        if (r.id === tripData.requestId || r.patientName === tripData.patientName) {
          return { ...r, status: 'Ambulance En Route', assignedAmbulanceId: ambObj.code };
        }
        return r;
      })
    );

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
  };

  const createSosEmergency = (sosData) => {
    const newSos = {
      id: `SOS-${Date.now().toString().slice(-4)}`,
      patientName: sosData.patientName || 'Emergency Patient',
      phone: sosData.phone || '9876543210',
      age: sosData.age || 45,
      gender: sosData.gender || 'Male',
      emergencyType: sosData.emergencyType || 'Accident',
      pickupLocation: sosData.pickupLocation || {
        lat: 40.715000,
        lng: -73.955000,
        address: 'Suburban Pickup Point'
      },
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'PENDING_DISPATCH',
      assignedAmbulanceCode: null,
      targetHospitalId: 'hosp-1',
      vitals: null
    };

    setSosEmergencies((prev) => [newSos, ...prev]);
    return newSos;
  };

  const assignAmbulance = (sosId, ambulanceCode, targetHospitalId = 'hosp-1') => {
    const targetHosp = hospitals.find((h) => h.id === targetHospitalId) || hospitals[0];

    setSosEmergencies((prev) =>
      prev.map((sos) =>
        sos.id === sosId
          ? {
              ...sos,
              status: 'ASSIGNED',
              assignedAmbulanceCode: ambulanceCode,
              targetHospitalId: targetHosp.id
            }
          : sos
      )
    );

    setAmbulances((prev) =>
      prev.map((amb) => {
        if (amb.code === ambulanceCode || amb.id === ambulanceCode) {
          const sos = sosEmergencies.find((s) => s.id === sosId);
          return {
            ...amb,
            status: 'EN_ROUTE_TO_PATIENT',
            assignedEmergencyId: sosId,
            targetHospitalId: targetHosp.id,
            patient: {
              name: sos?.patientName || 'Emergency Patient',
              age: sos?.age || 45,
              gender: sos?.gender || 'Male',
              phone: sos?.phone || '9876543210',
              emergencyType: sos?.emergencyType || 'Accident',
              pickupLocation: sos?.pickupLocation || { lat: 40.715000, lng: -73.955000 }
            }
          };
        }
        return amb;
      })
    );
  };

  const updatePatientSceneDetails = (ambulanceCode, sceneData) => {
    setAmbulances((prev) =>
      prev.map((amb) => {
        if (amb.code === ambulanceCode || amb.id === ambulanceCode) {
          if (!amb.patient) return amb;
          return {
            ...amb,
            patient: {
              ...amb.patient,
              name: sceneData.name || amb.patient.name,
              age: sceneData.age || amb.patient.age,
              gender: sceneData.sex || amb.patient.gender,
              chiefComplaint: sceneData.chiefComplaint || 'Accident Trauma',
              bloodGroup: sceneData.bloodGroup || 'O+',
              vitals: {
                bp: sceneData.bp || '120/80',
                spo2: sceneData.spo2 || '98%',
                pulse: sceneData.pulse || '78 bpm'
              }
            }
          };
        }
        return amb;
      })
    );
  };

  const updateAmbulanceStatus = (ambulanceCode, newStatus) => {
    setAmbulances((prev) =>
      prev.map((amb) => {
        if (amb.code === ambulanceCode || amb.id === ambulanceCode) {
          const updatedAmb = { ...amb, status: newStatus };
          if (newStatus === 'ARRIVED_AT_HOSPITAL') {
            updatedAmb.status = 'AVAILABLE';
            updatedAmb.assignedEmergencyId = null;
            updatedAmb.patient = null;
          }
          return updatedAmb;
        }
        return amb;
      })
    );
  };

  const requestResourceTransfer = (resourceId, requestingHospitalName, units = 1) => {
    setMarketplaceResources(prev =>
      prev.map(res => {
        if (res.id === resourceId) {
          const remaining = Math.max(0, res.availableUnits - units);
          return {
            ...res,
            availableUnits: remaining,
            status: remaining === 0 ? 'SURGE_RESERVED' : res.status
          };
        }
        return res;
      })
    );
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
    setMarketplaceResources(HOSPITAL_RESOURCE_MARKETPLACE);
  };

  return (
    <AppContext.Provider
      value={{
        activeRole,
        setActiveRole,
        selectedHospitalId,
        setSelectedHospitalId,
        hospitals,
        setHospitals,
        ambulances,
        setAmbulances,
        trafficSignals,
        setTrafficSignals,
        sosEmergencies,
        setSosEmergencies,
        alerts,
        activityLogs,
        tripHistory,
        marketplaceResources,
        predictiveAnalytics,
        language,
        setLanguage,
        isOfflineMode,
        setIsOfflineMode,
        toggleOfflineMode: () => setIsOfflineMode(prev => !prev),
        isVoiceModalOpen,
        setIsVoiceModalOpen,
        isARHUDActive,
        setIsARHUDActive,
        t,
        requestResourceTransfer,
        emergencyRequests,
        dbscanHotspots,
        dbscanConfig,
        dispatchQueue,
        roadGraph,
        activeDijkstraRoute,
        blockedEdges,
        isSimulationRunning,
        createSosEmergency,
        assignAmbulance,
        dispatchNextRequest: () => {
          createSosEmergency({ patientName: 'Surge Patient', emergencyType: 'Accident' });
        },
        updatePatientSceneDetails,

        updateAmbulanceStatus,
        startEmergencyTrip: startTrip,
        startTrip,
        updatePatientStatus,
        updatePatientTreatmentStatus: updatePatientStatus,
        updateBedStatus,
        toggleSimulation: () => setIsSimulationRunning(prev => !prev),
        resetSimulation: resetDemoData,
        resetDemoData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);



