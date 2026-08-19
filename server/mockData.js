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
    totalBeds: 120,
    availableBeds: 18,
    occupiedBeds: 102,
    totalOTs: 12,
    availableOTs: 4,
    occupiedOTs: 8,
    status: "AVAILABLE",
    incomingAmbulances: [],
    beds: [
      { id: "b-101", bedNumber: "EMG-01", type: "Emergency", category: "Emergency ER", status: "OCCUPIED", patientName: "Robert Davis" },
      { id: "b-102", bedNumber: "EMG-02", type: "Emergency", category: "Emergency ER", status: "AVAILABLE", patientName: null },
      { id: "b-103", bedNumber: "ICU-101", type: "ICU", category: "Cardiac ICU", status: "RESERVED", patientName: "David Miller" },
      { id: "b-104", bedNumber: "ICU-102", type: "ICU", category: "Cardiac ICU", status: "AVAILABLE", patientName: null },
      { id: "b-105", bedNumber: "ICU-103", type: "ICU", category: "Trauma ICU", status: "OCCUPIED", patientName: "James Wilson" },
      { id: "b-106", bedNumber: "WRD-101", type: "Ward", category: "General Ward", status: "OCCUPIED", patientName: "Sarah Jenkins" },
      { id: "b-107", bedNumber: "WRD-102", type: "Ward", category: "General Ward", status: "CLEANING", patientName: null },
      { id: "b-108", bedNumber: "WRD-103", type: "Ward", category: "General Ward", status: "AVAILABLE", patientName: null },
      { id: "b-109", bedNumber: "PED-101", type: "Pediatric", category: "Pediatric ER", status: "AVAILABLE", patientName: null },
      { id: "b-110", bedNumber: "PED-102", type: "Pediatric", category: "Pediatric ICU", status: "AVAILABLE", patientName: null },
      { id: "b-111", bedNumber: "BRN-101", type: "Burns", category: "Burn Care Unit", status: "AVAILABLE", patientName: null },
      { id: "b-112", bedNumber: "BRN-102", type: "Burns", category: "Burn Care Unit", status: "OCCUPIED", patientName: "Carl Williams" }
    ],
    ots: [
      { id: "ot-101", otNumber: "OT-1 (Cardiac)", name: "Cardiac Surgical Suite", specialty: "Cardiology", status: "In_Use", patientName: "Robert Davis" },
      { id: "ot-102", otNumber: "OT-2 (Trauma)", name: "Trauma Emergency Suite", specialty: "Trauma Surgery", status: "Free", patientName: null },
      { id: "ot-103", otNumber: "OT-3 (Neuro)", name: "Neurosurgery Suite", specialty: "Neurology", status: "Free", patientName: null },
      { id: "ot-104", otNumber: "OT-4 (General)", name: "General Surgery Suite", specialty: "General", status: "Free", patientName: null }
    ],
    doctors: [
      { id: "doc-101", name: "Dr. Aris Thorne", specialty: "Cardiology & ER Lead", activePatients: 4, status: "ON_DUTY", phone: "Ext. 401" },
      { id: "doc-102", name: "Dr. Sarah Lin", specialty: "Chief Trauma Surgeon", activePatients: 2, status: "IN_OT", phone: "Ext. 402" },
      { id: "doc-103", name: "Dr. Marcus Vance", specialty: "Neurology Lead", activePatients: 3, status: "ON_DUTY", phone: "Ext. 403" }
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
    totalBeds: 90,
    availableBeds: 15,
    occupiedBeds: 75,
    totalOTs: 10,
    availableOTs: 3,
    occupiedOTs: 7,
    status: "AVAILABLE",
    incomingAmbulances: [],
    beds: [
      { id: "b-201", bedNumber: "TRM-01", type: "Emergency", category: "Trauma Bay", status: "OCCUPIED", patientName: "Carl Jenkins" },
      { id: "b-202", bedNumber: "TRM-02", type: "Emergency", category: "Trauma Bay", status: "AVAILABLE", patientName: null },
      { id: "b-203", bedNumber: "ICU-201", type: "ICU", category: "Trauma ICU", status: "AVAILABLE", patientName: null },
      { id: "b-204", bedNumber: "ICU-202", type: "ICU", category: "Trauma ICU", status: "OCCUPIED", patientName: "Kevin Durant" },
      { id: "b-205", bedNumber: "WRD-201", type: "Ward", category: "General Ward", status: "AVAILABLE", patientName: null },
      { id: "b-206", bedNumber: "WRD-202", type: "Ward", category: "General Ward", status: "AVAILABLE", patientName: null },
      { id: "b-207", bedNumber: "BRN-201", type: "Burns", category: "Burn Care Unit", status: "AVAILABLE", patientName: null },
      { id: "b-208", bedNumber: "BRN-202", type: "Burns", category: "Burn Care Unit", status: "CLEANING", patientName: null }
    ],
    ots: [
      { id: "ot-201", otNumber: "OT-1 (Trauma)", name: "Trauma Suite 1", specialty: "Trauma Surgery", status: "Free", patientName: null },
      { id: "ot-202", otNumber: "OT-2 (Burns)", name: "Burn Reconstruction Suite", specialty: "Burns", status: "Free", patientName: null },
      { id: "ot-203", otNumber: "OT-3 (General)", name: "General Operating Room", specialty: "General", status: "Free", patientName: null }
    ],
    doctors: [
      { id: "doc-201", name: "Dr. Kevin Durant", specialty: "Chief Trauma Surgeon", activePatients: 3, status: "ON_DUTY", phone: "Ext. 501" },
      { id: "doc-202", name: "Dr. Rachel Adams", specialty: "Burn Specialist", activePatients: 2, status: "ON_DUTY", phone: "Ext. 502" }
    ]
  },
  {
    id: "hosp-3",
    name: "Mercy Heart & Vascular Institute",
    code: "MHVI",
    location: { lat: 40.712776, lng: -74.005974 },
    address: "88 Cardiac Care Rd, South District",
    phone: "+1 (555) 017-4488",
    specialties: ["Cardiac", "Stroke", "ICU"],
    totalBeds: 75,
    availableBeds: 10,
    occupiedBeds: 65,
    totalOTs: 8,
    availableOTs: 2,
    occupiedOTs: 6,
    status: "LIMITED",
    incomingAmbulances: [],
    beds: [
      { id: "b-301", bedNumber: "CAR-01", type: "ICU", category: "Cardiac ICU", status: "OCCUPIED", patientName: "Elena Rostova" },
      { id: "b-302", bedNumber: "CAR-02", type: "ICU", category: "Cardiac ICU", status: "AVAILABLE", patientName: null },
      { id: "b-303", bedNumber: "CAR-03", type: "ICU", category: "CCU Ward", status: "AVAILABLE", patientName: null },
      { id: "b-304", bedNumber: "STR-301", type: "Emergency", category: "Stroke Unit", status: "AVAILABLE", patientName: null },
      { id: "b-305", bedNumber: "STR-302", type: "Emergency", category: "Stroke Unit", status: "OCCUPIED", patientName: "Samantha Chen" },
      { id: "b-306", bedNumber: "WRD-301", type: "Ward", category: "Cardiology Ward", status: "AVAILABLE", patientName: null },
      { id: "b-307", bedNumber: "WRD-302", type: "Ward", category: "Cardiology Ward", status: "CLEANING", patientName: null }
    ],
    ots: [
      { id: "ot-301", otNumber: "OT-1 (Cath Lab)", name: "Angioplasty Cath Lab 1", specialty: "Cardiology", status: "In_Use", patientName: "Elena Rostova" },
      { id: "ot-302", otNumber: "OT-2 (Cath Lab)", name: "Angioplasty Cath Lab 2", specialty: "Cardiology", status: "Free", patientName: null },
      { id: "ot-303", otNumber: "OT-3 (Vascular)", name: "Vascular Surgery Suite", specialty: "Vascular", status: "Free", patientName: null }
    ],
    doctors: [
      { id: "doc-301", name: "Dr. Marcus Vance", specialty: "Interventional Cardiologist", activePatients: 5, status: "ON_DUTY", phone: "Ext. 601" },
      { id: "doc-302", name: "Dr. Pooja Kumar", specialty: "Stroke Specialist", activePatients: 3, status: "ON_DUTY", phone: "Ext. 602" }
    ]
  },
  {
    id: "hosp-4",
    name: "City Children's & Pediatric Hospital",
    code: "CCPH",
    location: { lat: 40.761421, lng: -73.977621 },
    address: "405 Hope Street, East Side",
    phone: "+1 (555) 012-3311",
    specialties: ["Pediatric", "ICU", "Burns"],
    totalBeds: 60,
    availableBeds: 14,
    occupiedBeds: 46,
    totalOTs: 6,
    availableOTs: 2,
    occupiedOTs: 4,
    status: "AVAILABLE",
    incomingAmbulances: [],
    beds: [
      { id: "b-401", bedNumber: "PED-01", type: "ICU", category: "Pediatric ICU", status: "AVAILABLE", patientName: null },
      { id: "b-402", bedNumber: "PED-02", type: "Emergency", category: "Pediatric ER", status: "AVAILABLE", patientName: null },
      { id: "b-403", bedNumber: "PED-03", type: "Emergency", category: "Pediatric ER", status: "OCCUPIED", patientName: "Emily Watson" },
      { id: "b-404", bedNumber: "NIC-401", type: "ICU", category: "NICU Bay", status: "AVAILABLE", patientName: null },
      { id: "b-405", bedNumber: "NIC-402", type: "ICU", category: "NICU Bay", status: "AVAILABLE", patientName: null },
      { id: "b-406", bedNumber: "WRD-401", type: "Ward", category: "Pediatric Ward", status: "AVAILABLE", patientName: null },
      { id: "b-407", bedNumber: "WRD-402", type: "Ward", category: "Pediatric Ward", status: "CLEANING", patientName: null }
    ],
    ots: [
      { id: "ot-401", otNumber: "OT-1 (Pediatric)", name: "Pediatric Surgery Suite", specialty: "Pediatrics", status: "Free", patientName: null },
      { id: "ot-402", otNumber: "OT-2 (Neonatal)", name: "Neonatal Surgical Room", specialty: "Pediatrics", status: "Free", patientName: null }
    ],
    doctors: [
      { id: "doc-401", name: "Dr. Emily Watson", specialty: "Chief Pediatric ER", activePatients: 2, status: "AVAILABLE", phone: "Ext. 701" },
      { id: "doc-402", name: "Dr. Siddharth Patel", specialty: "Pediatric Surgeon", activePatients: 4, status: "ON_DUTY", phone: "Ext. 702" }
    ]
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
