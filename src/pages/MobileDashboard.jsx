import { Link, useNavigate } from "react-router-dom";
import ModelFrame from "../components/ModelFrame";
import MastitisPredictor from "../components/MastitisPredictor";
import HerdUpload from "../components/HerdUpload";
import SavingsStrip from "../components/SavingsStrip";
import Logo from "../components/Logo";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { useHerd } from "../context/HerdContext";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { useAudioBriefing } from "../hooks/useAudioBriefing";

export default function MobileDashboard() {
  const { t } = useLanguage();
  const { playing, toggle } = useAudioBriefing();
  const { logout } = useAuth();
  const { cows, source } = useHerd();
  const nav = useNavigate();
  const high = cows.filter((c) => c.prediction?.class === "High").length;
  const mod = cows.filter((c) => c.prediction?.class === "Moderate").length;
  const low = cows.filter((c) => c.prediction?.class === "Low").length;
  const watch = mod + low;
  const flagged = high + mod;
  const avgScc = cows.length ? Math.round(cows.reduce((a, c) => a + (Number(c.scc) || 0), 0) / cows.length) : 0;
  const healthy = cows.filter((c) => c.prediction?.class === "No Risk").length;
  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="h-16 px-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <Logo size={40} showText={true} />
          </div>
          <div className="flex items-center gap-1.5">
            <LanguageSwitcher compact/>
            <button onClick={toggle} className={`w-9 h-9 rounded-full flex items-center justify-center ${playing?"bg-red-600 text-white":"bg-emerald-700 text-white"}`}><span className="material-symbols-outlined text-[18px]">{playing ? 'pause' : 'volume_up'}</span></button>
            <button onClick={()=>{logout(); nav("/login");}} title="Sign out" className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center"><span className="material-symbols-outlined text-[18px]">logout</span></button>
            <Link to="/farmer/alerts" className="w-9 h-9 rounded-full bg-slate-100 border flex items-center justify-center relative"><span className="material-symbols-outlined text-[20px]">notifications</span><span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-600 rounded-full ring-2 ring-white"></span></Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col pt-20 pb-4 px-4 space-y-4 w-full max-w-md lg:max-w-6xl mx-auto lg:grid lg:grid-cols-12 lg:gap-5 lg:space-y-0">
        <div className="flex items-center justify-between pt-1 lg:col-span-12">
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700"><span className="material-symbols-outlined">agriculture</span></div>
            <div><div className="font-jakarta font-bold flex items-center gap-1">{t("greeting")}</div><div className="text-xs text-slate-500">{t("herdSub")}</div></div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1"><span className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse"></span> {t("live")}</span>
        </div>

        <section className="relative rounded-2xl overflow-hidden shadow border bg-slate-900 text-white lg:col-span-8">
          <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqpb-AIQJbaaZPnOJ4fHMCRQJDq2DCdfd1XtUDisbRoTcuYbwKAQwXzL2pzvVl5DKGWHnq8JCvMU_AHAR81d3tagGfYVttI2WTQEo03TQ4SAT79mv1NI5BRoUGIus3laBT83IBYUryT04g7baUf9lzPjaKfHwHkU5C8AHj4UNdopePUQ8d_QAtcKICEhgH3RkRgpMEcUh5N9OqGgqVAy-va4kDocK87b-n0rIaZ5dvVJlpGkqmoeFT2g" className="w-full h-56 lg:h-72 object-cover brightness-[0.85]" alt="shed"/>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>
          <div className="absolute top-3 left-3 right-3 flex justify-between gap-2 text-[11px]"><span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur border border-white/20 flex items-center gap-1"><span className="material-symbols-outlined text-emerald-400 text-[15px]">sensors</span> Stall #4 • Morning</span><span className="px-2.5 py-1 rounded-full bg-amber-500/80 backdrop-blur text-white font-bold">32°C • High THI</span></div>
          <div className="absolute bottom-3 left-3 right-3 space-y-2">
            <div><p className="text-[11px] text-emerald-300 uppercase tracking-wider">Automated Audio Briefing</p><h4 className="font-jakarta font-bold text-white">Today's Barn Health Pulse</h4></div>
            <div className="bg-white/15 backdrop-blur border border-white/20 rounded-xl p-2 flex items-center justify-between gap-2">
              <button onClick={toggle} className="flex-1 flex items-center gap-2 text-left"><div className={`w-9 h-9 rounded-full flex items-center justify-center ${playing?"bg-red-500":"bg-emerald-500"}`}><span className="material-symbols-outlined text-white">{playing ? 'pause' : 'play_arrow'}</span></div><div><span className="text-xs font-bold text-white block">{playing ? t("briefingPlaying") : t("audioBriefing")}</span><span className="text-[11px] text-white/70">{flagged ? `${flagged} animals need attention` : "Predict herd to see attention list"}</span></div></button>
              <span className="h-8 px-3 rounded-lg bg-white/20 border border-white/20 text-white text-xs font-bold flex items-center">EN</span>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-r from-red-600 to-rose-700 rounded-2xl p-4 text-white space-y-2 shadow-lg relative overflow-hidden lg:col-span-4">
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="flex justify-between items-start gap-2 relative"><span className="text-xs font-extrabold tracking-widest text-rose-100 flex items-center gap-2"><span className="w-2 h-2 bg-white rounded-full animate-pulse"></span> {t("criticalTitle")}</span><span className="bg-white text-red-700 text-[10px] font-black px-2 py-0.5 rounded-full">Stage-1</span></div>
          <h2 className="font-jakarta font-extrabold text-lg relative">{t("criticalH")}</h2>
          <p className="text-[13px] text-rose-100 relative">{t("criticalP")}</p>
          <a href="#priority" className="w-full h-11 bg-white text-red-700 rounded-xl font-bold flex items-center justify-center gap-2 relative">{t("triage")} <span className="material-symbols-outlined">arrow_forward</span></a>
        </section>

        <section className="bg-white rounded-2xl border-2 border-emerald-300 shadow-sm overflow-hidden lg:col-span-4">
          <div className="px-4 py-3 border-b bg-emerald-50 flex items-center justify-between">
            <div>
              <h3 className="font-jakarta font-bold text-sm leading-none">🌾 My Cows — from Excel ({cows.length} • {source})</h3>
              <p className="text-[11px] text-slate-600">Tap any cow → auto prediction in simple words • {high} high-risk</p>
            </div>
            <Link to="/farmer/herd" className="px-2 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-bold">Open →</Link>
          </div>
          <div className="p-2 grid grid-cols-2 gap-2">
            {cows.slice(0, 4).map((c) => (
              <Link key={c.id} to={`/farmer/cow/${c.id}`} className="bg-slate-50 border rounded-xl p-2 text-xs">
                <div className="font-bold">{c.id} '{c.name}'</div>
                <div className="text-slate-500">{c.yieldL}L • {c.scc}k SCC</div>
                <div className="mt-1 font-bold text-emerald-800">{c.prediction ? `${c.prediction.class} ${Math.round(c.prediction.display_score * 100)}%` : "Tap → Predict"}</div>
              </Link>
            ))}
          </div>
          <div className="p-2"><HerdUpload compact /></div>
        </section>

        <section className="bg-white rounded-2xl border-2 border-emerald-300 shadow-sm overflow-hidden lg:col-span-12">
          <div className="px-4 py-3 border-b bg-emerald-50 flex items-center justify-between">
            <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center"><span className="material-symbols-outlined text-[18px]">smart_toy</span></div><div><h3 className="font-jakarta font-bold text-sm leading-none">{t("aiShort")}</h3><p className="text-[11px] text-slate-600">{t("aiSub")}</p></div></div>
            <span className="px-2 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-bold">{t("modelLive")}</span>
          </div>
          <div className="p-2 bg-slate-50 space-y-3">
            <MastitisPredictor compact />
            <details className="bg-white rounded-xl border">
              <summary className="px-3 py-2 text-xs font-bold cursor-pointer text-slate-600">Raw Gradio UI (optional)</summary>
              <div className="p-2"><ModelFrame height={420} /></div>
            </details>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white border rounded-xl p-2"><b>Breed/Age/Lact</b><br/><span className="text-slate-600">Gir/Murrah/HF, 2-7yr, Vaccination</span></div>
              <div className="bg-white border rounded-xl p-2"><b>Milk</b><br/><span className="text-slate-600">Yield, SCC, Conductivity, pH</span></div>
              <div className="bg-white border rounded-xl p-2"><b>Collar</b><br/><span className="text-slate-600">Temp, Activity, Rumination</span></div>
              <div className="bg-white border rounded-xl p-2"><b>Environment</b><br/><span className="text-slate-600">THI, Hygiene, Housing, SOP</span></div>
            </div>
          </div>
        </section>

        <section className="space-y-2 lg:col-span-8">
          <div className="flex justify-between items-center px-1"><h3 className="font-jakarta font-bold text-sm flex items-center gap-1.5"><span className="material-symbols-outlined text-emerald-700">grid_view</span> {t("herdVitals")}</h3><span className="text-xs text-slate-500">Anand Unit #14</span></div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
            <div className="bg-white rounded-xl p-3 border shadow-sm"><div className="text-xs font-semibold text-slate-500">{t("totalHerd")}</div><div className="font-jakarta font-extrabold text-2xl">{cows.length}</div><div className="text-xs text-slate-500">{source}</div></div>
            <div className="bg-white rounded-xl p-3 border border-emerald-100"><div className="text-xs font-semibold text-emerald-700">{t("healthy")}</div><div className="font-jakarta font-extrabold text-2xl text-emerald-700">{healthy || "—"}</div><span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">{t("safe")}</span></div>
            <div className="bg-white rounded-xl p-3 border border-sky-100"><div className="text-xs font-semibold text-sky-700">{t("watchlist")}</div><div className="font-jakarta font-extrabold text-2xl text-sky-700">{watch}</div><span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 text-xs font-bold">{t("mild")}</span></div>
            <div className="bg-white rounded-xl p-3 border border-rose-100"><div className="text-xs font-semibold text-rose-700">{t("highRisk")}</div><div className="font-jakarta font-extrabold text-2xl text-rose-600">{high}</div><span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-xs font-bold">{t("critical")}</span></div>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-white rounded-xl p-3 border"><div className="text-xs text-slate-500 font-semibold flex justify-between">{t("todaysMilk")} <span className="material-symbols-outlined text-sky-600 text-[16px]">water_drop</span></div><div className="font-jakarta font-extrabold text-xl">{cows.reduce((a, c) => a + (Number(c.yieldL) || 0), 0).toFixed(0)} <span className="text-xs font-normal">L/day</span></div><div className="text-xs text-red-600 font-bold">live from Excel</div></div>
            <div className="bg-white rounded-xl p-3 border"><div className="text-xs text-slate-500 font-semibold flex justify-between">{t("bulkScc")} <span className="material-symbols-outlined text-amber-600 text-[16px]">biotech</span></div><div className="font-jakarta font-extrabold text-xl">{avgScc}k</div><div className="text-xs text-amber-700 font-bold">{avgScc > 200 ? "Above 200k line" : t("gradeB")}</div></div>
          </div>
        </section>

        <div className="lg:col-span-12"><SavingsStrip base="/farmer" /></div>

        <section className="bg-gradient-to-br from-emerald-900 to-teal-950 rounded-2xl p-4 text-white space-y-3 shadow lg:col-span-4">
          <div className="flex justify-between items-center"><div className="flex items-center gap-2"><div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center"><span className="material-symbols-outlined text-emerald-300">timeline</span></div><div><h3 className="font-jakarta font-bold text-sm">{t("windowTitle")}</h3><span className="text-xs text-emerald-200">{t("saves")}</span></div></div></div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-white/10 rounded-xl p-2 border border-white/10"><div className="w-6 h-6 rounded-full bg-emerald-400 text-emerald-900 flex items-center justify-center font-bold text-xs mx-auto mb-1">1</div><span className="text-xs font-bold">Detect</span><span className="block text-[10px] text-emerald-100">Collar Drift</span></div>
            <div className="bg-white/10 rounded-xl p-2 border border-white/10"><div className="w-6 h-6 rounded-full bg-emerald-400 text-emerald-900 flex items-center justify-center font-bold text-xs mx-auto mb-1">2</div><span className="text-xs font-bold">Explain</span><span className="block text-[10px] text-emerald-100">Quarter Heat</span></div>
            <div className="bg-white/10 rounded-xl p-2 border border-white/10"><div className="w-6 h-6 rounded-full bg-emerald-400 text-emerald-900 flex items-center justify-center font-bold text-xs mx-auto mb-1">3</div><span className="text-xs font-bold">Act</span><span className="block text-[10px] text-emerald-100">Iodine Dip</span></div>
          </div>
          <div className="bg-black/25 rounded-xl p-3 border border-white/10 space-y-2 text-xs"><div className="flex justify-between"><span className="text-rose-300">{t("withoutAction")}: 87% Risk</span><span className="font-bold text-rose-300">Clinical</span></div><div className="w-full h-2 bg-white/10 rounded-full"><div className="h-full bg-rose-500 rounded-full" style={{width:'87%'}}></div></div><div className="flex justify-between"><span className="text-emerald-300">{t("withSop")}: 34% Safe</span><span className="font-bold text-emerald-300">Prevented</span></div><div className="w-full h-2 bg-white/10 rounded-full"><div className="h-full bg-emerald-400 rounded-full" style={{width:'34%'}}></div></div></div>
        </section>

        <section id="priority" className="space-y-3 lg:col-span-8">
          <div className="flex justify-between items-center px-1"><div><h3 className="font-jakarta font-bold text-sm">{t("animalTableTitle")}</h3><span className="text-xs text-slate-500">{flagged} flagged • CMT paddle required</span></div><span className="px-3 py-1 rounded-full bg-slate-100 border text-xs font-bold">Filter ({flagged})</span></div>
          <div className="bg-white rounded-2xl p-4 border-2 border-red-500 shadow-sm space-y-3">
            <div className="flex items-start justify-between gap-2"><div className="flex gap-3"><img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqpb-AIQJbaaZPnOJ4fHMCRQJDq2DCdfd1XtUDisbRoTcuYbwKAQwXzL2pzvVl5DKGWHnq8JCvMU_AHAR81d3tagGfYVttI2WTQEo03TQ4SAT79mv1NI5BRoUGIus3laBT83IBYUryT04g7baUf9lzPjaKfHwHkU5C8AHj4UNdopePUQ8d_QAtcKICEhgH3RkRgpMEcUh5N9OqGgqVAy-va4kDocK87b-n0rIaZ5dvVJlpGkqmoeFT2g" className="w-16 h-16 rounded-xl object-cover" alt="ganga"/><div><div className="font-jakarta font-extrabold">COW-024 'Ganga'</div><div className="text-xs text-slate-500">Gir Cross • 4th Lact • #4402</div><span className="inline-block mt-1 text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">12.5 L (-12%)</span></div></div><span className="px-2 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-200 text-xs font-extrabold">87% (7-10d)</span></div>
            <div className="bg-slate-50 rounded-xl p-2.5 border"><div className="flex justify-between text-xs font-semibold mb-1.5"><span className="flex items-center gap-1"><span className="material-symbols-outlined text-rose-600 text-[16px]">thermostat</span> 4-Quadrant Udder Heat</span><span className="bg-rose-50 border border-rose-200 px-2 py-0.5 rounded text-rose-700">RR +1.4 mS/cm</span></div><div className="grid grid-cols-2 gap-1.5 text-xs text-center"><div className="bg-white border border-emerald-200 rounded-lg py-1.5 font-semibold text-emerald-800">FL 37.8° Normal</div><div className="bg-white border border-emerald-200 rounded-lg py-1.5 font-semibold text-emerald-800">FR 37.9° Normal</div><div className="bg-white border rounded-lg py-1.5">RL 38.2° Mild</div><div className="bg-rose-600 text-white rounded-lg py-1.5 font-bold">RR 39.1° High!</div></div></div>
            <div className="flex justify-between text-xs text-slate-500 px-1"><span>SCC Est: <b className="text-rose-700">420k</b></span><span className="text-amber-700">Stall #4 damp</span></div>
            <div className="grid grid-cols-2 gap-2"><button className="h-11 bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-1 text-xs"><span className="material-symbols-outlined text-[18px]">science</span> Log CMT</button><button className="h-11 bg-slate-100 rounded-xl font-semibold text-xs">View Profile →</button></div>
          </div>
          <div className="bg-white rounded-2xl p-4 border-l-4 border-rose-500 border shadow-sm space-y-3">
            <div className="flex items-start justify-between gap-2"><div className="flex gap-3"><img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMl8COrOMrj_SSxfTMsMsC6cMrK616BH4CL6SzvUlhY22N4q8Zb4yZmhVfMsgX8FZXdsoa6BqVSvlAQR0pxnPMULed9oK7K8EF3JylhvetDB1_VIryzUgtBgtWW7quiYixTfA2xfxXhf9_jAJDKqaP9gqVAy-va4kDocK87b-n0rIaZ5dvVJlpGkqmoeFT2g" className="w-16 h-16 rounded-xl object-cover" alt="gauri"/><div><div className="font-jakarta font-extrabold">COW-018 'Gauri'</div><div className="text-xs text-slate-500">Murrah • 3rd Lact • #3819</div><span className="mt-1 inline-block text-xs font-bold bg-rose-50 px-2 py-0.5 rounded">9.8 L (-9%)</span></div></div><span className="px-2 py-1 rounded-full bg-rose-100 text-rose-800 border text-xs font-bold">79% (9d)</span></div>
            <div className="bg-slate-50 rounded-xl p-2.5 border flex justify-between text-xs"><span className="text-rose-700 font-semibold flex items-center gap-1"><span className="material-symbols-outlined">electric_bolt</span> RH +1.1 mS/cm</span><span className="font-bold">06:15 AM</span></div>
            <button className="w-full h-11 bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1"><span className="material-symbols-outlined">science</span> Log CMT Test</button>
          </div>
          <div className="bg-white rounded-2xl p-4 border-l-4 border-sky-500 border shadow-sm space-y-3">
            <div className="flex items-start justify-between gap-2"><div className="flex gap-3"><div className="w-16 h-16 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center"><span className="material-symbols-outlined text-sky-700 text-[32px]">cruelty_free</span></div><div><div className="font-jakarta font-extrabold">COW-031 'Lakshmi'</div><div className="text-xs text-slate-500">HF Cross • 2nd Lact • #5104</div><span className="mt-1 inline-block text-xs font-bold bg-sky-50 px-2 py-0.5 rounded">15.2 L (-14%)</span></div></div><span className="px-2 py-1 rounded-full bg-sky-100 text-sky-800 border text-xs font-bold">74% (12d)</span></div>
            <div className="bg-slate-50 rounded-xl p-2.5 border flex justify-between text-xs"><span className="text-sky-700 font-semibold flex items-center gap-1"><span className="material-symbols-outlined">heat_pump</span> LF +0.8°C</span><span className="font-bold">SCC 290k</span></div>
            <button className="w-full h-11 bg-slate-100 rounded-xl font-semibold text-xs flex items-center justify-center gap-1"><span className="material-symbols-outlined text-sky-700">visibility</span> View Heat Map & SOP</button>
          </div>
        </section>

        <section className="bg-white rounded-2xl p-4 border shadow-sm space-y-3 lg:col-span-7">
          <div className="flex justify-between items-center">            <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center"><span className="material-symbols-outlined">assignment_turned_in</span></div><div><h3 className="font-jakarta font-bold text-sm">{t("sopTitle")}</h3><span className="text-xs text-slate-500">Daily preventive tasks</span></div></div><span className="px-2 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">1/3 Done</span></div>
          <div className="space-y-2 text-xs">
            <div className="bg-slate-50 rounded-xl p-3 flex gap-3 border border-rose-100"><div className="w-6 h-6 rounded-full border-2 border-rose-400 bg-white flex-shrink-0"></div><div><div className="flex justify-between gap-2"><b>1. Strip Cup & 4-Well CMT</b><span className="px-2 py-0.5 rounded bg-rose-100 text-rose-700 font-bold text-[11px]">Urgent</span></div><p className="text-slate-500 mt-1">Test COW-024 & 018 before cluster attach</p></div></div>
            <div className="bg-emerald-50 rounded-xl p-3 flex gap-3 border border-emerald-200"><div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0"><span className="material-symbols-outlined text-[16px]">check</span></div><div><div className="flex justify-between gap-2"><b className="line-through text-slate-500">2. Vacuum Calibration</b><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[11px]">Done ✓</span></div><p className="text-slate-500 mt-1">42 kPa • 60:40 ratio</p></div></div>
            <div className="bg-slate-50 rounded-xl p-3 flex gap-3 border border-sky-100"><div className="w-6 h-6 rounded-full bg-sky-100 border border-sky-300 flex items-center justify-center flex-shrink-0"><span className="material-symbols-outlined text-[14px]">hourglass_top</span></div><div><div className="flex justify-between gap-2"><b>3. Barrier Teat Dip</b><span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-bold text-[11px]">In Progress</span></div><p className="text-slate-500 mt-1">0.5% Povidone Iodine • Stand 30 min</p></div></div>
          </div>
        </section>

        <section className="bg-white rounded-2xl p-4 border shadow-sm space-y-3 lg:col-span-5">
          <h3 className="font-jakarta font-bold text-sm flex items-center gap-2"><span className="material-symbols-outlined text-emerald-700">settings_input_component</span> SIH Solution Components</h3>
          <details open className="border rounded-xl p-3 bg-slate-50"><summary className="font-bold text-xs cursor-pointer">Hardware — IoT Field Kit</summary><ul className="mt-2 text-xs text-slate-600 list-disc pl-5 space-y-1"><li>Milk sensors: conductivity, temp, pH, yield</li><li>Collar wearables: body & udder temp, activity, rumination</li><li>Wireless: Bluetooth / Wi-Fi / GSM / NB-IoT / LoRa</li><li>Solar + Battery • GPS geo-tag • Rugged IP67</li></ul></details>
          <details className="border rounded-xl p-3 bg-slate-50"><summary className="font-bold text-xs cursor-pointer">Software — Cloud & Mobile</summary><ul className="mt-2 text-xs text-slate-600 list-disc pl-5 space-y-1"><li>AI/ML Gradio live model + SCC algorithm</li><li>Apps Farmer/Vet/Field • Multilingual + Voice</li><li>Cloud storage, dashboards, SMS/WhatsApp alerts</li><li>GIS hotspot visualization</li></ul></details>
        </section>

        <section className="bg-white rounded-2xl p-4 border shadow-sm space-y-3 lg:col-span-12">
          <div className="flex justify-between items-center"><div className="flex items-center gap-2"><div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center"><span className="material-symbols-outlined">local_hospital</span></div><h3 className="font-jakarta font-bold text-sm">{t("navVet")}</h3></div><span className="px-2 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-1"><span className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse"></span> On Duty</span></div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBW9n0hAqfPV1coAuljo_rhZnXXrpesYJFTRF-gIxTAi3I4eytSj3GBrlGYTcw3k-LXezy9afA05QxP0eaEP1PJOly2VdfErnMKuCst2wBtZiObCkyfjHWZ2clmE3pCjiRonUGHWk_OKozudyDPhI2uALs5CHou-whR2Vsj210qi7iwXXdr1ZODRGbcOPbKKJSuWTqW_DjRSF8GlGgVlKOeT-wdkYOdfGf_K1dDPP0gPqnxkaSBgOxlig" className="w-14 h-14 rounded-full object-cover ring-2 ring-emerald-200" alt="vet"/>
            <div className="flex-1 min-w-0"><div className="font-bold text-sm">Dr. S. Radhakrishnan, BVSc</div><div className="text-xs text-slate-500">Anand Milk Union • Sector 3 • 8 mins</div></div>
          </div>
           <div className="grid grid-cols-2 gap-2"><Link to="/farmer/vet" className="h-11 bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-1 text-xs"><span className="material-symbols-outlined">call</span> {t("navVet")}</Link><Link to="/farmer/vet" className="h-11 bg-slate-100 border rounded-xl font-semibold flex items-center justify-center gap-1 text-xs"><span className="material-symbols-outlined text-emerald-700">share</span> WhatsApp SOP</Link></div>
        </section>
      </main>
    </>
  );
}
