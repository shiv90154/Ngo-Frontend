"use client";

import { createContext, useState, useContext, useEffect } from "react";
import api from "@/lib/api"; 

// ======================
// Role definitions
// ======================
const ADMIN_ROLES = [
  "SUPER_ADMIN",
  "ADDITIONAL_DIRECTOR",
  "STATE_OFFICER",
  "DISTRICT_MANAGER",
  "DISTRICT_PRESIDENT",
  "FIELD_OFFICER",
  "BLOCK_OFFICER",
  "VILLAGE_OFFICER",
];

const SUPER_ADMIN_ROLES = ["SUPER_ADMIN"];

// ======================
// Context & hook
// ======================
const AuthContext = createContext<any>(null);
export const useAuth = () => useContext(AuthContext);

// ======================
// Helper to read stored user
// ======================
const getInitialUser = () => {
  if (typeof window === "undefined") return null;
  if (!localStorage.getItem("token")) return null;
  const stored = localStorage.getItem("user");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
  return null;
};

// ======================
// Provider
// ======================
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(getInitialUser);
  const [loading, setLoading] = useState(true);

  // Derived values
  const isAdmin = user ? ADMIN_ROLES.includes(user.role) : false;
  const isSuperAdmin = user ? SUPER_ADMIN_ROLES.includes(user.role) : false;

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        localStorage.removeItem("user");
        setLoading(false);
        return;
      }

      // The interceptor in lib/api.ts already handles setting Authorization header
      // but we need to set it for the initial call in case the interceptor hasn't run yet.
      // (Actually, the interceptor runs on every request, so it's fine.)
      try {
        const res = await api.get("/users/profile");
        if (res.data.user) {
          setUser(res.data.user);
          localStorage.setItem("user", JSON.stringify(res.data.user));
        }
      } catch (err: any) {
        console.warn("Profile refresh failed:", err.message);
        if (err.response?.status === 401) {
          localStorage.clear();
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post("/users/login", { email, password });
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      // No need to manually set Authorization header because the interceptor will do it
      setUser(user);
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error?.response?.data?.message || "Login failed",
      };
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  const value = {
    user,
    setUser,
    loading,
    login,
    logout,
    isAdmin,
    isSuperAdmin,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}