"use client";

import { useEffect, useState } from "react";
import { adminAPI } from "@/lib/api";
import { Loader2, Wallet, TrendingUp } from "lucide-react";
import { toast } from "react-toastify";

export default function AdminMLMDashboard() {
  const [commissions, setCommissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [batchLoading, setBatchLoading] = useState(false);

  const fetchData = async () => {
    try {
      const res = await adminAPI.getCommissions({ limit: 100 });
      setCommissions(res.data.commissions);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleBatchPayout = async () => {
    setBatchLoading(true);
    try {
      const res = await adminAPI.batchPayout();
      toast.success(res.data.message);
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Batch payout failed");
    } finally {
      setBatchLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">MLM Commission Report</h1>
        <button
          onClick={handleBatchPayout}
          disabled={batchLoading}
          className="flex items-center gap-2 bg-[#1a237e] hover:bg-[#0d1757] text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
        >
          {batchLoading ? <Loader2 className="animate-spin h-4 w-4" /> : <Wallet className="h-4 w-4" />}
          {batchLoading ? "Processing..." : "Process All Payouts"}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Level</th>
              <th className="px-4 py-3 text-left">Amount</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-8">
                  <Loader2 className="animate-spin mx-auto" />
                </td>
              </tr>
            ) : commissions.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">
                  No commission records found.
                </td>
              </tr>
            ) : (
              commissions.map((c: any) => (
                <tr key={c._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{c.user?.fullName}</td>
                  <td className="px-4 py-3 capitalize">{c.type.replace('_', ' ')}</td>
                  <td className="px-4 py-3">Level {c.level}</td>
                  <td className="px-4 py-3 font-medium">₹{c.amount.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      c.status === 'paid'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}