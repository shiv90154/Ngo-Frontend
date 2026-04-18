"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/config/api';
import { Fingerprint, IndianRupee, Loader2 } from 'lucide-react';

export default function AepsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ aadhaarNumber: '', amount: '', bankIIN: '' });
  const [loading, setLoading] = useState(false);

  const handleWithdraw = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/finance/aeps/withdraw', form);
      alert('AEPS withdrawal successful');
      setForm({ aadhaarNumber: '', amount: '', bankIIN: '' });
    } catch (err) { alert(err.response?.data?.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex"><div className="h-1 w-1/3 bg-[#FF9933]"></div><div className="h-1 w-1/3 bg-white"></div><div className="h-1 w-1/3 bg-[#138808]"></div></div>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6"><Fingerprint size={24} className="text-[#FF9933]" /><h1 className="text-2xl font-bold text-gray-800">AEPS Withdrawal</h1></div>
          <form onSubmit={handleWithdraw} className="space-y-5">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar Number</label><input type="text" maxLength="12" className="w-full border rounded-lg px-3 py-2" value={form.aadhaarNumber} onChange={(e) => setForm({...form, aadhaarNumber: e.target.value})} required /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Bank IIN (First 6 digits)</label><input type="text" maxLength="6" className="w-full border rounded-lg px-3 py-2" value={form.bankIIN} onChange={(e) => setForm({...form, bankIIN: e.target.value})} required /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label><input type="number" className="w-full border rounded-lg px-3 py-2" value={form.amount} onChange={(e) => setForm({...form, amount: e.target.value})} required /></div>
            <button type="submit" disabled={loading} className="w-full bg-[#FF9933] text-white py-2 rounded-lg">{loading ? 'Processing...' : 'Withdraw'}</button>
          </form>
        </div>
      </div>
    </div>
  );
}