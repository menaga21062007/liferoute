import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  GOVERNMENT_HOSPITALS,
  INITIAL_AMBULANCES,
  INITIAL_TRAFFIC_SIGNALS,
  INITIAL_SOS_EMERGENCIES,
  SAMPLE_ROUTE_WAYPOINTS
} from '../../server/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [activeRole, setActiveRole] = useState('sos'); // 'sos' | 'callcentre' | 'ambulance' | 'hospital' | 'corridor'
  const [selectedHospitalId, setSelectedHospitalId] = useState('hosp-1');
  const [hospitals, setHospitals] = useState(GOVERNMENT_HOSPITALS);
  const [ambulances, setAmbulances] = useState(INITIAL_AMBULANCES);
  const [trafficSignals, setTrafficSignals] = useState(INITIAL_TRAFFIC_SIGNALS);
  const [sosEmergencies, setSosEmergencies] = useState(INITIAL_SOS_EMERGENCIES);

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
      // 1. Advance active ambulances along route
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
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Update distance & blue light state for signals based on active ambulance distance (<200m = 0.2km)
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
            blueLightActive: distKm <= 0.2
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

  // Citizen trigger SOS
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
        address: 'Suburban Pickup Point (Grand Ave)'
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

  // Call Centre operator assigns ambulance
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

  // Ambulance crew scene vitals entry
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

  // Ambulance status progression
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
        createSosEmergency,
        assignAmbulance,
        updatePatientSceneDetails,
        updateAmbulanceStatus
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);


