/**
 * Dijkstra Shortest Path Routing & Dynamic Road-Block Simulator for LifeRoute
 * 
 * Computes optimal 2-stage emergency dispatch routes:
 *   Stage 1: Ambulance Start Node -> Emergency Location Node
 *   Stage 2: Emergency Location Node -> Nearest Capable Hospital Node
 */

import { haversineDistanceKm } from './dbscan';

/**
 * Solves Dijkstra's Algorithm on a graph dataset
 * @param {Object} graph - { nodes: [], edges: [] }
 * @param {string} startNodeId 
 * @param {string} targetNodeId 
 * @param {Array} blockedEdgeIds - Array of edge IDs marked as blocked
 */
export const findDijkstraShortestPath = (graph, startNodeId, targetNodeId, blockedEdgeIds = []) => {
  if (!graph || !graph.nodes || !graph.edges) return null;

  const distances = {};
  const previous = {};
  const unvisited = new Set();

  // Initialize distances
  graph.nodes.forEach((node) => {
    distances[node.id] = Infinity;
    previous[node.id] = null;
    unvisited.add(node.id);
  });

  distances[startNodeId] = 0;

  // Build Adjacency List excluding blocked edges
  const adj = {};
  graph.nodes.forEach((n) => (adj[n.id] = []));

  graph.edges.forEach((edge) => {
    if (blockedEdgeIds.includes(edge.id) || edge.isBlocked) return;
    adj[edge.source].push({ node: edge.target, weight: edge.weight, edgeId: edge.id });
    adj[edge.target].push({ node: edge.source, weight: edge.weight, edgeId: edge.id });
  });

  while (unvisited.size > 0) {
    // Find unvisited node with smallest distance
    let current = null;
    let minDistance = Infinity;

    unvisited.forEach((nodeId) => {
      if (distances[nodeId] < minDistance) {
        minDistance = distances[nodeId];
        current = nodeId;
      }
    });

    if (current === null || current === targetNodeId) break;

    unvisited.delete(current);

    // Update neighbors
    adj[current].forEach((neighbor) => {
      if (unvisited.has(neighbor.node)) {
        const alt = distances[current] + neighbor.weight;
        if (alt < distances[neighbor.node]) {
          distances[neighbor.node] = alt;
          previous[neighbor.node] = { nodeId: current, edgeId: neighbor.edgeId };
        }
      }
    });
  }

  // Reconstruct path
  if (distances[targetNodeId] === Infinity) {
    return { path: [], pathNodes: [], totalWeight: Infinity, isRecalculated: blockedEdgeIds.length > 0 };
  }

  const pathNodes = [];
  let curr = targetNodeId;
  while (curr !== null) {
    const nodeObj = graph.nodes.find((n) => n.id === curr);
    pathNodes.unshift(nodeObj);
    curr = previous[curr] ? previous[curr].nodeId : null;
  }

  // Calculate coordinates array for polylines
  const polylineCoords = pathNodes.map((n) => ({ lat: n.lat, lng: n.lng, name: n.name, id: n.id }));

  const totalDistanceKm = distances[targetNodeId]; // weight in km
  const estMins = Math.max(1, Math.round(totalDistanceKm * 1.8)); // est speed ~45 km/h

  return {
    pathNodes,
    polylineCoords,
    totalDistanceKm: parseFloat(totalDistanceKm.toFixed(2)),
    estMins,
    isRecalculated: blockedEdgeIds.length > 0
  };
};

/**
 * Finds nearest graph node for a given arbitrary GPS location
 */
export const findNearestGraphNode = (graph, location) => {
  if (!graph || !graph.nodes) return null;
  let nearest = null;
  let minDist = Infinity;

  graph.nodes.forEach((node) => {
    const dist = haversineDistanceKm(location, { lat: node.lat, lng: node.lng });
    if (dist < minDist) {
      minDist = dist;
      nearest = node;
    }
  });

  return nearest;
};
