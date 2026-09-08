import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import LanguageSwitcher from "../components/LanguageSwitcher";
import Toast from "../components/Toast";

export default function Vet(){
  const { t } = useLanguage();
  const { user } = useAuth();
  const base = user?.role === "doctor" ? "/doctor" : "/farmer";
  const [toast,setToast]=useState("");
  return (
    <div className="min-h-screen bg-[#f1f5f9]">
      <header className="sticky top-0 bg-white border-b px-4 lg:px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3"><Link to={base} className="w-9 h-9 rounded-xl bg-slate-100 border flex items-center justify-center"><span className="material-symbols-outlined">arrow_back</span></Link><div><h1 className="font-jakarta font-extrabold">Call Veterinarian {user?.role === "doctor" ? "(Doctor console)" : ""}</h1><p className="text-xs text-slate-500">Field Vet • On Duty</p></div></div>
        <LanguageSwitcher compact/>
      </header>
      <main className="max-w-3xl mx-auto p-4 space-y-4">
        <div className="bg-white rounded-2xl border p-5 flex flex-col sm:flex-row items-center gap-4 shadow-sm">
          <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBW9n0hAqfPV1coAuljo_rhZnXXrpesYJFTRF-gIxTAi3I4eytSj3GBrlGYTcw3k-LXezy9afA05QxP0eaEP1PJOly2VdfErnMKuCst2wBtZiObCkyfjHWZ2clmE3pCjiRonUGHWk_OKozudyDPhI2uALs5CHou-whR2Vsj210qi7iwXXdr1ZODRGbcOPbKKJSuWTqW_DjRSF8GlGgVlKOeT-wdkYOdfGf_K1dDPP0gPqnxkaSBgOxlig" className="w-20 h-20 rounded-full object-cover ring-2 ring-emerald-200" alt="vet"/>
          <div className="flex-1 text-center sm:text-left"><div className="font-jakarta font-extrabold text-lg">Dr. S. Radhakrishnan, BVSc</div><div className="text-sm text-slate-500">Anand Milk Union Central Veterinary Unit</div><div className="text-sm text-emerald-700 font-semibold flex items-center justify-center sm:justify-start gap-1 mt-1"><span className="material-symbols-outlined text-[16px]">location_on</span>Sector 3 • 8 mins away • Available</div></div>
          <div className="flex sm:flex-col gap-2">
            <a href="tel:+919876543210" className="h-11 bg-emerald-700 text-white rounded-xl px-4 font-bold flex items-center justify-center gap-1 text-sm"><span className="material-symbols-outlined">call</span> Call</a>
            <button onClick={()=>setToast("Health report & SOP sent on WhatsApp ✓")} className="h-11 bg-slate-100 border rounded-xl px-4 font-bold flex items-center justify-center gap-1 text-sm"><span className="material-symbols-outlined text-emerald-700">share</span> WhatsApp</button>
          </div>
        </div>
        <div className="bg-white rounded-2xl border p-5 shadow-sm">
          <h3 className="font-bold text-sm mb-3">Dispatch to Vet (SOP summary for COW-024/018)</h3>
          <div className="bg-slate-50 border rounded-xl p-4 text-sm space-y-1">
            <p>• 4-Well CMT result pending — high SCC 420k / 380k</p>
            <p>• RR udder thermal 39.1°C — suspect subclinical mastitis</p>
            <p>• Recommended: 0.5% Povidone Iodine teat dip post-milk</p>
            <p>• Re-check in 48h via AI model (94% accuracy)</p>
          </div>
        </div>
      </main>
      <Toast msg={toast} onClose={()=>setToast("")}/>
    </div>
  )
}
