// app/settings/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { authAPI } from "@/lib/api";
import { Camera, Loader2, Save, User, Mail, Phone, FileText, AtSign, ArrowLeft } from "lucide-react";
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
      toast.success("Profile updated!");
      router.push(`/news/profile/${user?._id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="animate-spin h-10 w-10 text-[#1a237e]" />
        <p className="text-xs font-black uppercase tracking-widest text-slate-400">Syncing Profile</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto pb-20 px-4">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-400 hover:text-slate-900 mb-2 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-widest">Back</span>
          </button>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Account Settings</h1>
        </div>
      </header>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2rem] shadow-sm ring-1 ring-slate-900/5 overflow-hidden"
      >
        <form onSubmit={handleSubmit}>
          {/* Avatar Header */}
          <div className="p-8 bg-slate-50 border-b border-slate-100 flex flex-col items-center gap-4">
            <div className="relative group">
              <div className="w-28 h-28 rounded-[2rem] overflow-hidden bg-white ring-4 ring-white shadow-xl">
                {profileImagePreview ? (
                  <img src={profileImagePreview} className="w-full h-full object-cover" alt="" />
                ) : (
                  <div className="w-full h-full bg-[#1a237e] flex items-center justify-center text-white text-4xl font-black">
                    {user?.fullName?.charAt(0)}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 bg-white p-3 rounded-2xl shadow-lg border border-slate-100 text-[#1a237e] hover:scale-110 transition-transform active:scale-95"
              >
                <Camera className="w-5 h-5" />
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-slate-900">Profile Image</p>
              <p className="text-xs text-slate-400 mt-1">Recommended: Square 400x400px</p>
            </div>
          </div>

          <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-100"
                    required
                  />
                </div>
              </div>

              {/* Username */}
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Handle</label>
                <div className="relative">
                  <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-100"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Email - Locked */}
            <div className="space-y-1.5 opacity-60">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                Email Address <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded uppercase">Verified</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full pl-11 pr-4 py-3 bg-slate-100 border-none rounded-2xl text-sm font-medium cursor-not-allowed"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Phone</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Public Bio</label>
              <div className="relative">
                <FileText className="absolute left-4 top-4 text-slate-300 w-4 h-4" />
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-100 resize-none"
                  placeholder="Share a bit about yourself..."
                />
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-8 py-3 bg-[#1a237e] text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-[#0d1440] transition-all active:scale-95 disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Changes
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}