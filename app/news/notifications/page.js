"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bell, Heart, MessageCircle, UserPlus, Loader2 } from 'lucide-react';
import api from '@/config/api';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/social/notifications');
      setNotifications(res.data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const markRead = async (id) => {
    try {
      await api.put(`/social/notifications/${id}/read`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (err) { console.error(err); }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'like': return <Heart size={16} className="text-red-500" />;
      case 'comment': return <MessageCircle size={16} className="text-blue-500" />;
      case 'follow': return <UserPlus size={16} className="text-green-500" />;
      default: return <Bell size={16} className="text-gray-500" />;
    }
  };

  const getMessage = (n) => {
    const name = n.fromUser?.fullName || 'Someone';
    if (n.type === 'like') return `${name} liked your post`;
    if (n.type === 'comment') return `${name} commented on your post`;
    if (n.type === 'follow') return `${name} started following you`;
    return `${name} interacted with your content`;
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin h-8 w-8 text-blue-600" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b"><h1 className="text-xl font-bold flex items-center gap-2"><Bell size={20} /> Notifications</h1></div>
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No notifications yet</div>
          ) : (
            <div className="divide-y">
              {notifications.map(n => (
                <div key={n._id} className={`p-4 hover:bg-gray-50 transition ${!n.read ? 'bg-blue-50' : ''}`} onClick={() => markRead(n._id)}>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">{getIcon(n.type)}</div>
                    <div>
                      <p className="text-sm text-gray-700">{getMessage(n)}</p>
                      <p className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}