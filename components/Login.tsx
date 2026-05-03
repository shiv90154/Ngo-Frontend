"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, user, loading: authLoading } = useAuth();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => setIsClient(true), []);

  useEffect(() => {
    if (isClient && !authLoading && user) {
      const isAdmin =
        user.role === "SUPER_ADMIN" || user.role === "ADDITIONAL_DIRECTOR";
      router.replace(isAdmin ? "/admin" : "/services");
    }
  }, [isClient, authLoading, user, router]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ email?: string; password?: string }>({});
  const [generalError, setGeneralError] = useState("");

  const validate = () => {
    let err: { email?: string; password?: string } = {};
    if (!email.trim()) err.email = "Email is required";
    if (!password) err.password = "Password is required";
    setError(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError("");
    if (!validate()) return;
    setLoading(true);
    const result = await login(email, password);
    if (!result.success) {
      setGeneralError(result.error);
      setLoading(false);
    }
  };

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-6xl">
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-[#1a237e] mt-3 font-serif">
              Samraddh Bharat
            </h1>
            <p className="text-gray-600 mt-1 text-sm md:text-base">
              डिजिटल इंडिया - एकीकृत सेवा पोर्टल
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
            <div className="grid md:grid-cols-2">
              {/* Left info panel unchanged */}
              <div className="bg-gradient-to-br from-[#1a237e] to-[#283593] text-white p-8 hidden md:flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Samraddh Bharat</h2>
                  <p className="text-blue-100 text-sm leading-relaxed">
                    Access multiple schemes and services through a single,
                    secure platform.
                  </p>
                </div>
                <div className="space-y-4 mt-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">✓</div>
                    <div>
                      <p className="font-medium">Secure & Verified</p>
                      <p className="text-xs text-blue-200">Aadhaar-based authentication</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">✓</div>
                    <div>
                      <p className="font-medium">All Services Unified</p>
                      <p className="text-xs text-blue-200">Education, Health, Agri, Finance & more</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">✓</div>
                    <div>
                      <p className="font-medium">Real-time Tracking</p>
                      <p className="text-xs text-blue-200">Monitor applications and benefits</p>
                    </div>
                  </div>
                </div>
                <div className="border-t border-white/20 pt-4 mt-6">
                  <p className="text-xs italic text-blue-200">
                    "सबका साथ, सबका विकास, सबका विश्वास"
                  </p>
                  <p className="text-xs text-blue-300 mt-2">© Samraddh Bharat Foundation</p>
                </div>
              </div>

              {/* Right login form */}
              <div className="p-8">
                <div className="max-w-sm mx-auto">
                  <h3 className="text-2xl font-bold text-gray-800 mb-1">Sign In</h3>
                  <p className="text-gray-500 text-sm mb-6">
                    Use your registered email to access the portal
                  </p>

                  {generalError && (
                    <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-600 text-red-700 text-sm rounded">
                      <p className="font-medium">Authentication Failed</p>
                      <p className="text-xs">{generalError}</p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address <span className="text-red-600">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          placeholder="Enter your registered email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (error.email) setError({ ...error, email: "" });
                          }}
                          className={`w-full px-4 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-[#1a237e] focus:border-[#1a237e] outline-none transition ${
                            error.email ? "border-red-400 bg-red-50" : "border-gray-300"
                          }`}
                        />
                        <FaEnvelope className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      </div>
                      {error.email && <p className="text-xs text-red-600 mt-1">{error.email}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password <span className="text-red-600">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            if (error.password) setError({ ...error, password: "" });
                          }}
                          className={`w-full px-4 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-[#1a237e] focus:border-[#1a237e] outline-none transition ${
                            error.password ? "border-red-400 bg-red-50" : "border-gray-300"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                        </button>
                      </div>
                      {error.password && <p className="text-xs text-red-600 mt-1">{error.password}</p>}
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="rounded border-gray-300 text-[#1a237e] focus:ring-[#1a237e]" />
                        <span className="text-gray-600">Remember me</span>
                      </label>
                      <Link href="/forgot-password" className="text-[#1a237e] hover:underline font-medium">
                        Forgot Password?
                      </Link>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-[#1a237e] hover:bg-[#0d1757] text-white font-medium py-2.5 rounded-lg transition shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed text-sm"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Authenticating...</span>
                        </div>
                      ) : (
                        "Sign In to Portal"
                      )}
                    </button>
                  </form>

                  <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                      Don't have an account?{" "}
                      <Link href="/register" className="text-[#1a237e] font-medium hover:underline">
                        Register Now
                      </Link>
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex justify-center gap-4 text-xs text-gray-500">
                      <Link href="/help" className="hover:text-[#1a237e]">Help</Link>
                      <span>|</span>
                      <Link href="/privacy" className="hover:text-[#1a237e]">Privacy Policy</Link>
                      <span>|</span>
                      <Link href="/terms" className="hover:text-[#1a237e]">Terms</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}