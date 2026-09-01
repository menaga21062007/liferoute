import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import {
  GOVERNMENT_HOSPITALS,
  INITIAL_AMBULANCES,
  INITIAL_TRAFFIC_SIGNALS,
  EMERGENCY_CATEGORIES,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_TRIP_HISTORY,
  PREDICTIVE_ANALYTICS_DATA,
  HOSPITAL_RESOURCE_MARKETPLACE
} from '../../server/mockData.js';

const app = express();
app.use(cors());
app.use(express.json());

let hospitals = JSON.parse(JSON.stringify(GOVERNMENT_HOSPITALS)).slice(0, 3);
let ambulances = JSON.parse(JSON.stringify(INITIAL_AMBULANCES));
let trafficSignals = JSON.parse(JSON.stringify(INITIAL_TRAFFIC_SIGNALS));
let activityLogs = JSON.parse(JSON.stringify(INITIAL_ACTIVITY_LOGS));
let marketplaceResources = JSON.parse(JSON.stringify(HOSPITAL_RESOURCE_MARKETPLACE));

app.get('/api/state', (req, res) => {
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

export const handler = serverless(app);
