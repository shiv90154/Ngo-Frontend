"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/config/api";
import { Banknote, Loader2, PlusCircle } from "lucide-react";

export default function BillsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ billType: "electricity", billNumber: "", amount: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
    else if (user) fetchBills();
  }, [user, authLoading]);

  const fetchBills = async () => {
    try { const res = await api.get("/finance/bills/history"); setBills(res.data.data); } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const payBill = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/finance/bills/pay", { billType: form.billType, billNumber: form.billNumber, amount: parseFloat(form.amount) });
      alert("Bill paid successfully");
      setModalOpen(false); setForm({ billType: "electricity", billNumber: "", amount: "" }); fetchBills();
    } catch (err) { alert(err.response?.data?.message); }
    finally { setSubmitting(false); }
  };

  if (authLoading || loading) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin h-8 w-8 text-[#FF9933]" /></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex"><div className="h-1 w-1/3 bg-[#FF9933]"></div><div className="h-1 w-1/3 bg-white"></div><div className="h-1 w-1/3 bg-[#138808]"></div></div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-[#FF9933]/10 flex items-center justify-center"><Banknote size={20} className="text-[#FF9933]" /></div><h1 className="text-2xl font-bold">Bill Payments</h1></div><button onClick={() => setModalOpen(true)} className="px-4 py-2 bg-[#FF9933] text-white rounded-md text-sm flex items-center gap-1"><PlusCircle size={14} /> Pay Bill</button></div>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden"><table className="min-w-full divide-y divide-gray-200"><thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bill Number</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paid On</th></tr></thead><tbody className="divide-y divide-gray-200">{bills.map(bill => (<tr key={bill._id} className="hover:bg-gray-50"><td className="px-6 py-4 text-sm capitalize">{bill.billType}</td><td className="px-6 py-4 text-sm">{bill.billNumber}</td><td className="px-6 py-4 text-sm">₹{bill.amount}</td><td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${bill.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{bill.status}</span></td><td className="px-6 py-4 text-sm">{bill.paidAt ? new Date(bill.paidAt).toLocaleDateString() : '-'}</td></tr>))}</tbody></table></div>
      </div>
      {modalOpen && (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><div className="bg-white rounded-lg p-6 w-full max-w-md"><h2 className="text-xl font-bold mb-4">Pay Bill</h2><form onSubmit={payBill} className="space-y-4"><select className="w-full border rounded px-3 py-2" value={form.billType} onChange={(e) => setForm({...form, billType: e.target.value})}><option value="electricity">Electricity</option><option value="water">Water</option><option value="gas">Gas</option><option value="internet">Internet</option><option value="mobile">Mobile</option><option value="other">Other</option></select><input type="text" placeholder="Bill Number / Consumer ID" className="w-full border rounded px-3 py-2" value={form.billNumber} onChange={(e) => setForm({...form, billNumber: e.target.value})} required /><input type="number" placeholder="Amount (₹)" className="w-full border rounded px-3 py-2" value={form.amount} onChange={(e) => setForm({...form, amount: e.target.value})} required /><div className="flex gap-3 justify-end"><button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 border rounded">Cancel</button><button type="submit" disabled={submitting} className="px-4 py-2 bg-[#FF9933] text-white rounded">{submitting ? "Processing..." : "Pay Now"}</button></div></form></div></div>)}
    </div>
  );
}