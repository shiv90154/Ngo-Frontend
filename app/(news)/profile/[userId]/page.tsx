// app/(news)/profile/[userId]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { mediaAPI } from "@/lib/api";
import PostCard from "@/components/news/PostCard";
import FollowButton from "@/components/news/FollowButton";
import { Loader2, MapPin, Calendar, Settings } from "lucide-react";
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
    fetchProfileAndPosts();
    if (!isOwnProfile) {
      checkFollowStatus();
    }
  }, [userId]);

  const fetchProfileAndPosts = async () => {
    setLoading(true);
    try {
      // Fetch user's posts
      const postsRes = await mediaAPI.getUserPosts(userId, { limit: 20 });
      setPosts(postsRes.data.posts);

      // If posts exist, get user info from the first post's author
      if (postsRes.data.posts.length > 0) {
        setProfileUser(postsRes.data.posts[0].author);
      } else {
        // Fallback: try to get user info from followers endpoint (will have basic info)
        try {
          const followersRes = await mediaAPI.getFollowers(userId, { limit: 1 });
          // This is a workaround; ideally we'd have a dedicated /users/:id endpoint
          if (followersRes.data.followers) {
            // Still need full user; you might want to call an admin endpoint if needed
          }
        } catch (e) {
          console.warn("Could not fetch profile details");
        }
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      toast.error("Could not load profile");
    } finally {
      setLoading(false);
    }
  };

  const checkFollowStatus = async () => {
    try {
      const res = await mediaAPI.checkFollowStatus(userId);
      setIsFollowing(res.data.isFollowing);
    } catch (error) {
      console.error("Failed to check follow status:", error);
    }
  };

  const handlePostUpdate = (postId: string, updatedData: any) => {
    setPosts((prev) =>
      prev.map((p: any) => (p._id === postId ? { ...p, ...updatedData } : p))
    );
  };

  const handlePostDelete = (postId: string) => {
    setPosts((prev) => prev.filter((p: any) => p._id !== postId));
    if (profileUser) {
      setProfileUser((prev: any) => ({
        ...prev,
        mediaCreatorProfile: {
          ...prev.mediaCreatorProfile,
          totalPosts: Math.max(0, (prev.mediaCreatorProfile?.totalPosts || 0) - 1),
        },
      }));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin h-8 w-8 text-[#1a237e]" />
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="max-w-3xl mx-auto text-center py-12">
        <p className="text-gray-500">User not found or no posts yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-[#1a237e] to-[#283593]"></div>
        <div className="p-6 -mt-12">
          <div className="flex items-end justify-between">
            <div className="flex items-end gap-4">
              <div className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center text-3xl font-bold text-[#1a237e]">
                {profileUser.fullName?.charAt(0)}
              </div>
              <div className="mb-2">
                <h1 className="text-2xl font-bold text-gray-800">{profileUser.fullName}</h1>
                <p className="text-gray-500">@{profileUser.email?.split("@")[0]}</p>
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
              <span className="font-bold">{profileUser.mediaCreatorProfile?.totalPosts || posts.length}</span> posts
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

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200 px-5 flex gap-6">
          <button
            onClick={() => setActiveTab("posts")}
            className={`py-3 text-sm font-medium border-b-2 transition ${
              activeTab === "posts"
                ? "border-[#1a237e] text-[#1a237e]"
                : "border-transparent text-gray-500 hover:text-[#1a237e]"
            }`}
          >
            Posts
          </button>
          <button
            onClick={() => setActiveTab("media")}
            className={`py-3 text-sm font-medium border-b-2 transition ${
              activeTab === "media"
                ? "border-[#1a237e] text-[#1a237e]"
                : "border-transparent text-gray-500 hover:text-[#1a237e]"
            }`}
          >
            Media
          </button>
        </div>

        {/* Posts Grid */}
        <div className="p-4">
          {posts.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No posts yet.</p>
          ) : (
            <div className="space-y-4">
              {posts.map((post: any) => (
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