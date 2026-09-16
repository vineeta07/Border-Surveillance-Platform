import { useState, useEffect } from "react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { DEMO_SYSTEM_HEALTH } from "../services/demoData";

function generateHistory(base: number, variance: number = 5, count: number = 20) {
  return Array.from({ length: count }, (_, i) => ({ t: i, v: Math.max(0, Math.min(100, base + (Math.random() - 0.5) * variance)) }));
}

export default function SystemHealth() {
  const [health] = useState(DEMO_SYSTEM_HEALTH);
  const [cpuHistory, setCpuHistory] = useState(() => generateHistory(42, 10));
  const [memHistory, setMemHistory] = useState(() => generateHistory(67, 5));

  useEffect(() => {
    const t = setInterval(() => {
      setCpuHistory(prev => [...prev.slice(1), { t: Date.now(), v: Math.max(0, Math.min(100, 42 + (Math.random() - 0.5) * 15)) }]);
      setMemHistory(prev => [...prev.slice(1), { t: Date.now(), v: Math.max(0, Math.min(100, 67 + (Math.random() - 0.5) * 8)) }]);
    }, 2000);
    return () => clearInterval(t);
  }, []);

  const STATUS_STYLE: Record<string, { color: string; label: string }> = {
    ONLINE: { color: "#22c55e", label: "ONLINE" },
    OFFLINE: { color: "#ef4444", label: "OFFLINE" },
    DEGRADED: { color: "#f59e0b", label: "DEGRADED" },
    CONNECTED: { color: "#22c55e", label: "CONNECTED" },
    DISCONNECTED: { color: "#ef4444", label: "DISCONNECTED" },
  };

  const services = [
    { label: "AI Detection Engine", status: health.ai_engine, icon: "⚡" },
    { label: "API Server", status: health.api_server, icon: "◈" },
    { label: "Database", status: health.database, icon: "◎" },
    { label: "WebSocket", status: health.websocket, icon: "⊕" },
  ];

  return (
    <div className="p-4 space-y-4">
      <div>
        <div className="font-mono text-xs text-cyan-700 tracking-widest">IBVAP / SYSTEM HEALTH</div>
        <h1 className="font-display font-bold text-2xl text-white tracking-wide">System Health</h1>
      </div>

      {/* Service status cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {services.map(({ label, status, icon }) => {
          const s = STATUS_STYLE[status];
          return (
            <div key={label} className="glass-panel p-3 flex items-center gap-3">
              <div className="w-8 h-8 border flex items-center justify-center flex-shrink-0" style={{ borderColor: `${s.color}40`, background: `${s.color}10` }}>
                <span style={{ color: s.color }}>{icon}</span>
              </div>
              <div>
                <div className="font-mono text-[10px] text-slate-500">{label}</div>
                <div className="font-mono text-xs font-bold" style={{ color: s.color }}>{s.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "CAMERAS ONLINE", value: `${health.cameras_online}/${health.cameras_total}`, color: "#22d3ee" },
          { label: "AI INFERENCE", value: `${health.ai_fps} FPS`, color: "#a78bfa" },
          { label: "AVG LATENCY", value: `${health.avg_latency_ms} ms`, color: "#22c55e" },
          { label: "GPU USAGE", value: `${health.gpu_usage}%`, color: "#f59e0b" },
        ].map(({ label, value, color }) => (
          <div key={label} className="glass-panel p-3">
            <div className="font-mono text-[10px] tracking-widest mb-1" style={{ color: `${color}80` }}>{label}</div>
            <div className="font-display font-bold text-2xl" style={{ color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {/* CPU */}
        <div className="glass-panel p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-xs text-cyan-400">CPU USAGE</span>
            <span className="font-mono text-sm text-white">{Math.round(cpuHistory[cpuHistory.length - 1]?.v || 42)}%</span>
          </div>
          <div className="h-1.5 bg-slate-800 mb-3 overflow-hidden">
            <div className="h-full transition-all duration-1000 bg-cyan-400" style={{ width: `${cpuHistory[cpuHistory.length - 1]?.v || 42}%` }} />
          </div>
          <ResponsiveContainer width="100%" height={80}>
            <AreaChart data={cpuHistory.map((d, i) => ({ t: i, v: d.v }))}>
              <defs>
                <linearGradient id="cpuGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="v" stroke="#22d3ee" strokeWidth={1.5} fill="url(#cpuGrad)" isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Memory */}
        <div className="glass-panel p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-xs text-cyan-400">MEMORY USAGE</span>
            <span className="font-mono text-sm text-white">{Math.round(memHistory[memHistory.length - 1]?.v || 67)}%</span>
          </div>
          <div className="h-1.5 bg-slate-800 mb-3 overflow-hidden">
            <div className="h-full transition-all duration-1000" style={{ width: `${memHistory[memHistory.length - 1]?.v || 67}%`, background: "#a78bfa" }} />
          </div>
          <ResponsiveContainer width="100%" height={80}>
            <AreaChart data={memHistory.map((d, i) => ({ t: i, v: d.v }))}>
              <defs>
                <linearGradient id="memGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#a78bfa" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="v" stroke="#a78bfa" strokeWidth={1.5} fill="url(#memGrad)" isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Camera health */}
        <div className="glass-panel p-4">
          <div className="font-mono text-xs text-cyan-400 mb-3">CAMERA RELIABILITY</div>
          <div className="space-y-2">
            {[
              { id: "CAM-01", score: 98 },
              { id: "CAM-02", score: 94 },
              { id: "CAM-03", score: 97 },
              { id: "CAM-04", score: 92 },
              { id: "CAM-05", score: 89 },
              { id: "CAM-06", score: 0 },
            ].map(({ id, score }) => (
              <div key={id} className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-slate-500 w-12">{id}</span>
                <div className="flex-1 h-1 bg-slate-800 overflow-hidden">
                  <div className="h-full" style={{ width: `${score}%`, background: score > 90 ? "#22c55e" : score > 70 ? "#f59e0b" : score > 0 ? "#ef4444" : "#334155" }} />
                </div>
                <span className="font-mono text-[10px] text-slate-400 w-8 text-right">{score > 0 ? `${score}%` : "OFF"}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
