"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function VerifyOTP() {
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [resendLoading, setResendLoading] = useState(false);
    const [resendMessage, setResendMessage] = useState("");
    const [cooldown, setCooldown] = useState(0); // seconds
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email");
    const inputRef = useRef(null);
    const { setUser } = useAuth();

    // Focus input on mount
    useEffect(() => {
        if (inputRef.current) inputRef.current.focus();
        if (!email) router.replace("/login");
    }, [email, router]);

    // Resend cooldown timer
    useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
        return () => clearTimeout(timer);
    }, [cooldown]);

    const handleVerify = async () => {
        if (!otp || otp.length !== 6) {
            setError("Please enter a 6-digit OTP");
            return;
        }
        setLoading(true);
        setError("");
        try {
            const response = await axios.post(`${API_URL}/users/verify-otp`, { email, otp });
            const { token, user } = response.data;
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            setUser(user);
            router.push("/services");
        } catch (err) {
            const message = err.response?.data?.message || "Verification failed. Please try again.";
            setError(message);
            // Clear OTP on failure for security
            setOtp("");
            inputRef.current?.focus();
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (cooldown > 0) return;
        setResendLoading(true);
        setResendMessage("");
        setError("");
        try {
            await axios.post(`${API_URL}/users/resend-otp`, { email });
            setResendMessage("✓ New OTP sent to your email");
            setCooldown(30); // 30 seconds cooldown
            setOtp(""); // Clear old OTP
            inputRef.current?.focus();
        } catch (err) {
            const message = err.response?.data?.message || "Failed to resend OTP";
            setError(message);
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
            <div className="max-w-md mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    {/* Header */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-4 shadow-md">
                            <span className="text-3xl">🔐</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">Verify OTP</h2>
                        <p className="text-gray-500 text-center mt-2">
                            Code sent to <span className="text-blue-600 font-medium">{email}</span>
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-center text-sm">
                            {error}
                        </div>
                    )}

                    {/* Success Message */}
                    {resendMessage && (
                        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-6 text-center text-sm">
                            {resendMessage}
                        </div>
                    )}

                    {/* OTP Input */}
                    <input
                        ref={inputRef}
                        type="text"
                        inputMode="numeric"
                        pattern="\d*"
                        maxLength={6}
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "");
                            if (val.length <= 6) setOtp(val);
                            if (error) setError("");
                        }}
                        onKeyPress={(e) => e.key === "Enter" && handleVerify()}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />

                    {/* Verify Button */}
                    <button
                        onClick={handleVerify}
                        disabled={loading || otp.length !== 6}
                        className="w-full mt-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-xl transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Verifying...
                            </span>
                        ) : "Verify OTP"}
                    </button>

                    {/* Resend OTP */}
                    <div className="mt-4 text-center text-gray-500">
                        Didn't receive code?{" "}
                        <button
                            onClick={handleResend}
                            disabled={resendLoading || cooldown > 0}
                            className="text-blue-500 hover:text-blue-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            {resendLoading ? "Sending..." : cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
                        </button>
                    </div>

                    {/* Back to Login */}
                    <div className="mt-2 text-center">
                        <button
                            onClick={() => router.push("/login")}
                            className="text-gray-400 hover:text-gray-600 text-sm transition flex items-center justify-center gap-1"
                        >
                            ← Back to Login
                        </button>
                    </div>
                </div>

                <footer className="text-center mt-8">
                    <p className="text-gray-400 text-sm">
                        © 2026 Samraddh Bharat Portal. All rights reserved.
                    </p>
                </footer>
            </div>
        </div>
    );
}