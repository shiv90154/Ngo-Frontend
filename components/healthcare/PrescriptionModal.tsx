"use client";

import { useState, useRef, useEffect } from "react";
import { healthcareAPI, medicineAPI } from "@/lib/api";
import { X, Plus, Trash2, Loader2, Search } from "lucide-react";
import { toast } from "react-toastify";

type Medicine = {
  _id: string;
  name: string;
  genericName?: string;
  dosageStrength?: string;
};

export default function PrescriptionModal({ isOpen, onClose, patientId }: any) {
  const [diagnosis, setDiagnosis] = useState("");
  const [medicines, setMedicines] = useState([
    { name: "", dosage: "", frequency: "", duration: "" },
  ]);
  const [tests, setTests] = useState<string[]>([]);
  const [advice, setAdvice] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔍 Medicine search state
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Medicine[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1); // for keyboard navigation
  const searchInputRef = useRef<HTMLInputElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Fetch medicine suggestions when search term changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setShowSuggestions(false);
      return;
    }

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(async () => {
      try {
        const res = await medicineAPI.searchMedicines(searchTerm, { limit: 5 });
        setSearchResults(res.data.medicines || []);
        setShowSuggestions(true);
        setActiveIndex(-1);
      } catch (error) {
        // fail silently – suggestions are optional
      }
    }, 300);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [searchTerm]);

  const addMedicine = () =>
    setMedicines([...medicines, { name: "", dosage: "", frequency: "", duration: "" }]);

  const removeMedicine = (idx: number) =>
    setMedicines(medicines.filter((_, i) => i !== idx));

  const updateMedicine = (idx: number, field: string, value: string) => {
    const updated = [...medicines];
    updated[idx] = { ...updated[idx], [field]: value };
    setMedicines(updated);
  };

  const selectMedicine = (idx: number, medicine: Medicine) => {
    const updated = [...medicines];
    updated[idx].name = medicine.name;
    // Optionally fill dosage from medicine data
    if (medicine.dosageStrength && !updated[idx].dosage) {
      updated[idx].dosage = medicine.dosageStrength;
    }
    setMedicines(updated);
    setShowSuggestions(false);
    setSearchTerm("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await healthcareAPI.createPrescription({
        patientId,
        diagnosis,
        medicines: medicines.filter((m) => m.name.trim()),
        tests: tests.map((t) => ({ name: t.trim() })).filter((t) => t.name),
        advice,
        followUpDate: followUpDate || undefined,
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
            {/* Diagnosis */}
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

            {/* Medicines */}
            <div>
              <label className="block text-sm font-medium mb-1">Medicines</label>
              {medicines.map((med, idx) => (
                <div key={idx} className="space-y-2 mb-3">
                  <div className="grid grid-cols-4 gap-2">
                    {/* Medicine Name with Autocomplete */}
                    <div className="relative">
                      <input
                        placeholder="Medicine name"
                        value={med.name}
                        onChange={(e) => {
                          updateMedicine(idx, "name", e.target.value);
                          setSearchTerm(e.target.value);
                          setActiveIndex(idx); // track which input is focused
                        }}
                        onFocus={() => setActiveIndex(idx)}
                        className="w-full border rounded p-1"
                      />
                      {showSuggestions &&
                        searchTerm &&
                        activeIndex === idx &&
                        searchResults.length > 0 && (
                          <div className="absolute z-10 bg-white border rounded-lg shadow-lg mt-1 w-full max-h-32 overflow-y-auto">
                            {searchResults.map((medItem) => (
                              <div
                                key={medItem._id}
                                onClick={() => selectMedicine(idx, medItem)}
                                className="p-2 hover:bg-indigo-50 cursor-pointer text-sm flex justify-between items-center"
                              >
                                <div>
                                  <span className="font-medium">{medItem.name}</span>
                                  {medItem.genericName && (
                                    <span className="text-xs text-gray-500 ml-1">
                                      ({medItem.genericName})
                                    </span>
                                  )}
                                </div>
                                {medItem.dosageStrength && (
                                  <span className="text-xs text-gray-400">
                                    {medItem.dosageStrength}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                    </div>

                    {/* Dosage */}
                    <input
                      placeholder="Dosage"
                      value={med.dosage}
                      onChange={(e) => updateMedicine(idx, "dosage", e.target.value)}
                      className="border rounded p-1"
                    />

                    {/* Frequency */}
                    <input
                      placeholder="Frequency"
                      value={med.frequency}
                      onChange={(e) => updateMedicine(idx, "frequency", e.target.value)}
                      className="border rounded p-1"
                    />

                    {/* Duration + Delete */}
                    <div className="flex gap-1">
                      <input
                        placeholder="Duration"
                        value={med.duration}
                        onChange={(e) => updateMedicine(idx, "duration", e.target.value)}
                        className="border rounded p-1 flex-1"
                      />
                      {medicines.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeMedicine(idx)}
                          className="text-red-500 self-center"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
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

            {/* Tests */}
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

            {/* Advice */}
            <div>
              <label className="block text-sm font-medium mb-1">Advice</label>
              <textarea
                value={advice}
                onChange={(e) => setAdvice(e.target.value)}
                className="w-full border rounded-lg p-2"
                rows={2}
              />
            </div>

            {/* Follow-up Date */}
            <div>
              <label className="block text-sm font-medium mb-1">Follow‑up Date</label>
              <input
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full border rounded-lg p-2"
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