// components/news/ProfileHeader.tsx
"use client";

import Link from "next/link";
import { Settings, MapPin, Calendar, Edit3 } from "lucide-react";
import FollowButton from "./FollowButton";
import { motion } from "framer-motion";

interface ProfileHeaderProps {
  user: any;
  isOwnProfile: boolean;
  postsCount: number;
}

export default function ProfileHeader({ user, isOwnProfile, postsCount }: ProfileHeaderProps) {
  const username = user.socialProfile?.username || user.email?.split("@")[0];

  return (
    <div className="bg-white rounded-3xl shadow-sm ring-1 ring-slate-900/5 overflow-hidden mb-6">
      {/* Banner */}
      <div className="h-32 sm:h-40 bg-gradient-to-r from-[#1a237e] via-[#283593] to-[#3949ab] relative">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
      </div>

      <div className="px-5 sm:px-8 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-16 relative z-10">
          {/* Avatar and Name Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 sm:gap-6">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative"
            >
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl border-[6px] border-white shadow-xl bg-gradient-to-br from-[#1a237e] to-[#283593] flex items-center justify-center text-white text-4xl sm:text-5xl font-bold overflow-hidden">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.fullName} className="w-full h-full object-cover" />
                ) : (
                  user.fullName?.charAt(0)
                )}
              </div>
            </motion.div>

            <div className="mb-1">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {user.fullName}
              </h1>
              <p className="text-slate-500 font-medium">@{username}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 sm:mb-2">
            {isOwnProfile ? (
              <Link
                href="/news/settings"
                className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-sm font-bold transition-all shadow-sm hover:shadow-md active:scale-95"
              >
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </Link>
            ) : (
              <FollowButton userId={user._id} />
            )}
            {isOwnProfile && (
               <Link
               href="/news/settings"
               className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors"
             >
               <Settings className="w-5 h-5" />
             </Link>
            )}
          </div>
        </div>

        {/* Bio & Metadata */}
        <div className="mt-6 max-w-2xl">
          {user.mediaCreatorProfile?.bio ? (
            <p className="text-slate-700 leading-relaxed font-medium">
              {user.mediaCreatorProfile.bio}
            </p>
          ) : (
            <p className="text-slate-400 italic text-sm">No bio added yet.</p>
          )}

          <div className="flex flex-wrap items-center gap-y-2 gap-x-5 mt-4 text-[13px] font-semibold text-slate-500">
            {user.state && (
              <span className="flex items-center gap-1.5 py-1 px-3 bg-slate-50 rounded-lg ring-1 ring-slate-200/50">
                <MapPin className="w-3.5 h-3.5 text-[#1a237e]" /> 
                {user.district}, {user.state}
              </span>
            )}
            <span className="flex items-center gap-1.5 py-1 px-3 bg-slate-50 rounded-lg ring-1 ring-slate-200/50">
              <Calendar className="w-3.5 h-3.5 text-[#1a237e]" /> 
              Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex gap-8 mt-8 border-t border-slate-100 pt-6">
          <Link href={`/news/followers/${user._id}`} className="group">
            <div className="flex flex-col">
              <span className="text-lg font-black text-slate-900 group-hover:text-[#1a237e] transition-colors">
                {user.mediaCreatorProfile?.totalFollowers || 0}
              </span>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Followers</span>
            </div>
          </Link>
          
          <Link href={`/news/following/${user._id}`} className="group">
            <div className="flex flex-col">
              <span className="text-lg font-black text-slate-900 group-hover:text-[#1a237e] transition-colors">
                {user.mediaCreatorProfile?.totalFollowing || 0}
              </span>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Following</span>
            </div>
          </Link>

          <div className="flex flex-col">
            <span className="text-lg font-black text-slate-900">
              {postsCount}
            </span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Posts</span>
          </div>
        </div>
      </div>
    </div>
  );
}