import { useState, useMemo, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { DEMO_ALERTS, DEMO_INCIDENTS, DEMO_CAMERAS } from "../services/demoData";
import jsPDF from "jspdf";
import PptxGenJS from "pptxgenjs";

export default function AnalysisReports() {
  const [selectedReport, setSelectedReport] = useState<string | null>("summary");
  const [exporting, setExporting] = useState<"pdf" | "pptx" | null>(null);

  // Compute demo statistics
  const totalAnomalies = DEMO_ALERTS.length;
  const highSeverity = DEMO_ALERTS.filter(a => a.severity === "HIGH" || a.severity === "CRITICAL").length;
  const mediumSeverity = DEMO_ALERTS.filter(a => a.severity === "MEDIUM").length;
  const lowSeverity = DEMO_ALERTS.filter(a => a.severity === "LOW").length;
  const camerasOnline = DEMO_CAMERAS.filter(c => c.status === "ONLINE").length;

  const recentIncidents = useMemo(() => DEMO_INCIDENTS.slice(0, 3), []);

  // ── PDF Export ──────────────────────────────────────────────────
  const exportPDF = () => {
    setExporting("pdf");
    setTimeout(() => {
      try {
        const doc = new jsPDF();
        const pageW = doc.internal.pageSize.getWidth();
        let y = 20;

        // Header
        doc.setFillColor(15, 23, 42);
        doc.rect(0, 0, pageW, 40, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.text("IBVAP — Analysis Report", 14, 18);
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text("Intelligent Border Video Analytics Platform | Team Drishti | SIH26187", 14, 26);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 32);

        y = 50;
        doc.setTextColor(30, 41, 59);

        if (selectedReport === "summary") {
          // System overview
          doc.setFontSize(14);
          doc.setFont("helvetica", "bold");
          doc.text("System-Wide Analysis Summary", 14, y);
          y += 12;

          // Stats row
          doc.setFontSize(10);
          doc.setFont("helvetica", "normal");
          const stats = [
            ["Total Anomalies", `${totalAnomalies}`],
            ["High/Critical", `${highSeverity}`],
            ["Medium", `${mediumSeverity}`],
            ["Low", `${lowSeverity}`],
            ["Cameras Online", `${camerasOnline}/6`],
          ];
          stats.forEach(([label, value]) => {
            doc.setFont("helvetica", "bold");
            doc.text(`${label}:`, 14, y);
            doc.setFont("helvetica", "normal");
            doc.text(value, 60, y);
            y += 7;
          });
          y += 6;

          // Alerts
          doc.setFontSize(12);
          doc.setFont("helvetica", "bold");
          doc.text("Recent Detected Anomalies", 14, y);
          y += 8;

          doc.setFontSize(9);
          DEMO_ALERTS.forEach(alert => {
            if (y > 270) { doc.addPage(); y = 20; }
            doc.setFont("helvetica", "bold");
            doc.setTextColor(
              alert.severity === "CRITICAL" ? 220 : alert.severity === "HIGH" ? 234 : 180,
              alert.severity === "CRITICAL" ? 38 : alert.severity === "HIGH" ? 88 : 120,
              alert.severity === "CRITICAL" ? 38 : alert.severity === "HIGH" ? 12 : 20
            );
            doc.text(`[${alert.severity}]`, 14, y);
            doc.setTextColor(30, 41, 59);
            doc.setFont("helvetica", "normal");
            doc.text(`${alert.title} — ${alert.camera_id}`, 40, y);
            y += 5;
            doc.setFontSize(8);
            doc.text(alert.description, 40, y);
            doc.setFontSize(9);
            y += 8;
          });
        } else {
          // Incident-specific report
          const inc = DEMO_INCIDENTS.find(i => i.id === selectedReport);
          if (inc) {
            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.text(`Incident Report: ${inc.incident_code}`, 14, y);
            y += 12;

            const fields = [
              ["Camera", `${inc.camera_id} — ${inc.camera_name}`],
              ["Sector", inc.sector],
              ["Threat Score", `${inc.risk_score}/100`],
              ["Risk Level", inc.risk_level],
              ["Status", inc.status],
              ["Object Type", inc.object_type],
              ["Tracking ID", inc.tracking_id],
              ["Confidence", `${inc.confidence}%`],
            ];
            doc.setFontSize(10);
            fields.forEach(([label, value]) => {
              doc.setFont("helvetica", "bold");
              doc.text(`${label}:`, 14, y);
              doc.setFont("helvetica", "normal");
              doc.text(value, 55, y);
              y += 7;
            });

            y += 6;
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.text("AI Reasoning", 14, y);
            y += 8;
            doc.setFontSize(9);
            doc.setFont("helvetica", "normal");
            inc.ai_reasons.forEach((reason, idx) => {
              if (y > 270) { doc.addPage(); y = 20; }
              doc.text(`${idx + 1}. ${reason}`, 18, y);
              y += 6;
            });

            y += 6;
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.text("Timeline", 14, y);
            y += 8;
            doc.setFontSize(9);
            doc.setFont("helvetica", "normal");
            inc.timeline.forEach(event => {
              if (y > 270) { doc.addPage(); y = 20; }
              const time = new Date(event.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              doc.text(`[${time}] ${event.event}`, 18, y);
              y += 6;
            });
          }
        }

        // Footer on last page
        const pageH = doc.internal.pageSize.getHeight();
        doc.setFillColor(241, 245, 249);
        doc.rect(0, pageH - 15, pageW, 15, "F");
        doc.setFontSize(7);
        doc.setTextColor(100, 116, 139);
        doc.text("IBVAP — Intelligent Border Video Analytics Platform | Team Drishti | SIH26187 | CONFIDENTIAL", 14, pageH - 6);

        doc.save(`IBVAP_Report_${selectedReport === "summary" ? "Overview" : selectedReport}_${new Date().toISOString().slice(0, 10)}.pdf`);
      } catch (e) {
        console.error("PDF export failed:", e);
      }
      setExporting(null);
    }, 200);
  };

  // ── PPTX Export ─────────────────────────────────────────────────
  const exportPPTX = () => {
    setExporting("pptx");
    setTimeout(() => {
      try {
        const pptx = new PptxGenJS();
        pptx.author = "Team Drishti";
        pptx.company = "IBVAP";
        pptx.subject = "Border Surveillance Analysis Report";

        // Slide 1: Title
        const slide1 = pptx.addSlide();
        slide1.background = { color: "0F172A" };
        slide1.addText("IBVAP", { x: 0.8, y: 1.0, w: 8.5, fontSize: 40, color: "10B981", bold: true, fontFace: "Arial" });
        slide1.addText("Intelligent Border Video Analytics Platform", { x: 0.8, y: 1.8, w: 8.5, fontSize: 18, color: "94A3B8", fontFace: "Arial" });
        slide1.addText("Analysis Report", { x: 0.8, y: 2.4, w: 8.5, fontSize: 24, color: "FFFFFF", bold: true, fontFace: "Arial" });
        slide1.addText(`Generated: ${new Date().toLocaleString()}`, { x: 0.8, y: 3.2, w: 8.5, fontSize: 11, color: "64748B", fontFace: "Arial" });
        slide1.addText("Team Drishti | SIH26187 | Smart India Hackathon 2026", { x: 0.8, y: 4.5, w: 8.5, fontSize: 11, color: "475569", fontFace: "Arial" });

        if (selectedReport === "summary") {
          // Slide 2: Stats
          const slide2 = pptx.addSlide();
          slide2.background = { color: "FFFFFF" };
          slide2.addText("System Statistics (Last 24h)", { x: 0.5, y: 0.3, w: 9, fontSize: 22, color: "0F172A", bold: true });

          const statBoxes = [
            { label: "TOTAL\nANOMALIES", value: `${totalAnomalies}`, bg: "F1F5F9", color: "0F172A" },
            { label: "HIGH\nSEVERITY", value: `${highSeverity}`, bg: "FEF2F2", color: "DC2626" },
            { label: "MEDIUM\nSEVERITY", value: `${mediumSeverity}`, bg: "FFFBEB", color: "D97706" },
            { label: "CAMERAS\nONLINE", value: `${camerasOnline}/6`, bg: "F0FDF4", color: "16A34A" },
          ];
          statBoxes.forEach((box, i) => {
            const x = 0.5 + i * 2.3;
            slide2.addShape(pptx.ShapeType.roundRect, { x, y: 1.2, w: 2.0, h: 1.6, fill: { color: box.bg }, rectRadius: 0.1 });
            slide2.addText(box.value, { x, y: 1.3, w: 2.0, h: 0.8, fontSize: 36, color: box.color, bold: true, align: "center" });
            slide2.addText(box.label, { x, y: 2.1, w: 2.0, h: 0.6, fontSize: 9, color: "64748B", align: "center" });
          });

          // Slide 3: Alerts
          const slide3 = pptx.addSlide();
          slide3.background = { color: "FFFFFF" };
          slide3.addText("Recent Detected Anomalies", { x: 0.5, y: 0.3, w: 9, fontSize: 22, color: "0F172A", bold: true });

          DEMO_ALERTS.forEach((alert, i) => {
            const yPos = 1.0 + i * 0.9;
            const sevColor = alert.severity === "CRITICAL" ? "DC2626" : alert.severity === "HIGH" ? "EA580C" : "D97706";
            slide3.addShape(pptx.ShapeType.roundRect, { x: 0.5, y: yPos, w: 9.0, h: 0.75, fill: { color: "F8FAFC" }, rectRadius: 0.05, line: { color: "E2E8F0", width: 0.5 } });
            slide3.addText(`[${alert.severity}]`, { x: 0.7, y: yPos + 0.05, w: 1.2, fontSize: 10, color: sevColor, bold: true });
            slide3.addText(alert.title, { x: 1.9, y: yPos + 0.05, w: 6.0, fontSize: 11, color: "1E293B", bold: true });
            slide3.addText(alert.camera_id, { x: 8.2, y: yPos + 0.05, w: 1.2, fontSize: 10, color: "64748B", align: "right" });
            slide3.addText(alert.description, { x: 1.9, y: yPos + 0.38, w: 7.0, fontSize: 8, color: "64748B" });
          });
        } else {
          const inc = DEMO_INCIDENTS.find(i => i.id === selectedReport);
          if (inc) {
            // Slide 2: Incident details
            const slide2 = pptx.addSlide();
            slide2.background = { color: "FFFFFF" };
            slide2.addText(`Incident: ${inc.incident_code}`, { x: 0.5, y: 0.3, w: 9, fontSize: 22, color: "0F172A", bold: true });

            const fields = [
              ["Camera", `${inc.camera_id} — ${inc.camera_name}`],
              ["Sector", inc.sector],
              ["Threat Score", `${inc.risk_score}/100`],
              ["Risk Level", inc.risk_level],
              ["Status", inc.status],
              ["Tracking ID", inc.tracking_id],
            ];
            fields.forEach(([label, value], i) => {
              const yPos = 1.1 + i * 0.35;
              slide2.addText(`${label}:`, { x: 0.7, y: yPos, w: 2.0, fontSize: 11, color: "64748B", bold: true });
              slide2.addText(value, { x: 2.8, y: yPos, w: 6.0, fontSize: 11, color: "1E293B" });
            });

            // Slide 3: AI Reasoning
            const slide3 = pptx.addSlide();
            slide3.background = { color: "FFFFFF" };
            slide3.addText("AI Reasoning", { x: 0.5, y: 0.3, w: 9, fontSize: 22, color: "0F172A", bold: true });
            inc.ai_reasons.forEach((reason, i) => {
              slide3.addText(`${i + 1}. ${reason}`, { x: 0.7, y: 1.0 + i * 0.5, w: 8.5, fontSize: 13, color: "334155", bullet: true });
            });

            // Slide 4: Timeline
            const slide4 = pptx.addSlide();
            slide4.background = { color: "FFFFFF" };
            slide4.addText("Event Timeline", { x: 0.5, y: 0.3, w: 9, fontSize: 22, color: "0F172A", bold: true });
            inc.timeline.forEach((event, i) => {
              const yPos = 1.0 + i * 0.55;
              const time = new Date(event.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              const dotColor = event.status === "done" ? "10B981" : "F59E0B";
              slide4.addShape(pptx.ShapeType.ellipse, { x: 0.7, y: yPos + 0.08, w: 0.15, h: 0.15, fill: { color: dotColor } });
              slide4.addText(time, { x: 1.0, y: yPos, w: 1.0, fontSize: 10, color: "64748B" });
              slide4.addText(event.event, { x: 2.1, y: yPos, w: 7.0, fontSize: 12, color: "334155" });
            });
          }
        }

        pptx.writeFile({ fileName: `IBVAP_Report_${selectedReport === "summary" ? "Overview" : selectedReport}_${new Date().toISOString().slice(0, 10)}.pptx` });
      } catch (e) {
        console.error("PPTX export failed:", e);
      }
      setExporting(null);
    }, 200);
  };

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
                <div className={`text-[10px] font-mono mt-1 px-1.5 py-0.5 rounded inline-block font-bold ${inc.risk_level === 'CRITICAL' ? 'bg-red-100 text-red-700' : inc.risk_level === 'HIGH' ? 'bg-orange-100 text-orange-700' : 'bg-amber-100 text-amber-700'}`}>
                  {inc.risk_level}
                </div>
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
                onClick={exportPDF}
                disabled={exporting !== null}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-800 disabled:bg-slate-500 text-white text-sm font-medium rounded transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                {exporting === "pdf" ? "Generating..." : "Export PDF"}
              </button>
              <button 
                onClick={exportPPTX}
                disabled={exporting !== null}
                className="px-4 py-2 bg-cyan-700 hover:bg-cyan-800 disabled:bg-cyan-600 text-white text-sm font-medium rounded transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                {exporting === "pptx" ? "Generating..." : "Export PPTX"}
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
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
                    <div className="text-xs font-mono text-slate-500 mb-1">TOTAL ANOMALIES</div>
                    <div className="text-2xl font-bold text-slate-800">{totalAnomalies}</div>
                  </div>
                  <div className="bg-red-50 border border-red-100 p-4 rounded-lg">
                    <div className="text-xs font-mono text-red-600 mb-1">HIGH / CRITICAL</div>
                    <div className="text-2xl font-bold text-red-700">{highSeverity}</div>
                  </div>
                  <div className="bg-amber-50 border border-amber-100 p-4 rounded-lg">
                    <div className="text-xs font-mono text-amber-600 mb-1">MEDIUM</div>
                    <div className="text-2xl font-bold text-amber-700">{mediumSeverity}</div>
                  </div>
                  <div className="bg-green-50 border border-green-100 p-4 rounded-lg">
                    <div className="text-xs font-mono text-green-600 mb-1">LOW</div>
                    <div className="text-2xl font-bold text-green-700">{lowSeverity}</div>
                  </div>
                  <div className="bg-cyan-50 border border-cyan-100 p-4 rounded-lg">
                    <div className="text-xs font-mono text-cyan-600 mb-1">CAMERAS ONLINE</div>
                    <div className="text-2xl font-bold text-cyan-700">{camerasOnline}/6</div>
                  </div>
                </div>
              </section>

              {/* Camera Status Summary */}
              <section>
                <h3 className="text-sm font-bold text-slate-700 mb-4">Camera Feed Status</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {DEMO_CAMERAS.map(cam => (
                    <div key={cam.id} className={`border rounded-lg p-3 flex items-center justify-between ${cam.status === 'ONLINE' ? 'bg-white border-slate-200' : 'bg-red-50 border-red-200'}`}>
                      <div>
                        <div className="font-bold text-sm text-slate-800">{cam.camera_id}</div>
                        <div className="text-xs text-slate-500">{cam.name}</div>
                        <div className="text-[10px] font-mono text-slate-400">Sector {cam.sector} | {cam.type}</div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xs font-bold ${cam.status === 'ONLINE' ? 'text-emerald-600' : 'text-red-600'}`}>
                          ● {cam.status}
                        </div>
                        <div className="text-[10px] text-slate-400">AI: {cam.ai_status}</div>
                        <div className="text-[10px] text-slate-400">{cam.alerts_today} alerts</div>
                      </div>
                    </div>
                  ))}
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
                          <span className={`px-2 py-0.5 text-[10px] font-bold tracking-wider rounded ${alert.severity === 'CRITICAL' ? 'bg-red-600 text-white' : alert.severity === 'HIGH' ? 'bg-red-200 text-red-800' : alert.severity === 'MEDIUM' ? 'bg-amber-200 text-amber-800' : 'bg-green-200 text-green-800'}`}>
                            {alert.severity}
                          </span>
                        </div>
                        <span className="text-sm text-slate-800 font-medium block">{alert.title}</span>
                        <span className="text-xs text-slate-600">{alert.description}</span>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-xs font-mono text-slate-500">CAMERA</div>
                        <div className="font-bold text-sm text-slate-700">{alert.camera_id}</div>
                        <div className="text-xs font-mono text-slate-400">Sector {alert.sector}</div>
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
                      <div className={`border p-3 rounded ${inc.risk_level === 'CRITICAL' ? 'bg-red-50 border-red-200' : inc.risk_level === 'HIGH' ? 'bg-orange-50 border-orange-200' : 'bg-amber-50 border-amber-200'}`}>
                        <div className="text-[10px] text-slate-500 font-mono">THREAT SCORE</div>
                        <div className={`font-bold ${inc.risk_level === 'CRITICAL' ? 'text-red-700' : inc.risk_level === 'HIGH' ? 'text-orange-700' : 'text-amber-700'}`}>{inc.risk_score}/100</div>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 p-3 rounded">
                        <div className="text-[10px] text-slate-500 font-mono">STATUS</div>
                        <div className="font-bold text-slate-800">{inc.status}</div>
                      </div>
                    </div>

                    {/* Camera Details */}
                    <div className="bg-cyan-50 border border-cyan-100 rounded-lg p-4">
                      <div className="text-xs font-mono text-cyan-700 mb-2">SOURCE CAMERA</div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-slate-800">{inc.camera_id}</span>
                          <span className="text-slate-500"> — {inc.camera_name}</span>
                        </div>
                        <Link to="/surveillance" className="text-xs font-mono text-cyan-600 hover:text-cyan-800 underline">
                          VIEW LIVE FEED →
                        </Link>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h4 className="font-bold text-slate-800 mb-3 border-b border-slate-100 pb-2">AI Reasoning</h4>
                      <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700">
                        {inc.ai_reasons.map((reason, idx) => (
                          <li key={idx}>{reason}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-6">
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
