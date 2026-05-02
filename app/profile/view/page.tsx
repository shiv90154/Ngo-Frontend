// app/profile/view/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { authAPI } from "@/lib/api";
import {
  User, Mail, Phone, Calendar, MapPin, Fingerprint,
  GraduationCap, HeartPulse, Sprout, Wallet,
  MonitorSmartphone, Users, Store, ArrowLeft, Edit,
  Loader2, Shield, Camera
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Helper to build absolute image URL
const getImageUrl = (path: string) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  return `${base}${path}`;
};

export default function ViewProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    } else if (user) {
      fetchProfile();
    }
  }, [user, authLoading]);

  const fetchProfile = async () => {
    try {
      const res = await authAPI.getProfile();
      setProfileData(res.data.user);
    } catch (err) {
      console.error("Failed to load profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "basic", label: "Personal", icon: User },
    { id: "kyc", label: "Identity", icon: Fingerprint },
    { id: "address", label: "Address", icon: MapPin },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "healthcare", label: "Health", icon: HeartPulse },
    { id: "agriculture", label: "Agriculture", icon: Sprout },
    { id: "finance", label: "Banking", icon: Wallet },
    { id: "it", label: "IT", icon: MonitorSmartphone },
    { id: "social", label: "Social", icon: Users },
    { id: "seller", label: "Seller", icon: Store },
  ];

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-10 w-10 text-[#1a237e] mx-auto mb-3" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profileData) return null;

  const imageUrl = profileData.profileImage ? getImageUrl(profileData.profileImage) : null;

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex flex-col">
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 mb-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Profile Photo – enhanced */}
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden border-4 border-white shadow-lg">
                  {imageUrl && !imgError ? (
                    <Image
                      src={imageUrl}
                      alt="Profile"
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                      onError={() => setImgError(true)}
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#1a237e] to-[#283593] flex items-center justify-center text-white text-2xl font-bold">
                      {profileData.fullName?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                </div>
                <Link
                  href="/profile"
                  className="absolute -bottom-1 -right-1 bg-white border border-gray-200 hover:bg-gray-50 p-1.5 rounded-full shadow transition"
                  title="Edit profile picture"
                >
                  <Camera size={14} className="text-gray-600" />
                </Link>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl md:text-2xl font-bold text-[#1a237e] font-serif">Profile Details</h1>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                    {user?.role?.replace(/_/g, ' ') || "USER"}
                  </span>
                </div>
                <p className="text-sm text-gray-500">View your registered information</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-medium text-gray-800">{profileData.fullName}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm text-gray-600">{profileData.email}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/services")}
                className="flex items-center gap-2 text-gray-700 hover:text-[#1a237e] font-medium transition border border-gray-300 hover:border-[#1a237e] px-4 py-2.5 rounded-lg text-sm"
              >
                <ArrowLeft size={16} />
                Back to Services
              </button>
              <Link
                href="/profile"
                className="flex items-center gap-2 bg-[#1a237e] hover:bg-[#0d1757] text-white font-medium px-5 py-2.5 rounded-lg shadow-sm transition text-sm"
              >
                <Edit size={16} />
                Edit Profile
              </Link>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-5 overflow-x-auto">
          <div className="flex px-2 py-1 gap-1 min-w-max">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-[#1a237e]/10 text-[#1a237e] border-b-2 border-[#1a237e]"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 md:p-6">
          {/* Personal Tab */}
          {activeTab === "basic" && (
            <div className="space-y-5">
              <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-3">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InfoRow label="Full Name" value={profileData.fullName} />
                <InfoRow label="Email ID" value={profileData.email} />
                <InfoRow label="Mobile Number" value={profileData.phone || "—"} />
                <InfoRow label="Father's Name" value={profileData.fatherName || "—"} />
                <InfoRow label="Mother's Name" value={profileData.motherName || "—"} />
                <InfoRow label="Date of Birth" value={profileData.dob ? new Date(profileData.dob).toLocaleDateString('en-IN') : "—"} />
                <InfoRow label="Gender" value={profileData.gender ? profileData.gender.charAt(0).toUpperCase() + profileData.gender.slice(1) : "—"} />
              </div>
            </div>
          )}

          {/* KYC Tab */}
          {activeTab === "kyc" && (
            <div className="space-y-5">
              <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-3">Identity Documents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InfoRow label="Aadhaar Number" value={profileData.aadhaarNumber ? `XXXX XXXX ${profileData.aadhaarNumber.slice(-4)}` : "—"} />
                <InfoRow label="PAN Number" value={profileData.panNumber || "—"} />
                <InfoRow label="Voter ID" value={profileData.voterId || "—"} />
                <InfoRow label="Passport Number" value={profileData.passportNumber || "—"} />
              </div>
            </div>
          )}

          {/* Address Tab */}
          {activeTab === "address" && (
            <div className="space-y-5">
              <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-3">Address Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InfoRow label="State" value={profileData.state || "—"} />
                <InfoRow label="District" value={profileData.district || "—"} />
                <InfoRow label="Block / Tehsil" value={profileData.block || "—"} />
                <InfoRow label="Village / City" value={profileData.village || "—"} />
                <InfoRow label="Pincode" value={profileData.pincode || "—"} />
                <div className="md:col-span-2">
                  <InfoRow label="Full Address" value={profileData.fullAddress || "—"} />
                </div>
              </div>
            </div>
          )}

          {/* Education Tab */}
          {activeTab === "education" && (
            <div className="space-y-5">
              <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-3">Educational Qualifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InfoRow label="Class / Qualification" value={profileData.educationProfile?.className || "—"} />
                <InfoRow label="School / College" value={profileData.educationProfile?.schoolName || "—"} />
                <InfoRow label="Board / University" value={profileData.educationProfile?.board || "—"} />
                <InfoRow label="Percentage / CGPA" value={profileData.educationProfile?.percentage || "—"} />
              </div>
            </div>
          )}

          {/* Healthcare Tab */}
          {activeTab === "healthcare" && (
            <div className="space-y-5">
              <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-3">Health Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InfoRow label="Blood Group" value={profileData.bloodGroup || "—"} />
                <InfoRow label="Allergies" value={profileData.allergies || "—"} />
                <div className="md:col-span-2">
                  <InfoRow label="Medical History" value={profileData.medicalHistory || "—"} />
                </div>
                <InfoRow label="Emergency Contact Name" value={profileData.emergencyContact?.name || "—"} />
                <InfoRow label="Relationship" value={profileData.emergencyContact?.relationship || "—"} />
                <InfoRow label="Emergency Phone" value={profileData.emergencyContact?.phone || "—"} />
              </div>
              {user?.role === "DOCTOR" && profileData.doctorProfile && (
                <div className="mt-5 pt-4 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-3">Doctor Professional Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InfoRow label="Specialization" value={profileData.doctorProfile.specialization || "—"} />
                    <InfoRow label="Experience" value={profileData.doctorProfile.experienceYears ? `${profileData.doctorProfile.experienceYears} years` : "—"} />
                    <InfoRow label="Consultation Fee" value={profileData.doctorProfile.consultationFee ? `₹${profileData.doctorProfile.consultationFee}` : "—"} />
                    <InfoRow label="Registration Number" value={profileData.doctorProfile.registrationNumber || "—"} />
                  </div>
                </div>
              )}
              {user?.role === "TEACHER" && profileData.teacherProfile && (
                <div className="mt-5 pt-4 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-3">Teacher Professional Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InfoRow label="Specialization" value={profileData.teacherProfile.specialization || "—"} />
                    <InfoRow label="Experience" value={profileData.teacherProfile.experienceYears ? `${profileData.teacherProfile.experienceYears} years` : "—"} />
                    <div className="md:col-span-2">
                      <InfoRow label="Qualifications" value={profileData.teacherProfile.qualifications?.join(", ") || "—"} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Agriculture Tab */}
          {activeTab === "agriculture" && (
            <div className="space-y-5">
              <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-3">Farmer / Agriculture Profile</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InfoRow label="Land Size" value={profileData.farmerProfile?.landSize ? `${profileData.farmerProfile.landSize} acres` : "—"} />
                <InfoRow label="Crops" value={profileData.farmerProfile?.crops?.join(", ") || "—"} />
                <InfoRow label="Farming Type" value={profileData.farmerProfile?.farmingType ? profileData.farmerProfile.farmingType.charAt(0).toUpperCase() + profileData.farmerProfile.farmingType.slice(1) : "—"} />
                <InfoRow label="Contract Farmer" value={profileData.farmerProfile?.isContractFarmer ? "Yes" : "No"} />
                <InfoRow label="Farm Location" value={profileData.farmerProfile?.farmLocation || "—"} />
                <InfoRow label="Irrigation Type" value={profileData.farmerProfile?.irrigationType || "—"} />
              </div>
            </div>
          )}

          {/* Finance Tab */}
          {activeTab === "finance" && (
            <div className="space-y-5">
              <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-3">Bank Account Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InfoRow label="Account Holder Name" value={profileData.bankAccount?.accountHolderName || "—"} />
                <InfoRow label="Account Number" value={profileData.bankAccount?.accountNumber ? `XXXX XXXX ${profileData.bankAccount.accountNumber.slice(-4)}` : "—"} />
                <InfoRow label="IFSC Code" value={profileData.bankAccount?.ifsc || "—"} />
                <InfoRow label="Bank Name" value={profileData.bankAccount?.bankName || "—"} />
              </div>
            </div>
          )}

          {/* IT Tab */}
          {activeTab === "it" && (
            <div className="space-y-5">
              <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-3">IT / Development Profile</h3>
              <div className="grid grid-cols-1 gap-5">
                <InfoRow label="Project Type" value={profileData.itProfile?.projectType || "—"} />
                <InfoRow label="Tech Stack" value={profileData.itProfile?.techStack || "—"} />
                <InfoRow label="Experience Level" value={profileData.itProfile?.experience || "—"} />
              </div>
            </div>
          )}

          {/* Social Tab */}
          {activeTab === "social" && (
            <div className="space-y-5">
              <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-3">Social & Media Profile</h3>
              <div className="grid grid-cols-1 gap-5">
                <InfoRow label="Username" value={profileData.socialProfile?.username || "—"} />
                <InfoRow label="Bio" value={profileData.socialProfile?.bio || "—"} />
                <InfoRow label="Interests" value={profileData.socialProfile?.interests || "—"} />
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <InfoRow label="Media Creator" value={profileData.mediaCreatorProfile?.isCreator ? "Enabled" : "Not enabled"} />
                {profileData.mediaCreatorProfile?.isCreator && (
                  <div className="mt-3">
                    <InfoRow label="Media Creator Bio" value={profileData.mediaCreatorProfile.bio || "—"} />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Seller Tab */}
          {activeTab === "seller" && (
            <div className="space-y-5">
              <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-3">E‑commerce Seller Profile</h3>
              <div className="space-y-4">
                <InfoRow label="Seller Status" value={profileData.sellerProfile?.isSeller ? "Registered Seller" : "Not a seller"} />
                {profileData.sellerProfile?.isSeller && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
                    <InfoRow label="Store Name" value={profileData.sellerProfile.storeName || "—"} />
                    <InfoRow label="GST Number" value={profileData.sellerProfile.gstNumber || "—"} />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper component for consistent info rows
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-500 mb-0.5">{label}</p>
      <p className="text-sm font-medium text-gray-800 break-words">{value || "—"}</p>
    </div>
  );
}