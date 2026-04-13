"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/config/api';
import { Sprout, Package, ShoppingCart, IndianRupee, TrendingUp, Loader2 } from 'lucide-react';

export default function AgricultureDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
    else if (user) fetchDashboard();
  }, [user, authLoading]);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/agriculture/dashboard');
      setDashboardData(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Loader2 className="animate-spin h-8 w-8 text-[#FF9933]" />
      </div>
    );
  }

  const stats = dashboardData?.stats || { totalCrops: 0, totalProducts: 0, totalOrders: 0, totalRevenue: 0 };
  const recentCrops = dashboardData?.recentCrops || [];
  const recentOrders = dashboardData?.recentOrders || [];
  const activeProductsCount = dashboardData?.activeProducts || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex"><div className="h-1 w-1/3 bg-[#FF9933]"></div><div className="h-1 w-1/3 bg-white"></div><div className="h-1 w-1/3 bg-[#138808]"></div></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-[#FF9933]/10 flex items-center justify-center"><Sprout className="text-[#FF9933]" size={20} /></div>
          <div><h1 className="text-2xl font-bold text-gray-800">Agriculture Dashboard</h1><p className="text-sm text-gray-500">Manage crops, products, orders & contracts</p></div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5"><div className="flex justify-between items-start"><div><p className="text-gray-500 text-sm">Total Crops</p><p className="text-2xl font-bold text-gray-800 mt-1">{stats.totalCrops}</p></div><div className="bg-green-100 p-2 rounded-lg"><Sprout size={20} className="text-green-600" /></div></div></div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5"><div className="flex justify-between items-start"><div><p className="text-gray-500 text-sm">Active Products</p><p className="text-2xl font-bold text-gray-800 mt-1">{activeProductsCount}</p></div><div className="bg-blue-100 p-2 rounded-lg"><Package size={20} className="text-blue-600" /></div></div></div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5"><div className="flex justify-between items-start"><div><p className="text-gray-500 text-sm">Orders Received</p><p className="text-2xl font-bold text-gray-800 mt-1">{stats.totalOrders}</p></div><div className="bg-orange-100 p-2 rounded-lg"><ShoppingCart size={20} className="text-orange-600" /></div></div></div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5"><div className="flex justify-between items-start"><div><p className="text-gray-500 text-sm">Total Revenue</p><p className="text-2xl font-bold text-gray-800 mt-1">₹{stats.totalRevenue?.toLocaleString()}</p></div><div className="bg-amber-100 p-2 rounded-lg"><IndianRupee size={20} className="text-amber-600" /></div></div></div>
        </div>

        {/* Recent Crops & Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2"><Sprout size={16} className="text-[#FF9933]" /> Recent Crops</h2>
            {recentCrops.length === 0 ? <p className="text-gray-500 text-sm">No crops added yet.</p> : (
              <div className="space-y-2">
                {recentCrops.map((crop, idx) => (
                  <div key={idx} className="flex justify-between items-center border-b pb-2"><span className="text-sm">{crop.cropName}</span><span className="text-xs text-gray-500">{crop.sowingDate?.split('T')[0]}</span></div>
                ))}
              </div>
            )}
            <button onClick={() => router.push('/agriculture/crops')} className="mt-3 text-sm text-[#FF9933] hover:underline">Manage Crops →</button>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2"><ShoppingCart size={16} className="text-[#FF9933]" /> Recent Orders</h2>
            {recentOrders.length === 0 ? <p className="text-gray-500 text-sm">No orders yet.</p> : (
              <div className="space-y-2">
                {recentOrders.map((order, idx) => (
                  <div key={idx} className="flex justify-between items-center border-b pb-2"><span className="text-sm">Order #{order.orderId?.slice(-6)}</span><span className="text-xs text-gray-500">₹{order.totalAmount}</span></div>
                ))}
              </div>
            )}
            <button onClick={() => router.push('/agriculture/orders')} className="mt-3 text-sm text-[#FF9933] hover:underline">View All →</button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-800 mb-3">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => router.push('/agriculture/crops/new')} className="px-4 py-2 bg-[#FF9933] text-white rounded-lg hover:bg-[#ff8800]">Add Crop</button>
            <button onClick={() => router.push('/agriculture/products/new')} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add Product</button>
            <button onClick={() => router.push('/agriculture/marketplace')} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Browse Marketplace</button>
          </div>
        </div>
      </div>
    </div>
  );
}