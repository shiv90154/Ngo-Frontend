"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Flame, Heart, MessageCircle, Share2 } from 'lucide-react';
import api from '@/config/api';

export default function TrendingSidebar() {
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    api.get('/social/trending')
      .then(res => setTrending(res.data.data))
      .catch(err => console.error(err));
  }, []);

  if (trending.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
        <Flame className="text-orange-500" size={18} />
        Trending Now
      </h3>
      <div className="space-y-3">
        {trending.map(post => (
          <Link key={post._id} href={`/post/${post._id}`} className="block group">
            <div className="border-b pb-2 last:border-0">
              <p className="text-sm text-gray-700 line-clamp-2 group-hover:text-blue-600">
                {post.content}
              </p>
              <div className="flex gap-3 text-xs text-gray-400 mt-1">
                <span className="flex items-center gap-1"><Heart size={10} /> {post.likes.length}</span>
                <span className="flex items-center gap-1"><MessageCircle size={10} /> {post.comments.length}</span>
                <span className="flex items-center gap-1"><Share2 size={10} /> {post.shares.length}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}