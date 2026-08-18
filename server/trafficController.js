// Green Corridor Traffic Signal Controller Module

import { calculateDistanceKm } from './recommendationEngine.js';

const GREEN_CORRIDOR_PROXIMITY_METERS = 300; // 300 meters threshold

/**
 * Updates traffic signal states based on active ambulances en-route.
 */
export function updateGreenCorridorSignals(ambulances, trafficSignals) {
  const updatedSignals = trafficSignals.map((signal) => {
    // If signal is in manual override mode, do not change automatically
    if (signal.mode === "MANUAL_OVERRIDE") {
      return signal;
    }

    let nearestAmbulance = null;
    let minDistanceMeters = Infinity;

    // Check all active en-route ambulances
    for (const amb of ambulances) {
      if (amb.status !== "EN_ROUTE" || !amb.currentLocation) continue;

      const distKm = calculateDistanceKm(
        amb.currentLocation.lat,
        amb.currentLocation.lng,
        signal.location.lat,
        signal.location.lng
      );
      const distMeters = distKm * 1000;

      if (distMeters < minDistanceMeters) {
        minDistanceMeters = distMeters;
        nearestAmbulance = amb;
      }
    }

    // Proximity check for Green Corridor trigger
    if (nearestAmbulance && minDistanceMeters <= GREEN_CORRIDOR_PROXIMITY_METERS) {
      return {
        ...signal,
        status: "GREEN",
        mode: "GREEN_CORRIDOR_ACTIVE",
        activeAmbulanceId: nearestAmbulance.code,
        distanceToAmbulance: Math.round(minDistanceMeters)
      };
    } else if (signal.mode === "GREEN_CORRIDOR_ACTIVE") {
      // Revert to AUTO_NORMAL when ambulance passes
      return {
        ...signal,
        status: "RED", // Revert back to standard cycle starting at red
        mode: "AUTO_NORMAL",
        activeAmbulanceId: null,
        distanceToAmbulance: null
      };
    }

    return signal;
  });

  return updatedSignals;
}
