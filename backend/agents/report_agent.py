"""
Report Generation Agent for IBVAP
Generates AI-powered incident analysis summaries using Groq LLM.
Falls back to a deterministic template if Groq is unavailable.
"""
import json
import os
import hashlib
from datetime import datetime

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

LLM_AVAILABLE = False
llm = None

try:
    from langchain_groq import ChatGroq
    from langchain_core.prompts import ChatPromptTemplate
    groq_key = os.getenv("GROQ_API_KEY")
    if groq_key:
        llm = ChatGroq(
            model="llama-3.1-8b-instant",
            temperature=0.1,
            groq_api_key=groq_key,
        )
        LLM_AVAILABLE = True
except Exception:
    pass


# ── LLM-based summary ──────────────────────────────────────────────

SYSTEM_PROMPT = """
You are a senior border-security analyst at IBVAP (Intelligent Border Video
Analytics Platform). Given structured incident data you MUST produce a concise
executive briefing that a field commander can scan in 10 seconds.

Output format — use EXACTLY this layout:

### {risk_emoji} {risk_level} | {incident_code}
* **Threat Score:** {risk_score}/100 | **Camera:** {camera_id} ({camera_name}) | **Sector:** {sector}
* **Situation:** [2-3 sentences synthesising what happened, referencing the AI
  reasoning signals. Do NOT list raw data — explain what the signals MEAN.]
* **Recommended Action:** [ONE clear, actionable instruction for the duty officer.]

Rules:
- Be direct and punchy. Never start with "This incident" or "Based on the data".
- Mention the tracking ID and object type naturally within the situation text.
- Keep the entire output under 100 words.
"""


def _llm_summarise(incident: dict) -> str:
    """Generate an AI summary via Groq."""
    risk_map = {"CRITICAL": "🔴", "HIGH": "🟠", "MEDIUM": "🟡", "LOW": "🟢"}
    incident["risk_emoji"] = risk_map.get(incident.get("risk_level", ""), "⚪")

    prompt = ChatPromptTemplate.from_messages([
        ("system", SYSTEM_PROMPT),
        ("human", "Generate the executive briefing for: {incident_code}"),
    ])
    chain = prompt | llm
    result = chain.invoke(incident)
    return result.content.strip()


# ── Deterministic fallback ──────────────────────────────────────────

def _template_summarise(incident: dict) -> str:
    """Deterministic fallback when no LLM is available."""
    risk_map = {"CRITICAL": "🔴", "HIGH": "🟠", "MEDIUM": "🟡", "LOW": "🟢"}
    emoji = risk_map.get(incident.get("risk_level", ""), "⚪")
    reasons = incident.get("ai_reasons", [])
    reason_text = "; ".join(reasons[:3]) if reasons else "No AI signals available."

    return (
        f"### {emoji} {incident.get('risk_level','UNKNOWN')} | {incident.get('incident_code','N/A')}\n"
        f"* **Threat Score:** {incident.get('risk_score',0)}/100 | "
        f"**Camera:** {incident.get('camera_id','—')} ({incident.get('camera_name','—')}) | "
        f"**Sector:** {incident.get('sector','—')}\n"
        f"* **Situation:** AI detection flagged a {incident.get('object_type','object')} "
        f"(Track {incident.get('tracking_id','—')}) with {incident.get('confidence',0)}% confidence. "
        f"Key signals: {reason_text}\n"
        f"* **Recommended Action:** Dispatch patrol to {incident.get('sector','sector')} and "
        f"verify identity of tracked object {incident.get('tracking_id','—')}."
    )


# ── Public API ──────────────────────────────────────────────────────

def summarise_incident(incident: dict) -> str:
    """Summarise a single incident. Uses LLM if available, else template."""
    if LLM_AVAILABLE and llm:
        try:
            return _llm_summarise(incident)
        except Exception as e:
            print(f"[ReportAgent] LLM failed for {incident.get('incident_code')}: {e}")
            return _template_summarise(incident)
    return _template_summarise(incident)


def generate_report_json(incidents: list[dict]) -> dict:
    """
    Produce a full structured report payload that the frontend can
    consume to render or export as PDF / PPTX.
    """
    summaries = []
    for inc in incidents:
        summary_text = summarise_incident(inc)
        summaries.append({
            "incident_code": inc.get("incident_code", ""),
            "camera_id": inc.get("camera_id", ""),
            "camera_name": inc.get("camera_name", ""),
            "sector": inc.get("sector", ""),
            "risk_level": inc.get("risk_level", ""),
            "risk_score": inc.get("risk_score", 0),
            "status": inc.get("status", ""),
            "object_type": inc.get("object_type", ""),
            "tracking_id": inc.get("tracking_id", ""),
            "confidence": inc.get("confidence", 0),
            "timestamp": inc.get("timestamp", ""),
            "ai_reasons": inc.get("ai_reasons", []),
            "timeline": inc.get("timeline", []),
            "executive_summary": summary_text,
            "evidence_hash": hashlib.sha256(
                json.dumps(inc, sort_keys=True, default=str).encode()
            ).hexdigest()[:16],
        })

    return {
        "report_id": f"RPT-{datetime.now().strftime('%Y%m%d%H%M%S')}",
        "generated_at": datetime.now().isoformat(),
        "total_incidents": len(incidents),
        "critical_count": sum(1 for s in summaries if s["risk_level"] == "CRITICAL"),
        "high_count": sum(1 for s in summaries if s["risk_level"] == "HIGH"),
        "medium_count": sum(1 for s in summaries if s["risk_level"] == "MEDIUM"),
        "low_count": sum(1 for s in summaries if s["risk_level"] == "LOW"),
        "incidents": summaries,
        "platform": "IBVAP — Intelligent Border Video Analytics Platform",
        "team": "Team Drishti | SIH26187 | Smart India Hackathon 2026",
    }


class ReportAgent:
    """Callable agent interface matching the pattern used elsewhere."""
    def execute(self, incidents: list[dict]) -> dict:
        return generate_report_json(incidents)


report_agent = ReportAgent()
