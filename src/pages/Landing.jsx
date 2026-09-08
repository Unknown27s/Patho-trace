import { Link } from "react-router-dom";
import LanguageSwitcher from "../components/LanguageSwitcher";
import Logo from "../components/Logo";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { MODEL_URL } from "../config";

export default function Landing(){
  const { t } = useLanguage();
  const { user } = useAuth();
  const base = user?.role === "doctor" ? "/doctor" : "/farmer";
  return (
    <div className="bg-[#f1f5f9] min-h-screen flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        <div className="flex justify-between items-center mb-3">
          <Logo />
          <LanguageSwitcher/>
        </div>
        <div className="bg-white rounded-2xl p-6 sm:p-8 border shadow text-center">
          <h1 className="font-jakarta font-extrabold text-2xl">PathoTracer</h1>
          <p className="text-sm text-slate-500 mt-1">{t("criticalH")}</p>
          <p className="text-[11px] mt-3 bg-emerald-50 border border-emerald-200 rounded-full inline-block px-3 py-1 text-emerald-700 font-bold break-all">
            ML Live: {MODEL_URL.replace("https://","").replace(/\/$/,"")}
          </p>
          {user ? (
            <div className="mt-6 grid gap-3">
              <Link to="/dashboard" className="h-14 bg-emerald-700 text-white rounded-xl flex items-center justify-center gap-2 font-bold">
                Continue as {user.role === "doctor" ? "Doctor" : "Farmer"} →
              </Link>
              <Link to="/login" className="h-12 bg-slate-100 border rounded-xl flex items-center justify-center gap-2 font-bold text-sm">Switch login (Farmer / Doctor)</Link>
            </div>
          ) : (
            <div className="mt-6 grid gap-3">
              <Link to="/login" className="h-14 bg-emerald-700 text-white rounded-xl flex items-center justify-center gap-2 font-bold">🌾 Farmer Login</Link>
              <Link to="/login" className="h-14 bg-slate-900 text-white rounded-xl flex items-center justify-center gap-2 font-bold">🩺 Doctor / Vet Login</Link>
              <p className="text-[11px] text-slate-500">Same app, same logo — responsive in the same browser. Open on mobile and the layout auto-switches. Demo: farmer/1234 • doctor/1234</p>
            </div>
          )}
        </div>
        <div className="bg-slate-900 text-white rounded-2xl p-6 mt-4 text-xs leading-relaxed">
          <h3 className="font-bold text-sm mb-3">SIH Features (login to open)</h3>
          <div className="grid grid-cols-2 gap-2">
            <Link to={base} className="bg-white/10 hover:bg-white/20 rounded-xl p-3 border border-white/10 flex items-center gap-2"><span className="material-symbols-outlined">dashboard</span> {t("navHome")}</Link>
            <Link to={`${base}/herd`} className="bg-white/10 hover:bg-white/20 rounded-xl p-3 border border-white/10 flex items-center gap-2"><span className="material-symbols-outlined">pets</span> {t("navHerd")}</Link>
            <Link to={`${base}/alerts`} className="bg-white/10 hover:bg-white/20 rounded-xl p-3 border border-white/10 flex items-center gap-2"><span className="material-symbols-outlined">ecg_heart</span> {t("navAlerts")}</Link>
            <Link to={`${base}/sop`} className="bg-white/10 hover:bg-white/20 rounded-xl p-3 border border-white/10 flex items-center gap-2"><span className="material-symbols-outlined">assignment_turned_in</span> {t("navSop")}</Link>
            <Link to={`${base}/vet`} className="bg-white/10 hover:bg-white/20 rounded-xl p-3 border border-white/10 flex items-center gap-2"><span className="material-symbols-outlined">support_agent</span> {t("navVet")}</Link>
            <Link to={`${base}/predict`} className="bg-white/10 hover:bg-white/20 rounded-xl p-3 border border-white/10 flex items-center gap-2"><span className="material-symbols-outlined">biotech</span> 16-feature AI Lab (inside)</Link>
          </div>
        </div>
        <details className="bg-emerald-950 text-white rounded-2xl p-5 mt-4 text-xs leading-relaxed border border-emerald-800">
          <summary className="font-bold text-sm cursor-pointer flex items-center gap-2"><span className="material-symbols-outlined text-emerald-300">present_to_all</span> 🎤 60-second jury script (tap to open)</summary>
          <ol className="mt-3 space-y-2 list-decimal pl-5 text-emerald-50">
            <li><b>Problem (10s):</b> "Mastitis shows clots too late — milk is already lost and antibiotics are forced. We catch it <b>7–14 days early</b>."</li>
            <li><b>Two logins (10s):</b> Farmer login <b>farmer/1234</b> → simple shed view in 7 languages. Doctor login <b>doctor/1234</b> → full command center. <i>Same Excel data, different screens.</i></li>
            <li><b>Excel → website (15s):</b> Upload the herd Excel sheet — rows appear instantly, then <b>auto-predict runs for every cow</b> on the live 16-feature model.</li>
            <li><b>Click a cow (15s):</b> Open COW-024 → press <b>Predict</b> → farmer sees <i>what to do</i>; doctor login sees <i>why</i> (SCC analysis, 7/14/30-day trends, AI factor bars) + <b>WhatsApp report to vet</b>. Co-op board at <b>/doctor/coop</b> shows herd KPIs.</li>
            <li><b>Impact line (10s):</b> Point at the green strip — "₹X saved, Y litres protected, zero typing for the farmer."</li>
          </ol>
        </details>
      </div>
    </div>
  )
}
