/**
 * DBSCAN Spatial Clustering & Hotspot Analysis for LifeRoute Emergency Requests
 * 
 * Density-Based Spatial Clustering of Applications with Noise (DBSCAN)
 * Uses Haversine distance formula to cluster emergency latitude/longitude coordinates.
 */

// Haversine distance in kilometers between two GPS coordinates
export const haversineDistanceKm = (coords1, coords2) => {
  const R = 6371; // Earth's radius in km
  const dLat = ((coords2.lat - coords1.lat) * Math.PI) / 180;
  const dLng = ((coords2.lng - coords1.lng) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coords1.lat * Math.PI) / 180) *
      Math.cos((coords2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Numeric severity score mapping
const getSeverityWeight = (severity) => {
  switch (severity?.toUpperCase()) {
    case 'CRITICAL': return 4;
    case 'HIGH': return 3;
    case 'MEDIUM': return 2;
    case 'LOW': return 1;
    default: return 1;
  }
};

/**
 * Executes DBSCAN clustering on emergency requests
 * @param {Array} requests - Array of emergency request objects with location: { lat, lng }
 * @param {number} eps - Cluster radius in kilometers (default 1.2 km)
 * @param {number} minSamples - Minimum requests to form a cluster (default 3)
 */
export const runDBSCANClustering = (requests, eps = 1.2, minSamples = 3) => {
  if (!requests || requests.length === 0) return { clusters: [], standalone: [] };

  const visited = new Set();
  const clusters = [];
  const noise = [];

  const getNeighbors = (reqIndex) => {
    const neighbors = [];
    const targetLoc = requests[reqIndex].location;
    for (let i = 0; i < requests.length; i++) {
      if (i === reqIndex) continue;
      const dist = haversineDistanceKm(targetLoc, requests[i].location);
      if (dist <= eps) {
        neighbors.push(i);
      }
    }
    return neighbors;
  };

  for (let i = 0; i < requests.length; i++) {
    if (visited.has(i)) continue;
    visited.add(i);

    const neighbors = getNeighbors(i);

    if (neighbors.length + 1 < minSamples) {
      noise.push(requests[i]);
    } else {
      // Form a new cluster
      const currentCluster = [i];
      const queue = [...neighbors];

      while (queue.length > 0) {
        const nextIdx = queue.shift();

        if (!visited.has(nextIdx)) {
          visited.add(nextIdx);
          const nextNeighbors = getNeighbors(nextIdx);
          if (nextNeighbors.length + 1 >= minSamples) {
            queue.push(...nextNeighbors.filter(n => !queue.includes(n)));
          }
        }

        if (!currentCluster.includes(nextIdx)) {
          currentCluster.push(nextIdx);
        }
      }

      clusters.push(currentCluster.map(idx => requests[idx]));
    }
  }

  // Calculate Zone Metrics & Priority Score for each detected cluster
  const formattedClusters = clusters.map((clusterRequests, idx) => {
    const zoneLetter = String.fromCharCode(65 + idx); // Zone A, Zone B, Zone C...
    
    // Calculate centroid location
    const sumLat = clusterRequests.reduce((sum, r) => sum + r.location.lat, 0);
    const sumLng = clusterRequests.reduce((sum, r) => sum + r.location.lng, 0);
    const center = { lat: sumLat / clusterRequests.length, lng: sumLng / clusterRequests.length };

    const criticalCount = clusterRequests.filter(r => r.severity === 'CRITICAL').length;
    const highCount = clusterRequests.filter(r => r.severity === 'HIGH').length;
    
    const avgSeverityWeight = clusterRequests.reduce((sum, r) => sum + getSeverityWeight(r.severity), 0) / clusterRequests.length;
    const oldestWaitMins = Math.max(...clusterRequests.map(r => r.waitingTimeMins || 0));

    // Priority Score Formula: (numRequests * 10) + (criticalCount * 25) + (avgSeverity * 15) + (oldestWaitMins * 2)
    const priorityScore = Math.round(
      clusterRequests.length * 10 +
      criticalCount * 25 +
      avgSeverityWeight * 15 +
      oldestWaitMins * 2
    );

    let classification = 'MODERATE';
    let label = 'Moderate Demand Zone';
    let color = '#F59E0B'; // Yellow/Amber

    if (criticalCount > 0 || priorityScore >= 75) {
      classification = 'CRITICAL';
      label = 'Critical Emergency Hotspot';
      color = '#EF4444'; // Red
    } else if (clusterRequests.length >= 4 || priorityScore >= 50) {
      classification = 'HIGH';
      label = 'High Demand Zone';
      color = '#F97316'; // Orange
    }

    return {
      id: `zone-${zoneLetter.toLowerCase()}`,
      zoneName: `Zone ${zoneLetter}`,
      label,
      classification,
      color,
      center,
      radiusKm: eps,
      requests: clusterRequests,
      totalRequests: clusterRequests.length,
      criticalCount,
      highCount,
      avgSeverityWeight: avgSeverityWeight.toFixed(1),
      oldestWaitMins,
      priorityScore
    };
  });

  return {
    clusters: formattedClusters,
    standalone: noise
  };
};
