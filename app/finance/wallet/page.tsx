"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { financeAPI } from "@/lib/api";
import { Wallet, Plus, Send, Loader2, IndianRupee } from "lucide-react";
import { toast } from "react-toastify";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function WalletPage() {
  const { user } = useAuth();
  const [walletData, setWalletData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [addAmount, setAddAmount] = useState("");
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferData, setTransferData] = useState({ toUserId: "", amount: "", description: "" });

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      const res = await financeAPI.getWallet();
      setWalletData(res.data.data);
    } catch (error) {
      console.error("Failed to fetch wallet:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleAddMoney = async () => {
    const amount = parseFloat(addAmount);
    if (isNaN(amount) || amount < 10) {
      toast.error("Minimum amount ₹10");
      return;
    }

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      toast.error("Razorpay SDK failed to load");
      return;
    }

    try {
      const orderRes = await financeAPI.createWalletOrder(amount);
      const { orderId, amount: orderAmount, currency } = orderRes.data.data;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderAmount,
        currency: currency,
        name: "Samraddh Bharat",
        description: "Wallet Top-up",
        order_id: orderId,
        handler: async (response: any) => {
          try {
            await financeAPI.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            toast.success("Payment successful! Wallet credited.");
            fetchWallet();
            setAddAmount("");
          } catch (err) {
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: user?.fullName,
          email: user?.email,
          contact: user?.phone,
        },
        theme: { color: "#1a237e" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error("Failed to create order");
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(transferData.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Invalid amount");
      return;
    }
    try {
      await financeAPI.transferFunds(transferData.toUserId, amount, transferData.description);
      toast.success("Transfer successful");
      setShowTransferModal(false);
      setTransferData({ toUserId: "", amount: "", description: "" });
      fetchWallet();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Transfer failed");
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">My Wallet</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setShowTransferModal(true)}
              className="flex items-center gap-2 px-4 py-2 border border-[#1a237e] text-[#1a237e] rounded-lg hover:bg-[#1a237e]/5"
            >
              <Send size={16} /> Transfer
            </button>
          </div>
        </div>

        <div className="mt-6 bg-gradient-to-r from-[#1a237e] to-[#283593] rounded-xl p-6 text-white">
          <p className="text-sm opacity-80">Available Balance</p>
          <p className="text-4xl font-bold mt-1">₹{walletData?.balance || 0}</p>
          <p className="text-sm mt-2 opacity-80">Total Earnings: ₹{walletData?.totalEarnings || 0}</p>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Add Money</label>
          <div className="flex gap-3">
            <input
              type="number"
              value={addAmount}
              onChange={(e) => setAddAmount(e.target.value)}
              placeholder="Enter amount"
              className="flex-1 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a237e]"
            />
            <button
              onClick={handleAddMoney}
              className="flex items-center gap-2 bg-[#1a237e] text-white px-6 py-3 rounded-xl hover:bg-[#0d1757]"
            >
              <Plus size={18} /> Add
            </button>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Transaction History</h2>
        {walletData?.transactions?.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No transactions yet</p>
        ) : (
          <div className="divide-y">
            {walletData?.transactions?.map((txn: any) => (
              <div key={txn._id} className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-medium">{txn.description}</p>
                  <p className="text-xs text-gray-500">{new Date(txn.createdAt).toLocaleString()}</p>
                </div>
                <p className={`font-semibold ${txn.type === "credit" ? "text-green-600" : "text-red-600"}`}>
                  {txn.type === "credit" ? "+" : "-"}₹{txn.amount}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Transfer Funds</h2>
            <form onSubmit={handleTransfer} className="space-y-4">
              <input
                type="text"
                placeholder="Recipient User ID"
                value={transferData.toUserId}
                onChange={(e) => setTransferData({ ...transferData, toUserId: e.target.value })}
                className="w-full p-3 border rounded-lg"
                required
              />
              <input
                type="number"
                placeholder="Amount"
                value={transferData.amount}
                onChange={(e) => setTransferData({ ...transferData, amount: e.target.value })}
                className="w-full p-3 border rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="Description (optional)"
                value={transferData.description}
                onChange={(e) => setTransferData({ ...transferData, description: e.target.value })}
                className="w-full p-3 border rounded-lg"
              />
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => setShowTransferModal(false)} className="px-4 py-2 border rounded-lg">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-[#1a237e] text-white rounded-lg">
                  Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}