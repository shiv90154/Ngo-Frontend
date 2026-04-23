// components/news/FollowButton.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { mediaAPI } from "@/lib/api";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { UserPlus, UserMinus, Loader2 } from "lucide-react";

interface FollowButtonProps {
  userId: string;
  initialIsFollowing?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function FollowButton({
  userId,
  initialIsFollowing,
  size = "md",
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing ?? false);
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Verify initial follow status if not provided
  useEffect(() => {
    if (initialIsFollowing !== undefined) return;
    let cancelled = false;

    const checkStatus = async () => {
      try {
        const res = await mediaAPI.checkFollowStatus(userId);
        if (!cancelled) setIsFollowing(res.data.isFollowing);
      } catch (error) {
        console.error("Failed to check follow status:", error);
      }
    };

    checkStatus();
    return () => {
      cancelled = true;
    };
  }, [userId, initialIsFollowing]);

  const handleToggle = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault(); // Prevent navigation if inside a link
      setLoading(true);

      try {
        if (isFollowing) {
          await mediaAPI.unfollowUser(userId);
          toast.success("Unfollowed");
        } else {
          await mediaAPI.followUser(userId);
          toast.success("Followed!");
        }
        setIsFollowing((prev) => !prev);
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Action failed");
      } finally {
        setLoading(false);
      }
    },
    [isFollowing, userId]
  );

  // Size mapping for consistent spacing
  const sizeClasses: Record<NonNullable<FollowButtonProps["size"]>, string> = {
    sm: "px-4 py-1.5 text-xs",
    md: "px-5 py-2 text-sm",
    lg: "px-7 py-2.5 text-[15px]",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.02 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleToggle}
      disabled={loading}
      className={`
        relative inline-flex items-center justify-center gap-2 rounded-full font-semibold
        transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400
        disabled:cursor-not-allowed
        ${sizeClasses[size]}
        ${
          isFollowing
            ? "bg-white text-slate-700 ring-1 ring-slate-200 hover:ring-red-200 hover:text-red-600 hover:bg-red-50"
            : "bg-gradient-to-r from-indigo-600 to-indigo-800 text-white shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/30"
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
            <span>Following</span>
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