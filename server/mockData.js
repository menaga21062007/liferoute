// Seed mock data for LifeRoute 3.0 Emergency Response, Intelligence & Hospital Management System

export const EMERGENCY_CATEGORIES = [
  { id: "cardiac", name: "Cardiac Emergency", priority: "CRITICAL", requiredSpecialty: "Cardiac", requiresOT: true, recommendedBedType: "Cardiac ICU" },
  { id: "stroke", name: "Stroke", priority: "CRITICAL", requiredSpecialty: "Stroke", requiresOT: false, recommendedBedType: "Stroke Unit Bed" },
  { id: "trauma", name: "Trauma", priority: "CRITICAL", requiredSpecialty: "Trauma", requiresOT: true, recommendedBedType: "Trauma ICU Bed" },
  { id: "road_accident", name: "Road Accident", priority: "CRITICAL", requiredSpecialty: "Trauma", requiresOT: true, recommendedBedType: "Trauma ICU Bed" },
  { id: "respiratory", name: "Respiratory Distress", priority: "HIGH", requiredSpecialty: "ICU", requiresOT: false, recommendedBedType: "Emergency ICU Bed" },
  { id: "burns", name: "Fire/Burn Injury", priority: "HIGH", requiredSpecialty: "Burns", requiresOT: true, recommendedBedType: "Burn Unit Bed" },
  { id: "other", name: "Other Emergency", priority: "MEDIUM", requiredSpecialty: "General", requiresOT: false, recommendedBedType: "Emergency Bed" }
];

export const INITIAL_HOSPITALS = [
  {
    id: "hosp-1",
    name: "Velammal Global Hospital",
    code: "VGH",
    location: { lat: 40.730610, lng: -73.935242 },
    address: "500 Healthcare Blvd, Metro City",
    phone: "+1 (555) 019-2831",
    specialties: ["Cardiac", "Trauma", "Stroke", "ICU", "Pediatric"],
    totalBeds: 50,
    availableBeds: 8,
    occupiedBeds: 42,
    totalOTs: 6,
    availableOTs: 2,
    occupiedOTs: 4,
    status: "AVAILABLE",
    incomingAmbulances: [],
    beds: [
      { id: "b-1", bedNumber: "EMG-01", type: "Emergency", status: "OCCUPIED", patientName: "Robert Davis" },
      { id: "b-2", bedNumber: "EMG-02", type: "Emergency", status: "AVAILABLE", patientName: null },
      { id: "b-3", bedNumber: "ICU-01", type: "ICU", status: "RESERVED", patientName: "David Miller" },
      { id: "b-4", bedNumber: "ICU-02", type: "ICU", status: "AVAILABLE", patientName: null }
    ],
    ots: [
      { id: "ot-1", otNumber: "OT-1 (Cardiac)", status: "In_Use", patientName: "Robert Davis" },
      { id: "ot-2", otNumber: "OT-2 (Trauma)", status: "Free", patientName: null }
    ],
    doctors: [
      { id: "doc-1", name: "Dr. Aris Thorne", specialty: "Cardiology & ER Lead", status: "ON_DUTY" },
      { id: "doc-2", name: "Dr. Sarah Lin", specialty: "Trauma Surgeon", status: "IN_OT" }
    ]
  },
  {
    id: "hosp-2",
    name: "Velammal Hospital",
    code: "VH",
    location: { lat: 40.748817, lng: -73.985428 },
    address: "120 Emergency Way, Midtown",
    phone: "+1 (555) 014-9922",
    specialties: ["Trauma", "Burns", "Stroke", "ICU"],
    totalBeds: 40,
    availableBeds: 12,
    occupiedBeds: 28,
    totalOTs: 8,
    availableOTs: 4,
    occupiedOTs: 4,
    status: "AVAILABLE",
    incomingAmbulances: [],
    beds: [
      { id: "b-201", bedNumber: "TRM-01", type: "Emergency", status: "OCCUPIED", patientName: "Carl Jenkins" },
      { id: "b-202", bedNumber: "TRM-02", type: "Emergency", status: "AVAILABLE", patientName: null }
    ],
    ots: [],
    doctors: []
  },
  {
    id: "hosp-3",
    name: "Mercy Heart & Vascular Institute",
    code: "MHVI",
    location: { lat: 40.712776, lng: -74.005974 },
    address: "88 Cardiac Care Rd, South District",
    phone: "+1 (555) 017-4488",
    specialties: ["Cardiac", "Stroke", "ICU"],
    totalBeds: 30,
    availableBeds: 3,
    occupiedBeds: 27,
    totalOTs: 4,
    availableOTs: 1,
    occupiedOTs: 3,
    status: "LIMITED",
    incomingAmbulances: [],
    beds: [],
    ots: [],
    doctors: []
  },
  {
    id: "hosp-4",
    name: "City Children's & Pediatric Hospital",
    code: "CCPH",
    location: { lat: 40.761421, lng: -73.977621 },
    address: "405 Hope Street, East Side",
    phone: "+1 (555) 012-3311",
    specialties: ["Pediatric", "ICU", "Burns"],
    totalBeds: 25,
    availableBeds: 15,
    occupiedBeds: 10,
    totalOTs: 3,
    availableOTs: 2,
    occupiedOTs: 1,
    status: "AVAILABLE",
    incomingAmbulances: [],
    beds: [],
    ots: [],
    doctors: []
  }
];

export const PREDEFINED_ROUTES = {
  routeAlpha: [
    { lat: 40.715000, lng: -73.955000 },
    { lat: 40.718000, lng: -73.950000 },
    { lat: 40.722000, lng: -73.945000 },
    { lat: 40.727000, lng: -73.939000 },
    { lat: 40.730610, lng: -73.935242 }
  ],
  routeBeta: [
    { lat: 40.738000, lng: -73.972000 },
    { lat: 40.745000, lng: -73.980000 },
    { lat: 40.748817, lng: -73.985428 }
  ]
};

// Fictional City Road Graph (12 Nodes, 18 Edges)
export const FICTIONAL_ROAD_GRAPH = {
  nodes: [
    { id: "N1", name: "Suburban Pickup Intersection", lat: 40.715000, lng: -73.955000, type: "INTERSECTION" },
    { id: "N2", name: "5th Ave & Grand St", lat: 40.718000, lng: -73.950000, type: "INTERSECTION" },
    { id: "N3", name: "Grand Ave Crossing (TS-01)", lat: 40.722000, lng: -73.945000, type: "INTERSECTION" },
    { id: "N4", name: "Healthcare Ring Junction (TS-02)", lat: 40.727000, lng: -73.939000, type: "INTERSECTION" },
    { id: "N5", name: "Velammal Global Hospital Hub (VGH)", lat: 40.730610, lng: -73.935242, type: "HOSPITAL" },
    { id: "N6", name: "Midtown Expressway Gate (TS-03)", lat: 40.738000, lng: -73.972000, type: "INTERSECTION" },
    { id: "N7", name: "Hospital Approach 50th Ave (TS-04)", lat: 40.745000, lng: -73.980000, type: "INTERSECTION" },
    { id: "N8", name: "Velammal Hospital Hub (VH)", lat: 40.748817, lng: -73.985428, type: "HOSPITAL" },
    { id: "N9", name: "South Cardiac District Gate", lat: 40.712776, lng: -74.005974, type: "HOSPITAL" },
    { id: "N10", name: "East Pediatric Avenue", lat: 40.761421, lng: -73.977621, type: "HOSPITAL" },
    { id: "N11", name: "Ambulance Depot Alpha", lat: 40.755000, lng: -73.965000, type: "DEPOT" },
    { id: "N12", name: "Central Metro Hub", lat: 40.735000, lng: -73.950000, type: "INTERSECTION" }
  ],
  edges: [
    { id: "E1", source: "N1", target: "N2", weight: 0.6, name: "Suburban Arterial" },
    { id: "E2", source: "N2", target: "N3", weight: 0.8, name: "5th Ave Link" },
    { id: "E3", source: "N3", target: "N4", weight: 0.9, name: "Grand Corridor" },
    { id: "E4", source: "N4", target: "N5", weight: 0.5, name: "Healthcare Blvd" },
    { id: "E5", source: "N3", target: "N12", weight: 1.2, name: "Cross-Metro Connector" },
    { id: "E6", source: "N12", target: "N6", weight: 1.1, name: "Central Bypass" },
    { id: "E7", source: "N6", target: "N7", weight: 0.9, name: "Midtown Expressway" },
    { id: "E8", source: "N7", target: "N8", weight: 0.5, name: "Velammal Approach" },
    { id: "E9", source: "N1", target: "N9", weight: 2.1, name: "South Ring Road" },
    { id: "E10", source: "N7", target: "N10", weight: 1.4, name: "East Pediatric Expressway" },
    { id: "E11", source: "N11", target: "N6", weight: 1.0, name: "Depot North Feed" },
    { id: "E12", source: "N11", target: "N12", weight: 0.8, name: "Depot Central Feed" },
    { id: "E13", source: "N4", target: "N10", weight: 2.2, name: "North-East Connector" },
    { id: "E14", source: "N9", target: "N12", weight: 1.8, name: "South Metro Link" },
    { id: "E15", source: "N2", target: "N9", weight: 1.7, name: "West Side Arterial" },
    { id: "E16", source: "N6", target: "N8", weight: 1.3, name: "Midtown Direct Cut" },
    { id: "E17", source: "N5", target: "N10", weight: 1.9, name: "East Hospital Corridor" },
    { id: "E18", source: "N12", target: "N4", weight: 0.7, name: "Metro Ring Inner" }
  ]
};

// Seed Fictional Emergency Requests (8 Requests, 3 Clustered in Midtown/Grand Ave)
export const INITIAL_EMERGENCY_REQUESTS = [
  {
    id: "ER-001",
    patientName: "Menaga",
    age: 54,
    gender: "Male",
    bloodGroup: "O+",
    emergencyType: "Cardiac Emergency",
    severity: "CRITICAL",
    location: { lat: 40.718000, lng: -73.950000, name: "Grand Ave & 5th St" },
    requestTimestamp: "10:15:00 AM",
    waitingTimeMins: 14,
    patientSummary: "Acute chest pressure, STEMI suspected, unresponsive",
    status: "Waiting",
    assignedAmbulanceId: null
  },
  {
    id: "ER-002",
    patientName: "David Miller",
    age: 62,
    gender: "Male",
    bloodGroup: "A+",
    emergencyType: "Road Accident",
    severity: "CRITICAL",
    location: { lat: 40.722000, lng: -73.945000, name: "Grand Ave Crossing" },
    requestTimestamp: "10:18:20 AM",
    waitingTimeMins: 11,
    patientSummary: "Vehicle rollover, multiple trauma, compound leg fracture",
    status: "Waiting",
    assignedAmbulanceId: null
  },
  {
    id: "ER-003",
    patientName: "Sarah Jenkins",
    age: 48,
    gender: "Female",
    bloodGroup: "B+",
    emergencyType: "Stroke",
    severity: "HIGH",
    location: { lat: 40.720000, lng: -73.948000, name: "5th St Commercial Block" },
    requestTimestamp: "10:20:10 AM",
    waitingTimeMins: 9,
    patientSummary: "Facial drooping, right side paralysis, speech difficulty",
    status: "Waiting",
    assignedAmbulanceId: null
  },
  {
    id: "ER-004",
    patientName: "Carl Williams",
    age: 38,
    gender: "Male",
    bloodGroup: "O-",
    emergencyType: "Fire/Burn Injury",
    severity: "HIGH",
    location: { lat: 40.738000, lng: -73.972000, name: "Midtown Industrial Park" },
    requestTimestamp: "10:22:00 AM",
    waitingTimeMins: 7,
    patientSummary: "2nd degree burns on arms and torso, chemical inhalation",
    status: "Waiting",
    assignedAmbulanceId: null
  },
  {
    id: "ER-005",
    patientName: "Emily Watson",
    age: 9,
    gender: "Female",
    bloodGroup: "AB+",
    emergencyType: "Respiratory Distress",
    severity: "MEDIUM",
    location: { lat: 40.755000, lng: -73.965000, name: "East Side Academy" },
    requestTimestamp: "10:24:30 AM",
    waitingTimeMins: 5,
    patientSummary: "Severe asthma exacerbation, SpO2 88%",
    status: "Waiting",
    assignedAmbulanceId: null
  },
  {
    id: "ER-006",
    patientName: "Robert Davis",
    age: 71,
    gender: "Male",
    bloodGroup: "A-",
    emergencyType: "Cardiac Emergency",
    severity: "CRITICAL",
    location: { lat: 40.748817, lng: -73.985428, name: "Midtown Transit Plaza" },
    requestTimestamp: "10:25:00 AM",
    waitingTimeMins: 4,
    patientSummary: "Sudden collapse, pulseless electrical activity",
    status: "Waiting",
    assignedAmbulanceId: null
  },
  {
    id: "ER-007",
    patientName: "Jessica Taylor",
    age: 29,
    gender: "Female",
    bloodGroup: "O+",
    emergencyType: "Trauma",
    severity: "LOW",
    location: { lat: 40.712776, lng: -74.005974, name: "South Market Mall" },
    requestTimestamp: "10:26:15 AM",
    waitingTimeMins: 3,
    patientSummary: "Laceration on forearm, bleeding controlled",
    status: "Waiting",
    assignedAmbulanceId: null
  },
  {
    id: "ER-008",
    patientName: "Michael Chang",
    age: 42,
    gender: "Male",
    bloodGroup: "B-",
    emergencyType: "Road Accident",
    severity: "HIGH",
    location: { lat: 40.761421, lng: -73.977621, name: "Pediatric Expressway Exit" },
    requestTimestamp: "10:27:40 AM",
    waitingTimeMins: 2,
    patientSummary: "Motorcycle collision, head injury, conscious",
    status: "Waiting",
    assignedAmbulanceId: null
  }
];

export const INITIAL_TRAFFIC_SIGNALS = [
  { id: "sig-1", code: "TS-01", name: "Grand Ave & 5th St", location: { lat: 40.722000, lng: -73.945000 }, status: "RED", mode: "AUTO_NORMAL", activeAmbulanceId: null, countdownSeconds: 0 },
  { id: "sig-2", code: "TS-02", name: "Healthcare Blvd & Metro Ring", location: { lat: 40.727000, lng: -73.939000 }, status: "GREEN", mode: "AUTO_NORMAL", activeAmbulanceId: null, countdownSeconds: 0 },
  { id: "sig-3", code: "TS-03", name: "Midtown Expressway & 12th St", location: { lat: 40.738000, lng: -73.972000 }, status: "RED", mode: "AUTO_NORMAL", activeAmbulanceId: null, countdownSeconds: 0 },
  { id: "sig-4", code: "TS-04", name: "Hospital Approach & 50th Ave", location: { lat: 40.745000, lng: -73.980000 }, status: "RED", mode: "AUTO_NORMAL", activeAmbulanceId: null, countdownSeconds: 0 }
];

export const INITIAL_AMBULANCES = [
  {
    id: "amb-101",
    code: "AMB-101",
    unitName: "Rapid Response Unit 1",
    driverName: "Marcus Vance",
    paramedicName: "Elena Rostova",
    status: "AVAILABLE",
    capabilities: ["Cardiac Support", "Trauma Support", "ICU Ambulance"],
    currentLocation: { lat: 40.718000, lng: -73.950000 },
    currentLocationName: "5th Ave & Grand St",
    assignedRequestId: null,
    etaMinutes: 0,
    patient: null
  },
  {
    id: "amb-102",
    code: "AMB-102",
    unitName: "Metro Medic 4",
    driverName: "Kevin Durant",
    paramedicName: "Samantha Chen",
    status: "AVAILABLE",
    capabilities: ["Trauma Support", "General Emergency"],
    currentLocation: { lat: 40.755000, lng: -73.965000 },
    currentLocationName: "Ambulance Depot Alpha",
    assignedRequestId: null,
    etaMinutes: 0,
    patient: null
  },
  {
    id: "amb-103",
    code: "AMB-103",
    unitName: "Critical Care Unit 9",
    driverName: "Dr. Aris Thorne",
    paramedicName: "Rachel Adams",
    status: "AVAILABLE",
    capabilities: ["ICU Ambulance", "Cardiac Support"],
    currentLocation: { lat: 40.735000, lng: -73.950000 },
    currentLocationName: "Central Metro Hub",
    assignedRequestId: null,
    etaMinutes: 0,
    patient: null
  }
];

export const INITIAL_ACTIVITY_LOGS = [
  { id: "log-101", timestamp: "10:15:00 AM", event: "Emergency Request Created", actor: "System Intake", category: "EMERGENCY", details: "ER-001 created for patient Menaga at Grand Ave & 5th St" },
  { id: "log-102", timestamp: "10:16:05 AM", event: "DBSCAN Clustering Active", actor: "Intelligence Engine", category: "HOTSPOT", details: "Detected 1 Emergency Hotspot Zone in Midtown/Grand Ave" }
];

export const INITIAL_TRIP_HISTORY = [
  {
    id: "hist-1",
    tripDate: "2026-08-17",
    ambulanceCode: "AMB-101",
    driverName: "Marcus Vance",
    patientName: "Sarah Jenkins",
    age: 48,
    gender: "Female",
    conditionCategory: "Major Trauma",
    hospitalName: "Velammal Hospital",
    outcome: "Successfully admitted to ICU • Surgery completed",
    durationMins: 14,
    route: []
  }
];
