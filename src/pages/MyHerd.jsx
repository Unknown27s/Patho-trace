import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { useAudioBriefing } from "../hooks/useAudioBriefing";

const herd = [
  {id:"COW-024", name:"Ganga", breed:"Gir Cross", lact:"4th", age:"6y", yield:"12.5L", scc:"420k", risk:"High 87%", color:"bg-red-600 text-white"},
  {id:"COW-018", name:"Gauri", breed:"Murrah", lact:"3rd", age:"5y", yield:"9.8L", scc:"380k", risk:"High 79%", color:"bg-red-100 text-red-700 border"},
  {id:"COW-031", name:"Lakshmi", breed:"HF Cross", lact:"2nd", age:"4y", yield:"15.2L", scc:"290k", risk:"Moderate 74%", color:"bg-amber-100 text-amber-800"},
  {id:"COW-007", name:"Saras", breed:"Gir", lact:"5th", age:"7y", yield:"11.0L", scc:"210k", risk:"Moderate 68%", color:"bg-amber-100 text-amber-800"},
  {id:"COW-011", name:"Radha", breed:"Gir", lact:"2nd", age:"3y", yield:"14.1L", scc:"130k", risk:"No Risk", color:"bg-emerald-100 text-emerald-700"},
  {id:"COW-035", name:"Meera", breed:"Murrah", lact:"1st", age:"3y", yield:"10.5L", scc:"180k", risk:"Low", color:"bg-lime-100 text-lime-800"},
];

export default function MyHerd(){
  const { t } = useLanguage();
  const { playing, toggle } = useAudioBriefing();
  const [filter,setFilter]=useState("All");
  const [q,setQ]=useState("");
  const filtered = herd.filter(h=> (filter==="All" || h.risk.includes(filter)) && (q==="" || h.name.toLowerCase().includes(q.toLowerCase()) || h.id.toLowerCase().includes(q.toLowerCase())));
  return (
    <div className="min-h-screen bg-[#f1f5f9]">
      <header className="sticky top-0 z-20 bg-white border-b px-4 lg:px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3"><Link to="/dashboard" className="w-9 h-9 rounded-xl bg-slate-100 border flex items-center justify-center"><span className="material-symbols-outlined">arrow_back</span></Link>
          <div><h1 className="font-jakarta font-extrabold">{t("navHerd")} — 48 Animals</h1><p className="text-xs text-slate-500">{t("herdSub")}</p></div></div>
        <div className="flex items-center gap-2"><LanguageSwitcher compact/><button onClick={toggle} className={`h-9 px-3 rounded-full text-xs font-bold flex items-center gap-1 ${playing?"bg-red-600 text-white":"bg-emerald-700 text-white"}`}><span className="material-symbols-outlined text-[16px]">{playing?"pause":"volume_up"}</span> {playing? t("briefingPlaying"): t("audioBriefingShort")}</button></div>
      </header>
      <main className="max-w-6xl mx-auto p-4 lg:p-6 space-y-4">
        <div className="bg-white rounded-2xl border p-4 flex flex-wrap gap-3 items-center justify-between">
          <div className="flex gap-2">{["All","High","Moderate","Low","No Risk"].map(f=>(<button key={f} onClick={()=>setFilter(f)} className={`px-3 py-1.5 rounded-full text-xs font-bold border ${filter===f?"bg-emerald-700 text-white border-emerald-700":"bg-slate-50"}`}>{f}</button>))}</div>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search ID / Name" className="px-3 py-2 rounded-xl border text-sm bg-slate-50 w-full sm:w-64"/>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(h=>(
            <div key={h.id} className="bg-white rounded-2xl border p-4 space-y-3">
              <div className="flex justify-between items-start"><div><div className="font-bold">{h.id} '{h.name}'</div><div className="text-xs text-slate-500">{h.breed} • {h.lact} • {h.age}</div></div><span className={`px-2 py-1 rounded-full text-xs font-bold ${h.color}`}>{h.risk}</span></div>
              <div className="grid grid-cols-3 gap-2 text-xs text-center"><div className="bg-slate-50 border rounded-xl p-2"><div className="font-bold">{h.yield}</div><div className="text-slate-500">Yield</div></div><div className="bg-slate-50 border rounded-xl p-2"><div className="font-bold">{h.scc}</div><div className="text-slate-500">SCC</div></div><div className="bg-slate-50 border rounded-xl p-2"><div className="font-bold">38.9°</div><div className="text-slate-500">Udder</div></div></div>
              <div className="flex gap-2"><button onClick={()=>alert(`CMT log for ${h.id} — demo`)} className="flex-1 h-9 bg-emerald-700 text-white rounded-xl text-xs font-bold">Log CMT</button><Link to="/dashboard" className="flex-1 h-9 bg-slate-100 border rounded-xl flex items-center justify-center text-xs font-bold">Profile</Link></div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
