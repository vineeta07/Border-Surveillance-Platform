import { useState } from "react";
import { DEMO_ALERTS } from "../services/demoData";
import type { Alert } from "../types";

const SEV_COLORS: Record<string, string> = { CRITICAL: "#ef4444", HIGH: "#f97316", MEDIUM: "#f59e0b", LOW: "#22c55e", INFO: "#22d3ee" };

export default function ThreatIntelligence() {
  const [alerts, setAlerts] = useState<Alert[]>(DEMO_ALERTS);
  const [muted, setMuted] = useState(false);

  const updateAlert = (id: string, status: Alert["status"]) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status, acknowledged: true } : a));
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="font-mono text-xs text-cyan-700 tracking-widest">IBVAP / THREAT INTELLIGENCE</div>
          <h1 className="font-display font-bold text-2xl text-white tracking-wide">Threat Intelligence</h1>
        </div>
        <button onClick={() => setMuted(m => !m)} className={`flex items-center gap-2 px-3 py-1.5 font-mono text-xs border transition-colors ${muted ? "border-slate-700 text-slate-500" : "border-cyan-800 text-cyan-400"}`}>
          {muted ? "🔕 ALERTS MUTED" : "🔔 ALERTS ACTIVE"}
        </button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(["CRITICAL", "HIGH", "MEDIUM", "LOW"] as const).map(sev => {
          const count = alerts.filter(a => a.severity === sev).length;
          return (
            <div key={sev} className="glass-panel p-3 flex items-center gap-3">
              <div className="w-2 h-8" style={{ background: SEV_COLORS[sev] }} />
              <div>
                <div className="font-mono text-xs" style={{ color: SEV_COLORS[sev] }}>{sev}</div>
                <div className="font-display font-bold text-2xl text-white">{count}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Alert list */}
      <div className="space-y-2">
        {alerts.map(alert => (
          <div key={alert.id} className={`glass-panel p-3 transition-all ${!alert.acknowledged && alert.severity === "CRITICAL" ? "animate-pulse-red border-glow-red" : ""}`}>
            <div className="flex items-start gap-3">
              <div className="w-1 self-stretch rounded-full flex-shrink-0" style={{ background: SEV_COLORS[alert.severity] }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold" style={{ color: SEV_COLORS[alert.severity] }}>{alert.severity}</span>
                  <span className="font-mono text-sm text-white">{alert.title}</span>
                  {!alert.acknowledged && <span className="px-1.5 py-0.5 font-mono text-[9px] text-red-400 border border-red-800 animate-pulse-cyan">UNACKNOWLEDGED</span>}
                </div>
                <div className="mt-1 font-mono text-xs text-slate-400">{alert.description}</div>
                <div className="mt-1.5 flex items-center gap-3 flex-wrap text-xs font-mono text-slate-500">
                  <span>{alert.camera_id}</span>
                  {alert.sector && <span>Sector {alert.sector}</span>}
                  {alert.tracking_id && <span>Track: {alert.tracking_id}</span>}
                  {alert.confidence && <span>Conf: {alert.confidence}%</span>}
                  <span>{new Date(alert.timestamp).toLocaleString()}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5 flex-shrink-0">
                <span className="font-mono text-xs px-1.5 py-0.5 text-center" style={{ color: alert.status === "ACTIVE" ? "#f59e0b" : alert.status === "ACKNOWLEDGED" ? "#22d3ee" : "#22c55e", border: `1px solid ${alert.status === "ACTIVE" ? "#f59e0b40" : alert.status === "ACKNOWLEDGED" ? "#22d3ee40" : "#22c55e40"}` }}>
                  {alert.status}
                </span>
              </div>
            </div>

            <div className="flex gap-2 mt-2.5 pt-2.5 border-t border-slate-800/50">
              <button className="px-2 py-0.5 font-mono text-[10px] text-cyan-400 border border-cyan-900 hover:border-cyan-600 transition-colors">VIEW</button>
              {!alert.acknowledged && <button onClick={() => updateAlert(alert.id, "ACKNOWLEDGED")} className="px-2 py-0.5 font-mono text-[10px] text-amber-400 border border-amber-900 hover:border-amber-600 transition-colors">ACKNOWLEDGE</button>}
              {alert.status === "ACKNOWLEDGED" && <button onClick={() => updateAlert(alert.id, "ACKNOWLEDGED")} className="px-2 py-0.5 font-mono text-[10px] text-blue-400 border border-blue-900 hover:border-blue-600 transition-colors">INVESTIGATE</button>}
              <button onClick={() => updateAlert(alert.id, "RESOLVED")} className="px-2 py-0.5 font-mono text-[10px] text-green-400 border border-green-900 hover:border-green-600 transition-colors">RESOLVE</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
