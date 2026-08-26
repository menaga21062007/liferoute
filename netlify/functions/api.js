import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import {
  INITIAL_HOSPITALS,
  INITIAL_AMBULANCES,
  INITIAL_TRAFFIC_SIGNALS,
  EMERGENCY_CATEGORIES,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_TRIP_HISTORY,
  PREDICTIVE_ANALYTICS_DATA,
  HOSPITAL_RESOURCE_MARKETPLACE
} from '../../server/mockData.js';
import { recommendHospitals } from '../../server/recommendationEngine.js';

const app = express();
app.use(cors());
app.use(express.json());

let hospitals = JSON.parse(JSON.stringify(INITIAL_HOSPITALS));
let ambulances = JSON.parse(JSON.stringify(INITIAL_AMBULANCES));
let trafficSignals = JSON.parse(JSON.stringify(INITIAL_TRAFFIC_SIGNALS));
let activityLogs = JSON.parse(JSON.stringify(INITIAL_ACTIVITY_LOGS));
let marketplaceResources = JSON.parse(JSON.stringify(HOSPITAL_RESOURCE_MARKETPLACE));

routerGet('/state', (req, res) => {
  res.json({
    hospitals,
    ambulances,
    trafficSignals,
    alerts: [],
    activityLogs,
    tripHistory: INITIAL_TRIP_HISTORY,
    marketplaceResources,
    predictiveAnalytics: PREDICTIVE_ANALYTICS_DATA,
    isSimulationRunning: true
  });
});

routerGet('/emergency-categories', (req, res) => {
  res.json(EMERGENCY_CATEGORIES);
});

routerPost('/recommend-hospital', (req, res) => {
  const { patientLocation, conditionCategory } = req.body;
  const recommendations = recommendHospitals(patientLocation, conditionCategory, hospitals);
  res.json(recommendations);
});

routerPost('/marketplace/transfer', (req, res) => {
  const { resourceId, requestingHospitalName, requestedUnits } = req.body;
  const resItem = marketplaceResources.find(r => r.id === resourceId);
  if (!resItem) return res.status(404).json({ error: "Resource not found" });

  const units = parseInt(requestedUnits) || 1;
  if (resItem.availableUnits >= units) {
    resItem.availableUnits -= units;
    if (resItem.availableUnits === 0) resItem.status = "SURGE_RESERVED";
    res.json({ success: true, resource: resItem });
  } else {
    res.status(400).json({ error: "Insufficient units" });
  }
});

function routerGet(path, handler) {
  app.get(['/api' + path, '/.netlify/functions/api' + path], handler);
}

function routerPost(path, handler) {
  app.post(['/api' + path, '/.netlify/functions/api' + path], handler);
}

export const handler = serverless(app);
