import { useState } from "react";
import { DEMO_ZONES, DEMO_CAMERAS } from "../services/demoData";
import type { Zone, ZoneType } from "../types";

const ZONE_COLORS: Record<ZoneType, string> = {
  SAFE: "#22c55e",
  WARNING: "#f59e0b",
  RESTRICTED: "#ef4444",
  CRITICAL: "#7c3aed",
};

const ZONE_FILL: Record<ZoneType, string> = {
  SAFE: "rgba(34,197,94,0.08)",
  WARNING: "rgba(245,158,11,0.08)",
  RESTRICTED: "rgba(239,68,68,0.1)",
  CRITICAL: "rgba(124,58,237,0.12)",
};

export default function VirtualZones() {
  const [zones, setZones] = useState<Zone[]>(DEMO_ZONES);
  const [selectedCam, setSelectedCam] = useState(DEMO_CAMERAS[0].camera_id);
  const [showAddZone, setShowAddZone] = useState(false);
  const [newZoneName, setNewZoneName] = useState("");
  const [newZoneType, setNewZoneType] = useState<ZoneType>("WARNING");

  const cameraZones = zones.filter(z => z.camera_id === selectedCam);

  const toggleZone = (id: string) => {
    setZones(prev => prev.map(z => z.id === id ? { ...z, active: !z.active } : z));
  };

  const addZone = () => {
    if (!newZoneName) return;
    const newZone: Zone = {
      id: `z-${Date.now()}`,
      name: newZoneName.toUpperCase(),
      type: newZoneType,
      camera_id: selectedCam,
      sector: DEMO_CAMERAS.find(c => c.camera_id === selectedCam)?.sector || "X-00",
      risk_weight: newZoneType === "CRITICAL" ? 10 : newZoneType === "RESTRICTED" ? 8 : newZoneType === "WARNING" ? 4 : 1,
      active: true,
      points: [{ x: 10, y: 10 }, { x: 40, y: 10 }, { x: 40, y: 40 }, { x: 10, y: 40 }],
    };
    setZones(prev => [...prev, newZone]);
    setNewZoneName("");
    setShowAddZone(false);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="font-mono text-xs text-cyan-700 tracking-widest">IBVAP / VIRTUAL ZONES</div>
          <h1 className="font-display font-bold text-2xl text-slate-900 tracking-wide">Virtual Zones / Geofence</h1>
        </div>
        <button onClick={() => setShowAddZone(true)} className="px-3 py-1.5 font-mono text-xs border border-cyan-800 text-cyan-400 hover:border-cyan-600 transition-colors" style={{ background: "rgba(34,211,238,0.05)" }}>
          + ADD ZONE
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Zone preview on camera */}
        <div className="xl:col-span-2 glass-panel overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-200 flex-wrap">
            <span className="font-mono text-xs text-cyan-600 font-medium">ZONE OVERLAY —</span>
            {DEMO_CAMERAS.filter(c => c.status === "ONLINE").map(cam => (
              <button key={cam.camera_id} onClick={() => setSelectedCam(cam.camera_id)}
                className={`px-2 py-0.5 font-mono text-xs border transition-colors ${selectedCam === cam.camera_id ? "border-cyan-500 text-cyan-400" : "border-slate-700 text-slate-500"}`}>
                {cam.camera_id}
              </button>
            ))}
          </div>

          <div className="relative" style={{ paddingBottom: "56.25%", background: "#000" }}>
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Camera feed background suggestion */}
              <rect x="0" y="0" width="100" height="100" fill="#f8fafc" />
              {/* Grid */}
              {[10, 20, 30, 40, 50, 60, 70, 80, 90].map(v => (
                <g key={v}>
                  <line x1={v} y1="0" x2={v} y2="100" stroke="rgba(15,23,42,0.05)" strokeWidth="0.3" />
                  <line x1="0" y1={v} x2="100" y2={v} stroke="rgba(15,23,42,0.05)" strokeWidth="0.3" />
                </g>
              ))}

              {/* Zone polygons */}
              {cameraZones.map(zone => {
                const color = ZONE_COLORS[zone.type];
                const fill = ZONE_FILL[zone.type];
                const pts = zone.points.map(p => `${p.x},${p.y}`).join(" ");
                return (
                  <g key={zone.id} opacity={zone.active ? 1 : 0.3}>
                    <polygon points={pts} fill={fill} stroke={color} strokeWidth="0.5" strokeDasharray={zone.type === "SAFE" ? "none" : "2,1"} />
                    {zone.points.map((p, i) => (
                      <circle key={i} cx={p.x} cy={p.y} r="1" fill={color} opacity="0.8" />
                    ))}
                    <text
                      x={zone.points.reduce((s, p) => s + p.x, 0) / zone.points.length - 8}
                      y={zone.points.reduce((s, p) => s + p.y, 0) / zone.points.length}
                      fill={color} fontSize="3" fontFamily="monospace" opacity="0.9"
                    >
                      {zone.name}
                    </text>
                    <text
                      x={zone.points.reduce((s, p) => s + p.x, 0) / zone.points.length - 5}
                      y={zone.points.reduce((s, p) => s + p.y, 0) / zone.points.length + 4}
                      fill={color} fontSize="2" fontFamily="monospace" opacity="0.6"
                    >
                      {zone.type}
                    </text>
                  </g>
                );
              })}
            </svg>

            <div className="absolute bottom-2 left-2 font-mono text-[9px] text-slate-700">ZONE CONFIGURATION VIEW — DEMO MODE</div>
          </div>
        </div>

        {/* Zone list */}
        <div className="space-y-3">
          <div className="glass-panel divide-y divide-slate-200">
            <div className="px-3 py-2 bg-slate-50 border-b border-slate-200">
              <span className="font-mono text-xs text-cyan-700 font-bold">ACTIVE ZONES</span>
            </div>
            {cameraZones.map(zone => (
              <div key={zone.id} className="px-3 py-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: ZONE_COLORS[zone.type] }} />
                    <span className="font-mono text-xs text-slate-800 font-medium">{zone.name}</span>
                  </div>
                  <button onClick={() => toggleZone(zone.id)} className={`font-mono text-[10px] px-1.5 py-0.5 border rounded transition-colors ${zone.active ? "border-green-300 text-green-600 bg-green-50" : "border-slate-300 text-slate-500 bg-slate-50"}`}>
                    {zone.active ? "ACTIVE" : "INACTIVE"}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-1 text-[10px] font-mono">
                  <div className="text-slate-500">Type</div><div style={{ color: ZONE_COLORS[zone.type] }} className="font-bold">{zone.type}</div>
                  <div className="text-slate-500">Camera</div><div className="text-slate-700">{zone.camera_id}</div>
                  <div className="text-slate-500">Sector</div><div className="text-slate-700">{zone.sector}</div>
                  <div className="text-slate-500">Risk Weight</div><div className="text-slate-700">{zone.risk_weight}/10</div>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-200">
                  <div className="font-mono text-[10px] text-slate-500 mb-1">ZONE RULE</div>
                  <div className="font-mono text-[10px] text-slate-700">
                    {zone.type === "RESTRICTED" && "Person enters → CRITICAL alert + Incident"}
                    {zone.type === "WARNING" && "Person enters → HIGH monitoring alert"}
                    {zone.type === "SAFE" && "Normal monitoring — no alert"}
                    {zone.type === "CRITICAL" && "Any object enters → CRITICAL + Response"}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add zone modal inline */}
          {showAddZone && (
            <div className="glass-panel p-3 animate-fade-in">
              <div className="font-mono text-xs text-cyan-400 mb-3">ADD ZONE</div>
              <div className="space-y-2">
                <div>
                  <label className="block font-mono text-[10px] text-cyan-700 mb-1 font-bold">ZONE NAME</label>
                  <input value={newZoneName} onChange={e => setNewZoneName(e.target.value)} className="w-full px-2 py-1.5 font-mono text-xs text-slate-800 border border-slate-300 focus:border-cyan-500 outline-none rounded bg-slate-50" />
                </div>
                <div>
                  <label className="block font-mono text-[10px] text-cyan-700 mb-1">ZONE TYPE</label>
                  <div className="grid grid-cols-2 gap-1">
                    {(["SAFE", "WARNING", "RESTRICTED", "CRITICAL"] as ZoneType[]).map(t => (
                      <button key={t} onClick={() => setNewZoneType(t)} className="py-1 font-mono text-[10px] border transition-colors" style={{ color: ZONE_COLORS[t], borderColor: newZoneType === t ? ZONE_COLORS[t] : "#334155", background: newZoneType === t ? `${ZONE_COLORS[t]}15` : "transparent" }}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={addZone} className="flex-1 py-1.5 font-mono text-xs rounded text-white" style={{ background: "#10b981" }}>ADD</button>
                  <button onClick={() => setShowAddZone(false)} className="px-3 py-1.5 font-mono text-xs border border-slate-300 text-slate-500 hover:border-slate-400 rounded bg-slate-50">CANCEL</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
