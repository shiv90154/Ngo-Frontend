"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/config/api';
import { Plus, Eye, Loader2, FileText, CheckCircle } from 'lucide-react';

export default function InvoicesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [invoices, setInvoices] = useState([]);
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ client: '', project: '', amount: '', tax: 0, dueDate: '', items: [{ description: '', quantity: 1, rate: 0 }] });

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
    else if (user) { fetchInvoices(); fetchClients(); fetchProjects(); }
  }, [user, authLoading]);

  const fetchInvoices = async () => { try { const res = await api.get('/it/invoices'); setInvoices(res.data.data); } catch (err) { console.error(err); } finally { setLoading(false); } };
  const fetchClients = async () => { try { const res = await api.get('/it/clients'); setClients(res.data.data); } catch (err) { console.error(err); } };
  const fetchProjects = async () => { try { const res = await api.get('/it/projects'); setProjects(res.data.data); } catch (err) { console.error(err); } };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const total = form.items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
      const taxAmount = total * (form.tax / 100);
      await api.post('/it/invoices', { ...form, total: total + taxAmount });
      setShowModal(false); setForm({ client: '', project: '', amount: '', tax: 0, dueDate: '', items: [{ description: '', quantity: 1, rate: 0 }] });
      fetchInvoices();
    } catch (err) { alert(err.response?.data?.message); }
  };

  const addItem = () => setForm({ ...form, items: [...form.items, { description: '', quantity: 1, rate: 0 }] });
  const updateItem = (idx, field, val) => { const newItems = [...form.items]; newItems[idx][field] = val; setForm({ ...form, items: newItems }); };
  const removeItem = (idx) => setForm({ ...form, items: form.items.filter((_, i) => i !== idx) });

  const updateStatus = async (id, status) => { await api.put(`/it/invoices/${id}/status`, { status }); fetchInvoices(); };

  const statusColors = { draft: 'bg-gray-100 text-gray-800', sent: 'bg-blue-100 text-blue-800', paid: 'bg-green-100 text-green-800', overdue: 'bg-red-100 text-red-800' };

  if (authLoading || loading) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin h-8 w-8 text-[#FF9933]" /></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex"><div className="h-1 w-1/3 bg-[#FF9933]"></div><div className="h-1 w-1/3 bg-white"></div><div className="h-1 w-1/3 bg-[#138808]"></div></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-[#FF9933]/10 flex items-center justify-center"><FileText size={20} className="text-[#FF9933]" /></div><h1 className="text-2xl font-bold text-gray-800">Invoices</h1></div>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-[#FF9933] text-white px-4 py-2 rounded-lg hover:bg-[#ff8800]"><Plus size={18} /> Create Invoice</button>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice #</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th></tr></thead>
            <tbody className="divide-y divide-gray-200">
              {invoices.map(inv => (
                <tr key={inv._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-800">{inv.invoiceNumber}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{inv.client?.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">₹{inv.total?.toLocaleString()}</td>
                  <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[inv.status]}`}>{inv.status}</span></td>
                  <td className="px-6 py-4 flex gap-2">
                    {inv.status !== 'paid' && <button onClick={() => updateStatus(inv._id, 'paid')} className="text-green-600 hover:text-green-800"><CheckCircle size={16} /></button>}
                    <button onClick={() => window.open(`/it/invoices/${inv._id}`, '_blank')} className="text-blue-600 hover:text-blue-800"><Eye size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Create Invoice Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Create Invoice</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <select className="w-full border rounded-lg px-3 py-2" value={form.client} onChange={(e) => setForm({...form, client: e.target.value})} required><option value="">Select Client</option>{clients.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}</select>
              <select className="w-full border rounded-lg px-3 py-2" value={form.project} onChange={(e) => setForm({...form, project: e.target.value})}><option value="">Select Project (optional)</option>{projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}</select>
              <div className="border rounded-lg p-3">
                <h3 className="font-semibold mb-2">Invoice Items</h3>
                {form.items.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-4 gap-2 mb-2">
                    <input type="text" placeholder="Description" className="border rounded px-2 py-1 col-span-2" value={item.description} onChange={(e) => updateItem(idx, 'description', e.target.value)} />
                    <input type="number" placeholder="Qty" className="border rounded px-2 py-1" value={item.quantity} onChange={(e) => updateItem(idx, 'quantity', parseInt(e.target.value))} />
                    <input type="number" placeholder="Rate" className="border rounded px-2 py-1" value={item.rate} onChange={(e) => updateItem(idx, 'rate', parseFloat(e.target.value))} />
                    {idx > 0 && <button type="button" onClick={() => removeItem(idx)} className="text-red-500 text-sm">Remove</button>}
                  </div>
                ))}
                <button type="button" onClick={addItem} className="text-blue-600 text-sm mt-2">+ Add Item</button>
              </div>
              <input type="number" placeholder="Tax %" className="w-full border rounded-lg px-3 py-2" value={form.tax} onChange={(e) => setForm({...form, tax: parseFloat(e.target.value)})} />
              <input type="date" placeholder="Due Date" className="w-full border rounded-lg px-3 py-2" value={form.dueDate?.split('T')[0] || ''} onChange={(e) => setForm({...form, dueDate: e.target.value})} />
              <div className="flex gap-3 justify-end"><button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg">Cancel</button><button type="submit" className="px-4 py-2 bg-[#FF9933] text-white rounded-lg">Generate Invoice</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}