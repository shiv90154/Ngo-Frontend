"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { educationAPI } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";

export default function NewLiveClassPage() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState({ title: "", description: "", startTime: "", endTime: "", maxParticipants: "100" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await educationAPI.createLiveClass({ courseId: id, ...form, maxParticipants: Number(form.maxParticipants) });
      toast.success("Live class scheduled");
      router.push(`/education/instructor/courses/${id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to schedule");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <h1 className="text-2xl font-bold mb-6">Schedule Live Class</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full border rounded-lg p-2.5" required />
          <textarea placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full border rounded-lg p-2.5" rows={2} />
          <input type="datetime-local" value={form.startTime} onChange={e => setForm({...form, startTime: e.target.value})} className="w-full border rounded-lg p-2.5" required />
          <input type="datetime-local" value={form.endTime} onChange={e => setForm({...form, endTime: e.target.value})} className="w-full border rounded-lg p-2.5" required />
          <input type="number" placeholder="Max Participants" value={form.maxParticipants} onChange={e => setForm({...form, maxParticipants: e.target.value})} className="w-full border rounded-lg p-2.5" />
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => router.back()} className="px-4 py-2 border rounded-lg">Cancel</button>
            <button type="submit" disabled={loading} className="px-6 py-2 bg-[#1a237e] text-white rounded-lg flex items-center gap-2">
              {loading && <Loader2 className="animate-spin" size={16} />}
              Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}