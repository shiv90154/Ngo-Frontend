"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { mediaAPI } from "@/lib/api";
import PostCard from "@/components/news/PostCard";
import FollowButton from "@/components/news/FollowButton";
import { Loader2, Settings, Image, Grid3x3 } from "lucide-react";
import { toast } from "react-toastify";

export default function ProfilePage() {
  const params = useParams();
  const { user: currentUser } = useAuth();
  const userId = params.userId as string;

  const [profileUser, setProfileUser] = useState<any>(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"posts" | "media">("posts");
  const [isFollowing, setIsFollowing] = useState(false);

  const isOwnProfile = currentUser?._id === userId;

  useEffect(() => {
    if (userId) {
      fetchAllData();
    }
  }, [userId]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [postsRes, followStatusRes] = await Promise.allSettled([
        mediaAPI.getUserPosts(userId, { limit: 30 }),
        isOwnProfile ? Promise.resolve(null) : mediaAPI.checkFollowStatus(userId),
      ]);

      let fetchedPosts = [];
      if (postsRes.status === "fulfilled") {
        fetchedPosts = postsRes.value.data.posts;
        setPosts(fetchedPosts);
      }

      let userInfo = null;
      if (fetchedPosts.length > 0) {
        userInfo = fetchedPosts[0].author;
      } else if (isOwnProfile && currentUser) {
        userInfo = currentUser;
      } else {
        userInfo = {
          _id: userId,
          fullName: "User",
          email: "",
          mediaCreatorProfile: { totalPosts: 0, totalFollowers: 0, totalFollowing: 0 },
        };
      }

      setProfileUser(userInfo);

      if (followStatusRes.status === "fulfilled" && followStatusRes.value) {
        setIsFollowing(followStatusRes.value.data.isFollowing);
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      toast.error("Could not load profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePostUpdate = (postId: string, updatedData: any) => {
    setPosts((prev) =>
      prev.map((p: any) => (p._id === postId ? { ...p, ...updatedData } : p))
    );
  };

  const handlePostDelete = (postId: string) => {
    setPosts((prev) => prev.filter((p: any) => p._id !== postId));
    setProfileUser((prev: any) => ({
      ...prev,
      mediaCreatorProfile: {
        ...prev.mediaCreatorProfile,
        totalPosts: Math.max(0, (prev.mediaCreatorProfile?.totalPosts || 0) - 1),
      },
    }));
  };

  const filteredPosts = activeTab === "media"
    ? posts.filter((post: any) => post.media && post.media.length > 0)
    : posts;

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
          <div className="h-24 bg-gradient-to-r from-[#1a237e]/20 to-[#283593]/20"></div>
          <div className="p-6 -mt-12">
            <div className="flex items-end gap-4">
              <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-6 w-32 bg-gray-200 rounded"></div>
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <Loader2 className="animate-spin h-6 w-6 text-[#1a237e]" />
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="max-w-3xl mx-auto text-center py-12">
        <p className="text-gray-500">User not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-[#1a237e] to-[#283593]"></div>
        <div className="p-6 -mt-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="flex items-end gap-4">
              <div className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center text-3xl font-bold text-[#1a237e]">
                {profileUser.fullName?.charAt(0) || "U"}
              </div>
              <div className="mb-2">
                <h1 className="text-2xl font-bold text-gray-800">{profileUser.fullName}</h1>
                <p className="text-gray-500">@{profileUser.email?.split("@")[0] || "user"}</p>
                {profileUser.mediaCreatorProfile?.bio && (
                  <p className="text-sm text-gray-600 mt-1">{profileUser.mediaCreatorProfile.bio}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isOwnProfile ? (
                <Link
                  href="/settings"
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" /> Edit Profile
                </Link>
              ) : (
                <FollowButton userId={userId} initialIsFollowing={isFollowing} />
              )}
            </div>
          </div>

          <div className="flex gap-6 mt-6 text-sm">
            <span className="font-medium">
              <span className="font-bold">{posts.length}</span> posts
            </span>
            <Link
              href={`/news/followers/${userId}`}
              className="font-medium hover:text-[#1a237e]"
            >
              <span className="font-bold">{profileUser.mediaCreatorProfile?.totalFollowers || 0}</span> followers
            </Link>
            <Link
              href={`/news/following/${userId}`}
              className="font-medium hover:text-[#1a237e]"
            >
              <span className="font-bold">{profileUser.mediaCreatorProfile?.totalFollowing || 0}</span> following
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200 px-5 flex gap-6">
          <button
            onClick={() => setActiveTab("posts")}
            className={`py-3 text-sm font-medium border-b-2 transition flex items-center gap-2 ${
              activeTab === "posts"
                ? "border-[#1a237e] text-[#1a237e]"
                : "border-transparent text-gray-500 hover:text-[#1a237e]"
            }`}
          >
            <Grid3x3 className="w-4 h-4" /> Posts
          </button>
          <button
            onClick={() => setActiveTab("media")}
            className={`py-3 text-sm font-medium border-b-2 transition flex items-center gap-2 ${
              activeTab === "media"
                ? "border-[#1a237e] text-[#1a237e]"
                : "border-transparent text-gray-500 hover:text-[#1a237e]"
            }`}
          >
            <Image className="w-4 h-4" /> Media
          </button>
        </div>

        <div className="p-4">
          {filteredPosts.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              {activeTab === "media" ? "No media posts yet." : "No posts yet."}
            </p>
          ) : (
            <div className="space-y-4">
              {filteredPosts.map((post: any) => (
                <PostCard
                  key={post._id}
                  post={post}
                  onUpdate={handlePostUpdate}
                  onDelete={handlePostDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}