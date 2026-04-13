"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/config/api';
import { Loader2, ShoppingCart, Truck, CheckCircle, XCircle } from 'lucide-react';

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [receivedOrders, setReceivedOrders] = useState([]);
  const [placedOrders, setPlacedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('received');

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
    else if (user) fetchOrders();
  }, [user, authLoading]);

  const fetchOrders = async () => {
    try {
      const receivedRes = await api.get('/agriculture/orders/seller');
      setReceivedOrders(receivedRes.data.data);
      // For placed orders – you may need a separate endpoint; using /agriculture/orders (buyer)
      const placedRes = await api.get('/agriculture/orders');
      setPlacedOrders(placedRes.data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await api.put(`/agriculture/orders/${orderId}/status`, { status });
      fetchOrders();
    } catch (err) { alert(err.response?.data?.message); }
  };

  if (authLoading || loading) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin h-8 w-8 text-[#FF9933]" /></div>;

  const statusColors = { pending: 'bg-yellow-100 text-yellow-800', confirmed: 'bg-blue-100 text-blue-800', shipped: 'bg-purple-100 text-purple-800', delivered: 'bg-green-100 text-green-800', cancelled: 'bg-red-100 text-red-800' };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex"><div className="h-1 w-1/3 bg-[#FF9933]"></div><div className="h-1 w-1/3 bg-white"></div><div className="h-1 w-1/3 bg-[#138808]"></div></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-6"><div className="w-10 h-10 rounded-full bg-[#FF9933]/10 flex items-center justify-center"><ShoppingCart size={20} className="text-[#FF9933]" /></div><h1 className="text-2xl font-bold text-gray-800">Orders</h1></div>
        <div className="flex gap-4 border-b mb-6">
          <button onClick={() => setActiveTab('received')} className={`pb-2 px-4 font-medium ${activeTab === 'received' ? 'border-b-2 border-[#FF9933] text-[#FF9933]' : 'text-gray-500'}`}>Orders Received (as seller)</button>
          <button onClick={() => setActiveTab('placed')} className={`pb-2 px-4 font-medium ${activeTab === 'placed' ? 'border-b-2 border-[#FF9933] text-[#FF9933]' : 'text-gray-500'}`}>Orders Placed (as buyer)</button>
        </div>
        {activeTab === 'received' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200"><thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th></tr></thead>
            <tbody className="divide-y divide-gray-200">{receivedOrders.map(order => (<tr key={order._id} className="hover:bg-gray-50"><td className="px-6 py-4 text-sm text-gray-800">{order.orderId?.slice(-8)}</td><td className="px-6 py-4 text-sm text-gray-600">{order.productName || '-'}</td><td className="px-6 py-4 text-sm text-gray-600">{order.quantity}</td><td className="px-6 py-4 text-sm text-gray-600">₹{order.totalAmount}</td><td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.orderStatus]}`}>{order.orderStatus}</span></td><td className="px-6 py-4 flex gap-2">{order.orderStatus === 'pending' && <button onClick={() => updateStatus(order._id, 'confirmed')} className="text-blue-600 text-sm">Confirm</button>}{order.orderStatus === 'confirmed' && <button onClick={() => updateStatus(order._id, 'shipped')} className="text-purple-600 text-sm">Ship</button>}{order.orderStatus === 'shipped' && <button onClick={() => updateStatus(order._id, 'delivered')} className="text-green-600 text-sm">Deliver</button>}</td></tr>))}</tbody></table>
          </div>
        )}
        {activeTab === 'placed' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200"><thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th></tr></thead>
            <tbody className="divide-y divide-gray-200">{placedOrders.map(order => (<tr key={order._id}><td className="px-6 py-4 text-sm text-gray-800">{order.orderId?.slice(-8)}</td><td className="px-6 py-4 text-sm text-gray-600">{order.productName || '-'}</td><td className="px-6 py-4 text-sm text-gray-600">₹{order.totalAmount}</td><td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.orderStatus]}`}>{order.orderStatus}</span></td></tr>))}</tbody></table>
          </div>
        )}
      </div>
    </div>
  );
}