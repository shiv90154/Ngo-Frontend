"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/config/api';
import { Plus, Edit, Trash2, Loader2, Package } from 'lucide-react';

export default function MyProductsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ productName: '', quantityAvailable: '', pricePerUnit: '', unit: 'kg', category: '' });

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
    else if (user) fetchProducts();
  }, [user, authLoading]);

  const fetchProducts = async () => {
    try { const res = await api.get('/agriculture/my-products'); setProducts(res.data.data); } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) await api.put(`/agriculture/my-products/${editing._id}`, form);
      else await api.post('/agriculture/my-products', form);
      setShowModal(false); setEditing(null); setForm({ productName: '', quantityAvailable: '', pricePerUnit: '', unit: 'kg', category: '' });
      fetchProducts();
    } catch (err) { alert(err.response?.data?.message); }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this product?')) { await api.delete(`/agriculture/my-products/${id}`); fetchProducts(); }
  };

  const openEdit = (product) => { setEditing(product); setForm(product); setShowModal(true); };

  if (authLoading || loading) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin h-8 w-8 text-[#FF9933]" /></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex"><div className="h-1 w-1/3 bg-[#FF9933]"></div><div className="h-1 w-1/3 bg-white"></div><div className="h-1 w-1/3 bg-[#138808]"></div></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-[#FF9933]/10 flex items-center justify-center"><Package size={20} className="text-[#FF9933]" /></div><h1 className="text-2xl font-bold text-gray-800">My Product Listings</h1></div>
          <button onClick={() => { setEditing(null); setForm({ productName: '', quantityAvailable: '', pricePerUnit: '', unit: 'kg', category: '' }); setShowModal(true); }} className="flex items-center gap-2 bg-[#FF9933] text-white px-4 py-2 rounded-lg hover:bg-[#ff8800]"><Plus size={18} /> Add Product</button>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price/Unit</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th></tr></thead>
            <tbody className="divide-y divide-gray-200">
              {products.map(product => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-800">{product.productName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.quantityAvailable} {product.unit}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">₹{product.pricePerUnit} / {product.unit}</td>
                  <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{product.status}</span></td>
                  <td className="px-6 py-4 flex gap-2"><button onClick={() => openEdit(product)} className="text-blue-600 hover:text-blue-800"><Edit size={16} /></button><button onClick={() => handleDelete(product._id)} className="text-red-600 hover:text-red-800"><Trash2 size={16} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Modal similar to crops – omitted for brevity but same pattern */}
    </div>
  );
}