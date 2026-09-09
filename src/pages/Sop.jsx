import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { useAudioBriefing } from "../hooks/useAudioBriefing";

const steps=[
  {num:1, title:"Strip Cup & 4-Well CMT", detail:"Test COW-024 & 018 before cluster attach", tag:"Urgent", tagColor:"bg-rose-100 text-rose-700"},
  {num:2, title:"Vacuum Calibration", detail:"42 kPa • 60:40 pulsation ratio", tag:"Done ✓", tagColor:"bg-emerald-100 text-emerald-800"},
  {num:3, title:"Post-Milking Barrier Teat Dip", detail:"0.5% Povidone Iodine • keep standing 30 min", tag:"In Progress", tagColor:"bg-sky-100 text-sky-800"},
];

export default function Sop(){
  const { t } = useLanguage();
  const { user } = useAuth();
  const base = user?.role === "doctor" ? "/doctor" : "/farmer";
  const { playing, toggle } = useAudioBriefing();
  const [checked,setChecked]=useState(() => {
    try { return JSON.parse(localStorage.getItem("pathotracer_sop_v1") || "{}"); }
    catch { return {}; }
  });
  useEffect(() => {
    try { localStorage.setItem("pathotracer_sop_v1", JSON.stringify(checked)); } catch { /* ignore */ }
  }, [checked]);
  const doneCount=steps.filter(s=>checked[s.num]).length;
  const toggleSop=(n)=>{ setChecked(p=>({...p,[n]:!p[n]})); };
  const resetSop=()=>setChecked({});
  return (
    <div className="min-h-screen bg-[#f1f5f9]">
      <header className="sticky top-0 bg-white border-b px-4 lg:px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3"><Link to={base} className="w-9 h-9 rounded-xl bg-slate-100 border flex items-center justify-center"><span className="material-symbols-outlined">arrow_back</span></Link><div><h1 className="font-jakarta font-extrabold">Action SOP Checklist {user?.role === "doctor" ? "(Doctor protocol)" : "(Simple steps)"}</h1><p className="text-xs text-slate-500">{doneCount}/{steps.length} completed</p></div></div>
        <div className="flex items-center gap-2"><LanguageSwitcher compact/><button onClick={toggle} className={`h-9 px-3 rounded-full text-xs font-bold flex items-center gap-1 ${playing?"bg-red-600 text-white":"bg-emerald-700 text-white"}`}><span className="material-symbols-outlined text-[16px]">{playing?"pause":"volume_up"}</span> {t("audioBriefingShort")}</button></div>
      </header>
      <main className="max-w-3xl mx-auto p-4 space-y-4">
        {steps.map(s=>{
          const done=!!checked[s.num];
          return (
            <div key={s.num} className={`bg-white rounded-2xl border p-4 shadow-sm flex gap-3 ${done?"border-emerald-300":"border-slate-200"}`}>
              <button onClick={()=>toggleSop(s.num)} className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 border-2 ${done?"bg-emerald-600 text-white border-emerald-600":"border-slate-300 text-white bg-white"}`}><span className="material-symbols-outlined text-[18px]">{done?"check":"check"}</span></button>
              <div className="flex-1"><div className="flex justify-between flex-wrap gap-2"><div className={`font-bold ${done?"line-through text-slate-400":""}`}>{s.num}. {s.title}</div><span className={`px-2 py-0.5 rounded text-xs font-bold ${s.tagColor}`}>{s.tag}</span></div><p className="text-sm text-slate-500 mt-1">{s.detail}</p></div>
            </div>
          )
        })}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-sm">
          💡 <b>{t("saves")}</b> — Early SOP avoids systemic antibiotics and milk tank discard.
        </div>
        {doneCount > 0 && <button onClick={resetSop} className="w-full h-11 rounded-xl bg-slate-100 border text-xs font-bold">Reset checklist for tomorrow</button>}
      </main>
    </div>
  )
}
