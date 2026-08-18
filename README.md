# LifeRoute - Smart Ambulance Tracking & Emergency Response Platform

**LifeRoute** is a production-like emergency response platform featuring live GPS tracking, AI-powered smart hospital recommendation & auto-bed/OT allocation, automated Green Corridor traffic signal control, dynamic vitals monitoring, and multi-role dashboards.

---

## 🌟 Key Features

### 🚑 1. Ambulance Crew Application
- **Patient Intake Form**: Enter patient details (Name, Age, Gender, Chief Complaint).
- **Emergency Category Classifier**: Select from 6 critical categories (*Cardiac Arrest/STEMI, Stroke, Major Trauma, Respiratory Distress, Severe Burns, Pediatric Emergency*).
- **AI Hospital Matcher**: Automatically ranks nearby hospitals based on:
  - Distance & ETA
  - Available ICU Beds & Operating Theaters (OTs)
  - Medical Specialty Match (e.g. Cardiac Specialty for STEMI, Level 1 Trauma Center for accidents)
- **Live Vitals & ECG Waveform Telemetry**: Real-time streaming of HR, Blood Pressure, SpO2, Temperature, and ECG wave pattern.
- **Trip Route Simulation**: Smooth live GPS tracking with animated routes on an interactive Leaflet map.

### 🏥 2. Hospital ER Staff Dashboard
- **Incoming Ambulance Queue**: Real-time cards displaying incoming ambulances, patient summaries, and countdown ETAs.
- **Auto Resource Allocation**: Automatically reserves an ICU Emergency Bed and Operating Theater (OT) upon dispatch.
- **Capacity Management**: Live gauges and lists for ICU Beds and OTs with 1-click status actions:
  - `MARK ER TEAM READY`
  - `MARK PATIENT RECEIVED`
  - `RELEASE BED / OT`

### 🚦 3. Green Corridor Traffic Controller
- **Proximity Radar Automation**: Detects approaching ambulances within 300 meters.
- **Automated Green Corridor**: Automatically flips signal lights to **GREEN** when the ambulance approaches, returning to **NORMAL** after passing.
- **Visual Signal Indicators**: Glowing red/green lights with animated status pulses.
- **Manual Overrides**: Toggle any intersection signal manually during critical dispatches.

### 🎛️ 4. Central Command Center
- **Unified Master Overview**: Dark-mode interactive Leaflet map rendering active ambulances, hospital status rings, traffic signals, and route polylines.
- **Live System Alert Feed**: Real-time event log for STEMI alerts, Green Corridor activations, and ER team prep updates.
- **Global Role Switcher**: Instant switching between Command Center, Ambulance Crew, Hospital Staff, and Traffic Control views.

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18.x or higher
- **NPM**: v9.x or higher

### Installation & Launch

1. Open terminal inside the project directory:
   ```bash
   cd C:\Users\Menaga\.gemini\antigravity\scratch\liferoute
   ```

2. Install dependencies:
   ```bash
   cmd /c "npm install"
   ```

3. Run the development server (starts both Express backend on port 5000 and Vite frontend on port 3000):
   ```bash
   cmd /c "npm run dev"
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## 🎮 Sample Demo Flow (Step-by-Step Presentation Guide)

1. **Overview (Command Center)**:
   - Click **Command Center** in the top navbar. View all active ambulances, hospitals with capacity rings, and traffic signals on the dark map.

2. **Patient Loading & Dispatch (Ambulance Crew View)**:
   - Switch to **Ambulance Crew View**.
   - Enter patient info (e.g. *John Sterling*, 54M).
   - Select **Cardiac Arrest / STEMI** category.
   - Observe the **AI Smart Recommendation** automatically highlight *Metropolitan Central Hospital* (top specialty & bed match).
   - Click **"START EMERGENCY TRIP & NOTIFY HOSPITAL"**.

3. **Traffic Signal Automation (Traffic Control View)**:
   - Switch to **Traffic Control View** or watch the map.
   - As the ambulance moves along the route, observe traffic signal `TS-01` automatically switch to **GREEN** with a glowing **GREEN CORRIDOR ACTIVE** badge when within 300m.

4. **Hospital Readiness & Patient Receipt (Hospital Staff View)**:
   - Switch to **Hospital Staff View**.
   - Notice the incoming notification for **AMB-101** with **ICU Bed-02** and **Cardiac OT-2** auto-reserved.
   - Click **"MARK ER TEAM READY"** to prep trauma staff.
   - Click **"MARK PATIENT RECEIVED"** when the ambulance arrives to complete handoff and update hospital occupancy.
