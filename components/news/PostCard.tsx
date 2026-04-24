"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { mediaAPI } from "@/lib/api";
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Trash2,
  Edit3,
  Play,
  Save,
  X,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNowStrict } from "date-fns";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { getMediaUrl } from "@/utils/mediaUrl";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

const formatTime = (date: string) => {
  try {
    return formatDistanceToNowStrict(new Date(date), { addSuffix: true });
  } catch {
    return "just now";
  }
};

interface PostCardProps {
  post: any;
  onUpdate?: (postId: string, data: any) => void;
  onDelete?: (postId: string) => void;
}

export default function PostCard({ post, onUpdate, onDelete }: PostCardProps) {
  const { user: currentUser } = useAuth();
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [showMenu, setShowMenu] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content || "");
  const [editTags, setEditTags] = useState((post.tags || []).join(", "));
  const [editLocation, setEditLocation] = useState(post.location || "");
  const [saving, setSaving] = useState(false);

  const isAuthor = currentUser?._id === post.author?._id;

  // Close menu on Escape
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setShowMenu(false);
    }
  }, []);

  useEffect(() => {
    if (showMenu) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showMenu, handleKeyDown]);

  // Like
  const handleLike = async () => {
    const prevLiked = isLiked;
    const prevCount = likesCount;
    setIsLiked(!prevLiked);
    setLikesCount(prevLiked ? prevCount - 1 : prevCount + 1);
    try {
      if (prevLiked) await mediaAPI.unlikePost(post._id);
      else await mediaAPI.likePost(post._id);
    } catch {
      setIsLiked(prevLiked);
      setLikesCount(prevCount);
      toast.error("Action failed");
    }
  };

  // Delete with confirmation
  const handleDeleteRequest = () => {
    setShowMenu(false);
    setConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await mediaAPI.deletePost(post._id);
      onDelete?.(post._id);
      toast.success("Post deleted");
    } catch {
      toast.error("Could not delete post");
    }
  };

  // Share
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title || "Check out this post",
          url: `${window.location.origin}/news/post/${post._id}`,
        });
      } catch {}
    } else {
      await navigator.clipboard.writeText(
        `${window.location.origin}/news/post/${post._id}`
      );
      toast.success("Link copied to clipboard!");
    }
  };

  // Edit
  const handleStartEdit = () => {
    setEditContent(post.content || "");
    setEditTags((post.tags || []).join(", "));
    setEditLocation(post.location || "");
    setIsEditing(true);
    setShowMenu(false);
  };

  const handleCancelEdit = () => setIsEditing(false);

  const handleSaveEdit = async () => {
    if (!editContent.trim() && post.media?.length === 0) {
      toast.error("Content cannot be empty");
      return;
    }
    setSaving(true);
    try {
      const tagsArray = editTags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      const payload = {
        content: editContent.trim(),
        tags: tagsArray.join(","),
        location: editLocation.trim(),
      };
      await mediaAPI.updatePost(post._id, payload);
      onUpdate?.(post._id, {
        content: editContent.trim(),
        tags: tagsArray,
        location: editLocation.trim(),
      });
      toast.success("Post updated");
      setIsEditing(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-sm ring-1 ring-slate-900/5 hover:shadow-md hover:ring-slate-200/50 transition-all duration-300 overflow-hidden"
    >
      {/* Header */}
      <div className="p-5 flex items-center justify-between">
        <Link
          href={`/news/profile/${post.author?._id}`}
          className="flex items-center gap-3 group"
          aria-label={`View profile of ${post.author?.fullName}`}
        >
          <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white font-bold shadow-sm ring-2 ring-white/20 overflow-hidden group-hover:scale-105 transition-transform duration-200">
            {post.author?.profileImage ? (
              <Image
                src={getMediaUrl(post.author.profileImage)}
                alt={post.author?.fullName || "Avatar"}
                width={40}
                height={40}
                className="object-cover"
                unoptimized
              />
            ) : (
              post.author?.fullName?.charAt(0) || "?"
            )}
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-semibold text-slate-900 truncate group-hover:text-indigo-700 transition-colors">
              {post.author?.fullName || "Unknown"}
            </h4>
            <p className="text-[11px] font-medium text-slate-400 tracking-wide">
              {post.createdAt ? formatTime(post.createdAt) : "just now"}
              {post.updatedAt !== post.createdAt && (
                <span className="ml-1 text-slate-400/70">(edited)</span>
              )}
            </p>
          </div>
        </Link>

        {isAuthor && !isEditing && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Post options"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>

            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-48 bg-white/90 backdrop-blur-xl rounded-xl shadow-xl ring-1 ring-slate-900/5 z-30 py-1 overflow-hidden"
                  role="menu"
                >
                  <button
                    onClick={handleStartEdit}
                    className="w-full px-4 py-2.5 text-left text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                    role="menuitem"
                  >
                    <Edit3 className="w-4 h-4" /> Edit Post
                  </button>
                  <button
                    onClick={handleDeleteRequest}
                    className="w-full px-4 py-2.5 text-left text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors"
                    role="menuitem"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Content (View / Edit) */}
      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div
            key="edit-form"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="px-5 pb-4 space-y-3"
          >
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full bg-slate-50 rounded-xl p-3 text-sm text-slate-800 ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500/20 resize-none"
              rows={3}
              placeholder="What's happening?"
              aria-label="Edit content"
            />
            <input
              value={editTags}
              onChange={(e) => setEditTags(e.target.value)}
              className="w-full bg-slate-50 rounded-xl px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500/20"
              placeholder="Tags (comma separated)"
              aria-label="Edit tags"
            />
            <input
              value={editLocation}
              onChange={(e) => setEditLocation(e.target.value)}
              className="w-full bg-slate-50 rounded-xl px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500/20"
              placeholder="Location (optional)"
              aria-label="Edit location"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={handleCancelEdit}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold bg-white ring-1 ring-slate-200 text-slate-600 hover:bg-slate-50 transition"
                aria-label="Cancel editing"
              >
                <X className="w-4 h-4" /> Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSaveEdit}
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-indigo-600 to-indigo-800 text-white shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/30 disabled:opacity-50"
                aria-label="Save changes"
              >
                {saving ? (
                  <span className="animate-spin">⏳</span>
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {saving ? "Saving..." : "Save"}
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="content-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-5 pb-4"
          >
            {post.title && (
              <h3 className="text-lg font-bold text-slate-900 mb-1.5">{post.title}</h3>
            )}
            <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
              {post.content}
            </p>
            {post.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {post.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="text-[10px] font-semibold uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full ring-1 ring-indigo-100"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
            {post.location && (
              <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                📍 {post.location}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Media Gallery */}
      {post.media?.length > 0 && (
        <div className="px-5 pb-5">
          <div
            className={`grid gap-2 rounded-2xl overflow-hidden ${
              post.media.length > 1 ? "grid-cols-2" : "grid-cols-1"
            }`}
          >
            {post.media.map((item: any, idx: number) => {
              const fullUrl = getMediaUrl(item.url);
              const isVideo =
                item.url?.match(/\.(mp4|webm|mov|ogg)$/i) ||
                item.type?.includes("video");
              if (isVideo) {
                return (
                  <div key={idx} className="relative bg-slate-100 overflow-hidden group aspect-video">
                    <video
                      src={fullUrl}
                      className="w-full h-full object-cover"
                      muted
                      loop
                      playsInline
                      onMouseOver={(e) => (e.target as HTMLVideoElement).play()}
                      onMouseOut={(e) => (e.target as HTMLVideoElement).pause()}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-transparent transition-colors pointer-events-none">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                        <Play className="w-5 h-5 text-white fill-white" />
                      </div>
                    </div>
                  </div>
                );
              }
              return (
                <div
                  key={idx}
                  className={`relative bg-slate-100 overflow-hidden group ${
                    post.media.length === 1 ? "aspect-video" : "aspect-square"
                  }`}
                >
                  <Image
                    src={fullUrl}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    unoptimized
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Action Bar */}
      {!isEditing && (
        <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleLike}
              className="flex items-center gap-2 group"
              aria-label={isLiked ? "Unlike post" : "Like post"}
            >
              <div
                className={`p-2 rounded-xl transition-colors ${
                  isLiked
                    ? "bg-rose-50 text-rose-500"
                    : "bg-slate-50 text-slate-400 group-hover:bg-slate-100"
                }`}
              >
                <Heart
                  className={`w-4 h-4 transition-transform ${
                    isLiked ? "fill-current scale-110" : ""
                  }`}
                />
              </div>
              <span className="text-xs font-bold text-slate-500">
                {likesCount}
              </span>
            </motion.button>

            <Link
              href={`/news/post/${post._id}`}
              className="flex items-center gap-2 group"
              aria-label={`View comments for ${post.author?.fullName}'s post`}
            >
              <div className="p-2 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-slate-100 transition-colors">
                <MessageCircle className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-500">
                {post.commentsCount || 0}
              </span>
            </Link>
          </div>

          <button
            onClick={handleShare}
            className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-100 transition-colors"
            aria-label="Share post"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Confirm Dialog for Delete */}
      <ConfirmDialog
        open={confirmOpen}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        onClose={() => setConfirmOpen(false)}
      />
    </motion.article>
  );
}