import { Client } from "@gradio/client";
import { MODEL_API_BASE, FEATURE_ORDER } from "../config";

// Shared prediction engine: uses the official @gradio/client for the live
// model call, with a clearly-labelled offline fallback so the SIH field demo
// never dead-ends (e.g. model asleep / CORS blocked / offline).
// Used for manual (16-field form), per-cow click, and automatic batch.

let clientPromise = null;
function getClient() {
  if (!clientPromise) clientPromise = Client.connect(MODEL_API_BASE);
  return clientPromise;
}

export function resetModelClient() {
  clientPromise = null;
}

export async function predictSingle(values) {
  const data = FEATURE_ORDER.map((k) => Number(values?.[k] ?? 0));
  if (data.some((v) => !Number.isFinite(v))) {
    throw new Error("All 16 features must be numbers.");
  }
  try {
    const client = await getClient();
    const result = await client.predict("/predict_mastitis", data);
    // Named-endpoint result: result.data = [ { risk_level, raw_score, display_score } ]
    const out = Array.isArray(result?.data) ? result.data[0] : result?.data;
    if (!out || typeof out.risk_level === "undefined") {
      throw new Error("Unexpected model response shape.");
    }
    return { risk_level: out.risk_level, raw_score: out.raw_score, display_score: out.display_score, live: true };
  } catch (e) {
    // Offline fallback — same heuristic as before so results stay consistent.
    // (CORS blocks / asleep links land here; message preserved for transparency.)
    resetModelClient();
    const out = offlineEstimate(values);
    return { ...out, live: false, offlineError: e.message };
  }
}

export function offlineEstimate(values) {
  const ecVals = ["lnVAR_EC_LF", "lnVAR_EC_RF", "lnVAR_EC_LR", "lnVAR_EC_RR"].map(
    (k) => Number(values?.[k] || 0)
  );
  const other = ["lnVAR_activity", "lnVAR_rumination", "lnVAR_temperature", "lnVAR_milkyield"].map(
    (k) => Number(values?.[k] || 0)
  );
  const score = Math.max(...ecVals) * 0.6 + (other.reduce((a, b) => a + b, 0) / other.length) * 0.4;
  const level =
    score >= 1.2
      ? "High Risk (offline estimate)"
      : score >= 0.4
        ? "Moderate Risk (offline estimate)"
        : score >= -0.4
          ? "Low Risk (offline estimate)"
          : "No Risk (offline estimate)";
  return {
    risk_level: level,
    raw_score: Number(score.toFixed(3)),
    display_score: Math.min(1, Math.max(0, (score + 2) / 4)),
  };
}

export function riskClass(level = "") {
  const l = level.toLowerCase();
  if (l.includes("high")) return "High";
  if (l.includes("moderate") || l.includes("medium")) return "Moderate";
  if (l.includes("low")) return "Low";
  return "No Risk";
}

export function riskStyle(level = "") {
  const l = level.toLowerCase();
  if (l.includes("high"))
    return { badge: "bg-red-600 text-white", bar: "bg-red-500", text: "text-red-700", box: "border-red-300 bg-red-50" };
  if (l.includes("moderate") || l.includes("medium"))
    return { badge: "bg-amber-400 text-amber-950", bar: "bg-amber-400", text: "text-amber-800", box: "border-amber-300 bg-amber-50" };
  if (l.includes("low"))
    return { badge: "bg-lime-200 text-lime-900 border border-lime-300", bar: "bg-lime-400", text: "text-lime-800", box: "border-lime-300 bg-lime-50" };
  return { badge: "bg-emerald-600 text-white", bar: "bg-emerald-500", text: "text-emerald-700", box: "border-emerald-300 bg-emerald-50" };
}

export function adviceFor(level = "") {
  const l = level.toLowerCase();
  if (l.includes("high"))
    return [
      "Isolate quarter & do Strip-Cup + 4-well CMT before next milking",
      "Post-milking barrier teat dip (0.5% povidone-iodine), keep cow standing 30 min",
      "Call veterinarian within 24h — share this risk report on WhatsApp",
      "Do NOT pool this milk in bulk tank if clots/heat. Recheck in 48h.",
    ];
  if (l.includes("moderate") || l.includes("medium"))
    return [
      "Repeat CMT in 48h + check udder heat per-quarter (LF/RF/LR/RR)",
      "Improve stall hygiene (dry bedding), ventilate shed — THI check",
      "Verify milking SOP: cluster attachment, vacuum 42 kPa, teat dip coverage",
      "Monitor rumination/activity collar drift daily for 7–14 days",
    ];
  if (l.includes("low"))
    return [
      "Routine watch: re-run prediction in 7 days",
      "Keep bedding dry + teat dip compliance at every milking",
      "No antibiotics needed — continue monitoring",
    ];
  return [
    "No action needed — continue 7–14 day routine monitoring",
    "Maintain milking hygiene + vaccination + nutrition schedule",
  ];
}

// Simple-language version for the farmer view
export function farmerAdvice(level = "") {
  const l = level.toLowerCase();
  if (l.includes("high"))
    return ["⚠️ High risk — separate this cow, do CMT test today itself.", "📞 Call your doctor now and show this report on WhatsApp.", "🥛 Do not mix this cow's milk with other milk."];
  if (l.includes("moderate") || l.includes("medium"))
    return ["👀 Watch closely for 2 days — check udder heat morning/evening.", "🧹 Keep shed dry, dip teats after every milking."];
  if (l.includes("low")) return ["✅ Small risk — check again after 7 days.", "🧴 Continue teat dip every time."];
  return ["✅ Cow is healthy — keep normal care and feeding."];
}
