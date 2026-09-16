import {
  useRef,
  useState,
  useEffect,
  useCallback,
  type MouseEvent,
} from "react";
import type {
  Camera,
  Detection,
  PTZState,
  FaceAnalysisResult,
} from "../types";
import { DEMO_IDENTITIES } from "../services/demoData";

const RISK_COLORS: Record<string, string> = {
  CRITICAL: "#ef4444",
  HIGH: "#f97316",
  MEDIUM: "#f59e0b",
  LOW: "#22c55e",
  SAFE: "#22c55e",
  WARNING: "#f59e0b",
  RESTRICTED: "#ef4444",
};

interface Props {
  camera?: Camera | null;
  detections?: Detection[];
  showPTZ?: boolean;
  onFullscreen?: () => void;
  compact?: boolean;
  isFullscreen?: boolean;
  onClose?: () => void;
}

interface FaceAnalysisPanelProps {
  trackingId: string;
  onClose: () => void;
}

function FaceAnalysisPanel({
  trackingId,
  onClose,
}: FaceAnalysisPanelProps) {
  const [analyzing, setAnalyzing] = useState(true);
  const [result, setResult] = useState<FaceAnalysisResult | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const isKnown = Math.random() > 0.5;

      const identity = isKnown
        ? DEMO_IDENTITIES[
            Math.floor(Math.random() * DEMO_IDENTITIES.length)
          ]
        : null;

      setResult({
        status: identity ? "AUTHORIZED" : "UNKNOWN",
        tracking_id: trackingId,
        detection_confidence:
          Math.floor(Math.random() * 15) + 82,
        face_match_confidence: identity
          ? identity.confidence
          : undefined,
        identity: identity?.name,
        identity_id: identity?.id,
        risk_level: identity ? "LOW" : "HIGH",
        demo: true,
      });

      setAnalyzing(false);
    }, 2000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [trackingId]);

  return (
    <div
      className="absolute top-2 right-2 w-52 glass-panel p-3 z-20 animate-slide-in"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-xs text-cyan-700 font-bold tracking-wider">
          FACE ANALYSIS
        </span>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onClose();
          }}
          className="text-slate-500 hover:text-white text-xs"
        >
          ✕
        </button>
      </div>

      {analyzing ? (
        <div className="space-y-2">
          <div className="h-1 bg-slate-200 overflow-hidden">
            <div
              className="h-full bg-cyan-500 animate-pulse"
              style={{ width: "60%" }}
            />
          </div>

          <div className="font-mono text-xs text-slate-600 animate-pulse-cyan font-bold">
            ANALYZING...
          </div>
        </div>
      ) : (
        result && (
          <div className="space-y-1.5">
            <div
              className={`font-mono text-sm font-bold ${
                result.status === "AUTHORIZED"
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {result.status === "AUTHORIZED"
                ? "✓ AUTHORIZED"
                : "✗ UNKNOWN PERSON"}
            </div>

            <div className="space-y-1 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">
                  Track ID
                </span>

                <span className="text-slate-700 font-medium">
                  {result.tracking_id}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">
                  Det. Conf.
                </span>

                <span className="text-slate-700 font-medium">
                  {result.detection_confidence}%
                </span>
              </div>

              {result.face_match_confidence !== undefined && (
                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Match Conf.
                  </span>

                  <span className="text-green-600 font-bold">
                    {result.face_match_confidence}%
                  </span>
                </div>
              )}

              {result.identity && (
                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Identity
                  </span>

                  <span className="text-green-600 font-bold">
                    {result.identity}
                  </span>
                </div>
              )}

              {result.identity_id && (
                <div className="flex justify-between">
                  <span className="text-slate-500">
                    ID
                  </span>

                  <span className="text-slate-700 font-medium">
                    {result.identity_id}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-slate-500">
                  Risk
                </span>

                <span
                  style={{
                    color:
                      RISK_COLORS[result.risk_level] ||
                      "#0284c7",
                  }}
                  className="font-bold"
                >
                  {result.risk_level}
                </span>
              </div>
            </div>

            <div className="pt-1 border-t border-slate-200 text-[10px] text-amber-600 font-mono font-bold">
              ⚠ DEMO — Simulated result
            </div>
          </div>
        )
      )}
    </div>
  );
}

const EMPTY_DETECTIONS: Detection[] = [];

export default function SurveillanceVideo({
  camera,
  detections = EMPTY_DETECTIONS,
  showPTZ = false,
  onFullscreen,
  compact = false,
  isFullscreen = false,
  onClose,
}: Props) {
  // Defensive guard moved down below hooks

  const videoRef = useRef<HTMLVideoElement>(null);

  const [ptz, setPTZ] = useState<PTZState>({
    panX: 0,
    panY: 0,
    zoom: 1,
  });

  const [videoError, setVideoError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [facePanel, setFacePanel] =
    useState<string | null>(null);

  const [activeDetections, setActiveDetections] =
    useState<Detection[]>(detections);

  const isThermal =
    camera?.type === "THERMAL CAMERA";

  const isNightVision =
    camera?.type === "NIGHT VISION";

  const hasVideoSource =
    Boolean(camera?.video_source && camera?.video_source.trim());

  /*
   * Keep detection state synchronized with incoming data.
   */
  useEffect(() => {
    setActiveDetections(detections);
  }, [detections]);

  /*
   * Reset component state whenever the camera or video source changes.
   * This prevents stale video errors, loading states, PTZ positions,
   * and face panels from carrying over to another camera.
   */
  useEffect(() => {
    setVideoError(false);
    setLoaded(false);
    setFacePanel(null);

    setPTZ({
      panX: 0,
      panY: 0,
      zoom: 1,
    });
  }, [camera?.id, camera?.video_source]);

  /*
   * IMPORTANT:
   * Release the video resource when this component unmounts
   * or when the source changes.
   *
   * This is especially important when leaving the
   * Live Surveillance page.
   */
  useEffect(() => {
    return () => {
      const video = videoRef.current;

      if (video) {
        video.pause();

        video.removeAttribute("src");

        try {
          video.load();
        } catch {
          // Safe cleanup.
        }
      }
    };
  }, [camera?.video_source]);

  const applyPTZ = useCallback(
    (nextPTZ: PTZState) => {
      const video = videoRef.current;

      if (!video) return;

      video.style.transform =
        `translate(${nextPTZ.panX}px, ${nextPTZ.panY}px) ` +
        `scale(${nextPTZ.zoom})`;

      video.style.transition =
        "transform 0.2s ease";
    },
    []
  );

  const movePTZ = useCallback(
    (dx: number, dy: number) => {
      setPTZ((previous) => {
        const next: PTZState = {
          ...previous,

          panX: Math.max(
            -80,
            Math.min(
              80,
              previous.panX + dx
            )
          ),

          panY: Math.max(
            -60,
            Math.min(
              60,
              previous.panY + dy
            )
          ),
        };

        applyPTZ(next);

        return next;
      });
    },
    [applyPTZ]
  );

  const zoomPTZ = useCallback(
    (delta: number) => {
      setPTZ((previous) => {
        const next: PTZState = {
          ...previous,

          zoom: Math.max(
            1,
            Math.min(
              3,
              previous.zoom + delta
            )
          ),
        };

        applyPTZ(next);

        return next;
      });
    },
    [applyPTZ]
  );

  const resetPTZ = useCallback(() => {
    const next: PTZState = {
      panX: 0,
      panY: 0,
      zoom: 1,
    };

    setPTZ(next);
    applyPTZ(next);
  }, [applyPTZ]);

  /*
   * Handles missing/broken video files safely.
   *
   * After a video error:
   * - stop playback
   * - release the source
   * - mark the video as failed
   * - React removes the video element
   * - simulated feed is shown
   */
  const handleVideoError = useCallback(() => {
    const video = videoRef.current;

    if (video) {
      video.pause();

      video.removeAttribute("src");

      try {
        video.load();
      } catch {
        // Safe fallback.
      }
    }

    setLoaded(false);
    setVideoError(true);
  }, []);

  const filterStyle = isThermal
    ? "sepia(1) saturate(3) hue-rotate(320deg) brightness(0.8)"
    : isNightVision
    ? "grayscale(1) brightness(1.3) contrast(1.2)"
    : undefined;

  const simulatedBackground = isThermal
    ? "linear-gradient(135deg, #1a0a00 0%, #3d1800 40%, #6b2800 70%, #1a0000 100%)"
    : isNightVision
    ? "linear-gradient(135deg, #000 0%, #0a1200 50%, #040d00 100%)"
    : "linear-gradient(135deg, #020817 0%, #0a1628 100%)";

  if (!camera) {
    return (
      <div className="w-full min-h-[220px] flex items-center justify-center bg-slate-950 border border-slate-800">
        <span className="font-mono text-xs text-slate-500">CAMERA DATA UNAVAILABLE</span>
      </div>
    );
  }

  return (
    <div
      className={`relative flex flex-col overflow-hidden ${
        isFullscreen
          ? "fixed inset-0 z-50"
          : ""
      }`}
      style={{
        background: "#000",

        ...(isFullscreen
          ? {}
          : {
              aspectRatio: compact
                ? "16/9"
                : "16/9",
            }),
      }}
    >
      <div className="relative flex-1 overflow-hidden">
        {camera.status === "OFFLINE" ? (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-2"
            style={{
              background: "#0a0a0a",
            }}
          >
            <div className="w-8 h-8 border border-slate-700 flex items-center justify-center">
              <span className="text-slate-600 text-sm">
                ◎
              </span>
            </div>

            <div className="font-mono text-xs text-slate-600">
              CAMERA OFFLINE
            </div>

            <div className="font-mono text-[10px] text-slate-700">
              {camera.camera_id}
            </div>
          </div>
        ) : (
          <>
            {!videoError && hasVideoSource ? (
              <video
                ref={videoRef}
                src={camera.video_source}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                onLoadedData={() => {
                  setLoaded(true);
                }}
                onError={handleVideoError}
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  filter: filterStyle,
                }}
              />
            ) : (
              <div
                className="absolute inset-0"
                style={{
                  background:
                    simulatedBackground,
                }}
              >
                {/* Lightweight simulated scan lines */}
                <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
                  {Array.from({
                    length: 4,
                  }).map((_, index) => (
                    <div
                      key={index}
                      className="absolute w-full h-px"
                      style={{
                        top:
                          `${index * 25}%`,

                        background:
                          isThermal
                            ? "rgba(255,80,0,0.3)"
                            : "rgba(34,211,238,0.2)",

                        animation:
                          `scan-line ${
                            3 + index * 0.4
                          }s linear infinite`,

                        animationDelay:
                          `${index * 0.5}s`,
                      }}
                    />
                  ))}
                </div>

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center space-y-1">
                    <div
                      className="font-mono text-xs"
                      style={{
                        color: isThermal
                          ? "#f97316"
                          : isNightVision
                          ? "#4ade80"
                          : "#22d3ee",
                      }}
                    >
                      {isThermal
                        ? "🌡 THERMAL MODE"
                        : isNightVision
                        ? "◑ NIGHT VISION MODE"
                        : "DEMO FEED"}
                    </div>

                    <div className="font-mono text-[10px] text-slate-600">
                      SIMULATED LIVE FEED
                    </div>
                  </div>
                </div>

                {isThermal && (
                  <div
                    className="absolute pointer-events-none"
                    style={{
                      top: "30%",
                      left: "25%",
                      width: "15%",
                      paddingBottom: "20%",
                    }}
                  >
                    <div className="w-full h-full relative">
                      <div
                        className="absolute inset-0 border-2 border-orange-400 animate-pulse-red"
                        style={{
                          boxShadow:
                            "0 0 15px rgba(249,115,22,0.5)",
                        }}
                      />

                      <div className="absolute -top-4 left-0 font-mono text-[9px] text-orange-400 whitespace-nowrap">
                        HUMAN HEAT SIG.
                      </div>

                      <div className="absolute -bottom-4 left-0 font-mono text-[9px] text-orange-300 whitespace-nowrap">
                        T-001 | 96%
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Loading overlay */}
            {!loaded &&
              hasVideoSource &&
              !videoError && (
                <div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  style={{
                    background:
                      "rgba(2,8,23,0.8)",
                  }}
                >
                  <div className="font-mono text-xs text-cyan-400 animate-pulse-cyan">
                    CONNECTING...
                  </div>
                </div>
              )}

            {/* Detection overlays */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              {activeDetections.map(
                (det, index) => {
                  const {
                    x,
                    y,
                    width,
                    height,
                  } = det.bounding_box;

                  const color =
                    RISK_COLORS[
                      det.risk_level
                    ] || "#22d3ee";

                  return (
                    <g
                      key={
                        det.id ||
                        `${det.tracking_id}-${index}`
                      }
                    >
                      <rect
                        x={x}
                        y={y}
                        width={width}
                        height={height}
                        fill="none"
                        stroke={color}
                        strokeWidth="0.3"
                        opacity="0.9"
                      />

                      {/* Corner marks */}
                      <line
                        x1={x}
                        y1={y}
                        x2={x + 2}
                        y2={y}
                        stroke={color}
                        strokeWidth="0.5"
                      />

                      <line
                        x1={x}
                        y1={y}
                        x2={x}
                        y2={y + 2}
                        stroke={color}
                        strokeWidth="0.5"
                      />

                      <line
                        x1={x + width - 2}
                        y1={y}
                        x2={x + width}
                        y2={y}
                        stroke={color}
                        strokeWidth="0.5"
                      />

                      <line
                        x1={x + width}
                        y1={y}
                        x2={x + width}
                        y2={y + 2}
                        stroke={color}
                        strokeWidth="0.5"
                      />

                      <line
                        x1={x}
                        y1={y + height - 2}
                        x2={x}
                        y2={y + height}
                        stroke={color}
                        strokeWidth="0.5"
                      />

                      <line
                        x1={x}
                        y1={y + height}
                        x2={x + 2}
                        y2={y + height}
                        stroke={color}
                        strokeWidth="0.5"
                      />

                      <line
                        x1={x + width - 2}
                        y1={y + height}
                        x2={x + width}
                        y2={y + height}
                        stroke={color}
                        strokeWidth="0.5"
                      />

                      <line
                        x1={x + width}
                        y1={y + height - 2}
                        x2={x + width}
                        y2={y + height}
                        stroke={color}
                        strokeWidth="0.5"
                      />

                      {/* Detection label */}
                      <rect
                        x={x}
                        y={y - 5}
                        width={Math.max(
                          width,
                          18
                        )}
                        height={5}
                        fill="rgba(0,0,0,0.7)"
                      />

                      <text
                        x={x + 0.5}
                        y={y - 1}
                        fill={color}
                        fontSize="2.5"
                        fontFamily="monospace"
                      >
                        {det.object_type.toUpperCase()} #
                        {det.tracking_id}
                      </text>

                      <rect
                        x={x}
                        y={y + height}
                        width={Math.max(
                          width,
                          22
                        )}
                        height={7}
                        fill="rgba(0,0,0,0.7)"
                      />

                      <text
                        x={x + 0.5}
                        y={
                          y +
                          height +
                          2.5
                        }
                        fill={color}
                        fontSize="2"
                        fontFamily="monospace"
                      >
                        CONF: {det.confidence}% |
                        ZONE: {det.zone}
                      </text>

                      <text
                        x={x + 0.5}
                        y={
                          y +
                          height +
                          5
                        }
                        fill={color}
                        fontSize="2"
                        fontFamily="monospace"
                      >
                        TRACK: ACTIVE | RISK:{" "}
                        {det.risk_level}
                      </text>
                    </g>
                  );
                }
              )}

              {/* Restricted zone */}
              <rect
                x="60"
                y="0"
                width="40"
                height="100"
                fill="rgba(239,68,68,0.04)"
                stroke="rgba(239,68,68,0.3)"
                strokeWidth="0.3"
                strokeDasharray="2,2"
              />

              <text
                x="62"
                y="4"
                fill="rgba(239,68,68,0.6)"
                fontSize="2.5"
                fontFamily="monospace"
              >
                RESTRICTED
              </text>

              {/* Warning zone */}
              <rect
                x="30"
                y="0"
                width="30"
                height="100"
                fill="rgba(245,158,11,0.03)"
                stroke="rgba(245,158,11,0.2)"
                strokeWidth="0.2"
                strokeDasharray="2,3"
              />

              <text
                x="32"
                y="4"
                fill="rgba(245,158,11,0.5)"
                fontSize="2.5"
                fontFamily="monospace"
              >
                WARNING
              </text>
            </svg>

            {/* Top-left HUD */}
            <div className="absolute top-1.5 left-1.5 flex flex-col gap-0.5 pointer-events-none">
              {camera.status === "ONLINE" && (
                <div
                  className="flex items-center gap-1 px-1.5 py-0.5"
                  style={{
                    background:
                      "rgba(0,0,0,0.7)",
                    border:
                      "1px solid rgba(239,68,68,0.5)",
                  }}
                >
                  <div className="w-1 h-1 bg-red-500 rounded-full animate-blink" />

                  <span className="font-mono text-[9px] text-red-400">
                    REC
                  </span>
                </div>
              )}

              <div
                className="px-1 py-0.5 font-mono text-[9px]"
                style={{
                  background:
                    "rgba(0,0,0,0.7)",
                  color: "#22d3ee",
                }}
              >
                {camera.fps} FPS |{" "}
                {camera.resolution}
              </div>

              {isThermal && (
                <div
                  className="px-1 py-0.5 font-mono text-[9px] text-orange-400"
                  style={{
                    background:
                      "rgba(0,0,0,0.7)",
                  }}
                >
                  🌡 THERMAL
                </div>
              )}

              {isNightVision && (
                <div
                  className="px-1 py-0.5 font-mono text-[9px] text-green-400"
                  style={{
                    background:
                      "rgba(0,0,0,0.7)",
                  }}
                >
                  ◑ NIGHT VISION
                </div>
              )}
            </div>

            {/* Top-right HUD */}
            <div className="absolute top-1.5 right-1.5 flex flex-col items-end gap-0.5 pointer-events-none">
              {camera.status === "ONLINE" && (
                <div
                  className="flex items-center gap-1 px-1.5 py-0.5"
                  style={{
                    background:
                      "rgba(0,0,0,0.7)",
                    border:
                      "1px solid rgba(34,211,238,0.4)",
                  }}
                >
                  <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse-cyan" />

                  <span className="font-mono text-[9px] text-cyan-400">
                    LIVE
                  </span>
                </div>
              )}

              <div
                className="px-1 py-0.5 font-mono text-[9px] text-slate-400"
                style={{
                  background:
                    "rgba(0,0,0,0.7)",
                }}
              >
                AI {camera.ai_status}
              </div>
            </div>

            {/* Bottom information bar */}
            <div
              className="absolute bottom-0 left-0 right-0 px-2 py-1 flex items-center justify-between"
              style={{
                background:
                  "rgba(0,0,0,0.75)",
              }}
            >
              <div className="pointer-events-none">
                <div className="font-mono text-[9px] text-cyan-400">
                  {camera.camera_id} —{" "}
                  {camera.name}
                </div>

                <div className="font-mono text-[8px] text-slate-500">
                  SECTOR {camera.sector} |{" "}
                  {camera.type}
                </div>
              </div>

              <div className="flex gap-1.5">
                {activeDetections.length > 0 && (
                  <button
                    type="button"
                    onClick={(
                      event: MouseEvent<HTMLButtonElement>
                    ) => {
                      event.stopPropagation();

                      setFacePanel(
                        activeDetections[0]
                          .tracking_id
                      );
                    }}
                    className="px-1.5 py-0.5 border font-mono text-[9px] hover:border-cyan-400 transition-colors"
                    style={{
                      border:
                        "1px solid rgba(34,211,238,0.3)",
                      color: "#22d3ee",
                      background:
                        "rgba(34,211,238,0.08)",
                    }}
                  >
                    FACE
                  </button>
                )}

                {onFullscreen && (
                  <button
                    type="button"
                    onClick={(
                      event: MouseEvent<HTMLButtonElement>
                    ) => {
                      event.stopPropagation();
                      onFullscreen();
                    }}
                    className="px-1.5 py-0.5 border font-mono text-[9px] hover:border-slate-400 transition-colors"
                    style={{
                      border:
                        "1px solid rgba(100,100,100,0.4)",
                      color: "#94a3b8",
                      background:
                        "rgba(0,0,0,0.5)",
                    }}
                  >
                    ⛶
                  </button>
                )}

                {isFullscreen &&
                  onClose && (
                    <button
                      type="button"
                      onClick={(
                        event: MouseEvent<HTMLButtonElement>
                      ) => {
                        event.stopPropagation();
                        onClose();
                      }}
                      className="px-1.5 py-0.5 border font-mono text-[9px] text-slate-300 hover:border-red-500 hover:text-red-400 transition-colors"
                      style={{
                        border:
                          "1px solid rgba(100,100,100,0.4)",
                        background:
                          "rgba(0,0,0,0.5)",
                      }}
                    >
                      ✕ CLOSE
                    </button>
                  )}
              </div>
            </div>

            {/* Demo label */}
            <div className="absolute bottom-7 left-1/2 -translate-x-1/2 pointer-events-none">
              <div className="font-mono text-[8px] text-slate-700 whitespace-nowrap">
                DEMO / SIMULATED LIVE CCTV FEED
              </div>
            </div>
          </>
        )}
      </div>

      {/* PTZ Controls */}
      {showPTZ &&
        camera.status === "ONLINE" && (
          <div
            className="absolute bottom-14 right-2 flex flex-col items-end gap-1"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="text-[8px] font-mono text-cyan-700 text-right">
              PTZ CONTROL: ACTIVE
            </div>

            <div
              className="flex flex-col items-center gap-0.5"
              style={{
                background:
                  "rgba(0,0,0,0.8)",
                border:
                  "1px solid rgba(34,211,238,0.2)",
                padding: "6px",
              }}
            >
              <button
                type="button"
                onClick={() =>
                  movePTZ(0, -10)
                }
                className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:bg-cyan-900/30 transition-all font-mono text-xs"
              >
                ▲
              </button>

              <div className="flex gap-0.5">
                <button
                  type="button"
                  onClick={() =>
                    movePTZ(-10, 0)
                  }
                  className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:bg-cyan-900/30 transition-all font-mono text-xs"
                >
                  ◀
                </button>

                <button
                  type="button"
                  onClick={resetPTZ}
                  className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-white hover:bg-cyan-900/30 transition-all font-mono text-xs"
                >
                  ●
                </button>

                <button
                  type="button"
                  onClick={() =>
                    movePTZ(10, 0)
                  }
                  className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:bg-cyan-900/30 transition-all font-mono text-xs"
                >
                  ▶
                </button>
              </div>

              <button
                type="button"
                onClick={() =>
                  movePTZ(0, 10)
                }
                className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:bg-cyan-900/30 transition-all font-mono text-xs"
              >
                ▼
              </button>

              <div className="flex gap-0.5 mt-0.5">
                <button
                  type="button"
                  onClick={() =>
                    zoomPTZ(0.2)
                  }
                  className="px-1 py-0.5 font-mono text-[9px] text-slate-400 hover:text-cyan-400 border border-slate-700 hover:border-cyan-700 transition-all"
                >
                  Z+
                </button>

                <button
                  type="button"
                  onClick={() =>
                    zoomPTZ(-0.2)
                  }
                  className="px-1 py-0.5 font-mono text-[9px] text-slate-400 hover:text-cyan-400 border border-slate-700 hover:border-cyan-700 transition-all"
                >
                  Z-
                </button>
              </div>
            </div>
          </div>
        )}

      {/* Face Analysis */}
      {facePanel && (
        <FaceAnalysisPanel
          trackingId={facePanel}
          onClose={() =>
            setFacePanel(null)
          }
        />
      )}
    </div>
  );
}
