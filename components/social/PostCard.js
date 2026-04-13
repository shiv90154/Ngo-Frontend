"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Heart, MessageCircle, Share2, Trash2, MoreHorizontal, UserPlus, UserCheck } from 'lucide-react';
import api from '@/config/api';

export default function PostCard({ post, currentUserId, onDelete, onFollowToggle, isFollowingAuthor }) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(post.comments || []);
  const [liked, setLiked] = useState(post.likes?.includes(currentUserId) || false);
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [showMenu, setShowMenu] = useState(false);
  const isOwnPost = post.author?._id === currentUserId;

  const handleLike = async () => {
    try {
      if (liked) {
        await api.delete(`/social/posts/${post._id}/like`);
        setLikesCount(prev => prev - 1);
        setLiked(false);
      } else {
        await api.post(`/social/posts/${post._id}/like`);
        setLikesCount(prev => prev + 1);
        setLiked(true);
      }
    } catch (err) { console.error(err); }
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;
    try {
      const res = await api.post(`/social/posts/${post._id}/comment`, { text: commentText });
      setComments(res.data.data);
      setCommentText('');
    } catch (err) { console.error(err); }
  };

  const handleShare = async () => {
    try {
      await api.post(`/social/posts/${post._id}/share`);
      alert('Post shared!');
    } catch (err) { console.error(err); }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this post?')) return;
    try {
      await api.delete(`/social/posts/${post._id}`);
      onDelete?.(post._id);
    } catch (err) { console.error(err); }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-4 pb-2 flex justify-between items-start">
        <div className="flex items-center gap-3">
          <Link href={`/profile/${post.author?._id}`} className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
              {post.author?.fullName?.[0]?.toUpperCase()}
            </div>
          </Link>
          <div>
            <Link href={`/profile/${post.author?._id}`} className="font-semibold text-gray-800 hover:text-blue-600">
              {post.author?.fullName}
            </Link>
            <p className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="relative">
          <button onClick={() => setShowMenu(!showMenu)} className="p-1 hover:bg-gray-100 rounded">
            <MoreHorizontal size={16} className="text-gray-500" />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-1 bg-white shadow-lg rounded-lg border py-1 z-10 min-w-[140px]">
              {!isOwnPost && onFollowToggle && (
                <button
                  onClick={() => onFollowToggle(post.author._id)}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 w-full"
                >
                  {isFollowingAuthor ? <UserCheck size={14} /> : <UserPlus size={14} />}
                  {isFollowingAuthor ? 'Unfollow' : 'Follow'} {post.author?.fullName?.split(' ')[0]}
                </button>
              )}
              {isOwnPost && (
                <button onClick={handleDelete} className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 w-full">
                  <Trash2 size={14} /> Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
      </div>

      {/* Media */}
      {post.media?.length > 0 && (
        <div className={`grid gap-1 ${post.media.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
          {post.media.map((m, idx) => (
            <div key={idx} className="relative aspect-square bg-gray-100">
              <img src={m.url} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}

      {/* Action buttons */}
      <div className="px-4 py-2 border-t border-gray-100 flex items-center justify-between text-gray-500">
        <button onClick={handleLike} className={`flex items-center gap-1.5 text-sm transition ${liked ? 'text-red-500' : 'hover:text-red-500'}`}>
          <Heart size={18} fill={liked ? 'currentColor' : 'none'} /> {likesCount}
        </button>
        <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-1.5 text-sm hover:text-blue-500">
          <MessageCircle size={18} /> {comments.length}
        </button>
        <button onClick={handleShare} className="flex items-center gap-1.5 text-sm hover:text-green-500">
          <Share2 size={18} /> {post.shares?.length || 0}
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="px-4 pb-3 pt-2 border-t border-gray-100">
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 px-3 py-1.5 bg-gray-50 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && handleComment()}
            />
            <button onClick={handleComment} className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-full hover:bg-blue-700">
              Post
            </button>
          </div>
          {comments.length === 0 && <p className="text-gray-400 text-sm text-center">No comments yet</p>}
          {comments.map(comment => (
            <div key={comment._id} className="flex gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-gray-300 flex-shrink-0" />
              <div className="flex-1">
                <span className="font-medium text-xs">{comment.user?.fullName}</span>
                <p className="text-xs text-gray-600">{comment.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}