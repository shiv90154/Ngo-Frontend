// components/news/ProfileHeader.tsx
"use client";

import Link from "next/link";
import { Settings, MapPin, Calendar } from "lucide-react";
import FollowButton from "./FollowButton";

interface ProfileHeaderProps {
  user: any;
  isOwnProfile: boolean;
  postsCount: number;
}

export default function ProfileHeader({ user, isOwnProfile, postsCount }: ProfileHeaderProps) {
  // 安全获取用户名
  const username = user?.socialProfile?.username || user?.email?.split("@")[0] || "user";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="h-32 bg-gradient-to-r from-[#1a237e] via-[#283593] to-[#1a237e]" />
      <div className="px-6 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-10">
          <div className="flex items-end gap-5">
            <div className="relative">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white shadow-md bg-gradient-to-br from-[#1a237e] to-[#283593] flex items-center justify-center text-white text-4xl font-bold">
                {user?.fullName?.charAt(0) || "U"}
              </div>
            </div>
            <div className="mb-2">
              <h1 className="text-2xl font-bold text-gray-800">{user?.fullName}</h1>
              <p className="text-gray-500">@{username}</p>
              {user?.mediaCreatorProfile?.bio && (
                <p className="text-gray-700 mt-2">{user.mediaCreatorProfile.bio}</p>
              )}
              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                {user?.state && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> {user.state}, {user.district}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> Joined {new Date(user?.createdAt).getFullYear()}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:mb-2">
            {isOwnProfile ? (
              <Link
                href="/news/settings"
                className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full text-sm font-medium transition"
              >
                Edit Profile
              </Link>
            ) : (
              <FollowButton userId={user?._id} />
            )}
          </div>
        </div>
        <div className="flex gap-8 mt-6 text-sm border-t border-gray-100 pt-4">
          <Link href={`/news/followers/${user?._id}`} className="hover:text-[#1a237e]">
            <span className="font-bold text-gray-800">{user?.mediaCreatorProfile?.totalFollowers || 0}</span>
            <span className="text-gray-500 ml-1">followers</span>
          </Link>
          <Link href={`/news/following/${user?._id}`} className="hover:text-[#1a237e]">
            <span className="font-bold text-gray-800">{user?.mediaCreatorProfile?.totalFollowing || 0}</span>
            <span className="text-gray-500 ml-1">following</span>
          </Link>
          <div>
            <span className="font-bold text-gray-800">{postsCount}</span>
            <span className="text-gray-500 ml-1">posts</span>
          </div>
        </div>
      </div>
    </div>
  );
}