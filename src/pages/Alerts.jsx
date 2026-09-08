import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { useAudioBriefing } from "../hooks/useAudioBriefing";

export default function Alerts(){
  const { t } = useLanguage();
  const { playing, toggle } = useAudioBriefing();
  const [filter,setFilter]=useState("All");
  const alerts=[
    {id:1, cow:"COW-024 Ganga", level:"Critical", msg:"RR quarter 39.1°C + SCC 420k — 87% risk in 7 days", time:"2 min ago", color:"border-red-500 bg-red-50"},
    {id:2, cow:"COW-018 Gauri", level:"High", msg:"Conductivity +1.1 mS/cm • Feeding down 12%", time:"18 min ago", color:"border-red-300 bg-red-50/60"},
    {id:3, cow:"Bulk SCC", level:"Warning", msg:"245k cells/mL — Grade B, target <200k", time:"1 hr ago", color:"border-amber-300 bg-amber-50"},
    {id:4, cow:"THI Alert", level:"Info", msg:"THI 78 High — increase ventilation in Shed 4", time:"2 hr ago", color:"border-sky-200 bg-sky-50"},
  ];
  const shown = filter==="All" ? alerts : alerts.filter(a=>a.level===filter);
  return (
    <div className="min-h-screen bg-[#f1f5f9]">
      <header className="sticky top-0 bg-white border-b px-4 lg:px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3"><Link to="/dashboard" className="w-9 h-9 rounded-xl bg-slate-100 border flex items-center justify-center"><span className="material-symbols-outlined">arrow_back</span></Link><h1 className="font-jakarta font-extrabold">Alerts — 4 Active</h1></div>
        <div className="flex items-center gap-2"><LanguageSwitcher compact/><button onClick={toggle} className={`h-9 px-3 rounded-full text-xs font-bold flex items-center gap-1 ${playing?"bg-red-600 text-white":"bg-emerald-700 text-white"}`}><span className="material-symbols-outlined text-[16px]">{playing?"pause":"volume_up"}</span> {t("audioBriefingShort")}</button></div>
      </header>
      <main className="max-w-3xl mx-auto p-4 space-y-4">
        <div className="flex gap-2 flex-wrap">{["All","Critical","High","Warning","Info"].map(f=>(<button key={f} onClick={()=>setFilter(f)} className={`px-3 py-1.5 rounded-full text-xs font-bold border ${filter===f?"bg-slate-900 text-white":"bg-white"}`}>{f}</button>))}</div>
        {shown.map(a=>(
          <div key={a.id} className={`bg-white rounded-2xl border-l-4 p-4 border shadow-sm ${a.color}`}>
            <div className="flex justify-between"><span className="font-bold text-sm">{a.cow}</span><span className="text-xs text-slate-500">{a.time}</span></div>
            <p className="text-sm mt-1">{a.msg}</p>
            <div className="mt-3 flex gap-2"><button onClick={()=>alert('Marked as read — demo')} className="px-3 py-1.5 rounded-full bg-emerald-700 text-white text-xs font-bold">Acknowledge</button><button onClick={()=>alert('WhatsApp sent — demo')} className="px-3 py-1.5 rounded-full bg-slate-100 border text-xs font-bold">Share to Vet</button></div>
          </div>
        ))}
        <div className="text-center text-xs text-slate-400 pt-6">Real-time alerts via Push / SMS / WhatsApp • {t("language")}: EN/HI/GU</div>
      </main>
    </div>
  )
}
