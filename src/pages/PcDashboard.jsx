import { Link, useNavigate } from "react-router-dom";
import ModelFrame from "../components/ModelFrame";
import MastitisPredictor from "../components/MastitisPredictor";
import HerdUpload from "../components/HerdUpload";
import SavingsStrip from "../components/SavingsStrip";
import Logo from "../components/Logo";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { useHerd } from "../context/HerdContext";
import { useAudioBriefing } from "../hooks/useAudioBriefing";
import { MODEL_URL } from "../config";

export default function PcDashboard() {
  const { t } = useLanguage();
  const { playing, toggle } = useAudioBriefing();
  const { user, logout } = useAuth();
  const { cows, source, predictAll } = useHerd();
  const nav = useNavigate();
  return (
    <div className="flex min-h-screen bg-[#f1f5f9]">
      {/* SIDEBAR */}
      <aside className="hidden lg:flex w-[272px] bg-[#0f281e] text-white flex-col fixed h-screen z-30">
        <div className="p-5 flex items-center gap-3 border-b border-white/10">
          <Logo dark />
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-none">
          <Link to="/doctor" className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-sm"><span className="material-symbols-outlined text-[20px]">dashboard</span> {t("navHome")}</Link>
          <Link to="/doctor/herd" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 text-white/80 text-sm"><span className="material-symbols-outlined">pets</span> {t("navHerd")} <span className="ml-auto bg-white/20 px-2 py-0.5 rounded-full text-xs">{cows.length}</span></Link>
          <Link to="/doctor/alerts" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 text-white/80 text-sm"><span className="material-symbols-outlined">ecg_heart</span> {t("navAlerts")} <span className="ml-auto bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">4</span></Link>
          <Link to="/doctor/predict" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 text-white/80 text-sm"><span className="material-symbols-outlined">biotech</span> {t("aiTitle")}</Link>
          <Link to="/doctor/coop" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 text-white/80 text-sm"><span className="material-symbols-outlined">corporate_fare</span> Co-op Board <span className="ml-auto bg-white/20 px-2 py-0.5 rounded-full text-xs">new</span></Link>
          <Link to="/doctor/sop" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 text-white/80 text-sm"><span className="material-symbols-outlined">assignment_turned_in</span> {t("navSop")}</Link>
          <Link to="/doctor" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 text-white/80 text-sm"><span className="material-symbols-outlined">map</span> {t("navGis")}</Link>
          <Link to="/doctor/vet" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 text-white/80 text-sm"><span className="material-symbols-outlined">support_agent</span> {t("navVet")}</Link>
          <div className="pt-4 mt-4 border-t border-white/10">
            <div className="px-3 text-[11px] font-bold tracking-widest text-white/40 uppercase">Risk Categories</div>
            <div className="mt-2 space-y-1.5 px-3 text-xs">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-400"></span> {t("riskNo")}</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-lime-400"></span> {t("riskLow")}</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-400"></span> {t("riskMod")}</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500"></span> {t("riskHigh")}</div>
            </div>
          </div>
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="bg-white/10 rounded-xl p-3 flex items-center gap-3">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBW9n0hAqfPV1coAuljo_rhZnXXrpesYJFTRF-gIxTAi3I4eytSj3GBrlGYTcw3k-LXezy9afA05QxP0eaEP1PJOly2VdfErnMKuCst2wBtZiObCkyfjHWZ2clmE3pCjiRonUGHWk_OKozudyDPhI2uALs5CHou-whR2Vsj210qi7iwXXdr1ZODRGbcOPbKKJSuWTqW_DjRSF8GlGgVlKOeT-wdkYOdfGf_K1dDPP0gPqnxkaSBgOxlig" className="w-10 h-10 rounded-full object-cover" alt="vet"/>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold leading-none">Dr. S. Radhakrishnan</div>
              <div className="text-xs text-emerald-300">BVSc • On Duty • 8 min away</div>
            </div>
            <Link to="/vet" className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center"><span className="material-symbols-outlined text-[18px]">call</span></Link>
          </div>
        </div>
      </aside>

      <div className="flex-1 lg:ml-[272px]">
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-slate-200 px-6 py-3 flex items-center justify-between gap-4">
          <div>
            <h1 className="font-jakarta font-extrabold text-xl leading-none">{t("herdTitle")} <span className="text-emerald-700">{t("anandUnit")}</span></h1>
            <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">{t("greeting")} • {t("herdSub")} • {t("lastSync")} <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse inline-block"></span> {t("live")}</div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden md:inline-flex px-2.5 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-[11px] font-bold">{user?.role === "doctor" ? "🩺 Doctor view" : "🌾 Farmer view"}</span>
            <span className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold"><span className="material-symbols-outlined text-[16px]">device_thermostat</span> {t("thi")}</span>
            <LanguageSwitcher/>
            <button onClick={toggle} className={`h-9 px-4 rounded-full text-xs font-bold flex items-center gap-1.5 ${playing ? "bg-red-600 text-white animate-pulse":"bg-emerald-700 text-white"}`}><span className="material-symbols-outlined text-[16px]">{playing ? "pause":"volume_up"}</span> {playing ? t("briefingPlaying") : t("audioBriefing")}</button>
            <Link to="/doctor/alerts" className="w-9 h-9 rounded-full bg-slate-100 border flex items-center justify-center relative"><span className="material-symbols-outlined">notifications</span><span className="absolute top-0 right-0 bg-red-600 text-white text-[10px] px-1 rounded-full font-bold">4</span></Link>
            <button onClick={()=>{logout(); nav("/login");}} title="Sign out" className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center"><span className="material-symbols-outlined text-[18px]">logout</span></button>
          </div>
        </header>

        <main className="p-4 lg:p-6 space-y-5 max-w-[1600px] mx-auto">
          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-12 xl:col-span-8 bg-gradient-to-r from-red-600 to-rose-700 rounded-2xl p-5 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
              <div className="relative">
                <div className="inline-flex items-center gap-2 text-xs font-extrabold tracking-widest text-rose-100 uppercase"><span className="w-2 h-2 bg-white rounded-full animate-pulse"></span> {t("criticalTitle")}</div>
                <h2 className="font-jakarta font-extrabold text-2xl mt-1">{t("criticalH")}</h2>
                <p className="text-sm text-rose-100 mt-1 max-w-2xl">{t("criticalP")}</p>
              </div>
              <a href="#priority" className="relative bg-white text-red-700 px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-md whitespace-nowrap">{t("triage")} <span className="material-symbols-outlined">arrow_forward</span></a>
            </div>
            <div className="col-span-12 xl:col-span-4 grid grid-cols-2 gap-3">
              <div className="bg-white rounded-2xl p-4 border shadow-sm"><div className="text-xs font-bold text-slate-500">{t("totalHerd")}</div><div className="font-jakarta font-extrabold text-3xl">{cows.length}</div><div className="text-xs text-slate-500">{source}</div></div>
              <div className="bg-white rounded-2xl p-4 border shadow-sm border-emerald-100"><div className="text-xs font-bold text-emerald-700">{t("healthy")}</div><div className="font-jakarta font-extrabold text-3xl text-emerald-700">35</div><div className="inline-flex mt-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">{t("safe")}</div></div>
              <div className="bg-white rounded-2xl p-4 border shadow-sm border-sky-100"><div className="text-xs font-bold text-sky-700">{t("watchlist")}</div><div className="font-jakarta font-extrabold text-3xl text-sky-700">09</div><div className="inline-flex mt-1 px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 text-xs font-bold">{t("mild")}</div></div>
              <div className="bg-white rounded-2xl p-4 border shadow-sm border-rose-100"><div className="text-xs font-bold text-rose-700">{t("highRisk")}</div><div className="font-jakarta font-extrabold text-3xl text-rose-600">04</div><div className="inline-flex mt-1 px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-xs font-bold">{t("critical")}</div></div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-12 bg-white rounded-2xl border shadow-sm p-3">
              <HerdUpload autoPredict />
              <div className="mt-2 flex items-center justify-between flex-wrap gap-2">
                <p className="text-xs text-slate-500">Excel rows → live herd below. Click any cow for per-cow prediction, or run automatic batch:</p>
                <div className="flex gap-2">
                  <button onClick={() => predictAll()} className="px-3 py-2 rounded-full bg-slate-900 text-white text-xs font-bold">🤖 Auto-predict all {cows.length} cows</button>
                  <Link to="/doctor/herd" className="px-3 py-2 rounded-full bg-emerald-700 text-white text-xs font-bold">Open herd table →</Link>
                </div>
              </div>
              <div className="mt-2 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                {cows.map((c) => (
                  <Link key={c.id} to={`/doctor/cow/${c.id}`} className="border rounded-xl p-2 text-xs bg-slate-50 hover:border-emerald-400">
                    <div className="font-bold">{c.id} '{c.name}' <span className="font-normal text-slate-500">• {c.yieldL}L • {c.scc}k</span></div>
                    <div className="font-bold text-emerald-800">{c.predicting ? "⏳ predicting…" : c.prediction ? `${c.prediction.class} ${Math.round(c.prediction.display_score * 100)}% ${c.prediction.live ? "🟢" : "🟡"}` : "— no prediction yet, click →"}</div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-12">
              <SavingsStrip base="/doctor" />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-5">
            <div id="ai" className="col-span-12 xl:col-span-8 bg-white rounded-2xl border shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center"><span className="material-symbols-outlined">smart_toy</span></div>
                  <div>
                    <h3 className="font-jakarta font-bold text-[15px] leading-none">{t("aiTitle")}</h3>
                    <p className="text-xs text-slate-500">Gradio Model: <a href={MODEL_URL} target="_blank" rel="noreferrer" className="text-emerald-700 underline font-semibold">{MODEL_URL.replace('https://','')}</a> • 94% Accuracy</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">{t("modelLive")}</span>
              </div>
              <div className="bg-slate-50 p-3 space-y-3">
                <MastitisPredictor />
                <details className="bg-white rounded-xl border">
                  <summary className="px-3 py-2 text-xs font-bold cursor-pointer text-slate-600">Still want the raw Gradio UI? Expand embedded frame</summary>
                  <div className="p-2"><ModelFrame height={420} /></div>
                </details>
                <div className="mt-2 text-xs text-slate-500 flex items-center gap-2"><span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> {t("autoSync")}</div>
              </div>
              <div className="px-5 py-4 bg-slate-50 border-t">
                <h4 className="font-bold text-xs uppercase tracking-widest text-slate-500 mb-2">{t("inputParams")}</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                  <div className="bg-white border rounded-lg p-2"><div className="font-bold">{t("animalProfile")}</div><div className="text-slate-500">{t("animalProfileSub")}</div></div>
                  <div className="bg-white border rounded-lg p-2"><div className="font-bold">{t("milkQuality")}</div><div className="text-slate-500">{t("milkQualitySub")}</div></div>
                  <div className="bg-white border rounded-lg p-2"><div className="font-bold">{t("physiology")}</div><div className="text-slate-500">{t("physiologySub")}</div></div>
                  <div className="bg-white border rounded-lg p-2"><div className="font-bold">{t("farmEnv")}</div><div className="text-slate-500">{t("farmEnvSub")}</div></div>
                </div>
              </div>
            </div>

            <div className="col-span-12 xl:col-span-4 space-y-5">
              <div className="bg-white rounded-2xl border shadow-sm p-5">
                <h3 className="font-bold text-sm flex items-center gap-2"><span className="material-symbols-outlined text-emerald-700">donut_large</span> {t("herdRisk")}</h3>
                <div className="mt-4 flex items-center gap-6">
                  <div className="w-28 h-28 rounded-full border-[10px] border-emerald-500 border-t-amber-400 border-r-sky-400 border-b-red-500 flex items-center justify-center flex-col"><span className="font-jakarta font-extrabold text-2xl">48</span><span className="text-xs text-slate-500">Animals</span></div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between gap-6"><span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-emerald-500 rounded-full"></span> No Risk</span> <b>28 (58%)</b></div>
                    <div className="flex justify-between gap-6"><span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-lime-500 rounded-full"></span> Low</span> <b>7 (15%)</b></div>
                    <div className="flex justify-between gap-6"><span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-amber-500 rounded-full"></span> Moderate</span> <b>9 (19%)</b></div>
                    <div className="flex justify-between gap-6"><span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-red-500 rounded-full"></span> High</span> <b>4 (8%)</b></div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-50 border rounded-xl p-3"><div className="text-slate-500 font-semibold">{t("todaysMilk")}</div><div className="font-jakarta font-extrabold text-xl">286 L</div><div className="text-red-600 font-bold">-4.2% dip</div></div>
                  <div className="bg-slate-50 border rounded-xl p-3"><div className="text-slate-500 font-semibold">{t("bulkScc")}</div><div className="font-jakarta font-extrabold text-xl">245k</div><div className="text-amber-700 font-bold">{t("gradeB")}</div></div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-emerald-900 to-teal-900 rounded-2xl p-5 text-white">
                <h3 className="font-bold text-sm flex items-center gap-2"><span className="material-symbols-outlined text-emerald-300">timeline</span> {t("windowTitle")}</h3>
                <div className="mt-3 bg-black/20 rounded-xl p-3 border border-white/10 space-y-2">
                  <div className="flex justify-between text-xs"><span>{t("withoutAction")}</span><span className="text-rose-300 font-bold">87% → Clinical</span></div>
                  <div className="w-full h-2 bg-white/10 rounded-full"><div className="h-full bg-rose-500 rounded-full" style={{width:'87%'}}></div></div>
                  <div className="flex justify-between text-xs"><span>{t("withSop")}</span><span className="text-emerald-300 font-bold">34% Safe</span></div>
                  <div className="w-full h-2 bg-white/10 rounded-full"><div className="h-full bg-emerald-400 rounded-full" style={{width:'34%'}}></div></div>
                </div>
                <div className="mt-3 text-xs text-emerald-100">{t("saves")}</div>
              </div>
              <div className="bg-white rounded-2xl border shadow-sm p-5">
                <h3 className="font-bold text-sm flex items-center gap-2"><span className="material-symbols-outlined text-emerald-700">map</span> {t("gisTitle")}</h3>
                <div className="mt-3 h-40 rounded-xl bg-slate-100 border flex items-center justify-center relative overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-40" alt="map"/>
                  <div className="relative bg-white/90 backdrop-blur px-3 py-2 rounded-xl border text-xs shadow">
                    <div className="font-bold">{t("anandCluster")}</div><div className="text-slate-600">{t("dampZone")}</div>
                    <div className="mt-1 flex gap-1.5"><span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-bold">{t("hotspot")}</span><span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">THI 78</span></div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-slate-500">GPS geo-tagged • NB-IoT / GSM</div>
              </div>
            </div>
          </div>

          <div id="priority" className="bg-white rounded-2xl border shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b flex items-center justify-between">
              <div><h3 className="font-jakarta font-bold">{t("animalTableTitle")}</h3><p className="text-xs text-slate-500">{t("animalTableSub")}</p></div>
              <div className="flex gap-2"><button className="px-3 py-1.5 rounded-full border bg-slate-50 text-xs font-bold">Export CSV</button><Link to="/doctor/vet" className="px-3 py-1.5 rounded-full bg-emerald-700 text-white text-xs font-bold">WhatsApp SOP to Vet</Link></div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] tracking-wider">
                  <tr><th className="px-4 py-3 text-left">Animal</th><th className="px-3 py-3">Breed / Lact / Age</th><th className="px-3 py-3">Milk</th><th className="px-3 py-3">SCC</th><th className="px-3 py-3">Udder 4Q</th><th className="px-3 py-3">Conductivity</th><th className="px-3 py-3">Collar</th><th className="px-3 py-3">Risk</th><th className="px-3 py-3">Action</th></tr>
                </thead>
                <tbody className="divide-y">
                  <tr className="bg-rose-50/50">
                    <td className="px-4 py-3 flex items-center gap-2"><img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqpb-AIQJbaaZPnOJ4fHMCRQJDq2DCdfd1XtUDisbRoTcuYbwKAQwXzL2pzvVl5DKGWHnq8JCvMU_AHAR81d3tagGfYVttI2WTQEo03TQ4SAT79mv1NI5BRoUGIus3laBT83IBYUryT04g7baUf9lzPjaKfHwHkU5C8AHj4UNdopePUQ8d_QAtcKICEhgH3RkRgpMEcUh5N9OqGgqVAy-va4kDocK87b-n0rIaZ5dvVJlpGkqmoeFT2g" className="w-9 h-9 rounded-lg object-cover" alt="ganga"/><div><div className="font-bold">COW-024 'Ganga'</div><div className="text-slate-500">#4402 • Stall 4</div></div></td>
                    <td className="px-3 py-3 text-center">Gir Cross • 4th • 6 yrs</td><td className="px-3 py-3 text-center font-bold text-rose-700">12.5 L (-12%)</td><td className="px-3 py-3 text-center font-bold text-rose-700">420k</td>
                    <td className="px-3 py-3"><span className="px-1.5 py-1 rounded bg-emerald-100 text-emerald-800 text-[11px]">FL 37.8°</span> <span className="px-1.5 py-1 rounded bg-red-600 text-white font-bold text-[11px]">RR 39.1°</span></td>
                    <td className="px-3 py-3 text-center font-bold text-rose-700">+1.4</td><td className="px-3 py-3 text-center">Temp 39.2° • Rumination ↓18%</td><td className="px-3 py-3"><span className="px-3 py-1 rounded-full bg-red-600 text-white font-bold">87% HIGH</span></td><td className="px-3 py-3"><button className="px-3 py-1.5 rounded-full bg-emerald-700 text-white font-bold text-xs">Log CMT</button></td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 flex items-center gap-2"><img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMl8COrOMrj_SSxfTMsMsC6cMrK616BH4CL6SzvUlhY22N4q8Zb4yZmhVfMsgX8FZXdsoa6BqVSvlAQR0pxnPMULed9oK7K8EF3JylhvetDB1_VIryzUgtBgtWW7quiYixTfA2xfxXhf9_jAJDKqaP9gqVAy-va4kDocK87b-n0rIaZ5dvVJlpGkqmoeFT2g" className="w-9 h-9 rounded-lg object-cover" alt="gauri"/><div><div className="font-bold">COW-018 'Gauri'</div><div className="text-slate-500">#3819 • Murrah</div></div></td>
                    <td className="px-3 py-3 text-center">Murrah • 3rd • 5 yrs</td><td className="px-3 py-3 text-center font-bold">9.8 L (-9%)</td><td className="px-3 py-3 text-center">380k</td><td className="px-3 py-3 text-center"><span className="px-2 py-1 rounded bg-red-100 text-red-700">RH Hot</span></td><td className="px-3 py-3 text-center font-bold text-rose-700">+1.1</td><td className="px-3 py-3 text-center">Feeding ↓12%</td><td className="px-3 py-3"><span className="px-3 py-1 rounded-full bg-red-100 text-red-700 font-bold border border-red-200">79% HIGH</span></td><td className="px-3 py-3"><button className="px-3 py-1.5 rounded-full bg-emerald-700 text-white font-bold text-xs">Log CMT</button></td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 flex items-center gap-2"><div className="w-9 h-9 rounded-lg bg-sky-100 flex items-center justify-center"><span className="material-symbols-outlined text-sky-700">cruelty_free</span></div><div><div className="font-bold">COW-031 'Lakshmi'</div><div className="text-slate-500">#5104 • HF Cross</div></div></td>
                    <td className="px-3 py-3 text-center">HF Cross • 2nd • 4 yrs</td><td className="px-3 py-3 text-center">15.2 L (-14%)</td><td className="px-3 py-3 text-center">290k</td><td className="px-3 py-3 text-center"><span className="px-2 py-1 rounded bg-sky-100 text-sky-800">LF +0.8°C</span></td><td className="px-3 py-3 text-center">+0.6</td><td className="px-3 py-3 text-center">Vaccinated ✓</td><td className="px-3 py-3"><span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-bold">74% MOD</span></td><td className="px-3 py-3"><button className="px-3 py-1.5 rounded-full bg-slate-100 border font-bold text-xs">Heat Map</button></td>
                  </tr>
                  <tr className="bg-amber-50/40">
                    <td className="px-4 py-3 flex items-center gap-2"><div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center"><span className="material-symbols-outlined text-amber-700">pets</span></div><div><div className="font-bold">COW-007 'Saras'</div><div className="text-slate-500">#2988 • Gir</div></div></td>
                    <td className="px-3 py-3 text-center">Gir • 5th • 7 yrs</td><td className="px-3 py-3 text-center">11.0 L (-6%)</td><td className="px-3 py-3 text-center">210k</td><td className="px-3 py-3 text-center">Mild diffuse</td><td className="px-3 py-3 text-center">+0.4</td><td className="px-3 py-3 text-center">THI high</td><td className="px-3 py-3"><span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-bold">68% MOD</span></td><td className="px-3 py-3"><button className="px-3 py-1.5 rounded-full bg-slate-100 border font-bold text-xs">Watch</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="text-center text-xs text-slate-400 py-4">PathoTracer • SIH 2025 • <Link to="/" className="underline text-emerald-700">Home</Link> • Model: <a href={MODEL_URL} target="_blank" rel="noreferrer" className="underline text-emerald-700">{MODEL_URL.replace('https://','')}</a></div>
        </main>
      </div>
    </div>
  );
}
