import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import {
  INITIAL_HOSPITALS,
  INITIAL_AMBULANCES,
  INITIAL_TRAFFIC_SIGNALS,
  EMERGENCY_CATEGORIES,
  PREDEFINED_ROUTES,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_TRIP_HISTORY
} from './mockData.js';
import { recommendHospitals, calculateDistanceKm } from './recommendationEngine.js';
import { updateGreenCorridorSignals } from './trafficController.js';

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*", methods: ["GET", "POST"] } });

let hospitals = JSON.parse(JSON.stringify(INITIAL_HOSPITALS));
let ambulances = JSON.parse(JSON.stringify(INITIAL_AMBULANCES));
let trafficSignals = JSON.parse(JSON.stringify(INITIAL_TRAFFIC_SIGNALS));
let activityLogs = JSON.parse(JSON.stringify(INITIAL_ACTIVITY_LOGS));
let tripHistory = JSON.parse(JSON.stringify(INITIAL_TRIP_HISTORY));
let alerts = [
  {
    id: "alt-1",
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    title: "STEMI Emergency Dispatched",
    message: "AMB-101 assigned to Metropolitan Central Hospital. ETA: 4 mins.",
    type: "CRITICAL",
    ambulanceCode: "AMB-101"
  }
];
let isSimulationRunning = true;

function addActivityLog(event, actor, category, details) {
  const newLog = {
    id: `log-${Date.now()}`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    event,
    actor,
    category,
    details
  };
  activityLogs.unshift(newLog);
  if (activityLogs.length > 50) activityLogs.pop();
  io.emit("NEW_LOG", newLog);
}

function addAlert(title, message, type = "INFO", ambulanceCode = null) {
  const newAlert = {
    id: `alt-${Date.now()}-${Math.floor(Math.random()*1000)}`,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    title,
    message,
    type,
    ambulanceCode
  };
  alerts.unshift(newAlert);
  if (alerts.length > 30) alerts.pop();
  io.emit("NEW_ALERT", newAlert);
}

app.get('/api/state', (req, res) => {
  res.json({ hospitals, ambulances, trafficSignals, alerts, activityLogs, tripHistory, isSimulationRunning });
});

app.get('/api/emergency-categories', (req, res) => {
  res.json(EMERGENCY_CATEGORIES);
});

app.post('/api/recommend-hospital', (req, res) => {
  const { patientLocation, conditionCategory } = req.body;
  const recommendations = recommendHospitals(patientLocation, conditionCategory, hospitals);
  res.json(recommendations);
});

app.post('/api/trips/start', (req, res) => {
  const { ambulanceId, patientDetails, targetHospitalId, startLocation } = req.body;
  const ambIndex = ambulances.findIndex((a) => a.id === ambulanceId || a.code === ambulanceId);
  if (ambIndex === -1) return res.status(404).json({ error: "Ambulance not found" });

  const hospital = hospitals.find((h) => h.id === targetHospitalId);
  if (!hospital) return res.status(404).json({ error: "Hospital not found" });

  const route = targetHospitalId === "hosp-2" ? PREDEFINED_ROUTES.routeBeta : PREDEFINED_ROUTES.routeAlpha;
  const startPos = startLocation || route[0];

  let bedAllocated = null;
  let otAllocated = null;

  if (hospital.availableBeds > 0) {
    hospital.availableBeds -= 1;
    hospital.occupiedBeds += 1;
    bedAllocated = `ICU-${Math.floor(10 + Math.random() * 80)}`;
    hospital.beds.unshift({
      id: `b-${Date.now()}`,
      bedNumber: bedAllocated,
      type: "ICU",
      status: "RESERVED",
      patientName: patientDetails.name,
      condition: patientDetails.conditionCategory,
      assignedDoctor: "Dr. Aris Thorne"
    });
  }

  const categoryConfig = EMERGENCY_CATEGORIES.find(c => c.name === patientDetails.conditionCategory);
  if (categoryConfig && categoryConfig.requiresOT && hospital.availableOTs > 0) {
    hospital.availableOTs -= 1;
    hospital.occupiedOTs += 1;
    otAllocated = `OT-${Math.floor(1 + Math.random() * 4)} (${categoryConfig.requiredSpecialty})`;
    hospital.ots.unshift({
      id: `ot-${Date.now()}`,
      otNumber: otAllocated,
      status: "Scheduled",
      patientName: patientDetails.name,
      procedure: `Emergency ${patientDetails.conditionCategory} Intervention`,
      startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      endTime: "In Progress"
    });
  }

  const distKm = calculateDistanceKm(startPos.lat, startPos.lng, hospital.location.lat, hospital.location.lng);
  const etaMinutes = Math.max(2, Math.round((distKm / 45) * 60));

  ambulances[ambIndex] = {
    ...ambulances[ambIndex],
    status: "EN_ROUTE",
    currentLocation: startPos,
    route: route,
    currentWaypointIndex: 0,
    heading: 45,
    speedKm: 65,
    destinationHospitalId: hospital.id,
    etaMinutes: etaMinutes,
    distanceRemainingKm: parseFloat(distKm.toFixed(1)),
    patient: {
      id: `pat-${Date.now()}`,
      ...patientDetails,
      treatmentStatus: "En route",
      vitals: patientDetails.vitals || {
        hr: 114,
        bpSystolic: 145,
        bpDiastolic: 92,
        spo2: 93,
        temp: 37.1,
        ecgStatus: "Live Telemetry Active"
      }
    },
    teamReady: false,
    allocatedBedNumber: bedAllocated,
    allocatedOtNumber: otAllocated,
    startTime: new Date().toISOString()
  };

  addAlert(
    `🚨 Emergency Trip Started (${ambulances[ambIndex].code})`,
    `Patient ${patientDetails.name} (${patientDetails.conditionCategory}) dispatched to ${hospital.name}. ETA ~${etaMinutes}m.`,
    "CRITICAL",
    ambulances[ambIndex].code
  );

  addActivityLog(
    "Emergency Dispatch Initiated",
    `Ambulance ${ambulances[ambIndex].code}`,
    "AMBULANCE",
    `Patient ${patientDetails.name} heading to ${hospital.code}`
  );

  broadcastFullState();
  res.json({ success: true, ambulance: ambulances[ambIndex], hospital });
});

// Presenter Controls Endpoints
app.post('/api/simulation/step-checkpoint', (req, res) => {
  const amb = ambulances.find(a => a.id === "amb-101" || a.status === "EN_ROUTE");
  if (amb && amb.route && amb.route.length > 0) {
    const nextIdx = Math.min((amb.currentWaypointIndex || 0) + 1, amb.route.length - 1);
    amb.currentWaypointIndex = nextIdx;
    amb.currentLocation = amb.route[nextIdx];

    const destHospital = hospitals.find(h => h.id === amb.destinationHospitalId);
    if (destHospital) {
      const remDist = calculateDistanceKm(amb.currentLocation.lat, amb.currentLocation.lng, destHospital.location.lat, destHospital.location.lng);
      amb.distanceRemainingKm = parseFloat(remDist.toFixed(1));
      amb.etaMinutes = Math.max(1, Math.round((remDist / 45) * 60));
    }

    addActivityLog("Presenter Checkpoint Step", "Demo Operator", "DEMO", `Moved ${amb.code} to Checkpoint ${nextIdx + 1} of ${amb.route.length}`);
    broadcastFullState();
    res.json({ success: true, amb });
  } else {
    res.status(400).json({ error: "No active en-route ambulance to step" });
  }
});

app.post('/api/simulation/simulate-arrival', (req, res) => {
  const amb = ambulances.find(a => a.id === "amb-101" || a.status === "EN_ROUTE");
  if (amb) {
    amb.status = "ARRIVED";
    amb.etaMinutes = 0;
    amb.speedKm = 0;
    if (amb.patient) amb.patient.treatmentStatus = "Arrived";

    const hosp = hospitals.find(h => h.id === amb.destinationHospitalId);
    if (hosp) {
      const bed = hosp.beds.find(b => b.patientName === amb.patient?.name);
      if (bed) bed.status = "OCCUPIED";
    }

    addAlert(`🏥 Ambulance Arrived (${amb.code})`, `Patient ${amb.patient?.name || ''} arrived at ER. Bed state updated to OCCUPIED.`, "SUCCESS", amb.code);
    addActivityLog("Simulated Patient Arrival", "ER Bay Team", "HOSPITAL", `Patient ${amb.patient?.name || ''} handed off`);
    broadcastFullState();
    res.json({ success: true, amb });
  } else {
    res.status(400).json({ error: "No ambulance to arrive" });
  }
});

app.post('/api/simulation/simulate-discharge', (req, res) => {
  const hosp = hospitals[0];
  if (hosp && hosp.beds) {
    hosp.beds.forEach(b => {
      if (b.status === "OCCUPIED" || b.status === "RESERVED") b.status = "AVAILABLE";
    });
    hosp.availableBeds = hosp.totalBeds;
    hosp.occupiedBeds = 0;
  }
  const amb = ambulances.find(a => a.id === "amb-101");
  if (amb) {
    amb.status = "IDLE";
    if (amb.patient) amb.patient.treatmentStatus = "Discharged";
  }

  addAlert("🩺 Patient Discharged", "Beds and resources released to AVAILABLE status.", "SUCCESS");
  addActivityLog("Simulated Discharge", "Hospital Admin", "HOSPITAL", "All reserved/occupied beds released to baseline");
  broadcastFullState();
  res.json({ success: true });
});

app.post('/api/simulation/toggle', (req, res) => {
  isSimulationRunning = !isSimulationRunning;
  broadcastFullState();
  res.json({ isSimulationRunning });
});

app.post('/api/simulation/reset', (req, res) => {
  hospitals = JSON.parse(JSON.stringify(INITIAL_HOSPITALS));
  ambulances = JSON.parse(JSON.stringify(INITIAL_AMBULANCES));
  trafficSignals = JSON.parse(JSON.stringify(INITIAL_TRAFFIC_SIGNALS));
  activityLogs = JSON.parse(JSON.stringify(INITIAL_ACTIVITY_LOGS));
  alerts = [];
  addAlert("🔄 System Reset", "LifeRoute demo state has been reset to baseline.", "INFO");
  broadcastFullState();
  res.json({ success: true });
});

function broadcastFullState() {
  io.emit("STATE_UPDATE", { hospitals, ambulances, trafficSignals, alerts, activityLogs, tripHistory, isSimulationRunning });
}

setInterval(() => {
  if (!isSimulationRunning) return;
  let stateChanged = false;

  ambulances.forEach((amb) => {
    if (amb.status === "EN_ROUTE" && amb.route && amb.route.length > 0) {
      stateChanged = true;
      const currentIdx = amb.currentWaypointIndex || 0;
      const targetIdx = Math.min(currentIdx + 1, amb.route.length - 1);

      if (currentIdx < amb.route.length - 1) {
        const p1 = amb.route[currentIdx];
        const p2 = amb.route[targetIdx];
        const step = 0.05;

        amb.currentLocation = {
          lat: amb.currentLocation.lat + (p2.lat - p1.lat) * step,
          lng: amb.currentLocation.lng + (p2.lng - p1.lng) * step
        };

        const distToNext = calculateDistanceKm(amb.currentLocation.lat, amb.currentLocation.lng, p2.lat, p2.lng);
        if (distToNext < 0.05) amb.currentWaypointIndex = targetIdx;

        const destHospital = hospitals.find(h => h.id === amb.destinationHospitalId);
        if (destHospital) {
          const remDist = calculateDistanceKm(amb.currentLocation.lat, amb.currentLocation.lng, destHospital.location.lat, destHospital.location.lng);
          amb.distanceRemainingKm = parseFloat(remDist.toFixed(1));
          amb.etaMinutes = Math.max(1, Math.round((remDist / 45) * 60));
          if (amb.distanceRemainingKm <= 0.8 && amb.patient) amb.patient.treatmentStatus = "Near hospital";
        }
      } else {
        amb.status = "ARRIVED";
        amb.etaMinutes = 0;
        amb.speedKm = 0;
        if (amb.patient) amb.patient.treatmentStatus = "Arrived";
      }

      if (amb.patient && amb.patient.vitals) {
        const v = amb.patient.vitals;
        v.hr = Math.min(160, Math.max(70, v.hr + Math.floor(Math.random() * 3) - 1));
        v.spo2 = Math.min(100, Math.max(88, v.spo2 + Math.floor(Math.random() * 2) - 1));
      }
    }
  });

  const updatedSignals = updateGreenCorridorSignals(ambulances, trafficSignals);
  updatedSignals.forEach((newSig) => {
    const oldSig = trafficSignals.find(s => s.id === newSig.id);
    if (newSig.mode === "GREEN_CORRIDOR_ACTIVE") {
      newSig.countdownSeconds = Math.max(0, (newSig.countdownSeconds || 30) - 1);
    } else {
      newSig.countdownSeconds = 0;
    }

    if (oldSig && oldSig.status !== newSig.status && newSig.mode === "GREEN_CORRIDOR_ACTIVE") {
      newSig.countdownSeconds = 30;
      addAlert(`🟢 Simulated Green Corridor Active`, `Virtual signal ${newSig.code} switched to GREEN for approaching ${newSig.activeAmbulanceId}.`, "SUCCESS", newSig.activeAmbulanceId);
    }
  });

  trafficSignals = updatedSignals;
  if (stateChanged) broadcastFullState();
}, 1000);

io.on("connection", (socket) => {
  socket.emit("STATE_UPDATE", { hospitals, ambulances, trafficSignals, alerts, activityLogs, tripHistory, isSimulationRunning });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 LifeRoute Backend Server 3.0 running on port ${PORT}`);
});
