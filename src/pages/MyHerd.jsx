import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { useHerd } from "../context/HerdContext";
import { deriveIndicators } from "../lib/clinical";
import LanguageSwitcher from "../components/LanguageSwitcher";
import HerdUpload from "../components/HerdUpload";
import { useAudioBriefing } from "../hooks/useAudioBriefing";

export default function MyHerd() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const role = user?.role || "farmer";
  const base = role === "doctor" ? "/doctor" : "/farmer";
  const { playing, toggle } = useAudioBriefing();
  const { cows, predictCow, predictAll, source } = useHerd();
  const [filter, setFilter] = useState("All");
  const [q, setQ] = useState("");
  const [busyAll, setBusyAll] = useState(false);

  const filtered = cows.filter((h) => {
    const label = h.prediction ? h.prediction.class : "";
    const matchF = filter === "All" || (label && label.includes(filter)) || (!h.prediction && filter === "Unpredicted");
    const matchQ = q === "" || h.name.toLowerCase().includes(q.toLowerCase()) || h.id.toLowerCase().includes(q.toLowerCase());
    return matchF && matchQ;
  });

  const runAll = async () => {
    setBusyAll(true);
    try {
      await predictAll();
    } finally {
      setBusyAll(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9]">
      <header className="sticky top-0 z-20 bg-white border-b px-4 lg:px-6 py-3 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <Link to={base} className="w-9 h-9 rounded-xl bg-slate-100 border flex items-center justify-center flex-shrink-0"><span className="material-symbols-outlined">arrow_back</span></Link>
          <div className="min-w-0"><h1 className="font-jakarta font-extrabold truncate">{t("navHerd")} — {cows.length} Animals {role === "doctor" ? "(Doctor)" : "(Farmer)"}</h1><p className="text-xs text-slate-500 truncate">Source: {source} • {t("herdSub")}</p></div></div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher compact />
          <button onClick={toggle} className={`h-9 px-3 rounded-full text-xs font-bold flex items-center gap-1 ${playing ? "bg-red-600 text-white" : "bg-emerald-700 text-white"}`}><span className="material-symbols-outlined text-[16px]">{playing ? "pause" : "volume_up"}</span> {playing ? t("briefingPlaying") : t("audioBriefingShort")}</button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 lg:p-6 space-y-4">
        <HerdUpload autoPredict />

        <div className="bg-white rounded-2xl border p-4 flex flex-wrap gap-3 items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {["All", "High", "Moderate", "Low", "No Risk", "Unpredicted"].map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-full text-xs font-bold border ${filter === f ? "bg-emerald-700 text-white border-emerald-700" : "bg-slate-50"}`}>{f}</button>
            ))}
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search ID / Name" className="px-3 py-2 rounded-xl border text-sm bg-slate-50 w-full sm:w-56" />
            <button onClick={runAll} disabled={busyAll} className="px-3 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold whitespace-nowrap">
              {busyAll ? "Predicting…" : "🤖 Predict all"}
            </button>
          </div>
        </div>

        {role === "farmer" ? (
          // FARMER: big simple cards, tap cow → prediction page, plain words
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((h) => {
              const p = h.prediction;
              const badge = !p ? "bg-slate-100 text-slate-600" : p.class === "High" ? "bg-red-600 text-white" : p.class === "Moderate" ? "bg-amber-100 text-amber-800" : p.class === "Low" ? "bg-lime-100 text-lime-800" : "bg-emerald-100 text-emerald-700";
              const topReason = (deriveIndicators(h).find((i) => i.severity === "high" || i.severity === "med") || {}).farmerText;
              return (
                <Link key={h.id} to={`${base}/cow/${h.id}`} className="bg-white rounded-2xl border p-4 space-y-3 hover:border-emerald-400 transition block">
                  <div className="flex justify-between items-start">
                    <div><div className="font-bold">{h.id} '{h.name}'</div><div className="text-xs text-slate-500">{h.breed} • {h.lactation} • {h.age}</div></div>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${badge}`}>
                      {h.predicting ? "⏳…" : p ? `${p.class} ${Math.round(p.display_score * 100)}%` : "Tap → Predict"}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs text-center">
                    <div className="bg-slate-50 border rounded-xl p-2"><div className="font-bold">{h.yieldL}L</div><div className="text-slate-500">Milk</div></div>
                    <div className="bg-slate-50 border rounded-xl p-2"><div className="font-bold">{h.scc}k</div><div className="text-slate-500">SCC</div></div>
                    <div className="bg-slate-50 border rounded-xl p-2"><div className="font-bold">{p ? (p.live ? "🟢 Live" : "🟡 Est.") : "—"}</div><div className="text-slate-500">Result</div></div>
                  </div>
                  <div className="h-11 rounded-xl bg-emerald-700 text-white flex items-center justify-center text-xs font-bold gap-1">
                    <span className="material-symbols-outlined text-[18px]">labs</span> {p ? "See result & advice →" : "🔍 Tap to predict →"}
                  </div>
                  {topReason && <div className="text-[11px] text-slate-500">Reason: {topReason}</div>}
                </Link>
              );
            })}
          </div>
        ) : (
          // DOCTOR: full clinical table with per-quarter features + actions
          <div className="bg-white rounded-2xl border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[11px]">
                  <tr><th className="px-4 py-3 text-left">Animal</th><th className="px-3 py-3">Milk / SCC</th><th className="px-3 py-3">EC RR (key)</th><th className="px-3 py-3">Risk</th><th className="px-3 py-3">Model</th><th className="px-3 py-3">Action</th></tr>
                </thead>
                <tbody className="divide-y">
                  {filtered.map((h) => {
                    const p = h.prediction;
                    return (
                      <tr key={h.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3"><Link to={`${base}/cow/${h.id}`} className="font-bold text-emerald-800 underline">{h.id} '{h.name}'</Link><div className="text-slate-500">{h.breed} • {h.lactation} • {h.stall}</div></td>
                        <td className="px-3 py-3 text-center font-bold">{h.yieldL} L / {h.scc}k</td>
                        <td className="px-3 py-3 text-center font-mono">lnVAR {Number(h.features?.lnVAR_EC_RR ?? 0).toFixed(2)}</td>
                        <td className="px-3 py-3 text-center">
                          {h.predicting ? "⏳…" : p ? <span className="px-2 py-1 rounded-full font-bold bg-slate-900 text-white">{p.class} {Math.round(p.display_score * 100)}%</span> : <span className="text-slate-400">—</span>}
                        </td>
                        <td className="px-3 py-3 text-center">{p ? (p.live ? "🟢 live" : "🟡 offline") : "—"}</td>
                        <td className="px-3 py-3 text-center whitespace-nowrap">
                          <button onClick={() => predictCow(h.id, h.features)} disabled={h.predicting} className="px-3 py-1.5 rounded-full bg-emerald-700 text-white font-bold text-xs mr-1">Predict</button>
                          <Link to={`${base}/cow/${h.id}`} className="px-3 py-1.5 rounded-full bg-slate-100 border font-bold text-xs">Open</Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="px-4 py-2 text-[11px] text-slate-400">Doctor table reads the same Excel 16-feature rows. Click Predict per row, or Predict-all above (automatic). Full feature audit inside each cow page.</p>
          </div>
        )}
      </main>
    </div>
  );
}
