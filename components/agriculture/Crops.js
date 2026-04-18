"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/config/api';
import { Plus, Edit, Trash2, Loader2, Sprout } from 'lucide-react';

export default function Crops() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ cropName: '', sowingDate: '', expectedHarvestDate: '', areaCultivated: '', expectedYield: '' });

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
    else if (user) fetchCrops();
  }, [user, authLoading]);

  const fetchCrops = async () => {
    try { const res = await api.get('/agriculture/crops'); setCrops(res.data.data); } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) await api.put(`/agriculture/crops/${editing._id}`, form);
      else await api.post('/agriculture/crops', form);
      setShowModal(false); setEditing(null); setForm({ cropName: '', sowingDate: '', expectedHarvestDate: '', areaCultivated: '', expectedYield: '' });
      fetchCrops();
    } catch (err) { alert(err.response?.data?.message); }
  };
  const [confirmId, setConfirmId] = useState(null);

  const handleDelete = async (id) => {
    setConfirmId(id); // open modal
  };

  const openEdit = (crop) => { setEditing(crop); setForm(crop); setShowModal(true); };

  if (authLoading || loading) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin h-8 w-8 text-[#FF9933]" /></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50/30 overflow-y-auto">
      {/* Dynamic Header */}
      <div className="bg-white/70 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-10">
        <div className="flex h-1 w-full">
          <div className="h-1 w-1/3 bg-gradient-to-r from-[#FF9933] to-[#ffb366]"></div>
          <div className="h-1 w-1/3 bg-white"></div>
          <div className="h-1 w-1/3 bg-gradient-to-r from-[#138808] to-[#1bb50b]"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push('/agriculture')} className="p-2 mr-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500">
              ←
            </button>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#138808] to-[#1bb50b] flex items-center justify-center shadow-sm">
              <Sprout className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Crop Inventory</h1>
              <p className="text-sm font-medium text-emerald-600">Manage implementations & harvests</p>
            </div>
          </div>
          <button onClick={() => { setEditing(null); setForm({ cropName: '', sowingDate: '', expectedHarvestDate: '', areaCultivated: '', expectedYield: '' }); setShowModal(true); }} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-sm font-semibold">
            <Plus size={18} /> Add Crop
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {crops.length === 0 ? (
          <div className="bg-white/60 backdrop-blur-xl rounded-xl border-2 border-dashed border-gray-200 p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
              <Sprout size={32} className="text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No crops recorded yet</h3>
            <p className="text-gray-500 max-w-sm mx-auto mb-6">Track your farming activities by adding your first crop to the inventory.</p>
            <button onClick={() => { setEditing(null); setForm({ cropName: '', sowingDate: '', expectedHarvestDate: '', areaCultivated: '', expectedYield: '' }); setShowModal(true); }} className="bg-emerald-600 text-white font-medium px-6 py-2.5 rounded-lg hover:bg-emerald-700 transition">Add Your First Crop</button>
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-sm border border-white overflow-hidden">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Crop Name</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Sowing Date</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Harvest Date</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Area (acres)</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {crops.map(crop => (
                  <tr key={crop._id} className="hover:bg-emerald-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                          <Sprout size={18} className="text-emerald-600" />
                        </div>
                        <span className="text-sm font-bold text-gray-800">{crop.cropName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-600">{crop.sowingDate?.split('T')[0] || '-'}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-600">{crop.expectedHarvestDate?.split('T')[0] || '-'}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                        {crop.areaCultivated} Acres
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 ">
                        <button onClick={() => openEdit(crop)} className="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"><Edit size={16} /></button>
                        <button onClick={() => handleDelete(crop._id)} className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {confirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-sm text-center">

            <h2 className="text-lg font-semibold text-gray-800">
              Delete Crop?
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              This action cannot be undone.
            </p>

            <div className="mt-5 flex justify-center gap-3">
              <button
                onClick={() => setConfirmId(null)}
                className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  await api.delete(`/agriculture/crops/${confirmId}`);
                  fetchCrops();
                  setConfirmId(null);
                }}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Glassmorphic Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-white overflow-hidden transform transition-all">
            <div className="bg-emerald-50 px-6 py-4 border-b border-emerald-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-emerald-900 flex items-center gap-2">
                <Sprout size={20} className="text-emerald-600" />
                {editing ? 'Edit Crop Details' : 'Add New Crop'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">Crop Name</label>
                <input type="text" placeholder="e.g. Wheat, Rice" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder:text-gray-300 font-medium" value={form.cropName} onChange={(e) => setForm({ ...form, cropName: e.target.value })} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">Sowing Date</label>
                  <input type="date" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all font-medium text-gray-700" value={form.sowingDate?.split('T')[0] || ''} onChange={(e) => setForm({ ...form, sowingDate: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">Harvest Date</label>
                  <input type="date" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all font-medium text-gray-700" value={form.expectedHarvestDate?.split('T')[0] || ''} onChange={(e) => setForm({ ...form, expectedHarvestDate: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">Area (Acres)</label>
                  <input type="number" step="0.01" placeholder="0.0" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all font-medium" value={form.areaCultivated} onChange={(e) => setForm({ ...form, areaCultivated: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">Yield (Quintals)</label>
                  <input type="number" step="0.01" placeholder="0.0" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all font-medium" value={form.expectedYield} onChange={(e) => setForm({ ...form, expectedYield: e.target.value })} />
                </div>
              </div>
              <div className="flex gap-3 justify-end pt-4 mt-6 border-t border-gray-100">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-all">Cancel</button>
                <button type="submit" className="px-5 py-2.5 text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm hover:shadow transition-all">Save Crop</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
