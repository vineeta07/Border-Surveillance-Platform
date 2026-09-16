import { useState } from "react";
import { DEMO_INCIDENTS } from "../services/demoData";
import type { Incident, IncidentStatus, RiskLevel } from "../types";

const RISK_COLORS: Record<string, string> = { CRITICAL: "#ef4444", HIGH: "#f97316", MEDIUM: "#f59e0b", LOW: "#22c55e" };
const STATUS_COLORS: Record<string, string> = { NEW: "#ef4444", ACKNOWLEDGED: "#f97316", INVESTIGATING: "#f59e0b", RESOLVED: "#22c55e", FALSE_POSITIVE: "#64748b" };

function IncidentDetail({ incident, onClose }: { incident: Incident; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.85)" }}>
      <div className="glass-panel w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in">
        <div className="sticky top-0 flex items-center justify-between px-4 py-3 border-b border-slate-200" style={{ background: "#ffffff" }}>
          <div>
            <div className="font-mono text-xs text-cyan-600">INCIDENT DETAIL</div>
            <div className="font-display font-bold text-lg text-slate-900">{incident.incident_code}</div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors text-sm">✕ CLOSE</button>
        </div>

        <div className="p-4 space-y-4">
          {/* Summary */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              ["Risk Level", incident.risk_level, RISK_COLORS[incident.risk_level]],
              ["Status", incident.status, STATUS_COLORS[incident.status]],
              ["Threat Score", `${incident.risk_score}/100`, RISK_COLORS[incident.risk_level]],
              ["Camera", incident.camera_id, "#22d3ee"],
              ["Sector", incident.sector || "—", "#94a3b8"],
              ["Tracking ID", incident.tracking_id, "#94a3b8"],
            ].map(([k, v, c]) => (
              <div key={k} className="glass-panel-dark p-2.5">
                <div className="font-mono text-[10px] text-slate-500 mb-1">{k}</div>
                <div className="font-mono text-sm font-bold" style={{ color: c as string }}>{v}</div>
              </div>
            ))}
          </div>

          {/* AI Threat Assessment */}
          <div className="glass-panel-dark p-3">
            <div className="font-mono text-xs text-cyan-400 mb-2">AI THREAT ASSESSMENT</div>
            <div className="flex items-center gap-4 mb-3">
              <div className="relative w-16 h-16">
                <svg viewBox="0 0 36 36" className="rotate-[-90deg]">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1e293b" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke={RISK_COLORS[incident.risk_level]} strokeWidth="3" strokeDasharray={`${incident.risk_score} 100`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-mono text-sm font-bold" style={{ color: RISK_COLORS[incident.risk_level] }}>{incident.risk_score}</span>
                </div>
              </div>
              <div>
                <div className="font-mono text-xs text-slate-400">Threat Score</div>
                <div className="font-display text-xl font-bold" style={{ color: RISK_COLORS[incident.risk_level] }}>{incident.risk_level}</div>
              </div>
            </div>
            <div className="space-y-1.5 mb-3">
              {incident.ai_reasons?.map((r, i) => (
                <div key={i} className="flex items-start gap-2 text-xs font-mono">
                  <span className="text-red-400 flex-shrink-0 mt-0.5">•</span>
                  <span className="text-slate-700">{r}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-200 pt-2">
              <div className="font-mono text-[10px] text-cyan-600 mb-1">RECOMMENDED OPERATOR ACTION</div>
              <div className="font-mono text-xs text-slate-400">Verify {incident.camera_id} and notify the nearest response unit. Operator makes final decision — AI assists human judgment only.</div>
            </div>
          </div>

          {/* Timeline */}
          <div className="glass-panel-dark p-3">
            <div className="font-mono text-xs text-cyan-400 mb-3">INCIDENT TIMELINE</div>
            <div className="space-y-3">
              {incident.timeline?.map((ev, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full border flex-shrink-0"
                      style={{ background: ev.status === "done" ? "#22c55e" : ev.status === "active" ? "#22d3ee" : "#334155", borderColor: ev.status === "done" ? "#22c55e" : ev.status === "active" ? "#22d3ee" : "#475569" }} />
                    {i < (incident.timeline?.length || 0) - 1 && <div className="w-px flex-1 mt-1" style={{ background: "#1e293b", minHeight: "20px" }} />}
                  </div>
                  <div className="pb-2">
                    <div className="font-mono text-xs text-slate-700 font-medium">{ev.event}</div>
                    <div className="font-mono text-[10px] text-slate-500">{new Date(ev.time).toLocaleTimeString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="glass-panel-dark p-3">
            <div className="font-mono text-xs text-cyan-600 mb-2">OPERATOR NOTES</div>
            <textarea
              defaultValue={incident.notes}
              placeholder="Add operator notes..."
              className="w-full px-2 py-1.5 font-mono text-xs text-slate-800 border border-slate-300 focus:border-cyan-500 outline-none resize-none rounded bg-slate-50"
              rows={3}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Incidents() {
  const [incidents, setIncidents] = useState<Incident[]>(DEMO_INCIDENTS);
  const [selected, setSelected] = useState<Incident | null>(null);
  const [filterRisk, setFilterRisk] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");

  const filtered = incidents.filter(i =>
    (filterRisk === "ALL" || i.risk_level === filterRisk) &&
    (filterStatus === "ALL" || i.status === filterStatus)
  );

  const updateStatus = (id: string, status: IncidentStatus) => {
    setIncidents(prev => prev.map(i => i.id === id ? { ...i, status } : i));
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="font-mono text-xs text-cyan-700 tracking-widest">IBVAP / INCIDENTS</div>
          <h1 className="font-display font-bold text-2xl text-slate-900 tracking-wide">Incident Management</h1>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"].map(r => (
            <button key={r} onClick={() => setFilterRisk(r)} className={`px-2 py-0.5 font-mono text-xs border transition-colors ${filterRisk === r ? "border-cyan-500 text-cyan-400" : "border-slate-700 text-slate-500 hover:border-slate-600"}`}
              style={filterRisk === r ? { background: "rgba(34,211,238,0.08)" } : {}}>
              {r}
            </button>
          ))}
          <div className="w-px h-4 bg-slate-800" />
          {["ALL", "NEW", "ACKNOWLEDGED", "INVESTIGATING", "RESOLVED"].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)} className={`px-2 py-0.5 font-mono text-xs border transition-colors ${filterStatus === s ? "border-cyan-500 text-cyan-400" : "border-slate-700 text-slate-500 hover:border-slate-600"}`}>
              {s === "ALL" ? s : s.substring(0, 3)}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cyan-900/40">
                {["Incident ID", "Timestamp", "Camera", "Sector", "Tracking ID", "Threat Type", "Confidence", "Risk", "Status", "Actions"].map(h => (
                  <th key={h} className="px-3 py-2 text-left font-mono text-[10px] text-cyan-700 tracking-widest whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map(inc => (
                <tr key={inc.id} className="hover:bg-cyan-900/10 transition-colors">
                  <td className="px-3 py-2 font-mono text-xs text-slate-700 font-medium">{inc.incident_code}</td>
                  <td className="px-3 py-2 font-mono text-xs text-slate-500 whitespace-nowrap">{new Date(inc.timestamp).toLocaleString()}</td>
                  <td className="px-3 py-2 font-mono text-xs text-slate-600">{inc.camera_id}</td>
                  <td className="px-3 py-2 font-mono text-xs text-slate-500">{inc.sector}</td>
                  <td className="px-3 py-2 font-mono text-xs text-slate-600">{inc.tracking_id}</td>
                  <td className="px-3 py-2 font-mono text-xs text-slate-700">{inc.threat_type}</td>
                  <td className="px-3 py-2 font-mono text-xs text-slate-500">{inc.confidence}%</td>
                  <td className="px-3 py-2">
                    <span className="font-mono text-xs px-1.5 py-0.5" style={{ color: RISK_COLORS[inc.risk_level], background: `${RISK_COLORS[inc.risk_level]}15`, border: `1px solid ${RISK_COLORS[inc.risk_level]}30` }}>
                      {inc.risk_level}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <span className="font-mono text-xs" style={{ color: STATUS_COLORS[inc.status] }}>{inc.status}</span>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex gap-1.5">
                      <button onClick={() => setSelected(inc)} className="px-1.5 py-0.5 font-mono text-[9px] text-cyan-400 border border-cyan-900 hover:border-cyan-600 transition-colors">VIEW</button>
                      {inc.status === "NEW" && (
                        <button onClick={() => updateStatus(inc.id, "ACKNOWLEDGED")} className="px-1.5 py-0.5 font-mono text-[9px] text-amber-400 border border-amber-900 hover:border-amber-600 transition-colors">ACK</button>
                      )}
                      {inc.status === "ACKNOWLEDGED" && (
                        <button onClick={() => updateStatus(inc.id, "INVESTIGATING")} className="px-1.5 py-0.5 font-mono text-[9px] text-blue-400 border border-blue-900 hover:border-blue-600 transition-colors">INV</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && <IncidentDetail incident={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
