import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import {
  INITIAL_HOSPITALS,
  INITIAL_AMBULANCES,
  INITIAL_TRAFFIC_SIGNALS,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_TRIP_HISTORY
} from '../../server/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [activeRole, setActiveRole] = useState('command');
  const [selectedHospitalId, setSelectedHospitalId] = useState('hosp-1');
  const [hospitals, setHospitals] = useState(INITIAL_HOSPITALS);
  const [ambulances, setAmbulances] = useState(INITIAL_AMBULANCES);
  const [trafficSignals, setTrafficSignals] = useState(INITIAL_TRAFFIC_SIGNALS);
  const [alerts, setAlerts] = useState([
    { id: "alt-1", timestamp: "10:15:20 AM", title: "Emergency System Ready", message: "LifeRoute network active. Paramedic crew ready for patient intake.", severity: "NORMAL" }
  ]);
  const [activityLogs, setActivityLogs] = useState(INITIAL_ACTIVITY_LOGS);
  const [tripHistory, setTripHistory] = useState(INITIAL_TRIP_HISTORY);
  const [isSimulationRunning, setIsSimulationRunning] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

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
      if (data.isSimulationRunning !== undefined) setIsSimulationRunning(data.isSimulationRunning);
    });

    fetch('/api/state')
      .then((res) => res.json())
      .then((data) => {
        if (data.hospitals && data.hospitals.length > 0) setHospitals(data.hospitals);
        if (data.ambulances && data.ambulances.length > 0) setAmbulances(data.ambulances);
        if (data.trafficSignals && data.trafficSignals.length > 0) setTrafficSignals(data.trafficSignals);
        if (data.alerts && data.alerts.length > 0) setAlerts(data.alerts);
        if (data.activityLogs && data.activityLogs.length > 0) setActivityLogs(data.activityLogs);
        if (data.tripHistory && data.tripHistory.length > 0) setTripHistory(data.tripHistory);
      })
      .catch((err) => console.log('Standalone Netlify mode active (using client state engine)'));

    return () => socketInstance.disconnect();
  }, []);

  // Client-side standalone simulation ticker for standalone Netlify deployments
  useEffect(() => {
    if (!isSimulationRunning) return;

    const interval = setInterval(() => {
      setAmbulances((prevAmbs) =>
        prevAmbs.map((amb) => {
          if (amb.status !== 'EN_ROUTE' || !amb.route || amb.route.length === 0) return amb;

          const nextIndex = (amb.currentWaypointIndex + 1) % amb.route.length;
          const nextLocation = amb.route[nextIndex];
          const rawEta = amb.etaMinutes > 1 ? amb.etaMinutes - 0.5 : 1;
          const cleanEta = Math.max(1, Math.round(rawEta));

          return {
            ...amb,
            currentWaypointIndex: nextIndex,
            currentLocation: nextLocation,
            etaMinutes: cleanEta
          };
        })
      );

      // Decrement signal countdowns
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
    }, 2500);

    return () => clearInterval(interval);
  }, [isSimulationRunning]);

  // Actions with both API try & instant client state fallback
  const startTrip = async (tripData) => {
    try {
      await fetch('/api/trips/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tripData)
      });
    } catch (e) {
      console.log('Client start trip fallback');
    }

    setAmbulances((prev) =>
      prev.map((amb) => {
        if (amb.code === 'AMB-101' || amb.id === tripData.ambulanceId) {
          return {
            ...amb,
            status: 'EN_ROUTE',
            etaMinutes: 4,
            patient: {
              id: 'pat-' + Date.now(),
              name: tripData.patientName || 'Menaga',
              age: tripData.age || 54,
              gender: tripData.gender || 'Male',
              bloodGroup: tripData.bloodGroup || 'O+',
              conditionCategory: tripData.conditionCategory || 'Cardiac Arrest / STEMI',
              vitals: { hr: 117, bp: '148/94', spo2: '94%', temp: '37.2°C' }
            }
          };
        }
        return amb;
      })
    );

    // Trigger green corridor on traffic signal TS-01 & TS-02
    setTrafficSignals((prev) =>
      prev.map((sig) => {
        if (sig.code === 'TS-01' || sig.code === 'TS-02') {
          return {
            ...sig,
            status: 'GREEN',
            mode: 'GREEN_CORRIDOR_ACTIVE',
            countdownSeconds: 30,
            activeAmbulanceId: 'AMB-101',
            distanceToAmbulance: 250
          };
        }
        return sig;
      })
    );

    setAlerts((prev) => [
      {
        id: 'alt-' + Date.now(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        title: 'Emergency Dispatch Active',
        message: `AMB-101 en route with ${tripData.patientName || 'Menaga'} (${tripData.conditionCategory || 'Cardiac Arrest'}) to Velammal Global Hospital`,
        severity: 'HIGH'
      },
      ...prev
    ]);
  };

  const stepCheckpoint = async () => {
    try {
      await fetch('/api/simulation/step-checkpoint', { method: 'POST' });
    } catch (e) {}

    setAmbulances((prev) =>
      prev.map((amb) => {
        if (amb.status !== 'EN_ROUTE' || !amb.route) return amb;
        const nextIdx = (amb.currentWaypointIndex + 1) % amb.route.length;
        return {
          ...amb,
          currentWaypointIndex: nextIdx,
          currentLocation: amb.route[nextIdx]
        };
      })
    );
  };

  const simulateArrival = async () => {
    try {
      await fetch('/api/simulation/simulate-arrival', { method: 'POST' });
    } catch (e) {}

    setAmbulances((prev) =>
      prev.map((amb) => (amb.code === 'AMB-101' ? { ...amb, status: 'ARRIVED', etaMinutes: 0 } : amb))
    );
  };

  const simulateDischarge = async () => {
    try {
      await fetch('/api/simulation/simulate-discharge', { method: 'POST' });
    } catch (e) {}

    setAmbulances((prev) =>
      prev.map((amb) => (amb.code === 'AMB-101' ? { ...amb, status: 'IDLE', patient: null, etaMinutes: 0 } : amb))
    );
  };

  const updatePatientStatus = async (patientId, treatmentStatus) => {
    try {
      await fetch(`/api/patients/${patientId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ treatmentStatus })
      });
    } catch (e) {}
  };

  const updateBedStatus = async (hospitalId, bedId, newStatus) => {
    try {
      await fetch(`/api/hospitals/${hospitalId}/beds/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bedId, newStatus })
      });
    } catch (e) {}

    setHospitals((prev) =>
      prev.map((hosp) => {
        if (hosp.id === hospitalId || hosp.code === 'VGH' || hosp.name.includes('Velammal')) {
          const updatedBeds = (hosp.beds || []).map((b) => (b.id === bedId ? { ...b, status: newStatus } : b));
          const availCount = updatedBeds.filter((b) => b.status === 'AVAILABLE').length;
          return {
            ...hosp,
            availableBeds: availCount,
            beds: updatedBeds
          };
        }
        return hosp;
      })
    );
  };

  const toggleTrafficSignal = async (signalId, targetStatus, extendSeconds) => {
    try {
      await fetch(`/api/signals/${signalId}/override`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: targetStatus, mode: 'MANUAL_OVERRIDE', extendSeconds })
      });
    } catch (e) {}

    setTrafficSignals((prev) =>
      prev.map((sig) => {
        if (sig.id === signalId || sig.code === signalId) {
          return {
            ...sig,
            status: targetStatus,
            mode: 'MANUAL_OVERRIDE',
            countdownSeconds: extendSeconds || (targetStatus === 'GREEN' ? 30 : 0)
          };
        }
        return sig;
      })
    );
  };

  const toggleSimulation = async () => {
    try {
      await fetch('/api/simulation/toggle', { method: 'POST' });
    } catch (e) {}
    setIsSimulationRunning((prev) => !prev);
  };

  const resetSimulation = async () => {
    try {
      await fetch('/api/simulation/reset', { method: 'POST' });
    } catch (e) {}
    setHospitals(INITIAL_HOSPITALS);
    setAmbulances(INITIAL_AMBULANCES);
    setTrafficSignals(INITIAL_TRAFFIC_SIGNALS);
    setActivityLogs(INITIAL_ACTIVITY_LOGS);
    setTripHistory(INITIAL_TRIP_HISTORY);
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
        isSimulationRunning,
        isConnected,
        startEmergencyTrip: startTrip,
        startTrip,
        stepCheckpoint,
        simulateArrival,
        simulateDischarge,
        updatePatientStatus,
        updatePatientTreatmentStatus: updatePatientStatus,
        updateBedStatus,
        toggleTrafficSignal,
        toggleSimulation,
        resetSimulation
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
