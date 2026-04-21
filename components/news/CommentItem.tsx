// components/news/CommentItem.tsx
"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { mediaAPI } from "@/lib/api";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

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
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="group px-4 py-3 flex gap-3 hover:bg-slate-50/50 transition-colors"
    >
      <Link href={`/news/profile/${comment.user._id}`} className="shrink-0">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200 flex items-center justify-center text-[#1a237e] text-xs font-bold shadow-sm"
        >
          {comment.user.fullName?.charAt(0) || "?"}
        </motion.div>
      </Link>

      <div className="flex-1 min-w-0">
        <div className="inline-block bg-slate-100 rounded-2xl px-4 py-2 ring-1 ring-inset ring-slate-200/50">
          <div className="flex items-center gap-2 mb-0.5">
            <Link 
              href={`/news/profile/${comment.user._id}`} 
              className="font-bold text-[13px] text-slate-900 hover:text-[#1a237e] transition-colors"
            >
              {comment.user.fullName}
            </Link>
            <span className="text-[11px] text-slate-400 font-medium">
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
            </span>
          </div>
          <p className="text-[14px] text-slate-700 leading-snug break-words">
            {comment.text}
          </p>
        </div>

        {/* Optional Action Row (Like/Reply) can go here in the future */}
        <div className="flex items-center gap-4 mt-1 ml-2">
           {canDelete && (
            <button 
              onClick={handleDelete} 
              className="text-[11px] font-bold text-slate-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" /> Delete
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}