import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { DEMO_KPI, DEMO_ALERTS, DEMO_INCIDENTS, DEMO_TRACKED_OBJECTS, DEMO_CAMERAS } from "../services/demoData";
import type { Alert, Incident, TrackedObject, KPIData } from "../types";
import SurveillanceVideo from "../components/SurveillanceVideo";

const RISK_COLORS: Record<string, string> = {
  CRITICAL: "#ef4444", HIGH: "#f97316", MEDIUM: "#f59e0b", LOW: "#22c55e",
};
const SEV_COLORS: Record<string, string> = {
  CRITICAL: "#ef4444", HIGH: "#f97316", MEDIUM: "#f59e0b", LOW: "#22c55e", INFO: "#22d3ee",
};

function KPICard({ label, value, unit = "", color = "#22d3ee", pulse = false }: { label: string; value: string | number; unit?: string; color?: string; pulse?: boolean }) {
  return (
    <div className="glass-panel p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${color}40, transparent)` }} />
      <div className="font-mono text-xs tracking-widest mb-2" style={{ color: `${color}99` }}>{label}</div>
      <div className={`font-display font-bold text-3xl leading-none ${pulse ? "animate-pulse-red" : ""}`} style={{ color }}>
        {value}<span className="text-base font-normal ml-1 text-slate-500">{unit}</span>
      </div>
    </div>
  );
}

interface DemoStep {
  step: number;
  label: string;
  description: string;
}

const DEMO_STEPS: DemoStep[] = [
  { step: 1, label: "CAM-01 surveillance active", description: "Alpha Gate North feed initialized" },
  { step: 2, label: "AI detects PERSON P-021", description: "Confidence: 96% | Object type: PERSON" },
  { step: 3, label: "Person enters WARNING zone", description: "RISK elevated to HIGH" },
  { step: 4, label: "Person enters RESTRICTED zone", description: "⚠ INTRUSION DETECTED — RISK: CRITICAL" },
  { step: 5, label: "Critical Threat alert generated", description: "Alert broadcast to all operators" },
  { step: 6, label: "Face analysis result", description: "UNKNOWN PERSON — No authorized identity match" },
  { step: 7, label: "Thermal camera activated", description: "HUMAN HEAT SIGNATURE DETECTED — D-03" },
  { step: 8, label: "PTZ tracking enabled", description: "Camera locked on P-021 trajectory" },
  { step: 9, label: "Incident INC-2026-0004 created", description: "Restricted Zone Intrusion documented" },
  { step: 10, label: "Evidence + Feed updated", description: "Incident added to all logs" },
];

export default function CommandCenter() {
  const nav = useNavigate();
  const [kpi, setKPI] = useState<KPIData>(DEMO_KPI);
  const [alerts, setAlerts] = useState<Alert[]>(DEMO_ALERTS);
  const [incidents, setIncidents] = useState<Incident[]>(DEMO_INCIDENTS);
  const [tracks, setTracks] = useState<TrackedObject[]>(DEMO_TRACKED_OBJECTS);
  const [demoRunning, setDemoRunning] = useState(false);
  const [demoPaused, setDemoPaused] = useState(false);
  const [demoStep, setDemoStep] = useState(0);
  const [demoLog, setDemoLog] = useState<string[]>([]);
  const demoRef = useRef<any>(null);

  // Simulate live KPI drift
  useEffect(() => {
    const t = setInterval(() => {
      setKPI(k => ({
        ...k,
        avg_confidence: Math.max(82, Math.min(97, k.avg_confidence + (Math.random() - 0.5) * 2)),
        active_tracks: Math.max(1, k.active_tracks + (Math.random() > 0.7 ? 1 : Math.random() > 0.7 ? -1 : 0)),
      }));
    }, 5000);
    return () => clearInterval(t);
  }, []);

  const runDemoStep = useCallback((step: number) => {
    const s = DEMO_STEPS[step];
    if (!s) { setDemoRunning(false); setDemoStep(0); return; }
    setDemoLog(prev => [`[STEP ${s.step}] ${s.label}`, ...prev].slice(0, 20));

    if (step === 1) setKPI(k => ({ ...k, active_tracks: k.active_tracks + 1 }));
    if (step === 3) setKPI(k => ({ ...k, alerts_today: k.alerts_today + 1 }));
    if (step === 4) setKPI(k => ({ ...k, critical_threats: k.critical_threats + 1 }));
    if (step === 9) {
      const newInc: Incident = {
        id: "inc-demo", incident_code: "INC-2026-0004", camera_id: "CAM-01", camera_name: "ALPHA GATE NORTH",
        sector: "A-04", timestamp: new Date().toISOString(), object_type: "person", tracking_id: "P-021",
        confidence: 96, threat_type: "Restricted Zone Intrusion", risk_score: 94, risk_level: "CRITICAL",
        status: "NEW", operator: "—", ai_reasons: ["Person entered restricted zone", "UNKNOWN identity", "High confidence detection"],
        timeline: [], created_at: new Date().toISOString(),
      };
      setIncidents(prev => [newInc, ...prev]);
    }
  }, []);

  const startDemo = useCallback(() => {
    setDemoRunning(true);
    setDemoPaused(false);
    setDemoStep(0);
    setDemoLog([]);
  }, []);

  useEffect(() => {
    if (!demoRunning || demoPaused || demoStep >= DEMO_STEPS.length) return;
    const t = setTimeout(() => {
      runDemoStep(demoStep);
      setDemoStep(s => s + 1);
    }, 2500);
    return () => clearTimeout(t);
  }, [demoRunning, demoPaused, demoStep, runDemoStep]);

  const acknowledgeAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true, status: "ACKNOWLEDGED" } : a));
  };

  const mainCamera = DEMO_CAMERAS[0];

  return (
    <div className="p-4 space-y-4 min-h-full grid-bg">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="font-mono text-xs text-cyan-700 tracking-widest">IBVAP / COMMAND CENTER</div>
          <h1 className="font-display font-bold text-2xl text-slate-900 tracking-wide">Command Center</h1>
        </div>
        <div className="flex items-center gap-2">
          {demoRunning && (
            <>
              <button onClick={() => setDemoPaused(p => !p)} className="px-3 py-1.5 border border-amber-700 text-amber-400 font-mono text-xs hover:border-amber-500 transition-colors">
                {demoPaused ? "▶ RESUME" : "⏸ PAUSE"}
              </button>
              <button onClick={() => { setDemoRunning(false); setDemoStep(0); setDemoLog([]); setKPI(DEMO_KPI); setAlerts(DEMO_ALERTS); setIncidents(DEMO_INCIDENTS); }} className="px-3 py-1.5 border border-slate-700 text-slate-400 font-mono text-xs hover:border-slate-500 transition-colors">
                ↺ RESET
              </button>
            </>
          )}
          {!demoRunning && (
            <button
              onClick={startDemo}
              className="px-4 py-1.5 font-mono text-xs tracking-widest transition-all border-glow-cyan"
              style={{ background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.4)", color: "#22d3ee" }}
            >
              ▶ RUN DEMO SCENARIO
            </button>
          )}
        </div>
      </div>

      {/* Demo progress bar */}
      {demoRunning && (
        <div className="glass-panel p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-amber-400">DEMO SCENARIO — STEP {Math.min(demoStep, DEMO_STEPS.length)} / {DEMO_STEPS.length}</span>
            <span className={`font-mono text-xs ${demoPaused ? "text-amber-500" : "text-green-400"}`}>{demoPaused ? "PAUSED" : "RUNNING"}</span>
          </div>
          <div className="h-1 bg-slate-200 overflow-hidden">
            <div className="h-full bg-cyan-500 transition-all duration-700" style={{ width: `${(Math.min(demoStep, DEMO_STEPS.length) / DEMO_STEPS.length) * 100}%` }} />
          </div>
          {demoStep > 0 && demoStep <= DEMO_STEPS.length && (
            <div className="font-mono text-xs text-cyan-700">{DEMO_STEPS[Math.min(demoStep, DEMO_STEPS.length) - 1]?.description}</div>
          )}
        </div>
      )}

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        <KPICard label="LIVE CAMERAS" value={kpi.live_cameras} unit="/6" color="#22d3ee" />
        <KPICard label="ACTIVE AI TRACKS" value={kpi.active_tracks} color="#06b6d4" />
        <KPICard label="ALERTS TODAY" value={kpi.alerts_today} color="#f59e0b" />
        <KPICard label="CRITICAL THREATS" value={kpi.critical_threats} color="#ef4444" pulse={kpi.critical_threats > 0} />
        <KPICard label="SYSTEM UPTIME" value={kpi.uptime_pct.toFixed(1)} unit="%" color="#22c55e" />
        <KPICard label="AVG AI CONFIDENCE" value={Math.round(kpi.avg_confidence)} unit="%" color="#a78bfa" />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Left: Primary feed + tracking */}
        <div className="xl:col-span-2 space-y-4">
            {/* Primary surveillance feed */}
            <div className="glass-panel overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 border-b border-cyan-900/30">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-blink" />
                  <span className="font-mono text-xs text-cyan-400">PRIMARY FEED — CAM-01</span>
                </div>
                <button onClick={() => nav("/surveillance")} className="font-mono text-xs text-slate-500 hover:text-cyan-400 transition-colors">VIEW ALL →</button>
              </div>
              <SurveillanceVideo
                camera={mainCamera}
                detections={
                  demoRunning && demoStep >= 1
                    ? [
                        (() => {
                          let x = 40.8;
                          let y = 63.8;
                          let width = 5.4;
                          let height = 18.0;
                          let zone = "SAFE PERIMETER";
                          let risk_level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" = "LOW";
                          let confidence = 94;

                          if (demoStep >= 7) {
                            x = 52.0;
                            y = 54.0;
                            width = 5.0;
                            height = 16.5;
                            zone = "RESTRICTED";
                            risk_level = "CRITICAL";
                            confidence = 98;
                          } else if (demoStep >= 5) {
                            x = 46.5;
                            y = 58.8;
                            width = 5.2;
                            height = 17.4;
                            zone = "RESTRICTED";
                            risk_level = "CRITICAL";
                            confidence = 97;
                          } else if (demoStep >= 3) {
                            x = 40.8;
                            y = 63.8;
                            width = 5.4;
                            height = 18.0;
                            zone = demoStep >= 4 ? "RESTRICTED" : "WARNING";
                            risk_level = demoStep >= 4 ? "CRITICAL" : "HIGH";
                            confidence = 96;
                          } else {
                            x = 35.5;
                            y = 58.5;
                            width = 5.2;
                            height = 17.0;
                            zone = "SAFE";
                            risk_level = "LOW";
                            confidence = 94;
                          }

                          return {
                            id: "d1",
                            camera_id: "CAM-01",
                            object_type: "person",
                            confidence,
                            tracking_id: "P-021",
                            bounding_box: { x, y, width, height },
                            zone,
                            risk_level,
                            timestamp: new Date().toISOString(),
                          };
                        })(),
                      ]
                    : []
                }
                showPTZ={demoStep >= 8}
                onFullscreen={() => nav("/surveillance")}
              />
            </div>

          {/* Active AI Tracks */}
          <div className="glass-panel">
            <div className="px-3 py-2 border-b border-cyan-900/30">
              <span className="font-mono text-xs text-cyan-400">ACTIVE AI TRACKS</span>
            </div>
            <div className="divide-y divide-slate-800/50">
              {tracks.map(t => (
                <div key={t.tracking_id} className="flex items-center gap-3 px-3 py-2 hover:bg-cyan-900/10 transition-colors">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: t.status === "ACTIVE" ? "#10b981" : "#94a3b8" }} />
                  <div className="font-mono text-xs text-slate-700 w-16 flex-shrink-0">{t.tracking_id}</div>
                  <div className="font-mono text-xs text-slate-500 w-12 flex-shrink-0">{t.object_type}</div>
                  <div className="font-mono text-xs text-slate-500 flex-1">{t.camera_id} | {t.zone}</div>
                  <div className="font-mono text-xs" style={{ color: RISK_COLORS[t.risk_level] }}>{t.risk_level}</div>
                  <div className="font-mono text-xs text-slate-500">{t.confidence}%</div>
                  {t.threat_score !== undefined && (
                    <div className="font-mono text-xs px-1.5 py-0.5 border" style={{ color: RISK_COLORS[t.risk_level], borderColor: `${RISK_COLORS[t.risk_level]}40`, background: `${RISK_COLORS[t.risk_level]}10` }}>
                      {t.threat_score}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Threat feed + Recent incidents */}
        <div className="space-y-4">
          {/* Threat Feed */}
          <div className="glass-panel">
            <div className="flex items-center justify-between px-3 py-2 border-b border-cyan-900/30">
              <span className="font-mono text-xs text-cyan-400">REAL-TIME THREAT FEED</span>
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 bg-red-500 rounded-full animate-blink" />
                <span className="font-mono text-[10px] text-red-400">LIVE</span>
              </div>
            </div>
            <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/40">
              {alerts.map(alert => (
                <div key={alert.id} className={`p-2.5 transition-colors ${!alert.acknowledged && alert.severity === "CRITICAL" ? "border-glow-red" : ""}`}
                  style={!alert.acknowledged && alert.severity === "CRITICAL" ? { background: "rgba(239,68,68,0.04)" } : {}}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      {!alert.acknowledged && <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse-red" style={{ background: SEV_COLORS[alert.severity] }} />}
                      <span className="font-mono text-[10px] font-bold" style={{ color: SEV_COLORS[alert.severity] }}>{alert.severity}</span>
                    </div>
                    <span className="font-mono text-[9px] text-slate-600 flex-shrink-0">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="font-mono text-xs text-slate-700 mt-0.5 leading-tight">{alert.title}</div>
                  <div className="font-mono text-[10px] text-slate-500 mt-0.5">{alert.camera_id} | Sector {alert.sector}</div>
                  <div className="flex gap-1.5 mt-1.5">
                    {!alert.acknowledged && (
                      <button onClick={() => acknowledgeAlert(alert.id)} className="px-1.5 py-0.5 font-mono text-[9px] text-amber-400 border border-amber-800 hover:border-amber-500 transition-colors">ACK</button>
                    )}
                    <button onClick={() => nav("/incidents")} className="px-1.5 py-0.5 font-mono text-[9px] text-cyan-500 border border-cyan-900 hover:border-cyan-600 transition-colors">VIEW</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Incidents */}
          <div className="glass-panel">
            <div className="flex items-center justify-between px-3 py-2 border-b border-cyan-900/30">
              <span className="font-mono text-xs text-cyan-400">RECENT INCIDENTS</span>
              <button onClick={() => nav("/incidents")} className="font-mono text-xs text-slate-500 hover:text-cyan-400 transition-colors">ALL →</button>
            </div>
            <div className="divide-y divide-slate-800/40">
              {incidents.slice(0, 4).map(inc => (
                <div key={inc.id} className="px-3 py-2 hover:bg-cyan-900/10 transition-colors cursor-pointer" onClick={() => nav("/incidents")}>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-slate-700 font-medium">{inc.incident_code}</span>
                    <span className="font-mono text-[10px] px-1.5 py-0.5" style={{ color: RISK_COLORS[inc.risk_level], background: `${RISK_COLORS[inc.risk_level]}15`, border: `1px solid ${RISK_COLORS[inc.risk_level]}30` }}>{inc.risk_level}</span>
                  </div>
                  <div className="font-mono text-[10px] text-slate-600 mt-0.5">{inc.threat_type}</div>
                  <div className="font-mono text-[10px] text-slate-500 mt-0.5">{inc.camera_id} | {new Date(inc.timestamp).toLocaleTimeString()}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Demo log */}
          {demoLog.length > 0 && (
            <div className="glass-panel">
              <div className="px-3 py-2 border-b border-cyan-900/30">
                <span className="font-mono text-xs text-amber-400">DEMO EVENT LOG</span>
              </div>
              <div className="p-2 max-h-40 overflow-y-auto space-y-1">
                {demoLog.map((log, i) => (
                  <div key={i} className="font-mono text-[10px] text-slate-400 animate-fade-in">{log}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

