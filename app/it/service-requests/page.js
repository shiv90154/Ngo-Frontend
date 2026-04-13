"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/config/api';
import { Plus, Loader2, Clock, CheckCircle, XCircle, Users } from 'lucide-react';

export default function ServiceRequestsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [requests, setRequests] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ client: '', title: '', description: '', priority: 'medium' });

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
    else if (user) { fetchRequests(); fetchClients(); }
  }, [user, authLoading]);

  const fetchRequests = async () => { try { const res = await api.get('/it/service-requests'); setRequests(res.data.data); } catch (err) { console.error(err); } finally { setLoading(false); } };
  const fetchClients = async () => { try { const res = await api.get('/it/clients'); setClients(res.data.data); } catch (err) { console.error(err); } };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try { await api.post('/it/service-requests', form); setShowModal(false); setForm({ client: '', title: '', description: '', priority: 'medium' }); fetchRequests(); }
    catch (err) { alert(err.response?.data?.message); }
  };

  const updateStatus = async (id, status) => { await api.put(`/it/service-requests/${id}/status`, { status }); fetchRequests(); };

  const priorityColors = { low: 'bg-gray-100 text-gray-800', medium: 'bg-yellow-100 text-yellow-800', high: 'bg-orange-100 text-orange-800', urgent: 'bg-red-100 text-red-800' };
  const statusIcons = { pending: <Clock size={14} />, 'in-progress': <Loader2 size={14} className="animate-spin" />, resolved: <CheckCircle size={14} />, closed: <XCircle size={14} /> };

  if (authLoading || loading) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin h-8 w-8 text-[#FF9933]" /></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex"><div className="h-1 w-1/3 bg-[#FF9933]"></div><div className="h-1 w-1/3 bg-white"></div><div className="h-1 w-1/3 bg-[#138808]"></div></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-[#FF9933]/10 flex items-center justify-center"><Users size={20} className="text-[#FF9933]" /></div><h1 className="text-2xl font-bold text-gray-800">Service Requests</h1></div>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-[#FF9933] text-white px-4 py-2 rounded-lg hover:bg-[#ff8800]"><Plus size={18} /> New Request</button>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th></tr></thead>
            <tbody className="divide-y divide-gray-200">
              {requests.map(req => (
                <tr key={req._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-800">{req.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{req.client?.name}</td>
                  <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[req.priority]}`}>{req.priority}</span></td>
                  <td className="px-6 py-4"><span className="flex items-center gap-1">{statusIcons[req.status]} {req.status}</span></td>
                  <td className="px-6 py-4 flex gap-2">
                    {req.status === 'pending' && <button onClick={() => updateStatus(req._id, 'in-progress')} className="text-blue-600 text-sm">Start</button>}
                    {req.status === 'in-progress' && <button onClick={() => updateStatus(req._id, 'resolved')} className="text-green-600 text-sm">Resolve</button>}
                    {req.status !== 'closed' && req.status !== 'resolved' && <button onClick={() => updateStatus(req._id, 'closed')} className="text-gray-600 text-sm">Close</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">New Service Request</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <select className="w-full border rounded-lg px-3 py-2" value={form.client} onChange={(e) => setForm({...form, client: e.target.value})} required><option value="">Select Client</option>{clients.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}</select>
              <input type="text" placeholder="Title" className="w-full border rounded-lg px-3 py-2" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} required />
              <textarea placeholder="Description" rows={3} className="w-full border rounded-lg px-3 py-2" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} required />
              <select className="w-full border rounded-lg px-3 py-2" value={form.priority} onChange={(e) => setForm({...form, priority: e.target.value})}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="urgent">Urgent</option></select>
              <div className="flex gap-3 justify-end"><button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg">Cancel</button><button type="submit" className="px-4 py-2 bg-[#FF9933] text-white rounded-lg">Create Request</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}