import { useState } from "react";
import { MODEL_URL, FEATURE_DEFS, FEATURE_ORDER } from "../config";
import { predictSingle, offlineEstimate } from "../lib/predict";

const GROUPS = ["Activity", "Rumination", "Temperature", "Milk Yield", "EC · Left Front", "EC · Right Front", "EC · Left Rear", "EC · Right Rear"];

const GROUP_ICON = {
  Activity: "directions_run",
  Rumination: "grass",
  Temperature: "device_thermostat",
  "Milk Yield": "water_drop",
  "EC · Left Front": "electric_bolt",
  "EC · Right Front": "electric_bolt",
  "EC · Left Rear": "electric_bolt",
  "EC · Right Rear": "electric_bolt",
};

const PRESETS = {
  zeros: Object.fromEntries(FEATURE_ORDER.map((k) => [k, 0])),
  healthy: {
    lnVAR_activity: -1.2, acf_activity: 0.65,
    lnVAR_rumination: -1.1, acf_rumination: 0.6,
    lnVAR_temperature: -1.3, acf_temperature: 0.55,
    lnVAR_milkyield: -1.0, acf_milkyield: 0.6,
    lnVAR_EC_LF: -1.2, acf_EC_LF: 0.6,
    lnVAR_EC_RF: -1.2, acf_EC_RF: 0.6,
    lnVAR_EC_LR: -1.2, acf_EC_LR: 0.6,
    lnVAR_EC_RR: -1.2, acf_EC_RR: 0.6,
  },
  suspect: {
    lnVAR_activity: 1.4, acf_activity: 0.15,
    lnVAR_rumination: 1.1, acf_rumination: 0.2,
    lnVAR_temperature: 0.9, acf_temperature: 0.25,
    lnVAR_milkyield: 1.6, acf_milkyield: 0.1,
    lnVAR_EC_LF: 0.4, acf_EC_LF: 0.3,
    lnVAR_EC_RF: 0.5, acf_EC_RF: 0.3,
    lnVAR_EC_LR: 0.8, acf_EC_LR: 0.25,
    lnVAR_EC_RR: 2.4, acf_EC_RR: 0.12,
  },
};

function riskStyle(level = "") {
  const l = level.toLowerCase();
  if (l.includes("high")) return { badge: "bg-red-600 text-white", bar: "bg-red-500", text: "text-red-700", box: "border-red-300 bg-red-50" };
  if (l.includes("moderate") || l.includes("medium")) return { badge: "bg-amber-400 text-amber-950", bar: "bg-amber-400", text: "text-amber-800", box: "border-amber-300 bg-amber-50" };
  if (l.includes("low")) return { badge: "bg-lime-200 text-lime-900 border border-lime-300", bar: "bg-lime-400", text: "text-lime-800", box: "border-lime-300 bg-lime-50" };
  return { badge: "bg-emerald-600 text-white", bar: "bg-emerald-500", text: "text-emerald-700", box: "border-emerald-300 bg-emerald-50" };
}

function adviceFor(level = "") {
  const l = level.toLowerCase();
  if (l.includes("high")) return [
    "Isolate quarter & do Strip-Cup + 4-well CMT before next milking",
    "Post-milking barrier teat dip (0.5% povidone-iodine), keep cow standing 30 min",
    "Call veterinarian within 24h — share this risk report on WhatsApp",
    "Recheck with model in 48h; do NOT pool this milk in bulk tank if clots/heat",
  ];
  if (l.includes("moderate") || l.includes("medium")) return [
    "Repeat CMT in 48h + check udder heat per-quarter (LF/RF/LR/RR)",
    "Improve stall hygiene (dry bedding), ventilate shed — THI check",
    "Verify milking SOP: cluster attachment, vacuum 42 kPa, teat dip coverage",
    "Monitor rumination/activity collar drift daily for 7–14 days",
  ];
  if (l.includes("low")) return [
    "Routine watch: re-run prediction in 7 days",
    "Keep bedding dry + teat dip compliance at every milking",
    "No antibiotics needed — continue monitoring",
  ];
  return [
    "No action needed — continue 7–14 day routine monitoring",
    "Maintain milking hygiene + vaccination + nutrition schedule",
  ];
}

// Live call goes through the shared on-device engine (src/lib/predict.js →
// localModel.js, real PLS weights). predictSingle returns a labelled offline
// estimate only if local weights ever fail — `live === false` shows the notice.
export default function MastitisPredictor({ compact = false }) {
  const [values, setValues] = useState({ ...PRESETS.zeros });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [offlineNote, setOfflineNote] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyJSON = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify({ inputs: values, result }, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const set = (k, v) => setValues((p) => ({ ...p, [k]: v }));

  const predict = async () => {
    setLoading(true);
    setError("");
    setResult(null);
    setOfflineNote(false);
    try {
      const out = await predictSingle(values);
      setResult(out);
      if (out.live === false) {
        // Shared engine fell back (model asleep / CORS / offline) — say so honestly.
        setOfflineNote(true);
        setError(`${out.offlineError || "Live model unreachable"} — showing clearly-labelled offline estimate instead.`);
      }
    } catch (e) {
      // Only input-validation faults reach here now.
      const fb = offlineEstimate(values);
      setResult(fb);
      setOfflineNote(true);
      setError(`${e.message} — showing clearly-labelled offline estimate instead.`);
    } finally {
      setLoading(false);
    }
  };

  const pct = result ? Math.round(Number(result.display_score ?? 0) * 100) : 0;
  const st = result ? riskStyle(result.risk_level) : null;

  return (
    <div className="bg-white rounded-2xl border-2 border-emerald-200 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b bg-emerald-50 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center">
            <span className="material-symbols-outlined">biotech</span>
          </div>
          <div>
            <h3 className="font-jakarta font-extrabold text-sm leading-none">Mastitis Risk Predictor — 16 live features</h3>
            <p className="text-[11px] text-slate-600 mt-0.5">
              14-day quantile-regression residuals • Model:{" "}
              <a href={MODEL_URL} target="_blank" rel="noreferrer" className="text-emerald-700 underline font-bold">
                {MODEL_URL.replace("https://", "")}
              </a>
            </p>
          </div>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          <button onClick={() => { setValues({ ...PRESETS.healthy }); setResult(null); setError(""); }} className="px-2.5 py-1.5 rounded-full bg-white border text-[11px] font-bold text-emerald-800">Healthy example</button>
          <button onClick={() => { setValues({ ...PRESETS.suspect }); setResult(null); setError(""); }} className="px-2.5 py-1.5 rounded-full bg-white border text-[11px] font-bold text-amber-800">Suspect example</button>
          <button onClick={() => { setValues({ ...PRESETS.zeros }); setResult(null); setError(""); }} className="px-2.5 py-1.5 rounded-full bg-slate-100 border text-[11px] font-bold">Reset 0</button>
        </div>
      </div>

      <div className={`p-3 grid gap-3 ${compact ? "md:grid-cols-2" : "md:grid-cols-2 xl:grid-cols-4"}`}>
        {GROUPS.map((g) => (
          <fieldset key={g} className="border rounded-xl p-2.5 bg-slate-50">
            <legend className="px-1.5 text-[11px] font-extrabold text-emerald-900 flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px] text-emerald-700">{GROUP_ICON[g]}</span> {g}
            </legend>
            {FEATURE_DEFS.filter((f) => f.group === g).map((f) => (
              <label key={f.key} className="block mb-2 last:mb-0">
                <span className="flex justify-between text-[11px] font-bold text-slate-700">
                  <span>{f.label}</span>
                </span>
                <input
                  type="number"
                  step={f.step}
                  value={values[f.key]}
                  onChange={(e) => set(f.key, e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="0"
                  className="mt-0.5 w-full px-2.5 py-2 rounded-lg border bg-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <span className="text-[10px] text-slate-400">{f.hint}</span>
              </label>
            ))}
          </fieldset>
        ))}
      </div>

      <div className="px-4 pb-4">
        <button
          onClick={predict}
          disabled={loading}
          className={`w-full h-12 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 ${loading ? "bg-slate-300 text-slate-600" : "bg-emerald-700 text-white hover:bg-emerald-800"}`}
        >
          <span className="material-symbols-outlined">{loading ? "hourglass_top" : "labs"}</span>
          {loading ? "Contacting live model…" : "Predict mastitis risk (7–14 day window)"}
        </button>
        {error && <p className="mt-2 text-[11px] text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-2">{error}</p>}

        {result && st && (
          <div className={`mt-3 rounded-xl border p-4 ${st.box}`}>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className={`px-3 py-1.5 rounded-full text-xs font-extrabold ${st.badge}`}>{result.risk_level}</span>
              <span className="text-xs font-bold text-slate-600">
                Score {Number(result.raw_score).toFixed(3)} • {pct}% • 7–14d window
              </span>
            </div>
            <div className="mt-2 h-2.5 bg-white rounded-full border overflow-hidden">
              <div className={`h-full ${st.bar} rounded-full transition-all`} style={{ width: `${pct}%` }} />
            </div>
            {offlineNote && <p className="mt-1 text-[10px] font-bold text-slate-500">OFFLINE ESTIMATE — reconnect live model for official score.</p>}
            <div className="mt-2 grid sm:grid-cols-2 gap-1.5 text-xs">
              <div className="bg-white/70 rounded-lg p-2 border"><b>Risk class:</b> No / Low / Moderate / High (SIH spec)</div>
              <div className="bg-white/70 rounded-lg p-2 border"><b>Forecast:</b> risk {pct}% before clinical signs (7–14d)</div>
            </div>
            <ul className="mt-2 space-y-1 text-xs">
              {adviceFor(result.risk_level).map((a, i) => (
                <li key={i} className="flex gap-1.5"><span className="material-symbols-outlined text-[15px] text-emerald-700">check_circle</span><span>{a}</span></li>
              ))}
            </ul>
            <div className="mt-2 flex gap-2 flex-wrap">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`PathoTracer mastitis report: ${result.risk_level}, score ${result.raw_score} (${pct}%). Features: ${FEATURE_ORDER.map((k) => `${k}=${values[k]}`).join(", ")}`)}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 rounded-full bg-emerald-700 text-white text-xs font-bold"
              >
                WhatsApp report to vet
              </a>
              <button onClick={copyJSON} className="px-3 py-2 rounded-full bg-white border text-xs font-bold">
                {copied ? "Copied ✓" : "Copy JSON"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
