"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { financeAPI } from "@/lib/api";
import { CreditCard, Loader2, Plus } from "lucide-react";

export default function LoansPage() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const res = await financeAPI.getMyLoans();
      setLoans(res.data.data);
    } catch (error) {
      console.error("Failed to fetch loans:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin h-8 w-8 text-[#1a237e]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">My Loans</h1>
        <Link
          href="/finance/loans/apply"
          className="flex items-center gap-2 bg-[#1a237e] text-white px-4 py-2 rounded-lg hover:bg-[#0d1757]"
        >
          <Plus size={16} /> Apply for Loan
        </Link>
      </div>

      {loans.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center">
          <CreditCard className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No loans yet.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {loans.map((loan: any) => (
            <Link key={loan._id} href={`/finance/loans/${loan._id}`}>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-lg font-semibold">₹{loan.amount}</p>
                    <p className="text-sm text-gray-500">EMI: ₹{loan.emiAmount}/month</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    loan.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                  }`}>
                    {loan.status}
                  </span>
                </div>
                <div className="mt-3 text-sm text-gray-600">
                  Outstanding: ₹{loan.outstanding} • {loan.emisPaid}/{loan.tenureMonths} paid
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}