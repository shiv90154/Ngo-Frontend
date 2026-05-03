"use client";

import { useEffect, useState } from "react";
import { medicineAPI } from "@/lib/api";
import {
  Plus,
  Edit,
  Trash2,
  X,
  Search,
  Loader2,
  Package,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-toastify";

export default function AdminMedicinesPage() {
  const [medicines, setMedicines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    genericName: "",
    brand: "",
    manufacturer: "",
    description: "",
    price: 0,
    mrp: 0,
    prescriptionRequired: false,
    stock: 0,
    category: "",
    dosageForm: "",
    dosageStrength: "",
    sideEffects: "",
    imageUrl: "",
  });

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const res = await medicineAPI.getMedicines({ limit: 200, search });
      setMedicines(res.data.medicines || []);
    } catch (err) {
      toast.error("Failed to load medicines");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, [search]);

  const resetForm = () => {
    setForm({
      name: "",
      genericName: "",
      brand: "",
      manufacturer: "",
      description: "",
      price: 0,
      mrp: 0,
      prescriptionRequired: false,
      stock: 0,
      category: "",
      dosageForm: "",
      dosageStrength: "",
      sideEffects: "",
      imageUrl: "",
    });
    setEditId(null);
    setShowForm(false);
  };

  const handleEdit = (med: any) => {
    setForm({
      name: med.name,
      genericName: med.genericName || "",
      brand: med.brand || "",
      manufacturer: med.manufacturer || "",
      description: med.description || "",
      price: med.price,
      mrp: med.mrp || med.price,
      prescriptionRequired: med.prescriptionRequired,
      stock: med.stock,
      category: med.category || "",
      dosageForm: med.dosageForm || "",
      dosageStrength: med.dosageStrength || "",
      sideEffects: med.sideEffects || "",
      imageUrl: med.imageUrl || "",
    });
    setEditId(med._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this medicine? This cannot be undone.")) return;
    try {
      await medicineAPI.deleteMedicine(id);
      toast.success("Medicine deleted");
      fetchMedicines();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  const handleStockUpdate = async (id: string, newStock: number) => {
    try {
      await medicineAPI.updateStock(id, newStock);
      toast.success("Stock updated");
      fetchMedicines();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) {
        await medicineAPI.updateMedicine(editId, form);
        toast.success("Medicine updated successfully");
      } else {
        await medicineAPI.addMedicine(form);
        toast.success("Medicine added to catalogue");
      }
      resetForm();
      fetchMedicines();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const filteredMedicines = medicines.filter((med) =>
    med.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Medicine Catalogue</h1>
            <p className="text-gray-500 mt-1 text-sm">
              Manage medicines available in the e‑pharmacy store
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="flex items-center gap-2 bg-[#1a237e] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#11195c] transition"
          >
            <Plus size={18} /> Add Medicine
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search medicines by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1a237e]/20 focus:border-[#1a237e]"
          />
        </div>
      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-gray-800">
              {editId ? "Edit Medicine" : "Add New Medicine"}
            </h2>
            <button
              onClick={resetForm}
              className="p-2 rounded-lg hover:bg-gray-100 transition"
            >
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Generic Name</label>
              <input
                type="text"
                value={form.genericName}
                onChange={(e) => setForm({ ...form, genericName: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
              <input
                type="text"
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
              <input
                type="text"
                value={form.manufacturer}
                onChange={(e) => setForm({ ...form, manufacturer: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">MRP (₹)</label>
              <input
                type="number"
                value={form.mrp}
                onChange={(e) => setForm({ ...form, mrp: parseFloat(e.target.value) })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <input
                type="number"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input
                type="text"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dosage Form</label>
              <input
                type="text"
                value={form.dosageForm}
                onChange={(e) => setForm({ ...form, dosageForm: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dosage Strength</label>
              <input
                type="text"
                value={form.dosageStrength}
                onChange={(e) => setForm({ ...form, dosageStrength: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={form.prescriptionRequired}
                  onChange={(e) =>
                    setForm({ ...form, prescriptionRequired: e.target.checked })
                  }
                  className="rounded border-gray-300 h-4 w-4"
                />
                Prescription Required
              </label>
            </div>
            <div className="md:col-span-2 flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 bg-[#1a237e] text-white rounded-lg text-sm font-medium hover:bg-[#11195c] transition disabled:opacity-70 flex items-center gap-2"
              >
                {saving && <Loader2 size={16} className="animate-spin" />}
                {editId ? "Update Medicine" : "Add Medicine"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Medicines Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse flex gap-4">
                <div className="h-10 bg-gray-200 rounded w-1/4" />
                <div className="h-10 bg-gray-200 rounded w-1/4" />
                <div className="h-10 bg-gray-200 rounded w-1/4" />
                <div className="h-10 bg-gray-200 rounded w-1/4" />
              </div>
            ))}
          </div>
        ) : filteredMedicines.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">No medicines found</p>
            <p className="text-sm text-gray-400 mt-1">
              {search ? "Try adjusting your search." : "Click 'Add Medicine' to start building your catalogue."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-5 py-3 text-left font-semibold text-gray-700">Medicine</th>
                  <th className="px-5 py-3 text-center font-semibold text-gray-700">Price / MRP</th>
                  <th className="px-5 py-3 text-center font-semibold text-gray-700">Stock</th>
                  <th className="px-5 py-3 text-center font-semibold text-gray-700">Category</th>
                  <th className="px-5 py-3 text-center font-semibold text-gray-700">Rx</th>
                  <th className="px-5 py-3 text-center font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredMedicines.map((med) => (
                  <tr key={med._id} className="hover:bg-gray-50/50 transition">
                    <td className="px-5 py-3">
                      <p className="font-medium text-gray-900">{med.name}</p>
                      {med.genericName && (
                        <p className="text-xs text-gray-500">{med.genericName}</p>
                      )}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <p className="font-semibold text-gray-800">₹{med.price}</p>
                      {med.mrp && med.mrp > med.price && (
                        <p className="text-xs text-gray-400 line-through">₹{med.mrp}</p>
                      )}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <input
                          type="number"
                          defaultValue={med.stock}
                          onBlur={(e) => {
                            const newStock = parseInt(e.target.value);
                            if (!isNaN(newStock) && newStock >= 0)
                              handleStockUpdate(med._id, newStock);
                          }}
                          className="w-16 border border-gray-300 rounded px-2 py-1 text-xs text-center"
                        />
                      </div>
                    </td>
                    <td className="px-5 py-3 text-center text-gray-600">
                      {med.category || "—"}
                    </td>
                    <td className="px-5 py-3 text-center">
                      {med.prescriptionRequired ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                          <AlertCircle size={12} /> Rx
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">No</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleEdit(med)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(med._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}