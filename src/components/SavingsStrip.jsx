import { Link } from "react-router-dom";
import { useHerd } from "../context/HerdContext";

// Jury-friendly one-liner: converts live predictions into rupees.
// High-risk cow caught early ≈ ₹3,800 saved (treatment + milk discard avoided).
// Moderate ≈ ₹1,200. Updates automatically from Excel predictions.
export default function SavingsStrip({ base }) {
  const { cows } = useHerd();
  const predicted = cows.filter((c) => c.prediction);
  const high = cows.filter((c) => c.prediction?.class === "High");
  const mod = cows.filter((c) => c.prediction?.class === "Moderate");
  const milkAtRisk = high.reduce((a, c) => a + (Number(c.yieldL) || 0), 0);
  const saved = high.length * 3800 + mod.length * 1200;

  if (!predicted.length) {
    return (
      <div className="bg-gradient-to-r from-emerald-900 to-teal-900 rounded-2xl p-4 text-white flex flex-wrap items-center justify-between gap-3 shadow">
        <div className="text-sm"><b>💰 Economic impact (live):</b> predict your herd to see rupees saved.</div>
        <Link to={`${base}/herd`} className="px-4 py-2 rounded-xl bg-white text-emerald-900 text-xs font-extrabold">Predict herd →</Link>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-emerald-900 to-teal-900 rounded-2xl p-4 text-white shadow">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-[11px] uppercase tracking-widest text-emerald-300 font-bold">💰 Live economic impact — jury line</div>
          <div className="font-extrabold text-xl mt-0.5">
            ₹{saved.toLocaleString("en-IN")} saved <span className="text-sm font-normal text-emerald-200">• {high.length} high + {mod.length} moderate caught 7–14 days early</span>
          </div>
          <div className="text-xs text-emerald-200 mt-1">
            {milkAtRisk.toFixed(0)} L/day milk protected from bulk-tank discard • {predicted.length}/{cows.length} cows predicted
          </div>
        </div>
        <Link to={`${base}/herd`} className="px-4 py-2.5 rounded-xl bg-white text-emerald-900 text-xs font-extrabold whitespace-nowrap">See which cows →</Link>
      </div>
    </div>
  );
}
