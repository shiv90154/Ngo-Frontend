"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/config/api';
import PostCard from '@/components/social/PostCard';
import CreatePost from '@/components/social/CreatePost';
import { Loader2, Users, UserPlus, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function NewsFeed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [followingIds, setFollowingIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeed();
    fetchSuggestions();
  }, []);

  const fetchFeed = async () => {
    try {
      const res = await api.get('/social/feed');
      setPosts(res.data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchSuggestions = async () => {
    try {
      const res = await api.get('/social/suggestions');
      setSuggestions(res.data.data);
    } catch (err) { console.error(err); }
  };

  const fetchFollowing = async () => {
    try {
      const res = await api.get(`/social/following/${user._id}`);
      setFollowingIds(res.data.data.map(u => u._id));
    } catch (err) { console.error(err); }
  };

  const handleFollowToggle = async (targetId) => {
    try {
      if (followingIds.includes(targetId)) {
        await api.delete(`/social/follow/${targetId}`);
        setFollowingIds(prev => prev.filter(id => id !== targetId));
        setSuggestions(suggestions.filter(s => s._id !== targetId));
      } else {
        await api.post(`/social/follow/${targetId}`);
        setFollowingIds(prev => [...prev, targetId]);
        setSuggestions(suggestions.filter(s => s._id !== targetId));
      }
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin h-8 w-8 text-blue-600" /></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main feed */}
          <div className="lg:col-span-2 space-y-4">
            <CreatePost onPostCreated={fetchFeed} />
            {posts.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center text-gray-500">
                <Users size={48} className="mx-auto mb-3 text-gray-300" />
                Follow people to see their posts
              </div>
            ) : (
              posts.map(post => (
                <PostCard
                  key={post._id}
                  post={post}
                  currentUserId={user?._id}
                  onDelete={(id) => setPosts(posts.filter(p => p._id !== id))}
                  onFollowToggle={handleFollowToggle}
                  isFollowingAuthor={followingIds.includes(post.author?._id)}
                />
              ))
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-4">
                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <UserPlus size={18} className="text-blue-500" />
                  Who to follow
                </h3>
                <div className="space-y-3">
                  {suggestions.map(sug => (
                    <div key={sug._id} className="flex justify-between items-center">
                      <Link href={`/profile/${sug._id}`} className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                          {sug.profileImage ? <img src={sug.profileImage} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white text-xs">{sug.fullName?.[0]}</div>}
                        </div>
                        <span className="text-sm font-medium">{sug.fullName}</span>
                      </Link>
                      <button onClick={() => handleFollowToggle(sug._id)} className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-100">
                        Follow
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trending */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <TrendingUp size={18} className="text-orange-500" />
                Trending
              </h3>
              {/* You can add a separate fetch for trending posts */}
              <p className="text-gray-500 text-sm">Coming soon...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}