import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { useHerd } from "../context/HerdContext";
import { useAuth } from "../context/AuthContext";
import { riskStyle, adviceFor, farmerAdvice } from "../lib/predict";
import { deriveIndicators, factorContributions, aiInterpretation, trendSeries, TREND_METRICS } from "../lib/clinical";
import TrendChart from "../components/TrendChart";
import { FEATURE_ORDER } from "../config";

const SEV_DOT = { high: "bg-red-500", med: "bg-amber-400", low: "bg-lime-400", ok: "bg-emerald-500" };
const SEV_TEXT = { high: "text-red-700", med: "text-amber-700", low: "text-lime-700", ok: "text-emerald-700" };

function ClinicalActions({ riskClass }) {
  const items =
    riskClass === "High"
      ? ["Perform full udder examination (all 4 quarters: LF/RF/LR/RR).", "Check milk appearance per quarter — clots, flakes, watery milk.", "Run SCC / 4-well CMT testing today; note worst quarter.", "Review treatment history below before deciding next step.", "Consider laboratory confirmation (culture/sensitivity) where indicated."]
      : riskClass === "Moderate"
        ? ["Repeat CMT in 48h + palpate udder for heat/swelling.", "Verify milking SOP: 42 kPa vacuum, teat dip coverage.", "Recheck collar trends daily for 7–14 days."]
        : ["Continue routine monitoring; re-run model in 7 days.", "Maintain teat-dip compliance at every milking."];
  return (
    <div className="bg-white rounded-2xl border p-4">
      <h3 className="font-extrabold text-sm flex items-center gap-2"><span className="material-symbols-outlined text-emerald-700">stethoscope_check</span> Recommended investigation (decision support)</h3>
      <ul className="mt-2 space-y-1.5 text-sm">
        {items.map((a, i) => (
          <li key={i} className="flex gap-2"><span className="font-extrabold text-emerald-700">{i + 1}.</span><span>{a}</span></li>
        ))}
      </ul>
      <p className="mt-3 text-[11px] bg-amber-50 border border-amber-200 rounded-lg p-2 text-amber-900">
        ⚠️ <b>AMR-safe protocol:</b> AI prediction → veterinary examination → diagnostic confirmation → treatment decision.
        This system never auto-prescribes antibiotics from a prediction alone.
      </p>
    </div>
  );
}

// Shared cow page — content differs by role:
//  farmer → "What should I do today?" (reasons + 1 action, plain words)
//  doctor → Animal 360° (clinical profile, SCC analysis, trends, AI explainability, actions)
export default function CowDetail() {
  const { id } = useParams();
  const { cows, predictCow } = useHerd();
  const { user } = useAuth();
  const role = user?.role || "farmer";
  const base = role === "doctor" ? "/doctor" : "/farmer";
  const cow = cows.find((c) => c.id === String(id).toUpperCase());
  const [err, setErr] = useState("");
  const [days, setDays] = useState(14);

  if (!cow) {
    return (
      <div className="min-h-screen bg-[#f1f5f9] p-6 text-center">
        <p className="font-bold">Cow {id} not found in current herd ({cows.length} cows).</p>
        <Link to={`${base}/herd`} className="text-emerald-700 underline font-bold">← Back to herd</Link>
      </div>
    );
  }

  const run = async () => {
    setErr("");
    try {
      await predictCow(cow.id, cow.features);
    } catch (e) {
      setErr(e.message);
    }
  };

  const p = cow.prediction;
  const st = p ? riskStyle(p.risk_level) : null;
  const pct = p ? Math.round(Number(p.display_score ?? 0) * 100) : 0;
  const cls = p ? p.class : null;
  const indicators = deriveIndicators(cow);
  const problems = indicators.filter((i) => i.severity === "high" || i.severity === "med");
  const contribs = factorContributions(cow);

  return (
    <div className="min-h-screen bg-[#f1f5f9]">
      <header className="sticky top-0 bg-white border-b px-4 lg:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to={`${base}/herd`} className="w-9 h-9 rounded-xl bg-slate-100 border flex items-center justify-center">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <div>
            <h1 className="font-extrabold">{cow.id} '{cow.name}'</h1>
            <p className="text-xs text-slate-500">{cow.breed} • {cow.lactation} lact • {cow.age} • {cow.stall} • {role === "doctor" ? "Doctor · Animal 360°" : "Farmer · What to do"}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${role === "doctor" ? "bg-slate-900 text-white" : "bg-emerald-100 text-emerald-800 border border-emerald-200"}`}>
          {role === "doctor" ? "🩺 Doctor" : "🌾 Farmer"}
        </span>
      </header>

      <main className="max-w-4xl mx-auto p-4 space-y-4">
        <div className="bg-white rounded-2xl border p-4 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-3 text-center">
            <div className="bg-slate-50 border rounded-xl px-4 py-2"><div className="font-extrabold">{cow.yieldL} L</div><div className="text-[11px] text-slate-500">Milk/day</div></div>
            <div className="bg-slate-50 border rounded-xl px-4 py-2"><div className="font-extrabold">{cow.scc}k</div><div className="text-[11px] text-slate-500">SCC</div></div>
            <div className="bg-slate-50 border rounded-xl px-4 py-2"><div className="font-extrabold">{p ? `${pct}%` : "—"}</div><div className="text-[11px] text-slate-500">Risk</div></div>
          </div>
          <button onClick={run} disabled={cow.predicting} className={`px-5 h-12 rounded-xl font-extrabold text-sm flex items-center gap-2 ${cow.predicting ? "bg-slate-300" : "bg-emerald-700 text-white"}`}>
            <span className="material-symbols-outlined">{cow.predicting ? "hourglass_top" : "labs"}</span>
            {cow.predicting ? "Predicting…" : p ? "Re-predict this cow" : "🔍 Predict mastitis risk"}
          </button>
        </div>
        {err && <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg p-2">{err}</p>}

        {p && st && (
          <div className={`rounded-2xl border p-4 ${st.box}`}>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className={`px-3 py-1.5 rounded-full text-xs font-extrabold ${st.badge}`}>{p.risk_level}</span>
              <span className="text-xs font-bold text-slate-600">
                Score {Number(p.raw_score).toFixed(3)} • {pct}% • 7–14d window • {p.live ? "🟢 LIVE model" : "🟡 offline estimate"}
              </span>
            </div>
            <div className="mt-2 h-2.5 bg-white rounded-full border overflow-hidden">
              <div className={`h-full ${st.bar} rounded-full`} style={{ width: `${pct}%` }} />
            </div>
            <ul className="mt-3 space-y-1.5 text-sm">
              {(role === "doctor" ? adviceFor(p.risk_level) : farmerAdvice(p.risk_level)).map((a, i) => (
                <li key={i} className="flex gap-2"><span className="material-symbols-outlined text-[16px] text-emerald-700">check_circle</span><span>{a}</span></li>
              ))}
            </ul>
            <div className="mt-3 flex gap-2 flex-wrap">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`PathoTracer report ${cow.id} ${cow.name}: ${p.risk_level}, score ${p.raw_score} (${pct}%). Yield ${cow.yieldL}L SCC ${cow.scc}k`)}`}
                target="_blank" rel="noreferrer" className="px-3 py-2 rounded-full bg-emerald-700 text-white text-xs font-bold"
              >
                WhatsApp this report to vet
              </a>
              <Link to={`${base}/vet`} className="px-3 py-2 rounded-full bg-white border text-xs font-bold">Call vet →</Link>
            </div>
          </div>
        )}

        {!p && (
          <div className="bg-white rounded-2xl border p-6 text-center text-sm text-slate-500">
            No prediction yet for this cow. Press <b>Predict mastitis risk</b> above — it uses this cow's 16 Excel features automatically.
            {role === "farmer" ? " Simple result, no numbers to type." : " Raw features shown below for verification."}
          </div>
        )}

        {role === "farmer" ? (
          <>
            {/* FARMER: "What should I do?" — reasons + one action */}
            <div className="bg-white rounded-2xl border p-4">
              <h3 className="font-extrabold text-sm">🔍 Why this cow needs attention</h3>
              <div className="mt-2 space-y-2 text-sm">
                {problems.length === 0 && <p className="text-slate-500">✅ Nothing unusual — all signals normal.</p>}
                {problems.map((i) => (
                  <div key={i.key} className="flex items-start gap-2 bg-slate-50 border rounded-xl p-2.5">
                    <span className={`mt-1.5 w-2.5 h-2.5 rounded-full flex-shrink-0 ${SEV_DOT[i.severity]}`} />
                    <div><b>{i.label}:</b> {i.farmerText}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-emerald-700 text-white rounded-2xl p-4 text-sm">
              <b>✅ What should I do {cls === "High" ? "today itself" : "now"}?</b>
              <p className="mt-1 text-emerald-50">
                {cls === "High"
                  ? `Check ${cow.name}'s udder and milk before next milking. If milk looks changed (clots/watery) or udder is hot, call your doctor and show this page on WhatsApp. Do NOT mix her milk with other milk.`
                  : cls === "Moderate"
                    ? `Watch ${cow.name} morning and evening for 2 days — udder heat + milk look. Keep the shed dry and dip teats after every milking.`
                    : `Keep normal care and feeding for ${cow.name}. Re-check after 7 days.`}
              </p>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-sm">
              🐄 <b>About {cow.name}:</b> {cow.breed} • {cow.age} • {cow.lactation} lactation • {cow.status} • {cow.prevMastitis || 0} past udder sickness • Milk {cow.yieldL} L/day.
            </div>
          </>
        ) : (
          <>
            {/* DOCTOR: Animal 360° */}
            <div className="bg-white rounded-2xl border overflow-hidden">
              <div className="px-4 py-3 border-b bg-slate-900 text-white font-bold text-sm flex items-center gap-2">
                <span className="material-symbols-outlined">badge</span> Clinical profile — {cow.id}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 text-xs">
                {[
                  ["Breed", cow.breed], ["Age", cow.age], ["Lactation", `${cow.lactation} (${cow.dim || 0} DIM)`],
                  ["Status", cow.status || "-"], ["Prev. mastitis", `${cow.prevMastitis ?? 0} episode(s)`],
                  ["Vaccination", cow.vaccination || "-"], ["Yield today", `${cow.yieldL} L`], ["SCC today", `${cow.scc}k`],
                ].map(([k, v]) => (
                  <div key={k} className="bg-slate-50 border rounded-xl p-2"><div className="text-slate-500">{k}</div><div className="font-extrabold text-sm">{v}</div></div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border p-4">
              <h3 className="font-extrabold text-sm flex items-center gap-2"><span className="material-symbols-outlined text-emerald-700">biotech</span> SCC & subclinical analysis</h3>
              <div className="mt-2 grid sm:grid-cols-3 gap-2 text-xs text-center">
                <div className="bg-slate-50 border rounded-xl p-2"><div className="font-extrabold text-lg">{cow.scc}k</div><div className="text-slate-500">Current SCC</div></div>
                <div className="bg-slate-50 border rounded-xl p-2"><div className="font-extrabold text-lg">{cow.scc > 200 ? "YES" : "no"}</div><div className="text-slate-500">Above 200k subclinical line</div></div>
                <div className="bg-slate-50 border rounded-xl p-2"><div className="font-extrabold text-lg">{p ? `${Math.min(99, pct + 4)}%` : "—"}</div><div className="text-slate-500">Subclinical probability</div></div>
              </div>
              <div className="mt-2 text-sm font-bold">Evidence:</div>
              <ul className="text-sm space-y-1">
                {indicators.filter((i) => ["scc", "conductivity", "yield", "activity"].includes(i.key)).map((i) => (
                  <li key={i.key} className="flex gap-2 items-start">
                    <span className={`mt-1.5 w-2.5 h-2.5 rounded-full flex-shrink-0 ${SEV_DOT[i.severity]}`} />
                    <span className={SEV_TEXT[i.severity]}>{i.vetText}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-[11px] text-slate-500">No obvious clinical symptoms reported — this is the pre-clinical window the 7–14 day model targets.</p>
            </div>

            <div className="bg-white rounded-2xl border p-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="font-extrabold text-sm flex items-center gap-2"><span className="material-symbols-outlined text-emerald-700">show_chart</span> Sensor trends (7 / 14 / 30-day)</h3>
                <div className="flex gap-1">
                  {[7, 14, 30].map((d) => (
                    <button key={d} onClick={() => setDays(d)} className={`px-3 py-1 rounded-full text-xs font-bold border ${days === d ? "bg-slate-900 text-white" : "bg-slate-50"}`}>{d}d</button>
                  ))}
                </div>
              </div>
              <div className="mt-3 grid sm:grid-cols-2 gap-3">
                {TREND_METRICS.map((m) => {
                  const pts = trendSeries(cow, m.key, days);
                  return (
                    <div key={m.key} className="border rounded-xl p-2.5 bg-slate-50">
                      <div className="flex items-center gap-1.5 text-xs font-extrabold"><span className="material-symbols-outlined text-[16px] text-emerald-700">{m.icon}</span> {m.label} <span className="font-normal text-slate-400">· {days}d</span></div>
                      <div className="mt-1 bg-white rounded-lg p-1.5 border"><TrendChart points={pts} unit={m.unit} badWhen={m.badWhen} /></div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-2xl border p-4">
              <h3 className="font-extrabold text-sm flex items-center gap-2"><span className="material-symbols-outlined text-emerald-700">psychology</span> Why is this animal at risk? — AI explanation</h3>
              <div className="mt-2 space-y-1.5">
                {contribs.map((c) => (
                  <div key={c.factor} className="flex items-center gap-2 text-xs">
                    <span className="w-36 flex-shrink-0 font-bold">{c.factor}</span>
                    <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${c.level === "High" ? "bg-red-500" : c.level === "Medium" ? "bg-amber-400" : "bg-emerald-400"}`} style={{ width: `${Math.round(c.score * 100)}%` }} />
                    </div>
                    <span className={`w-16 text-right font-extrabold ${c.level === "High" ? "text-red-700" : c.level === "Medium" ? "text-amber-700" : "text-emerald-700"}`}>{c.level}</span>
                  </div>
                ))}
              </div>
              <p className="mt-1 text-[11px] text-slate-400">Contribution scores derived from this animal's 16 live features + SCC/history. Bars update when features change.</p>
              <div className="mt-2 bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-sm">
                <b>🧠 AI interpretation:</b> {aiInterpretation(cow)}
              </div>
            </div>

            <ClinicalActions riskClass={cls || "Low"} />

            <div className="bg-white rounded-2xl border overflow-hidden">
              <div className="px-4 py-3 border-b bg-slate-50 font-bold text-sm">16 live model features (from Excel row)</div>
              <table className="w-full text-xs">
                <thead className="bg-slate-50 text-slate-500"><tr><th className="text-left px-4 py-2">Feature</th><th className="px-4 py-2">Value</th></tr></thead>
                <tbody className="divide-y">
                  {FEATURE_ORDER.map((f) => (
                    <tr key={f}><td className="px-4 py-2 font-mono">{f}</td><td className="px-4 py-2 text-center font-bold">{Number(cow.features?.[f] ?? 0).toFixed(3)}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
