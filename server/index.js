import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import {
  GOVERNMENT_HOSPITALS,
  INITIAL_AMBULANCES,
  INITIAL_TRAFFIC_SIGNALS,
  INITIAL_SOS_EMERGENCIES,
  SAMPLE_ROUTE_WAYPOINTS
} from './mockData.js';
import { calculateDistanceKm } from './recommendationEngine.js';

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*", methods: ["GET", "POST"] } });

let hospitals = JSON.parse(JSON.stringify(GOVERNMENT_HOSPITALS));
let ambulances = JSON.parse(JSON.stringify(INITIAL_AMBULANCES));
let trafficSignals = JSON.parse(JSON.stringify(INITIAL_TRAFFIC_SIGNALS));
let sosEmergencies = JSON.parse(JSON.stringify(INITIAL_SOS_EMERGENCIES));

function broadcastFullState() {
  io.emit("STATE_UPDATE", { hospitals, ambulances, trafficSignals, sosEmergencies });
}

app.get('/api/state', (req, res) => {
  res.json({ hospitals, ambulances, trafficSignals, sosEmergencies });
});

// Citizen SOS Submission
app.post('/api/sos/create', (req, res) => {
  const { patientName, phone, age, gender, emergencyType, pickupLocation } = req.body;
  const newSos = {
    id: `SOS-${Date.now().toString().slice(-4)}`,
    patientName: patientName || "Emergency Patient",
    phone: phone || "9876543210",
    age: age || 45,
    gender: gender || "Male",
    emergencyType: emergencyType || "Accident",
    pickupLocation: pickupLocation || { lat: 40.715000, lng: -73.955000, address: "Suburban Pickup Point" },
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: "PENDING_DISPATCH",
    assignedAmbulanceCode: null,
    targetHospitalId: "hosp-1",
    vitals: null
  };
  sosEmergencies.unshift(newSos);
  broadcastFullState();
  res.json({ success: true, sos: newSos });
});

// Call Centre Ambulance Assignment
app.post('/api/dispatch/assign', (req, res) => {
  const { sosId, ambulanceCode, targetHospitalId } = req.body;
  const sos = sosEmergencies.find(s => s.id === sosId);
  const amb = ambulances.find(a => a.code === ambulanceCode || a.id === ambulanceCode);

  if (!sos || !amb) return res.status(400).json({ error: "Invalid SOS or Ambulance ID" });

  sos.status = "ASSIGNED";
  sos.assignedAmbulanceCode = amb.code;
  sos.targetHospitalId = targetHospitalId || "hosp-1";

  amb.status = "EN_ROUTE_TO_PATIENT";
  amb.assignedEmergencyId = sos.id;
  amb.targetHospitalId = sos.targetHospitalId;
  amb.patient = {
    name: sos.patientName,
    age: sos.age,
    gender: sos.gender,
    phone: sos.phone,
    emergencyType: sos.emergencyType,
    pickupLocation: sos.pickupLocation
  };

  broadcastFullState();
  res.json({ success: true, sos, amb });
});

// Ambulance Crew Scene Vitals Update
app.post('/api/patient/update', (req, res) => {
  const { ambulanceCode, name, age, sex, chiefComplaint, bloodGroup, bp, spo2, pulse } = req.body;
  const amb = ambulances.find(a => a.code === ambulanceCode || a.id === ambulanceCode);
  if (!amb || !amb.patient) return res.status(400).json({ error: "No active patient on unit" });

  amb.patient.name = name || amb.patient.name;
  amb.patient.age = age || amb.patient.age;
  amb.patient.gender = sex || amb.patient.gender;
  amb.patient.chiefComplaint = chiefComplaint || amb.patient.chiefComplaint;
  amb.patient.bloodGroup = bloodGroup || "O+";
  amb.patient.vitals = { bp: bp || "120/80", spo2: spo2 || "98%", pulse: pulse || "78 bpm" };

  broadcastFullState();
  res.json({ success: true, amb });
});

// Ambulance Status Transitions (Patient On Board, Arrived at Hospital)
app.post('/api/status/update', (req, res) => {
  const { ambulanceCode, newStatus } = req.body;
  const amb = ambulances.find(a => a.code === ambulanceCode || a.id === ambulanceCode);
  if (!amb) return res.status(400).json({ error: "Ambulance not found" });

  amb.status = newStatus;
  const sos = sosEmergencies.find(s => s.id === amb.assignedEmergencyId);
  if (sos) sos.status = newStatus;

  if (newStatus === "ARRIVED_AT_HOSPITAL") {
    amb.status = "AVAILABLE";
    amb.assignedEmergencyId = null;
    amb.patient = null;
    if (sos) sos.status = "COMPLETED";
  }

  broadcastFullState();
  res.json({ success: true, amb });
});

// Continuous GPS Ticker & Distance-based Traffic Signal Blue Light calculation (<200m)
setInterval(() => {
  let stateChanged = false;

  // 1. Move en-route ambulances along route
  ambulances.forEach((amb) => {
    if (amb.status === "EN_ROUTE_TO_PATIENT" || amb.status === "PATIENT_ON_BOARD" || amb.status === "ON_WAY_TO_HOSPITAL") {
      stateChanged = true;
      const waypoints = SAMPLE_ROUTE_WAYPOINTS;
      const currentIdx = amb.currentWaypointIndex || 0;
      const nextIdx = (currentIdx + 1) % waypoints.length;
      amb.currentWaypointIndex = nextIdx;
      amb.currentLocation = { lat: waypoints[nextIdx].lat, lng: waypoints[nextIdx].lng };
    }
  });

  // 2. Compute Distance to Signals for active ambulances (<200m threshold = 0.2km)
  const activeAmbulance = ambulances.find(a => a.status === "EN_ROUTE_TO_PATIENT" || a.status === "PATIENT_ON_BOARD" || a.status === "ON_WAY_TO_HOSPITAL");

  trafficSignals.forEach((sig) => {
    if (activeAmbulance && activeAmbulance.currentLocation) {
      const distKm = calculateDistanceKm(
        activeAmbulance.currentLocation.lat,
        activeAmbulance.currentLocation.lng,
        sig.location.lat,
        sig.location.lng
      );
      sig.distanceToAmbulanceKm = parseFloat(distKm.toFixed(2));
      // Turn BLUE LIGHT ON if within 200 meters (0.2 km)
      sig.blueLightActive = distKm <= 0.2;
    } else {
      sig.blueLightActive = false;
      sig.distanceToAmbulanceKm = null;
    }
  });

  if (stateChanged) broadcastFullState();
}, 3000);

io.on("connection", (socket) => {
  socket.emit("STATE_UPDATE", { hospitals, ambulances, trafficSignals, sosEmergencies });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Government Emergency Response Platform Server running on port ${PORT}`);
});

