"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/config/api";
import { FileText, Loader2, PlusCircle, IndianRupee, Calendar, CheckCircle, AlertCircle } from "lucide-react";

export default function LoansPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ amount: "", tenureMonths: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
    else if (user) fetchLoans();
  }, [user, authLoading]);

  const fetchLoans = async () => {
    try {
      const res = await api.get("/finance/loans");
      setLoans(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const applyLoan = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/finance/loans/apply", {
        amount: parseFloat(form.amount),
        tenureMonths: parseInt(form.tenureMonths),
      });
      alert("Loan applied successfully. Amount credited to wallet.");
      setModalOpen(false);
      setForm({ amount: "", tenureMonths: "" });
      fetchLoans();
    } catch (err) {
      alert(err.response?.data?.message);
    } finally {
      setSubmitting(false);
    }
  };

  const repayEMI = async (loanId) => {
    if (!confirm("Repay EMI? Amount will be deducted from your wallet.")) return;
    try {
      await api.post(`/finance/loans/${loanId}/repay`);
      fetchLoans();
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
      </div>
    );
  }

  // Calculate summary stats
  const totalOutstanding = loans.reduce((sum, loan) => sum + (loan.status === "active" ? loan.outstanding : 0), 0);
  const activeLoans = loans.filter((l) => l.status === "active").length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Tricolor header (government identity) */}
      <div className="flex">
        <div className="h-1 w-1/3 bg-[#FF9933]"></div>
        <div className="h-1 w-1/3 bg-white"></div>
        <div className="h-1 w-1/3 bg-[#138808]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">My Loans</h1>
            <p className="text-gray-500 text-sm mt-1">Apply for loans and manage repayments</p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium shadow-sm transition"
          >
            <PlusCircle size={16} /> Apply for Loan
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Active Loans</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{activeLoans}</p>
              </div>
              <div className="bg-indigo-100 p-3 rounded-full">
                <FileText size={20} className="text-indigo-600" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl shadow-lg p-5 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10" />
            <div className="relative z-10">
              <p className="text-indigo-200 text-sm">Total Outstanding</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(totalOutstanding)}</p>
            </div>
          </div>
        </div>

        {/* Loans Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EMI</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tenure</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Outstanding</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Due</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {loans.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-400">
                      No loans taken yet
                    </td>
                  </tr>
                ) : (
                  loans.map((loan) => (
                    <tr key={loan._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">{formatCurrency(loan.amount)}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{formatCurrency(loan.emiAmount)}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{loan.tenureMonths} months</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">{formatCurrency(Math.round(loan.outstanding))}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {loan.status === "active" ? new Date(loan.nextDueDate).toLocaleDateString() : "-"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            loan.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {loan.status === "active" ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                          {loan.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {loan.status === "active" && (
                          <button
                            onClick={() => repayEMI(loan._id)}
                            className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-md text-xs font-medium hover:bg-indigo-100 transition"
                          >
                            Repay EMI
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Apply Loan Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Apply for Loan</h2>
              <p className="text-gray-500 text-sm mb-5">Get instant credit to your wallet</p>
              <form onSubmit={applyLoan} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Loan Amount (₹)</label>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    required
                    min="1000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tenure (months)</label>
                  <input
                    type="number"
                    placeholder="e.g., 12"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={form.tenureMonths}
                    onChange={(e) => setForm({ ...form, tenureMonths: e.target.value })}
                    required
                    min="3"
                    max="60"
                  />
                </div>
                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-xs text-gray-500">Interest Rate: 12% p.a.</p>
                  <p className="text-xs text-gray-500">EMI will be calculated automatically</p>
                </div>
                <div className="flex gap-3 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition disabled:opacity-50 flex items-center gap-2"
                  >
                    {submitting ? <Loader2 className="animate-spin" size={16} /> : null}
                    {submitting ? "Applying..." : "Apply for Loan"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}