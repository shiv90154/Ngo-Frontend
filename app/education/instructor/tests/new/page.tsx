"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { educationAPI } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";

export default function CreateTestPage() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId") || "";
  const router = useRouter();
  const [form, setForm] = useState({ title: "", description: "", duration: "30", totalMarks: "100", passingMarks: "40" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await educationAPI.createTest({
        courseId,
        ...form,
        duration: Number(form.duration),
        totalMarks: Number(form.totalMarks),
        passingMarks: Number(form.passingMarks),
      });
      toast.success("Test created");
      router.push(`/education/instructor/courses/${courseId}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Create failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <h1 className="text-2xl font-bold mb-6">Create Test</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input placeholder="Test Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full border rounded-lg p-2.5" required />
          <textarea placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full border rounded-lg p-2.5" rows={2} />
          <div className="grid grid-cols-3 gap-4">
            <input type="number" placeholder="Duration (min)" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} className="w-full border rounded-lg p-2.5" required />
            <input type="number" placeholder="Total Marks" value={form.totalMarks} onChange={e => setForm({...form, totalMarks: e.target.value})} className="w-full border rounded-lg p-2.5" required />
            <input type="number" placeholder="Passing Marks" value={form.passingMarks} onChange={e => setForm({...form, passingMarks: e.target.value})} className="w-full border rounded-lg p-2.5" required />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => router.back()} className="px-4 py-2 border rounded-lg">Cancel</button>
            <button type="submit" disabled={loading} className="px-6 py-2 bg-[#1a237e] text-white rounded-lg flex items-center gap-2">
              {loading && <Loader2 className="animate-spin" size={16} />}
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}