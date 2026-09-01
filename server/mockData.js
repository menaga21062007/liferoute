// Government Emergency Response & Ambulance Service Seed Data (Madurai, Tamil Nadu, India)

export const GOVERNMENT_HOSPITALS = [
  {
    id: "hosp-1",
    name: "Government Rajaji Hospital (Madurai GH)",
    code: "GRH-01",
    location: { lat: 9.927500, lng: 78.125000 },
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

export const INITIAL_TRAFFIC_SIGNALS = [
  {
    id: "sig-1",
    code: "TS-01",
    name: "Goripalayam Junction (Madurai)",
    location: { lat: 9.929500, lng: 78.126500 },
    blueLightActive: false,
    distanceToAmbulanceKm: null
  },
  {
    id: "sig-2",
    code: "TS-02",
    name: "Periyar Bus Stand Junction (Madurai)",
    location: { lat: 9.917000, lng: 78.113000 },
    blueLightActive: false,
    distanceToAmbulanceKm: null
  },
  {
    id: "sig-3",
    code: "TS-03",
    name: "Mattuthavani Junction (Madurai)",
    location: { lat: 9.951000, lng: 78.151000 },
    blueLightActive: false,
    distanceToAmbulanceKm: null
  },
  {
    id: "sig-4",
    code: "TS-04",
    name: "Kalavasal Junction (Madurai)",
    location: { lat: 9.924000, lng: 78.098000 },
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
    currentLocation: { lat: 9.920000, lng: 78.116000 },
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
    currentLocation: { lat: 9.935000, lng: 78.130000 },
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
    currentLocation: { lat: 9.945000, lng: 78.145000 },
    assignedEmergencyId: null,
    targetHospitalId: "hosp-3",
    patient: null
  }
];

export const SAMPLE_ROUTE_WAYPOINTS = [
  { lat: 9.920000, lng: 78.116000, name: "Pickup Point (Madurai Central)" },
  { lat: 9.923000, lng: 78.120000, name: "Approaching Signal TS-01" },
  { lat: 9.929500, lng: 78.126500, name: "Goripalayam Junction (<200m)" },
  { lat: 9.930000, lng: 78.127000, name: "Madurai Medical College Road" },
  { lat: 9.927500, lng: 78.125000, name: "Government Rajaji Hospital Drop" }
];

export const INITIAL_SOS_EMERGENCIES = [
  {
    id: "SOS-1001",
    patientName: "John Sterling",
    phone: "9876543210",
    age: 54,
    gender: "Male",
    emergencyType: "Heart issue",
    pickupLocation: { lat: 9.920000, lng: 78.116000, address: "West Masi Street, Periyar, Madurai, Tamil Nadu, India" },
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: "PENDING_DISPATCH",
    assignedAmbulanceCode: null,
    targetHospitalId: "hosp-1",
    vitals: null
  }
];
