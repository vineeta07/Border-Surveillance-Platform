import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { DEMO_ALERTS, DEMO_INCIDENTS } from "../services/demoData";

export default function AnalysisReports() {
  const [isPrinting, setIsPrinting] = useState(false);
  const [selectedReport, setSelectedReport] = useState<string | null>("summary");

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 100);
  };

  // Compute demo statistics
  const totalAnomalies = DEMO_ALERTS.length;
  const highSeverity = DEMO_ALERTS.filter(a => a.severity === "HIGH" || a.severity === "CRITICAL").length;
  const mediumSeverity = DEMO_ALERTS.filter(a => a.severity === "MEDIUM").length;
  const totalDuration = "4h 12m"; // Mock duration

  const recentIncidents = useMemo(() => {
    return DEMO_INCIDENTS.slice(0, 3);
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="font-mono text-xs text-cyan-700 tracking-widest">IBVAP / REPORTS</div>
          <h1 className="font-display font-bold text-2xl text-slate-900 tracking-wide">Analysis Reports</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/video-analysis" className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-sm font-medium rounded transition-colors font-mono">
            + NEW ANALYSIS
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
        
        {/* Sidebar: Report List */}
        <div className="lg:col-span-1 glass-panel flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <h3 className="font-mono text-xs font-bold text-slate-600">REPORT ARCHIVE</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            <button 
              onClick={() => setSelectedReport("summary")}
              className={`w-full text-left p-3 rounded border transition-colors ${selectedReport === "summary" ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}
            >
              <div className="font-bold text-sm">System Overview</div>
              <div className="text-xs opacity-75">All Cameras & Sectors</div>
            </button>
            {recentIncidents.map(inc => (
              <button
                key={inc.id}
                onClick={() => setSelectedReport(inc.id)}
                className={`w-full text-left p-3 rounded border transition-colors ${selectedReport === inc.id ? "bg-cyan-50 border-cyan-200 text-cyan-800" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}
              >
                <div className="font-bold text-sm truncate">{inc.incident_code}</div>
                <div className="text-xs opacity-75">{inc.camera_name}</div>
                <div className="text-[10px] font-mono mt-1 opacity-60">{new Date(inc.timestamp).toLocaleDateString()}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Report Container */}
        <div className="lg:col-span-3 bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden p-6 overflow-y-auto flex-1">
          
          {/* Report Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-4 border-b border-slate-100 gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                {selectedReport === "summary" ? "System-Wide Analysis Summary" : `Incident Report: ${DEMO_INCIDENTS.find(i => i.id === selectedReport)?.incident_code}`}
              </h2>
              <div className="text-xs font-mono text-slate-500 mt-1">Generated: {new Date().toLocaleString()}</div>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={handlePrint}
                className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-medium rounded transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                Print
              </button>
              <button 
                onClick={handlePrint}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                Export PDF
              </button>
            </div>
          </div>

          {/* Sections */}
          {selectedReport === "summary" ? (
            <div className="space-y-8">
              
              {/* Summary Statistics */}
              <section>
                <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                  <span className="text-emerald-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg>
                  </span>
                  System Statistics (Last 24h)
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
                    <div className="text-xs font-mono text-slate-500 mb-1">TOTAL ANOMALIES</div>
                    <div className="text-2xl font-bold text-slate-800">{totalAnomalies}</div>
                  </div>
                  <div className="bg-red-50 border border-red-100 p-4 rounded-lg">
                    <div className="text-xs font-mono text-red-600 mb-1">HIGH SEVERITY</div>
                    <div className="text-2xl font-bold text-red-700">{highSeverity}</div>
                  </div>
                  <div className="bg-amber-50 border border-amber-100 p-4 rounded-lg">
                    <div className="text-xs font-mono text-amber-600 mb-1">MEDIUM SEVERITY</div>
                    <div className="text-2xl font-bold text-amber-700">{mediumSeverity}</div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
                    <div className="text-xs font-mono text-slate-500 mb-1">ANALYSIS UPTIME</div>
                    <div className="text-2xl font-bold text-slate-800">{totalDuration}</div>
                  </div>
                </div>
              </section>

              {/* Detected Anomalies */}
              <section>
                <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                  <span className="text-emerald-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                  </span>
                  Recent Detected Anomalies
                </h3>
                
                <div className="space-y-3">
                  {DEMO_ALERTS.map(alert => (
                    <div key={alert.id} className={`border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${alert.severity === 'CRITICAL' || alert.severity === 'HIGH' ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-200'}`}>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-mono text-xs text-slate-500">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                          <span className={`px-2 py-0.5 text-[10px] font-bold tracking-wider rounded ${alert.severity === 'CRITICAL' ? 'bg-red-600 text-white' : alert.severity === 'HIGH' ? 'bg-red-200 text-red-800' : 'bg-amber-200 text-amber-800'}`}>
                            {alert.severity}
                          </span>
                        </div>
                        <span className="text-sm text-slate-800 font-medium block">{alert.title}</span>
                        <span className="text-xs text-slate-600">{alert.description}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-mono text-slate-500">CAMERA</div>
                        <div className="font-bold text-sm text-slate-700">{alert.camera_id}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

            </div>
          ) : (
            <div className="space-y-6">
              {/* Incident Specific Report */}
              {(() => {
                const inc = DEMO_INCIDENTS.find(i => i.id === selectedReport);
                if (!inc) return null;
                return (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-slate-50 border border-slate-200 p-3 rounded">
                        <div className="text-[10px] text-slate-500 font-mono">INCIDENT CODE</div>
                        <div className="font-bold text-slate-800">{inc.incident_code}</div>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 p-3 rounded">
                        <div className="text-[10px] text-slate-500 font-mono">SECTOR</div>
                        <div className="font-bold text-slate-800">{inc.sector}</div>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 p-3 rounded">
                        <div className="text-[10px] text-slate-500 font-mono">THREAT SCORE</div>
                        <div className="font-bold text-slate-800">{inc.risk_score}/100</div>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 p-3 rounded">
                        <div className="text-[10px] text-slate-500 font-mono">STATUS</div>
                        <div className="font-bold text-slate-800">{inc.status}</div>
                      </div>
                    </div>

                    <div className="mt-8">
                      <h4 className="font-bold text-slate-800 mb-3 border-b border-slate-100 pb-2">AI Reasoning</h4>
                      <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700">
                        {inc.ai_reasons.map((reason, idx) => (
                          <li key={idx}>{reason}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-8">
                      <h4 className="font-bold text-slate-800 mb-3 border-b border-slate-100 pb-2">Timeline</h4>
                      <div className="space-y-4">
                        {inc.timeline.map((event, idx) => (
                          <div key={idx} className="flex gap-4">
                            <div className="w-16 flex-shrink-0 text-xs font-mono text-slate-500 pt-1">
                              {new Date(event.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                            <div className="relative pb-4 pl-4 border-l-2 border-slate-200 flex-1">
                              <div className={`absolute -left-1.5 top-1.5 w-2.5 h-2.5 rounded-full ${event.status === 'done' ? 'bg-emerald-500' : 'bg-amber-400'}`}></div>
                              <div className="text-sm text-slate-700">{event.event}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
