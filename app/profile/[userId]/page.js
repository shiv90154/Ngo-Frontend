"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, UserPlus, UserCheck, Calendar, MapPin, Briefcase, Loader2 } from 'lucide-react';
import api from '@/config/api';
import { useAuth } from '@/contexts/AuthContext';
import PostCard from '@/components/social/PostCard';

export default function UserProfile() {
  const { userId } = useParams();
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const userRes = await api.get(`/users/${userId}`);
      setProfileUser(userRes.data.user);
      const postsRes = await api.get(`/social/posts/user/${userId}`);
      setPosts(postsRes.data.data);
      const followersRes = await api.get(`/social/followers/${userId}`);
      const followingRes = await api.get(`/social/following/${userId}`);
      setFollowersCount(followersRes.data.data.length);
      setFollowingCount(followingRes.data.data.length);
      if (currentUser && currentUser._id !== userId) {
        const myFollowing = await api.get(`/social/following/${currentUser._id}`);
        setIsFollowing(myFollowing.data.data.some(f => f._id === userId));
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await api.delete(`/social/follow/${userId}`);
        setFollowersCount(prev => prev - 1);
        setIsFollowing(false);
      } else {
        await api.post(`/social/follow/${userId}`);
        setFollowersCount(prev => prev + 1);
        setIsFollowing(true);
      }
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin h-8 w-8 text-blue-600" /></div>;
  if (!profileUser) return <div className="text-center py-12">User not found</div>;

  const isOwn = currentUser?._id === userId;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-600 mb-4">
          <ArrowLeft size={20} /> Back
        </button>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
          <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-500" />
          <div className="px-6 pb-6 relative">
            <div className="flex flex-col md:flex-row gap-6 -mt-12">
              <div className="flex-shrink-0">
                <div className="w-28 h-28 rounded-full border-4 border-white bg-white shadow-md overflow-hidden">
                  {profileUser.profileImage ? (
                    <img src={profileUser.profileImage} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
                      {profileUser.fullName?.[0]?.toUpperCase()}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-1 pt-4 md:pt-0">
                <div className="flex flex-wrap justify-between items-start gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800">{profileUser.fullName}</h1>
                    <p className="text-gray-500">@{profileUser.email?.split('@')[0]}</p>
                    {profileUser.bio && <p className="mt-2 text-gray-700">{profileUser.bio}</p>}
                  </div>
                  {!isOwn && (
                    <button onClick={handleFollow} className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition ${isFollowing ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                      {isFollowing ? <UserCheck size={18} /> : <UserPlus size={18} />}
                      {isFollowing ? 'Following' : 'Follow'}
                    </button>
                  )}
                </div>
                <div className="flex gap-6 mt-4">
                  <div><span className="font-bold">{posts.length}</span> <span className="text-gray-500">posts</span></div>
                  <Link href={`/profile/${userId}/followers`} className="hover:text-blue-600"><span className="font-bold">{followersCount}</span> <span className="text-gray-500">followers</span></Link>
                  <Link href={`/profile/${userId}/following`} className="hover:text-blue-600"><span className="font-bold">{followingCount}</span> <span className="text-gray-500">following</span></Link>
                </div>
                <div className="mt-3 text-sm text-gray-500 space-y-1">
                  {profileUser.location && <div className="flex items-center gap-1"><MapPin size={14} /> {profileUser.location}</div>}
                  {profileUser.role && <div className="flex items-center gap-1"><Briefcase size={14} /> {profileUser.role}</div>}
                  <div className="flex items-center gap-1"><Calendar size={14} /> Joined {new Date(profileUser.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Posts */}
        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center text-gray-500">No posts yet</div>
          ) : (
            posts.map(post => (
              <PostCard key={post._id} post={post} currentUserId={currentUser?._id} onDelete={(id) => setPosts(posts.filter(p => p._id !== id))} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}