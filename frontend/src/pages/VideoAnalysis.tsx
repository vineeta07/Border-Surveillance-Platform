import { useState, useRef, useCallback, useEffect } from "react";

const API_BASE = "http://localhost:8000";

interface AnalysisResult {
  summary: string;
  duration: number;
  frames_analyzed: number;
  model: string;
}

interface AnomalyResult {
  anomaly_report: string;
  duration: number;
  frames_analyzed: number;
  model: string;
}

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
}

export default function VideoAnalysis() {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [anomalies, setAnomalies] = useState<AnomalyResult | null>(null);
  const [error, setError] = useState("");

  // AI Chat state
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: "system",
      content:
        "AI assistant ready. Upload and analyze a video, then ask questions about the content.",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.type.startsWith("video/")) {
      setFile(dropped);
      setError("");
    } else {
      setError("Please drop a valid video file (MP4, AVI, MOV).");
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      const validTypes = [
        "video/mp4",
        "video/avi",
        "video/quicktime",
        "video/x-msvideo",
      ];
      if (!validTypes.includes(selected.type)) {
        setError("Invalid file type. Use MP4, AVI, or MOV.");
        return;
      }
      if (selected.size > 500 * 1024 * 1024) {
        setError("File too large. Maximum 500 MB.");
        return;
      }
      setFile(selected);
      setError("");
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  const runAnalysis = async () => {
    if (!file) return;
    setAnalyzing(true);
    setProgress(10);
    setError("");
    setAnalysis(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      setProgress(30);
      const res = await fetch(`${API_BASE}/api/upload-video-analysis`, {
        method: "POST",
        body: formData,
      });
      setProgress(80);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setAnalysis(data);
      setProgress(100);
    } catch (err) {
      setError(
        `Analysis failed: ${err instanceof Error ? err.message : "Unknown error"}. Make sure the backend is running on port 8000.`
      );
    } finally {
      setAnalyzing(false);
    }
  };

  const runAnomalyDetection = async () => {
    if (!file) return;
    setAnalyzing(true);
    setProgress(10);
    setError("");
    setAnomalies(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      setProgress(30);
      const res = await fetch(`${API_BASE}/api/upload-video-anomalies`, {
        method: "POST",
        body: formData,
      });
      setProgress(80);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setAnomalies(data);
      setProgress(100);
    } catch (err) {
      setError(
        `Anomaly detection failed: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    } finally {
      setAnalyzing(false);
    }
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg: ChatMessage = {
      role: "user",
      content: chatInput.trim(),
      timestamp: new Date().toISOString(),
    };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setChatLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.content }),
      });
      if (!res.ok) throw new Error(`Chat error: ${res.status}`);
      const data = await res.json();
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.response || data.message || "No response received.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Unable to reach the AI backend. Ensure the Python server is running.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="flex h-full">
      {/* Main content */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="font-mono text-xs text-slate-500 tracking-wider">
              CCTView / Video Analysis
            </div>
            <h1 className="font-display font-bold text-2xl text-slate-900 tracking-wide">
              Video Analysis
            </h1>
          </div>
          <button
            onClick={() => setChatOpen(!chatOpen)}
            className="px-3 py-1.5 font-mono text-xs border transition-colors"
            style={{
              borderColor: chatOpen
                ? "var(--color-cyan-500, #059669)"
                : "#cbd5e1",
              color: chatOpen ? "var(--color-cyan-600, #047857)" : "#64748b",
              background: chatOpen ? "rgba(16,185,129,0.08)" : "transparent",
            }}
          >
            {chatOpen ? "✕ Close Chat" : "💬 AI Chat"}
          </button>
        </div>

        {/* Upload area */}
        <div
          className={`glass-panel p-6 transition-colors cursor-pointer ${dragActive ? "border-blue-500" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          {!file ? (
            <div className="text-center py-8">
              <div className="text-3xl mb-3 text-slate-600">⬆</div>
              <div className="font-mono text-sm text-slate-500 mb-1">
                Drop a video file here or click to browse
              </div>
              <div className="font-mono text-xs text-slate-400">
                Supports MP4, AVI, MOV — max 500 MB
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <div className="font-mono text-sm text-slate-700 font-medium">
                  {file.name}
                </div>
                <div className="font-mono text-xs text-slate-500 mt-0.5">
                  {formatSize(file.size)} · {file.type}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                  setAnalysis(null);
                  setAnomalies(null);
                }}
                className="text-slate-500 hover:text-red-400 font-mono text-xs px-2 py-1 border border-slate-700 hover:border-red-800 transition-colors"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        {error && (
          <div
            className="glass-panel p-3 font-mono text-xs"
            style={{
              borderColor: "rgba(239,68,68,0.4)",
              color: "#ef4444",
            }}
          >
            {error}
          </div>
        )}

        {/* Action buttons */}
        {file && (
          <div className="flex gap-2">
            <button
              onClick={runAnalysis}
              disabled={analyzing}
              className="flex-1 py-2.5 font-mono text-sm tracking-wider transition-all disabled:opacity-40"
              style={{
                background: "var(--color-cyan-500, #059669)",
                color: "#fff",
              }}
            >
              {analyzing && !anomalies
                ? "Analyzing..."
                : "Analyze Video"}
            </button>
            <button
              onClick={runAnomalyDetection}
              disabled={analyzing}
              className="flex-1 py-2.5 font-mono text-sm tracking-wider border transition-all disabled:opacity-40"
              style={{
                borderColor: "rgba(239,68,68,0.4)",
                color: "#ef4444",
                background: "rgba(239,68,68,0.06)",
              }}
            >
              {analyzing && !analysis
                ? "Detecting..."
                : "Detect Anomalies"}
            </button>
          </div>
        )}

        {/* Progress */}
        {analyzing && (
          <div className="glass-panel p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs text-slate-400">
                Processing...
              </span>
              <span className="font-mono text-xs text-slate-500">
                {progress}%
              </span>
            </div>
            <div className="h-1 bg-slate-800 overflow-hidden">
              <div
                className="h-full transition-all duration-500"
                style={{
                  width: `${progress}%`,
                  background: "var(--color-cyan-500, #059669)",
                }}
              />
            </div>
          </div>
        )}

        {/* Analysis results */}
        {analysis && (
          <div className="glass-panel p-4 space-y-3">
            <div className="font-mono text-xs text-slate-500 tracking-wider">
              Analysis Result
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                ["Duration", `${analysis.duration?.toFixed(1) || "—"}s`],
                [
                  "Frames",
                  `${analysis.frames_analyzed || "—"}`,
                ],
                ["Model", analysis.model || "VILA"],
              ].map(([k, v]) => (
                <div key={k} className="glass-panel-dark p-2">
                  <div className="font-mono text-[10px] text-slate-500">
                    {k}
                  </div>
                  <div className="font-mono text-sm text-slate-700 font-medium">{v}</div>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-200 pt-3">
              <div className="font-mono text-xs text-slate-500 mb-2">
                Summary
              </div>
              <div className="font-mono text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                {analysis.summary}
              </div>
            </div>
          </div>
        )}

        {/* Anomaly results */}
        {anomalies && (
          <div
            className="glass-panel p-4 space-y-3"
            style={{ borderColor: "rgba(239,68,68,0.3)" }}
          >
            <div className="font-mono text-xs text-red-400 tracking-wider">
              Anomaly Detection Report
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                ["Duration", `${anomalies.duration?.toFixed(1) || "—"}s`],
                [
                  "Frames",
                  `${anomalies.frames_analyzed || "—"}`,
                ],
                ["Model", anomalies.model || "VILA"],
              ].map(([k, v]) => (
                <div key={k} className="glass-panel-dark p-2">
                  <div className="font-mono text-[10px] text-slate-500">
                    {k}
                  </div>
                  <div className="font-mono text-sm text-slate-700 font-medium">{v}</div>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-200 pt-3">
              <div className="font-mono text-xs text-slate-500 mb-2">
                Anomaly Report
              </div>
              <div className="font-mono text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                {anomalies.anomaly_report}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AI Chat side panel */}
      {chatOpen && (
        <div
          className="w-96 flex flex-col border-l animate-slide-in"
          style={{
            borderColor: "#e2e8f0",
            background: "#ffffff",
          }}
        >
          <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
            <span className="font-mono text-xs text-slate-500 tracking-wider">
              AI Chat
            </span>
            <button
              onClick={() => setChatOpen(false)}
              className="text-slate-400 hover:text-slate-600 text-xs"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`${msg.role === "user" ? "ml-8" : "mr-4"}`}
              >
                <div
                  className="p-2.5 font-mono text-xs leading-relaxed"
                  style={{
                    background:
                      msg.role === "user"
                        ? "rgba(16,185,129,0.1)"
                        : "#f8fafc",
                    border: `1px solid ${msg.role === "user" ? "rgba(16,185,129,0.3)" : "#e2e8f0"}`,
                    color:
                      msg.role === "user" ? "#047857" : "#1e293b",
                  }}
                >
                  {msg.content}
                </div>
                <div className="font-mono text-[9px] text-slate-700 mt-0.5 px-1">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="mr-4 p-2.5 glass-panel-dark font-mono text-xs text-slate-500 animate-pulse">
                Thinking...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-3 border-t border-slate-200">
            <div className="flex gap-2">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendChatMessage()}
                placeholder="Ask about the video..."
                className="flex-1 px-3 py-2 font-mono text-xs text-slate-800 border border-slate-300 focus:border-cyan-500 outline-none rounded bg-slate-50"
              />
              <button
                onClick={sendChatMessage}
                disabled={chatLoading || !chatInput.trim()}
                className="px-3 py-2 font-mono text-xs disabled:opacity-40 transition-colors rounded"
                style={{
                  background: "var(--color-cyan-500, #059669)",
                  color: "#fff",
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
