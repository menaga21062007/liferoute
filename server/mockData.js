// Government Emergency Response & Ambulance Service Seed Data

export const GOVERNMENT_HOSPITALS = [
  {
    id: "hosp-1",
    name: "Government District General Hospital",
    code: "GH-01",
    location: { lat: 40.730610, lng: -73.935242 },
    address: "Central Govt Medical Campus, District 1",
    phone: "108 / 044-25305000",
    status: "OPERATIONAL"
  },
  {
    id: "hosp-2",
    name: "Velammal Govt Medical College & Hospital",
    code: "VGMCH",
    location: { lat: 40.748817, lng: -73.985428 },
    address: "National Highway Ring Road, Sector 4",
    phone: "108 / 044-25305001",
    status: "OPERATIONAL"
  },
  {
    id: "hosp-3",
    name: "City Government Trauma & Acute Care Centre",
    code: "GTAC",
    location: { lat: 40.712776, lng: -74.005974 },
    address: "South District Express Way",
    phone: "108 / 044-25305002",
    status: "OPERATIONAL"
  }
];

export const INITIAL_TRAFFIC_SIGNALS = [
  {
    id: "sig-1",
    code: "TS-01",
    name: "Goripalayam Junction (Madurai)",
    location: { lat: 40.718000, lng: -73.950000 },
    blueLightActive: false,
    distanceToAmbulanceKm: null
  },
  {
    id: "sig-2",
    code: "TS-02",
    name: "Periyar Bus Stand Junction (Madurai)",
    location: { lat: 40.722000, lng: -73.945000 },
    blueLightActive: false,
    distanceToAmbulanceKm: null
  },
  {
    id: "sig-3",
    code: "TS-03",
    name: "Mattuthavani Junction (Madurai)",
    location: { lat: 40.727000, lng: -73.939000 },
    blueLightActive: false,
    distanceToAmbulanceKm: null
  },
  {
    id: "sig-4",
    code: "TS-04",
    name: "Kalavasal Junction (Madurai)",
    location: { lat: 40.730000, lng: -73.936000 },
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
    currentLocation: { lat: 40.715000, lng: -73.955000 },
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
    status: "AVAILABLE",
    currentLocation: { lat: 40.740000, lng: -73.975000 },
    assignedEmergencyId: null,
    targetHospitalId: "hosp-2",
    patient: null
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
    patient: null
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
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: "PENDING_DISPATCH",
    assignedAmbulanceCode: null,
    targetHospitalId: "hosp-1",
    vitals: null
  }
];
