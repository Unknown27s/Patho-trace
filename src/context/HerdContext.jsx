import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { predictSingle, riskClass } from "../lib/predict";

const HerdContext = createContext(null);
const LS_KEY = "pathotracer_herd_v1";

// Demo starter herd — same 16-feature shape the Excel template uses,
// so Upload replaces this but the app works before any upload.
const DEMO_COWS = [
  {
    id: "COW-024", name: "Ganga", breed: "Gir Cross", age: "6y", lactation: "4th", stall: "Stall 4",
    dim: 126, prevMastitis: 2, vaccination: "Up to date", status: "Milking",
    yieldL: 12.5, scc: 420,
    features: { lnVAR_activity: 1.4, acf_activity: 0.15, lnVAR_rumination: 1.1, acf_rumination: 0.2, lnVAR_temperature: 0.9, acf_temperature: 0.25, lnVAR_milkyield: 1.6, acf_milkyield: 0.1, lnVAR_EC_LF: 0.4, acf_EC_LF: 0.3, lnVAR_EC_RF: 0.5, acf_EC_RF: 0.3, lnVAR_EC_LR: 0.8, acf_EC_LR: 0.25, lnVAR_EC_RR: 2.4, acf_EC_RR: 0.12 },
    prediction: null, predicting: false,
  },
  {
    id: "COW-018", name: "Gauri", breed: "Murrah", age: "5y", lactation: "3rd", stall: "Shed 2",
    dim: 98, prevMastitis: 1, vaccination: "Up to date", status: "Milking",
    yieldL: 9.8, scc: 380,
    features: { lnVAR_activity: 1.0, acf_activity: 0.2, lnVAR_rumination: 0.9, acf_rumination: 0.22, lnVAR_temperature: 0.7, acf_temperature: 0.28, lnVAR_milkyield: 1.2, acf_milkyield: 0.15, lnVAR_EC_LF: 0.3, acf_EC_LF: 0.32, lnVAR_EC_RF: 0.4, acf_EC_RF: 0.3, lnVAR_EC_LR: 0.6, acf_EC_LR: 0.28, lnVAR_EC_RR: 1.8, acf_EC_RR: 0.16 },
    prediction: null, predicting: false,
  },
  {
    id: "COW-031", name: "Lakshmi", breed: "HF Cross", age: "4y", lactation: "2nd", stall: "Shed 1",
    dim: 64, prevMastitis: 0, vaccination: "Up to date", status: "Milking",
    yieldL: 15.2, scc: 290,
    features: { lnVAR_activity: 0.5, acf_activity: 0.3, lnVAR_rumination: 0.4, acf_rumination: 0.32, lnVAR_temperature: 0.3, acf_temperature: 0.35, lnVAR_milkyield: 0.7, acf_milkyield: 0.25, lnVAR_EC_LF: 0.6, acf_EC_LF: 0.3, lnVAR_EC_RF: 0.2, acf_EC_RF: 0.35, lnVAR_EC_LR: 0.3, acf_EC_LR: 0.32, lnVAR_EC_RR: 0.5, acf_EC_RR: 0.3 },
    prediction: null, predicting: false,
  },
  {
    id: "COW-007", name: "Saras", breed: "Gir", age: "7y", lactation: "5th", stall: "Shed 3",
    dim: 210, prevMastitis: 1, vaccination: "Due soon", status: "Milking",
    yieldL: 11.0, scc: 210,
    features: { lnVAR_activity: 0.3, acf_activity: 0.35, lnVAR_rumination: 0.2, acf_rumination: 0.36, lnVAR_temperature: 0.2, acf_temperature: 0.38, lnVAR_milkyield: 0.4, acf_milkyield: 0.3, lnVAR_EC_LF: 0.2, acf_EC_LF: 0.35, lnVAR_EC_RF: 0.2, acf_EC_RF: 0.35, lnVAR_EC_LR: 0.3, acf_EC_LR: 0.33, lnVAR_EC_RR: 0.4, acf_EC_RR: 0.32 },
    prediction: null, predicting: false,
  },
  {
    id: "COW-011", name: "Radha", breed: "Gir", age: "3y", lactation: "2nd", stall: "Shed 1",
    dim: 45, prevMastitis: 0, vaccination: "Up to date", status: "Milking",
    yieldL: 14.1, scc: 130,
    features: { lnVAR_activity: -1.2, acf_activity: 0.65, lnVAR_rumination: -1.1, acf_rumination: 0.6, lnVAR_temperature: -1.3, acf_temperature: 0.55, lnVAR_milkyield: -1.0, acf_milkyield: 0.6, lnVAR_EC_LF: -1.2, acf_EC_LF: 0.6, lnVAR_EC_RF: -1.2, acf_EC_RF: 0.6, lnVAR_EC_LR: -1.2, acf_EC_LR: 0.6, lnVAR_EC_RR: -1.2, acf_EC_RR: 0.6 },
    prediction: null, predicting: false,
  },
  {
    id: "COW-035", name: "Meera", breed: "Murrah", age: "3y", lactation: "1st", stall: "Shed 2",
    dim: 30, prevMastitis: 0, vaccination: "Up to date", status: "Early lactation",
    yieldL: 10.5, scc: 180,
    features: { lnVAR_activity: -0.3, acf_activity: 0.5, lnVAR_rumination: -0.2, acf_rumination: 0.5, lnVAR_temperature: -0.3, acf_temperature: 0.48, lnVAR_milkyield: -0.2, acf_milkyield: 0.5, lnVAR_EC_LF: -0.3, acf_EC_LF: 0.5, lnVAR_EC_RF: -0.2, acf_EC_RF: 0.5, lnVAR_EC_LR: -0.1, acf_EC_LR: 0.48, lnVAR_EC_RR: 0.0, acf_EC_RR: 0.45 },
    prediction: null, predicting: false,
  },
];

export function HerdProvider({ children }) {
  const [cows, setCows] = useState(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length) return parsed;
      }
    } catch { /* ignore */ }
    return DEMO_COWS;
  });
  const [source, setSource] = useState(() => {
    try { return localStorage.getItem(LS_KEY + "_src") || "demo"; } catch { return "demo"; }
  });
  const cowsRef = useRef(cows);
  useEffect(() => { cowsRef.current = cows; }, [cows]);

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(cows));
      localStorage.setItem(LS_KEY + "_src", source);
    } catch { /* ignore */ }
  }, [cows, source]);

  const replaceHerd = useCallback((rows, src = "excel") => {
    setCows(rows);
    setSource(src);
  }, []);

  const resetDemo = useCallback(() => {
    setCows(DEMO_COWS);
    setSource("demo");
  }, []);

  // MANUAL per-cow prediction (click a cow -> Predict button calls this)
  const predictCow = useCallback(async (id, featureOverride) => {
    const live = cowsRef.current.find((c) => c.id === id);
    const values = featureOverride || live?.features || {};
    setCows((prev) => prev.map((c) => (c.id === id ? { ...c, predicting: true, predictError: "" } : c)));
    try {
      const out = await predictSingle(values);
      const labelled = {
        risk_level: out.risk_level,
        raw_score: out.raw_score,
        display_score: out.display_score,
        live: out.live !== false,
        at: new Date().toISOString(),
        class: riskClass(out.risk_level),
      };
      setCows((prev) => prev.map((c) => (c.id === id ? { ...c, predicting: false, prediction: labelled } : c)));
      return labelled;
    } catch (e) {
      setCows((prev) => prev.map((c) => (c.id === id ? { ...c, predicting: false, predictError: e.message } : c)));
      throw e;
    }
  }, []);

  // AUTOMATIC: predict whole herd sequentially (used after Excel upload + doctor "Run all")
  const predictAll = useCallback(async (onProgress) => {
    const ids = cows.map((c) => c.id);
    let done = 0;
    for (const id of ids) {
      try { await predictCow(id); } catch { /* keep going */ }
      done += 1;
      onProgress?.(done, ids.length);
    }
  }, [cows, predictCow]);

  return (
    <HerdContext.Provider value={{ cows, source, replaceHerd, resetDemo, predictCow, predictAll }}>
      {children}
    </HerdContext.Provider>
  );
}

export function useHerd() {
  const ctx = useContext(HerdContext);
  if (!ctx) throw new Error("useHerd must be used inside HerdProvider");
  return ctx;
}
