"use client";

import { useState } from "react";
import { healthcareAPI } from "@/lib/api";
import { X, Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

export default function PrescriptionModal({ isOpen, onClose, patientId }: any) {
  const [diagnosis, setDiagnosis] = useState("");
  const [medicines, setMedicines] = useState([
    { name: "", dosage: "", frequency: "", duration: "" },
  ]);
  const [tests, setTests] = useState<string[]>([]);
  const [advice, setAdvice] = useState("");
  const [loading, setLoading] = useState(false);

  const addMedicine = () =>
    setMedicines([...medicines, { name: "", dosage: "", frequency: "", duration: "" }]);
  const removeMedicine = (idx: number) =>
    setMedicines(medicines.filter((_, i) => i !== idx));
  const updateMedicine = (idx: number, field: string, value: string) => {
    const updated = [...medicines];
    updated[idx] = { ...updated[idx], [field]: value };
    setMedicines(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await healthcareAPI.createPrescription({
        patientId,
        diagnosis,
        medicines: medicines.filter((m) => m.name),
        tests: tests.map((t) => ({ name: t })),
        advice,
      });
      toast.success("Prescription created");
      onClose();
    } catch (error) {
      toast.error("Failed to create prescription");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Write Prescription</h2>
            <button onClick={onClose}>
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Diagnosis</label>
              <input
                type="text"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                className="w-full border rounded-lg p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Medicines</label>
              {medicines.map((med, idx) => (
                <div key={idx} className="grid grid-cols-4 gap-2 mb-2">
                  <input
                    placeholder="Name"
                    value={med.name}
                    onChange={(e) => updateMedicine(idx, "name", e.target.value)}
                    className="border rounded p-1"
                  />
                  <input
                    placeholder="Dosage"
                    value={med.dosage}
                    onChange={(e) => updateMedicine(idx, "dosage", e.target.value)}
                    className="border rounded p-1"
                  />
                  <input
                    placeholder="Frequency"
                    value={med.frequency}
                    onChange={(e) => updateMedicine(idx, "frequency", e.target.value)}
                    className="border rounded p-1"
                  />
                  <div className="flex gap-1">
                    <input
                      placeholder="Duration"
                      value={med.duration}
                      onChange={(e) => updateMedicine(idx, "duration", e.target.value)}
                      className="border rounded p-1 flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => removeMedicine(idx)}
                      className="text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addMedicine}
                className="text-[#1a237e] text-sm flex items-center gap-1"
              >
                <Plus size={14} /> Add Medicine
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tests</label>
              <input
                type="text"
                placeholder="Comma separated"
                value={tests.join(", ")}
                onChange={(e) =>
                  setTests(e.target.value.split(",").map((s) => s.trim()))
                }
                className="w-full border rounded-lg p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Advice</label>
              <textarea
                value={advice}
                onChange={(e) => setAdvice(e.target.value)}
                className="w-full border rounded-lg p-2"
                rows={2}
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-[#1a237e] text-white rounded-lg flex items-center gap-2"
              >
                {loading && <Loader2 className="animate-spin" size={16} />}
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}