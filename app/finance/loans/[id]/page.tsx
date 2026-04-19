"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { financeAPI } from "@/lib/api";
import { Loader2, CreditCard } from "lucide-react";
import { toast } from "react-toastify";

export default function LoanDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [loan, setLoan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [repaying, setRepaying] = useState(false);

  useEffect(() => {
    fetchLoan();
  }, []);

  const fetchLoan = async () => {
    try {
      const res = await financeAPI.getMyLoans();
      const found = res.data.data.find((l: any) => l._id === params.id);
      setLoan(found);
    } catch (error) {
      console.error("Failed to fetch loan:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRepay = async () => {
    setRepaying(true);
    try {
      await financeAPI.repayEMI(params.id as string);
      toast.success("EMI paid successfully!");
      fetchLoan();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Payment failed");
    } finally {
      setRepaying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin h-8 w-8 text-[#1a237e]" />
      </div>
    );
  }

  if (!loan) return <div className="text-center py-12">Loan not found</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Loan Details</h1>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Amount:</span>
            <span className="font-semibold">₹{loan.amount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">EMI Amount:</span>
            <span className="font-semibold">₹{loan.emiAmount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Outstanding:</span>
            <span className="font-semibold">₹{loan.outstanding}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">EMIs Paid:</span>
            <span>{loan.emisPaid} / {loan.tenureMonths}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Next Due Date:</span>
            <span>{new Date(loan.nextDueDate).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Status:</span>
            <span className={`px-2 py-0.5 rounded-full text-xs ${
              loan.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100"
            }`}>{loan.status}</span>
          </div>
        </div>

        {loan.status === "active" && (
          <button
            onClick={handleRepay}
            disabled={repaying}
            className="mt-6 w-full bg-[#1a237e] text-white py-3 rounded-xl font-medium hover:bg-[#0d1757] disabled:opacity-50"
          >
            {repaying ? <Loader2 className="animate-spin h-5 w-5 mx-auto" /> : `Pay EMI (₹${loan.emiAmount})`}
          </button>
        )}
      </div>
    </div>
  );
}