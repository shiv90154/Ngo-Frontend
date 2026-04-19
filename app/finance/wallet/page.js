"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/config/api";
import { Wallet, ArrowUpCircle, ArrowDownCircle, Loader2, Plus, Send, CreditCard, Users, ChevronRight } from "lucide-react";

export default function WalletPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const action = searchParams.get("action");
  const [walletData, setWalletData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [form, setForm] = useState({ amount: "", description: "", toUserId: "" });
  const [users, setUsers] = useState([]);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
    else if (user) { fetchWallet(); fetchUsers(); }
  }, [user, authLoading]);

  useEffect(() => {
    if (action === "add") openModal("add");
    if (action === "transfer") openModal("transfer");
  }, [action]);

  const fetchWallet = async () => {
    try {
      const res = await api.get("/finance/wallet");
      setWalletData(res.data.data);
      setTransactions(res.data.data.transactions);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchUsers = async () => {
    try { const res = await api.get("/users"); setUsers(res.data.users || []); } catch (err) { console.error(err); }
  };

  const openModal = (type) => {
    setModalType(type);
    setForm({ amount: "", description: "", toUserId: "" });
    setModalOpen(true);
  };

  const handleAddFunds = async () => {
    setProcessing(true);
    try {
      const res = await api.post("/finance/wallet/add-order", { amount: parseFloat(form.amount) });
      const order = res.data.data;
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Samraddh Bharat Finance",
        description: form.description || "Wallet Top-up",
        order_id: order.orderId,
        handler: async function (response) {
          alert("Payment successful! Wallet will be credited shortly.");
          await fetchWallet();
          setModalOpen(false);
        },
        prefill: { email: user?.email, name: user?.fullName },
        theme: { color: "#6366f1" }, // Indigo to match Razorpay style
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create order");
    } finally {
      setProcessing(false);
    }
  };

  const handleTransfer = async () => {
    setProcessing(true);
    try {
      await api.post("/finance/wallet/transfer", { toUserId: form.toUserId, amount: parseFloat(form.amount), description: form.description });
      alert("Transfer successful");
      setModalOpen(false);
      fetchWallet();
    } catch (err) { alert(err.response?.data?.message); }
    finally { setProcessing(false); }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">My Wallet</h1>
            <p className="text-gray-500 text-sm mt-1">Manage your funds and transactions</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => openModal("add")}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium shadow-sm transition"
            >
              <Plus size={16} /> Add Funds
            </button>
            <button
              onClick={() => openModal("transfer")}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-xl text-sm font-medium shadow-sm transition"
            >
              <Send size={16} /> Transfer
            </button>
          </div>
        </div>

        {/* Balance Card (Razorpay style) */}
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl shadow-lg p-6 text-white mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20" />
          <div className="relative z-10">
            <p className="text-indigo-200 text-sm flex items-center gap-2">
              <Wallet size={16} /> Available Balance
            </p>
            <p className="text-4xl font-bold mt-1">{formatCurrency(walletData?.balance || 0)}</p>
            <p className="text-indigo-200 text-sm mt-3">Total Earnings: {formatCurrency(walletData?.totalEarnings || 0)}</p>
          </div>
        </div>

        {/* Transactions Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
              <ArrowUpCircle size={18} className="text-indigo-500" />
              Transaction History
            </h2>
            <span className="text-xs text-gray-400">Recent 20</span>
          </div>
          <div className="divide-y divide-gray-100">
            {transactions.length === 0 ? (
              <div className="p-8 text-center text-gray-400">No transactions yet</div>
            ) : (
              transactions.map((tx) => (
                <div key={tx._id} className="p-4 hover:bg-gray-50 transition flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${tx.type === 'credit' ? 'bg-green-100' : 'bg-red-100'}`}>
                      {tx.type === 'credit' ? (
                        <ArrowUpCircle size={16} className="text-green-600" />
                      ) : (
                        <ArrowDownCircle size={16} className="text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{tx.description}</p>
                      <p className="text-xs text-gray-400">{new Date(tx.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-semibold ${tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal (Razorpay style) */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                {modalType === "add" ? "Add Money to Wallet" : "Send Money"}
              </h2>
              <p className="text-gray-500 text-sm mb-5">
                {modalType === "add" ? "Enter amount to add via Razorpay" : "Transfer to another user"}
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={form.amount}
                    onChange={(e) => setForm({...form, amount: e.target.value})}
                    required
                  />
                </div>
                {modalType === "transfer" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Recipient</label>
                    <select
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={form.toUserId}
                      onChange={(e) => setForm({...form, toUserId: e.target.value})}
                      required
                    >
                      <option value="">Choose a user</option>
                      {users.filter(u => u._id !== user?._id).map(u => (
                        <option key={u._id} value={u._id}>{u.fullName} ({u.email})</option>
                      ))}
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
                  <input
                    type="text"
                    placeholder="Reason for transaction"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={form.description}
                    onChange={(e) => setForm({...form, description: e.target.value})}
                  />
                </div>
                <div className="flex gap-3 justify-end pt-4">
                  <button
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={modalType === "add" ? handleAddFunds : handleTransfer}
                    disabled={processing}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition disabled:opacity-50 flex items-center gap-2"
                  >
                    {processing ? <Loader2 className="animate-spin" size={16} /> : null}
                    {processing ? "Processing..." : (modalType === "add" ? "Proceed to Pay" : "Confirm Transfer")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}