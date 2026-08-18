// Seed mock data for LifeRoute 3.0 Emergency Response & Hospital Management Platform

export const EMERGENCY_CATEGORIES = [
  {
    id: "cardiac",
    name: "Cardiac Arrest / STEMI",
    priority: "CRITICAL",
    requiredSpecialty: "Cardiac",
    requiresOT: true,
    recommendedBedType: "Cardiac ICU",
    description: "Acute myocardial infarction, arrest, or severe arrhythmias."
  },
  {
    id: "stroke",
    name: "Stroke / Acute Neurological",
    priority: "CRITICAL",
    requiredSpecialty: "Stroke",
    requiresOT: false,
    recommendedBedType: "Stroke Unit Bed",
    description: "Sudden onset paralysis, facial drooping, speech difficulty."
  },
  {
    id: "trauma",
    name: "Major Trauma / Accident",
    priority: "CRITICAL",
    requiredSpecialty: "Trauma",
    requiresOT: true,
    recommendedBedType: "Trauma ICU Bed",
    description: "Multiple severe fractures, internal bleeding, penetrating wound."
  },
  {
    id: "respiratory",
    name: "Severe Respiratory Distress",
    priority: "HIGH",
    requiredSpecialty: "ICU",
    requiresOT: false,
    recommendedBedType: "Emergency ICU Bed",
    description: "Severe asthma attack, acute pulmonary edema, low SpO2."
  },
  {
    id: "burns",
    name: "Severe Burns",
    priority: "CRITICAL",
    requiredSpecialty: "Burns",
    requiresOT: true,
    recommendedBedType: "Burn Unit Bed",
    description: "2nd or 3rd degree burns >20% body surface area."
  },
  {
    id: "pediatric",
    name: "Pediatric Emergency",
    priority: "HIGH",
    requiredSpecialty: "Pediatric",
    requiresOT: false,
    recommendedBedType: "PICU Bed",
    description: "Child emergency under 14 requiring specialized pediatric care."
  }
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
      { id: "b-1", bedNumber: "EMG-01", type: "Emergency", status: "OCCUPIED", patientName: "Robert Davis", condition: "Cardiac Arrest", assignedDoctor: "Dr. Aris Thorne" },
      { id: "b-2", bedNumber: "EMG-02", type: "Emergency", status: "AVAILABLE", patientName: null, condition: null, assignedDoctor: null },
      { id: "b-3", bedNumber: "EMG-03", type: "Emergency", status: "CLEANING", patientName: null, condition: null, assignedDoctor: null },
      { id: "b-4", bedNumber: "ICU-01", type: "ICU", status: "OCCUPIED", patientName: "Elena Rostova", condition: "Severe STEMI", assignedDoctor: "Dr. Sarah Lin" },
      { id: "b-5", bedNumber: "ICU-02", type: "ICU", status: "RESERVED", patientName: "David Miller", condition: "Cardiac Arrest", assignedDoctor: "Dr. Aris Thorne" },
      { id: "b-6", bedNumber: "ICU-03", type: "ICU", status: "AVAILABLE", patientName: null, condition: null, assignedDoctor: null },
      { id: "b-7", bedNumber: "WRD-101", type: "Ward", status: "OCCUPIED", patientName: "James Wilson", condition: "Post-op Recovery", assignedDoctor: "Dr. Marcus Vance" },
      { id: "b-8", bedNumber: "WRD-102", type: "Ward", status: "OUT_OF_SERVICE", patientName: null, condition: null, assignedDoctor: null }
    ],

    ots: [
      { id: "ot-1", otNumber: "OT-1 (Cardiac)", status: "In_Use", patientName: "Robert Davis", procedure: "Emergency Angioplasty", startTime: "10:30 AM", endTime: "12:15 PM" },
      { id: "ot-2", otNumber: "OT-2 (Trauma)", status: "Scheduled", patientName: "David Miller", procedure: "STEMI Reperfusion", startTime: "11:45 AM", endTime: "01:00 PM" },
      { id: "ot-3", otNumber: "OT-3 (General)", status: "Free", patientName: null, procedure: null, startTime: null, endTime: null },
      { id: "ot-4", otNumber: "OT-4 (Neuro)", status: "Free", patientName: null, procedure: null, startTime: null, endTime: null }
    ],

    doctors: [
      { id: "doc-1", name: "Dr. Aris Thorne", specialty: "Cardiology & ER Lead", activePatients: 4, status: "ON_DUTY", phone: "Ext. 401" },
      { id: "doc-2", name: "Dr. Sarah Lin", specialty: "Trauma Surgeon", activePatients: 2, status: "IN_OT", phone: "Ext. 402" },
      { id: "doc-3", name: "Dr. Marcus Vance", specialty: "Neurology Specialist", activePatients: 1, status: "ON_DUTY", phone: "Ext. 403" },
      { id: "doc-4", name: "Dr. Emily Watson", specialty: "Pediatric ER", activePatients: 0, status: "AVAILABLE", phone: "Ext. 404" }
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
      { id: "b-201", bedNumber: "TRM-01", type: "Emergency", status: "OCCUPIED", patientName: "Carl Jenkins", condition: "Polytrauma", assignedDoctor: "Dr. Kevin Durant" },
      { id: "b-202", bedNumber: "TRM-02", type: "Emergency", status: "AVAILABLE", patientName: null, condition: null, assignedDoctor: null }
    ],
    ots: [
      { id: "ot-201", otNumber: "OT-1", status: "Free", patientName: null, procedure: null, startTime: null, endTime: null }
    ],
    doctors: [
      { id: "doc-201", name: "Dr. Kevin Durant", specialty: "Chief Trauma Surgeon", activePatients: 3, status: "ON_DUTY", phone: "Ext. 501" }
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

export const INITIAL_TRAFFIC_SIGNALS = [
  {
    id: "sig-1",
    code: "TS-01",
    name: "Grand Ave & 5th St",
    location: { lat: 40.722000, lng: -73.945000 },
    status: "RED",
    mode: "AUTO_NORMAL",
    activeAmbulanceId: null,
    distanceToAmbulance: null,
    countdownSeconds: 0
  },
  {
    id: "sig-2",
    code: "TS-02",
    name: "Healthcare Blvd & Metro Ring",
    location: { lat: 40.727000, lng: -73.939000 },
    status: "GREEN",
    mode: "AUTO_NORMAL",
    activeAmbulanceId: null,
    distanceToAmbulance: null,
    countdownSeconds: 0
  },
  {
    id: "sig-3",
    code: "TS-03",
    name: "Midtown Expressway & 12th St",
    location: { lat: 40.738000, lng: -73.972000 },
    status: "RED",
    mode: "AUTO_NORMAL",
    activeAmbulanceId: null,
    distanceToAmbulance: null,
    countdownSeconds: 0
  },
  {
    id: "sig-4",
    code: "TS-04",
    name: "Hospital Approach & 50th Ave",
    location: { lat: 40.745000, lng: -73.980000 },
    status: "RED",
    mode: "AUTO_NORMAL",
    activeAmbulanceId: null,
    distanceToAmbulance: null,
    countdownSeconds: 0
  }
];

export const PREDEFINED_ROUTES = {
  routeAlpha: [
    { lat: 40.715000, lng: -73.955000 },
    { lat: 40.718000, lng: -73.950000 },
    { lat: 40.722000, lng: -73.945000 },
    { lat: 40.725000, lng: -73.941000 },
    { lat: 40.727000, lng: -73.939000 },
    { lat: 40.729000, lng: -73.936500 },
    { lat: 40.730610, lng: -73.935242 }
  ],
  routeBeta: [
    { lat: 40.730000, lng: -73.960000 },
    { lat: 40.734000, lng: -73.966000 },
    { lat: 40.738000, lng: -73.972000 },
    { lat: 40.742000, lng: -73.976000 },
    { lat: 40.745000, lng: -73.980000 },
    { lat: 40.748817, lng: -73.985428 }
  ]
};

export const INITIAL_AMBULANCES = [
  {
    id: "amb-101",
    code: "AMB-101",
    unitName: "Rapid Response Unit 1",
    driverName: "Marcus Vance",
    paramedicName: "Elena Rostova",
    status: "EN_ROUTE",
    currentLocation: { lat: 40.718000, lng: -73.950000 },
    heading: 45,
    speedKm: 65,
    destinationHospitalId: "hosp-1",
    route: PREDEFINED_ROUTES.routeAlpha,
    currentWaypointIndex: 1,
    etaMinutes: 4,
    distanceRemainingKm: 2.1,
    patient: {
      id: "pat-901",
      name: "David Miller",
      age: 62,
      gender: "Male",
      bloodGroup: "O+",
      isConscious: false,
      conditionCategory: "Cardiac Arrest / STEMI",
      chiefComplaint: "Acute chest pressure, severe dyspnea, STEMI confirmed",
      priorityLevel: "CRITICAL",
      treatmentStatus: "Ambulance en route",
      vitals: {
        hr: 114,
        bpSystolic: 145,
        bpDiastolic: 92,
        spo2: 93,
        temp: 37.1,
        ecgStatus: "ST-Elevation (STEMI Detected)"
      }
    },
    teamReady: true,
    allocatedBedNumber: "ICU-02",
    allocatedOtNumber: "OT-2 (Cardiac)",
    startTime: new Date().toISOString()
  },
  {
    id: "amb-102",
    code: "AMB-102",
    unitName: "Metro Medic 4",
    driverName: "Kevin Durant",
    paramedicName: "Samantha Chen",
    status: "IDLE",
    currentLocation: { lat: 40.755000, lng: -73.965000 },
    heading: 180,
    speedKm: 0,
    destinationHospitalId: null,
    route: [],
    currentWaypointIndex: 0,
    etaMinutes: 0,
    distanceRemainingKm: 0,
    patient: null,
    teamReady: false,
    allocatedBedNumber: null,
    allocatedOtNumber: null,
    startTime: null
  }
];

export const INITIAL_ACTIVITY_LOGS = [
  { id: "log-101", timestamp: "10:15:20 AM", event: "Emergency Trip Dispatched", actor: "AMB-101 Crew", category: "AMBULANCE", details: "Patient David Miller assigned to Velammal Global Hospital" },
  { id: "log-102", timestamp: "10:16:05 AM", event: "Green Corridor Activated", actor: "Traffic Controller", category: "TRAFFIC", details: "Signal TS-01 changed to GREEN for AMB-101" },
  { id: "log-103", timestamp: "10:17:10 AM", event: "ICU Bed Reserved", actor: "ER Intake System", category: "HOSPITAL", details: "Bed ICU-02 auto-reserved for STEMI patient" },
  { id: "log-104", timestamp: "10:18:30 AM", event: "ER Trauma Team Prepped", actor: "Dr. Aris Thorne", category: "STAFF", details: "Cardiology ER team prepped and waiting at bay 1" }
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
    route: PREDEFINED_ROUTES.routeBeta
  },
  {
    id: "hist-2",
    tripDate: "2026-08-16",
    ambulanceCode: "AMB-102",
    driverName: "Kevin Durant",
    patientName: "Michael Chang",
    age: 34,
    gender: "Male",
    conditionCategory: "Stroke / Neurological",
    hospitalName: "Velammal Global Hospital",
    outcome: "Thrombolysis administered • Discharged to rehab",
    durationMins: 11,
    route: PREDEFINED_ROUTES.routeAlpha
  }
];
