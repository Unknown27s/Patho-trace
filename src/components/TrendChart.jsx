import { trendDirection } from "../lib/clinical";

// Tiny dependency-free SVG line chart (no chart lib, no API key).
// `demo` flags the path as illustrative history — end point is the real value.
export default function TrendChart({ points, unit, badWhen, demo = true, height = 88 }) {
  const w = 300, h = height, pad = 8;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const span = max - min || 1;
  const stepX = (w - pad * 2) / (points.length - 1 || 1);
  const xy = points.map((v, i) => [pad + i * stepX, h - pad - ((v - min) / span) * (h - pad * 2)]);
  const line = xy.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const area = `${line} L${(w - pad).toFixed(1)},${h - pad} L${pad},${h - pad} Z`;
  const dir = trendDirection(points);
  const bad = dir !== "flat" && dir === badWhen;
  const stroke = bad ? "#dc2626" : dir === "flat" ? "#64748b" : "#059669";
  const arrow = dir === "rising" ? "↑" : dir === "falling" ? "↓" : "→";

  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height }} role="img">
        <path d={area} fill={stroke} opacity="0.12" />
        <path d={line} fill="none" stroke={stroke} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        <circle cx={xy[xy.length - 1][0]} cy={xy[xy.length - 1][1]} r="4" fill={stroke} stroke="#fff" strokeWidth="2" />
      </svg>
      <div className="flex justify-between text-[11px] text-slate-500 mt-1">
        <span>{points[0]} {unit}</span>
        <span className={`font-extrabold ${bad ? "text-red-700" : "text-emerald-700"}`}>{arrow} {points[points.length - 1]} {unit}</span>
      </div>
      {demo && <div className="text-[10px] text-slate-400">Illustrative trend • today = real recorded value</div>}
    </div>
  );
}
