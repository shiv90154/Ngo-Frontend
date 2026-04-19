"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { mediaAPI } from "@/lib/api";
import { toast } from "react-toastify";

export default function CommentItem({ comment, onDelete, postAuthorId }: any) {
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
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="p-4 flex gap-3">
      <Link href={`/news/profile/${comment.user._id}`}>
        <div className="w-8 h-8 bg-[#1a237e] rounded-full flex items-center justify-center text-white text-sm">
          {comment.user.fullName?.charAt(0)}
        </div>
      </Link>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <Link href={`/news/profile/${comment.user._id}`} className="font-medium text-sm">
            {comment.user.fullName}
          </Link>
          <span className="text-xs text-gray-400">
            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
          </span>
        </div>
        <p className="text-sm text-gray-700 mt-0.5">{comment.text}</p>
      </div>
      {canDelete && (
        <button onClick={handleDelete} className="text-gray-400 hover:text-red-600">
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}