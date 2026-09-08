import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider } from "./context/AuthContext";
import { HerdProvider } from "./context/HerdContext";
import { RequireAuth, DashboardRedirect } from "./components/RequireAuth";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import PcDashboard from "./pages/PcDashboard";
import MobileDashboard from "./pages/MobileDashboard";
import MyHerd from "./pages/MyHerd";
import Alerts from "./pages/Alerts";
import Sop from "./pages/Sop";
import Vet from "./pages/Vet";
import Predict from "./pages/Predict";
import CowDetail from "./pages/CowDetail";
import CoopBoard from "./pages/CoopBoard";

// TWO SEPARATE PORTALS — strict role split:
//
//   Farmer  → ONLY /farmer/*   (simple shed view, plain language, tap-cow predict)
//   Doctor  → ONLY /doctor/*   (full command center, 16-feature table, GIS, batch predict)
//
// e.g.  localhost:5173/farmer/herd   vs   localhost:5173/doctor/herd
// A farmer hitting /doctor/* is bounced to /farmer, and vice versa.
// Old flat links (/herd, /pc, /mobile…) redirect to the role home so nothing breaks.
export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <HerdProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />

              {/* FARMER PORTAL */}
              <Route path="/farmer" element={<RequireAuth roles={["farmer"]}><MobileDashboard /></RequireAuth>} />
              <Route path="/farmer/herd" element={<RequireAuth roles={["farmer"]}><MyHerd /></RequireAuth>} />
              <Route path="/farmer/cow/:id" element={<RequireAuth roles={["farmer"]}><CowDetail /></RequireAuth>} />
              <Route path="/farmer/predict" element={<RequireAuth roles={["farmer"]}><Predict /></RequireAuth>} />
              <Route path="/farmer/alerts" element={<RequireAuth roles={["farmer"]}><Alerts /></RequireAuth>} />
              <Route path="/farmer/sop" element={<RequireAuth roles={["farmer"]}><Sop /></RequireAuth>} />
              <Route path="/farmer/vet" element={<RequireAuth roles={["farmer"]}><Vet /></RequireAuth>} />

              {/* DOCTOR PORTAL */}
              <Route path="/doctor" element={<RequireAuth roles={["doctor"]}><PcDashboard /></RequireAuth>} />
              <Route path="/doctor/herd" element={<RequireAuth roles={["doctor"]}><MyHerd /></RequireAuth>} />
              <Route path="/doctor/cow/:id" element={<RequireAuth roles={["doctor"]}><CowDetail /></RequireAuth>} />
              <Route path="/doctor/predict" element={<RequireAuth roles={["doctor"]}><Predict /></RequireAuth>} />
              <Route path="/doctor/coop" element={<RequireAuth roles={["doctor"]}><CoopBoard /></RequireAuth>} />
              <Route path="/doctor/alerts" element={<RequireAuth roles={["doctor"]}><Alerts /></RequireAuth>} />
              <Route path="/doctor/sop" element={<RequireAuth roles={["doctor"]}><Sop /></RequireAuth>} />
              <Route path="/doctor/vet" element={<RequireAuth roles={["doctor"]}><Vet /></RequireAuth>} />

              <Route path="/dashboard" element={<DashboardRedirect />} />

              {/* Legacy flat links → role home (keeps old bookmarks working) */}
              <Route path="/pc" element={<DashboardRedirect />} />
              <Route path="/mobile" element={<DashboardRedirect />} />
              <Route path="/herd" element={<DashboardRedirect />} />
              <Route path="/alerts" element={<DashboardRedirect />} />
              <Route path="/sop" element={<DashboardRedirect />} />
              <Route path="/vet" element={<DashboardRedirect />} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </HerdProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
