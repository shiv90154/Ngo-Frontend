// app/verify-otp/page.tsx
"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { authAPI } from "@/lib/api";
import { Loader2, ArrowLeft, ShieldCheck } from "lucide-react";

// 主组件（包含 Suspense 边界）
export default function VerifyOTPPage() {
  return (
    <Suspense fallback={<VerifyOTPLoading />}>
      <VerifyOTPContent />
    </Suspense>
  );
}

// 加载占位
function VerifyOTPLoading() {
  return (
    <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center">
      <Loader2 className="animate-spin h-8 w-8 text-[#1a237e]" />
    </div>
  );
}

// 实际内容组件
function VerifyOTPContent() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const inputRef = useRef<HTMLInputElement>(null);
  const { setUser } = useAuth();

  // 自动聚焦 & 邮箱缺失保护
  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
    if (!email) router.replace("/login");
  }, [email, router]);

  // 倒计时
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
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
      const res = await authAPI.verifyOTP(email!, otp);
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      router.push("/services");
    } catch (err: any) {
      const message = err.response?.data?.message || "Verification failed. Please try again.";
      setError(message);
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
      await authAPI.resendOTP(email!);
      setResendMessage("New OTP sent to your email");
      setCooldown(30);
      setOtp("");
      inputRef.current?.focus();
    } catch (err: any) {
      const message = err.response?.data?.message || "Failed to resend OTP";
      setError(message);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex flex-col">
    

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-[#1a237e] font-serif">Samraddh Bharat</h1>
            <p className="text-gray-500 text-sm">डिजिटल इंडिया - एकीकृत सेवा पोर्टल</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <div className="flex flex-col items-center mb-6">
              <div className="w-14 h-14 bg-[#1a237e] rounded-full flex items-center justify-center mb-3">
                <ShieldCheck className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Verify OTP</h2>
              <p className="text-gray-500 text-sm text-center mt-1">
                Code sent to <span className="text-[#1a237e] font-medium">{email}</span>
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-600 text-red-700 p-3 rounded mb-4 text-sm">
                {error}
              </div>
            )}

            {resendMessage && (
              <div className="bg-green-50 border-l-4 border-green-600 text-green-700 p-3 rounded mb-4 text-sm">
                {resendMessage}
              </div>
            )}

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
              onKeyDown={(e) => e.key === "Enter" && handleVerify()}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-center text-2xl tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-[#1a237e] focus:border-transparent transition"
            />

            <button
              onClick={handleVerify}
              disabled={loading || otp.length !== 6}
              className="w-full mt-6 bg-[#1a237e] hover:bg-[#0d1757] text-white font-medium py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4" />
                  Verifying...
                </>
              ) : (
                "Verify OTP"
              )}
            </button>

            <div className="mt-4 text-center text-gray-500 text-sm">
              Didn't receive code?{" "}
              <button
                onClick={handleResend}
                disabled={resendLoading || cooldown > 0}
                className="text-[#1a237e] hover:underline font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resendLoading ? "Sending..." : cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
              </button>
            </div>

            <div className="mt-4 text-center">
              <button
                onClick={() => router.push("/login")}
                className="text-gray-400 hover:text-gray-600 text-sm inline-flex items-center gap-1"
              >
                <ArrowLeft size={14} /> Back to Login
              </button>
            </div>
          </div>

          <footer className="text-center mt-6 text-xs text-gray-400">
            <p>© Samraddh Bharat Foundation | Government of India Initiative</p>
          </footer>
        </div>
      </div>
    </div>
  );
}