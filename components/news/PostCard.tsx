"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { mediaAPI } from "@/lib/api";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Trash2,
  Edit3,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-toastify";

export default function PostCard({ post, onUpdate, onDelete }: any) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [showMenu, setShowMenu] = useState(false);

  const isAuthor = user?._id === post.author._id;
  const isAdmin = user?.role === "SUPER_ADMIN";

  const handleLike = async () => {
    try {
      if (liked) {
        await mediaAPI.unlikePost(post._id);
        setLikesCount((prev) => prev - 1);
      } else {
        await mediaAPI.likePost(post._id);
        setLikesCount((prev) => prev + 1);
      }
      setLiked(!liked);
      onUpdate?.(post._id, { likesCount: liked ? likesCount - 1 : likesCount + 1 });
    } catch (error) {
      toast.error("Failed to update like");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this post?")) return;
    try {
      await mediaAPI.deletePost(post._id);
      toast.success("Post deleted");
      onDelete?.(post._id);
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <Link href={`/news/profile/${post.author._id}`} className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#1a237e] rounded-full flex items-center justify-center text-white font-medium">
            {post.author.fullName?.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-gray-800">{post.author.fullName}</p>
            <p className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              {post.location && ` • ${post.location}`}
            </p>
          </div>
        </Link>

        {(isAuthor || isAdmin) && (
          <div className="relative">
            <button onClick={() => setShowMenu(!showMenu)} className="p-1">
              <MoreHorizontal className="w-5 h-5 text-gray-500" />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border py-1 z-10">
                <button className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50 flex items-center gap-2">
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      {post.content && <p className="px-4 pb-3 text-gray-800">{post.content}</p>}

      {/* Media */}
      {post.media && post.media.length > 0 && (
        <div className={`grid gap-1 ${post.media.length > 1 ? 'grid-cols-2' : ''}`}>
          {post.media.map((m: any, idx: number) => (
            <div key={idx} className="relative bg-black">
              {m.type === "image" ? (
                <img
                  src={m.url}
                  alt=""
                  className="w-full h-64 object-cover"
                />
              ) : (
                <video controls className="w-full h-64 object-cover">
                  <source src={m.url} />
                </video>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="p-4 flex items-center gap-4">
        <button onClick={handleLike} className="flex items-center gap-1">
          <Heart
            className={`w-6 h-6 ${
              liked ? "fill-red-500 text-red-500" : "text-gray-600"
            }`}
          />
          <span className="text-sm text-gray-600">{likesCount}</span>
        </button>
        <Link href={`/news/post/${post._id}`} className="flex items-center gap-1">
          <MessageCircle className="w-6 h-6 text-gray-600" />
          <span className="text-sm text-gray-600">{post.commentsCount || 0}</span>
        </Link>
        <button className="flex items-center gap-1">
          <Share2 className="w-6 h-6 text-gray-600" />
        </button>
        <button className="ml-auto">
          <Bookmark className="w-6 h-6 text-gray-600" />
        </button>
      </div>
    </div>
  );
}