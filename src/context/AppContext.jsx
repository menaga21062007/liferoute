import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import {
  GOVERNMENT_HOSPITALS,
  INITIAL_AMBULANCES,
  INITIAL_TRAFFIC_SIGNALS,
  INITIAL_SOS_EMERGENCIES,
  SAMPLE_ROUTE_WAYPOINTS
} from '../../server/mockData';

const AppContext = createContext();
const BACKEND_URL = 'http://localhost:5000';

const INITIAL_BEDS_BY_HOSPITAL = {
  'hosp-1': [
    { id: 'h1-101', hospitalId: 'hosp-1', number: '101', type: 'ICU Bed', status: 'AVAILABLE', patientName: 'Unassigned' },
    { id: 'h1-102', hospitalId: 'hosp-1', number: '102', type: 'ICU Bed', status: 'AVAILABLE', patientName: 'Unassigned' },
    { id: 'h1-103', hospitalId: 'hosp-1', number: '103', type: 'ICU Bed', status: 'RESERVED', patientName: 'Citizen Patient (AMB-101)' },
    { id: 'h1-104', hospitalId: 'hosp-1', number: '104', type: 'ICU Bed', status: 'CLEANING', patientName: 'Sanitizing' },
    { id: 'h1-105', hospitalId: 'hosp-1', number: '105', type: 'ICU Bed', status: 'OCCUPIED', patientName: 'Ramesh Kumar' },
    { id: 'h1-106', hospitalId: 'hosp-1', number: '106', type: 'Emergency Bed', status: 'AVAILABLE', patientName: 'Unassigned' },
    { id: 'h1-107', hospitalId: 'hosp-1', number: '107', type: 'Emergency Bed', status: 'AVAILABLE', patientName: 'Unassigned' },
    { id: 'h1-108', hospitalId: 'hosp-1', number: '108', type: 'Emergency Bed', status: 'RESERVED', patientName: 'Sita Devi (AMB-102)' },
    { id: 'h1-109', hospitalId: 'hosp-1', number: '109', type: 'Emergency Bed', status: 'CLEANING', patientName: 'Sanitizing' },
    { id: 'h1-110', hospitalId: 'hosp-1', number: '110', type: 'Emergency Bed', status: 'AVAILABLE', patientName: 'Unassigned' },
    { id: 'h1-111', hospitalId: 'hosp-1', number: '111', type: 'Trauma Bay', status: 'AVAILABLE', patientName: 'Unassigned' },
    { id: 'h1-112', hospitalId: 'hosp-1', number: '112', type: 'Trauma Bay', status: 'OCCUPIED', patientName: 'Vikram Singh' }
  ],
  'hosp-2': [
    { id: 'h2-201', hospitalId: 'hosp-2', number: '201', type: 'ICU Bed', status: 'AVAILABLE', patientName: 'Unassigned' },
    { id: 'h2-202', hospitalId: 'hosp-2', number: '202', type: 'ICU Bed', status: 'AVAILABLE', patientName: 'Unassigned' },
    { id: 'h2-203', hospitalId: 'hosp-2', number: '203', type: 'ICU Bed', status: 'AVAILABLE', patientName: 'Unassigned' },
    { id: 'h2-204', hospitalId: 'hosp-2', number: '204', type: 'ICU Bed', status: 'RESERVED', patientName: 'Anand Sharma' },
    { id: 'h2-205', hospitalId: 'hosp-2', number: '205', type: 'ICU Bed', status: 'CLEANING', patientName: 'Sanitizing' },
    { id: 'h2-206', hospitalId: 'hosp-2', number: '206', type: 'Emergency Bed', status: 'AVAILABLE', patientName: 'Unassigned' },
    { id: 'h2-207', hospitalId: 'hosp-2', number: '207', type: 'Emergency Bed', status: 'AVAILABLE', patientName: 'Unassigned' },
    { id: 'h2-208', hospitalId: 'hosp-2', number: '208', type: 'Emergency Bed', status: 'OCCUPIED', patientName: 'Meena Reddy' },
    { id: 'h2-209', hospitalId: 'hosp-2', number: '209', type: 'Emergency Bed', status: 'AVAILABLE', patientName: 'Unassigned' },
    { id: 'h2-210', hospitalId: 'hosp-2', number: '210', type: 'Emergency Bed', status: 'AVAILABLE', patientName: 'Unassigned' },
    { id: 'h2-211', hospitalId: 'hosp-2', number: '211', type: 'Trauma Bay', status: 'CLEANING', patientName: 'Sanitizing' },
    { id: 'h2-212', hospitalId: 'hosp-2', number: '212', type: 'Trauma Bay', status: 'RESERVED', patientName: 'Karthik Raja' }
  ],
  'hosp-3': [
    { id: 'h3-301', hospitalId: 'hosp-3', number: '301', type: 'ICU Bed', status: 'AVAILABLE', patientName: 'Unassigned' },
    { id: 'h3-302', hospitalId: 'hosp-3', number: '302', type: 'ICU Bed', status: 'AVAILABLE', patientName: 'Unassigned' },
    { id: 'h3-303', hospitalId: 'hosp-3', number: '303', type: 'ICU Bed', status: 'CLEANING', patientName: 'Sanitizing' },
    { id: 'h3-304', hospitalId: 'hosp-3', number: '304', type: 'ICU Bed', status: 'OCCUPIED', patientName: 'Sunita Patel' },
    { id: 'h3-305', hospitalId: 'hosp-3', number: '305', type: 'ICU Bed', status: 'OCCUPIED', patientName: 'Abdul Rahman' },
    { id: 'h3-306', hospitalId: 'hosp-3', number: '306', type: 'Emergency Bed', status: 'AVAILABLE', patientName: 'Unassigned' },
    { id: 'h3-307', hospitalId: 'hosp-3', number: '307', type: 'Emergency Bed', status: 'RESERVED', patientName: 'Divya Nair' },
    { id: 'h3-308', hospitalId: 'hosp-3', number: '308', type: 'Emergency Bed', status: 'RESERVED', patientName: 'Pooja Verma' },
    { id: 'h3-309', hospitalId: 'hosp-3', number: '309', type: 'Emergency Bed', status: 'AVAILABLE', patientName: 'Unassigned' },
    { id: 'h3-310', hospitalId: 'hosp-3', number: '310', type: 'Emergency Bed', status: 'AVAILABLE', patientName: 'Unassigned' },
    { id: 'h3-311', hospitalId: 'hosp-3', number: '311', type: 'Trauma Bay', status: 'AVAILABLE', patientName: 'Unassigned' },
    { id: 'h3-312', hospitalId: 'hosp-3', number: '312', type: 'Trauma Bay', status: 'CLEANING', patientName: 'Sanitizing' }
  ]
};


export const AppProvider = ({ children }) => {
  const [activeRole, setActiveRole] = useState('sos'); // Default primary view: Citizen SOS ('sos')

  const [selectedHospitalId, setSelectedHospitalId] = useState('hosp-1');
  const [hospitals, setHospitals] = useState(GOVERNMENT_HOSPITALS);
  const [ambulances, setAmbulances] = useState(INITIAL_AMBULANCES);
  const [trafficSignals, setTrafficSignals] = useState(INITIAL_TRAFFIC_SIGNALS);
  const [sosEmergencies, setSosEmergencies] = useState(INITIAL_SOS_EMERGENCIES);
  const [hospitalBedsMap, setHospitalBedsMap] = useState(INITIAL_BEDS_BY_HOSPITAL);
  const [isBackendConnected, setIsBackendConnected] = useState(false);



  // Real-Time Socket.io Backend Connection
  useEffect(() => {
    const socket = io(BACKEND_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      timeout: 3000
    });

    socket.on('connect', () => {
      console.log('⚡ Connected to LifeRoute Backend Server via Socket.io');
      setIsBackendConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('🔌 Disconnected from Backend Server, using local state fallback');
      setIsBackendConnected(false);
    });

    socket.on('STATE_UPDATE', (data) => {
      if (data.hospitals) setHospitals(data.hospitals);
      if (data.ambulances) setAmbulances(data.ambulances);
      if (data.trafficSignals) setTrafficSignals(data.trafficSignals);
      if (data.sosEmergencies) setSosEmergencies(data.sosEmergencies);
    });

    // Initial fetch from backend REST endpoint
    fetch(`${BACKEND_URL}/api/state`)
      .then((res) => res.json())
      .then((data) => {
        if (data.hospitals) setHospitals(data.hospitals);
        if (data.ambulances) setAmbulances(data.ambulances);
        if (data.trafficSignals) setTrafficSignals(data.trafficSignals);
        if (data.sosEmergencies) setSosEmergencies(data.sosEmergencies);
      })
      .catch((err) => console.log('Backend server starting or local mode fallback:', err));

    return () => {
      socket.disconnect();
    };
  }, []);

  // Calculate distance between two lat/lng pairs in kilometers
  const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Continuous movement and 200m signal blue light logic
  useEffect(() => {
    const interval = setInterval(() => {
      // Advance active ambulances along route
      setAmbulances((prevAmbs) =>
        prevAmbs.map((amb) => {
          if (
            amb.status === 'EN_ROUTE_TO_PATIENT' ||
            amb.status === 'PATIENT_ON_BOARD' ||
            amb.status === 'ON_WAY_TO_HOSPITAL'
          ) {
            const currentIdx = amb.currentWaypointIndex || 0;
            const nextIdx = (currentIdx + 1) % SAMPLE_ROUTE_WAYPOINTS.length;
            return {
              ...amb,
              currentWaypointIndex: nextIdx,
              currentLocation: {
                lat: SAMPLE_ROUTE_WAYPOINTS[nextIdx].lat,
                lng: SAMPLE_ROUTE_WAYPOINTS[nextIdx].lng
              }
            };
          }
          return amb;
        })
      );
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  // Update distance & blue light state for signals based on active ambulance distance (<= 0.35 km)
  useEffect(() => {
    const activeAmbulance = ambulances.find(
      (a) =>
        a.status === 'EN_ROUTE_TO_PATIENT' ||
        a.status === 'PATIENT_ON_BOARD' ||
        a.status === 'ON_WAY_TO_HOSPITAL'
    );

    setTrafficSignals((prevSignals) =>
      prevSignals.map((sig) => {
        if (activeAmbulance && activeAmbulance.currentLocation) {
          const distKm = calculateDistanceKm(
            activeAmbulance.currentLocation.lat,
            activeAmbulance.currentLocation.lng,
            sig.location.lat,
            sig.location.lng
          );
          return {
            ...sig,
            distanceToAmbulanceKm: parseFloat(distKm.toFixed(2)),
            blueLightActive: distKm <= 0.35
          };
        }

        return {
          ...sig,
          distanceToAmbulanceKm: null,
          blueLightActive: false
        };
      })
    );
  }, [ambulances]);

  // Citizen trigger SOS (connected to backend)
  const createSosEmergency = async (sosData) => {
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
        address: 'Suburban Pickup Point (Grand Ave)'
      },
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'PENDING_DISPATCH',
      assignedAmbulanceCode: null,
      targetHospitalId: 'hosp-1',
      vitals: null
    };

    // Dispatch to Backend REST API
    try {
      await fetch(`${BACKEND_URL}/api/sos/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sosData)
      });
    } catch (e) {
      console.log('Sending SOS locally:', e);
    }

    setSosEmergencies((prev) => [newSos, ...prev]);
    return newSos;
  };

  // Automatically find nearest hospital with available beds
  const findBestAvailableHospital = (pickupLocation = { lat: 9.920000, lng: 78.116000 }) => {
    const openHospitals = hospitals.filter((h) => h.availableBeds > 0);
    const candidates = openHospitals.length > 0 ? openHospitals : hospitals;

    const ranked = candidates.map((h) => {
      const dist = calculateDistanceKm(
        pickupLocation.lat || 9.920000,
        pickupLocation.lng || 78.116000,
        h.location.lat,
        h.location.lng
      );
      return { ...h, dist };
    });

    ranked.sort((a, b) => a.dist - b.dist);
    return ranked[0] || hospitals[0];
  };

  // Call Centre operator assigns ambulance (connected to backend)
  const assignAmbulance = async (sosId, ambulanceCode) => {
    const sos = sosEmergencies.find((s) => s.id === sosId);
    const targetHosp = findBestAvailableHospital(sos?.pickupLocation);

    try {
      await fetch(`${BACKEND_URL}/api/dispatch/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sosId, ambulanceCode, targetHospitalId: targetHosp.id })
      });
    } catch (e) {
      console.log('Dispatching ambulance locally:', e);
    }

    setSosEmergencies((prev) =>
      prev.map((s) =>
        s.id === sosId
          ? {
              ...s,
              status: 'ASSIGNED',
              assignedAmbulanceCode: ambulanceCode,
              targetHospitalId: targetHosp.id
            }
          : s
      )
    );

    setAmbulances((prev) =>
      prev.map((amb) => {
        if (amb.code === ambulanceCode || amb.id === ambulanceCode) {
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
              pickupLocation: sos?.pickupLocation || { lat: 9.920000, lng: 78.116000 }
            }
          };
        }
        return amb;
      })
    );
  };



  // Ambulance crew scene vitals entry (connected to backend)
  const updatePatientSceneDetails = async (ambulanceCode, sceneData) => {
    try {
      await fetch(`${BACKEND_URL}/api/patient/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ambulanceCode, ...sceneData })
      });
    } catch (e) {
      console.log('Updating scene vitals locally:', e);
    }

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

  // Ambulance status progression (connected to backend)
  const updateAmbulanceStatus = async (ambulanceCode, newStatus) => {
    try {
      await fetch(`${BACKEND_URL}/api/status/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ambulanceCode, newStatus })
      });
    } catch (e) {
      console.log('Updating ambulance status locally:', e);
    }

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

    setSosEmergencies((prev) =>
      prev.map((sos) => {
        const amb = ambulances.find((a) => a.code === ambulanceCode || a.id === ambulanceCode);
        if (sos.id === amb?.assignedEmergencyId) {
          return {
            ...sos,
            status: newStatus === 'ARRIVED_AT_HOSPITAL' ? 'COMPLETED' : newStatus
          };
        }
        return sos;
      })
    );
  };

  // Update Bed Status (AVAILABLE, RESERVED, CLEANING, OCCUPIED) & Patient Name per hospital
  const updateBedStatus = (hospitalId, bedId, newStatus, newPatientName = null) => {
    setHospitalBedsMap((prevMap) => {
      const hospitalBeds = prevMap[hospitalId] || [];
      const updatedBeds = hospitalBeds.map((b) => {
        if (b.id === bedId) {
          let updatedName = newPatientName !== null ? newPatientName : b.patientName;
          if (newStatus === 'AVAILABLE') updatedName = 'Unassigned';
          else if (newStatus === 'CLEANING') updatedName = 'Sanitizing';
          return { ...b, status: newStatus, patientName: updatedName };
        }
        return b;
      });
      const newMap = { ...prevMap, [hospitalId]: updatedBeds };

      // Update hospital availableBeds counter in state
      const newAvailableCount = updatedBeds.filter((b) => b.status === 'AVAILABLE').length;
      setHospitals((prevHospitals) =>
        prevHospitals.map((h) =>
          h.id === hospitalId ? { ...h, availableBeds: newAvailableCount } : h
        )
      );

      return newMap;
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
        sosEmergencies,
        hospitalBedsMap,
        isBackendConnected,
        createSosEmergency,
        assignAmbulance,
        findBestAvailableHospital,
        updatePatientSceneDetails,
        updateAmbulanceStatus,
        updateBedStatus
      }}
    >
      {children}
    </AppContext.Provider>
  );
};


export const useApp = () => useContext(AppContext);





