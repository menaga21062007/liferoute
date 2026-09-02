// Government Emergency Response & Ambulance Service Seed Data (Madurai Straight Corridor)

export const GOVERNMENT_HOSPITALS = [
  {
    id: "hosp-1",
    name: "Government Rajaji Hospital (Madurai GH)",
    code: "GRH-01",
    location: { lat: 9.938000, lng: 78.150000 }, // Positioned directly at the end of the 4th Signal
    address: "Goripalayam, Madurai, Tamil Nadu 625020",
    phone: "108 / 0452-2532536",
    status: "OPERATIONAL"
  },
  {
    id: "hosp-2",
    name: "Velammal Medical College & Hospital (Madurai)",
    code: "VGMCH",
    location: { lat: 9.896000, lng: 78.115000 },
    address: "Madurai-Tuticorin Ring Road, Anuppanadi, Madurai, Tamil Nadu 625009",
    phone: "108 / 0452-7110000",
    status: "OPERATIONAL"
  },
  {
    id: "hosp-3",
    name: "Apollo Speciality Hospital (Madurai)",
    code: "ASH-03",
    location: { lat: 9.932000, lng: 78.148000 },
    address: "Lake Area, KK Nagar, Madurai, Tamil Nadu 625020",
    phone: "108 / 0452-2580000",
    status: "OPERATIONAL"
  }
];

// 4 SIGNALS ALIGNED IN A PERFECTLY STRAIGHT LINE
export const INITIAL_TRAFFIC_SIGNALS = [
  {
    id: "sig-1",
    code: "TS-01",
    name: "Goripalayam Junction (Madurai)",
    location: { lat: 9.920000, lng: 78.115000 }, // Signal 1
    blueLightActive: false,
    distanceToAmbulanceKm: null
  },
  {
    id: "sig-2",
    code: "TS-02",
    name: "Periyar Bus Stand Junction (Madurai)",
    location: { lat: 9.925000, lng: 78.125000 }, // Signal 2
    blueLightActive: false,
    distanceToAmbulanceKm: null
  },
  {
    id: "sig-3",
    code: "TS-03",
    name: "Mattuthavani Junction (Madurai)",
    location: { lat: 9.930000, lng: 78.135000 }, // Signal 3
    blueLightActive: false,
    distanceToAmbulanceKm: null
  },
  {
    id: "sig-4",
    code: "TS-04",
    name: "Kalavasal Junction (Madurai)",
    location: { lat: 9.935000, lng: 78.145000 }, // Signal 4 (Hospital is at the end of this signal)
    blueLightActive: false,
    distanceToAmbulanceKm: null
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
    currentLocation: { lat: 9.915000, lng: 78.105000 },
    assignedEmergencyId: null,
    targetHospitalId: "hosp-1",
    patient: null
  },
  {
    id: "amb-102",
    code: "AMB-102",
    unitName: "Govt Ambulance Unit 102",
    driverName: "M. Selvam",
    paramedicName: "K. Priya",
    status: "EN_ROUTE_TO_PATIENT",
    currentLocation: { lat: 9.915000, lng: 78.105000 },
    assignedEmergencyId: "SOS-1001",
    targetHospitalId: "hosp-1",
    patient: {
      name: "John Sterling",
      phone: "9876543210",
      age: 54,
      gender: "Male",
      emergencyType: "Heart issue",
      pickupLocation: { lat: 9.915000, lng: 78.105000, address: "West Masi Street, Periyar, Madurai, Tamil Nadu, India" }
    }
  },
  {
    id: "amb-103",
    code: "AMB-103",
    unitName: "Govt Trauma Rescue 103",
    driverName: "A. Joseph",
    paramedicName: "D. Arul",
    status: "AVAILABLE",
    currentLocation: { lat: 9.945000, lng: 78.145000 },
    assignedEmergencyId: null,
    targetHospitalId: "hosp-3",
    patient: null
  }
];

// HIGH DENSITY SMOOTH ROUTE WAYPOINTS VISITING TS-01 -> TS-02 -> TS-03 -> TS-04 -> HOSPITAL AT END OF 4TH SIGNAL
export const SAMPLE_ROUTE_WAYPOINTS = [
  { lat: 9.915000, lng: 78.105000, name: "Start Pickup Point" },
  { lat: 9.916500, lng: 78.108000, name: "Madurai West Corridor" },
  { lat: 9.918000, lng: 78.111000, name: "Approaching TS-01" },
  
  // TS-01 (Signal 1) - EXACT MATCH
  { lat: 9.920000, lng: 78.115000, name: "TS-01 Goripalayam Junction (REACHED - BLUE LIGHT ON)" },
  
  { lat: 9.921500, lng: 78.118000, name: "Leaving TS-01" },
  { lat: 9.923000, lng: 78.121000, name: "Approaching TS-02" },
  
  // TS-02 (Signal 2) - EXACT MATCH
  { lat: 9.925000, lng: 78.125000, name: "TS-02 Periyar Junction (REACHED - BLUE LIGHT ON)" },
  
  { lat: 9.926500, lng: 78.128000, name: "Leaving TS-02" },
  { lat: 9.928000, lng: 78.131000, name: "Approaching TS-03" },
  
  // TS-03 (Signal 3) - EXACT MATCH
  { lat: 9.930000, lng: 78.135000, name: "TS-03 Mattuthavani Junction (REACHED - BLUE LIGHT ON)" },
  
  { lat: 9.931500, lng: 78.138000, name: "Leaving TS-03" },
  { lat: 9.933000, lng: 78.141000, name: "Approaching TS-04" },
  
  // TS-04 (Signal 4) - EXACT MATCH
  { lat: 9.935000, lng: 78.145000, name: "TS-04 Kalavasal Junction (REACHED - BLUE LIGHT ON)" },
  
  { lat: 9.936500, lng: 78.148000, name: "Entering Hospital Entrance" },
  // Hospital Drop at the end of Signal 4
  { lat: 9.938000, lng: 78.150000, name: "Government Rajaji Hospital Emergency Bay Drop" }
];

export const INITIAL_SOS_EMERGENCIES = [
  {
    id: "SOS-1001",
    patientName: "John Sterling",
    phone: "9876543210",
    age: 54,
    gender: "Male",
    emergencyType: "Heart issue",
    pickupLocation: { lat: 9.915000, lng: 78.105000, address: "West Masi Street, Periyar, Madurai, Tamil Nadu, India" },
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: "EN_ROUTE_TO_PATIENT",
    assignedAmbulanceCode: "AMB-102",
    targetHospitalId: "hosp-1",
    vitals: null
  }
];
