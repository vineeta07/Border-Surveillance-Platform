import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function AuthLayout({ children }: Props) {
  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* LEFT — military-grade border surveillance visual */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-10" style={{ background: "linear-gradient(135deg, #1e3a2f 0%, #2d4a3e 50%, #1b2e25 100%)" }}>
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0z' fill='none' stroke='%23ffffff' stroke-width='0.5'/%3E%3C/svg%3E\")" }} />

        {/* Topographic contour lines */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.07]">
          <svg viewBox="0 0 400 300" className="w-full h-full" fill="none">
            <path d="M0,150 Q50,100 100,130 Q150,160 200,120 Q250,80 300,100 Q350,120 400,90" stroke="#fff" strokeWidth="0.8" />
            <path d="M0,180 Q50,140 100,160 Q150,190 200,150 Q250,110 300,130 Q350,150 400,120" stroke="#fff" strokeWidth="0.6" />
            <path d="M0,210 Q50,170 100,190 Q150,220 200,180 Q250,140 300,160 Q350,180 400,150" stroke="#fff" strokeWidth="0.4" />
          </svg>
        </div>

        {/* Surveillance illustration — watchtower and fence scene */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <svg viewBox="0 0 400 300" className="w-4/5 opacity-20" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Horizon */}
            <line x1="0" y1="200" x2="400" y2="200" stroke="#d4d4d4" strokeWidth="0.5" />
            {/* Watch tower */}
            <rect x="170" y="100" width="60" height="100" stroke="#d4d4d4" strokeWidth="0.8" />
            <rect x="155" y="90" width="90" height="20" stroke="#d4d4d4" strokeWidth="0.8" />
            <line x1="200" y1="70" x2="200" y2="90" stroke="#d4d4d4" strokeWidth="0.8" />
            <polygon points="200,55 205,70 195,70" stroke="#d4d4d4" strokeWidth="0.5" fill="#d4d4d4" fillOpacity="0.3" />
            {/* Fence */}
            {[0, 20, 40, 60, 80, 100, 120, 140, 260, 280, 300, 320, 340, 360, 380, 400].map((x, i) => (
              <line key={i} x1={x} y1="185" x2={x} y2="215" stroke="#d4d4d4" strokeWidth="0.5" />
            ))}
            <line x1="0" y1="185" x2="155" y2="185" stroke="#d4d4d4" strokeWidth="0.5" />
            <line x1="245" y1="185" x2="400" y2="185" stroke="#d4d4d4" strokeWidth="0.5" />
            {/* CCTV camera on tower */}
            <rect x="215" y="130" width="15" height="8" rx="2" stroke="#d4d4d4" strokeWidth="0.8" />
            <line x1="230" y1="134" x2="240" y2="134" stroke="#d4d4d4" strokeWidth="0.8" />
            {/* Mountains */}
            <polyline points="0,200 50,155 90,175 130,140 180,180 220,145 270,165 310,135 360,160 400,150 400,200" stroke="#d4d4d4" strokeWidth="0.3" fill="none" />
          </svg>
        </div>

        {/* Scanning line animation */}
        <div className="absolute left-0 right-0 h-px opacity-30 animate-scan" style={{ background: "linear-gradient(90deg, transparent, #34d399, transparent)", top: 0 }} />

        {/* Radar circle with rotating needle */}
        <div className="absolute bottom-20 right-16 w-64 h-64 opacity-15">
          <div className="absolute inset-0 border border-emerald-400 rounded-full" />
          <div className="absolute inset-4 border border-emerald-400 rounded-full" />
          <div className="absolute inset-8 border border-emerald-400 rounded-full" />
          <div className="absolute inset-16 border border-emerald-400 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-32 origin-bottom animate-radar" style={{ background: "linear-gradient(transparent, #34d399)", transformOrigin: "bottom center" }} />
        </div>

        {/* Corner brackets — military HUD feel */}
        <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-emerald-400/50" />
        <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-emerald-400/50" />
        <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-emerald-400/50" />
        <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-emerald-400/50" />

        {/* Content — branding */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 border-2 border-emerald-400/60 rounded flex items-center justify-center bg-emerald-500/10">
              <span className="text-emerald-300 text-sm font-mono font-bold">IB</span>
            </div>
            <div>
              <div className="text-emerald-300 font-bold text-xl tracking-[0.3em]" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>IBVAP</div>
              <div className="text-emerald-200/40 font-mono text-[10px] tracking-wider">INTELLIGENT BORDER VIDEO ANALYTICS PLATFORM</div>
            </div>
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <div>
            <p className="text-emerald-100/70 text-sm leading-relaxed max-w-sm" style={{ fontFamily: "Inter, sans-serif" }}>
              AI-powered surveillance, detection and threat intelligence for intelligent border security operations.
            </p>
          </div>

          <div className="space-y-2.5">
            {["Real-time Object Detection", "Multi-Camera Surveillance Grid", "Threat Scoring & Incident Response", "Hyperledger Blockchain Evidence Chain"].map((item) => (
              <div key={item} className="flex items-center gap-2.5">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                <span className="text-emerald-200/60 text-xs font-mono tracking-wide">{item}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-emerald-900/50 pt-4">
            <div className="text-emerald-200/30 font-mono text-xs space-y-1 tracking-wider">
              <div className="font-bold">Team Drishti</div>
              <div>SMART INDIA HACKATHON 2026</div>
              <div className="text-emerald-400/60">SIH26187</div>
            </div>
          </div>
        </div>

        {/* Status indicators */}
        <div className="absolute top-8 right-8 space-y-1.5">
          {[["SYSTEM", "#34d399"], ["NETWORK", "#34d399"], ["SECURE", "#34d399"]].map(([label, color]) => (
            <div key={label} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: color as string }} />
              <span className="font-mono text-[10px] tracking-wider" style={{ color: color as string }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT — form area */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
