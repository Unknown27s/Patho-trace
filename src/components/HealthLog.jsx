import { useState, useMemo } from "react";
import { useHerd } from "../context/HerdContext";

const TYPES = {
  farmer: ["CMT test done", "Udder swelling seen", "Clots in milk", "Treatment given", "Cow recovered"],
  doctor: ["CMT test done", "Udder swelling seen", "Clots in milk", "Treatment given", "Lab sample sent", "Cow recovered", "Culled / lost quarter"],
};
const QUARTERS = ["Whole udder", "LF", "RF", "LR", "RR"];
const OUTCOMES = ["open", "recovering", "recovered", "referred", "chronic"];

// Shared mastitis event/treatment log (per-cow, localStorage-backed).
// Farmer records simply; doctor reviews + sets outcomes + sees withdrawal.
export default function HealthLog({ cowId, role }) {
  const { cowEvents, addEvent, setOutcome } = useHerd();
  const list = cowEvents(cowId);
  const [type, setType] = useState(TYPES[role === "doctor" ? "doctor" : "farmer"][0]);
  const [quarter, setQuarter] = useState("Whole udder");
  const [note, setNote] = useState("");
  const [wdays, setWdays] = useState("");

  const submit = (e) => {
    e.preventDefault();
    addEvent(cowId, {
      type, quarter, note: note.trim(),
      treatment: type === "Treatment given" ? note.trim() || "Treatment recorded" : "",
      withdrawalDays: type === "Treatment given" ? Number(wdays) || 0 : 0,
    });
    setNote(""); setWdays("");
  };

  // Active milk-withdrawal banner (memoized so the date math doesn't re-run per render)
  const activeWd = useMemo(() => list.find((ev) => (Number(ev.withdrawalDays) || 0) > 0 && ev.outcome !== "recovered" &&
    Date.now() - new Date(ev.at).getTime() < Number(ev.withdrawalDays) * 86400000), [list]);
  const wdUntil = activeWd ? new Date(new Date(activeWd.at).getTime() + Number(activeWd.withdrawalDays) * 86400000).toLocaleDateString() : null;

  return (
    <div className="bg-white rounded-2xl border p-4 space-y-3">
      <h3 className="font-extrabold text-sm flex items-center gap-2">
        <span className="material-symbols-outlined text-emerald-700">clinical_notes</span>
        {role === "doctor" ? "Treatment & event history" : "Mastitis diary — write what you see"} ({list.length})
      </h3>

      {wdUntil && (
        <p className="text-xs font-bold bg-red-50 border border-red-200 text-red-700 rounded-lg p-2">
          🥛 Milk discard: do NOT mix this cow's milk until <b>{wdUntil}</b> (treatment withdrawal).
        </p>
      )}

      <form onSubmit={submit} className="grid sm:grid-cols-2 gap-2 text-xs">
        <label className="font-bold">What happened?
          <select value={type} onChange={(e) => setType(e.target.value)} className="mt-1 w-full px-2.5 py-2 rounded-lg border bg-slate-50 font-normal">
            {TYPES[role === "doctor" ? "doctor" : "farmer"].map((o) => <option key={o}>{o}</option>)}
          </select>
        </label>
        <label className="font-bold">Quarter
          <select value={quarter} onChange={(e) => setQuarter(e.target.value)} className="mt-1 w-full px-2.5 py-2 rounded-lg border bg-slate-50 font-normal">
            {QUARTERS.map((o) => <option key={o}>{o}</option>)}
          </select>
        </label>
        <label className="font-bold sm:col-span-2">{role === "doctor" ? "Clinical note" : "Note (simple words)"}
          <input value={note} onChange={(e) => setNote(e.target.value)} placeholder={role === "doctor" ? "Findings, drug + dose…" : "e.g. right side hot, milk thick…"} className="mt-1 w-full px-2.5 py-2 rounded-lg border bg-slate-50 font-normal" />
        </label>
        {type === "Treatment given" && (
          <label className="font-bold">Milk discard days
            <input type="number" min="0" value={wdays} onChange={(e) => setWdays(e.target.value)} placeholder="e.g. 4" className="mt-1 w-full px-2.5 py-2 rounded-lg border bg-slate-50 font-normal" />
          </label>
        )}
        <div className="sm:col-span-2">
          <button className="px-4 h-10 rounded-xl bg-emerald-700 text-white text-xs font-extrabold">+ Save entry</button>
        </div>
      </form>

      <div className="space-y-1.5">
        {list.length === 0 && <p className="text-xs text-slate-400">No entries yet — first entry takes 10 seconds.</p>}
        {list.map((ev) => (
          <div key={ev.id} className="flex items-start justify-between gap-2 bg-slate-50 border rounded-xl p-2 text-xs">
            <div className="min-w-0">
              <div className="font-bold">{ev.type} <span className="font-normal text-slate-500">• {ev.quarter} • {new Date(ev.at).toLocaleString()}</span></div>
              {ev.note && <div className="text-slate-600 truncate">{ev.note}</div>}
              {Number(ev.withdrawalDays) > 0 && <div className="text-red-600 font-bold">Discard milk: {ev.withdrawalDays} days</div>}
            </div>
            {role === "doctor" ? (
              <select value={ev.outcome} onChange={(e) => setOutcome(cowId, ev.id, e.target.value)} className="px-2 py-1.5 rounded-lg border bg-white font-bold flex-shrink-0">
                {OUTCOMES.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            ) : (
              <span className="px-2 py-1 rounded-full bg-white border font-bold flex-shrink-0">{ev.outcome}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
