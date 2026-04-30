"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { 
  Plus, 
  Eye, 
  Play, 
  Pause, 
  CheckCircle, 
  XCircle, 
  Trash2,
  TrendingUp,
  DollarSign,
  Image as ImageIcon,
  Target,
  Loader2
} from "lucide-react";
import { getMediaUrl } from "@/utils/mediaUrl";
import { adsAPI } from "@/lib/api";

interface MediaItem {
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
}

interface TargetAudience {
  locations: {
    states: string[];
    districts: string[];
    blocks: string[];
    villages: string[];
  };
  roles: string[];
  modules: string[];
  interests?: string[];
  minAge?: number;
  maxAge?: number;
  gender: 'male' | 'female' | 'other' | 'all';
}

interface AdCampaign {
  _id: string;
  advertiserId: string;
  businessName: string;
  content: string;
  media: MediaItem[];
  ctaText: string;
  targetUrl: string;
  totalBudget: number;
  spentBudget: number;
  bidAmount: number;
  targetAudience: TargetAudience;
  startDate: string;
  endDate: string;
  status: 'draft' | 'pending_approval' | 'active' | 'paused' | 'completed' | 'rejected';
  rejectionReason?: string;
  impressions: number;
  clicks: number;
  createdBy: string;
  approvedBy?: string;
  approvedAt?: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AnalyticsData {
  totalCampaigns: number;
  activeCampaigns: number;
  totalImpressions: number;
  totalClicks: number;
  totalSpent: number;
  ctr: number;
}

interface CampaignFormData {
  businessName: string;
  content: string;
  ctaText: string;
  targetUrl: string;
  totalBudget: string;
  bidAmount: string;
  startDate: string;
  endDate: string;
  targetAudience: TargetAudience;
}

interface MediaPreview {
  url: string;
  type: 'image' | 'video';
}

const getStatusBadge = (status: AdCampaign['status']) => {
  const badges: Record<AdCampaign['status'], string> = {
    'active': 'bg-green-100 text-green-700',
    'pending_approval': 'bg-yellow-100 text-yellow-700',
    'paused': 'bg-gray-100 text-gray-700',
    'completed': 'bg-blue-100 text-blue-700',
    'rejected': 'bg-red-100 text-red-700',
    'draft': 'bg-gray-100 text-gray-500'
  };
  
  const labels: Record<AdCampaign['status'], string> = {
    'active': 'Active',
    'pending_approval': 'Pending',
    'paused': 'Paused',
    'completed': 'Completed',
    'rejected': 'Rejected',
    'draft': 'Draft'
  };
  
  return {
    className: badges[status] || 'bg-gray-100',
    label: labels[status] || status
  };
};

export default function AdminAdsPage() {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<AdCampaign[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<string>('all');
  
  const [formData, setFormData] = useState<CampaignFormData>({
    businessName: "",
    content: "",
    ctaText: "Learn More",
    targetUrl: "",
    totalBudget: "",
    bidAmount: "",
    startDate: "",
    endDate: "",
    targetAudience: {
      locations: { states: [], districts: [], blocks: [], villages: [] },
      roles: [],
      modules: [],
      gender: "all"
    }
  });
  
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreview, setMediaPreview] = useState<MediaPreview[]>([]);

  const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'ADDITIONAL_DIRECTOR';

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  const fetchData = async (): Promise<void> => {
    setLoading(true);
    try {
      const [campaignsRes, analyticsRes] = await Promise.all([
        adsAPI.getCampaigns(),
        adsAPI.getAnalytics()
      ]);
      if (campaignsRes.data.success && campaignsRes.data.data) {
        setCampaigns(campaignsRes.data.data);
      }
      if (analyticsRes.data.success && analyticsRes.data.data) {
        setAnalytics(analyticsRes.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const files = Array.from(e.target.files || []);
    setMediaFiles(files);
    
    const previews: MediaPreview[] = files.map(file => ({
      url: URL.createObjectURL(file),
      type: file.type.startsWith('image/') ? 'image' : 'video'
    }));
    setMediaPreview(previews);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setSubmitting(true);
    
    const formDataObj = new FormData();
    formDataObj.append('businessName', formData.businessName);
    formDataObj.append('content', formData.content);
    formDataObj.append('ctaText', formData.ctaText);
    formDataObj.append('targetUrl', formData.targetUrl);
    formDataObj.append('totalBudget', formData.totalBudget);
    formDataObj.append('bidAmount', formData.bidAmount);
    formDataObj.append('startDate', formData.startDate);
    formDataObj.append('endDate', formData.endDate);
    formDataObj.append('targetAudience', JSON.stringify(formData.targetAudience));
    
    mediaFiles.forEach(file => {
      formDataObj.append('media', file);
    });
    
    try {
      const res = await adsAPI.createCampaign(formDataObj);
      if (res.data.success) {
        alert('Campaign created successfully!');
        setShowForm(false);
        resetForm();
        fetchData();
      } else {
        alert(res.data.message || 'Failed to create campaign');
      }
    } catch (error: any) {
      console.error("Failed to create campaign:", error);
      alert(error.response?.data?.message || 'Failed to create campaign');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = (): void => {
    setFormData({
      businessName: "",
      content: "",
      ctaText: "Learn More",
      targetUrl: "",
      totalBudget: "",
      bidAmount: "",
      startDate: "",
      endDate: "",
      targetAudience: {
        locations: { states: [], districts: [], blocks: [], villages: [] },
        roles: [],
        modules: [],
        gender: "all"
      }
    });
    setMediaFiles([]);
    setMediaPreview([]);
  };

  const updateStatus = async (id: string, status: string): Promise<void> => {
    try {
      const res = await adsAPI.updateCampaignStatus(id, status);
      if (res.data.success) {
        fetchData();
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const deleteCampaign = async (id: string): Promise<void> => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;
    try {
      const res = await adsAPI.deleteCampaign(id);
      if (res.data.success) {
        fetchData();
      }
    } catch (error) {
      console.error("Failed to delete campaign:", error);
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    if (selectedTab === 'all') return true;
    return campaign.status === selectedTab;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800">Access Denied</h2>
          <p className="text-gray-600 mt-2">
            Only SUPER_ADMIN and ADDITIONAL_DIRECTOR can access this page.
          </p>
          <Link href="/" className="mt-4 inline-block text-indigo-600 hover:underline">
            Go back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Ad Campaigns</h1>
            <p className="text-gray-600 mt-1">Manage and monitor your advertising campaigns</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            <Plus className="w-4 h-4" />
            {showForm ? "Cancel" : "New Campaign"}
          </button>
        </div>

        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Campaigns</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.totalCampaigns || 0}</p>
                </div>
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-indigo-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Active Campaigns</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.activeCampaigns || 0}</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Play className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Impressions</p>
                  <p className="text-2xl font-bold text-gray-900">{(analytics.totalImpressions || 0).toLocaleString()}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Eye className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900">₹{(analytics.totalSpent || 0).toLocaleString()}</p>
                </div>
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-orange-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['all', 'active', 'pending_approval', 'paused', 'completed'].map(tab => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition whitespace-nowrap ${
                selectedTab === tab 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab === 'all' ? 'All' : tab.charAt(0).toUpperCase() + tab.slice(1).replace('_', ' ')}
            </button>
          ))}
        </div>

        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Create New Ad Campaign</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Name *</label>
                  <input
                    type="text"
                    name="businessName"
                    required
                    className="w-full border rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={formData.businessName}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target URL *</label>
                  <input
                    type="url"
                    name="targetUrl"
                    required
                    className="w-full border rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={formData.targetUrl}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Budget (₹) *</label>
                  <input
                    type="number"
                    name="totalBudget"
                    required
                    min="100"
                    className="w-full border rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={formData.totalBudget}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bid per Click (₹) *</label>
                  <input
                    type="number"
                    name="bidAmount"
                    required
                    min="1"
                    className="w-full border rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={formData.bidAmount}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                  <input
                    type="date"
                    name="startDate"
                    required
                    className="w-full border rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={formData.startDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
                  <input
                    type="date"
                    name="endDate"
                    required
                    className="w-full border rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={formData.endDate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ad Content</label>
                <textarea
                  name="content"
                  rows={3}
                  className="w-full border rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Describe your product or service..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CTA Button Text</label>
                <select
                  name="ctaText"
                  className="w-full border rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.ctaText}
                  onChange={handleInputChange}
                >
                  <option>Learn More</option>
                  <option>Shop Now</option>
                  <option>Sign Up</option>
                  <option>Contact Us</option>
                  <option>Apply Now</option>
                  <option>Buy Now</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Media (Image or Video) *</label>
                <input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  required
                  className="w-full border rounded-lg p-2"
                  onChange={handleFileChange}
                />
                {mediaPreview.length > 0 && (
                  <div className="mt-2 flex gap-2">
                    {mediaPreview.map((preview, idx) => (
                      <div key={idx} className="w-20 h-20 rounded overflow-hidden bg-gray-100">
                        {preview.type === 'image' ? (
                          <img src={preview.url} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <video src={preview.url} className="w-full h-full object-cover" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Create Campaign
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-4">
          {filteredCampaigns.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center">
              <Target className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No campaigns found</p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-3 text-indigo-600 hover:underline"
              >
                Create your first campaign
              </button>
            </div>
          ) : (
            filteredCampaigns.map((campaign) => {
              const { className: statusClass, label: statusLabel } = getStatusBadge(campaign.status);
              return (
                <div key={campaign._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition">
                  <div className="flex flex-wrap gap-4">
                   <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
  {campaign.media?.[0]?.type === 'image' ? (
    <img 
      src={getMediaUrl(campaign.media[0].url)} 
      alt={campaign.businessName}
      className="w-full h-full object-cover"
    />
  ) : campaign.media?.[0]?.type === 'video' ? (
    <video src={getMediaUrl(campaign.media[0].url)} className="w-full h-full object-cover" />
  ) : (
    <div className="w-full h-full flex items-center justify-center">
      <ImageIcon className="w-8 h-8 text-gray-400" />
    </div>
  )}
</div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between flex-wrap gap-2">
                        <div>
                          <h3 className="font-bold text-lg">{campaign.businessName}</h3>
                          <p className="text-gray-600 text-sm mt-1">{campaign.content?.substring(0, 100)}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusClass}`}>
                          {statusLabel}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 text-sm">
                        <div>
                          <p className="text-gray-500">Budget</p>
                          <p className="font-semibold">₹{campaign.totalBudget?.toLocaleString()}</p>
                          <p className="text-xs text-gray-400">Spent: ₹{campaign.spentBudget?.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Performance</p>
                          <p className="font-semibold">{campaign.impressions || 0} views</p>
                          <p className="text-xs text-gray-400">{campaign.clicks || 0} clicks</p>
                        </div>
                        <div>
                          <p className="text-gray-500">CTR</p>
                          <p className="font-semibold">
                            {campaign.impressions ? ((campaign.clicks / campaign.impressions) * 100).toFixed(1) : 0}%
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Dates</p>
                          <p className="text-xs">
                            {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 items-start">
                      {campaign.status === 'pending_approval' && (
                        <button
                          onClick={() => updateStatus(campaign._id, 'active')}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                          title="Approve & Activate"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                      )}
                      {campaign.status === 'active' && (
                        <button
                          onClick={() => updateStatus(campaign._id, 'paused')}
                          className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition"
                          title="Pause"
                        >
                          <Pause className="w-5 h-5" />
                        </button>
                      )}
                      {campaign.status === 'paused' && (
                        <button
                          onClick={() => updateStatus(campaign._id, 'active')}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                          title="Resume"
                        >
                          <Play className="w-5 h-5" />
                        </button>
                      )}
                      {campaign.status === 'rejected' && (
                        <button
                          onClick={() => updateStatus(campaign._id, 'pending_approval')}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Resubmit"
                        >
                          <Target className="w-5 h-5" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteCampaign(campaign._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}