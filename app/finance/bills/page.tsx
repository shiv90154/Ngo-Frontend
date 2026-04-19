"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { financeAPI } from "@/lib/api";
import { FileText, Loader2, Plus } from "lucide-react";

export default function BillsPage() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const res = await financeAPI.getBillHistory();
      setBills(res.data.data);
    } catch (error) {
      console.error("Failed to fetch bills:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Bill Payments</h1>
        <Link
          href="/finance/bills/pay"
          className="flex items-center gap-2 bg-[#1a237e] text-white px-4 py-2 rounded-lg hover:bg-[#0d1757]"
        >
          <Plus size={16} /> Pay New Bill
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin h-8 w-8 text-[#1a237e]" />
        </div>
      ) : bills.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center">
          <FileText className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No bill payments yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y">
          {bills.map((bill: any) => (
            <div key={bill._id} className="p-4 flex justify-between items-center">
              <div>
                <p className="font-medium">{bill.billType.toUpperCase()}</p>
                <p className="text-sm text-gray-500">Bill No: {bill.billNumber}</p>
                <p className="text-xs text-gray-400">{new Date(bill.paidAt).toLocaleDateString()}</p>
              </div>
              <p className="font-semibold text-gray-800">₹{bill.amount}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}