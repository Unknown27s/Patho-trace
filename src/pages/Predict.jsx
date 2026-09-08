import { Link } from "react-router-dom";
import MastitisPredictor from "../components/MastitisPredictor";
import ModelFrame from "../components/ModelFrame";
import { useAuth } from "../context/AuthContext";

// Manual 16-field predictor page — same for both roles, back-link differs.
// Per-cow (automatic-row) prediction lives at /farmer/herd, /doctor/herd and /cow/:id.
export default function Predict() {
  const { user } = useAuth();
  const base = user?.role === "doctor" ? "/doctor" : "/farmer";
  return (
    <div className="min-h-screen bg-[#f1f5f9]">
      <header className="sticky top-0 bg-white border-b px-4 lg:px-6 py-3 flex items-center gap-3">
        <Link to={base} className="w-9 h-9 rounded-xl bg-slate-100 border flex items-center justify-center">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <div>
          <h1 className="font-extrabold">Manual predictor — type 16 features</h1>
          <p className="text-xs text-slate-500">
            For single-cow typing. For Excel rows use <Link to={`${base}/herd`} className="underline text-emerald-700 font-bold">Herd → tap cow → Predict</Link> (automatic).
          </p>
        </div>
      </header>
      <main className="max-w-5xl mx-auto p-4 space-y-4">
        <MastitisPredictor />
        <details className="bg-white rounded-xl border">
          <summary className="px-3 py-2 text-xs font-bold cursor-pointer text-slate-600">Raw Gradio UI (optional)</summary>
          <div className="p-2"><ModelFrame height={420} /></div>
        </details>
      </main>
    </div>
  );
}
