"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaEnvelope, FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginComponent() {
  const { login, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !authLoading && user) {
      router.replace("/services");
    }
  }, [isClient, authLoading, user, router]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [generalError, setGeneralError] = useState("");

  const validate = () => {
    let err = {};
    if (!email) err.email = "Email is required";
    if (!password) err.password = "Password is required";
    setError(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError("");
    if (!validate()) return;
    setLoading(true);
    const result = await login(email, password);
    if (result.success) {
      router.replace("/services");
    } else {
      setGeneralError(result.error);
      setLoading(false);
    }
  };

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center ">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Panel */}
        <div className="md:w-1/2 bg-gradient-to-br from-blue-900 to-blue-800 text-white">
          <div className="md:hidden p-4 flex items-center justify-between border-b border-blue-700">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <div className="w-6 h-6 rounded-full border-2 border-blue-900 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-blue-900"></div>
                </div>
              </div>
              <div>
                <p className="text-xs opacity-80">Government of India</p>
                <p className="font-bold text-lg">Samraddh Bharat</p>
              </div>
            </div>
            <div>
              <p className="text-xs opacity-80">Government of India</p>
              <p className="font-bold text-base">Samraddh Bharat</p>
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-3">Welcome Back</h2>
          <p className="text-blue-100 text-sm mb-4 leading-relaxed">
            Access your digital services – Education, Healthcare, Agriculture, Finance, and more.
          </p>
          <div className="border-l-4 border-orange-400 pl-3 mt-6">
            <p className="text-xs italic text-blue-200">"Sabka Saath, Sabka Vikas, Sabka Vishwas"</p>
          </div>
        </div>
        <div className="mt-6 text-xs text-blue-300">
          <p>Secure & encrypted login</p>
          <p>© Samraddh Bharat Foundation</p>
        </div>
      </div>
      <div className="mt-8 text-xs text-blue-300">
        <p>Secure & encrypted login</p>
        <p>© Samraddh Bharat Foundation</p>
      </div>
    </div>

        {/* Right Panel */ }
  <div className="w-full md:w-1/2 p-6 sm:p-7 md:p-8 bg-white">
    <div className="max-w-sm mx-auto">
      <div className="flex mb-6">
        <div className="h-1 w-1/3 bg-[#FF9933] rounded-l"></div>
        <div className="h-1 w-1/3 bg-white"></div>
        <div className="h-1 w-1/3 bg-[#138808] rounded-r"></div>
      </div>
      <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Sign In</h3>
      <p className="text-gray-500 text-xs md:text-sm mb-5">Enter your credentials to access your dashboard</p>
      {generalError && <div className="mb-3 p-2 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs rounded">{generalError}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Email Address <span className="text-red-500">*</span></label>
          <div className="relative">
            <input type="email" placeholder="you@example.com" value={email} onChange={(e) => { setEmail(e.target.value); if (error.email) setError({ ...error, email: "" }); }} className={`w-full px-3 py-2.5 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${error.email ? "border-red-400" : "border-gray-300"}`} />
            <FaEnvelope className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          </div>
          {error.email && <p className="text-xs text-red-500 mt-1">{error.email}</p>}
        </div>
        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Password <span className="text-red-500">*</span></label>
          <div className="relative">
            <input type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => { setPassword(e.target.value); if (error.password) setError({ ...error, password: "" }); }} className={`w-full px-3 py-2.5 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${error.password ? "border-red-400" : "border-gray-300"}`} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">{showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}</button>
          </div>
          {error.password && <p className="text-xs text-red-500 mt-1">{error.password}</p>}
        </div>
        <button type="submit" disabled={loading} className="w-full bg-blue-700 hover:bg-blue-800 text-white font-medium py-2.5 rounded-lg transition shadow-md hover:shadow-lg disabled:opacity-50 text-sm">
          {loading ? <div className="flex items-center justify-center gap-2"><div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>Signing in...</span></div> : "Login to Dashboard"}
        </button>
      </form>
      <div className="mt-5 text-center space-y-1.5">
        <Link href="/register" className="text-blue-700 hover:text-blue-800 text-xs md:text-sm font-medium inline-block">New user? Create an account</Link>
        <div className="flex justify-between items-center text-xs">
          <Link href="/forgot-password" className="text-gray-500 hover:text-blue-600">Forgot Password?</Link>
          <Link href="/" className="text-gray-500 hover:text-blue-600 flex items-center gap-1"><FaArrowLeft className="text-[8px]" /> Back to Home</Link>
        </div>
      </div>
      <div className="mt-6 pt-3 border-t border-gray-200 text-center text-[11px] text-gray-400">
        <p>Secure government system | Unauthorized access prohibited</p>
        <p className="mt-0.5">Samraddh Bharat Foundation</p>
      </div>
    </div>
  </div>
      </div >
    </div >
  );
}