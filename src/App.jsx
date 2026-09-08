import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider } from "./context/AuthContext";
import { RequireAuth, DashboardRedirect } from "./components/RequireAuth";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import PcDashboard from "./pages/PcDashboard";
import MobileDashboard from "./pages/MobileDashboard";
import MyHerd from "./pages/MyHerd";
import Alerts from "./pages/Alerts";
import Sop from "./pages/Sop";
import Vet from "./pages/Vet";

export default function App(){
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing/>} />
            <Route path="/login" element={<Login/>} />
            {/* Role views: farmer = simplified shed view, doctor = full command center.
                Both are responsive — same browser auto-adapts, same logo everywhere. */}
            <Route path="/farmer" element={<RequireAuth roles={["farmer","doctor"]}><MobileDashboard/></RequireAuth>} />
            <Route path="/doctor" element={<RequireAuth roles={["doctor","farmer"]}><PcDashboard/></RequireAuth>} />
            <Route path="/dashboard" element={<DashboardRedirect/>} />
            {/* Legacy aliases (old /pc and /mobile links keep working) */}
            <Route path="/pc" element={<RequireAuth roles={["doctor","farmer"]}><PcDashboard/></RequireAuth>} />
            <Route path="/mobile" element={<RequireAuth roles={["farmer","doctor"]}><MobileDashboard/></RequireAuth>} />
            <Route path="/herd" element={<RequireAuth roles={["farmer","doctor"]}><MyHerd/></RequireAuth>} />
            <Route path="/alerts" element={<RequireAuth roles={["farmer","doctor"]}><Alerts/></RequireAuth>} />
            <Route path="/sop" element={<RequireAuth roles={["farmer","doctor"]}><Sop/></RequireAuth>} />
            <Route path="/vet" element={<RequireAuth roles={["farmer","doctor"]}><Vet/></RequireAuth>} />
            <Route path="*" element={<Navigate to="/" replace/>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  )
}
