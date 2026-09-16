import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { isSupabaseConfigured } from "../lib/supabase";

const TOGGLES = [
  { label: "ALERT SOUND", key: "alertSound", defaultVal: true },
  { label: "DEMO MODE SIMULATION", key: "demoSim", defaultVal: true },
  { label: "AUTO-ACKNOWLEDGE LOW ALERTS", key: "autoAck", defaultVal: false },
  { label: "AI DETECTION OVERLAYS", key: "aiOverlays", defaultVal: true },
  { label: "ZONE OVERLAYS", key: "zoneOverlays", defaultVal: true },
];

export default function Settings() {
  const { user, isDemo } = useAuth();
  const [saved, setSaved] = useState(false);
  const [approvals, setApprovals] = useState([
    { id: "WATCH-721", type: "ADD_WATCHLIST", entity: "VEHICLE_LP_XYZ", orgs: "ORG1, ORG2", status: "PENDING_ORG2" }
  ]);
  const [toggles, setToggles] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(TOGGLES.map(t => [t.key, t.defaultVal]))
  );

  const flipToggle = (key: string) => setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const approve = async (id: string) => {
    try {
      await fetch("http://localhost:3001/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entryId: id, action: "ADD", entryDetails: "VEHICLE_LP_XYZ" })
      });
      setApprovals(prev => prev.filter(a => a.id !== id));
    } catch (e) {
      console.error(e);
      alert("Failed to connect to blockchain gateway.");
    }
  };

  return (
    <div className="p-4 space-y-4 max-w-3xl">
      <div>
        <div className="font-mono text-xs text-cyan-700 tracking-widest">IBVAP / SETTINGS</div>
        <h1 className="font-display font-bold text-2xl text-slate-900 tracking-wide">Settings</h1>
      </div>

      {/* User info */}
      <div className="glass-panel p-4">
        <div className="font-mono text-xs text-cyan-400 mb-4">OPERATOR PROFILE</div>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 border border-cyan-300 flex items-center justify-center font-mono text-xl text-cyan-600 bg-cyan-50 rounded-full">
            {user?.full_name?.[0] || user?.email?.[0]?.toUpperCase() || "O"}
          </div>
          <div>
            <div className="font-mono text-sm text-slate-900 font-medium">{user?.full_name || "Demo Operator"}</div>
            <div className="font-mono text-xs text-slate-500">{user?.email}</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-mono text-xs px-1.5 py-0.5 border border-cyan-300 text-cyan-600 bg-cyan-50 rounded">{user?.role}</span>
              {isDemo && <span className="font-mono text-xs px-1.5 py-0.5 border border-amber-300 text-amber-600 bg-amber-50 rounded">DEMO MODE</span>}
            </div>
          </div>
        </div>
        {!isDemo && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[["Full Name", user?.full_name || ""], ["Email", user?.email || ""]].map(([label, val]) => (
              <div key={label}>
                <label className="block font-mono text-[10px] text-cyan-700 mb-1 font-bold">{(label as string).toUpperCase()}</label>
                <input defaultValue={val as string} className="w-full px-3 py-2 font-mono text-sm text-slate-800 border border-slate-300 focus:border-cyan-500 outline-none rounded bg-slate-50" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Platform config */}
      <div className="glass-panel p-4">
        <div className="font-mono text-xs text-cyan-600 font-medium mb-4">PLATFORM CONFIGURATION</div>
        <div className="space-y-3">
          {TOGGLES.map(({ label, key }) => (
            <div key={key} className="flex items-center justify-between py-2 border-b border-slate-200">
              <span className="font-mono text-xs text-slate-600">{label}</span>
              <button
                onClick={() => flipToggle(key)}
                className="w-10 h-5 relative rounded-full transition-colors"
                style={{ background: toggles[key] ? "var(--color-cyan-500, #10b981)" : "#cbd5e1" }}
              >
                <div className="absolute top-0.5 h-4 w-4 rounded-full transition-all bg-white" style={{ left: toggles[key] ? "calc(100% - 18px)" : "2px" }} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Blockchain Approvals */}
      <div className="glass-panel p-4">
        <div className="font-mono text-xs text-cyan-600 font-medium mb-4 tracking-wider">BLOCKCHAIN TRUST LAYER</div>
        <div className="space-y-3">
          <div className="flex flex-col py-2 border-b border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs text-slate-600">PENDING MULTI-SIG APPROVALS</span>
              <span className={`font-mono text-xs font-bold ${approvals.length > 0 ? "text-amber-500" : "text-slate-400"}`}>
                {approvals.length} PENDING
              </span>
            </div>
            {approvals.map(app => (
              <div key={app.id} className="bg-slate-50 border border-slate-200 p-2 rounded flex justify-between items-center mb-2">
                <div className="font-mono text-[10px] text-slate-700">
                  <span className="font-bold">{app.id}</span> | {app.type} ({app.entity})
                </div>
                <button 
                  onClick={() => approve(app.id)}
                  className="px-2 py-1 text-[10px] font-mono bg-emerald-100 text-emerald-700 border border-emerald-300 rounded hover:bg-emerald-200 transition-colors font-bold"
                >
                  ENDORSE
                </button>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between py-2 border-b border-slate-200">
            <span className="font-mono text-xs text-slate-600">NETWORK STATUS</span>
            <span className="font-mono text-xs text-green-500 font-bold">FABRIC TEST-NET ONLINE</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={save} className="px-6 py-2 font-mono text-sm tracking-widest transition-all rounded text-white" style={{ background: "#10b981" }}>
          {saved ? "✓ SAVED" : "SAVE SETTINGS"}
        </button>
        <div className="font-mono text-xs text-slate-400">SIH26187 | Team Drishti | SMART INDIA HACKATHON 2026</div>
      </div>
    </div>
  );
}
