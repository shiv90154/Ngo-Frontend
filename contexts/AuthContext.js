"use client";

import { createContext, useState, useContext, useEffect } from "react";
import api from "@/config/api";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

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

      // Set token in API headers
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      try {
        const res = await api.get("/users/profile");
        if (res.data.user) {
          setUser(res.data.user);
          localStorage.setItem("user", JSON.stringify(res.data.user));
        }
      } catch (err) {
        console.warn("Profile refresh failed:", err.message);
        
        // If token is invalid/expired (401), clear localStorage
        if (err.response?.status === 401) {
          console.warn("Token expired or invalid. Logging out.");
          localStorage.clear();
          delete api.defaults.headers.common["Authorization"];
          setUser(null);
        }
        // For other errors (network, 500), keep the stored user
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
      return { 
        success: false, 
        error: error?.response?.data?.message || "Login failed" 
      };
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
      return { 
        success: false, 
        error: error?.response?.data?.message || "Registration failed" 
      };
    }
  };

  const value = {
    user,
    setUser,
    loading,
    register,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}