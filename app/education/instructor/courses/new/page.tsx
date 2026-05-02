"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { educationAPI } from "@/lib/api";
import { Loader2, Upload, X } from "lucide-react";
import { toast } from "react-toastify";

// ---------- Media URL helper ----------
const MEDIA_BASE_URL = process.env.NEXT_PUBLIC_MEDIA_URL || "http://localhost:5000";
export const getMediaUrl = (url: string) => {
  if (!url) return "";
  return url.startsWith("http") ? url : `${MEDIA_BASE_URL}${url}`;
};
// ------------------------------------

const categories = ["UPSC", "Banking", "Agriculture", "School", "Skill", "Technology"];

export default function CreateCoursePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "UPSC",
    language: "English",
  });
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("price", form.price || "0");
      fd.append("category", form.category);
      fd.append("language", form.language);
      if (thumbnail) fd.append("thumbnail", thumbnail);

      await educationAPI.createCourse(fd);
      toast.success("Course created!");
      router.push("/education/instructor/courses");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Create New Course</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input name="title" value={form.title} onChange={handleChange} className="w-full border rounded-lg p-2.5 text-sm" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="w-full border rounded-lg p-2.5 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
              <input name="price" type="number" value={form.price} onChange={handleChange} className="w-full border rounded-lg p-2.5 text-sm" placeholder="0 = Free" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select name="category" value={form.category} onChange={handleChange} className="w-full border rounded-lg p-2.5 text-sm">
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
            <select name="language" value={form.language} onChange={handleChange} className="w-full border rounded-lg p-2.5 text-sm">
              <option>English</option><option>Hindi</option><option>Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail</label>
            <div className="flex items-center gap-4">
              {preview ? (
                <div className="relative">
                  <img src={preview} alt="" className="w-24 h-16 object-cover rounded-lg" />
                  <button type="button" onClick={() => { setThumbnail(null); setPreview(""); }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"><X size={14} /></button>
                </div>
              ) : null}
              <button type="button" onClick={() => fileRef.current?.click()} className="flex items-center gap-2 border rounded-lg px-4 py-2 text-sm hover:bg-gray-50">
                <Upload size={16} /> Choose Image
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => router.back()} className="px-4 py-2 border rounded-lg">Cancel</button>
            <button type="submit" disabled={loading} className="px-6 py-2 bg-[#1a237e] text-white rounded-lg flex items-center gap-2">
              {loading && <Loader2 className="animate-spin" size={16} />}
              Create Course
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}