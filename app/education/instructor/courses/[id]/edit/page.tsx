"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { educationAPI } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";

export default function EditCoursePage() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState({ title: "", description: "", price: "", category: "", language: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    educationAPI.getCourseDetails(id as string).then(res => {
      const c = res.data.course;
      setForm({ title: c.title, description: c.description || "", price: String(c.price || ""), category: c.category, language: c.language || "English" });
    }).finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await educationAPI.updateCourse(id as string, { ...form, price: Number(form.price) });
      toast.success("Course updated");
      router.push(`/education/instructor/courses/${id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <h1 className="text-2xl font-bold mb-6">Edit Course</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full border rounded-lg p-2.5" required />
          <textarea name="description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} className="w-full border rounded-lg p-2.5" />
          <input name="price" type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full border rounded-lg p-2.5" />
          <select name="category" value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full border rounded-lg p-2.5">
            <option>UPSC</option><option>Banking</option><option>Agriculture</option><option>School</option><option>Skill</option><option>Technology</option>
          </select>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => router.back()} className="px-4 py-2 border rounded-lg">Cancel</button>
            <button type="submit" disabled={saving} className="px-6 py-2 bg-[#1a237e] text-white rounded-lg">{saving ? "Saving..." : "Save"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}