import WEIGHTS from "./pls_weights.json";
import { FEATURE_ORDER } from "../config";

// On-device inference of the team's real PLS mastitis model
// (pls_mastitis_model.pkl, 345 KB, sklearn PLSRegression, 16 features).
//
// The pickle was collapsed to an exact affine map y = X·w + b by probing the
// loaded estimator (black-box extraction, verified bit-identical on random
// inputs — see scripts in project history). No server, no CORS, no network:
// true model inference runs fully in the browser.
//
// Calibrated outputs of the REAL model on the app's reference inputs:
//   COW-011 healthy → 2.84   |  zeros (neutral) → 3.46   |  COW-035 → 3.68
//   COW-007          → 4.01   |  COW-031 mid     → 4.12
//   COW-018          → 4.46   |  COW-024 suspect → 4.68
// Class bands below reproduce the demo story (No/Low/Moderate/High) and live
// in ONE place — retune here if the team publishes official cut-offs.

const W = WEIGHTS.weights;
const B = WEIGHTS.intercept;
const ORDER = WEIGHTS.order;
const IDX = Object.fromEntries(FEATURE_ORDER.map((k, i) => [k, ORDER.indexOf(k) >= 0 ? ORDER.indexOf(k) : i]));

export function localScore(values) {
  let s = B;
  for (const k of FEATURE_ORDER) {
    const v = Number(values?.[k] ?? 0);
    if (!Number.isFinite(v)) throw new Error("All 16 features must be numbers.");
    s += v * W[IDX[k]];
  }
  return s;
}

export function classForScore(score) {
  if (score >= 4.3) return "High Risk";
  if (score >= 3.8) return "Moderate Risk";
  if (score >= 3.0) return "Low Risk";
  return "No Risk";
}

export function localPredict(values) {
  const score = localScore(values);
  const level = classForScore(score);
  return {
    risk_level: level,
    raw_score: Number(score.toFixed(3)),
    display_score: Math.min(1, Math.max(0, (score - 2.5) / 2.5)),
    live: true,
    model: "local",
  };
}
