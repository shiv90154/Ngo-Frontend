"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { Trash2 } from "lucide-react";
import { formatDistanceToNowStrict } from "date-fns";
import { mediaAPI } from "@/lib/api";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { getMediaUrl } from "@/utils/mediaUrl";

interface CommentUser {
  _id: string;
  fullName?: string;
  profileImage?: string;             // ✅ renamed from avatar
}

interface Comment {
  _id: string;
  user: CommentUser;
  text: string;
  createdAt: string;
}

interface CommentItemProps {
  comment: Comment;
  onDelete: (commentId: string) => void;
  postAuthorId: string;
}

export default function CommentItem({ comment, onDelete, postAuthorId }: CommentItemProps) {
  const { user } = useAuth();
  const isAuthor = user?._id === comment.user._id;
  const isPostAuthor = user?._id === postAuthorId;
  const isAdmin = user?.role === "SUPER_ADMIN";
  const canDelete = isAuthor || isPostAuthor || isAdmin;

  const handleDelete = async () => {
    try {
      await mediaAPI.deleteComment(comment._id);
      toast.success("Comment deleted");
      onDelete(comment._id);
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -4 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
      className="flex gap-3 px-4 py-3 group"
    >
      {/* Avatar */}
      <Link
        href={`/news/profile/${comment.user._id}`}
        className="shrink-0"
        aria-label={`View ${comment.user.fullName}'s profile`}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 text-indigo-700 flex items-center justify-center text-xs font-bold ring-1 ring-indigo-300/50 shadow-sm overflow-hidden"
        >
          {comment.user.profileImage ? (
            <Image
              src={getMediaUrl(comment.user.profileImage)}
              alt={comment.user.fullName || "Avatar"}
              width={32}
              height={32}
              className="object-cover"
              unoptimized
            />
          ) : (
            comment.user.fullName?.charAt(0) || "?"
          )}
        </motion.div>
      </Link>

      {/* Comment Body */}
      <div className="flex-1 min-w-0 space-y-1.5">
        {/* Glass bubble */}
        <div className="inline-block bg-white/70 backdrop-blur-sm rounded-2xl px-4 py-2.5 ring-1 ring-slate-900/5 shadow-sm">
          <div className="flex items-center gap-2 mb-0.5">
            <Link
              href={`/news/profile/${comment.user._id}`}
              className="text-[13px] font-semibold text-slate-900 hover:text-indigo-700 transition-colors"
            >
              {comment.user.fullName}
            </Link>
            <span className="text-[11px] font-medium text-slate-400">
              {formatDistanceToNowStrict(new Date(comment.createdAt), { addSuffix: true })}
            </span>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line break-words">
            {comment.text}
          </p>
        </div>

        {/* Delete action – appears on hover */}
        {canDelete && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            onClick={handleDelete}
            className="flex items-center gap-1 ml-1 text-[11px] font-bold text-slate-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            aria-label="Delete comment"
          >
            <Trash2 className="w-3 h-3" />
            <span>Delete</span>
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}