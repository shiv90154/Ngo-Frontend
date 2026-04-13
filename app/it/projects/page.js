"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/config/api';
import { Plus, Edit, Trash2, Loader2, Briefcase } from 'lucide-react';

export default function ProjectsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', client: '', startDate: '', endDate: '', budget: '', status: 'pending' });

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
    else if (user) { fetchProjects(); fetchClients(); }
  }, [user, authLoading]);

  const fetchProjects = async () => {
    try { const res = await api.get('/it/projects'); setProjects(res.data.data); } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };
  const fetchClients = async () => {
    try { const res = await api.get('/it/clients'); setClients(res.data.data); } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) await api.put(`/it/projects/${editing._id}`, form);
      else await api.post('/it/projects', form);
      setShowModal(false); setEditing(null); setForm({ name: '', description: '', client: '', startDate: '', endDate: '', budget: '', status: 'pending' });
      fetchProjects();
    } catch (err) { alert(err.response?.data?.message); }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this project?')) { await api.delete(`/it/projects/${id}`); fetchProjects(); }
  };

  const openEdit = (project) => { setEditing(project); setForm({ ...project, client: project.client?._id || project.client }); setShowModal(true); };

  const statusColors = { pending: 'bg-yellow-100 text-yellow-800', active: 'bg-green-100 text-green-800', completed: 'bg-blue-100 text-blue-800', cancelled: 'bg-red-100 text-red-800' };

  if (authLoading || loading) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin h-8 w-8 text-[#FF9933]" /></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex"><div className="h-1 w-1/3 bg-[#FF9933]"></div><div className="h-1 w-1/3 bg-white"></div><div className="h-1 w-1/3 bg-[#138808]"></div></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-[#FF9933]/10 flex items-center justify-center"><Briefcase size={20} className="text-[#FF9933]" /></div><h1 className="text-2xl font-bold text-gray-800">Projects</h1></div>
          <button onClick={() => { setEditing(null); setForm({ name: '', description: '', client: '', startDate: '', endDate: '', budget: '', status: 'pending' }); setShowModal(true); }} className="flex items-center gap-2 bg-[#FF9933] text-white px-4 py-2 rounded-lg hover:bg-[#ff8800]"><Plus size={18} /> Add Project</button>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Budget</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th></tr></thead>
            <tbody className="divide-y divide-gray-200">
              {projects.map(proj => (
                <tr key={proj._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-800">{proj.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{proj.client?.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">₹{proj.budget?.toLocaleString()}</td>
                  <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[proj.status]}`}>{proj.status}</span></td>
                  <td className="px-6 py-4 flex gap-2"><button onClick={() => openEdit(proj)} className="text-blue-600 hover:text-blue-800"><Edit size={16} /></button><button onClick={() => handleDelete(proj._id)} className="text-red-600 hover:text-red-800"><Trash2 size={16} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{editing ? 'Edit Project' : 'Add Project'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Project Name" className="w-full border rounded-lg px-3 py-2" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required />
              <textarea placeholder="Description" rows={2} className="w-full border rounded-lg px-3 py-2" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} />
              <select className="w-full border rounded-lg px-3 py-2" value={form.client} onChange={(e) => setForm({...form, client: e.target.value})} required><option value="">Select Client</option>{clients.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}</select>
              <input type="date" placeholder="Start Date" className="w-full border rounded-lg px-3 py-2" value={form.startDate?.split('T')[0] || ''} onChange={(e) => setForm({...form, startDate: e.target.value})} />
              <input type="date" placeholder="End Date" className="w-full border rounded-lg px-3 py-2" value={form.endDate?.split('T')[0] || ''} onChange={(e) => setForm({...form, endDate: e.target.value})} />
              <input type="number" placeholder="Budget (₹)" className="w-full border rounded-lg px-3 py-2" value={form.budget} onChange={(e) => setForm({...form, budget: e.target.value})} />
              <select className="w-full border rounded-lg px-3 py-2" value={form.status} onChange={(e) => setForm({...form, status: e.target.value})}><option value="pending">Pending</option><option value="active">Active</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select>
              <div className="flex gap-3 justify-end"><button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg">Cancel</button><button type="submit" className="px-4 py-2 bg-[#FF9933] text-white rounded-lg">Save</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}