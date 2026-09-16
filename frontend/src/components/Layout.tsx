import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const NAV_ITEMS = [
  { path: "/", label: "Command Center", icon: "⬡", exact: true },
  { path: "/surveillance", label: "Live Surveillance", icon: "◉" },
  { path: "/map", label: "Border Map", icon: "⊕" },
  { path: "/video-analysis", label: "Video Analysis", icon: "🔍" },
  { path: "/incidents", label: "Incidents", icon: "⚠" },
  { path: "/analytics", label: "Analytics", icon: "◧" },
  { path: "/evidence", label: "Evidence Vault", icon: "🔒" },
  { path: "/zones", label: "Virtual Zones", icon: "⬟" },
  { path: "/reports", label: "Analysis Reports", icon: "📄" },
  { path: "/settings", label: "Settings", icon: "⊙" },
];

function SystemClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
  const t = window.setInterval(() => {
    setTime(new Date());
  }, 1000);

  return () => {
    window.clearInterval(t);
  };
}, []);
  return (
    <div className="text-right">
      <div className="font-mono text-cyan-600 text-sm font-bold">{time.toTimeString().slice(0, 8)}</div>
      <div className="font-mono text-slate-500 text-xs">{time.toDateString()}</div>
    </div>
  );
}

export default function Layout() {
  const { user, signOut, isDemo } = useAuth();
  const nav = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    nav("/login");
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--color-navy-950)" }}>
      {/* Sidebar */}
      <aside
        className="flex flex-col border-r border-navy-700/50 transition-all duration-300 flex-shrink-0"
        style={{ width: collapsed ? 56 : 220, background: "var(--color-navy-900)" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 px-3 py-4 border-b border-navy-700/50 min-h-[56px]">
          <div className="w-7 h-7 border border-cyan-500 flex items-center justify-center flex-shrink-0" style={{ background: "rgba(16,185,129,0.1)" }}>
            <span className="text-cyan-600 font-mono text-xs font-bold">IB</span>
          </div>
          {!collapsed && (
            <div>
              <div className="text-cyan-600 font-display font-bold text-sm tracking-widest leading-none">CCTView</div>
              <div className="text-slate-500 font-mono text-[9px] tracking-wider">BORDER SURVEILLANCE</div>
            </div>
          )}
          <button onClick={() => setCollapsed(c => !c)} className="ml-auto text-slate-400 hover:text-cyan-600 transition-colors text-xs">
            {collapsed ? "▶" : "◀"}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-2">
          {NAV_ITEMS.map(({ path, label, icon, exact }) => (
            <NavLink
              key={path}
              to={path}
              end={exact}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 mx-1 my-0.5 rounded-sm text-xs font-mono transition-all ${
                  isActive
                    ? "text-cyan-600 border-l-2 border-cyan-500"
                    : "text-slate-500 hover:text-slate-700 border-l-2 border-transparent"
                }`
              }
              style={({ isActive }) => isActive ? { background: "rgba(16,185,129,0.07)" } : {}}
              title={collapsed ? label : undefined}
            >
              <span className="text-sm flex-shrink-0">{icon}</span>
              {!collapsed && <span className="truncate tracking-wider">{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="border-t border-navy-700/50 p-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full border border-cyan-500 flex items-center justify-center flex-shrink-0 text-xs font-mono text-cyan-600" style={{ background: "rgba(16,185,129,0.1)" }}>
              {user?.full_name?.[0] || user?.email?.[0]?.toUpperCase() || "O"}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <div className="text-slate-700 text-xs truncate font-medium">{user?.full_name || user?.email}</div>
                <div className="flex items-center gap-1">
                  <span className="text-cyan-600 font-mono text-[10px]">{user?.role}</span>
                  {isDemo && <span className="text-amber-600 font-mono text-[9px]">DEMO</span>}
                </div>
              </div>
            )}
            {!collapsed && (
              <button onClick={handleSignOut} className="text-slate-400 hover:text-red-500 transition-colors text-xs font-mono" title="Sign Out">
                ⏻
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between px-4 border-b border-navy-700/50 flex-shrink-0" style={{ height: 56, background: "var(--color-navy-900)" }}>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse-cyan" />
              <span className="font-mono text-xs text-green-600 font-semibold">SYSTEM ONLINE</span>
            </div>
            <div className="w-px h-4 bg-slate-300" />
            <div className="font-mono text-xs text-slate-500">SIH26187 | Team Drishti</div>
          </div>

          <div className="flex items-center gap-4">
            {isDemo && (
              <div className="px-2 py-0.5 border border-amber-700 font-mono text-xs text-amber-400 animate-pulse-cyan" style={{ background: "rgba(245,158,11,0.08)" }}>
                ● DEMO MODE
              </div>
            )}
            <SystemClock />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto" style={{ background: "var(--color-navy-950)" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
