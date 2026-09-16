import { useState } from "react";
import { DEMO_CAMERAS } from "../services/demoData";
import type { Camera } from "../types";

const STATUS_COLORS: Record<string, string> = { ONLINE: "#22c55e", OFFLINE: "#64748b", DEGRADED: "#f59e0b" };
const SECTOR_COLORS: Record<string, string> = { "A-04": "#ef4444", "B-02": "#22c55e", "C-07": "#22d3ee", "D-03": "#f97316", "E-01": "#a78bfa", "F-00": "#64748b" };

// Normalized positions for simulated map
const CAM_POSITIONS: Record<string, { x: number; y: number }> = {
  "CAM-01": { x: 35, y: 25 },
  "CAM-02": { x: 65, y: 20 },
  "CAM-03": { x: 50, y: 50 },
  "CAM-04": { x: 20, y: 65 },
  "CAM-05": { x: 80, y: 35 },
  "CAM-06": { x: 75, y: 70 },
};

export default function BorderMap() {
  const [selected, setSelected] = useState<Camera | null>(null);
  const cameras = DEMO_CAMERAS;

  return (
    <div className="p-4 space-y-4 h-full">
      <div>
        <div className="font-mono text-xs text-cyan-700 tracking-widest">IBVAP / BORDER MAP</div>
        <h1 className="font-display font-bold text-2xl text-slate-900 tracking-wide">Border Surveillance Map</h1>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        {/* Map */}
        <div className="xl:col-span-3 glass-panel overflow-hidden" style={{ minHeight: 480 }}>
          <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200">
            <span className="font-mono text-xs text-cyan-600">SIMULATED BORDER MAP — DEMO MODE</span>
            <div className="flex items-center gap-3 text-xs font-mono">
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500" /><span className="text-slate-500">Online</span></div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500" /><span className="text-slate-500">Alert</span></div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-slate-400" /><span className="text-slate-500">Offline</span></div>
            </div>
          </div>

          <div className="relative w-full rounded-b-lg" style={{ paddingBottom: "56%", background: "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 60%, #e2e8f0 100%)" }}>
            <div className="absolute inset-0 grid-bg" />

            {/* Border line */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Border line */}
              <polyline points="5,15 15,12 25,18 40,10 55,14 70,8 85,12 95,10" stroke="rgba(16,185,129,0.4)" strokeWidth="0.4" fill="none" strokeDasharray="2,1" />
              <text x="5" y="7" fill="rgba(16,185,129,0.7)" fontSize="2.5" fontFamily="monospace">INTERNATIONAL BORDER</text>

              {/* Sectors */}
              {[["SECTOR A", 10, 30], ["SECTOR B", 40, 35], ["SECTOR C", 65, 45], ["SECTOR D", 20, 70], ["SECTOR E", 75, 50]].map(([label, x, y]) => (
                <text key={label} x={x} y={y} fill="rgba(15,23,42,0.15)" fontSize="3" fontFamily="monospace" fontWeight="bold">{label}</text>
              ))}

              {/* Threat hotspot */}
              <circle cx="35" cy="25" r="5" fill="rgba(239,68,68,0.1)" stroke="rgba(239,68,68,0.4)" strokeWidth="0.3" strokeDasharray="1,1" />
              <circle cx="35" cy="25" r="9" fill="none" stroke="rgba(239,68,68,0.2)" strokeWidth="0.2" strokeDasharray="1,2" />
              <text x="28" y="34" fill="rgba(239,68,68,0.7)" fontSize="2" fontFamily="monospace" fontWeight="bold">THREAT HOTSPOT</text>

              {/* Camera markers */}
              {cameras.map(cam => {
                const pos = CAM_POSITIONS[cam.camera_id];
                if (!pos) return null;
                const isAlert = (cam.alerts_today ?? 0) > 0;
                const color = cam.status === "OFFLINE" ? "#64748b" : isAlert ? "#ef4444" : "#22c55e";
                const isSelected = selected?.id === cam.id;
                return (
                  <g key={cam.id} style={{ cursor: "pointer" }} onClick={() => setSelected(cam)}>
                    {isAlert && <circle cx={pos.x} cy={pos.y} r="3" fill="none" stroke={color} strokeWidth="0.3" opacity="0.5">
                      <animate attributeName="r" from="2" to="6" dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" from="0.5" to="0" dur="2s" repeatCount="indefinite" />
                    </circle>}
                    <circle cx={pos.x} cy={pos.y} r={isSelected ? 2.5 : 2} fill={color} fillOpacity="0.9" stroke={isSelected ? "#047857" : "rgba(255,255,255,0.8)"} strokeWidth="0.4" />
                    <text x={pos.x + 2.5} y={pos.y - 1.5} fill="rgba(15,23,42,0.8)" fontSize="2" fontFamily="monospace" fontWeight="bold">{cam.camera_id}</text>
                    <text x={pos.x + 2.5} y={pos.y + 1} fill="rgba(15,23,42,0.6)" fontSize="1.5" fontFamily="monospace">{cam.sector}</text>
                  </g>
                );
              })}

              {/* Grid lines */}
              {[20, 40, 60, 80].map(x => <line key={x} x1={x} y1="0" x2={x} y2="100" stroke="rgba(15,23,42,0.05)" strokeWidth="0.3" />)}
              {[25, 50, 75].map(y => <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="rgba(15,23,42,0.05)" strokeWidth="0.3" />)}
            </svg>

            {/* Corner HUD markers */}
            <div className="absolute top-2 left-2 w-5 h-5 border-t border-l border-cyan-700 opacity-50" />
            <div className="absolute top-2 right-2 w-5 h-5 border-t border-r border-cyan-700 opacity-50" />
            <div className="absolute bottom-2 left-2 w-5 h-5 border-b border-l border-cyan-700 opacity-50" />
            <div className="absolute bottom-2 right-2 w-5 h-5 border-b border-r border-cyan-700 opacity-50" />

            {/* Selected camera popup */}
            {selected && (
              <div className="absolute glass-panel p-2 text-xs font-mono animate-fade-in z-10 bg-white shadow-lg" style={{ top: `${(CAM_POSITIONS[selected.camera_id]?.y || 50)}%`, left: `${Math.min((CAM_POSITIONS[selected.camera_id]?.x || 50) + 5, 65)}%`, transform: "translateY(-50%)", minWidth: 160 }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-cyan-600 font-bold">{selected.camera_id}</span>
                  <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600">✕</button>
                </div>
                <div className="space-y-0.5 text-slate-600">
                  <div className="font-medium text-slate-800">{selected.name}</div>
                  <div>Sector: {selected.sector}</div>
                  <div style={{ color: STATUS_COLORS[selected.status] }} className="font-bold">{selected.status}</div>
                  <div>Alerts: <span className="text-red-500 font-bold">{selected.alerts_today}</span></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Camera list */}
        <div className="glass-panel divide-y divide-slate-200">
          <div className="px-3 py-2 bg-slate-50 border-b border-slate-200">
            <span className="font-mono text-xs text-cyan-700 font-bold">CAMERA STATUS</span>
          </div>
          {cameras.map(cam => (
            <button key={cam.id} onClick={() => setSelected(cam)} className={`w-full text-left px-3 py-2.5 hover:bg-slate-50 transition-colors ${selected?.id === cam.id ? "bg-slate-100" : ""}`}>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: STATUS_COLORS[cam.status] }} />
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-xs text-slate-800 truncate font-medium">{cam.camera_id} — {cam.name}</div>
                  <div className="font-mono text-[10px] text-slate-500">Sector {cam.sector}</div>
                </div>
                {(cam.alerts_today ?? 0) > 0 && (
                  <span className="font-mono text-[10px] px-1 py-0.5 text-red-500 border border-red-200 bg-red-50 rounded">{cam.alerts_today}</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
