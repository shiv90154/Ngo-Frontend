"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { financeAPI } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";

export default function ApplyLoanPage() {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [tenure, setTenure] = useState("12");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await financeAPI.applyLoan(parseFloat(amount), parseInt(tenure));
      toast.success("Loan application submitted successfully!");
      router.push("/finance/loans");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Application failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Apply for Loan</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Loan Amount (₹)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1000"
              className="w-full p-3 border border-gray-200 rounded-xl"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tenure (Months)</label>
            <select
              value={tenure}
              onChange={(e) => setTenure(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl"
            >
              <option value="3">3 months</option>
              <option value="6">6 months</option>
              <option value="12">12 months</option>
              <option value="24">24 months</option>
            </select>
          </div>
          <p className="text-sm text-gray-500">Interest Rate: 12% p.a.</p>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1a237e] text-white py-3 rounded-xl font-medium hover:bg-[#0d1757] disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5 mx-auto" /> : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
}