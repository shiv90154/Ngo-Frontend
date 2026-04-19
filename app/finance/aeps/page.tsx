"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { financeAPI } from "@/lib/api";
import { Banknote, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

export default function AepsPage() {
  const router = useRouter();
  const [form, setForm] = useState({ aadhaarNumber: "", amount: "", bankIIN: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await financeAPI.aepsWithdraw(form.aadhaarNumber, parseFloat(form.amount), form.bankIIN);
      toast.success("Withdrawal successful!");
      router.push("/finance/wallet");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Withdrawal failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">AEPS Withdrawal</h1>
        <p className="text-sm text-gray-500 mb-4">Withdraw cash from your wallet using Aadhaar</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar Number</label>
            <input
              type="text"
              maxLength={12}
              value={form.aadhaarNumber}
              onChange={(e) => setForm({ ...form, aadhaarNumber: e.target.value })}
              className="w-full p-3 border border-gray-200 rounded-xl"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
            <input
              type="number"
              min="100"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="w-full p-3 border border-gray-200 rounded-xl"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bank IIN (optional)</label>
            <input
              type="text"
              value={form.bankIIN}
              onChange={(e) => setForm({ ...form, bankIIN: e.target.value })}
              className="w-full p-3 border border-gray-200 rounded-xl"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1a237e] text-white py-3 rounded-xl font-medium hover:bg-[#0d1757] disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5 mx-auto" /> : "Withdraw"}
          </button>
        </form>
      </div>
    </div>
  );
}