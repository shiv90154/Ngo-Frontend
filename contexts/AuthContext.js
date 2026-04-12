"use client";

import { createContext, useState, useContext, useEffect } from "react";
import api from "@/config/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // On mount: verify token and load user
    useEffect(() => {
        const verifyUser = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setLoading(false);
                    return;
                }
                // Set default Authorization header for all future requests
                api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
                const res = await api.get("/users/profile");
                setUser(res.data.user);
            } catch (err) {
                console.error("Auth load error:", err);
                localStorage.clear();
                delete api.defaults.headers.common["Authorization"];
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        verifyUser();
    }, []);

    // ======================
    // REGISTER
    // ======================
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
                error: error?.response?.data?.message || "Registration failed",
            };
        }
    };

    // ======================
    // LOGIN
    // ======================
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
                error: error?.response?.data?.message || "Login failed",
            };
        }
    };

    // ======================
    // LOGOUT
    // ======================
    const logout = () => {
        localStorage.clear();
        delete api.defaults.headers.common["Authorization"];
        setUser(null);
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