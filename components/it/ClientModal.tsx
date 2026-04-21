"use client";

import { useEffect, useState } from "react";
import { itAPI } from "@/lib/api";
import { X, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

export default function ClientModal({ isOpen, onClose, client, onSuccess }: any) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", gstNumber: "", status: "lead" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (client) setForm(client);
    else setForm({ name: "", email: "", phone: "", company: "", gstNumber: "", status: "lead" });
  }, [client]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (client) await itAPI.updateClient(client._id, form);
      else await itAPI.createClient(form);
      toast.success(client ? "Client updated" : "Client created");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Failed to save client");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">{client ? "Edit Client" : "New Client"}</h2>
          <button onClick={onClose}><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="text" placeholder="Full Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full p-2 border rounded-lg" required />
          <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full p-2 border rounded-lg" />
          <input type="tel" placeholder="Phone *" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full p-2 border rounded-lg" required />
          <input type="text" placeholder="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="w-full p-2 border rounded-lg" />
          <input type="text" placeholder="GST Number" value={form.gstNumber} onChange={(e) => setForm({ ...form, gstNumber: e.target.value })} className="w-full p-2 border rounded-lg" />
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full p-2 border rounded-lg">
            <option value="lead">Lead</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <div className="flex justify-end gap-2 pt-3">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-[#1a237e] text-white rounded-lg flex items-center gap-2">
              {loading ? <Loader2 className="animate-spin w-4 h-4" /> : null} Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}