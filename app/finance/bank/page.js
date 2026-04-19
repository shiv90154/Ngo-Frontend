"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/config/api";
import { Landmark, Loader2, Save, ShieldCheck, AlertCircle, Banknote, Building } from "lucide-react";

export default function BankAccountPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [bankAccount, setBankAccount] = useState({
    accountNumber: "",
    ifsc: "",
    bankName: "",
    accountHolderName: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
    else if (user) fetchBankAccount();
  }, [user, authLoading]);

  const fetchBankAccount = async () => {
    setError("");
    try {
      const res = await api.get("/finance/bank-account");
      setBankAccount(res.data.data || {});
    } catch (err) {
      console.error(err);
      if (err.code === "ECONNABORTED" || err.message === "Network Error") {
        setError("Cannot reach backend. Please ensure the server is running.");
      } else {
        setError(err.response?.data?.message || "Failed to load bank details");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await api.put("/finance/bank-account", bankAccount);
      alert("Bank account details saved successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleVerify = async () => {
    setVerifying(true);
    setError("");
    try {
      await api.post("/finance/bank-account/verify", bankAccount);
      alert("Bank account verified successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
    } finally {
      setVerifying(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Tricolor header (government identity) */}
      <div className="flex">
        <div className="h-1 w-1/3 bg-[#FF9933]"></div>
        <div className="h-1 w-1/3 bg-white"></div>
        <div className="h-1 w-1/3 bg-[#138808]"></div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
              <Landmark size={20} className="text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Bank Account Details</h1>
              <p className="text-sm text-gray-500 mt-0.5">Add or update your bank account information</p>
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-5 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-xl flex items-center gap-2">
            <AlertCircle size={18} />
            <span className="flex-1">{error}</span>
            {error.includes("Cannot reach backend") && (
              <button onClick={fetchBankAccount} className="text-sm text-red-700 underline">
                Retry
              </button>
            )}
          </div>
        )}

        {/* Bank Account Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Account Holder Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Holder Name
                </label>
                <input
                  type="text"
                  placeholder="Full name as on bank account"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  value={bankAccount.accountHolderName}
                  onChange={(e) => setBankAccount({ ...bankAccount, accountHolderName: e.target.value })}
                  required
                />
              </div>

              {/* Account Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Number
                </label>
                <input
                  type="text"
                  placeholder="Enter account number"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  value={bankAccount.accountNumber}
                  onChange={(e) => setBankAccount({ ...bankAccount, accountNumber: e.target.value })}
                  required
                />
              </div>

              {/* IFSC Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  IFSC Code
                </label>
                <input
                  type="text"
                  placeholder="e.g., SBIN0001234"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition uppercase"
                  value={bankAccount.ifsc}
                  onChange={(e) => setBankAccount({ ...bankAccount, ifsc: e.target.value.toUpperCase() })}
                  required
                />
              </div>

              {/* Bank Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bank Name
                </label>
                <input
                  type="text"
                  placeholder="Name of the bank"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  value={bankAccount.bankName}
                  onChange={(e) => setBankAccount({ ...bankAccount, bankName: e.target.value })}
                  required
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium shadow-sm transition disabled:opacity-50"
                >
                  {saving ? <Loader2 className="animate-spin h-4 w-4" /> : <Save size={16} />}
                  {saving ? "Saving..." : "Save Details"}
                </button>
                <button
                  type="button"
                  onClick={handleVerify}
                  disabled={verifying}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-800 hover:bg-gray-900 text-white rounded-xl text-sm font-medium shadow-sm transition disabled:opacity-50"
                >
                  {verifying ? <Loader2 className="animate-spin h-4 w-4" /> : <ShieldCheck size={16} />}
                  {verifying ? "Verifying..." : "Verify Account"}
                </button>
              </div>
            </form>

            {/* Note */}
            <div className="mt-5 p-3 bg-gray-50 rounded-xl text-xs text-gray-500">
              <p>✓ We'll verify your bank account details to enable faster payouts.</p>
              <p>✓ Verified accounts are eligible for instant withdrawals.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}