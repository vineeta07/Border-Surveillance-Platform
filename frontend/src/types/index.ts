export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type CameraStatus = "ONLINE" | "OFFLINE" | "DEGRADED";
export type IncidentStatus = "NEW" | "ACKNOWLEDGED" | "INVESTIGATING" | "RESOLVED" | "FALSE_POSITIVE";
export type AlertSeverity = "INFO" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type ZoneType = "SAFE" | "WARNING" | "RESTRICTED" | "CRITICAL";
export type ObjectType = "person" | "car" | "motorcycle" | "bus" | "truck" | "unknown";
export type UserRole = "ADMIN" | "COMMANDER" | "OPERATOR" | "ANALYST";

export interface Camera {
  id: string;
  camera_id: string;
  name: string;
  sector: string;
  type: string;
  location: string;
  rtsp_url?: string;
  video_source?: string;
  status: CameraStatus;
  fps?: number;
  resolution?: string;
  ai_status?: "ACTIVE" | "INACTIVE";
  reliability_score?: number;
  alerts_today?: number;
  last_heartbeat?: string;
  lat?: number;
  lng?: number;
}

export interface Detection {
  id: string;
  camera_id: string;
  object_type: ObjectType;
  confidence: number;
  tracking_id: string;
  bounding_box: { x: number; y: number; width: number; height: number };
  zone: string;
  risk_level: RiskLevel;
  timestamp: string;
}

export interface TrackedObject {
  tracking_id: string;
  object_type: ObjectType;
  camera_id: string;
  zone: string;
  confidence: number;
  risk_level: RiskLevel;
  status: "ACTIVE" | "LOST";
  first_seen: string;
  last_seen: string;
  duration_seconds?: number;
  face_analyzed?: boolean;
  face_status?: "AUTHORIZED" | "UNKNOWN";
  face_identity?: string;
  threat_score?: number;
}

export interface Zone {
  id: string;
  name: string;
  type: ZoneType;
  camera_id: string;
  sector: string;
  risk_weight: number;
  active: boolean;
  points: { x: number; y: number }[];
}

export interface Alert {
  id: string;
  incident_id?: string;
  camera_id: string;
  severity: AlertSeverity;
  title: string;
  description: string;
  status: "ACTIVE" | "ACKNOWLEDGED" | "RESOLVED";
  acknowledged: boolean;
  tracking_id?: string;
  risk_level?: RiskLevel;
  sector?: string;
  confidence?: number;
  timestamp: string;
}

export interface Incident {
  id: string;
  incident_code: string;
  camera_id: string;
  camera_name?: string;
  sector?: string;
  timestamp: string;
  object_type: ObjectType;
  tracking_id: string;
  confidence: number;
  threat_type: string;
  risk_score: number;
  risk_level: RiskLevel;
  status: IncidentStatus;
  operator?: string;
  notes?: string;
  evidence_url?: string;
  ai_reasons?: string[];
  timeline?: IncidentTimelineEvent[];
  created_at: string;
}

export interface IncidentTimelineEvent {
  time: string;
  event: string;
  status: "done" | "active" | "pending";
}

export interface Evidence {
  id: string;
  evidence_id: string;
  incident_id: string;
  camera_id: string;
  timestamp: string;
  object_class: ObjectType;
  tracking_id: string;
  confidence: number;
  threat_score: number;
  hash: string;
  operator_status: "VERIFIED" | "PENDING" | "FLAGGED";
  image_url?: string;
  video_url?: string;
  sector?: string;
  risk_level?: RiskLevel;
}

export interface SystemHealth {
  ai_engine: "ONLINE" | "OFFLINE" | "DEGRADED";
  api_server: "ONLINE" | "OFFLINE" | "DEGRADED";
  database: "ONLINE" | "OFFLINE" | "DEGRADED";
  websocket: "CONNECTED" | "DISCONNECTED";
  cameras_online: number;
  cameras_total: number;
  ai_fps: number;
  avg_latency_ms: number;
  memory_usage: number;
  cpu_usage: number;
  gpu_usage?: number;
}

export interface FaceAnalysisResult {
  status: "AUTHORIZED" | "UNKNOWN";
  tracking_id: string;
  detection_confidence: number;
  face_match_confidence?: number;
  identity?: string;
  identity_id?: string;
  risk_level: RiskLevel;
  demo: boolean;
}

export interface PTZState {
  panX: number;
  panY: number;
  zoom: number;
}

export interface KPIData {
  live_cameras: number;
  active_tracks: number;
  alerts_today: number;
  critical_threats: number;
  uptime_pct: number;
  avg_confidence: number;
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
  role: UserRole;
}
