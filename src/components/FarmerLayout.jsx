import { NavLink, Outlet, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";

// Persistent farmer shell:
//  - desktop: fixed sidebar (was missing on sub-pages)
//  - mobile:  fixed bottom nav
// Every /farmer/* page renders inside <Outlet/> so nav never disappears.
export default function FarmerLayout() {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const nav = useNavigate();

  const item = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${
      isActive ? "bg-emerald-600 text-white font-semibold" : "hover:bg-white/10 text-white/80"
    }`;

  const mob = ({ isActive }) =>
    `flex flex-col items-center gap-0.5 px-1 py-1.5 text-[10px] font-bold min-w-0 ${
      isActive ? "text-emerald-700" : "text-slate-500"
    }`;

  const out = () => { logout(); nav("/login"); };

  return (
    <div className="bg-[#f8f9ff] min-h-screen flex flex-col lg:flex-row">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-[272px] bg-[#0f281e] text-white flex-col fixed h-screen z-30 flex-shrink-0">
        <div className="p-5 flex items-center gap-3 border-b border-white/10">
          <Logo dark />
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-none">
          <NavLink to="/farmer" end className={item}><span className="material-symbols-outlined text-[20px]">roofing</span> Home</NavLink>
          <NavLink to="/farmer/herd" className={item}><span className="material-symbols-outlined">pets</span> {t("navHerd")}</NavLink>
          <NavLink to="/farmer/predict" className={item}><span className="material-symbols-outlined">biotech</span> {t("aiShort")}</NavLink>
          <NavLink to="/farmer/alerts" className={item}><span className="material-symbols-outlined">ecg_heart</span> {t("navAlerts")}</NavLink>
          <NavLink to="/farmer/sop" className={item}><span className="material-symbols-outlined">assignment_turned_in</span> SOP</NavLink>
          <NavLink to="/farmer/vet" className={item}><span className="material-symbols-outlined">support_agent</span> {t("navVet")}</NavLink>
          <div className="pt-4 mt-4 border-t border-white/10">
            <div className="px-3 text-[11px] font-bold tracking-widest text-white/40 uppercase">My farm</div>
            <div className="mt-2 space-y-1.5 px-3 text-xs">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-400"></span> {t("healthy")}</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-400"></span> {t("watchlist")}</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500"></span> {t("highRisk")}</div>
            </div>
          </div>
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="bg-white/10 rounded-xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0"><span className="material-symbols-outlined">agriculture</span></div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold leading-none truncate">{user?.name || "Farmer"}</div>
              <div className="text-xs text-emerald-300 truncate">{user?.sub || "Dairy farmer"}</div>
            </div>
            <button onClick={out} title="Sign out" className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center flex-shrink-0"><span className="material-symbols-outlined text-[18px]">logout</span></button>
          </div>
        </div>
      </aside>

      {/* Page content */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-[272px] pb-20 lg:pb-0">
        <Outlet />
      </div>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 w-full z-50 bg-white/95 backdrop-blur border-t">
        <div className="grid grid-cols-5 h-16 max-w-md mx-auto">
          <NavLink to="/farmer" end className={mob}><span className="material-symbols-outlined text-[22px]">roofing</span>Home</NavLink>
          <NavLink to="/farmer/herd" className={mob}><span className="material-symbols-outlined text-[22px]">pets</span><span className="truncate max-w-full">{t("navHerd")}</span></NavLink>
          <NavLink to="/farmer/alerts" className={mob}><span className="material-symbols-outlined text-[22px]">ecg_heart</span><span className="truncate max-w-full">{t("navAlerts")}</span></NavLink>
          <NavLink to="/farmer/sop" className={mob}><span className="material-symbols-outlined text-[22px]">assignment_turned_in</span>SOP</NavLink>
          <NavLink to="/farmer/vet" className={mob}><span className="material-symbols-outlined text-[22px]">support_agent</span>Vet</NavLink>
        </div>
      </nav>
    </div>
  );
}
