// Government Emergency Response & Medical Center Seed Datasets

export const GOVERNMENT_HOSPITALS = [
  {
    id: "hosp-1",
    name: "Government District General Hospital",
    code: "GH-01",
    location: { lat: 40.730610, lng: -73.935242 },
    address: "Central Govt Medical Campus, District 1",
    phone: "108 / 044-25305000",
    status: "OPERATIONAL",
    availableBeds: 14,
    totalBeds: 50,
    occupiedBeds: 36,
    availableOTs: 3,
    totalOTs: 8,
    specialties: ["Cardiac", "Trauma", "ICU", "General"],
    beds: [
      { id: "b1", number: "ICU-01", type: "ICU", status: "AVAILABLE", patientName: null },
      { id: "b2", number: "ICU-02", type: "ICU", status: "AVAILABLE", patientName: null },
      { id: "b3", number: "ER-01", type: "Emergency", status: "OCCUPIED", patientName: "A. Kumar" },
      { id: "b4", number: "ER-02", type: "Emergency", status: "RESERVED", patientName: "John Sterling" }
    ]
  },
  {
    id: "hosp-2",
    name: "Velammal Govt Medical College & Hospital",
    code: "VGMCH",
    location: { lat: 40.748817, lng: -73.985428 },
    address: "National Highway Ring Road, Sector 4",
    phone: "108 / 044-25305001",
    status: "OPERATIONAL",
    availableBeds: 8,
    totalBeds: 40,
    occupiedBeds: 32,
    availableOTs: 2,
    totalOTs: 6,
    specialties: ["Trauma", "Neurology", "Burn Unit"],
    beds: [
      { id: "b5", number: "ICU-03", type: "ICU", status: "AVAILABLE", patientName: null },
      { id: "b6", number: "OT-01", type: "OT", status: "AVAILABLE", patientName: null }
    ]
  },
  {
    id: "hosp-3",
    name: "City Government Trauma & Acute Care Centre",
    code: "GTAC",
    location: { lat: 40.712776, lng: -74.005974 },
    address: "South District Express Way",
    phone: "108 / 044-25305002",
    status: "OPERATIONAL",
    availableBeds: 5,
    totalBeds: 30,
    occupiedBeds: 25,
    availableOTs: 1,
    totalOTs: 4,
    specialties: ["Cardiac", "Stroke", "Pediatric"],
    beds: [
      { id: "b7", number: "ICU-05", type: "ICU", status: "AVAILABLE", patientName: null }
    ]
  }
];

export const INITIAL_HOSPITALS = GOVERNMENT_HOSPITALS;

export const INITIAL_TRAFFIC_SIGNALS = [
  {
    id: "sig-1",
    code: "TS-01",
    name: "Grand Ave & 5th St Junction",
    location: { lat: 40.718000, lng: -73.950000 },
    status: "RED",
    mode: "AUTO_NORMAL",
    blueLightActive: false,
    distanceToAmbulanceKm: null,
    countdownSeconds: 0
  },
  {
    id: "sig-2",
    code: "TS-02",
    name: "Healthcare Blvd Ring Crossing",
    location: { lat: 40.722000, lng: -73.945000 },
    status: "RED",
    mode: "AUTO_NORMAL",
    blueLightActive: false,
    distanceToAmbulanceKm: null,
    countdownSeconds: 0
  },
  {
    id: "sig-3",
    code: "TS-03",
    name: "Midtown Expressway Gate",
    location: { lat: 40.727000, lng: -73.939000 },
    status: "RED",
    mode: "AUTO_NORMAL",
    blueLightActive: false,
    distanceToAmbulanceKm: null,
    countdownSeconds: 0
  },
  {
    id: "sig-4",
    code: "TS-04",
    name: "Hospital Main Entrance Approach",
    location: { lat: 40.730000, lng: -73.936000 },
    status: "RED",
    mode: "AUTO_NORMAL",
    blueLightActive: false,
    distanceToAmbulanceKm: null,
    countdownSeconds: 0
  }
];

export const INITIAL_AMBULANCES = [
  {
    id: "amb-101",
    code: "AMB-101",
    unitName: "Govt Ambulance Unit 101",
    driverName: "R. Kumar",
    paramedicName: "S. Rajan",
    status: "AVAILABLE",
    currentLocation: { lat: 40.715000, lng: -73.955000 },
    assignedEmergencyId: null,
    targetHospitalId: "hosp-1",
    patient: null,
    etaMinutes: 4,
    route: []
  },
  {
    id: "amb-102",
    code: "AMB-102",
    unitName: "Govt Ambulance Unit 102",
    driverName: "M. Selvam",
    paramedicName: "K. Priya",
    status: "AVAILABLE",
    currentLocation: { lat: 40.740000, lng: -73.975000 },
    assignedEmergencyId: null,
    targetHospitalId: "hosp-2",
    patient: null,
    etaMinutes: 6,
    route: []
  },
  {
    id: "amb-103",
    code: "AMB-103",
    unitName: "Govt Trauma Rescue 103",
    driverName: "A. Joseph",
    paramedicName: "D. Arul",
    status: "AVAILABLE",
    currentLocation: { lat: 40.710000, lng: -74.000000 },
    assignedEmergencyId: null,
    targetHospitalId: "hosp-3",
    patient: null,
    etaMinutes: 8,
    route: []
  }
];

export const SAMPLE_ROUTE_WAYPOINTS = [
  { lat: 40.715000, lng: -73.955000, name: "Pickup Point (Patient Location)" },
  { lat: 40.717000, lng: -73.951500, name: "Approaching Signal TS-01" },
  { lat: 40.718000, lng: -73.950000, name: "Signal TS-01 Junction (<200m)" },
  { lat: 40.720000, lng: -73.947500, name: "5th St Commercial Block" },
  { lat: 40.722000, lng: -73.945000, name: "Signal TS-02 Crossing (<200m)" },
  { lat: 40.725000, lng: -73.941000, name: "Healthcare Blvd Expressway" },
  { lat: 40.727000, lng: -73.939000, name: "Signal TS-03 Gate (<200m)" },
  { lat: 40.730000, lng: -73.936000, name: "Signal TS-04 Entrance (<200m)" },
  { lat: 40.730610, lng: -73.935242, name: "Hospital Emergency Bay Drop" }
];

export const INITIAL_SOS_EMERGENCIES = [
  {
    id: "SOS-1001",
    patientName: "John Sterling",
    phone: "9876543210",
    age: 54,
    gender: "Male",
    emergencyType: "Heart issue",
    pickupLocation: { lat: 40.715000, lng: -73.955000, address: "Grand Ave & 5th St, District 1" },
    timestamp: "10:15 AM",
    status: "PENDING_DISPATCH",
    assignedAmbulanceCode: null,
    targetHospitalId: "hosp-1",
    vitals: null
  }
];

export const INITIAL_EMERGENCY_REQUESTS = [
  {
    id: "REQ-901",
    patientName: "John Sterling",
    age: 54,
    gender: "Male",
    conditionCategory: "Cardiac Emergency",
    severityScore: 9,
    pickupLocation: { lat: 40.722000, lng: -73.945000, address: "Grand Ave & 5th St" },
    status: "Pending Dispatch",
    timestamp: "10:15 AM"
  },
  {
    id: "REQ-902",
    patientName: "Sarah Jenkins",
    age: 38,
    gender: "Female",
    conditionCategory: "Trauma",
    severityScore: 8,
    pickupLocation: { lat: 40.735000, lng: -73.965000, address: "Suburban Ring Rd" },
    status: "Assigned",
    timestamp: "10:20 AM"
  }
];

export const INITIAL_ACTIVITY_LOGS = [
  { id: "log-1", timestamp: "10:15:00 AM", message: "Citizen SOS-1001 triggered for Cardiac Emergency.", category: "SOS" },
  { id: "log-2", timestamp: "10:16:00 AM", message: "Ambulance AMB-101 dispatched to Grand Ave.", category: "DISPATCH" },
  { id: "log-3", timestamp: "10:18:00 AM", message: "Traffic Signal TS-01 illuminated Blue Light (<200m).", category: "CORRIDOR" }
];

export const INITIAL_TRIP_HISTORY = [
  {
    id: "TRIP-801",
    date: "2026-08-29",
    ambulanceCode: "AMB-101",
    patientName: "John Sterling",
    condition: "Cardiac Emergency",
    origin: "Grand Ave & 5th St",
    destination: "Government District General Hospital",
    durationMins: 7,
    status: "COMPLETED",
    routeCoords: SAMPLE_ROUTE_WAYPOINTS
  }
];

export const FICTIONAL_ROAD_GRAPH = {
  nodes: {
    1: { id: "N1", name: "Ambulance Station 1", lat: 40.718, lng: -73.950 },
    2: { id: "N2", name: "Grand Ave Junction", lat: 40.722, lng: -73.945 },
    3: { id: "N3", name: "Midtown Crossing", lat: 40.727, lng: -73.939 },
    4: { id: "N4", name: "Expressway Gate", lat: 40.730, lng: -73.936 },
    5: { id: "N5", name: "Govt General Hospital Bay", lat: 40.730610, lng: -73.935242 },
    8: { id: "N8", name: "Velammal Medical Campus", lat: 40.748817, lng: -73.985428 },
    9: { id: "N9", name: "City Trauma Center", lat: 40.712776, lng: -74.005974 },
    10: { id: "N10", name: "Acute Care Station", lat: 40.710000, lng: -74.000000 }
  },
  edges: [
    { from: "N1", to: "N2", weight: 1.2 },
    { from: "N2", to: "N3", weight: 1.4 },
    { from: "N3", to: "N4", weight: 0.8 },
    { from: "N4", to: "N5", weight: 0.5 },
    { from: "N2", to: "N8", weight: 3.1 },
    { from: "N1", to: "N9", weight: 2.4 },
    { from: "N9", to: "N10", weight: 0.6 }
  ]
};

export const PREDEFINED_ROUTES = {
  route1: SAMPLE_ROUTE_WAYPOINTS
};

export const PREDICTIVE_ANALYTICS_DATA = {
  hourlySurge: [
    { hour: "00:00", incidents: 2 },
    { hour: "04:00", incidents: 1 },
    { hour: "08:00", incidents: 8 },
    { hour: "12:00", incidents: 14 },
    { hour: "16:00", incidents: 12 },
    { hour: "20:00", incidents: 6 }
  ],
  recommendedPrepositioning: [
    { zone: "District 1 Grand Ave", recommendedUnits: 2, reason: "High Cardiac Surge Risk (88%)" },
    { zone: "Midtown Expressway", recommendedUnits: 1, reason: "Peak Transit Bottleneck" }
  ]
};

export const HOSPITAL_RESOURCE_MARKETPLACE = [
  { id: "res-1", name: "Portable Oxygen Ventilator Units", category: "EQUIPMENT", availableUnits: 5, ownerHospital: "Government District General Hospital", status: "AVAILABLE" },
  { id: "res-2", name: "O-Negative Blood Units", category: "BLOOD_BANK", availableUnits: 12, ownerHospital: "Velammal Govt Medical College", status: "AVAILABLE" },
  { id: "res-3", name: "Cardiac Catheterization Suite", category: "SPECIALTY_BAY", availableUnits: 1, ownerHospital: "City Trauma Centre", status: "AVAILABLE" }
];

export const EMERGENCY_CATEGORIES = [
  { id: "cardiac", name: "Cardiac Emergency", priority: "CRITICAL", requiredSpecialty: "Cardiac", requiresOT: true },
  { id: "stroke", name: "Stroke", priority: "CRITICAL", requiredSpecialty: "Stroke", requiresOT: false },
  { id: "trauma", name: "Trauma", priority: "CRITICAL", requiredSpecialty: "Trauma", requiresOT: true },
  { id: "respiratory", name: "Respiratory Distress", priority: "HIGH", requiredSpecialty: "ICU", requiresOT: false }
];
