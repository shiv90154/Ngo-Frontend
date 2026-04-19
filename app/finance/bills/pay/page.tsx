"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { financeAPI } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";

const billTypes = ["electricity", "water", "gas", "internet", "mobile", "other"];

export default function PayBillPage() {
  const router = useRouter();
  const [form, setForm] = useState({ billType: "electricity", billNumber: "", amount: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await financeAPI.payBill(form.billType, form.billNumber, parseFloat(form.amount));
      toast.success("Bill paid successfully!");
      router.push("/finance/bills");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Pay Bill</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bill Type</label>
            <select
              value={form.billType}
              onChange={(e) => setForm({ ...form, billType: e.target.value })}
              className="w-full p-3 border border-gray-200 rounded-xl"
            >
              {billTypes.map((t) => (
                <option key={t} value={t}>{t.toUpperCase()}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bill Number</label>
            <input
              type="text"
              value={form.billNumber}
              onChange={(e) => setForm({ ...form, billNumber: e.target.value })}
              className="w-full p-3 border border-gray-200 rounded-xl"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
            <input
              type="number"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="w-full p-3 border border-gray-200 rounded-xl"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1a237e] text-white py-3 rounded-xl font-medium hover:bg-[#0d1757] disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5 mx-auto" /> : "Pay Now"}
          </button>
        </form>
      </div>
    </div>
  );
}