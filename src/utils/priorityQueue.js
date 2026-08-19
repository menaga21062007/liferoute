/**
 * Multi-Tier Priority Queue Dispatch Engine for LifeRoute
 * 
 * Orders emergency requests according to:
 *   1. Severity Rank: Critical (4) > High (3) > Medium (2) > Low (1)
 *   2. Waiting Time: Longer waiting times prioritized
 *   3. DBSCAN Hotspot Zone Score: Requests in higher-demand zones prioritized
 *   4. Distance: Proximity to nearest available capable ambulance
 */

import { haversineDistanceKm } from './dbscan';

export const SEVERITY_RANKS = {
  CRITICAL: 4,
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1
};

export const SEVERITY_COLORS = {
  CRITICAL: { bg: 'bg-red-500/25', text: 'text-red-300', border: 'border-red-500/50', hex: '#EF4444' },
  HIGH: { bg: 'bg-orange-500/25', text: 'text-orange-300', border: 'border-orange-500/50', hex: '#F97316' },
  MEDIUM: { bg: 'bg-amber-500/25', text: 'text-amber-300', border: 'border-amber-500/50', hex: '#F59E0B' },
  LOW: { bg: 'bg-blue-500/25', text: 'text-blue-300', border: 'border-blue-500/50', hex: '#3B82F6' }
};

/**
 * Sorts requests by emergency priority queue rules
 */
export const sortPriorityQueue = (requests, hotspots = []) => {
  if (!requests) return [];

  // Create lookup for zone scores
  const requestZoneMap = {};
  hotspots.forEach((zone) => {
    (zone.requests || []).forEach((req) => {
      requestZoneMap[req.id] = { zoneName: zone.zoneName, priorityScore: zone.priorityScore, color: zone.color };
    });
  });

  return [...requests].sort((a, b) => {
    // 1. Severity Rank
    const rankA = SEVERITY_RANKS[a.severity?.toUpperCase()] || 1;
    const rankB = SEVERITY_RANKS[b.severity?.toUpperCase()] || 1;

    if (rankA !== rankB) {
      return rankB - rankA;
    }

    // 2. Waiting Time
    const waitA = a.waitingTimeMins || 0;
    const waitB = b.waitingTimeMins || 0;
    if (waitA !== waitB) {
      return waitB - waitA;
    }

    // 3. DBSCAN Hotspot Priority Score
    const scoreA = requestZoneMap[a.id]?.priorityScore || 0;
    const scoreB = requestZoneMap[b.id]?.priorityScore || 0;
    if (scoreA !== scoreB) {
      return scoreB - scoreA;
    }

    // 4. Timestamp fallback
    return new Date(a.requestTimestamp || 0) - new Date(b.requestTimestamp || 0);
  });
};

/**
 * Capability Matcher checking if ambulance tags match emergency category requirement
 */
export const isAmbulanceCapable = (ambulance, emergencyType) => {
  if (!ambulance.capabilities || ambulance.capabilities.length === 0) return true;
  const caps = ambulance.capabilities.map((c) => c.toLowerCase());

  switch (emergencyType?.toLowerCase()) {
    case 'cardiac emergency':
    case 'cardiac':
      return caps.includes('cardiac support') || caps.includes('icu ambulance');
    case 'trauma':
    case 'road accident':
      return caps.includes('trauma support') || caps.includes('icu ambulance');
    case 'stroke':
    case 'respiratory distress':
    case 'fire/burn injury':
      return caps.includes('icu ambulance') || caps.includes('cardiac support') || caps.includes('general emergency');
    default:
      return true;
  }
};

/**
 * Finds the nearest suitable available ambulance for a priority request
 */
export const findBestAmbulanceForRequest = (request, ambulances) => {
  if (!request || !ambulances) return null;

  const availableAmbs = ambulances.filter(
    (amb) => (amb.status === 'AVAILABLE' || amb.status === 'IDLE') && isAmbulanceCapable(amb, request.emergencyType)
  );

  if (availableAmbs.length === 0) {
    // Fallback: any available ambulance regardless of tags
    const fallbackAmbs = ambulances.filter((amb) => amb.status === 'AVAILABLE' || amb.status === 'IDLE');
    if (fallbackAmbs.length === 0) return null;
    return findClosestAmbulance(request.location, fallbackAmbs);
  }

  return findClosestAmbulance(request.location, availableAmbs);
};

const findClosestAmbulance = (location, ambulanceList) => {
  let closest = null;
  let minDist = Infinity;

  ambulanceList.forEach((amb) => {
    if (!amb.currentLocation) return;
    const dist = haversineDistanceKm(location, amb.currentLocation);
    if (dist < minDist) {
      minDist = dist;
      closest = amb;
    }
  });

  return closest ? { ambulance: closest, distanceKm: parseFloat(minDist.toFixed(2)) } : null;
};
