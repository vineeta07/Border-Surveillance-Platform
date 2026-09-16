# PRAMAN DRISHTI(Provable Risk & Automated Monitoring Analytics Network)

Transforming existing CCTV infrastructure into an intelligent, AI-assisted border surveillance platform with a blockchain-backed evidence and audit trail.

**Smart India Hackathon 2026** · AI Surveillance · Computer Vision · Blockchain & Cybersecurity · **Status:** In Development

---

## 🎯 Problem Statement

**SIH26187 – AI-Based Intelligent Video Analytics Platform for Border Surveillance using Existing CCTV Infrastructure**

- **Organization:** Ministry of Home Affairs
- **Department:** Sashastra Seema Bal (SSB), Police II Division
- **Theme:** Blockchain & Cybersecurity

Border security forces deploy CCTV cameras at Border Out Posts, check posts, and border roads, but conventional CCTV only records and streams video — it requires continuous human observation and offers no built-in detection, alerting, or intelligence. Adding capabilities like facial recognition, ANPR, or intrusion detection normally means expensive dedicated hardware, which makes large-scale deployment in remote border areas costly and difficult.

IBVAP is a software-only AI platform that turns existing IP CCTV feeds into an intelligent surveillance network — no proprietary FRS/ANPR hardware required — and pairs that intelligence with a permissioned-blockchain trust layer so every alert, image, and access log is verifiable and tamper-evident after the fact.

---

## 🚀 Key Features

### 📹 Live Surveillance
- Multi-camera grid with per-sector filtering
- Live status per camera (online / offline / AI active)
- Support for standard RGB feeds, thermal, and night-vision cameras
- Fullscreen single-camera view

### 🧠 AI Video Analytics Suite

Software-only pipeline built on:

- **Motion gating** (OpenCV `BackgroundSubtractorMOG2`) to skip AI inference on static frames and cut compute load
- **Detection & tracking** — YOLOv8/YOLO11-Nano exported to ONNX, running on CPU/GPU via ONNX Runtime
- **ANPR** — cropped vehicle regions passed to EasyOCR/PaddleOCR
- **Face detection & matching** — InsightFace embeddings compared against an authorized/watchlist set
- **Supported detection metadata:** object type, tracking ID, confidence score, bounding box, camera ID, timestamp, zone

### 🚧 Virtual Zones
Operators define restricted/warning zones per camera; the system evaluates whether tracked objects enter sensitive zones and raises zone-based alerts (covers the intrusion-detection and suspicious-activity requirements of the problem statement).

### 🚨 Incidents
A unified feed for AI-flagged events and confirmed threats, with:

- Incident ID, timestamp, camera, sector, object type, tracking ID, confidence, risk level
- Status lifecycle: `NEW → ACKNOWLEDGED → INVESTIGATING → RESOLVED` (with false-positive classification)

### 🗂️ Evidence Vault — Tamper-Proof Evidence Chain

This is the core trust layer for the Blockchain & Cybersecurity theme:

- Every flagged event's evidence (image/clip) and metadata are hashed (SHA-256)
- The evidence file itself is stored on IPFS; only the hash and IPFS CID are anchored on-chain
- A **Verify** action recomputes the hash from stored evidence and checks it against the anchored value — proving the record hasn't been altered since capture
- **Generate Report** — export a PDF (and PPTX) summary of an incident: metadata, hash, IPFS CID, chain transaction ID, and timeline

### 🔗 Smart-Contract Governed Watchlist
Adding or removing a plate/face from the watchlist requires endorsement from more than one authorized party — enforced natively through the ledger's endorsement policy rather than a single admin unilaterally editing a shared list.

### 📜 Immutable Access-Audit Trail
Operator queries (who searched for plate X, who pulled up face-match Y) are hashed in rolling batches and anchored to the ledger, so query history can't be quietly altered or deleted — insider misuse becomes detectable and non-repudiable.

### 🤖 Video Analysis + AI Chat
Upload or select a processed feed and ask natural-language questions about it — activities observed, people/vehicle counts, safety concerns, environment description.

### 📊 Command Center Dashboard
Live camera count, active AI tracks, alerts today, critical threats, system uptime, and a recent-activity feed — the operator's overview screen.

### ⚙️ Settings
Camera configuration, system health status (AI engine, API server, ledger connectivity, inference FPS/latency), and the pending multi-signature watchlist approvals queue.

---

## 🔐 Blockchain & Cybersecurity Trust Layer

- **Permissioned ledger:** Hyperledger Fabric test-network, with participating agencies represented as separate orgs — no public/anonymous validator set touching security-sensitive metadata
- **Chaincode** (`evidence-chaincode`, Node.js): `AnchorEvent`, `GetEvent`, `UpdateWatchlist` (the latter gated by a multi-org endorsement policy)
- **Chain gateway service:** a small Node.js REST service (`@hyperledger/fabric-gateway`) that the Python backend calls to anchor and verify events
- **Design principles:** mutual TLS between services, role-based access control with MFA for operator logins, and encryption of evidence at rest — documented as the target security posture for a production deployment, alongside data-minimization aligned with India's DPDP Act, 2023

---

## 🏗️ System Architecture

```
┌────────────────────┐
│  CCTV / IP Cameras  │
└─────────┬───────────┘
          ▼
┌────────────────────┐
│  Ingestion Service  │
└─────────┬───────────┘
          ▼
┌────────────────────┐
│    AI Detection     │
│ (MOG2 → YOLO ONNX)  │
└─────────┬───────────┘
          ▼
┌────────────────────┐
│  ANPR / Face Match  │
└─────────┬───────────┘
          ▼
┌────────────────────┐
│  Zone & Risk Engine │
└─────────┬───────────┘
          ▼
┌────────────────────┐      ┌────────────────────────┐
│  Evidence Hashing   │─────▶│  IPFS (evidence files)  │
└─────────┬───────────┘      └────────────────────────┘
          ▼
┌────────────────────┐
│    Chain Gateway    │
│ (Hyperledger Fabric)│
└─────────┬───────────┘
          ▼
┌────────────────────┐
│ Python Backend API  │
└─────────┬───────────┘
          ▼
┌────────────────────┐
│  React Command      │
│  Center (Operator)  │
└────────────────────┘
```

---

## 🛠️ Technology Stack

**Frontend**
- React + TypeScript (Vite)
- Tailwind CSS

**Backend**
- Python (REST API service, `video_processor.py` for the AI pipeline)

**AI & Computer Vision**
- OpenCV (motion gating)
- YOLOv8/YOLO11-Nano via ONNX Runtime
- EasyOCR / PaddleOCR (ANPR)
- InsightFace (face matching)

**Blockchain**
- Hyperledger Fabric (test-network)
- Node.js chaincode (`fabric-contract-api`)
- Node.js chain-gateway service (`@hyperledger/fabric-gateway`)

**Evidence Storage**
- IPFS (local node or Pinata)

**Reporting**
- reportlab / weasyprint (PDF export)
- python-pptx (PPT export)

---

## 📂 Project Structure

```
Border-Surveillance-/
│
├── frontend/
│   ├── src/pages/          # Command Center, Live Surveillance, Video Analysis,
│   │                       # Incidents, Evidence Vault, Virtual Zones, Settings
│   ├── src/components/
│   └── index.css
│
├── backend/
│   ├── api_server.py
│   ├── app.py
│   └── video_processor.py
│
├── chaincode/
│   └── evidence-chaincode/ # AnchorEvent, GetEvent, UpdateWatchlist
│
├── chain-gateway/          # Node.js REST bridge to Hyperledger Fabric
│
├── .env.example
├── package.json
└── README.md
```

---

## ⚙️ Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd Border-Surveillance-
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

4. **Configure environment variables**

   Create `.env.local` in `frontend/` and `.env` in `backend/` — adjust names to match your actual config:
   ```
   VITE_API_BASE_URL=http://localhost:8000
   IPFS_API_URL=http://localhost:5001
   FABRIC_GATEWAY_URL=http://localhost:4000
   ```

5. **Start the Hyperledger Fabric test-network**
   ```bash
   cd chaincode
   ./network.sh up createChannel -c evidence-channel
   ./network.sh deployCC -ccn evidence-chaincode
   ```

6. **Run the services**

   Backend:
   ```bash
   cd backend && python app.py
   ```

   Chain gateway:
   ```bash
   cd chain-gateway && npm start
   ```

   Frontend:
   ```bash
   cd frontend && npm run dev
   ```

---

## 🔒 Security

- No hard-coded secrets — environment variables for all configuration
- No exposed RTSP credentials or ledger identity keys in source
- Role-based access control for dashboard/operator actions
- Evidence access routed through the API, never exposed as public static files

---

## 🎯 Smart India Hackathon 2026

- **Project Name:** IBVAP – Intelligent Border Video Analytics Platform
- **Problem Statement:** SIH26187 – AI-Based Intelligent Video Analytics Platform for Border Surveillance using Existing CCTV Infrastructure
- **Team:** Team Drishti
- **Event:** Smart India Hackathon 2026

---

## 🔮 Future Improvements

- Real-time RTSP camera integration in place of demo feeds
- Multi-org Hyperledger Fabric deployment across real participating agencies
- DPDP-compliant HMAC storage for biometric data instead of raw embeddings
- Adversarial-input robustness checks on the detection models
- Model-version hash anchoring to detect silent model tampering
- Full zero-trust network segmentation between services

---

## ⚠️ Disclaimer

IBVAP is an AI-assisted surveillance and decision-support prototype. It is designed to help trained human operators identify, understand, and prioritize potential security events. It does not autonomously control weapons or take autonomous physical action.

---

## 💻 Developed By

**Team Drishti**
Built for Smart India Hackathon 2026.

*IBVAP — Intelligent Video. Verifiable Evidence. Human-Controlled Response.*
