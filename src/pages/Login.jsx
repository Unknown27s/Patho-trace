import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import LanguageSwitcher from "../components/LanguageSwitcher";
import Logo from "../components/Logo";

function RoleCard({ icon, title, desc, idHint, onUse, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`text-left rounded-2xl border-2 p-4 transition w-full ${active ? "border-emerald-600 bg-emerald-50" : "border-slate-200 bg-white hover:border-emerald-300"}`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${active ? "bg-emerald-700 text-white" : "bg-slate-100 text-emerald-700"}`}>
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        <div>
          <div className="font-jakarta font-extrabold">{title}</div>
          <div className="text-xs text-slate-500">{desc}</div>
        </div>
      </div>
      <div className="mt-2 text-[11px] font-bold text-slate-500">Demo ID: <span className="text-emerald-700">{idHint}</span></div>
      <div className="mt-1 text-[11px] text-slate-400">{onUse}</div>
    </button>
  );
}

export default function Login() {
  const { login, loginDemo } = useAuth();
  const { t } = useLanguage();
  const nav = useNavigate();
  const [role, setRole] = useState("farmer");
  const [id, setId] = useState("farmer");
  const [pw, setPw] = useState("1234");
  const [err, setErr] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const r = login(id, pw);
    if (!r.ok) { setErr(r.msg); return; }
    nav(r.role === "doctor" ? "/doctor" : "/farmer", { replace: true });
  };

  const demo = (r) => {
    loginDemo(r);
    nav(r === "doctor" ? "/doctor" : "/farmer", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center p-4">
      <div className="w-full max-w-3xl grid md:grid-cols-2 gap-4">
        <div className="bg-[#0f281e] text-white rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <Logo dark />
            <h1 className="font-jakarta font-extrabold text-2xl mt-4">Two logins, one herd.</h1>
            <p className="text-sm text-emerald-100/80 mt-2">
              Farmer view is simple + multilingual for the shed. Doctor view is the full 7–14 day command center.
              Same app — responsive in the same browser, mobile auto-switches layout. Same logo everywhere.
            </p>
            <ul className="mt-4 space-y-2 text-xs">
              <li className="flex gap-2"><span className="material-symbols-outlined text-emerald-300 text-[16px]">check_circle</span> 16-feature lnVAR/ACF predictor (LF/RF/LR/RR quarters)</li>
              <li className="flex gap-2"><span className="material-symbols-outlined text-emerald-300 text-[16px]">check_circle</span> No / Low / Moderate / High risk classes (SIH spec)</li>
              <li className="flex gap-2"><span className="material-symbols-outlined text-emerald-300 text-[16px]">check_circle</span> English + audio briefing</li>
            </ul>
          </div>
          <div className="mt-6 flex items-center justify-between">
            <LanguageSwitcher />
            <Link to="/" className="text-xs underline text-emerald-200">← Back home</Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl border shadow p-6">
          <h2 className="font-jakarta font-extrabold text-lg">Sign in to continue</h2>
          <p className="text-xs text-slate-500 mb-3">Prototype demo — no OTP/backend needed for SIH field demo.</p>
          <div className="grid gap-2">
            <RoleCard icon="agriculture" title="Farmer Login" desc="My cows, alerts, SOP in simple language" idHint="farmer / 1234" onUse="Opens simplified shed view" active={role === "farmer"} onClick={() => { setRole("farmer"); setId("farmer"); }} />
            <RoleCard icon="stethoscope" title="Doctor / Vet Login" desc="Full herd analytics, GIS, prescriptions" idHint="doctor / 1234" onUse="Opens command-center view" active={role === "doctor"} onClick={() => { setRole("doctor"); setId("doctor"); }} />
          </div>
          <form onSubmit={submit} className="mt-4 space-y-2">
            <label className="block text-xs font-bold">Login ID
              <input value={id} onChange={(e) => setId(e.target.value)} className="mt-1 w-full px-3 py-2.5 rounded-xl border bg-slate-50 text-sm" placeholder="farmer or doctor" />
            </label>
            <label className="block text-xs font-bold">Password
              <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} className="mt-1 w-full px-3 py-2.5 rounded-xl border bg-slate-50 text-sm" placeholder="1234" />
            </label>
            {err && <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg p-2">{err}</p>}
            <button className="w-full h-12 rounded-xl bg-emerald-700 text-white font-extrabold text-sm">
              Sign in as {role === "doctor" ? "Doctor" : "Farmer"} →
            </button>
          </form>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <button onClick={() => demo("farmer")} className="h-10 rounded-xl bg-slate-100 border text-xs font-bold">1-tap Farmer demo</button>
            <button onClick={() => demo("doctor")} className="h-10 rounded-xl bg-slate-900 text-white text-xs font-bold">1-tap Doctor demo</button>
          </div>
          <p className="mt-3 text-[11px] text-slate-400 text-center">{t("language")}: English • {t("live")}</p>
        </div>
      </div>
    </div>
  );
}
