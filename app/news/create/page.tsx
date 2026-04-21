// app/news/create/page.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { mediaAPI } from "@/lib/api";
import { ImagePlus, X, Loader2, MapPin, Hash, Send, ChevronLeft } from "lucide-react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

export default function CreatePostPage() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [location, setLocation] = useState("");
  const [tags, setTags] = useState("");
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + mediaFiles.length > 10) {
      toast.error("Maximum 10 files allowed");
      return;
    }
    setMediaFiles((prev) => [...prev, ...files]);
    const newPreviews = files.map((f) => URL.createObjectURL(f));
    setMediaPreviews((prev) => [...prev, ...newPreviews]);
  };

  // Cleanup URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      mediaPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [mediaPreviews]);

  const removeMedia = (index: number) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
    setMediaPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && mediaFiles.length === 0) {
      toast.error("Please add content or media");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("content", content);
      if (location) formData.append("location", location);
      if (tags) formData.append("tags", tags);
      mediaFiles.forEach((file) => formData.append("media", file));
      
      await mediaAPI.createPost(formData);
      toast.success("Post published successfully!");
      router.push("/news");
      router.refresh();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto pb-10">
      {/* Back Button */}
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-6 group"
      >
        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-bold text-sm">Back to Feed</span>
      </button>

      <div className="bg-white rounded-3xl shadow-sm ring-1 ring-slate-900/5 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
          <h1 className="text-lg font-black text-slate-900">Create New Post</h1>
          <div className="flex items-center gap-2">
             <span className={`text-[11px] font-bold px-2 py-1 rounded-md ${content.length > 280 ? 'bg-red-50 text-red-500' : 'bg-slate-100 text-slate-500'}`}>
               {content.length}/500
             </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Text Area */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share what's happening..."
            rows={5}
            className="w-full text-lg text-slate-800 placeholder:text-slate-400 border-none focus:ring-0 resize-none p-0"
          />

          {/* Media Preview Grid */}
          <AnimatePresence>
            {mediaPreviews.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 sm:grid-cols-3 gap-3"
              >
                {mediaPreviews.map((preview, idx) => (
                  <motion.div 
                    layout
                    key={preview} 
                    className="relative group aspect-square rounded-2xl overflow-hidden ring-1 ring-slate-900/10"
                  >
                    {mediaFiles[idx]?.type.startsWith("image/") ? (
                      <img src={preview} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <video src={preview} className="w-full h-full object-cover" />
                    )}
                    <button
                      type="button"
                      onClick={() => removeMedia(idx)}
                      className="absolute top-2 right-2 bg-black/60 hover:bg-black text-white p-1.5 rounded-full backdrop-blur-md transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Location & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative group">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#1a237e] transition-colors" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Add location"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-100 transition-all"
              />
            </div>
            <div className="relative group">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#1a237e] transition-colors" />
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Tags (comma separated)"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-100 transition-all"
              />
            </div>
          </div>

          {/* Upload Dropzone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="group border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center cursor-pointer hover:border-[#1a237e] hover:bg-indigo-50/30 transition-all"
          >
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 group-hover:bg-white transition-all shadow-sm">
              <ImagePlus className="w-6 h-6 text-slate-400 group-hover:text-[#1a237e]" />
            </div>
            <p className="text-sm font-bold text-slate-600 group-hover:text-slate-900">Add Photos or Video</p>
            <p className="text-xs text-slate-400 mt-1">You can upload up to 10 files</p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />

          <div className="flex justify-end pt-4 border-t border-slate-50">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-[#1a237e] hover:bg-[#0d1440] text-white rounded-full font-black text-sm flex items-center gap-2 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50 active:scale-95"
            >
              {loading ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {loading ? "Publishing..." : "Post Now"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}