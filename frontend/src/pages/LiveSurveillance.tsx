import { useState } from "react";
import { DEMO_CAMERAS } from "../services/demoData";
import type { Camera } from "../types";
import SurveillanceVideo from "../components/SurveillanceVideo";

type ViewMode = "grid" | "single";

export default function LiveSurveillance() {
  const [cameras] = useState<Camera[]>(() =>
    Array.isArray(DEMO_CAMERAS) ? DEMO_CAMERAS.filter(Boolean) : []
  );

  const [view, setView] = useState<ViewMode>("grid");

  const [selected, setSelected] = useState<Camera | null>(() =>
    (Array.isArray(DEMO_CAMERAS) ? DEMO_CAMERAS.find(Boolean) : null) ?? null
  );
  const [fullscreen, setFullscreen] = useState<Camera | null>(null);
  const [filterSector, setFilterSector] = useState("ALL");
  const [showAddModal, setShowAddModal] = useState(false);

  const sectors = ["ALL", ...Array.from(new Set(cameras.map(c => c.sector)))];
  const filtered = cameras.filter(
    (c): c is Camera =>
      Boolean(c) && (filterSector === "ALL" || c.sector === filterSector)
  );

  return (
    <div className="p-4 space-y-4 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="font-mono text-xs text-cyan-700 tracking-widest">IBVAP / LIVE SURVEILLANCE</div>
          <h1 className="font-display font-bold text-2xl text-slate-900 tracking-wide">Live Surveillance</h1>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1">
            <span className="font-mono text-xs text-slate-500">SECTOR:</span>
            {sectors.map(s => (
              <button key={s} onClick={() => setFilterSector(s)} className={`px-2 py-0.5 font-mono text-xs border transition-colors ${filterSector === s ? "border-cyan-500 text-cyan-400" : "border-slate-700 text-slate-500 hover:border-slate-500"}`}
                style={filterSector === s ? { background: "rgba(34,211,238,0.08)" } : {}}>
                {s}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 border-l border-slate-800 pl-2">
            <button onClick={() => setView("grid")} className={`px-2 py-0.5 font-mono text-xs border transition-colors ${view === "grid" ? "border-cyan-500 text-cyan-400" : "border-slate-700 text-slate-500 hover:border-slate-500"}`}>GRID</button>
            <button onClick={() => setView("single")} className={`px-2 py-0.5 font-mono text-xs border transition-colors ${view === "single" ? "border-cyan-500 text-cyan-400" : "border-slate-700 text-slate-500 hover:border-slate-500"}`}>SINGLE</button>
          </div>
          <button onClick={() => setShowAddModal(true)} className="px-3 py-1.5 font-mono text-xs border border-cyan-800 text-cyan-400 hover:border-cyan-600 transition-colors" style={{ background: "rgba(34,211,238,0.05)" }}>
            + ADD CAMERA
          </button>
        </div>
      </div>

      {/* Grid view */}
      {view === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {filtered.map(cam => (
            <div key={cam.id} className={`glass-panel overflow-hidden cursor-pointer transition-all ${selected && selected.id === cam.id ? "border-glow-cyan" : ""}`}
              onClick={() => { setSelected(cam); setView("single"); }}>
              <SurveillanceVideo camera={cam} onFullscreen={() => setFullscreen(cam)} />
              <div className="px-3 py-2 flex items-center justify-between border-t border-navy-700/30">
                <div>
                  <div className="font-mono text-xs text-slate-700 font-medium">{cam.camera_id} — {cam.name}</div>
                  <div className="font-mono text-[10px] text-slate-500">Sector {cam.sector} | {cam.type}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-[10px] font-bold" style={{ color: cam.status === "ONLINE" ? "#10b981" : "#ef4444" }}>{cam.status}</div>
                  <div className="font-mono text-[10px] text-slate-500">AI: {cam.ai_status}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Single view */}
      {view === "single" && selected && (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-3">
          <div className="xl:col-span-3 glass-panel overflow-hidden">
            <SurveillanceVideo camera={selected} showPTZ onFullscreen={() => setFullscreen(selected)} />
          </div>
          <div className="space-y-2">
            <div className="glass-panel p-3">
              <div className="font-mono text-xs text-cyan-400 mb-2">CAMERA INFO</div>
              <div className="space-y-1.5 text-xs font-mono">
                {[
                  ["Camera ID", selected.camera_id],
                  ["Name", selected.name],
                  ["Sector", selected.sector],
                  ["Type", selected.type],
                  ["Location", selected.location],
                  ["Status", selected.status],
                  ["FPS", `${selected.fps} fps`],
                  ["Resolution", selected.resolution || "—"],
                  ["AI Status", selected.ai_status || "—"],
                  ["Reliability", `${selected.reliability_score}%`],
                  ["Alerts Today", `${selected.alerts_today}`],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-2">
                    <span className="text-slate-500">{k}</span>
                    <span className="text-slate-700 text-right font-medium">{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="font-mono text-xs text-slate-600 mb-1">SELECT CAMERA</div>
            {filtered.map(cam => (
              <button key={cam.id} onClick={() => setSelected(cam)}
                className={`w-full text-left px-2 py-1.5 font-mono text-xs border transition-colors ${selected.id === cam.id ? "border-cyan-600 text-cyan-400" : "border-navy-700 text-slate-500 hover:border-navy-600 hover:text-slate-300"}`}
                style={{ background: selected.id === cam.id ? "rgba(14,165,233,0.06)" : "var(--color-navy-900)" }}>
                <div className="flex items-center justify-between">
                  <span>{cam.camera_id} — {cam.name}</span>
                  <span style={{ color: cam.status === "ONLINE" ? "#10b981" : "#ef4444" }}>●</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Fullscreen modal */}
      {fullscreen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-auto" style={{ background: "rgba(10,12,16,0.95)" }}>
          <div className="w-full max-w-6xl w-full h-[80vh]">
            <SurveillanceVideo camera={fullscreen} showPTZ isFullscreen onClose={() => setFullscreen(null)} />
          </div>
        </div>
      )}

      {/* Add Camera Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto" style={{ background: "rgba(10,12,16,0.8)" }}>
          <div className="glass-panel p-6 w-full max-w-lg animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <span className="font-display font-bold text-lg text-cyan-600">ADD CAMERA</span>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>
            <form className="space-y-3" onSubmit={e => { e.preventDefault(); setShowAddModal(false); }}>
              {[
                ["Camera Name", "text", "Alpha Gate South"],
                ["Camera ID", "text", "CAM-07"],
                ["Sector", "text", "G-01"],
                ["Location", "text", "South Gate"],
                ["RTSP URL", "text", "rtsp://..."],
                ["Latitude", "number", "23.41"],
                ["Longitude", "number", "71.27"],
              ].map(([label, type, placeholder]) => (
                <div key={label}>
                  <label className="block font-mono text-xs text-cyan-700 tracking-widest mb-1">{label.toUpperCase()}</label>
                  <input type={type} placeholder={placeholder} className="w-full px-3 py-2 font-mono text-sm text-slate-800 border border-slate-300 focus:border-cyan-500 outline-none rounded bg-slate-50" />
                </div>
              ))}
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 py-2 font-mono text-sm tracking-widest rounded" style={{ background: "#10b981", color: "#ffffff" }}>ADD CAMERA</button>
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 font-mono text-sm border border-slate-300 text-slate-500 hover:border-slate-400 rounded">CANCEL</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
