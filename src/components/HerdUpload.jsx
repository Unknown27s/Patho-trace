import { useState } from "react";
import * as XLSX from "xlsx";
import { useHerd } from "../context/HerdContext";
import { predictSingle, riskClass } from "../lib/predict";
import { FEATURE_ORDER } from "../config";

const META_COLS = ["cow_id", "id", "name", "breed", "age", "lactation", "lact", "stall", "shed", "yieldl", "yield", "milk", "scc"];

function normKey(k = "") {
  return String(k).trim().replace(/[\s_]+/g, "").toLowerCase();
}

// Map any reasonable header spelling to our canonical keys
const HEADER_ALIASES = {
  cowid: "id", id: "id", cow_id: "id",
  name: "name", cowname: "name",
  breed: "breed",
  age: "age",
  lactation: "lactation", lact: "lactation",
  stall: "stall", shed: "stall",
  yieldl: "yieldL", yield: "yieldL", milk: "yieldL",
  scc: "scc",
  dim: "dim", daysinmilk: "dim", days_in_milk: "dim",
  prevmastitis: "prevMastitis", previousmastitis: "prevMastitis", mastitishistory: "prevMastitis", history: "prevMastitis",
  vaccination: "vaccination", vaccine: "vaccination",
  status: "status", stage: "status", pregnancy: "status",
};
FEATURE_ORDER.forEach((f) => {
  HEADER_ALIASES[normKey(f)] = f;
  HEADER_ALIASES[f.toLowerCase()] = f;
});

function coerceRow(raw, idx) {
  const mapped = {};
  Object.entries(raw).forEach(([k, v]) => {
    const nk = HEADER_ALIASES[normKey(k)] || HEADER_ALIASES[String(k).trim().toLowerCase()];
    if (nk) mapped[nk] = v;
    else if (FEATURE_ORDER.includes(String(k).trim())) mapped[String(k).trim()] = v;
  });
  const features = {};
  FEATURE_ORDER.forEach((f) => {
    const v = Number(mapped[f]);
    features[f] = Number.isFinite(v) ? v : 0;
  });
  return {
    id: String(mapped.id || `COW-${String(idx + 1).padStart(3, "0")}`).toUpperCase(),
    name: String(mapped.name || `Cow ${idx + 1}`),
    breed: String(mapped.breed || "Desi"),
    age: String(mapped.age || "-"),
    lactation: String(mapped.lactation || "-"),
    stall: String(mapped.stall || "-"),
    dim: Number(mapped.dim) || 0,
    prevMastitis: Number(mapped.prevMastitis) || 0,
    vaccination: String(mapped.vaccination || "-"),
    status: String(mapped.status || "Milking"),
    yieldL: Number(mapped.yieldL) || 0,
    scc: Number(mapped.scc) || 0,
    features,
    prediction: null,
    predicting: false,
  };
}

export function parseWorkbook(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target.result, { type: "array" });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet, { defval: 0 });
        if (!json.length) return reject(new Error("Sheet is empty."));
        resolve(json.map(coerceRow));
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error("Could not read file."));
    reader.readAsArrayBuffer(file);
  });
}

export default function HerdUpload({ autoPredict = true, compact = false }) {
  const { replaceHerd, source, cows } = useHerd();
  const [drag, setDrag] = useState(false);
  const [msg, setMsg] = useState("");
  const [progress, setProgress] = useState("");
  const [busy, setBusy] = useState(false);

  const handleFile = async (file) => {
    if (!file) return;
    setBusy(true);
    setMsg("");
    setProgress("");
    try {
      const rows = await parseWorkbook(file);
      replaceHerd(rows, `excel:${file.name}`);
      setMsg(`✅ ${rows.length} cows loaded from ${file.name} — showing below.`);
      if (autoPredict) {
        setProgress("🤖 Auto-predicting whole herd… (live model, falls back to offline estimate)");
        // predictAll reads from context; wait a tick so replaceHerd commits first
        setTimeout(async () => {
          try {
            const done = [];
            for (const r of rows) {
              try {
                const out = await predictSingle(r.features);
                done.push({ ...r, prediction: { ...out, live: out.live !== false, at: new Date().toISOString(), class: riskClass(out.risk_level) } });
              } catch {
                done.push(r);
              }
              setProgress(`🤖 Auto-predicting… ${done.length}/${rows.length}`);
            }
            replaceHerd(done, `excel:${file.name}`);
            setProgress(`✅ Auto-prediction done for ${done.length} cows. Tap any cow for details.`);
          } catch (e) {
            setProgress("");
            setMsg(`Loaded ${rows.length} cows, but auto-predict failed: ${e.message}. Use Predict per cow.`);
          } finally {
            setBusy(false);
          }
        }, 300);
      } else {
        setBusy(false);
      }
    } catch (e) {
      setBusy(false);
      setMsg(`❌ ${e.message} — use the template below (same 16 columns as the model).`);
    }
  };

  return (
    <div className={`bg-white rounded-2xl border-2 border-dashed ${drag ? "border-emerald-500 bg-emerald-50" : "border-slate-300"} p-4 space-y-3`}>
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center">
            <span className="material-symbols-outlined">upload_file</span>
          </div>
          <div>
            <h3 className="font-extrabold text-sm">Upload herd Excel sheet</h3>
            <p className="text-[11px] text-slate-500">
              Source now: <b>{source}</b> • {cows.length} cows in app • .xlsx / .csv with 16 feature columns
            </p>
          </div>
        </div>
        <a href="/pathotracer_herd_template.csv" download className="px-3 py-2 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px]">download</span> Excel template
        </a>
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files?.[0]); }}
        className="rounded-xl bg-slate-50 border p-4 text-center"
      >
        <p className="text-xs text-slate-600">Drag & drop your <b>.xlsx / .csv</b> here, or</p>
        <label className="mt-2 inline-flex px-4 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-bold cursor-pointer">
          {busy ? "Working…" : "Choose Excel file"}
          <input type="file" accept=".xlsx,.xls,.csv" className="hidden" disabled={busy} onChange={(e) => handleFile(e.target.files?.[0])} />
        </label>
        {!compact && (
          <p className="mt-2 text-[11px] text-slate-400">
            Columns: cow_id, name, breed, age, lactation, stall, dim, prevMastitis, vaccination, status, yieldL, scc + 16 model features
            (lnVAR/acf × activity, rumination, temperature, milkyield, EC_LF/RF/LR/RR). Extra columns are ignored.
          </p>
        )}
      </div>

      {msg && <p className="text-xs font-bold bg-emerald-50 border border-emerald-200 rounded-lg p-2">{msg}</p>}
      {progress && <p className="text-xs font-bold bg-sky-50 border border-sky-200 rounded-lg p-2">{progress}</p>}
    </div>
  );
}

export { META_COLS };
