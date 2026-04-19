"use client";

import { useEffect, useState } from "react";
import { financeAPI } from "@/lib/api";
import { Building2, Loader2, Save } from "lucide-react";
import { toast } from "react-toastify";

export default function BankPage() {
  const [bankData, setBankData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    accountNumber: "",
    ifsc: "",
    bankName: "",
    accountHolderName: "",
  });

  useEffect(() => {
    fetchBankAccount();
  }, []);

  const fetchBankAccount = async () => {
    try {
      const res = await financeAPI.getBankAccount();
      setBankData(res.data.data);
      if (res.data.data) setForm(res.data.data);
    } catch (error) {
      console.error("Failed to fetch bank account:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await financeAPI.updateBankAccount(form);
      toast.success("Bank account updated");
      fetchBankAccount();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleVerify = async () => {
    if (!form.accountNumber || !form.ifsc) {
      toast.error("Account number and IFSC required");
      return;
    }
    setSaving(true);
    try {
      await financeAPI.verifyBankAccount(form);
      toast.success("Bank account verified!");
      fetchBankAccount();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Verification failed");
    } finally {
      setSaving(false);
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
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Bank Account</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name</label>
            <input
              value={form.accountHolderName}
              onChange={(e) => setForm({ ...form, accountHolderName: e.target.value })}
              className="w-full p-3 border border-gray-200 rounded-xl"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
            <input
              value={form.accountNumber}
              onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
              className="w-full p-3 border border-gray-200 rounded-xl"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
            <input
              value={form.ifsc}
              onChange={(e) => setForm({ ...form, ifsc: e.target.value })}
              className="w-full p-3 border border-gray-200 rounded-xl"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
            <input
              value={form.bankName}
              onChange={(e) => setForm({ ...form, bankName: e.target.value })}
              className="w-full p-3 border border-gray-200 rounded-xl"
            />
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleVerify}
              disabled={saving}
              className="flex-1 border border-[#1a237e] text-[#1a237e] py-2.5 rounded-xl"
            >
              Verify Account
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-[#1a237e] text-white py-2.5 rounded-xl flex items-center justify-center gap-2"
            >
              {saving ? <Loader2 className="animate-spin h-4 w-4" /> : <Save size={16} />}
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}