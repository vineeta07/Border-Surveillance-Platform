# MASTER PROMPT — BUILD / UPGRADE THE COMPLETE IBVAP PLATFORM

## PROJECT IDENTITY

Build and/or upgrade a complete full-stack prototype for Smart India Hackathon 2026.

**Project Name:**
IBVAP — Intelligent Border Video Analytics Platform

**Team:**
BWU NEURAL NEXUS

**Problem Statement:**
SIH26187 — AI-Based Intelligent Video Analytics Platform for Border Surveillance using Existing CCTV Infrastructure.

---

# CRITICAL PROJECT MODE

First inspect the current project before making changes.

If this project already contains an IBVAP website:

* DO NOT rebuild it from scratch.
* DO NOT delete existing pages.
* DO NOT remove existing features.
* DO NOT simplify the existing Command Center.
* DO NOT replace the current design with a generic dashboard.
* DO NOT break existing routes.
* DO NOT remove navigation.
* DO NOT remove existing demo functionality.
* Reuse existing components whenever possible.
* Extend the existing architecture incrementally.

Preserve all existing:

* Pages
* Components
* Navigation
* Dashboard layout
* Statistics cards
* Threat feed
* Incident system
* Evidence Vault
* Analytics
* Camera Network
* Threat Intelligence
* System Health
* Settings
* Data visualizations
* Alerts
* Existing demo scenario

The goal is to make the existing prototype significantly more functional and realistic while preserving its current identity.

If starting from a completely new project, build the complete architecture described below.

---

# 1. PROJECT GOAL

Create an AI-powered intelligent border surveillance command-and-control platform capable of demonstrating the following workflow:

Existing CCTV / IP Camera
→ Live or Sample Video Stream
→ AI Object Detection
→ Person / Vehicle Tracking
→ Face Analysis using Controlled Demo Identities
→ Virtual Border / Restricted Zone Monitoring
→ Thermal / Night Vision Analysis
→ Risk Analysis
→ Intrusion Detection
→ Real-Time Alert
→ Evidence Capture
→ Incident Management
→ Command Center
→ Human Operator Review

This must NOT be a normal CCTV dashboard.

It should look and behave like a futuristic but realistic national-security command-and-control platform suitable for a Smart India Hackathon demonstration.

The platform is strictly a decision-support system for trained human operators.

Do NOT implement autonomous weapons, weapon control, autonomous physical response, or dangerous real-world actions.

---

# 2. DESIGN LANGUAGE — PRESERVE EXISTING STYLE

Maintain the existing IBVAP command-center design language.

Visual identity:

* Dark navy / near-black background
* Deep blue and cyan intelligence accents
* Red for critical threats
* Amber/orange for warnings
* Green for safe/online status
* White/light gray readable text
* Thin technical borders
* Subtle grid-based surveillance visuals
* Professional monospace/technical typography
* Modern glass panels where appropriate
* Minimal futuristic glow
* Smooth animations
* Professional government/security operation aesthetic

IMPORTANT:

Do NOT make the interface look like:

* A gaming dashboard
* A crypto dashboard
* A generic SaaS admin panel
* An overly neon cyberpunk UI

The interface must immediately communicate:

AI + CCTV + Border Surveillance + Threat Intelligence + Real-Time Response.

Branding should include:

IBVAP

INTELLIGENT BORDER VIDEO ANALYTICS PLATFORM

BWU NEURAL NEXUS

SMART INDIA HACKATHON 2026

---

# 3. APPLICATION NAVIGATION

Maintain the existing navigation if present.

The application should support:

1. Command Center
2. Live Surveillance
3. Threat Intelligence
4. Incidents
5. Evidence Vault
6. Camera Network
7. Analytics
8. Virtual Zones / Geofence
9. Border Map
10. System Health
11. Settings

Authentication pages should be separate from the protected dashboard.

---

# 4. REAL AUTHENTICATION — SUPABASE

Implement real authentication using Supabase.

Use environment variables only.

Frontend environment variables:

VITE_SUPABASE_URL

VITE_SUPABASE_ANON_KEY

VITE_API_URL

Never hard-code:

* Passwords
* Supabase service-role keys
* Database passwords
* RTSP credentials
* API secrets

Create:

src/lib/supabase.ts

Implement:

1. Email/password Sign Up
2. Email/password Sign In
3. Google Sign In
4. Forgot Password
5. Password Reset
6. Logout
7. Session persistence
8. Protected routes
9. Redirect unauthenticated users to Login
10. Redirect authenticated users to Command Center

Roles:

* ADMIN
* COMMANDER
* OPERATOR
* ANALYST

Authenticated user information should appear in the existing operator/profile section:

* Name
* Email
* Role

Do not break the existing operator UI.

The application must still support DEMO MODE if Supabase credentials are not configured.

---

# 5. PREMIUM BORDER SURVEILLANCE AUTHENTICATION PAGES

Create a premium authentication experience.

Do NOT use a generic corporate login screen.

Use a responsive split-screen design.

## LEFT SIDE

Use a cinematic border surveillance visual communicating:

* Border landscape
* Watch tower
* CCTV surveillance
* Night operations
* AI scanning
* Secure perimeter
* Modern Indian border surveillance environment

Use a subtle dark overlay.

Display:

IBVAP

INTELLIGENT BORDER VIDEO ANALYTICS PLATFORM

"AI-powered surveillance, detection and threat intelligence for intelligent border security."

Add subtle:

* Scanning lines
* Radar effects
* AI overlay visuals

Keep the animation sophisticated and not distracting.

## RIGHT SIDE

### LOGIN

Heading:

Welcome Back, Operator

Description:

Secure access to the Intelligent Border Video Analytics Platform.

Fields:

* Email
* Password

Buttons:

SIGN IN

Continue with Google

Links:

Forgot Password?

Don't have an account? Create Account

### SIGN UP

Heading:

Create Operator Account

Fields:

* Full Name
* Email
* Password
* Confirm Password

Buttons:

CREATE ACCOUNT

Continue with Google

Link:

Already have an account? Sign In

### FORGOT PASSWORD

Heading:

Recover Access

Description:

Enter your registered email address.

Field:

Email

Button:

SEND RESET LINK

Link:

Back to Sign In

### RESET PASSWORD

Provide secure password update functionality through Supabase.

Maintain the same IBVAP dark futuristic design.

---

# 6. COMMAND CENTER

Preserve and enhance the existing Command Center.

Do NOT replace the existing dashboard.

Enhance it with real/demo data.

## TOP KPI CARDS

Display:

* Live Cameras
* Active AI Tracks
* Alerts Today
* Critical Threats
* System Uptime
* Average AI Confidence

Values should update dynamically using:

* Supabase data when available
* Python AI backend when available
* Demo simulation when external services are unavailable

---

# 7. REAL / SAMPLE CCTV VIDEO SYSTEM

Replace fake/static camera visuals with actual playable video feeds.

Use HTML video elements.

Use local sample MP4 files initially.

Suggested structure:

public/
videos/
cam01.mp4
cam02.mp4
cam03.mp4
thermal.mp4
nightvision.mp4

Camera configuration:

### CAM-01

Name: ALPHA GATE NORTH
Sector: A-04
Type: RGB CCTV
Status: LIVE

### CAM-02

Name: EASTERN PERIMETER
Sector: B-02
Type: RGB CCTV
Status: LIVE

### CAM-03

Name: VEHICLE CHECKPOINT
Sector: C-07
Type: Vehicle Surveillance
Status: LIVE

### CAM-04

Name: THERMAL PERIMETER
Sector: D-03
Type: THERMAL CAMERA
Status: LIVE

### CAM-05

Name: NIGHT WATCH TOWER
Sector: E-01
Type: NIGHT VISION
Status: LIVE

### CAM-06

Name: RESERVE CAMERA
Status: OFFLINE

Implement:

* Muted looping video
* Autoplay where browser permissions allow
* Playable sample feeds
* Camera labels
* LIVE indicator
* DEMO / SIMULATED LIVE CCTV FEED label
* FPS
* Resolution
* AI status
* Camera switching
* Grid view
* Selected camera view
* Single camera view
* Fullscreen
* Offline state
* Loading state
* Video error fallback

Do NOT use fake static camera images.

Use real playable video elements.

---

# 8. REUSABLE SURVEILLANCE VIDEO COMPONENT

Create a reusable SurveillanceVideo component.

Features:

* Camera name
* Camera ID
* LIVE indicator
* Sector
* FPS
* Resolution
* Recording indicator
* AI status
* Fullscreen
* Detection overlays
* Bounding boxes
* Tracking IDs
* Confidence
* Zone polygons
* Zone labels
* PTZ state
* Face analysis button

The component must work with:

* Demo detections
* Real YOLO backend detections

---

# 9. YOLO AI BACKEND ARCHITECTURE

Create a separate Python backend folder:

ai-backend/

Suggested structure:

ai-backend/
main.py
requirements.txt

services/
yolo_service.py
video_service.py
tracking_service.py
zone_service.py
face_service.py

models/

known_faces/

Use:

* Python
* FastAPI
* OpenCV
* Ultralytics YOLO

YOLO should detect at minimum:

* person
* car
* motorcycle
* bus
* truck

Create endpoints:

GET /health

GET /cameras

POST /detect

POST /process-video

GET /detections/{camera_id}

GET /alerts

POST /demo/run

Also maintain compatibility with future endpoints such as:

GET /api/cameras

POST /api/cameras

GET /api/incidents

POST /api/detections

POST /api/incidents

GET /api/stream/{camera_id}

WebSocket:

/ws/events

The frontend must have a clean service/API layer so the backend can be replaced or extended without rewriting the UI.

---

# 10. YOLO DETECTION DATA

Detection data should support:

camera_id

object_type

confidence

tracking_id

bounding_box

timestamp

zone

risk_level

Example structure:

{
"camera_id": "CAM-01",
"object_type": "person",
"confidence": 0.96,
"tracking_id": "P-021",
"bounding_box": {
"x": 120,
"y": 80,
"width": 200,
"height": 400
},
"zone": "RESTRICTED",
"risk_level": "CRITICAL"
}

Display detection overlays like:

PERSON #P-021

CONFIDENCE: 96%

ZONE: RESTRICTED

TRACK: ACTIVE

Bounding box colors:

Green → SAFE

Orange/Amber → WARNING

Red → RESTRICTED / CRITICAL

Ensure overlays remain aligned with the video.

Use responsive coordinate scaling.

---

# 11. PERSON AND VEHICLE TRACKING

Implement tracking architecture.

Each detected object should receive a persistent ID.

Examples:

P-001

P-021

V-006

The same object should retain the same tracking ID across frames when possible.

Create an Active Tracking panel showing:

* Object Type
* Tracking ID
* Camera
* Zone
* Confidence
* Risk
* Status

Update the existing ACTIVE AI TRACKS KPI dynamically.

---

# 12. VIRTUAL ZONES / GEOFENCE

Create and improve the existing virtual surveillance zone system.

Support:

SAFE ZONE

WARNING ZONE

RESTRICTED ZONE

CRITICAL ZONE

Allow:

* Draw line
* Draw polygon
* Drag polygon points
* Edit zone
* Select zone type

Zone configuration:

* Zone Name
* Camera
* Sector
* Risk Weight
* Active Hours
* Object Rules

Example rules:

If PERSON enters RESTRICTED zone → HIGH/CRITICAL alert.

If PERSON enters CRITICAL zone after 20:00 → CRITICAL alert.

Risk behavior:

SAFE → No alert

WARNING → Monitoring alert

RESTRICTED → Critical intrusion workflow

When an object enters a restricted zone:

1. Raise risk level.
2. Generate intrusion alert.
3. Add event to Threat Feed.
4. Create/update Incident.
5. Update Critical Threat KPI.
6. Add event to Evidence Vault.
7. Persist data if Supabase is configured.

Display:

⚠ INTRUSION DETECTED

RESTRICTED ZONE

RISK: CRITICAL

---

# 13. DYNAMIC THREAT SCORING

Implement explainable risk scoring.

Risk score should consider:

* Zone
* Time
* Object type
* Duration inside zone
* Movement pattern
* Detection confidence
* Face analysis result
* Repeated suspicious activity

Display:

Threat Score: 92/100

Risk Level: CRITICAL

Create a visual risk gauge.

---

# 14. AI THREAT EXPLAINABILITY

When an incident is selected, show:

AI THREAT ASSESSMENT

Threat Score

Risk Level

Reasons

Example:

* Person entered restricted zone
* Movement detected after restricted hours
* Object remained inside zone for 18 seconds
* No authorized identity associated
* Confidence above security threshold

Recommended Operator Action:

"Verify CAM-01 and notify the nearest response unit."

Make it clear that:

AI assists the human operator.

The operator makes the final decision.

---

# 15. FACE ANALYSIS — CONTROLLED DEMO ONLY

Implement face detection and controlled sample identity matching.

IMPORTANT:

This feature is strictly for:

* Consent-based sample identities
* Controlled SIH demonstrations
* Known demo datasets

Do NOT imply unrestricted identification of the general public.

Architecture:

Video Frame
→ Face Detection
→ Face Encoding
→ Compare with Controlled Demo Dataset
→ Authorized / Unknown Result

Create a small sample identity system.

Example:

AUTHORISED

Name: Sample Officer

ID: AUTH-001

Confidence: 94%

Or:

UNKNOWN PERSON

Tracking ID: P-021

Face Match: NO MATCH

Risk Level: HIGH

When a person is detected, provide:

ANALYZE FACE

Open a futuristic side panel.

Panel:

FACE ANALYSIS

* Face Status
* AUTHORIZED / UNKNOWN
* Tracking ID
* Detection Confidence
* Face Match Confidence
* Identity if available
* Risk Status

Button:

VIEW INCIDENT

Unknown person entering a restricted zone should increase risk score and generate an alert.

The entire feature must work in demo mode using clearly labeled simulated/sample results.

---

# 16. THERMAL CAMERA

CAM-04:

THERMAL PERIMETER

Use real/sample thermal surveillance video where available.

Display:

🌡 THERMAL MODE

HEAT SIGNATURE DETECTED

Confidence: 96%

Example overlay:

HUMAN HEAT SIGNATURE

TRACK: T-001

CONFIDENCE: 96%

Allow thermal detection overlays.

If actual thermal footage is unavailable:

Create:

DEMO THERMAL MODE

Clearly state that it is simulated/demo thermal processing.

Do not falsely claim synthetic footage is real thermal data.

---

# 17. NIGHT VISION CAMERA

CAM-05:

NIGHT WATCH TOWER

Support:

NIGHT VISION MODE

Features:

* Low-light appearance
* Enhanced brightness
* Night vision visual processing
* AI detection overlays
* LIVE indicator
* Tracking IDs

Maintain smooth performance.

---

# 18. PTZ CAMERA JOYSTICK

Add PTZ controls to every active camera.

PTZ:

Pan

Tilt

Zoom

Create a circular joystick.

Controls:

▲

◀   ●   ▶

▼

Buttons:

ZOOM +

ZOOM -

RESET

Functional behavior:

LEFT → Pan left

RIGHT → Pan right

UP → Tilt up

DOWN → Tilt down

ZOOM + → Increase zoom

ZOOM - → Decrease zoom

RESET → Restore original position

For sample video feeds:

Implement PTZ as a visual simulation using CSS transforms.

State:

panX

panY

zoom

Use smooth transitions.

Ensure video remains clipped inside the viewport.

Display:

PTZ CONTROL: ACTIVE

Optional keyboard shortcuts:

Arrow Keys → Pan/Tilt

* → Zoom In

- → Zoom Out

R → Reset

Do not trigger keyboard PTZ controls while typing inside forms.

---

# 19. CAMERA FULLSCREEN MODE

Every active camera must support fullscreen.

Fullscreen interface should include:

* Large video
* AI detection overlays
* Zone overlays
* PTZ joystick
* AI analysis panel
* Face analysis button
* Camera information
* Zone information
* Close fullscreen button

Detection overlays must remain aligned in fullscreen.

---

# 20. LIVE SURVEILLANCE PAGE

Create or enhance the CCTV grid.

Display:

CAM-01

CAM-02

CAM-03

CAM-04

CAM-05

CAM-06

Each camera tile should show:

* Status
* Sector
* Camera type
* AI detection status
* Number of persons
* Number of vehicles
* Current risk
* Last event

Allow:

* Grid View
* Single Camera View
* Fullscreen
* Filter by Sector
* Filter by Active Threat
* Camera selection

Include an Add Camera form/modal.

Fields:

* Camera Name
* Camera ID
* Sector
* RTSP URL
* Location
* Latitude
* Longitude
* Status

Never expose RTSP passwords.

---

# 21. REAL-TIME THREAT FEED

Preserve and enhance the existing Threat Feed.

Threats can originate from:

* Restricted zone intrusion
* Unknown person in restricted zone
* Vehicle entering restricted zone
* Thermal human heat signature
* Suspicious repeated movement

Each alert should display:

* Severity
* Camera
* Sector
* Detection confidence
* Tracking ID
* Timestamp
* Status

Actions:

VIEW

ACKNOWLEDGE

INVESTIGATE

MARK RESOLVED

Acknowledging an alert must update the UI state and database when available.

Critical alerts should have:

* Subtle alert tone
* Red pulse
* Notification toast

Allow sound mute.

Avoid continuous irritating alert sounds.

---

# 22. INCIDENT MANAGEMENT

Create or preserve an Incident Management page.

Table fields:

* Incident ID
* Timestamp
* Camera
* Sector
* Object
* Tracking ID
* Threat Type
* Confidence
* Risk Level
* Status
* Operator

Statuses:

NEW

ACKNOWLEDGED

INVESTIGATING

RESOLVED

FALSE POSITIVE

Clicking an incident opens a detailed page.

Include:

* Evidence image
* Video clip reference
* Camera information
* AI reasoning
* Detection metadata
* Event timeline
* Incident reconstruction
* Operator notes
* Response status

Incident reconstruction timeline:

Detected

Tracked

Warning Zone

Restricted Zone

Alert Generated

Operator Acknowledged

---

# 23. EVIDENCE VAULT

Create a professional evidence management page.

Each evidence record:

* Evidence ID
* Incident ID
* Camera ID
* Timestamp
* Detection screenshot
* Video clip placeholder
* Object class
* Tracking ID
* Confidence
* Threat score
* SHA/hash placeholder
* Operator status

Filters:

* Date
* Camera
* Sector
* Risk
* Object Type

Actions:

VIEW

DOWNLOAD METADATA

OPEN INCIDENT

Do not implement insecure public evidence access.

Use Supabase Storage securely when configured.

---

# 24. THREAT INTELLIGENCE AND ANALYTICS

Create analytics showing:

* Threats by hour
* Threats by camera
* Threats by sector
* Person detections
* Vehicle detections
* Intrusion events
* Risk distribution
* Threat Activity Timeline

Risk categories:

LOW

MEDIUM

HIGH

CRITICAL

Use clean professional charts.

Maintain existing analytics where already implemented.

Do not replace existing charts unnecessarily.

---

# 25. BORDER SURVEILLANCE MAP

Create an interactive surveillance map.

Display:

* Border sectors
* Camera markers
* Online cameras
* Offline cameras
* Alert cameras
* Threat hotspots

Status:

Green → Online

Gray → Offline

Red → Alert

Clicking a camera should show:

* Camera ID
* Sector
* Status
* Current detections
* Last incident

Use a simulated map if an external map API is unavailable.

---

# 26. CAMERA NETWORK

Create a camera management table.

Fields:

* Camera ID
* Name
* Sector
* Location
* Stream Status
* AI Status
* FPS
* Last Heartbeat
* Alerts Today
* Reliability Score

Statuses:

ONLINE

OFFLINE

DEGRADED

Provide Add Camera functionality.

Create a Camera Reliability Score based on:

* Stream availability
* Last heartbeat
* FPS stability
* Error rate
* AI processing availability

---

# 27. SYSTEM HEALTH

Create modern status cards.

Display:

AI Detection Engine → ONLINE

API Server → ONLINE

Database → ONLINE

WebSocket → CONNECTED

Connected Cameras → 5/6

AI Inference → 24 FPS

Average Latency → 83 ms

Memory Usage

GPU placeholder

CPU Usage

Use charts and health indicators.

If backend services are unavailable:

Show appropriate degraded/demo states instead of crashing.

---

# 28. SUPABASE DATABASE

Use Supabase PostgreSQL.

Create tables:

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

Suggested profiles fields:

id

full_name

email

role

created_at

Suggested cameras fields:

id

camera_id

name

sector

type

location

rtsp_url

video_source

status

created_at

Suggested detections fields:

id

camera_id

object_type

confidence

tracking_id

bounding_box

zone

risk_level

timestamp

Suggested incidents fields:

id

incident_code

camera_id

timestamp

object_type

tracking_id

confidence

threat_type

risk_score

risk_level

status

evidence_url

created_at

Suggested alerts fields:

id

incident_id

camera_id

severity

title

description

status

acknowledged

created_at

Suggested evidence fields:

id

incident_id

camera_id

image_url

video_url

metadata

hash

created_at

Add realistic seed data so the dashboard looks populated immediately.

Apply basic Row Level Security policies.

Use role-based access.

---

# 29. REAL-TIME FUNCTIONALITY

Use Supabase Realtime where practical.

Alerts should appear without requiring a page reload.

Use:

* WebSockets when Python backend is available
* Efficient polling when required
* Demo event simulation as fallback

Do not send unnecessary raw video frames through the frontend.

Optimize state updates.

---

# 30. DEMO MODE

Create a complete DEMO MODE.

The frontend must remain fully functional when:

* Python AI backend is offline
* Supabase is not configured
* Real CCTV streams are unavailable

Demo Mode should provide:

* Sample videos
* Simulated YOLO detections
* Simulated tracking
* Demo incidents
* Demo alerts
* Face analysis demo
* Thermal detection demo
* Zone intrusion simulation

Clearly label simulated/demo-generated information where appropriate.

---

# 31. RUN DEMO SCENARIO

Preserve and upgrade the existing:

RUN DEMO SCENARIO

button.

Create a cinematic but controllable demonstration.

Sequence:

STEP 1

Start CAM-01 surveillance feed.

STEP 2

AI detects:

PERSON P-021

CONF: 96%

STEP 3

Person enters WARNING zone.

Display:

RISK: HIGH

STEP 4

Person enters RESTRICTED zone.

Display:

⚠ INTRUSION DETECTED

RISK: CRITICAL

STEP 5

Generate Critical Threat alert.

STEP 6

Open face analysis.

Result:

UNKNOWN PERSON

STEP 7

Activate thermal camera panel.

Display:

HUMAN HEAT SIGNATURE DETECTED

STEP 8

Allow PTZ controls.

STEP 9

Create an incident.

Example:

INC-2026-0004

Restricted Zone Intrusion

STEP 10

Add the incident to:

* Recent Incidents
* Threat Feed
* Evidence Vault

Provide:

PAUSE

RESUME

RESET DEMO

The demo sequence should visibly update:

* Detection overlays
* Tracking panel
* Threat score
* Critical threat KPI
* Alerts
* Incidents
* Evidence Vault

---

# 32. API / FRONTEND INTEGRATION

Create a clean service layer.

Suggested folders:

src/

components/

pages/

services/

hooks/

types/

utils/

lib/

Create reusable service functions.

The application should automatically:

1. Try the Python AI backend if configured and available.
2. Use real detection data when available.
3. Fall back to Demo Mode when unavailable.

Do not tightly couple UI components to backend implementation.

---

# 33. ERROR HANDLING

Add professional error handling for:

* Missing video
* Video playback failure
* AI backend offline
* YOLO model unavailable
* Supabase unavailable
* Authentication failure
* Network failure
* WebSocket disconnect

Show useful user-friendly messages.

Do not crash the application.

Provide:

* Loading states
* Skeleton loaders
* Empty states
* Error states
* Retry options where appropriate

---

# 34. PERFORMANCE

Optimize:

* Video rendering
* Detection overlay rendering
* React state updates
* Dashboard updates
* Large camera grids

Avoid unnecessary re-renders.

Avoid sending every video frame through the frontend.

Use efficient update strategies.

---

# 35. RESPONSIVENESS

Primary target:

1920 × 1080 desktop command center.

Also support:

* Laptop
* Tablet

Mobile may use a simplified layout.

Do not sacrifice desktop command-center experience for mobile.

---

# 36. CODE QUALITY

Use:

* React or Next.js
* TypeScript
* Tailwind CSS
* Modern component architecture

Create reusable components.

Avoid giant single-file components.

Maintain TypeScript correctness.

Avoid broken imports.

Use environment variables.

Create:

.env.example

Never commit real secrets.

Create a comprehensive README explaining:

* Installation
* Environment variables
* Supabase setup
* Google OAuth setup
* Python backend setup
* YOLO model setup
* Sample video setup
* Demo Mode
* Local development
* Deployment

---

# 37. SECURITY REQUIREMENTS

Never expose:

* Supabase service role key
* Database passwords
* RTSP passwords
* API secrets

Use:

* Protected routes
* Role-based access
* Basic RLS
* Secure environment variables

Do not store secrets directly in frontend code.

---

# 38. FINAL QUALITY REQUIREMENTS

The final platform must demonstrate:

1. Real/sample playable CCTV feeds
2. Multi-camera surveillance
3. YOLO AI architecture
4. Person detection
5. Vehicle detection
6. Object tracking IDs
7. Safe/warning/restricted zones
8. Intrusion detection
9. Explainable AI threat scoring
10. Real authentication
11. Email/password login
12. Google login
13. Sign up
14. Forgot password
15. Password reset
16. Protected routes
17. Controlled-demo face analysis
18. Unknown-person alerts
19. Thermal camera
20. Night vision camera
21. PTZ joystick
22. Camera fullscreen
23. Real-time threat feed
24. Incident generation
25. Evidence integration
26. Supabase integration
27. Demo Mode
28. Python FastAPI backend architecture
29. YOLO integration layer
30. Responsive professional design

---

# 39. ABSOLUTELY DO NOT

Do NOT:

* Rebuild an existing project from scratch
* Delete existing functionality
* Remove existing pages
* Simplify the Command Center
* Replace the existing futuristic design
* Create fake buttons that do nothing
* Break existing routes
* Remove navigation
* Remove demo functionality
* Hard-code secrets
* Expose RTSP passwords
* Create a generic admin dashboard
* Make unrealistic claims about autonomous military response
* Implement weapons or autonomous physical response
* Use static fake CCTV images instead of playable demo feeds

---

# 40. FINAL IMPLEMENTATION WORKFLOW

Follow this order:

PHASE 1

Inspect existing project architecture.

Understand:

* Routes
* Components
* Existing state
* Existing dashboard
* Existing demo functionality
* Existing Supabase integration

PHASE 2

Preserve all working features.

PHASE 3

Create or improve:

* Authentication
* Video feed system
* Demo Mode fallback

PHASE 4

Implement:

* YOLO backend architecture
* Detection API service
* Detection overlays
* Tracking

PHASE 5

Implement:

* Zones
* Threat scoring
* Intrusion detection
* Real-time alerts

PHASE 6

Implement:

* Controlled-demo face analysis
* Thermal feed
* Night vision
* PTZ controls
* Fullscreen camera experience

PHASE 7

Integrate:

* Incidents
* Evidence
* Analytics
* Threat feed
* System Health

PHASE 8

Verify:

* Every route
* Authentication
* Video playback
* PTZ controls
* Fullscreen
* Demo scenario
* Backend API structure
* Offline fallback
* Existing functionality preservation

---

# FINAL INSTRUCTION

Build this as a serious, polished, professional AI Border Surveillance Command Center worthy of a Smart India Hackathon 2026 demonstration.

The prototype must feel realistic and technically credible while clearly distinguishing:

REAL DATA

from

DEMO / SIMULATED DATA.

Prioritize functional features over decorative UI changes.

Do not remove anything that already works.

Inspect first.

Preserve existing architecture and design.

Then extend the project incrementally until all functionality described above is implemented.

At the end, provide:

1. A summary of all files changed.
2. Any new files created.
3. Supabase setup instructions.
4. Google OAuth setup instructions.
5. Python AI backend setup instructions.
6. Required sample video file locations.
7. Environment variable instructions.
8. How to run the frontend.
9. How to run the AI backend.
10. How to run the complete DEMO MODE.
