import type { Camera, Alert, Incident, Evidence, TrackedObject, Zone, KPIData, SystemHealth } from "../types";

export const DEMO_CAMERAS: Camera[] = [
  { id: "1", camera_id: "CAM-01", name: "ALPHA GATE NORTH", sector: "A-04", type: "RGB CCTV", location: "North Gate Checkpoint", video_source: "/videos/cam01.mp4", status: "ONLINE", fps: 30, resolution: "1920x1080", ai_status: "ACTIVE", reliability_score: 98, alerts_today: 3, last_heartbeat: new Date().toISOString(), lat: 23.45, lng: 71.23 },
  { id: "2", camera_id: "CAM-02", name: "EASTERN PERIMETER", sector: "B-02", type: "RGB CCTV", location: "Eastern Fence Line", video_source: "/videos/cam02.mp4", status: "ONLINE", fps: 25, resolution: "1920x1080", ai_status: "ACTIVE", reliability_score: 94, alerts_today: 1, last_heartbeat: new Date().toISOString(), lat: 23.46, lng: 71.25 },
  { id: "3", camera_id: "CAM-03", name: "VEHICLE CHECKPOINT", sector: "C-07", type: "Vehicle Surveillance", location: "Main Vehicle Entry", video_source: "/videos/cam03.mp4", status: "ONLINE", fps: 30, resolution: "2560x1440", ai_status: "ACTIVE", reliability_score: 97, alerts_today: 0, last_heartbeat: new Date().toISOString(), lat: 23.44, lng: 71.22 },
  { id: "4", camera_id: "CAM-04", name: "THERMAL PERIMETER", sector: "D-03", type: "THERMAL CAMERA", location: "South Thermal Array", video_source: "/videos/thermal.mp4", status: "ONLINE", fps: 15, resolution: "640x480", ai_status: "ACTIVE", reliability_score: 92, alerts_today: 2, last_heartbeat: new Date().toISOString(), lat: 23.43, lng: 71.24 },
  { id: "5", camera_id: "CAM-05", name: "NIGHT WATCH TOWER", sector: "E-01", type: "NIGHT VISION", location: "West Watch Tower", video_source: "/videos/nightvision.mp4", status: "ONLINE", fps: 20, resolution: "1280x720", ai_status: "ACTIVE", reliability_score: 89, alerts_today: 1, last_heartbeat: new Date().toISOString(), lat: 23.47, lng: 71.21 },
  { id: "6", camera_id: "CAM-06", name: "RESERVE CAMERA", sector: "F-00", type: "RGB CCTV", location: "Reserve Position", video_source: "", status: "OFFLINE", fps: 0, resolution: "—", ai_status: "INACTIVE", reliability_score: 0, alerts_today: 0, last_heartbeat: "2026-09-05T22:10:00Z", lat: 23.48, lng: 71.26 },
];

const now = new Date();
const ts = (minsAgo: number) => new Date(now.getTime() - minsAgo * 60000).toISOString();

export const DEMO_ALERTS: Alert[] = [
  { id: "a1", camera_id: "CAM-01", severity: "CRITICAL", title: "RESTRICTED ZONE INTRUSION", description: "Unknown person P-021 entered restricted zone ALPHA-GATE-NORTH. Tracking active.", status: "ACTIVE", acknowledged: false, tracking_id: "P-021", risk_level: "CRITICAL", sector: "A-04", confidence: 96, timestamp: ts(2) },
  { id: "a2", camera_id: "CAM-04", severity: "HIGH", title: "HUMAN HEAT SIGNATURE DETECTED", description: "Thermal anomaly detected in south perimeter. Track T-001 initiated.", status: "ACTIVE", acknowledged: false, tracking_id: "T-001", risk_level: "HIGH", sector: "D-03", confidence: 88, timestamp: ts(8) },
  { id: "a3", camera_id: "CAM-02", severity: "MEDIUM", title: "SUSPICIOUS MOVEMENT PATTERN", description: "Object P-019 exhibiting repeated loitering behavior in warning zone.", status: "ACKNOWLEDGED", acknowledged: true, tracking_id: "P-019", risk_level: "MEDIUM", sector: "B-02", confidence: 79, timestamp: ts(15) },
  { id: "a4", camera_id: "CAM-03", severity: "HIGH", title: "UNREGISTERED VEHICLE DETECTED", description: "Vehicle V-006 approaching checkpoint from restricted access road.", status: "ACTIVE", acknowledged: false, tracking_id: "V-006", risk_level: "HIGH", sector: "C-07", confidence: 93, timestamp: ts(22) },
  { id: "a5", camera_id: "CAM-05", severity: "LOW", title: "NIGHT PERIMETER MOVEMENT", description: "Movement detected in sector E-01 during restricted hours.", status: "RESOLVED", acknowledged: true, tracking_id: "P-015", risk_level: "LOW", sector: "E-01", confidence: 71, timestamp: ts(45) },
];

export const DEMO_INCIDENTS: Incident[] = [
  {
    id: "inc1", incident_code: "INC-2026-0003", camera_id: "CAM-01", camera_name: "ALPHA GATE NORTH", sector: "A-04",
    timestamp: ts(2), object_type: "person", tracking_id: "P-021", confidence: 96,
    threat_type: "Restricted Zone Intrusion", risk_score: 92, risk_level: "CRITICAL", status: "NEW",
    operator: "—", notes: "",
    ai_reasons: ["Person entered restricted zone", "No authorized identity match", "Movement detected at 23:41", "Object remained in zone >15s", "Confidence above security threshold (96%)"],
    timeline: [
      { time: ts(4), event: "Object detected by CAM-01 AI", status: "done" },
      { time: ts(3.5), event: "Tracking initiated — P-021", status: "done" },
      { time: ts(3), event: "Object entered WARNING zone", status: "done" },
      { time: ts(2.5), event: "Object entered RESTRICTED zone", status: "done" },
      { time: ts(2), event: "Critical alert generated", status: "done" },
      { time: ts(2), event: "Operator review pending", status: "active" },
    ],
    created_at: ts(2),
  },
  {
    id: "inc2", incident_code: "INC-2026-0002", camera_id: "CAM-04", camera_name: "THERMAL PERIMETER", sector: "D-03",
    timestamp: ts(8), object_type: "person", tracking_id: "T-001", confidence: 88,
    threat_type: "Thermal Intrusion", risk_score: 75, risk_level: "HIGH", status: "INVESTIGATING",
    operator: "OPR-Verma", notes: "Heat signature confirmed. Response unit notified.",
    ai_reasons: ["Human heat signature in perimeter zone", "After-hours detection", "Movement toward fence line"],
    timeline: [
      { time: ts(10), event: "Thermal signature detected", status: "done" },
      { time: ts(9), event: "Heat track T-001 initiated", status: "done" },
      { time: ts(8), event: "Alert generated", status: "done" },
      { time: ts(7), event: "Operator acknowledged", status: "done" },
      { time: ts(5), event: "Investigation initiated", status: "active" },
    ],
    created_at: ts(8),
  },
  {
    id: "inc3", incident_code: "INC-2026-0001", camera_id: "CAM-02", camera_name: "EASTERN PERIMETER", sector: "B-02",
    timestamp: ts(45), object_type: "person", tracking_id: "P-019", confidence: 79,
    threat_type: "Loitering — Warning Zone", risk_score: 48, risk_level: "MEDIUM", status: "RESOLVED",
    operator: "OPR-Singh", notes: "Verified as maintenance worker. ID confirmed.",
    ai_reasons: ["Repeated movement pattern in warning zone", "Duration >5 minutes"],
    timeline: [
      { time: ts(50), event: "Object detected", status: "done" },
      { time: ts(48), event: "Loitering pattern flagged", status: "done" },
      { time: ts(45), event: "Alert generated", status: "done" },
      { time: ts(40), event: "Operator acknowledged and investigated", status: "done" },
      { time: ts(35), event: "Resolved — maintenance personnel", status: "done" },
    ],
    created_at: ts(45),
  },
];

export const DEMO_EVIDENCE: Evidence[] = [
  { id: "ev1", evidence_id: "EVD-2026-0003", incident_id: "INC-2026-0003", camera_id: "CAM-01", timestamp: ts(2), object_class: "person", tracking_id: "P-021", confidence: 96, threat_score: 92, hash: "sha256:a3f8d2c1b7e4f093...", operator_status: "PENDING", sector: "A-04", risk_level: "CRITICAL" },
  { id: "ev2", evidence_id: "EVD-2026-0002", incident_id: "INC-2026-0002", camera_id: "CAM-04", timestamp: ts(8), object_class: "person", tracking_id: "T-001", confidence: 88, threat_score: 75, hash: "sha256:b5c9e1a4d6f2801c...", operator_status: "VERIFIED", sector: "D-03", risk_level: "HIGH" },
  { id: "ev3", evidence_id: "EVD-2026-0001", incident_id: "INC-2026-0001", camera_id: "CAM-02", timestamp: ts(45), object_class: "person", tracking_id: "P-019", confidence: 79, threat_score: 48, hash: "sha256:c7a2f4b8e3d1509e...", operator_status: "VERIFIED", sector: "B-02", risk_level: "MEDIUM" },
];

export const DEMO_TRACKED_OBJECTS: TrackedObject[] = [
  { tracking_id: "P-021", object_type: "person", camera_id: "CAM-01", zone: "RESTRICTED", confidence: 96, risk_level: "CRITICAL", status: "ACTIVE", first_seen: ts(4), last_seen: ts(0.5), duration_seconds: 210, face_analyzed: true, face_status: "UNKNOWN", threat_score: 92 },
  { tracking_id: "T-001", object_type: "person", camera_id: "CAM-04", zone: "WARNING", confidence: 88, risk_level: "HIGH", status: "ACTIVE", first_seen: ts(10), last_seen: ts(1), duration_seconds: 540, face_analyzed: false, threat_score: 75 },
  { tracking_id: "V-006", object_type: "car", camera_id: "CAM-03", zone: "WARNING", confidence: 93, risk_level: "HIGH", status: "ACTIVE", first_seen: ts(25), last_seen: ts(2), duration_seconds: 1380, threat_score: 68 },
  { tracking_id: "P-019", object_type: "person", camera_id: "CAM-02", zone: "SAFE", confidence: 71, risk_level: "LOW", status: "LOST", first_seen: ts(60), last_seen: ts(35), duration_seconds: 1500, face_analyzed: true, face_status: "AUTHORIZED", face_identity: "Sample Officer", threat_score: 20 },
];

export const DEMO_ZONES: Zone[] = [
  { id: "z1", name: "SAFE PERIMETER", type: "SAFE", camera_id: "CAM-01", sector: "A-04", risk_weight: 1, active: true, points: [{ x: 0, y: 0 }, { x: 30, y: 0 }, { x: 30, y: 100 }, { x: 0, y: 100 }] },
  { id: "z2", name: "WARNING BUFFER", type: "WARNING", camera_id: "CAM-01", sector: "A-04", risk_weight: 3, active: true, points: [{ x: 30, y: 0 }, { x: 60, y: 0 }, { x: 60, y: 100 }, { x: 30, y: 100 }] },
  { id: "z3", name: "RESTRICTED ZONE ALPHA", type: "RESTRICTED", camera_id: "CAM-01", sector: "A-04", risk_weight: 8, active: true, points: [{ x: 60, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 100 }, { x: 60, y: 100 }] },
];

export const DEMO_KPI: KPIData = {
  live_cameras: 5,
  active_tracks: 3,
  alerts_today: 7,
  critical_threats: 1,
  uptime_pct: 99.7,
  avg_confidence: 89,
};

export const DEMO_SYSTEM_HEALTH: SystemHealth = {
  ai_engine: "ONLINE",
  api_server: "ONLINE",
  database: "ONLINE",
  websocket: "CONNECTED",
  cameras_online: 5,
  cameras_total: 6,
  ai_fps: 24,
  avg_latency_ms: 83,
  memory_usage: 67,
  cpu_usage: 42,
  gpu_usage: 58,
};

export const DEMO_IDENTITIES = [
  { id: "AUTH-001", name: "Sample Officer", confidence: 94, authorized: true },
  { id: "AUTH-002", name: "Border Guard Sharma", confidence: 91, authorized: true },
  { id: "AUTH-003", name: "Maintenance Tech Mehta", confidence: 87, authorized: true },
];

export function generateDemoDetections(cameraId: string) {
  const objects = ["person", "car", "motorcycle"] as const;
  const zones = ["SAFE", "WARNING", "RESTRICTED"];
  const risks = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;
  const count = Math.floor(Math.random() * 3) + 1;
  return Array.from({ length: count }, (_, i) => ({
    id: `det-${Date.now()}-${i}`,
    camera_id: cameraId,
    object_type: objects[Math.floor(Math.random() * objects.length)],
    confidence: Math.floor(Math.random() * 25) + 72,
    tracking_id: `P-0${Math.floor(Math.random() * 90) + 10}`,
    bounding_box: {
      x: Math.floor(Math.random() * 60) + 5,
      y: Math.floor(Math.random() * 40) + 10,
      width: Math.floor(Math.random() * 15) + 8,
      height: Math.floor(Math.random() * 20) + 15,
    },
    zone: zones[Math.floor(Math.random() * zones.length)],
    risk_level: risks[Math.floor(Math.random() * risks.length)],
    timestamp: new Date().toISOString(),
  }));
}
