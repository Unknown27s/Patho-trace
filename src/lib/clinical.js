// Clinical derivation layer — turns the 16 model features + Excel row
// into role-specific explanations. No API keys, no backend: pure functions.
//
//  Farmer  → plain reason lines  ("Milk down 12% — check udder today")
//  Vet     → factor contributions + evidence + trend series (demo-labelled)

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const F = (cow, k) => Number(cow?.features?.[k] ?? 0);

// % style change inferred from a lnVAR residual (demo mapping, stable & clearly labelled)
function pctFrom(v, gain = 7) {
  return Math.round(v * gain);
}

// ---- 1. Indicators: one row per health signal ----
export function deriveIndicators(cow) {
  const out = [];
  const scc = Number(cow?.scc || 0);

  // SCC
  const sccSev = scc > 350 ? "high" : scc > 200 ? "med" : scc > 150 ? "low" : "ok";
  out.push({
    key: "scc",
    label: "SCC trend",
    dir: scc > 200 ? "up" : "flat",
    severity: sccSev,
    value: `${scc}k`,
    farmerText: scc > 200 ? `Milk quality down (SCC ${scc}k — germs rising)` : `Milk quality OK (SCC ${scc}k)`,
    vetText: `SCC ${scc}k cells/mL — ${scc > 350 ? "↑↑ well above 350k clinical-watch line" : scc > 200 ? "↑ above 200k subclinical line" : scc > 150 ? "borderline 150–200k" : "within <150k normal band"}`,
  });

  // Milk yield
  const yv = F(cow, "lnVAR_milkyield");
  const yPct = pctFrom(yv);
  const ySev = yv >= 1.0 ? "high" : yv >= 0.4 ? "med" : yv >= 0.1 ? "low" : "ok";
  out.push({
    key: "yield",
    label: "Milk yield",
    dir: yv > 0.1 ? "down" : "flat",
    severity: ySev,
    value: `${cow?.yieldL ?? 0} L`,
    farmerText: yv > 0.1 ? `Milk down ~${yPct}% (${cow?.yieldL} L today)` : `Milk normal (${cow?.yieldL} L)`,
    vetText: `Yield ${cow?.yieldL} L — ${yv > 0.1 ? `↓~${yPct}% vs 14-day baseline` : "stable vs baseline"}`,
  });

  // Conductivity (worst quarter)
  const ecKeys = ["lnVAR_EC_LF", "lnVAR_EC_RF", "lnVAR_EC_LR", "lnVAR_EC_RR"];
  const ecMax = Math.max(...ecKeys.map((k) => F(cow, k)));
  const ecPct = pctFrom(ecMax, 9);
  const ecSev = ecMax >= 1.2 ? "high" : ecMax >= 0.5 ? "med" : ecMax >= 0.2 ? "low" : "ok";
  out.push({
    key: "conductivity",
    label: "Milk conductivity",
    dir: ecMax > 0.2 ? "up" : "flat",
    severity: ecSev,
    value: ecMax > 0.2 ? `+${ecPct}%` : "normal",
    farmerText: ecMax > 0.2 ? "Milk saltiness up — udder may be heating" : "Milk conductivity normal",
    vetText: `Conductivity +${Math.max(0, ecPct)}% worst quarter (EC residual ${ecMax.toFixed(2)})`,
  });

  // Udder temperature deviation (derived from EC + temperature residuals)
  const dev = Math.abs(F(cow, "lnVAR_temperature")) * 0.5 + Math.max(0, ecMax) * 0.3;
  const devC = dev.toFixed(1);
  out.push({
    key: "udderTemp",
    label: "Udder temperature",
    dir: dev >= 0.5 ? "up" : "flat",
    severity: dev >= 0.8 ? "high" : dev >= 0.5 ? "med" : dev >= 0.3 ? "low" : "ok",
    value: dev >= 0.3 ? `+${devC}°C` : "normal",
    farmerText: dev >= 0.5 ? `Udder feels hotter (about +${devC}°C)` : "Udder temperature normal",
    vetText: `Udder surface ≈ +${devC}°C vs quarter baseline`,
  });

  // Activity
  const av = F(cow, "lnVAR_activity");
  const aPct = pctFrom(av);
  out.push({
    key: "activity",
    label: "Activity",
    dir: av > 0.2 ? "down" : "flat",
    severity: av >= 1.0 ? "high" : av >= 0.4 ? "med" : av >= 0.2 ? "low" : "ok",
    value: av > 0.2 ? `↓${aPct}%` : "normal",
    farmerText: av > 0.2 ? `Cow moving less (activity down ~${aPct}%)` : "Movement normal",
    vetText: `Collar activity ↓~${Math.max(0, aPct)}% (residual ${av.toFixed(2)})`,
  });

  // Rumination
  const rv = F(cow, "lnVAR_rumination");
  const rPct = pctFrom(rv);
  out.push({
    key: "rumination",
    label: "Rumination / feeding",
    dir: rv > 0.2 ? "down" : "flat",
    severity: rv >= 1.0 ? "high" : rv >= 0.4 ? "med" : rv >= 0.2 ? "low" : "ok",
    value: rv > 0.2 ? `↓${rPct}%` : "normal",
    farmerText: rv > 0.2 ? `Chewing feed less (~${rPct}% down)` : "Feeding normal",
    vetText: `Rumination ↓~${Math.max(0, rPct)}% (residual ${rv.toFixed(2)})`,
  });

  // Previous mastitis
  const pm = Number(cow?.prevMastitis ?? 0);
  out.push({
    key: "history",
    label: "Previous mastitis",
    dir: "flat",
    severity: pm >= 2 ? "high" : pm >= 1 ? "med" : "ok",
    value: pm === 0 ? "none" : `${pm} episode${pm > 1 ? "s" : ""}`,
    farmerText: pm > 0 ? `Was sick before (${pm}x) — watch extra carefully` : "No past udder sickness",
    vetText: pm > 0 ? `${pm} prior episode(s) — recurrence risk factor` : "No recorded prior episodes",
  });

  return out;
}

// ---- 2. AI explainability: factor contributions (0..1 scores) ----
export function factorContributions(cow) {
  const scc = Number(cow?.scc || 0);
  const ecMax = Math.max(...["lnVAR_EC_LF", "lnVAR_EC_RF", "lnVAR_EC_LR", "lnVAR_EC_RR"].map((k) => F(cow, k)));
  const raw = [
    { factor: "SCC trend", score: clamp((scc - 150) / 300, 0, 1), detail: `${scc}k vs 150k normal band` },
    { factor: "Milk conductivity", score: clamp(ecMax / 2.2, 0, 1), detail: `worst-quarter residual ${ecMax.toFixed(2)}` },
    { factor: "Milk yield reduction", score: clamp(Math.max(0, F(cow, "lnVAR_milkyield")) / 1.6, 0, 1), detail: `residual ${F(cow, "lnVAR_milkyield").toFixed(2)}` },
    { factor: "Previous mastitis", score: Number(cow?.prevMastitis ?? 0) >= 2 ? 0.7 : Number(cow?.prevMastitis ?? 0) >= 1 ? 0.45 : 0.05, detail: `${cow?.prevMastitis ?? 0} prior episode(s)` },
    { factor: "Activity reduction", score: clamp(Math.max(0, F(cow, "lnVAR_activity")) / 1.6, 0, 1), detail: `residual ${F(cow, "lnVAR_activity").toFixed(2)}` },
    { factor: "Temperature deviation", score: clamp(Math.abs(F(cow, "lnVAR_temperature")) / 1.2, 0, 1), detail: `residual ${F(cow, "lnVAR_temperature").toFixed(2)}` },
  ];
  return raw
    .map((r) => ({ ...r, level: r.score >= 0.66 ? "High" : r.score >= 0.33 ? "Medium" : "Low" }))
    .sort((a, b) => b.score - a.score);
}

export function aiInterpretation(cow) {
  const top = factorContributions(cow).slice(0, 3);
  const names = top.filter((t) => t.score >= 0.33).map((t) => t.factor.toLowerCase());
  if (!names.length) return "All signals inside normal bands — pattern matches a healthy baseline. Continue routine 7–14 day monitoring.";
  const combo = names.length >= 2 ? `${names.slice(0, -1).join(", ")} with ${names[names.length - 1]}` : names[0];
  return `The combination of ${combo} indicates elevated mastitis risk within 7–14 days — investigate before clinical signs appear.`;
}

// ---- 3. Demo trend series (seeded, stable per cow+metric) ----
function hashStr(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// End values come from the REAL row; the path is illustrative demo history.
export function trendSeries(cow, metric, days) {
  const rnd = mulberry32(hashStr(`${cow.id}:${metric}:${days}`));
  const drift = driftFor(cow, metric); // total change from oldest → today
  const end = endValueFor(cow, metric);
  const pts = [];
  for (let i = days - 1; i >= 0; i--) {
    const progress = 1 - i / days; // 0 oldest → ~1 today
    const noise = (rnd() - 0.5) * noiseFor(metric);
    pts.push(round1(end - drift * (1 - progress) + noise));
  }
  pts[pts.length - 1] = end; // today = real value
  return pts;
}

function driftFor(cow, metric) {
  const scc = Number(cow?.scc || 0);
  switch (metric) {
    case "yield": return Math.max(0, F(cow, "lnVAR_milkyield")) * 3; // litres lost
    case "scc": return scc > 200 ? (scc - 160) * 0.75 : 10;
    case "cond": return Math.max(0, Math.max(...["lnVAR_EC_LF", "lnVAR_EC_RF", "lnVAR_EC_LR", "lnVAR_EC_RR"].map((k) => F(cow, k)))) * 0.5;
    case "temp": return Math.max(0, F(cow, "lnVAR_temperature")) * 0.6 + 0.1;
    case "activity": return Math.max(0, F(cow, "lnVAR_activity")) * 12;
    case "rumination": return Math.max(0, F(cow, "lnVAR_rumination")) * 40;
    default: return 0;
  }
}

function endValueFor(cow, metric) {
  switch (metric) {
    case "yield": return Number(cow?.yieldL || 0);
    case "scc": return Number(cow?.scc || 0);
    case "cond": return round1(5.4 + Math.max(0, Math.max(...["lnVAR_EC_LF", "lnVAR_EC_RF", "lnVAR_EC_LR", "lnVAR_EC_RR"].map((k) => F(cow, k)))) * 0.6);
    case "temp": return round1(38.5 + Math.max(0, F(cow, "lnVAR_temperature")) * 0.5);
    case "activity": return Math.round(100 - Math.max(0, F(cow, "lnVAR_activity")) * 12);
    case "rumination": return Math.round(480 - Math.max(0, F(cow, "lnVAR_rumination")) * 45);
    default: return 0;
  }
}

function noiseFor(metric) {
  return { yield: 0.5, scc: 12, cond: 0.15, temp: 0.15, activity: 3, rumination: 15 }[metric] ?? 1;
}
function round1(v) { return Math.round(v * 10) / 10; }

// Worst-affected quarter from EC residuals (LF/RF/LR/RR)
const EC_MAP = [["LF", "lnVAR_EC_LF"], ["RF", "lnVAR_EC_RF"], ["LR", "lnVAR_EC_LR"], ["RR", "lnVAR_EC_RR"]];
export function worstQuarter(cow) {
  let best = { q: "—", val: 0 };
  EC_MAP.forEach(([q, k]) => {
    const v = F(cow, k);
    if (v > best.val) best = { q, val: v };
  });
  return best;
}

export const TREND_METRICS = [  { key: "yield", label: "Milk yield", unit: "L/day", badWhen: "falling", icon: "water_drop" },
  { key: "scc", label: "SCC", unit: "k cells/mL", badWhen: "rising", icon: "biotech" },
  { key: "cond", label: "Milk conductivity", unit: "mS/cm", badWhen: "rising", icon: "electric_bolt" },
  { key: "temp", label: "Body temperature", unit: "°C", badWhen: "rising", icon: "device_thermostat" },
  { key: "activity", label: "Activity index", unit: "pts", badWhen: "falling", icon: "directions_run" },
  { key: "rumination", label: "Rumination", unit: "min/day", badWhen: "falling", icon: "grass" },
];

export function trendDirection(pts) {
  const d = pts[pts.length - 1] - pts[0];
  if (Math.abs(d) < 1e-9) return "flat";
  return d > 0 ? "rising" : "falling";
}
