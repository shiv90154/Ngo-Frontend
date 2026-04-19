"use client";

import { useState, useEffect } from "react";
import { mediaAPI } from "@/lib/api";
import { toast } from "react-toastify";

export default function FollowButton({ userId, initialIsFollowing }: any) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await mediaAPI.checkFollowStatus(userId);
        setIsFollowing(res.data.isFollowing);
      } catch (error) {
        console.error("Failed to check follow status:", error);
      }
    };
    if (initialIsFollowing === undefined) checkStatus();
  }, [userId, initialIsFollowing]);

  const handleToggle = async () => {
    setLoading(true);
    try {
      if (isFollowing) {
        await mediaAPI.unfollowUser(userId);
      } else {
        await mediaAPI.followUser(userId);
      }
      setIsFollowing(!isFollowing);
      toast.success(isFollowing ? "Unfollowed" : "Followed");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Action failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`px-6 py-2 rounded-lg font-medium transition ${
        isFollowing
          ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
          : "bg-[#1a237e] text-white hover:bg-[#0d1757]"
      } disabled:opacity-50`}
    >
      {loading ? "..." : isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
}