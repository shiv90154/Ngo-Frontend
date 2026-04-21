"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { mediaAPI } from "@/lib/api";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  MoreHorizontal, 
  Trash2, 
  Edit3,
  Play
} from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-toastify";

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
  const isAuthor = currentUser?._id === post.author?._id;

  const handleLike = async () => {
    // Optimistic UI Update
    const previousLiked = isLiked;
    const previousCount = likesCount;
    
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);

    try {
      if (previousLiked) {
        await mediaAPI.unlikePost(post._id);
      } else {
        await mediaAPI.likePost(post._id);
      }
    } catch (error) {
      // Revert if API fails
      setIsLiked(previousLiked);
      setLikesCount(previousCount);
      toast.error("Action failed");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await mediaAPI.deletePost(post._id);
      onDelete?.(post._id);
      toast.success("Post deleted");
    } catch (error) {
      toast.error("Could not delete post");
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] shadow-sm ring-1 ring-slate-100 overflow-hidden mb-6">
      {/* Post Header */}
      <div className="p-5 flex items-center justify-between">
        <Link href={`/news/profile/${post.author?._id}`} className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-[#1a237e] font-black group-hover:scale-105 transition-transform">
            {post.author?.avatar ? (
              <img src={post.author.avatar} alt="" className="w-full h-full object-cover rounded-2xl" />
            ) : (
              post.author?.fullName?.charAt(0)
            )}
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#1a237e] transition-colors">
              {post.author?.fullName}
            </h4>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {formatDistanceToNow(new Date(post.createdAt))} ago
            </p>
          </div>
        </Link>

        {isAuthor && (
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl ring-1 ring-black/5 z-30 py-2">
                <button className="w-full px-4 py-2 text-left text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                  <Edit3 className="w-4 h-4" /> Edit Post
                </button>
                <button 
                  onClick={handleDelete}
                  className="w-full px-4 py-2 text-left text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-5 pb-3">
        <p className="text-slate-700 text-sm leading-relaxed">{post.content}</p>
      </div>

      {/* Media Gallery */}
      {post.media && post.media.length > 0 && (
        <div className="px-5 pb-4">
          <div className={`grid gap-2 rounded-3xl overflow-hidden ${
            post.media.length > 1 ? 'grid-cols-2' : 'grid-cols-1'
          }`}>
            {post.media.map((item: any, idx: number) => {
              const isVideo = item.url.match(/\.(mp4|webm|mov|ogg)$/i) || item.type?.includes('video');
              
              return (
                <div key={idx} className="relative bg-slate-100 aspect-video group cursor-pointer">
                  {isVideo ? (
                    <div className="relative w-full h-full">
                       <video 
                        src={item.url} 
                        className="w-full h-full object-cover"
                        muted
                        loop
                        playsInline
                        onMouseOver={(e) => (e.target as HTMLVideoElement).play()}
                        onMouseOut={(e) => (e.target as HTMLVideoElement).pause()}
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-transparent transition-colors">
                        <Play className="w-8 h-8 text-white fill-white opacity-80 group-hover:opacity-0 transition-opacity" />
                      </div>
                    </div>
                  ) : (
                    <img 
                      src={item.url} 
                      alt="" 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Action Bar */}
      <div className="px-5 py-4 border-t border-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button 
            onClick={handleLike}
            className="flex items-center gap-2 group transition-colors"
          >
            <div className={`p-2 rounded-xl transition-colors ${
              isLiked ? 'bg-rose-50 text-rose-500' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100'
            }`}>
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            </div>
            <span className={`text-xs font-black ${isLiked ? 'text-rose-600' : 'text-slate-500'}`}>
              {likesCount}
            </span>
          </button>

          <button className="flex items-center gap-2 group transition-colors">
            <div className="p-2 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-slate-100 transition-colors">
              <MessageCircle className="w-4 h-4" />
            </div>
            <span className="text-xs font-black text-slate-500">
              {post.commentsCount || 0}
            </span>
          </button>
        </div>

        <button className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-100 transition-colors">
          <Share2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}