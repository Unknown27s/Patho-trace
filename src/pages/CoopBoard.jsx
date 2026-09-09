import { Link } from "react-router-dom";
import { useHerd } from "../context/HerdContext";
import LanguageSwitcher from "../components/LanguageSwitcher";

// Dairy Cooperative / herd-manager board (doctor portal only).
// Aggregated KPIs + farm-unit comparison + schematic cluster map.
// No individual sensor detail here — that lives in Animal 360°.
export default function CoopBoard() {
  const { cows, source } = useHerd();

  const predicted = cows.filter((c) => c.prediction);
  const by = (cls) => cows.filter((c) => c.prediction?.class === cls).length;
  const high = by("High"), mod = by("Moderate"), low = by("Low"), no = by("No Risk");
  const unpredicted = cows.length - predicted.length;
  // Industry udder-health target: <20% of animals with iSCC ≥ 200k
  const over200 = cows.filter((c) => Number(c.scc) >= 200).length;
  const over200Pct = cows.length ? Math.round((over200 / cows.length) * 100) : 0;
  const targetMet = over200Pct < 20;
  const avgScc = cows.length ? Math.round(cows.reduce((a, c) => a + (Number(c.scc) || 0), 0) / cows.length) : 0;
  const avgYield = cows.length ? (cows.reduce((a, c) => a + (Number(c.yieldL) || 0), 0) / cows.length).toFixed(1) : 0;
  const totalMilk = cows.reduce((a, c) => a + (Number(c.yieldL) || 0), 0);
  // Production loss: high-risk cows assumed to lose ~12% yield, moderate ~6%
  const lossL = cows.reduce((a, c) => {
    if (c.prediction?.class === "High") return a + (Number(c.yieldL) || 0) * 0.12;
    if (c.prediction?.class === "Moderate") return a + (Number(c.yieldL) || 0) * 0.06;
    return a;
  }, 0);

  // Farm units = stall/shed groups from Excel
  const farms = {};
  cows.forEach((c) => {
    const k = c.stall || "Unassigned";
    farms[k] = farms[k] || { name: k, animals: 0, high: 0, sccSum: 0, milk: 0 };
    farms[k].animals += 1;
    if (c.prediction?.class === "High") farms[k].high += 1;
    farms[k].sccSum += Number(c.scc) || 0;
    farms[k].milk += Number(c.yieldL) || 0;
  });
  const farmRows = Object.values(farms).map((f) => ({
    ...f,
    avgScc: Math.round(f.sccSum / f.animals),
    risk: f.high >= 2 ? "High" : f.high === 1 ? "Moderate" : "Low",
  })).sort((a, b) => b.high - a.high);

  const dist = [
    { label: "Normal", n: no, color: "bg-emerald-500" },
    { label: "Low", n: low, color: "bg-lime-400" },
    { label: "Moderate", n: mod, color: "bg-amber-400" },
    { label: "High", n: high, color: "bg-red-500" },
    { label: "Unpredicted", n: unpredicted, color: "bg-slate-300" },
  ];

  return (
    <div className="min-h-screen bg-[#f1f5f9]">
      <header className="sticky top-0 bg-white border-b px-4 lg:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/doctor" className="w-9 h-9 rounded-xl bg-slate-100 border flex items-center justify-center"><span className="material-symbols-outlined">arrow_back</span></Link>
          <div><h1 className="font-extrabold">Co-op Board — herd overview</h1><p className="text-xs text-slate-500">{cows.length} animals • source: {source} • manager view, no sensor detail</p></div>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher compact />
          <Link to="/doctor/herd" className="px-3 py-2 rounded-full bg-emerald-700 text-white text-xs font-bold">Open herd table →</Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 space-y-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-white rounded-2xl border p-4"><div className="text-xs text-slate-500 font-bold">Total animals</div><div className="font-extrabold text-3xl">{cows.length}</div><div className="text-xs text-slate-400">{predicted.length} predicted</div></div>
          <div className="bg-white rounded-2xl border p-4"><div className="text-xs text-slate-500 font-bold">New suspected cases</div><div className="font-extrabold text-3xl text-red-600">{high + mod}</div><div className="text-xs text-slate-400">{high} high • {mod} moderate</div></div>
          <div className="bg-white rounded-2xl border p-4"><div className="text-xs text-slate-500 font-bold">Avg SCC / Avg yield</div><div className="font-extrabold text-3xl">{avgScc}k</div><div className="text-xs text-slate-400">{avgYield} L/cow • {totalMilk.toFixed(0)} L/day</div></div>
          <div className="bg-white rounded-2xl border border-red-200 p-4"><div className="text-xs text-red-600 font-bold">Est. production loss</div><div className="font-extrabold text-3xl text-red-600">{lossL.toFixed(0)} L</div><div className="text-xs text-slate-400">≈ ₹{Math.round(lossL * 40).toLocaleString("en-IN")}/day at ₹40/L</div></div>
        </div>

        <div className={`rounded-2xl border p-4 flex flex-wrap items-center justify-between gap-2 ${targetMet ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"}`}>
          <div className="text-sm">
            <b>🎯 Herd udder-health target:</b> under 20% of animals with SCC ≥ 200k —
            now <b className={targetMet ? "text-emerald-700" : "text-red-700"}>{over200Pct}% ({over200}/{cows.length})</b> → {targetMet ? "TARGET MET ✓" : "ACTION NEEDED — screen high-SCC cows, divert their milk"}
          </div>
          <div className="w-full sm:w-64 h-2.5 bg-white rounded-full border overflow-hidden">
            <div className={`h-full rounded-full ${targetMet ? "bg-emerald-500" : "bg-red-500"}`} style={{ width: `${Math.min(100, over200Pct)}%` }} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border p-4">
          <h3 className="font-extrabold text-sm">Risk distribution</h3>
          <div className="mt-2 flex h-4 rounded-full overflow-hidden border">
            {dist.filter((d) => d.n > 0).map((d) => (
              <div key={d.label} className={d.color} style={{ width: `${(d.n / cows.length) * 100}%` }} title={`${d.label}: ${d.n}`} />
            ))}
          </div>
          <div className="mt-2 flex flex-wrap gap-3 text-xs">
            {dist.map((d) => (
              <span key={d.label} className="flex items-center gap-1.5"><span className={`w-2.5 h-2.5 rounded-full ${d.color}`} />{d.label} <b>{d.n}</b></span>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border overflow-hidden">
          <div className="px-4 py-3 border-b font-extrabold text-sm">Farm-unit comparison (grouped by shed/stall from Excel)</div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[11px]"><tr><th className="text-left px-4 py-2">Farm unit</th><th className="px-3 py-2">Animals</th><th className="px-3 py-2">High risk</th><th className="px-3 py-2">Avg SCC</th><th className="px-3 py-2">Milk/day</th><th className="px-3 py-2">Risk</th></tr></thead>
              <tbody className="divide-y">
                {farmRows.map((f) => (
                  <tr key={f.name}>
                    <td className="px-4 py-2 font-bold">{f.name}</td>
                    <td className="px-3 py-2 text-center">{f.animals}</td>
                    <td className="px-3 py-2 text-center font-bold text-red-700">{f.high}</td>
                    <td className="px-3 py-2 text-center">{f.avgScc}k</td>
                    <td className="px-3 py-2 text-center">{f.milk.toFixed(0)} L</td>
                    <td className="px-3 py-2 text-center"><span className={`px-2 py-0.5 rounded-full font-bold ${f.risk === "High" ? "bg-red-100 text-red-700" : f.risk === "Moderate" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-700"}`}>{f.risk}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl border p-4">
          <h3 className="font-extrabold text-sm flex items-center gap-2"><span className="material-symbols-outlined text-emerald-700">map</span> Cluster map (schematic — demo positions)</h3>
          <svg viewBox="0 0 400 180" className="mt-2 w-full rounded-xl border bg-emerald-50/50" style={{ height: 190 }} role="img" aria-label="Schematic cluster map">
            <rect x="0" y="0" width="400" height="180" fill="#ecfdf5" />
            {farmRows.map((f, i) => {
              const x = 50 + ((i * 97) % 300);
              const y = 40 + ((i * 61) % 100);
              const color = f.risk === "High" ? "#dc2626" : f.risk === "Moderate" ? "#f59e0b" : "#059669";
              return (
                <g key={f.name}>
                  {f.risk === "High" && <circle cx={x} cy={y} r="22" fill="#dc2626" opacity="0.15" />}
                  <circle cx={x} cy={y} r="10" fill={color} stroke="#fff" strokeWidth="2" />
                  <text x={x} y={y + 26} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#334155">{f.name} ({f.high}🔴)</text>
                </g>
              );
            })}
          </svg>
          <p className="mt-1 text-[11px] text-slate-400">Pin colour = unit risk. Positions illustrative — wire to GPS collars + Leaflet/OpenStreetMap (no API key needed) for a live authority GIS map.</p>
        </div>
      </main>
    </div>
  );
}
