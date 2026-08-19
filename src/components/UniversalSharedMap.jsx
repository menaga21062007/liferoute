import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useApp } from '../context/AppContext';
import { ShieldAlert } from 'lucide-react';

// Custom Leaflet Marker Icons
const createAmbulanceIcon = (code, status, isSelected) => {
  const isEnRoute = status === 'EN_ROUTE' || status === 'Assigned';
  return L.divIcon({
    className: 'shared-ambulance-marker-icon',
    html: `
      <div style="position: relative; display: flex; align-items: center; justify-content: center; z-index: 1000;">
        ${isSelected ? `<div style="position: absolute; inset: -12px; border-radius: 9999px; border: 3px solid #3B82F6; animation: ping 1.5s infinite;"></div>` : ''}
        ${isEnRoute ? `<div style="position: absolute; inset: -8px; border-radius: 9999px; background: rgba(239, 68, 68, 0.4); animation: ping 1.5s infinite;"></div>` : ''}
        <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 38px; height: 38px; border-radius: 9999px; border: 2.5px solid #ffffff; background: ${isEnRoute ? '#EF4444' : '#3B82F6'}; color: #ffffff; box-shadow: 0 10px 25px rgba(0,0,0,0.6);">
          <svg style="width: 22px; height: 22px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8h4l3 3v5h-2m-4 0h-4M7 8h2m-2 3h2"></path>
          </svg>
        </div>
        <div style="position: absolute; bottom: -20px; background: rgba(15, 23, 42, 0.95); color: #ffffff; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 4px; border: 1px solid #334155; white-space: nowrap; box-shadow: 0 4px 6px rgba(0,0,0,0.4);">
          🚑 ${code}
        </div>
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19]
  });
};

const createHospitalIcon = (code, status, beds, name) => {
  let borderCol = '#22C55E';
  let badgeBg = '#22C55E';
  if (status === 'LIMITED') {
    borderCol = '#F59E0B';
    badgeBg = '#F59E0B';
  } else if (status === 'CRITICAL') {
    borderCol = '#EF4444';
    badgeBg = '#EF4444';
  }

  return L.divIcon({
    className: 'shared-hospital-marker-icon',
    html: `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center; z-index: 950;">
        <div style="display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 12px; background: #020617; border: 2.5px solid ${borderCol}; box-shadow: 0 10px 25px rgba(0,0,0,0.7); color: #60A5FA;">
          <svg style="width: 24px; height: 24px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
          </svg>
        </div>
        <div style="position: absolute; top: -6px; right: -6px; background: ${badgeBg}; color: #020617; font-size: 10px; font-weight: 900; width: 18px; height: 18px; border-radius: 9999px; display: flex; align-items: center; justify-content: center; border: 1.5px solid #ffffff;">
          ${beds || 0}
        </div>
        <div style="margin-top: 2px; background: rgba(2, 6, 23, 0.95); color: #ffffff; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 4px; border: 1px solid #1E293B; white-space: nowrap;">
          🏥 ${code}
        </div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20]
  });
};

const createEmergencyRequestIcon = (reqId, severity, isSelected) => {
  let color = '#EF4444'; // Critical
  if (severity === 'HIGH') color = '#F97316';
  if (severity === 'MEDIUM') color = '#F59E0B';
  if (severity === 'LOW') color = '#3B82F6';

  return L.divIcon({
    className: 'shared-request-marker-icon',
    html: `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center; z-index: 980;">
        <div style="position: absolute; inset: -8px; border-radius: 9999px; background: ${color}; opacity: 0.4; animation: ping 1.8s infinite;"></div>
        ${isSelected ? `<div style="position: absolute; inset: -12px; border-radius: 9999px; border: 3px solid #ffffff; animation: pulse 1s infinite;"></div>` : ''}
        <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: 9999px; background: ${color}; color: #ffffff; border: 2px solid #ffffff; box-shadow: 0 8px 20px rgba(0,0,0,0.6);">
          <svg style="width: 20px; height: 20px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
        </div>
        <div style="margin-top: 2px; background: rgba(15, 23, 42, 0.95); color: #ffffff; font-size: 9px; font-weight: 900; padding: 1px 5px; border-radius: 4px; border: 1px solid #334155; white-space: nowrap;">
          🚨 ${reqId}
        </div>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17]
  });
};

const createSignalIcon = (code, status) => {
  const isGreen = status === 'GREEN';
  return L.divIcon({
    className: 'shared-signal-marker-icon',
    html: `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center; z-index: 900;">
        <div style="display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 8px; background: #020617; border: 2px solid ${isGreen ? '#22C55E' : '#EF4444'}; box-shadow: 0 4px 10px rgba(0,0,0,0.5);">
          <div style="width: 12px; height: 12px; border-radius: 9999px; background: ${isGreen ? '#22C55E' : '#EF4444'};"></div>
        </div>
        <div style="margin-top: 1px; background: rgba(15, 23, 42, 0.9); color: #94A3B8; font-size: 8px; font-weight: 700; padding: 1px 3px; border-radius: 3px;">
          ${code}
        </div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });
};

export const UniversalSharedMap = ({
  showAmbulances = true,
  showHospitals = true,
  showEmergencyRequests = true,
  showHotspots = true,
  showRoutes = true,
  showTrafficSignals = true,
  showRoadGraph = true,
  selectedAmbulanceId = null,
  selectedRequestId = null,
  selectedHospitalId = null,
  height = "h-full",
  isMiniMap = false
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupRef = useRef(null);

  const {
    hospitals,
    ambulances,
    emergencyRequests,
    dbscanHotspots,
    activeDijkstraRoute,
    roadGraph,
    trafficSignals,
    blockedEdges
  } = useApp();

  // Initialize Leaflet Map Instance
  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      const map = L.map(mapRef.current, {
        center: [40.735000, -73.965000],
        zoom: isMiniMap ? 11 : 12,
        zoomControl: !isMiniMap,
        dragging: !isMiniMap,
        scrollWheelZoom: !isMiniMap
      });

      if (!isMiniMap) {
        L.control.zoom({ position: 'bottomright' }).addTo(map);
      }

      // CARTO Dark Tile Layer with OpenStreetMap Fallback
      const tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; CARTO • OpenStreetMap',
        maxZoom: 19,
        subdomains: 'abcd',
      });

      tileLayer.on('tileerror', () => {
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; OpenStreetMap'
        }).addTo(map);
      });

      tileLayer.addTo(map);

      const layerGroup = L.layerGroup().addTo(map);
      layerGroupRef.current = layerGroup;

      mapInstanceRef.current = map;

      // Invalidate size & fit bounds across multiple ticks to prevent blank map canvas
      const fitBoundsTimer = () => {
        if (!mapInstanceRef.current) return;
        mapInstanceRef.current.invalidateSize();

        if (hospitals && hospitals.length > 0) {
          const points = hospitals.map(h => [h.location.lat, h.location.lng]);
          if (emergencyRequests && emergencyRequests.length > 0) {
            emergencyRequests.forEach(r => points.push([r.location.lat, r.location.lng]));
          }
          if (points.length > 0) {
            const bounds = L.latLngBounds(points);
            mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40] });
          }
        }
      };

      setTimeout(fitBoundsTimer, 100);
      setTimeout(fitBoundsTimer, 300);
      setTimeout(fitBoundsTimer, 600);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        layerGroupRef.current = null;
      }
    };
  }, []);

  // Update Dynamic Map Layers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    // 1. Road Graph Lines (Subtle Gray Lines & Intersection Nodes)
    if (showRoadGraph && roadGraph && roadGraph.edges) {
      roadGraph.edges.forEach((edge) => {
        const sourceNode = roadGraph.nodes.find(n => n.id === edge.source);
        const targetNode = roadGraph.nodes.find(n => n.id === edge.target);
        if (sourceNode && targetNode) {
          const isBlocked = (blockedEdges || []).includes(edge.id);
          const line = L.polyline(
            [[sourceNode.lat, sourceNode.lng], [targetNode.lat, targetNode.lng]],
            {
              color: isBlocked ? '#EF4444' : '#475569',
              weight: isBlocked ? 3.5 : 2,
              opacity: isBlocked ? 0.9 : 0.45,
              dashArray: isBlocked ? '6, 6' : undefined
            }
          );
          layerGroup.addLayer(line);
        }
      });
    }

    // 2. DBSCAN Hotspot Zones (Translucent Clustered Circles & Labels)
    if (showHotspots && dbscanHotspots && dbscanHotspots.length > 0) {
      dbscanHotspots.forEach((zone) => {
        const circle = L.circle([zone.center.lat, zone.center.lng], {
          radius: zone.radiusKm * 1000,
          color: zone.color,
          fillColor: zone.color,
          fillOpacity: 0.22,
          weight: 2
        });
        circle.bindTooltip(`
          <div style="font-family: Inter, sans-serif; padding: 2px 4px; font-weight: 800; color: ${zone.color};">
            <strong>${zone.label} (${zone.zoneName})</strong><br/>
            Requests: ${zone.totalRequests} | Critical: ${zone.criticalCount} | Priority: ${zone.priorityScore}
          </div>
        `);
        layerGroup.addLayer(circle);
      });
    }

    // 3. Hospitals Layer (All 4 Hospitals: VGH, VH, MHVI, CCPH)
    if (showHospitals && hospitals) {
      hospitals.forEach((hosp) => {
        if (!hosp.location) return;
        const icon = createHospitalIcon(hosp.code, hosp.status, hosp.availableBeds, hosp.name);
        const marker = L.marker([hosp.location.lat, hosp.location.lng], { icon });
        marker.bindPopup(`
          <div style="padding: 4px; font-family: Inter, sans-serif; color: #0f172a;">
            <div style="font-weight: 900; font-size: 13px; color: #1e3a8a;">🏥 ${hosp.name} (${hosp.code})</div>
            <div style="font-size: 11px; color: #475569; margin-top: 2px;">${hosp.address}</div>
            <div style="margin-top: 6px; font-size: 11px; display: flex; gap: 6px;">
              <span style="background: #dcfce7; color: #166534; font-weight: 800; padding: 2px 6px; border-radius: 4px;">Available Beds: ${hosp.availableBeds}/${hosp.totalBeds}</span>
            </div>
          </div>
        `);
        layerGroup.addLayer(marker);
      });
    }

    // 4. Emergency Requests Layer
    if (showEmergencyRequests && emergencyRequests) {
      emergencyRequests.forEach((req) => {
        if (!req.location) return;
        const isSelected = selectedRequestId === req.id;
        const icon = createEmergencyRequestIcon(req.id, req.severity, isSelected);
        const marker = L.marker([req.location.lat, req.location.lng], { icon });
        marker.bindPopup(`
          <div style="padding: 4px; font-family: Inter, sans-serif; color: #0f172a;">
            <div style="font-weight: 900; font-size: 13px; color: #dc2626;">🚨 ${req.id} — ${req.patientName}</div>
            <div style="font-size: 11px; font-weight: 700; color: #475569; margin-top: 2px;">Type: ${req.emergencyType} | Severity: ${req.severity}</div>
            <div style="font-size: 11px; color: #64748b; margin-top: 2px;">Location: ${req.location.name}</div>
            <div style="font-size: 11px; color: #b91c1c; font-weight: 700; margin-top: 2px;">Status: ${req.status}</div>
          </div>
        `);
        layerGroup.addLayer(marker);
      });
    }

    // 5. Ambulances Layer
    if (showAmbulances && ambulances) {
      ambulances.forEach((amb) => {
        if (!amb.currentLocation) return;
        const isSelected = selectedAmbulanceId === amb.id;
        const icon = createAmbulanceIcon(amb.code, amb.status, isSelected);
        const marker = L.marker([amb.currentLocation.lat, amb.currentLocation.lng], { icon });
        layerGroup.addLayer(marker);
      });
    }

    // 6. Traffic Signals Layer
    if (showTrafficSignals && trafficSignals) {
      trafficSignals.forEach((sig) => {
        if (!sig.location) return;
        const icon = createSignalIcon(sig.code, sig.status);
        const marker = L.marker([sig.location.lat, sig.location.lng], { icon });
        layerGroup.addLayer(marker);
      });
    }

    // 7. Active Dijkstra Route Layer
    if (showRoutes && activeDijkstraRoute && activeDijkstraRoute.polylineCoords && activeDijkstraRoute.polylineCoords.length > 0) {
      const coords = activeDijkstraRoute.polylineCoords.map(pt => [pt.lat, pt.lng]);
      const glowLine = L.polyline(coords, { color: '#3B82F6', weight: 7, opacity: 0.4 });
      const activeLine = L.polyline(coords, { color: '#22C55E', weight: 4, opacity: 0.95, dashArray: '8, 8' });
      layerGroup.addLayer(glowLine);
      layerGroup.addLayer(activeLine);

      // Numbered Checkpoint Markers
      activeDijkstraRoute.polylineCoords.forEach((pt, idx) => {
        const numberIcon = L.divIcon({
          className: 'checkpoint-marker',
          html: `<div style="background: #020617; border: 2px solid #22C55E; color: #22C55E; font-size: 10px; font-weight: 900; width: 22px; height: 22px; border-radius: 9999px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 8px rgba(0,0,0,0.5);">${idx + 1}</div>`,
          iconSize: [22, 22],
          iconAnchor: [11, 11]
        });
        const chkMarker = L.marker([pt.lat, pt.lng], { icon: numberIcon });
        layerGroup.addLayer(chkMarker);
      });
    }

  }, [
    ambulances,
    hospitals,
    emergencyRequests,
    dbscanHotspots,
    activeDijkstraRoute,
    roadGraph,
    trafficSignals,
    blockedEdges,
    showAmbulances,
    showHospitals,
    showEmergencyRequests,
    showHotspots,
    showRoutes,
    showTrafficSignals,
    showRoadGraph,
    selectedAmbulanceId,
    selectedRequestId,
    selectedHospitalId
  ]);

  return (
    <div className={`relative w-full ${height} rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950`}>
      <div ref={mapRef} className="w-full h-full z-0 min-h-[400px]" />

      {/* Persistent Badge & Legend Overlay */}
      {!isMiniMap && (
        <div className="absolute top-3 left-3 z-10 bg-slate-900/95 backdrop-blur-md border border-slate-800 p-3 rounded-2xl text-[10px] space-y-1.5 text-slate-300 shadow-2xl max-w-xs">
          <div className="flex items-center space-x-1.5 border-b border-slate-800 pb-1 mb-1">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-black text-white uppercase tracking-wider text-[11px]">UNIVERSAL SHARED DEMO MAP</span>
          </div>

          <div className="grid grid-cols-2 gap-x-3 gap-y-1 font-bold text-[10px]">
            <div className="flex items-center space-x-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
              <span>Ambulance Unit</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
              <span>Emergency Request</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              <span>Hospital Hub (All 4)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
              <span>DBSCAN Hotspot</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span>Dijkstra Route</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-slate-500" />
              <span>City Road Graph</span>
            </div>
          </div>

          <div className="pt-1.5 border-t border-slate-800/80 text-[9px] text-slate-400 leading-tight">
            ⚠ All locations, GPS data, DBSCAN zones & routes are fictional simulations.
          </div>
        </div>
      )}
    </div>
  );
};
