// components/news/FollowButton.tsx
"use client";

import { useState, useEffect } from "react";
import { mediaAPI } from "@/lib/api";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { UserPlus, UserMinus, Loader2 } from "lucide-react";

export default function FollowButton({ userId, initialIsFollowing, size = "md" }: any) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation if nested in a Link
    setLoading(true);
    try {
      if (isFollowing) {
        await mediaAPI.unfollowUser(userId);
        toast.info("Unfollowed user");
      } else {
        await mediaAPI.followUser(userId);
        toast.success("Followed user!");
      }
      setIsFollowing(!isFollowing);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Action failed");
    } finally {
      setLoading(false);
    }
  };

  const sizeClasses: any = {
    sm: "px-3 py-1 text-xs",
    md: "px-5 py-2 text-sm",
    lg: "px-8 py-2.5 text-[15px]",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleToggle}
      disabled={loading}
      className={`
        relative overflow-hidden rounded-full font-bold transition-all duration-200 flex items-center justify-center gap-2
        ${sizeClasses[size] || sizeClasses.md}
        ${loading ? "cursor-wait" : "cursor-pointer"}
        ${
          isFollowing
            ? "bg-white text-slate-700 ring-1 ring-slate-200 hover:ring-red-200 hover:text-red-600 hover:bg-red-50"
            : "bg-[#1a237e] text-white hover:bg-[#0d1440] shadow-md shadow-indigo-100 active:shadow-none"
        }
      `}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : isFollowing ? (
        <>
          {isHovered ? (
            <>
              <UserMinus className="w-4 h-4" />
              <span>Unfollow</span>
            </>
          ) : (
            <>
              <span>Following</span>
            </>
          )}
        </>
      ) : (
        <>
          <UserPlus className="w-4 h-4" />
          <span>Follow</span>
        </>
      )}
    </motion.button>
  );
}