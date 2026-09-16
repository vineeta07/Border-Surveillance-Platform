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

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
}

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: "system",
      content: "IBVAP AI Assistant online. I can help with threat analysis, camera status, and report generation.",
      timestamp: new Date().toISOString()
    }
  ]);

  // PWA Install Prompt Listener
  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallPwa = async () => {
    if (!deferredPrompt) {
      alert("To install this PWA app on your phone, open your browser menu (⋮ or Share) and select 'Add to Home screen' or 'Install App'.");
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setCanInstall(false);
    }
    setDeferredPrompt(null);
  };

  const handleSignOut = async () => {
    await signOut();
    nav("/login");
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMsg = chatInput.trim();
    setChatInput("");
    setChatMessages(prev => [...prev, { role: "user", content: userMsg, timestamp: new Date().toISOString() }]);
    setChatLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/chat/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg })
      });
      const data = await res.json();
      setChatMessages(prev => [...prev, { role: "assistant", content: data.reply || "Error: No response", timestamp: new Date().toISOString() }]);
    } catch {
      setChatMessages(prev => [...prev, { role: "assistant", content: "Error: Could not connect to AI server.", timestamp: new Date().toISOString() }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--color-navy-950)" }}>
      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar (Desktop + Mobile Slide-over Drawer) */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 flex flex-col border-r border-navy-700/50 transition-all duration-300 flex-shrink-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
        style={{ width: collapsed ? 56 : 240, background: "var(--color-navy-900)" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 px-3 py-4 border-b border-navy-700/50 min-h-[56px]">
          <div className="w-7 h-7 border border-cyan-500 flex items-center justify-center flex-shrink-0 rounded" style={{ background: "rgba(16,185,129,0.1)" }}>
            <span className="text-cyan-600 font-mono text-xs font-bold">IB</span>
          </div>
          {(!collapsed || mobileMenuOpen) && (
            <div>
              <div className="text-cyan-600 font-display font-bold text-sm tracking-widest leading-none">Praman Drishti</div>
              <div className="text-slate-500 font-mono text-[9px] tracking-wider">BORDER SURVEILLANCE</div>
            </div>
          )}
          {/* Mobile close button / Desktop collapse button */}
          <button
            onClick={() => {
              if (window.innerWidth < 768) {
                setMobileMenuOpen(false);
              } else {
                setCollapsed(c => !c);
              }
            }}
            className="ml-auto text-slate-400 hover:text-cyan-600 transition-colors text-xs p-1"
          >
            {window.innerWidth < 768 ? "✕" : (collapsed ? "▶" : "◀")}
          </button>
        </div>

        {/* Nav list */}
        <nav className="flex-1 overflow-y-auto py-2 flex flex-col">
          {NAV_ITEMS.map(({ path, label, icon, exact }) => (
            <NavLink
              key={path}
              to={path}
              end={exact}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2.5 mx-1 my-0.5 rounded text-xs font-mono transition-all ${
                  isActive
                    ? "text-cyan-600 font-bold border-l-2 border-cyan-500 bg-emerald-500/10"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-100 border-l-2 border-transparent"
                }`
              }
              title={collapsed ? label : undefined}
            >
              <span className="text-sm flex-shrink-0">{icon}</span>
              {(!collapsed || mobileMenuOpen) && <span className="truncate tracking-wider">{label}</span>}
            </NavLink>
          ))}

          {/* PWA Install Button inside menu */}
          <div className="px-2 pt-2">
            <button
              onClick={handleInstallPwa}
              className="w-full flex items-center gap-2 px-2.5 py-2 rounded text-xs font-mono font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-sm"
              title="Install App as PWA on Phone"
            >
              <span className="text-sm">📱</span>
              {(!collapsed || mobileMenuOpen) && <span className="truncate tracking-wider">INSTALL PWA APP</span>}
            </button>
          </div>

          <div className="mt-auto px-1 pt-4 pb-2 border-t border-navy-700/30">
            <button
              onClick={() => {
                setChatOpen(!chatOpen);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-sm text-xs font-mono transition-all ${chatOpen ? "text-emerald-400 bg-emerald-900/20" : "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"}`}
              title={collapsed ? "AI Chat" : undefined}
            >
              <span className="text-sm flex-shrink-0">💬</span>
              {(!collapsed || mobileMenuOpen) && <span className="truncate tracking-wider font-bold">IBVAP AI CHAT</span>}
            </button>
          </div>
        </nav>

        {/* User profile */}
        <div className="border-t border-navy-700/50 p-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full border border-cyan-500 flex items-center justify-center flex-shrink-0 text-xs font-mono text-cyan-600" style={{ background: "rgba(16,185,129,0.1)" }}>
              {user?.full_name?.[0] || user?.email?.[0]?.toUpperCase() || "O"}
            </div>
            {(!collapsed || mobileMenuOpen) && (
              <div className="flex-1 min-w-0">
                <div className="text-slate-700 text-xs truncate font-medium">{user?.full_name || user?.email}</div>
                <div className="flex items-center gap-1">
                  <span className="text-cyan-600 font-mono text-[10px]">{user?.role}</span>
                  {isDemo && <span className="text-amber-600 font-mono text-[9px]">DEMO</span>}
                </div>
              </div>
            )}
            {(!collapsed || mobileMenuOpen) && (
              <button onClick={handleSignOut} className="text-slate-400 hover:text-red-500 transition-colors text-xs font-mono" title="Sign Out">
                ⏻
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col overflow-hidden pb-14 md:pb-0">
        {/* Top bar */}
        <header className="flex items-center justify-between px-3 md:px-4 border-b border-navy-700/50 flex-shrink-0" style={{ height: 56, background: "var(--color-navy-900)" }}>
          <div className="flex items-center gap-2 md:gap-3">
            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-1.5 text-slate-700 hover:text-emerald-600 rounded border border-slate-200"
              aria-label="Open Navigation Menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse-cyan" />
              <span className="font-mono text-xs text-green-600 font-semibold">ONLINE</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-slate-300" />
            <div className="hidden sm:block font-mono text-xs text-slate-500 truncate">SIH26187 | Team Drishti</div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {/* PWA Install Button in Header */}
            <button
              onClick={handleInstallPwa}
              className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-mono font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded transition-all shadow-sm"
              title="Install App"
            >
              <span>📱</span>
              <span className="hidden sm:inline">INSTALL APP</span>
            </button>

            {isDemo && (
              <div className="px-2 py-0.5 border border-red-500 font-mono text-xs text-red-500 animate-pulse-cyan rounded" style={{ background: "rgba(239,68,68,0.15)" }}>
                DEMO
              </div>
            )}
            <div className="hidden xs:block">
              <SystemClock />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto relative flex" style={{ background: "var(--color-navy-950)" }}>
          <div className="flex-1 overflow-y-auto relative z-0">
            <Outlet />
          </div>

          {/* Slide-out AI Chat Panel */}
          {chatOpen && (
            <div className="w-80 border-l border-slate-200 flex flex-col bg-white z-10 animate-slide-in shadow-xl">
              <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-white">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-slate-900 font-bold tracking-wider">
                    AI ASSISTANT
                  </span>
                </div>
                <button onClick={() => setChatOpen(false)} className="text-slate-400 hover:text-slate-600 text-xs font-mono">
                  ✕
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[9px] font-mono text-black font-bold">{msg.role === "user" ? "OPERATOR" : "IBVAP AI"}</span>
                      <span className="text-[9px] font-mono text-black">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div 
                      className={`p-2.5 rounded text-xs font-mono max-w-[90%] whitespace-pre-wrap leading-relaxed ${
                        msg.role === "user" 
                          ? "bg-black text-white border border-black" 
                          : msg.role === "system"
                            ? "bg-white text-black border border-black text-[10px]"
                            : "bg-white text-black border border-black shadow-sm"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex flex-col items-start">
                     <div className="p-2.5 rounded bg-white text-black border border-black text-xs font-mono animate-pulse">
                       Processing query...
                     </div>
                  </div>
                )}
              </div>

              <div className="p-3 border-t border-slate-200 bg-white">
                <form onSubmit={handleSendMessage} className="relative">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask AI Assistant..."
                    className="w-full bg-white border border-black rounded pl-3 pr-10 py-2 text-xs font-mono text-black focus:outline-none focus:ring-1 focus:ring-black"
                  />
                  <button 
                    type="submit" 
                    disabled={chatLoading || !chatInput.trim()}
                    className="absolute right-2 top-1.5 p-1 text-black hover:text-gray-600 disabled:opacity-50"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>

        {/* Mobile Quick Bottom Navigation Bar */}
        <nav className="fixed bottom-0 inset-x-0 z-30 flex md:hidden items-center justify-around bg-slate-900/95 backdrop-blur border-t border-slate-800 py-1.5 px-2">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 text-[10px] font-mono ${isActive ? "text-emerald-400 font-bold" : "text-slate-400"}`
            }
          >
            <span className="text-base">⬡</span>
            <span>Command</span>
          </NavLink>
          <NavLink
            to="/surveillance"
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 text-[10px] font-mono ${isActive ? "text-emerald-400 font-bold" : "text-slate-400"}`
            }
          >
            <span className="text-base">◉</span>
            <span>Live Feed</span>
          </NavLink>
          <NavLink
            to="/video-analysis"
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 text-[10px] font-mono ${isActive ? "text-emerald-400 font-bold" : "text-slate-400"}`
            }
          >
            <span className="text-base">🔍</span>
            <span>Analysis</span>
          </NavLink>
          <NavLink
            to="/evidence"
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 text-[10px] font-mono ${isActive ? "text-emerald-400 font-bold" : "text-slate-400"}`
            }
          >
            <span className="text-base">🔒</span>
            <span>Vault</span>
          </NavLink>
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="flex flex-col items-center gap-0.5 text-[10px] font-mono text-slate-400"
          >
            <span className="text-base">☰</span>
            <span>More</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
