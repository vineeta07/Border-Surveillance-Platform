import { useState } from "react";
import { DEMO_EVIDENCE } from "../services/demoData";
import type { Evidence } from "../types";

const RISK_COLORS: Record<string, string> = { CRITICAL: "#ef4444", HIGH: "#f97316", MEDIUM: "#f59e0b", LOW: "#22c55e" };
const STATUS_COLORS: Record<string, string> = { VERIFIED: "#22c55e", PENDING: "#f59e0b", FLAGGED: "#ef4444" };

const CHAIN_GATEWAY = "http://localhost:3001";

export default function EvidenceVault() {
  const [evidence] = useState<Evidence[]>(DEMO_EVIDENCE);
  const [filterRisk, setFilterRisk] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [verifyModal, setVerifyModal] = useState<Evidence | null>(null);
  const [verifyState, setVerifyState] = useState<"idle" | "loading" | "success" | "error" | "anchoring">("idle");
  const [verifyResult, setVerifyResult] = useState<any>(null);

  const filtered = evidence.filter(e =>
    (filterRisk === "ALL" || e.risk_level === filterRisk) &&
    (filterStatus === "ALL" || e.operator_status === filterStatus)
  );

  const downloadMetadata = (ev: Evidence) => {
    const data = JSON.stringify({ ...ev, image_url: undefined, video_url: undefined }, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${ev.evidence_id}-metadata.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const anchorEvidence = async (ev: Evidence) => {
    setVerifyState("anchoring");
    try {
      const res = await fetch(`${CHAIN_GATEWAY}/anchor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: ev.evidence_id,
          hash: ev.hash,
          timestamp: ev.timestamp,
          cameraId: ev.camera_id,
        }),
      });
      const data = await res.json();
      setVerifyResult(data);
      setVerifyState("success");
    } catch {
      setVerifyResult({ error: "Chain-Gateway offline. Start with: cd chain-gateway && npm start" });
      setVerifyState("error");
    }
  };

  const verifyEvidence = async (ev: Evidence) => {
    setVerifyModal(ev);
    setVerifyState("loading");
    setVerifyResult(null);
    try {
      const res = await fetch(`${CHAIN_GATEWAY}/verify/${ev.evidence_id}`);
      if (res.ok) {
        const data = await res.json();
        const match = data.hash === ev.hash;
        setVerifyResult({ ...data, hashMatch: match });
        setVerifyState("success");
      } else {
        // Not on ledger yet — offer to anchor
        setVerifyResult({ notAnchored: true });
        setVerifyState("idle");
      }
    } catch {
      setVerifyResult({ error: "Chain-Gateway offline. Start with: cd chain-gateway && npm start" });
      setVerifyState("error");
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="font-mono text-xs text-cyan-700 tracking-widest">IBVAP / EVIDENCE</div>
          <h1 className="font-display font-bold text-2xl text-slate-900 tracking-wide">Evidence Vault</h1>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"].map(r => (
            <button key={r} onClick={() => setFilterRisk(r)} className={`px-2 py-0.5 font-mono text-xs border rounded transition-colors ${filterRisk === r ? "border-emerald-500 text-emerald-600 bg-emerald-50" : "border-slate-300 text-slate-500 hover:border-slate-400"}`}>
              {r}
            </button>
          ))}
          <div className="w-px h-4 bg-slate-300" />
          {["ALL", "VERIFIED", "PENDING", "FLAGGED"].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)} className={`px-2 py-0.5 font-mono text-xs border rounded transition-colors ${filterStatus === s ? "border-emerald-500 text-emerald-600 bg-emerald-50" : "border-slate-300 text-slate-500 hover:border-slate-400"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {filtered.map(ev => (
          <div key={ev.id} className="glass-panel p-3 space-y-3">
            {/* Evidence image placeholder */}
            <div className="relative h-32 overflow-hidden rounded bg-slate-100">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="font-mono text-xs text-cyan-600">{ev.evidence_id}</div>
                  <div className="font-mono text-[10px] text-slate-400 mt-1">EVIDENCE FRAME</div>
                </div>
              </div>
              {/* Corner brackets */}
              <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t border-l border-slate-400" />
              <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t border-r border-slate-400" />
              <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b border-l border-slate-400" />
              <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b border-r border-slate-400" />
              <div className="absolute top-1 right-1 px-1.5 py-0.5 font-mono text-[9px] rounded" style={{ background: `${RISK_COLORS[ev.risk_level || "LOW"]}20`, color: RISK_COLORS[ev.risk_level || "LOW"], border: `1px solid ${RISK_COLORS[ev.risk_level || "LOW"]}40` }}>
                {ev.risk_level}
              </div>
            </div>

            {/* Details */}
            <div className="space-y-1 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">Evidence ID</span>
                <span className="text-cyan-600 font-medium">{ev.evidence_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Incident</span>
                <span className="text-slate-700 font-medium">{ev.incident_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Camera</span>
                <span className="text-slate-700 font-medium">{ev.camera_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Confidence</span>
                <span className="text-slate-700">{ev.confidence}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Threat Score</span>
                <span style={{ color: RISK_COLORS[ev.risk_level || "LOW"] }} className="font-bold">{ev.threat_score}/100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status</span>
                <span style={{ color: STATUS_COLORS[ev.operator_status] }} className="font-bold">{ev.operator_status}</span>
              </div>
            </div>

            {/* Hash */}
            <div className="border-t border-slate-200 pt-2">
              <div className="font-mono text-[9px] text-slate-400 break-all">{ev.hash}</div>
            </div>

            {/* Actions */}
            <div className="flex gap-1.5 flex-wrap">
              <button onClick={() => verifyEvidence(ev)} className="flex-1 py-1 font-mono text-[10px] text-emerald-600 border border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50 rounded transition-colors font-bold whitespace-nowrap px-1">⛓ VERIFY</button>
              <button onClick={() => {
                window.location.href = `http://127.0.0.1:3000/api/reports/download/${ev.evidence_id}`;
              }} className="flex-1 py-1 font-mono text-[10px] text-slate-500 border border-slate-300 hover:border-slate-400 rounded transition-colors whitespace-nowrap px-1">REPORT</button>
              <button onClick={() => downloadMetadata(ev)} className="flex-1 py-1 font-mono text-[10px] text-slate-500 border border-slate-300 hover:border-slate-400 rounded transition-colors whitespace-nowrap px-1">JSON</button>
            </div>
          </div>
        ))}
      </div>

      {/* Blockchain Verify Modal */}
      {verifyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={() => { setVerifyModal(null); setVerifyState("idle"); }}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-5 space-y-4 animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-mono text-xs text-emerald-700 tracking-widest font-bold">BLOCKCHAIN VERIFICATION</div>
                <div className="font-mono text-sm text-slate-800 font-bold mt-1">{verifyModal.evidence_id}</div>
              </div>
              <button onClick={() => { setVerifyModal(null); setVerifyState("idle"); }} className="text-slate-400 hover:text-slate-600 text-lg">✕</button>
            </div>

            <div className="border-t border-slate-200 pt-3">
              <div className="font-mono text-[10px] text-slate-500 mb-1">LOCAL HASH</div>
              <div className="font-mono text-[10px] text-slate-700 break-all bg-slate-50 p-2 rounded border border-slate-200">{verifyModal.hash}</div>
            </div>

            {verifyState === "loading" && (
              <div className="text-center py-4">
                <div className="font-mono text-xs text-emerald-600 animate-pulse font-bold">QUERYING HYPERLEDGER FABRIC...</div>
                <div className="font-mono text-[10px] text-slate-400 mt-1">Connecting to chain-gateway → peer0.org1.example.com</div>
              </div>
            )}

            {verifyState === "anchoring" && (
              <div className="text-center py-4">
                <div className="font-mono text-xs text-amber-600 animate-pulse font-bold">ANCHORING TO LEDGER...</div>
                <div className="font-mono text-[10px] text-slate-400 mt-1">Submitting transaction to orderer...</div>
              </div>
            )}

            {verifyState === "success" && verifyResult && !verifyResult.notAnchored && (
              <div className="space-y-3">
                {verifyResult.hashMatch !== undefined ? (
                  <div className={`p-3 rounded border ${verifyResult.hashMatch ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"}`}>
                    <div className={`font-mono text-sm font-bold ${verifyResult.hashMatch ? "text-emerald-700" : "text-red-700"}`}>
                      {verifyResult.hashMatch ? "✓ HASH VERIFIED — INTEGRITY INTACT" : "✗ HASH MISMATCH — EVIDENCE TAMPERED"}
                    </div>
                    <div className="font-mono text-[10px] text-slate-500 mt-1">
                      Ledger hash: {verifyResult.hash?.slice(0, 20)}...
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded border bg-emerald-50 border-emerald-200">
                    <div className="font-mono text-sm font-bold text-emerald-700">✓ ANCHORED TO LEDGER</div>
                    <div className="font-mono text-[10px] text-slate-500 mt-1">TX: {verifyResult.transactionId}</div>
                  </div>
                )}
                <div className="font-mono text-[10px] text-slate-500">
                  <div>Camera: {verifyResult.cameraId}</div>
                  <div>Anchored By: {verifyResult.anchoredBy?.slice(0, 40)}...</div>
                </div>
              </div>
            )}

            {verifyState === "idle" && verifyResult?.notAnchored && (
              <div className="space-y-3">
                <div className="p-3 rounded border bg-amber-50 border-amber-200">
                  <div className="font-mono text-sm font-bold text-amber-700">⚠ NOT YET ON LEDGER</div>
                  <div className="font-mono text-[10px] text-slate-500 mt-1">This evidence has not been anchored to the blockchain yet.</div>
                </div>
                <button
                  onClick={() => anchorEvidence(verifyModal)}
                  className="w-full py-2 font-mono text-xs font-bold text-white rounded transition-all hover:shadow-lg"
                  style={{ background: "#10b981" }}
                >
                  ⛓ ANCHOR TO HYPERLEDGER FABRIC
                </button>
              </div>
            )}

            {verifyState === "error" && (
              <div className="p-3 rounded border bg-red-50 border-red-200">
                <div className="font-mono text-sm font-bold text-red-700">CONNECTION ERROR</div>
                <div className="font-mono text-[10px] text-red-500 mt-1">{verifyResult?.error}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
