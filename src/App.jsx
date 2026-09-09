import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider } from "./context/AuthContext";
import { HerdProvider } from "./context/HerdContext";
import { RequireAuth, DashboardRedirect } from "./components/RequireAuth";
import FarmerLayout from "./components/FarmerLayout";
import DoctorLayout from "./components/DoctorLayout";
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

// TWO SEPARATE PORTALS — strict role split, persistent nav shells:
//
//   Farmer  → ONLY /farmer/*  (FarmerLayout: fixed bottom nav on every page)
//   Doctor  → ONLY /doctor/*  (DoctorLayout: fixed sidebar on desktop + bottom nav on mobile)
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
              <Route path="/farmer" element={<RequireAuth roles={["farmer"]}><FarmerLayout /></RequireAuth>}>
                <Route index element={<MobileDashboard />} />
                <Route path="herd" element={<MyHerd />} />
                <Route path="cow/:id" element={<CowDetail />} />
                <Route path="predict" element={<Predict />} />
                <Route path="alerts" element={<Alerts />} />
                <Route path="sop" element={<Sop />} />
                <Route path="vet" element={<Vet />} />
              </Route>

              {/* DOCTOR PORTAL */}
              <Route path="/doctor" element={<RequireAuth roles={["doctor"]}><DoctorLayout /></RequireAuth>}>
                <Route index element={<PcDashboard />} />
                <Route path="herd" element={<MyHerd />} />
                <Route path="cow/:id" element={<CowDetail />} />
                <Route path="predict" element={<Predict />} />
                <Route path="coop" element={<CoopBoard />} />
                <Route path="alerts" element={<Alerts />} />
                <Route path="sop" element={<Sop />} />
                {/* No /doctor/vet — doctor IS the vet. Farmers use /farmer/vet. */}
              </Route>

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
