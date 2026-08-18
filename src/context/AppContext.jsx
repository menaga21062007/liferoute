import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [activeRole, setActiveRole] = useState('command');
  const [selectedHospitalId, setSelectedHospitalId] = useState('hosp-1');
  const [hospitals, setHospitals] = useState([]);
  const [ambulances, setAmbulances] = useState([]);
  const [trafficSignals, setTrafficSignals] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [tripHistory, setTripHistory] = useState([]);
  const [isSimulationRunning, setIsSimulationRunning] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketInstance = io(window.location.origin, {
      reconnectionAttempts: 5,
      timeout: 5000,
    });

    socketInstance.on('connect', () => setIsConnected(true));
    socketInstance.on('disconnect', () => setIsConnected(false));

    socketInstance.on('STATE_UPDATE', (data) => {
      if (data.hospitals) setHospitals(data.hospitals);
      if (data.ambulances) setAmbulances(data.ambulances);
      if (data.trafficSignals) setTrafficSignals(data.trafficSignals);
      if (data.alerts) setAlerts(data.alerts);
      if (data.activityLogs) setActivityLogs(data.activityLogs);
      if (data.tripHistory) setTripHistory(data.tripHistory);
      if (data.isSimulationRunning !== undefined) setIsSimulationRunning(data.isSimulationRunning);
    });

    socketInstance.on('NEW_ALERT', (newAlert) => {
      setAlerts((prev) => [newAlert, ...prev.slice(0, 25)]);
    });

    socketInstance.on('NEW_LOG', (newLog) => {
      setActivityLogs((prev) => [newLog, ...prev.slice(0, 45)]);
    });

    fetch('/api/state')
      .then((res) => res.json())
      .then((data) => {
        if (data.hospitals) setHospitals(data.hospitals);
        if (data.ambulances) setAmbulances(data.ambulances);
        if (data.trafficSignals) setTrafficSignals(data.trafficSignals);
        if (data.alerts) setAlerts(data.alerts);
        if (data.activityLogs) setActivityLogs(data.activityLogs);
        if (data.tripHistory) setTripHistory(data.tripHistory);
      })
      .catch((err) => console.log('API state fetch fallback:', err));

    return () => socketInstance.disconnect();
  }, []);

  const startEmergencyTrip = async (ambulanceId, patientDetails, targetHospitalId, startLocation) => {
    try {
      const res = await fetch('/api/trips/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ambulanceId, patientDetails, targetHospitalId, startLocation })
      });
      return await res.json();
    } catch (err) {
      console.error('Failed to start trip:', err);
    }
  };

  const stepCheckpoint = async () => {
    try {
      await fetch('/api/simulation/step-checkpoint', { method: 'POST' });
    } catch (err) {
      console.error('Failed to step checkpoint:', err);
    }
  };

  const simulateArrival = async () => {
    try {
      await fetch('/api/simulation/simulate-arrival', { method: 'POST' });
    } catch (err) {
      console.error('Failed to simulate arrival:', err);
    }
  };

  const simulateDischarge = async () => {
    try {
      await fetch('/api/simulation/simulate-discharge', { method: 'POST' });
    } catch (err) {
      console.error('Failed to simulate discharge:', err);
    }
  };

  const updatePatientTreatmentStatus = async (patientId, treatmentStatus, ambulanceCode) => {
    try {
      await fetch(`/api/patients/${patientId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ treatmentStatus, ambulanceCode })
      });
    } catch (err) {
      console.error('Failed to update patient status:', err);
    }
  };

  const updateBedStatus = async (hospitalId, bedId, newStatus, patientName) => {
    try {
      await fetch(`/api/hospitals/${hospitalId}/beds/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bedId, newStatus, patientName })
      });
    } catch (err) {
      console.error('Failed to update bed:', err);
    }
  };

  const assignDoctorToPatient = async (hospitalId, doctorId, patientName) => {
    try {
      await fetch(`/api/hospitals/${hospitalId}/doctors/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doctorId, patientName })
      });
    } catch (err) {
      console.error('Failed to assign doctor:', err);
    }
  };

  const toggleTrafficSignal = async (signalId, targetStatus, extendSeconds) => {
    try {
      await fetch(`/api/signals/${signalId}/override`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: targetStatus, mode: 'MANUAL_OVERRIDE', extendSeconds })
      });
    } catch (err) {
      console.error('Failed to toggle signal:', err);
    }
  };

  const toggleSimulation = async () => {
    try {
      await fetch('/api/simulation/toggle', { method: 'POST' });
    } catch (err) {
      console.error('Failed to toggle simulation:', err);
    }
  };

  const resetSimulation = async () => {
    try {
      await fetch('/api/simulation/reset', { method: 'POST' });
    } catch (err) {
      console.error('Failed to reset simulation:', err);
    }
  };

  const recommendHospitalsApi = async (patientLocation, conditionCategory) => {
    try {
      const res = await fetch('/api/recommend-hospital', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientLocation, conditionCategory })
      });
      return await res.json();
    } catch (err) {
      console.error('Failed to get recommendations:', err);
      return [];
    }
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
        startEmergencyTrip,
        stepCheckpoint,
        simulateArrival,
        simulateDischarge,
        updatePatientTreatmentStatus,
        updateBedStatus,
        assignDoctorToPatient,
        toggleTrafficSignal,
        toggleSimulation,
        resetSimulation,
        recommendHospitalsApi
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
