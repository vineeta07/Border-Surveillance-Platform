import { Link } from "react-router-dom";
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const hourlyData = [
  { hour: "00", threats: 0, persons: 1, vehicles: 0 },
  { hour: "02", threats: 0, persons: 0, vehicles: 1 },
  { hour: "04", threats: 1, persons: 2, vehicles: 0 },
  { hour: "06", threats: 0, persons: 3, vehicles: 2 },
  { hour: "08", threats: 0, persons: 5, vehicles: 8 },
  { hour: "10", threats: 1, persons: 4, vehicles: 6 },
  { hour: "12", threats: 0, persons: 6, vehicles: 7 },
  { hour: "14", threats: 2, persons: 5, vehicles: 5 },
  { hour: "16", threats: 1, persons: 7, vehicles: 9 },
  { hour: "18", threats: 3, persons: 4, vehicles: 6 },
  { hour: "20", threats: 2, persons: 3, vehicles: 3 },
  { hour: "22", threats: 4, persons: 3, vehicles: 1 },
];

const cameraData = [
  { name: "CAM-01", threats: 3, detections: 18 },
  { name: "CAM-02", threats: 1, detections: 11 },
  { name: "CAM-03", threats: 0, detections: 22 },
  { name: "CAM-04", threats: 2, detections: 9 },
  { name: "CAM-05", threats: 1, detections: 7 },
];

const riskData = [
  { name: "CRITICAL", value: 1, color: "#ef4444" },
  { name: "HIGH", value: 3, color: "#f97316" },
  { name: "MEDIUM", value: 2, color: "#f59e0b" },
  { name: "LOW", value: 1, color: "#22c55e" },
];

const TOOLTIP_STYLE = { background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 4, fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: "#475569" };

export default function Analytics() {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="font-mono text-xs text-cyan-700 tracking-widest">IBVAP / ANALYTICS</div>
          <h1 className="font-display font-bold text-2xl text-slate-900 tracking-wide">Threat Intelligence & Analytics</h1>
        </div>
        <Link to="/reports" className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-medium rounded transition-colors flex items-center gap-2 font-mono">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          VIEW REPORTS
        </Link>
      </div>

      {/* Stat tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "TOTAL DETECTIONS TODAY", value: "67", color: "#22d3ee" },
          { label: "INTRUSION EVENTS", value: "7", color: "#ef4444" },
          { label: "PERSON DETECTIONS", value: "45", color: "#06b6d4" },
          { label: "VEHICLE DETECTIONS", value: "22", color: "#a78bfa" },
        ].map(({ label, value, color }) => (
          <div key={label} className="glass-panel p-4">
            <div className="font-mono text-[10px] tracking-widest mb-1 text-slate-500 font-medium">{label}</div>
            <div className="font-display font-bold text-3xl" style={{ color }}>{value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Threat Activity Timeline */}
        <div className="glass-panel p-4">
          <div className="font-mono text-xs text-cyan-600 font-medium mb-4">THREAT ACTIVITY TIMELINE — 24H</div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={hourlyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="threatGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="personGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(34,211,238,0.05)" />
              <XAxis dataKey="hour" tick={{ fill: "#475569", fontSize: 10, fontFamily: "JetBrains Mono" }} tickFormatter={v => `${v}:00`} />
              <YAxis tick={{ fill: "#475569", fontSize: 10, fontFamily: "JetBrains Mono" }} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Area type="monotone" dataKey="threats" stroke="#ef4444" fill="url(#threatGrad)" strokeWidth={1.5} name="Threats" />
              <Area type="monotone" dataKey="persons" stroke="#22d3ee" fill="url(#personGrad)" strokeWidth={1} name="Persons" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Threats by camera */}
        <div className="glass-panel p-4">
          <div className="font-mono text-xs text-cyan-600 font-medium mb-4">THREATS BY CAMERA</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={cameraData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(34,211,238,0.05)" />
              <XAxis dataKey="name" tick={{ fill: "#475569", fontSize: 10, fontFamily: "JetBrains Mono" }} />
              <YAxis tick={{ fill: "#475569", fontSize: 10, fontFamily: "JetBrains Mono" }} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Bar dataKey="threats" fill="#ef4444" opacity={0.8} name="Threats" />
              <Bar dataKey="detections" fill="#22d3ee" opacity={0.4} name="Detections" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Risk distribution */}
        <div className="glass-panel p-4">
          <div className="font-mono text-xs text-cyan-600 font-medium mb-4">RISK DISTRIBUTION</div>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="50%" height={180}>
              <PieChart>
                <Pie data={riskData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" strokeWidth={0}>
                  {riskData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} fillOpacity={0.8} />
                  ))}
                </Pie>
                <Tooltip contentStyle={TOOLTIP_STYLE} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {riskData.map(r => (
                <div key={r.name} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: r.color }} />
                  <div className="font-mono text-xs text-slate-500">{r.name}</div>
                  <div className="font-mono text-xs font-bold" style={{ color: r.color }}>{r.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sector threat table */}
        <div className="glass-panel p-4">
          <div className="font-mono text-xs text-cyan-600 font-medium mb-4">SECTOR THREAT SUMMARY</div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                {["Sector", "Cameras", "Alerts", "Incidents", "Risk"].map(h => (
                  <th key={h} className="pb-2 text-left font-mono text-[10px] text-cyan-700">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {[
                { sector: "A-04", cameras: 1, alerts: 3, incidents: 1, risk: "CRITICAL" },
                { sector: "B-02", cameras: 1, alerts: 1, incidents: 1, risk: "MEDIUM" },
                { sector: "C-07", cameras: 1, alerts: 0, incidents: 0, risk: "LOW" },
                { sector: "D-03", cameras: 1, alerts: 2, incidents: 1, risk: "HIGH" },
                { sector: "E-01", cameras: 1, alerts: 1, incidents: 0, risk: "MEDIUM" },
              ].map(row => (
                <tr key={row.sector} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2 font-mono text-xs text-slate-700 font-medium">{row.sector}</td>
                  <td className="py-2 font-mono text-xs text-slate-500">{row.cameras}</td>
                  <td className="py-2 font-mono text-xs text-red-500 font-bold">{row.alerts}</td>
                  <td className="py-2 font-mono text-xs text-slate-500">{row.incidents}</td>
                  <td className="py-2">
                    <span className="font-mono text-xs" style={{ color: { CRITICAL: "#ef4444", HIGH: "#f97316", MEDIUM: "#f59e0b", LOW: "#22c55e" }[row.risk] }}>{row.risk}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
