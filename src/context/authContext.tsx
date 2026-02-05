import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import api from "../utils/axios";

/* ===============================
   Types
================================ */

// 🔹 change fields based on your backend user model
export interface User {
  user_id: number;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "SHOP_ADMIN" | "STAFF";
  shop_id?: number | null;
}

interface AuthContextType {
  user: User | null;
  superAdminlogin: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

/* ===============================
   Context
================================ */

const AuthContext = createContext<AuthContextType | null>(null);

/* ===============================
   Provider
================================ */

interface Props {
  children: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /* ===============================
     Restore login on refresh
  ================================= */

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  /* ===============================
     LOGIN
  ================================= */

  const superAdminlogin = async (
    email: string,
    password: string,
  ): Promise<void> => {
    const res = await api.post("v1/auth/login", { email, password });

    const { token, user } = res.data.data;
    console.log(token, user);

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    setUser(user);
  };

  /* ===============================
     LOGOUT
  ================================= */

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    superAdminlogin,
    logout,
    isAuthenticated: !!user,
  };

  if (loading) return null;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/* ===============================
   Hook
================================ */

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
