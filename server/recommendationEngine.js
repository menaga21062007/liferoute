export const EMERGENCY_CATEGORIES = [
  { id: "cardiac", name: "Cardiac Emergency", priority: "CRITICAL", requiredSpecialty: "Cardiac", requiresOT: true },
  { id: "stroke", name: "Stroke", priority: "CRITICAL", requiredSpecialty: "Stroke", requiresOT: false },
  { id: "trauma", name: "Trauma", priority: "CRITICAL", requiredSpecialty: "Trauma", requiresOT: true },
  { id: "road_accident", name: "Road Accident", priority: "CRITICAL", requiredSpecialty: "Trauma", requiresOT: true },
  { id: "respiratory", name: "Respiratory Distress", priority: "HIGH", requiredSpecialty: "ICU", requiresOT: false },
  { id: "burns", name: "Fire/Burn Injury", priority: "HIGH", requiredSpecialty: "Burns", requiresOT: true },
  { id: "other", name: "Other Emergency", priority: "MEDIUM", requiredSpecialty: "General", requiresOT: false }
];


/**
 * Calculates Haversine distance in kilometers between two lat/lng coordinates
 */
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Scores and ranks hospitals based on patient condition, location, distance, and real-time bed/OT availability.
 */
export function recommendHospitals(patientLocation, conditionName, hospitals) {
  const category = EMERGENCY_CATEGORIES.find(
    (cat) => cat.name.toLowerCase() === conditionName.toLowerCase() || cat.id === conditionName
  ) || EMERGENCY_CATEGORIES[0];

  const requiredSpecialty = category.requiredSpecialty;
  const requiresOT = category.requiresOT;

  const ranked = hospitals.map((hospital) => {
    const distKm = calculateDistanceKm(
      patientLocation.lat,
      patientLocation.lng,
      hospital.location.lat,
      hospital.location.lng
    );

    // Speed estimation: ~45 km/h average in city emergency transit
    const etaMinutes = Math.max(1, Math.round((distKm / 45) * 60));

    let score = 100;
    const reasons = [];

    // 1. Specialty Check (+60 points or -40 penalty)
    const hasSpecialty = hospital.specialties.some(
      (s) => s.toLowerCase() === requiredSpecialty.toLowerCase()
    );

    if (hasSpecialty) {
      score += 60;
      reasons.push(`Specialized ${requiredSpecialty} Center`);
    } else {
      score -= 40;
      reasons.push(`Lacks specialized ${requiredSpecialty} department`);
    }

    // 2. Bed Availability Check
    if (hospital.availableBeds > 0) {
      score += 25;
      reasons.push(`${hospital.availableBeds} ICU/Emergency beds available`);
    } else {
      score -= 50;
      reasons.push(`NO BEDS AVAILABLE (Critical capacity)`);
    }

    // 3. OT Availability Check (if required)
    if (requiresOT) {
      if (hospital.availableOTs > 0) {
        score += 25;
        reasons.push(`${hospital.availableOTs} Operating Theaters ready`);
      } else {
        score -= 35;
        reasons.push(`No OTs currently open`);
      }
    }

    // 4. Distance / ETA Penalty (Deduct points per km)
    score -= distKm * 8;
    reasons.push(`${distKm.toFixed(1)} km away (ETA ~${etaMinutes} mins)`);

    return {
      hospital,
      distKm: parseFloat(distKm.toFixed(1)),
      etaMinutes,
      score: Math.round(score),
      hasSpecialty,
      hasBed: hospital.availableBeds > 0,
      hasOT: requiresOT ? hospital.availableOTs > 0 : true,
      matchReason: reasons.join(" • "),
      isRecommended: false
    };
  });

  // Sort descending by score
  ranked.sort((a, b) => b.score - a.score);

  if (ranked.length > 0) {
    ranked[0].isRecommended = true;
  }

  return ranked;
}
