import { useState } from "react";
import { DEMO_CAMERAS } from "../services/demoData";
import type { Camera } from "../types";

const STATUS_COLORS: Record<string, string> = { ONLINE: "#22c55e", OFFLINE: "#ef4444", DEGRADED: "#f59e0b" };

export default function CameraNetwork() {
  const [cameras, setCameras] = useState<Camera[]>(DEMO_CAMERAS);
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="font-mono text-xs text-cyan-700 tracking-widest">IBVAP / CAMERA NETWORK</div>
          <h1 className="font-display font-bold text-2xl text-white tracking-wide">Camera Network</h1>
        </div>
        <button onClick={() => setShowAdd(true)} className="px-3 py-1.5 font-mono text-xs border border-cyan-800 text-cyan-400 hover:border-cyan-600 transition-colors" style={{ background: "rgba(34,211,238,0.05)" }}>
          + ADD CAMERA
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "ONLINE", value: cameras.filter(c => c.status === "ONLINE").length, color: "#22c55e" },
          { label: "OFFLINE", value: cameras.filter(c => c.status === "OFFLINE").length, color: "#ef4444" },
          { label: "DEGRADED", value: cameras.filter(c => c.status === "DEGRADED").length, color: "#f59e0b" },
        ].map(({ label, value, color }) => (
          <div key={label} className="glass-panel p-3">
            <div className="font-mono text-xs mb-1" style={{ color: `${color}80` }}>{label}</div>
            <div className="font-display font-bold text-2xl" style={{ color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cyan-900/40">
                {["Camera ID", "Name", "Sector", "Location", "Type", "Status", "AI", "FPS", "Last Heartbeat", "Alerts", "Reliability"].map(h => (
                  <th key={h} className="px-3 py-2 text-left font-mono text-[10px] text-cyan-700 tracking-widest whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {cameras.map(cam => (
                <tr key={cam.id} className="hover:bg-cyan-900/10 transition-colors">
                  <td className="px-3 py-2 font-mono text-xs text-cyan-300">{cam.camera_id}</td>
                  <td className="px-3 py-2 font-mono text-xs text-slate-300 whitespace-nowrap">{cam.name}</td>
                  <td className="px-3 py-2 font-mono text-xs text-slate-500">{cam.sector}</td>
                  <td className="px-3 py-2 font-mono text-xs text-slate-500 max-w-32 truncate">{cam.location}</td>
                  <td className="px-3 py-2 font-mono text-xs text-slate-500 whitespace-nowrap">{cam.type}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: STATUS_COLORS[cam.status] }} />
                      <span className="font-mono text-xs" style={{ color: STATUS_COLORS[cam.status] }}>{cam.status}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <span className="font-mono text-xs" style={{ color: cam.ai_status === "ACTIVE" ? "#22d3ee" : "#64748b" }}>{cam.ai_status}</span>
                  </td>
                  <td className="px-3 py-2 font-mono text-xs text-slate-400">{cam.fps || "—"}</td>
                  <td className="px-3 py-2 font-mono text-xs text-slate-500 whitespace-nowrap">{cam.last_heartbeat ? new Date(cam.last_heartbeat).toLocaleTimeString() : "—"}</td>
                  <td className="px-3 py-2 font-mono text-xs text-amber-400">{cam.alerts_today}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1.5">
                      <div className="flex-1 h-1 bg-slate-800 min-w-[40px]">
                        <div className="h-full transition-all" style={{ width: `${cam.reliability_score}%`, background: (cam.reliability_score || 0) > 90 ? "#22c55e" : (cam.reliability_score || 0) > 70 ? "#f59e0b" : "#ef4444" }} />
                      </div>
                      <span className="font-mono text-xs text-slate-500">{cam.reliability_score}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Camera Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.8)" }}>
          <div className="glass-panel p-6 w-full max-w-md animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <span className="font-display font-bold text-lg text-cyan-400">ADD CAMERA</span>
              <button onClick={() => setShowAdd(false)} className="text-slate-500 hover:text-white">✕</button>
            </div>
            <form className="space-y-3" onSubmit={e => { e.preventDefault(); setShowAdd(false); }}>
              {[["Camera Name", "text"], ["Camera ID", "text"], ["Sector", "text"], ["Location", "text"], ["Type", "text"]].map(([label, type]) => (
                <div key={label}>
                  <label className="block font-mono text-xs text-cyan-700 tracking-widest mb-1">{label.toUpperCase()}</label>
                  <input type={type} className="w-full px-3 py-2 font-mono text-sm text-slate-200 border border-slate-700 focus:border-cyan-500 outline-none" style={{ background: "rgba(15,23,42,0.8)" }} />
                </div>
              ))}
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 py-2 font-mono text-sm" style={{ background: "#22d3ee", color: "#020817" }}>ADD</button>
                <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 font-mono text-sm border border-slate-700 text-slate-400">CANCEL</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
