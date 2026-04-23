// app/news/create/page.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { mediaAPI } from "@/lib/api";
import {
  ImagePlus,
  X,
  Loader2,
  MapPin,
  Hash,
  Send,
  ChevronLeft,
} from "lucide-react";
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

  // Cleanup object URLs
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
    <div className="max-w-2xl mx-auto px-4 pb-20 space-y-6">
      {/* Back button – glass, subtle hover */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors group mt-6"
      >
        <motion.div
          whileHover={{ x: -3 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.div>
        <span className="font-semibold text-sm">Back to Feed</span>
      </motion.button>

      {/* Main Card – glass effect */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl ring-1 ring-slate-900/5 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">
            Create New Post
          </h1>
          <div
            className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
              content.length > 280
                ? "bg-rose-50 text-rose-600"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            {content.length}/500
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Content Textarea */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share what's happening..."
            rows={5}
            maxLength={500}
            className="w-full text-lg text-slate-800 placeholder:text-slate-400 bg-transparent border-none focus:ring-0 resize-none p-0 font-medium leading-relaxed"
          />

          {/* Media preview grid with animations */}
          <AnimatePresence mode="popLayout">
            {mediaPreviews.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 sm:grid-cols-3 gap-3"
              >
                {mediaPreviews.map((preview, idx) => (
                  <motion.div
                    layout
                    key={preview}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="relative group aspect-square rounded-xl overflow-hidden ring-1 ring-slate-200/80 bg-slate-100"
                  >
                    {mediaFiles[idx]?.type.startsWith("image/") ? (
                      <img
                        src={preview}
                        alt=""
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <video
                        src={preview}
                        className="w-full h-full object-cover"
                        muted
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => removeMedia(idx)}
                      className="absolute top-2 right-2 bg-black/40 backdrop-blur-md hover:bg-black/80 text-white p-1.5 rounded-full transition-colors shadow-md"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Location & Tags – glass input fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative group">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Add location"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 rounded-xl text-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all outline-none placeholder:text-slate-400"
              />
            </div>
            <div className="relative group">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Tags (comma separated)"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 rounded-xl text-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Upload Dropzone – refined */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="group border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/40 transition-all"
          >
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm ring-1 ring-slate-200 group-hover:ring-indigo-200 group-hover:scale-110 transition-transform">
              <ImagePlus className="w-6 h-6 text-slate-400 group-hover:text-indigo-600 transition-colors" />
            </div>
            <p className="text-sm font-semibold text-slate-600 group-hover:text-indigo-800 transition-colors">
              Add Photos or Video
            </p>
            <p className="text-xs text-slate-400 mt-1">
              You can upload up to 10 files
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />

          {/* Submit Button */}
          <div className="flex justify-end pt-4 border-t border-slate-100">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white px-8 py-3 rounded-full font-semibold text-sm
                         shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {loading ? "Publishing..." : "Post Now"}
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
}