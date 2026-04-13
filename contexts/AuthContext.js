"use client";

import { createContext, useState, useContext, useEffect } from "react";
import api from "@/config/api";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

// Read initial user from localStorage synchronously (no delay)
const getInitialUser = () => {
  if (typeof window === "undefined") return null;
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

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getInitialUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Optional: refresh user data from backend – but never clear on error
      try {
        const res = await api.get("/users/profile");
        if (res.data.user) {
          setUser(res.data.user);
          localStorage.setItem("user", JSON.stringify(res.data.user));
        }
      } catch (err) {
        console.warn("Profile refresh failed, keeping stored user:", err.message);
        // Keep the existing user from localStorage – do NOT logout
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post("/users/login", { email, password });
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error?.response?.data?.message || "Login failed" };
    }
  };

  const logout = () => {
    localStorage.clear();
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
  };

  const register = async (userData) => {
    try {
      const res = await api.post("/users/register", userData);
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error?.response?.data?.message || "Registration failed" };
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}