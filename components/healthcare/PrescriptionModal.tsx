"use client";

import { useState } from "react";
import { healthcareAPI } from "@/lib/api";
import { X, Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

export default function PrescriptionModal({ isOpen, onClose, patientId }: any) {
  const [diagnosis, setDiagnosis] = useState("");
  const [medicines, setMedicines] = useState([{ name: "", dosage: "", frequency: "", duration: "" }]);
  const [tests, setTests] = useState<string[]>([]);
  const [advice, setAdvice] = useState("");
  const [loading, setLoading] = useState(false);

  const addMedicine = () => setMedicines([...medicines, { name: "", dosage: "", frequency: "", duration: "" }]);
  const removeMedicine = (idx: number) => setMedicines(medicines.filter((_, i) => i !== idx));
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
        medicines: medicines.filter(m => m.name),
        tests: tests.map(t => ({ name: t })),
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
    return (
    <div className <div className="fixed="fixed inset- inset-0 bg0 bg-black/-black/50 flex items-center50 flex items-center justify-center justify-center z- z-50 p50 p-4">
     -4">
      <div <div className=" className="bg-whitebg-white rounded-xl max-w-2 rounded-xl max-w-2xl wxl w-full max-h-[90vh] overflow-full max-h-[90vh] overflow-y-auto-y-auto">
       ">
        <div className=" <div className="p-p-6">
         6">
          <div className="flex <div className="flex items-center justify-between items-center justify-between mb-4 mb-4">
           ">
            <h2 className="text-xl <h2 className="text-xl font-bold font-bold">Write Prescription">Write Prescription</h</h22>
           >
            <button onClick <button onClick={onClose}={onClose}><X><X size={ size={20}20} /></button>
          /></button>
          </div </div>
          <form>
          <form onSubmit={handleSubmit onSubmit={handleSubmit} className} className="space="space-y--y-44">
           ">
            <div <div>
             >
              <label className="block <label className="block text-sm text-sm font-medium font-medium mb-1"> mb-1">DiagnosisDiagnosis</label>
             </label>
              <input <input type="text" value={diagnosis} onChange type="text" value={diagnosis} onChange={e={e => set => setDiagnosisDiagnosis(e.target(e.target.value)}.value)} className="w-full className="w-full border rounded border rounded-lg p-lg p-2-2" required />
           " required />
            </div </div>
           >
            <div>
              <div>
              <label <label className=" className="block textblock text-sm font-sm font-medium mb-medium mb-1">Med-1">Medicines</labelicines</label>
             >
              {med {medicines.map((icines.map((med, idx)med, idx) => (
                => (
                <div key <div key={idx={idx} className} className="grid="grid grid-c grid-cols-ols-4 gap4 gap-2 mb--2 mb-2">
                 2">
                  <input placeholder <input placeholder="Name="Name" value" value={med.name}={med.name} onChange={e => onChange={e => updateMedicine(idx, updateMedicine(idx, "name "name", e", e.target.value.target.value)} className)} className="border="border rounded p rounded p-1"-1" />
                  />
                  <input placeholder <input placeholder="Dosage="Dosage" value" value={med={med.dosage} onChange={.dosage} onChange={e =>e => updateMedicine updateMedicine(idx,(idx, "dos "dosage",age", e.target e.target.value)} className=".value)} className="border roundedborder rounded p- p-1" />
                 1" />
                  <input <input placeholder=" placeholder="Frequency"Frequency" value={med.f value={med.frequency}requency} onChange={ onChange={e =>e => updateMedicine updateMedicine(idx,(idx, "frequency "frequency", e", e.target.value)} className.target.value)} className="border="border rounded p-1 rounded p-1"" />
                  />
                  <div className=" <div className="flex gap-1flex gap-1">
                   ">
                    <input placeholder=" <input placeholder="Duration"Duration" value={med.d value={med.duration}uration} onChange={e => onChange={e => updateMedicine updateMedicine(idx, "duration(idx, "duration", e.target.value", e.target.value)} className="border)} className="border rounded p-1 rounded p-1 flex- flex-1"1" />
                    />
                    <button <button type="button" type="button" onClick={() onClick={() => remove => removeMedicine(idxMedicine(idx)} className)} className="text="text-red-500-red-500"><Trash"><Trash2 size2 size={16} /></={16} /></button>
                  </button>
                  </divdiv>
                </>
                </divdiv>
              ))}
             >
              ))}
              <button type <button type="button="button" onClick" onClick={add={addMedicine} className="textMedicine} className="text-[#1a237-[#1a237e] text-sme] text-sm flex items flex items-center gap-center gap-1"><Plus size={-1"><Plus size={14}14} /> Add /> Add Medicine</ Medicine</buttonbutton>
            </div>
            </div>
           >
            <div <div>
              <label className>
              <label className="block="block text-sm font-medium text-sm font-medium mb- mb-1">1">Tests</label>
             Tests</label>
              <input type="text <input type="text" placeholder="Com" placeholder="Comma separatedma separated" value" value={tests={tests.join(", ")}.join(", ")} onChange={e => onChange={e => setTests setTests(e.target(e.target.value.split.value.split(",").map(s(",").map(s => s.trim())) => s.trim()))} className} className="w="w-full border-full border rounded-lg rounded-lg p-2" p-2" />
            />
            </div </div>
           >
            <div <div>
              <label>
              <label className="block text className="block text-sm font-medium mb-sm font-medium mb-1-1">Advice</">Advice</labellabel>
              <textarea value>
              <textarea value={adv={advice}ice} onChange={e => onChange={e => setAdv setAdvice(e.target.valueice(e.target.value)} className)} className="w-full border="w-full border rounded-lg rounded-lg p-2" rows={ p-2" rows={22}} />
            </div />
            </>
           div>
            <div className <div className="flex="flex justify-end gap- justify-end gap-22">
             ">
              <button type="button <button type="button" onClick={on" onClick={onClose}Close} className="px- className="px-4 py4 py-2-2 border rounded-lg"> border rounded-lg">Cancel</Cancel</button>
             button>
              <button type="submit <button type="submit" disabled={loading" disabled={loading} className="px} className="px-4-4 py- py-2 bg-[#2 bg-[#1a237e1a237e] text] text-white rounded-white rounded-lg flex-lg flex items-center items-center gap- gap-2">{2">{loading && <Loaderloading && <Loader2 className="animate2 className="animate-spin" size-spin" size={16={16} />} />} Save</button>
           } Save</button>
            </div </div>
         >
          </form </form>
       >
        </div </div>
      </div>
      </div>
   >
    </div </div>
 >
  );
 );
}