"use client";

import { useEffect, useState } from "react";
import { subscriptionAPI } from "@/lib/api";
import { Plus, Edit, Trash2, Loader2, X } from "lucide-react";
import { toast } from "react-toastify";

export default function AdminSubscriptionPlansPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [form, setForm] = useState({
    name: "",
    module: "EDUCATION",
    price: "",
    durationDays: "",
    features: "",
  });

  const fetchPlans = async () => {
    try {
      const res = await subscriptionAPI.getPlans();
      setPlans(res.data.plans);
    } catch (error) {
      toast.error("Failed to load plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPlans(); }, []);

  const openEdit = (plan: any) => {
    setEditingPlan(plan);
    setForm({
      name: plan.name,
      module: plan.module,
      price: plan.price.toString(),
      durationDays: plan.durationDays.toString(),
      features: (plan.features || []).join(", "),
    });
    setModalOpen(true);
  };

  const openCreate = () => {
    setEditingPlan(null);
    setForm({ name: "", module: "EDUCATION", price: "", durationDays: "", features: "" });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      durationDays: Number(form.durationDays),
      features: form.features.split(",").map((s) => s.trim()).filter(Boolean),
    };

    try {
      if (editingPlan) {
        await subscriptionAPI.updatePlan(editingPlan._id, payload);
        toast.success("Plan updated");
      } else {
        await subscriptionAPI.createPlan(payload);
        toast.success("Plan created");
      }
      setModalOpen(false);
      fetchPlans();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Save failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this plan?")) return;
    try {
      await subscriptionAPI.deletePlan(id);
      toast.success("Plan deleted");
      fetchPlans();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const moduleLabels: Record<string, string> = {
    EDUCATION: "Education",
    HEALTH: "Healthcare",
    AGRICULTURE: "Agriculture",
    ALL: "All Services",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Subscription Plans</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-[#1a237e] text-white px-4 py-2 rounded-lg hover:bg-[#0d1757] transition"
        >
          <Plus size={16} /> Create Plan
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin h-8 w-8 text-[#1a237e]" />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Module</th>
                <th className="px-4 py-3 text-left">Price</th>
                <th className="px-4 py-3 text-left">Duration</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {plans.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-gray-500">No plans found.</td></tr>
              ) : (
                plans.map((plan: any) => (
                  <tr key={plan._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{plan.name}</td>
                    <td className="px-4 py-3">{moduleLabels[plan.module] || plan.module}</td>
                    <td className="px-4 py-3">₹{plan.price}</td>
                    <td className="px-4 py-3">{plan.durationDays} days</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => openEdit(plan)} className="p-1 hover:bg-gray-100 rounded">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(plan._id)} className="p-1 hover:bg-gray-100 rounded text-red-600">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Create/Edit */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">{editingPlan ? "Edit Plan" : "Create Plan"}</h2>
              <button onClick={() => setModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Plan Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border rounded-lg p-2" required />
              <select value={form.module} onChange={(e) => setForm({ ...form, module: e.target.value })} className="w-full border rounded-lg p-2">
                {Object.entries(moduleLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
              </select>
              <input type="number" placeholder="Price (₹)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full border rounded-lg p-2" required />
              <input type="number" placeholder="Duration (days)" value={form.durationDays} onChange={(e) => setForm({ ...form, durationDays: e.target.value })} className="w-full border rounded-lg p-2" required />
              <input type="text" placeholder="Features (comma separated)" value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} className="w-full border rounded-lg p-2" />
              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#1a237e] text-white rounded-lg">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}