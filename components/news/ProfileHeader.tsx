// components/news/ProfileHeader.tsx
"use client";

import Link from "next/link";
import { Settings, MapPin, Calendar } from "lucide-react";
import FollowButton from "./FollowButton";
import { motion } from "framer-motion";

interface UserProfile {
  _id: string;
  fullName?: string;
  email?: string;
  profileImage?: string;                 // ✅ added
  socialProfile?: { username?: string };
  mediaCreatorProfile?: {
    bio?: string;
    totalFollowers?: number;
    totalFollowing?: number;
  };
  state?: string;
  district?: string;
  createdAt?: string;
}

interface ProfileHeaderProps {
  user: UserProfile;
  isOwnProfile: boolean;
  postsCount: number;
}

const BASE_URL = "http://localhost:5000";   // or process.env.NEXT_PUBLIC_API_URL

const getMediaUrl = (url: string) => {
  if (!url) return "";
  return url.startsWith("http") ? url : `${BASE_URL}${url}`;
};

export default function ProfileHeader({ user, isOwnProfile, postsCount }: ProfileHeaderProps) {
  const username = user?.socialProfile?.username || user?.email?.split("@")[0] || "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative bg-white/70 backdrop-blur-xl rounded-2xl ring-1 ring-slate-900/5 shadow-sm overflow-hidden"
    >
      {/* Gradient Banner */}
      <div className="h-32 bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800" />

      <div className="px-6 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12">
          <div className="flex items-end gap-5">
            <motion.div whileHover={{ scale: 1.03 }} className="relative shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full ring-4 ring-white shadow-lg bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center text-indigo-700 text-3xl sm:text-4xl font-bold overflow-hidden">
                {user.profileImage ? (
                  <img
                    src={getMediaUrl(user.profileImage)}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  user.fullName?.charAt(0) || "U"
                )}
              </div>
              <div className="absolute inset-0 rounded-full ring-1 ring-slate-900/5" />
            </motion.div>

            <div className="mb-1.5">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                {user.fullName}
              </h1>
              <p className="text-sm text-slate-500 font-medium">@{username}</p>

              {user.mediaCreatorProfile?.bio && (
                <p className="text-slate-700 text-sm leading-relaxed mt-2 max-w-md">
                  {user.mediaCreatorProfile.bio}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-500">
                {user.state && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {user.state}{user.district ? `, ${user.district}` : ""}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Joined {new Date(user.createdAt!).getFullYear()}
                </span>
              </div>
            </div>
          </div>

          <div className="sm:mb-2">
            {isOwnProfile ? (
              <Link
                href="/news/settings"
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold bg-white ring-1 ring-slate-200 text-slate-700 
                         hover:ring-slate-300 hover:bg-slate-50 transition-all"
              >
                <Settings className="w-4 h-4" />
                Edit Profile
              </Link>
            ) : (
              <FollowButton userId={user._id} />
            )}
          </div>
        </div>

        <div className="flex gap-8 mt-6 pt-5 border-t border-slate-100 text-sm">
          <Link href={`/news/followers/${user._id}`} className="hover:text-indigo-700 transition-colors group">
            <span className="font-bold text-slate-800">{user.mediaCreatorProfile?.totalFollowers || 0}</span>
            <span className="text-slate-500 ml-1.5 group-hover:text-indigo-600">followers</span>
          </Link>
          <Link href={`/news/following/${user._id}`} className="hover:text-indigo-700 transition-colors group">
            <span className="font-bold text-slate-800">{user.mediaCreatorProfile?.totalFollowing || 0}</span>
            <span className="text-slate-500 ml-1.5 group-hover:text-indigo-600">following</span>
          </Link>
          <div>
            <span className="font-bold text-slate-800">{postsCount}</span>
            <span className="text-slate-500 ml-1.5">posts</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}