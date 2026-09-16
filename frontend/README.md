




# 🛡️ IBVAP

## Intelligent Border Video Analytics Platform

> **Transforming existing CCTV infrastructure into an intelligent, AI-assisted border surveillance and threat intelligence platform.**

[![Smart India Hackathon 2026](https://img.shields.io/badge/Smart%20India%20Hackathon-2026-blue)](#)
[![AI Surveillance](https://img.shields.io/badge/AI-Video%20Analytics-blue)](#)
[![Computer Vision](https://img.shields.io/badge/Computer%20Vision-YOLO-green)](#)
[![Status](https://img.shields.io/badge/Status-Prototype-orange)](#)

---

## 🌐 Live Demo

🚀 **Live Application:** 

Here is the prototype link:

`https://ibvap-border-surveillance-analytics.vercel.app/`

---

# 🎯 Problem Statement

### SIH26187 – AI-Based Intelligent Video Analytics Platform for Border Surveillance using Existing CCTV Infrastructure

Border surveillance environments rely heavily on continuous monitoring of CCTV and IP camera feeds. Manual monitoring across multiple cameras can make it difficult to identify suspicious activity quickly.

**IBVAP (Intelligent Border Video Analytics Platform)** is designed as an AI-assisted command-and-control prototype that processes surveillance video, identifies relevant objects, tracks activity, monitors virtual restricted zones, calculates risk, generates alerts, preserves evidence, and helps trained human operators understand incidents quickly.

The platform is designed as a **decision-support system**. AI provides detection, risk assessment, and explanations while important real-world decisions remain under human control.

---

# 🚀 Key Features

## 📹 Intelligent CCTV Surveillance

* Multi-camera surveillance interface
* Live camera monitoring
* Camera status monitoring
* AI detection overlays
* Bounding boxes
* Person and vehicle detection
* Tracking IDs
* Confidence scores
* Fullscreen surveillance mode

---

## 🧠 AI Object Detection

The architecture is prepared for AI-powered detection using:

* Ultralytics YOLO
* OpenCV
* Python
* FastAPI

Supported detection information includes:

* Object type
* Tracking ID
* Confidence score
* Bounding box
* Camera ID
* Timestamp
* Zone information

---

## 🚧 Virtual Border & Zone Monitoring

Operators can define surveillance zones such as:

🟢 SAFE
🟡 WARNING
🟠 RESTRICTED
🔴 CRITICAL

The system can evaluate whether tracked objects enter sensitive zones and generate risk-based alerts.

---

## 🚨 Intelligent Threat Detection

IBVAP evaluates incidents using multiple contextual factors:

* Object type
* Detection confidence
* Zone severity
* Duration inside a zone
* Movement behavior
* Time of activity

Threat levels:

🟢 LOW
🟡 MEDIUM
🟠 HIGH
🔴 CRITICAL

---

## 🔍 Explainable AI Threat Assessment

Instead of only displaying a threat score, IBVAP explains **why** an incident received a particular risk level.

Example:

> **Threat Score: 92/100 – CRITICAL**

Possible reasons:

* Person entered a restricted zone
* Activity occurred during restricted hours
* Object remained inside the zone
* Detection confidence exceeded the security threshold
* No authorized identity was associated

The system can also recommend an operator review action.

---

## 📊 Command Center Dashboard

The main command center provides:

* Live cameras
* Active AI tracks
* Alerts today
* Critical threats
* System uptime
* Average AI confidence
* Live CCTV feed
* Detection overlays
* Real-time threat feed
* AI threat explanation

---

## 📋 Incident Management

Every significant event can be recorded as an incident.

Incident information includes:

* Incident ID
* Timestamp
* Camera
* Sector
* Object type
* Tracking ID
* Threat type
* Confidence
* Risk score
* Risk level
* Status
* Operator actions

Incident statuses:

`NEW → ACKNOWLEDGED → INVESTIGATING → RESOLVED`

False-positive classification is also supported.

---

## 🗂️ Evidence Vault

The evidence system stores or references:

* Detection screenshots
* Video clip references
* Detection metadata
* Camera information
* Tracking ID
* Confidence
* Threat score
* Incident ID
* Integrity/hash placeholder
* Operator status

Evidence access is designed to avoid insecure public file exposure.

---

## 📈 Threat Intelligence & Analytics

The analytics module can visualize:

* Threats by hour
* Threats by camera
* Threats by sector
* Person detections
* Vehicle detections
* Intrusion events
* Risk distribution
* Threat activity timeline

---

## 🗺️ Border Surveillance Map

The map module can display:

* Border sectors
* Camera locations
* Online cameras
* Offline cameras
* Active alerts
* Threat hotspots

Selecting a camera can show its operational status and recent activity.

---

## ❤️ System Health Monitoring

Monitor:

* AI Detection Engine
* API Server
* Database
* WebSocket connection
* Connected cameras
* AI inference FPS
* Average latency
* CPU usage
* Memory usage
* GPU usage

---

# 🎬 SIH Demo Mode

IBVAP includes a simulated **Demo Mode** for demonstrations when the actual AI inference engine or CCTV streams are unavailable.

### Demo Workflow

```text
Person Detected
       ↓
Tracking ID Assigned
       ↓
Approaches Warning Zone
       ↓
Risk Score Increases
       ↓
Enters Restricted Zone
       ↓
Critical Threat Generated
       ↓
Real-Time Alert
       ↓
Evidence Captured
       ↓
Incident Created
       ↓
AI Explains Risk
       ↓
Operator Reviews Incident
       ↓
Incident Status Updated
```

A **RUN DEMO SCENARIO** feature can trigger this workflow.

---

# 🏗️ System Architecture

```text
                 ┌───────────────────┐
                 │ CCTV / IP Cameras │
                 └─────────┬─────────┘
                           │
                           ▼
                 ┌───────────────────┐
                 │ Video Stream     │
                 │ Processing       │
                 └─────────┬─────────┘
                           │
                           ▼
                 ┌───────────────────┐
                 │ AI Detection     │
                 │ YOLO + OpenCV    │
                 └─────────┬─────────┘
                           │
                           ▼
                 ┌───────────────────┐
                 │ Object Tracking  │
                 └─────────┬─────────┘
                           │
                           ▼
                 ┌───────────────────┐
                 │ Zone Monitoring  │
                 │ Risk Analysis    │
                 └─────────┬─────────┘
                           │
                           ▼
                 ┌───────────────────┐
                 │ Threat Detection │
                 │ & Alert Engine   │
                 └─────────┬─────────┘
                           │
                           ▼
                 ┌───────────────────┐
                 │ Evidence &       │
                 │ Incident System  │
                 └─────────┬─────────┘
                           │
                           ▼
                 ┌───────────────────┐
                 │ Human Operator   │
                 │ Command Center   │
                 └───────────────────┘
```

---

# 🛠️ Technology Stack

## Frontend

* React / Next.js
* TypeScript
* Tailwind CSS
* Modern UI Component Library

## Backend & Database

* Supabase
* PostgreSQL
* Supabase Authentication
* Supabase Storage
* Supabase Realtime

## AI & Computer Vision

* Python
* FastAPI
* OpenCV
* Ultralytics YOLO
* Object Tracking

## Deployment

* Vercel
* GitHub

---

# 📂 Project Structure

```text
IBVAP/
│
├── components/          # Reusable UI components
├── pages/               # Application pages
├── services/            # API and Supabase services
├── hooks/               # Custom React hooks
├── types/               # TypeScript types
├── utils/               # Helper functions
├── public/              # Static assets
│
├── .env.example         # Environment variable template
├── .gitignore
├── package.json
└── README.md
```

---

# 🔐 Authentication & Roles

IBVAP supports role-based access.

Roles include:

* 👑 ADMIN
* 🎖️ COMMANDER
* 🖥️ OPERATOR
* 📊 ANALYST

Authentication is designed using Supabase Auth.

Dashboard access can be protected based on authenticated users and assigned roles.

---

# 🗄️ Database Architecture

Main data entities:

```text
profiles
cameras
zones
detections
tracked_objects
incidents
alerts
evidence
operator_actions
system_health
```

The database is designed to store camera information, AI detections, tracking information, incidents, alerts, evidence metadata, and operator actions.

---

# ⚡ Real-Time Functionality

Real-time functionality can use:

* Supabase Realtime
* WebSocket events

The system is designed so that:

* New detections appear automatically
* Alerts appear without refreshing
* Incident status updates dynamically
* Dashboard values update in real time

---

# 🤖 Python AI Service Integration

The frontend is prepared for integration with a Python FastAPI AI service.

Planned API endpoints include:

```text
GET  /health
GET  /api/cameras
POST /api/cameras

GET  /api/incidents
POST /api/incidents

POST /api/detections

GET  /api/stream/{camera_id}

WebSocket:
/ws/events
```

This modular architecture allows simulated demo data to be replaced with the real AI service without rebuilding the complete frontend.

---

# ⚙️ Installation

## 1. Clone the Repository

```bash
git clone https://github.com/Riddhi23133/IBVAP_Border_surveillance.git
```

## 2. Open the Project

```bash
cd IBVAP_Border_surveillance
```

## 3. Install Dependencies

```bash
npm install
```

## 4. Create Environment File

Create:

```text
.env.local
```

Example:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_AI_API_URL=http://localhost:8000
```

Use environment variable names matching your actual framework configuration.

---

# ▶️ Run Locally

```bash
npm run dev
```

Then open the local URL shown in your terminal.

---

# 🚀 Deployment

The frontend can be deployed using Vercel.

Typical workflow:

```text
GitHub Repository
        ↓
Vercel Import
        ↓
Environment Variables
        ↓
Build & Deploy
        ↓
Live Application
```

---

# 🔒 Security

IBVAP is designed with the following security principles:

* No hard-coded secrets
* Environment variables for configuration
* No exposed database passwords
* No exposed Supabase service-role keys
* No exposed RTSP passwords
* Role-based access
* Row Level Security where applicable
* Controlled evidence access

---

# 🎯 Smart India Hackathon 2026

**Project Name:** IBVAP – Intelligent Border Video Analytics Platform

**Problem Statement:** SIH26187 – AI-Based Intelligent Video Analytics Platform for Border Surveillance using Existing CCTV Infrastructure

**Team:** BWU NEURAL NEXUS

**Event:** Smart India Hackathon 2026

---

# 🔮 Future Improvements

* Real-time RTSP camera integration
* Production YOLO inference pipeline
* Advanced multi-object tracking
* Multi-camera tracking
* Improved anomaly detection
* Camera reliability scoring
* Automated incident reconstruction
* Advanced geospatial threat intelligence
* Improved evidence integrity verification
* Scalable multi-camera deployment

---

# ⚠️ Disclaimer

IBVAP is an AI-assisted surveillance and decision-support prototype.

The system is designed to help trained human operators identify, understand, and prioritize potential security events.

It does **not** autonomously control weapons or perform autonomous physical actions.

---

# 👨‍💻 Developed By

### BWU NEURAL NEXUS

Built for **Smart India Hackathon 2026**.

---

## ⭐ Support

If you find this project interesting, consider giving the repository a ⭐ on GitHub.

---

> **IBVAP — Intelligent Video. Intelligent Detection. Human-Controlled Response.**
