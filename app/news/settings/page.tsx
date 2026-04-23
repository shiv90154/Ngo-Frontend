"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { authAPI } from "@/lib/api";
import {
  Camera,
  Loader2,
  Save,
  User,
  Mail,
  Phone,
  FileText,
  AtSign,
  ArrowLeft,
} from "lucide-react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    username: "",
    bio: "",
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        username: user.socialProfile?.username || "",
        bio: user.mediaCreatorProfile?.bio || "",
      });
      if (user.profileImage) {
        setProfileImagePreview(user.profileImage);
      }
    }
    setLoading(false);
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("fullName", formData.fullName);
      fd.append("phone", formData.phone);
      fd.append("username", formData.username);
      fd.append("mediaBio", formData.bio);
      if (profileImage) {
        fd.append("profileImage", profileImage);
      }
      const res = await authAPI.updateProfile(fd);
      setUser(res.data.user);
      toast.success("Profile updated! 🎉");
      router.push(`/news/profile/${user?._id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  // ---------- Loading Skeleton ----------
  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
        <div className="h-10 w-48 bg-slate-200/70 rounded-full animate-pulse mb-6" />
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl ring-1 ring-slate-900/5 overflow-hidden animate-pulse">
          <div className="h-48 bg-slate-100 flex items-center justify-center">
            <div className="w-24 h-24 bg-slate-200 rounded-full" />
          </div>
          <div className="p-8 space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-14 bg-slate-100 rounded-2xl" />
            ))}
            <div className="h-24 bg-slate-100 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 pb-20 space-y-8">
      {/* Back Button + Title */}
      <div className="flex flex-col gap-2 mt-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors group self-start"
        >
          <motion.div whileHover={{ x: -3 }} transition={{ type: "spring", stiffness: 300 }}>
            <ArrowLeft className="w-4 h-4" />
          </motion.div>
          <span className="text-xs font-semibold uppercase tracking-wider">Back</span>
        </button>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Account Settings</h1>
      </div>

      {/* Main Card – glass surface */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white/70 backdrop-blur-xl rounded-2xl ring-1 ring-slate-900/5 shadow-sm overflow-hidden"
      >
        <form onSubmit={handleSubmit}>
          {/* Avatar Section */}
          <div className="p-8 flex flex-col items-center gap-4 bg-slate-50/50 border-b border-slate-100">
            <div className="relative group">
              <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-white shadow-lg bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center text-indigo-700 text-4xl font-bold">
                {profileImagePreview ? (
                  <img
                    src={profileImagePreview}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  user?.fullName?.charAt(0) || "?"
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 bg-white p-2.5 rounded-xl shadow-md ring-1 ring-slate-200 text-indigo-600 hover:scale-110 transition-transform active:scale-95"
              >
                <Camera className="w-5 h-5" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-900">Profile Photo</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Recommended: 400×400px
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="p-8 space-y-5">
            {/* Full Name + Username */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 ml-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 rounded-xl text-sm font-medium ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all outline-none"
                    required
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 ml-1">
                  Handle
                </label>
                <div className="relative">
                  <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 rounded-xl text-sm font-medium ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Email (read-only) */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 ml-1 flex items-center gap-2">
                Email{" "}
                <span className="text-[10px] bg-green-50 text-green-600 px-1.5 py-0.5 rounded-full font-semibold">
                  Verified
                </span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-100 rounded-xl text-sm font-medium cursor-not-allowed opacity-60"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 ml-1">
                Phone
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 rounded-xl text-sm font-medium ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all outline-none"
                />
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 ml-1">
                Bio
              </label>
              <div className="relative">
                <FileText className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 rounded-xl text-sm font-medium ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all outline-none resize-none"
                  placeholder="Share a bit about yourself..."
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-8 border-t border-slate-100 flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2.5 rounded-full text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={saving}
              className="group inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-800 text-white text-sm font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Changes
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}