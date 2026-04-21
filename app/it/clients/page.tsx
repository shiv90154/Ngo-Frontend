"use client";

import { useEffect, useState } from "react";
import { itAPI } from "@/lib/api";
import { Plus, Search, Loader2, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import ClientModal from "@/components/it/ClientModal";
import { toast } from "react-toastify";
import Link from "next/link";

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<any>(null);
  const [showMenu, setShowMenu] = useState<string | null>(null);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const res = await itAPI.getClients({ search: search || undefined });
      setClients(res.data.clients);
    } catch (error) {
      toast.error("Failed to load clients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(fetchClients, 300);
    return () => clearTimeout(delay);
  }, [search]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this client?")) return;
    try {
      await itAPI.deleteClient(id);
      toast.success("Client deleted");
      fetchClients();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-800">Clients</h1>
        <button onClick={() => { setEditingClient(null); setModalOpen(true); }} className="flex items-center gap-2 bg-[#1a237e] text-white px-4 py-2 rounded-lg">
          <Plus className="w-4 h-4" /> Add Client
        </button>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search clients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white"
        />
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>
        ) : clients.length === 0 ? (
          <p className="p-8 text-center text-gray-500">No clients found</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Name</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 hidden sm:table-cell">Email</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 hidden md:table-cell">Phone</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {clients.map((c: any) => (
                <tr key={c._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{c.email}</td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{c.phone}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs ${c.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>{c.status}</span></td>
                  <td className="px-4 py-3 text-right relative">
                    <button onClick={() => setShowMenu(showMenu === c._id ? null : c._id)}><MoreHorizontal className="w-4 h-4" /></button>
                    {showMenu === c._id && (
                      <div className="absolute right-4 mt-1 w-32 bg-white shadow-lg border rounded-lg py-1 z-10">
                        <button onClick={() => { setEditingClient(c); setModalOpen(true); setShowMenu(null); }} className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"><Edit className="w-3 h-3" /> Edit</button>
                        <button onClick={() => handleDelete(c._id)} className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"><Trash2 className="w-3 h-3" /> Delete</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <ClientModal isOpen={modalOpen} onClose={() => setModalOpen(false)} client={editingClient} onSuccess={fetchClients} />
    </div>
  );
}