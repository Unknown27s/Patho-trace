import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Guards SIH two-login flow. strop unnecessary.
export function RequireAuth({ children, roles }) {
  const { user } = useAuth();
  const loc = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: loc.pathname }} replace />;
  if (roles && !roles.includes(user.role)) {
    return <Navigate to={user.role === "doctor" ? "/doctor" : "/farmer"} replace />;
  }
  return children;
}

export function DashboardRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === "doctor" ? "/doctor" : "/farmer"} replace />;
}
