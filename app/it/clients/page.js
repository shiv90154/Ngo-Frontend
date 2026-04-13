"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/config/api';
import { Plus, Edit, Trash2, Loader2, Users } from 'lucide-react';

export default function ClientsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', gstNumber: '', address: '' });

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
    else if (user) fetchClients();
  }, [user, authLoading]);

  const fetchClients = async () => {
    try { const res = await api.get('/it/clients'); setClients(res.data.data); } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) await api.put(`/it/clients/${editing._id}`, form);
      else await api.post('/it/clients', form);
      setShowModal(false); setEditing(null); setForm({ name: '', email: '', phone: '', company: '', gstNumber: '', address: '' });
      fetchClients();
    } catch (err) { alert(err.response?.data?.message); }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this client?')) { await api.delete(`/it/clients/${id}`); fetchClients(); }
  };

  const openEdit = (client) => { setEditing(client); setForm(client); setShowModal(true); };

  if (authLoading || loading) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin h-8 w-8 text-[#FF9933]" /></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex"><div className="h-1 w-1/3 bg-[#FF9933]"></div><div className="h-1 w-1/3 bg-white"></div><div className="h-1 w-1/3 bg-[#138808]"></div></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-[#FF9933]/10 flex items-center justify-center"><Users size={20} className="text-[#FF9933]" /></div><h1 className="text-2xl font-bold text-gray-800">Clients</h1></div>
          <button onClick={() => { setEditing(null); setForm({ name: '', email: '', phone: '', company: '', gstNumber: '', address: '' }); setShowModal(true); }} className="flex items-center gap-2 bg-[#FF9933] text-white px-4 py-2 rounded-lg hover:bg-[#ff8800]"><Plus size={18} /> Add Client</button>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th></tr></thead>
            <tbody className="divide-y divide-gray-200">
              {clients.map(client => (
                <tr key={client._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-800">{client.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{client.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{client.phone}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{client.company}</td>
                  <td className="px-6 py-4 flex gap-2"><button onClick={() => openEdit(client)} className="text-blue-600 hover:text-blue-800"><Edit size={16} /></button><button onClick={() => handleDelete(client._id)} className="text-red-600 hover:text-red-800"><Trash2 size={16} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{editing ? 'Edit Client' : 'Add Client'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Name" className="w-full border rounded-lg px-3 py-2" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required />
              <input type="email" placeholder="Email" className="w-full border rounded-lg px-3 py-2" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} required />
              <input type="tel" placeholder="Phone" className="w-full border rounded-lg px-3 py-2" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} />
              <input type="text" placeholder="Company" className="w-full border rounded-lg px-3 py-2" value={form.company} onChange={(e) => setForm({...form, company: e.target.value})} />
              <input type="text" placeholder="GST Number" className="w-full border rounded-lg px-3 py-2" value={form.gstNumber} onChange={(e) => setForm({...form, gstNumber: e.target.value})} />
              <textarea placeholder="Address" rows={2} className="w-full border rounded-lg px-3 py-2" value={form.address} onChange={(e) => setForm({...form, address: e.target.value})} />
              <div className="flex gap-3 justify-end"><button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg">Cancel</button><button type="submit" className="px-4 py-2 bg-[#FF9933] text-white rounded-lg">Save</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}