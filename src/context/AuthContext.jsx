import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

// Two logins for SIH: Farmer view + Doctor/Vet view.
// Demo credentials (field-ready, no backend needed for prototype):
//   Farmer → phone: farmer / pass: 1234
//   Doctor → phone: doctor / pass: 1234
const DEMO_USERS = {
  farmer: { password: "1234", role: "farmer", name: "Rajesh Patel", sub: "Patel Dairy Co-op • Unit 4" },
  doctor: { password: "1234", role: "doctor", name: "Dr. S. Radhakrishnan", sub: "BVSc • Anand Milk Union" },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("ksheera_user");
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  });

  useEffect(() => {
    try {
      if (user) localStorage.setItem("ksheera_user", JSON.stringify(user));
      else localStorage.removeItem("ksheera_user");
    } catch { /* ignore */ }
  }, [user]);

  const login = (id, password) => {
    const key = String(id || "").trim().toLowerCase();
    const u = DEMO_USERS[key];
    if (!u || u.password !== String(password)) {
      return { ok: false, msg: "Use farmer/1234 for Farmer view or doctor/1234 for Doctor view." };
    }
    const session = { id: key, role: u.role, name: u.name, sub: u.sub, at: Date.now() };
    setUser(session);
    return { ok: true, role: u.role };
  };

  const loginDemo = (role) => {
    const key = role === "doctor" ? "doctor" : "farmer";
    const u = DEMO_USERS[key];
    const session = { id: key, role: u.role, name: u.name, sub: u.sub, at: Date.now() };
    setUser(session);
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, loginDemo, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
