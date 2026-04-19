// app/profile/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/config/api";
import {
  User, Mail, Phone, Calendar, MapPin, Fingerprint, CreditCard,
  GraduationCap, HeartPulse, Sprout, Wallet, Banknote,
  MonitorSmartphone, Users, Video, Store, Save, Camera, X,
  Loader2, Eye, EyeOff, CheckCircle, AlertCircle, IndianRupee, Briefcase,
  Shield, Globe, Award, ChevronDown, Edit3, ArrowLeft
} from "lucide-react";

export default function ProfilePage() {
  const { user, setUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef(null);

  // ========== STATE ==========
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phone: "",
    fatherName: "",
    motherName: "",
    dob: "",
    gender: "",
    aadhaarNumber: "",
    panNumber: "",
    voterId: "",
    passportNumber: "",
    state: "",
    district: "",
    block: "",
    village: "",
    pincode: "",
    fullAddress: "",
    bloodGroup: "",
    allergies: "",
    medicalHistory: "",
    emergencyContact: { name: "", relationship: "", phone: "" },
    teacherProfile: { specialization: "", qualifications: [], experienceYears: 0 },
    doctorProfile: { specialization: "", experienceYears: 0, consultationFee: 0, registrationNumber: "" },
    farmerProfile: { landSize: 0, crops: [], farmingType: "conventional", isContractFarmer: false, farmLocation: "", irrigationType: "" },
    educationProfile: { className: "", schoolName: "", board: "", percentage: "" },
    itProfile: { projectType: "", techStack: "", experience: "" },
    socialProfile: { username: "", bio: "", interests: "" },
    mediaCreatorProfile: { isCreator: false, bio: "" },
    sellerProfile: { isSeller: false, storeName: "", gstNumber: "" },
    bankAccount: { accountNumber: "", ifsc: "", bankName: "", accountHolderName: "" },
  });

  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [saveMessage, setSaveMessage] = useState({ type: "", text: "" });

  // ========== LOAD PROFILE ==========
  const loadProfile = async () => {
    try {
      const res = await api.get("/users/profile");
      const userData = res.data.user;
      setProfileData({
        fullName: userData.fullName || "",
        email: userData.email || "",
        phone: userData.phone || "",
        fatherName: userData.fatherName || "",
        motherName: userData.motherName || "",
        dob: userData.dob ? userData.dob.split("T")[0] : "",
        gender: userData.gender || "",
        aadhaarNumber: userData.aadhaarNumber || "",
        panNumber: userData.panNumber || "",
        voterId: userData.voterId || "",
        passportNumber: userData.passportNumber || "",
        state: userData.state || "",
        district: userData.district || "",
        block: userData.block || "",
        village: userData.village || "",
        pincode: userData.pincode || "",
        fullAddress: userData.fullAddress || "",
        bloodGroup: userData.bloodGroup || "",
        allergies: userData.allergies || "",
        medicalHistory: userData.medicalHistory || "",
        emergencyContact: userData.emergencyContact || { name: "", relationship: "", phone: "" },
        teacherProfile: userData.teacherProfile || { specialization: "", qualifications: [], experienceYears: 0 },
        doctorProfile: userData.doctorProfile || { specialization: "", experienceYears: 0, consultationFee: 0, registrationNumber: "" },
        farmerProfile: userData.farmerProfile || { landSize: 0, crops: [], farmingType: "conventional", isContractFarmer: false, farmLocation: "", irrigationType: "" },
        educationProfile: userData.educationProfile || { className: "", schoolName: "", board: "", percentage: "" },
        itProfile: userData.itProfile || { projectType: "", techStack: "", experience: "" },
        socialProfile: userData.socialProfile || { username: "", bio: "", interests: "" },
        mediaCreatorProfile: userData.mediaCreatorProfile || { isCreator: false, bio: "" },
        sellerProfile: userData.sellerProfile || { isSeller: false, storeName: "", gstNumber: "" },
        bankAccount: userData.bankAccount || { accountNumber: "", ifsc: "", bankName: "", accountHolderName: "" },
      });
      if (userData.profileImage) setProfileImagePreview(userData.profileImage);
    } catch (err) {
      console.error("Load profile error:", err);
      if (err.response?.status === 401) router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
    else if (user) loadProfile();
  }, [user, authLoading]);

  // ========== HELPERS ==========
  const updateField = (path, value) => {
    const keys = path.split(".");
    setProfileData(prev => {
      let newData = { ...prev };
      let current = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      updateField(name, checked);
    } else {
      updateField(name, value);
    }
  };

  const handleArrayChange = (field, value) => {
    const arr = value.split(",").map(s => s.trim()).filter(Boolean);
    updateField(field, arr);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveMessage({ type: "", text: "" });

    const formData = new FormData();
    if (profileImage) formData.append("profileImage", profileImage);

    const jsonData = { ...profileData };
    formData.append("fullName", jsonData.fullName);
    formData.append("phone", jsonData.phone);
    formData.append("fatherName", jsonData.fatherName);
    formData.append("motherName", jsonData.motherName);
    formData.append("dob", jsonData.dob);
    formData.append("gender", jsonData.gender);
    formData.append("aadhaarNumber", jsonData.aadhaarNumber);
    formData.append("panNumber", jsonData.panNumber);
    formData.append("voterId", jsonData.voterId);
    formData.append("passportNumber", jsonData.passportNumber);
    formData.append("state", jsonData.state);
    formData.append("district", jsonData.district);
    formData.append("block", jsonData.block);
    formData.append("village", jsonData.village);
    formData.append("pincode", jsonData.pincode);
    formData.append("fullAddress", jsonData.fullAddress);
    formData.append("bloodGroup", jsonData.bloodGroup);
    formData.append("allergies", jsonData.allergies);
    formData.append("medicalHistory", jsonData.medicalHistory);
    formData.append("emergencyContactName", jsonData.emergencyContact.name);
    formData.append("emergencyContactRelation", jsonData.emergencyContact.relationship);
    formData.append("emergencyContactPhone", jsonData.emergencyContact.phone);
    formData.append("teacherSpecialization", jsonData.teacherProfile.specialization);
    formData.append("qualifications", jsonData.teacherProfile.qualifications.join(","));
    formData.append("teacherExperience", jsonData.teacherProfile.experienceYears);
    formData.append("doctorSpecialization", jsonData.doctorProfile.specialization);
    formData.append("doctorExperience", jsonData.doctorProfile.experienceYears);
    formData.append("consultationFee", jsonData.doctorProfile.consultationFee);
    formData.append("registrationNumber", jsonData.doctorProfile.registrationNumber);
    formData.append("landSize", jsonData.farmerProfile.landSize);
    formData.append("crops", jsonData.farmerProfile.crops.join(","));
    formData.append("farmingType", jsonData.farmerProfile.farmingType);
    formData.append("isContractFarmer", jsonData.farmerProfile.isContractFarmer);
    formData.append("farmLocation", jsonData.farmerProfile.farmLocation);
    formData.append("irrigationType", jsonData.farmerProfile.irrigationType);
    formData.append("className", jsonData.educationProfile.className);
    formData.append("schoolName", jsonData.educationProfile.schoolName);
    formData.append("board", jsonData.educationProfile.board);
    formData.append("percentage", jsonData.educationProfile.percentage);
    formData.append("projectType", jsonData.itProfile.projectType);
    formData.append("techStack", jsonData.itProfile.techStack);
    formData.append("experience", jsonData.itProfile.experience);
    formData.append("username", jsonData.socialProfile.username);
    formData.append("bio", jsonData.socialProfile.bio);
    formData.append("interests", jsonData.socialProfile.interests);
    formData.append("isMediaCreator", jsonData.mediaCreatorProfile.isCreator);
    formData.append("mediaBio", jsonData.mediaCreatorProfile.bio);
    formData.append("isSeller", jsonData.sellerProfile.isSeller);
    formData.append("storeName", jsonData.sellerProfile.storeName);
    formData.append("gstNumber", jsonData.sellerProfile.gstNumber);
    formData.append("bankAccount", JSON.stringify(jsonData.bankAccount));

    try {
      const res = await api.put("/users/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSaveMessage({ type: "success", text: "Profile updated successfully!" });
      setUser(res.data.user);
      loadProfile();
      setTimeout(() => setSaveMessage({ type: "", text: "" }), 3000);
    } catch (err) {
      setSaveMessage({ type: "error", text: err.response?.data?.message || "Update failed" });
    } finally {
      setSaving(false);
    }
  };

  // ========== TABS ==========
  const tabs = [
    { id: "basic", label: "Personal", icon: User },
    { id: "kyc", label: "KYC", icon: Fingerprint },
    { id: "address", label: "Address", icon: MapPin },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "healthcare", label: "Health", icon: HeartPulse },
    { id: "agriculture", label: "Agriculture", icon: Sprout },
    { id: "finance", label: "Banking", icon: Wallet },
    { id: "it", label: "IT", icon: MonitorSmartphone },
    { id: "social", label: "Social", icon: Users },
    { id: "seller", label: "Seller", icon: Store },
  ];

  // ========== LOADING STATES ==========
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

  // ========== COMPACT GOVERNMENT PORTAL STYLE ==========
  return (
    <div className="min-h-screen bg-[#f0f2f5] flex flex-col">
      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        {/* Page Header with integrated profile photo */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Profile Photo inline */}
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden border-2 border-[#1a237e]/20 shadow-sm">
                  {profileImagePreview ? (
                    <img src={profileImagePreview} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#1a237e] to-[#283593] flex items-center justify-center text-white text-xl font-semibold">
                      {profileData.fullName?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="absolute -bottom-1 -right-1 bg-white border border-gray-300 text-gray-600 p-1.5 rounded-full shadow-sm hover:bg-gray-50 transition"
                >
                  <Camera size={12} />
                </button>
                <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleFileChange} />
              </div>
              
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl md:text-2xl font-bold text-[#1a237e] font-serif">My Profile</h1>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                    {user?.role?.replace(/_/g, ' ') || "USER"}
                  </span>
                </div>
                <p className="text-sm text-gray-500">Manage your personal information and service preferences</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-medium text-gray-800">{profileData.fullName}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm text-gray-600">{profileData.email}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/services")}
                className="flex items-center gap-2 text-gray-700 hover:text-[#1a237e] font-medium transition border border-gray-300 hover:border-[#1a237e] px-4 py-2.5 rounded-lg text-sm"
              >
                <ArrowLeft size={16} />
                Back to Services
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="flex items-center gap-2 bg-[#1a237e] hover:bg-[#0d1757] text-white font-medium px-5 py-2.5 rounded-lg shadow-sm transition disabled:opacity-50 text-sm"
              >
                {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>

        {/* Save Message */}
        {saveMessage.text && (
          <div className={`mb-5 p-4 rounded-lg flex items-center gap-3 shadow-sm text-sm ${
            saveMessage.type === "success" 
              ? "bg-green-50 text-green-800 border-l-4 border-green-600" 
              : "bg-red-50 text-red-800 border-l-4 border-red-600"
          }`}>
            {saveMessage.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            {saveMessage.text}
          </div>
        )}

        {/* Horizontal Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-5 overflow-x-auto">
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

        {/* Form Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 md:p-6">
          <form onSubmit={handleSubmit}>
            {/* Personal Details Tab */}
            {activeTab === "basic" && (
              <div className="space-y-5">
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-3">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                    <input name="fullName" value={profileData.fullName} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#1a237e] focus:border-transparent text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email ID</label>
                    <input value={profileData.email} disabled className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-gray-50 text-gray-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                    <input name="phone" value={profileData.phone} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#1a237e] focus:border-transparent text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Father's Name</label>
                    <input name="fatherName" value={profileData.fatherName} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#1a237e] focus:border-transparent text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mother's Name</label>
                    <input name="motherName" value={profileData.motherName} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#1a237e] focus:border-transparent text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                    <input type="date" name="dob" value={profileData.dob} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#1a237e] focus:border-transparent text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select name="gender" value={profileData.gender} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#1a237e] focus:border-transparent text-sm">
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Identity & KYC Tab */}
            {activeTab === "kyc" && (
              <div className="space-y-5">
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-3">Identity Documents</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar Number</label><input name="aadhaarNumber" value={profileData.aadhaarNumber} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#1a237e] focus:border-transparent text-sm" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label><input name="panNumber" value={profileData.panNumber} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#1a237e] focus:border-transparent text-sm" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Voter ID</label><input name="voterId" value={profileData.voterId} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#1a237e] focus:border-transparent text-sm" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Passport Number</label><input name="passportNumber" value={profileData.passportNumber} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#1a237e] focus:border-transparent text-sm" /></div>
                </div>
              </div>
            )}

            {/* Address Tab */}
            {activeTab === "address" && (
              <div className="space-y-5">
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-3">Address Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">State</label><input name="state" value={profileData.state} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#1a237e] focus:border-transparent text-sm" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">District</label><input name="district" value={profileData.district} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#1a237e] focus:border-transparent text-sm" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Block / Tehsil</label><input name="block" value={profileData.block} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#1a237e] focus:border-transparent text-sm" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Village / City</label><input name="village" value={profileData.village} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#1a237e] focus:border-transparent text-sm" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label><input name="pincode" value={profileData.pincode} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#1a237e] focus:border-transparent text-sm" /></div>
                  <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label><textarea name="fullAddress" value={profileData.fullAddress} onChange={handleInputChange} rows={2} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#1a237e] focus:border-transparent text-sm" /></div>
                </div>
              </div>
            )}

            {/* Education Tab */}
            {activeTab === "education" && (
              <div className="space-y-5">
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-3">Educational Qualifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Class / Qualification</label><input value={profileData.educationProfile.className} onChange={(e) => updateField("educationProfile.className", e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#1a237e] focus:border-transparent text-sm" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">School / College</label><input value={profileData.educationProfile.schoolName} onChange={(e) => updateField("educationProfile.schoolName", e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#1a237e] focus:border-transparent text-sm" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Board / University</label><input value={profileData.educationProfile.board} onChange={(e) => updateField("educationProfile.board", e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#1a237e] focus:border-transparent text-sm" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Percentage / CGPA</label><input value={profileData.educationProfile.percentage} onChange={(e) => updateField("educationProfile.percentage", e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#1a237e] focus:border-transparent text-sm" /></div>
                </div>
              </div>
            )}

            {/* Healthcare Tab */}
            {activeTab === "healthcare" && (
              <div className="space-y-5">
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-3">Health Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label><select name="bloodGroup" value={profileData.bloodGroup} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#1a237e] focus:border-transparent text-sm"><option value="">Select</option><option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>O+</option><option>O-</option><option>AB+</option><option>AB-</option></select></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Allergies</label><input name="allergies" value={profileData.allergies} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#1a237e] focus:border-transparent text-sm" /></div>
                  <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Medical History</label><textarea name="medicalHistory" value={profileData.medicalHistory} onChange={handleInputChange} rows={2} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#1a237e] focus:border-transparent text-sm" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Name</label><input value={profileData.emergencyContact.name} onChange={(e) => updateField("emergencyContact.name", e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#1a237e] focus:border-transparent text-sm" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label><input value={profileData.emergencyContact.relationship} onChange={(e) => updateField("emergencyContact.relationship", e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#1a237e] focus:border-transparent text-sm" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Emergency Phone</label><input value={profileData.emergencyContact.phone} onChange={(e) => updateField("emergencyContact.phone", e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#1a237e] focus:border-transparent text-sm" /></div>
                </div>
                {user?.role === "DOCTOR" && (
                  <div className="mt-5 pt-4 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-3">Doctor Professional Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div><label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label><input value={profileData.doctorProfile.specialization} onChange={(e) => updateField("doctorProfile.specialization", e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#1a237e] focus:border-transparent text-sm" /></div>
                      <div><label className="block text-sm font-medium text-gray-700 mb-1">Experience (years)</label><input type="number" value={profileData.doctorProfile.experienceYears} onChange={(e) => updateField("doctorProfile.experienceYears", parseInt(e.target.value))} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#1a237e] focus:border-transparent text-sm" /></div>
                      <div><label className="block text-sm font-medium text-gray-700 mb-1">Consultation Fee (₹)</label><input type="number" value={profileData.doctorProfile.consultationFee} onChange={(e) => updateField("doctorProfile.consultationFee", parseFloat(e.target.value))} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#1a237e] focus:border-transparent text-sm" /></div>
                      <div><label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label><input value={profileData.doctorProfile.registrationNumber} onChange={(e) => updateField("doctorProfile.registrationNumber", e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#1a237e] focus:border-transparent text-sm" /></div>
                    </div>
                  </div>
                )}
                {user?.role === "TEACHER" && (
                  <div className="mt-5 pt-4 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-3">Teacher Professional Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div><label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label><input value={profileData.teacherProfile.specialization} onChange={(e) => updateField("teacherProfile.specialization", e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#1a237e] focus:border-transparent text-sm" /></div>
                      <div><label className="block text-sm font-medium text-gray-700 mb-1">Experience (years)</label><input type="number" value={profileData.teacherProfile.experienceYears} onChange={(e) => updateField("teacherProfile.experienceYears", parseInt(e.target.value))} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#1a237e] focus:border-transparent text-sm" /></div>
                      <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Qualifications (comma separated)</label><input value={profileData.teacherProfile.qualifications.join(",")} onChange={(e) => handleArrayChange("teacherProfile.qualifications", e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#1a237e] focus:border-transparent text-sm" /></div>
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
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Land Size (acres)</label><input type="number" value={profileData.farmerProfile.landSize} onChange={(e) => updateField("farmerProfile.landSize", parseFloat(e.target.value))} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#1a237e] focus:border-transparent text-sm" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Crops (comma separated)</label><input value={profileData.farmerProfile.crops.join(",")} onChange={(e) => handleArrayChange("farmerProfile.crops", e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#1a237e] focus:border-transparent text-sm" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Farming Type</label><select value={profileData.farmerProfile.farmingType} onChange={(e) => updateField("farmerProfile.farmingType", e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#1a237e] focus:border-transparent text-sm"><option value="conventional">Conventional</option><option value="organic">Organic</option><option value="mixed">Mixed</option></select></div>
                  <div className="flex items-center pt-6"><label className="flex items-center gap-2"><input type="checkbox" checked={profileData.farmerProfile.isContractFarmer} onChange={(e) => updateField("farmerProfile.isContractFarmer", e.target.checked)} className="w-4 h-4 text-[#1a237e] rounded" /> <span className="text-sm text-gray-700">Contract Farmer</span></label></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Farm Location</label><input value={profileData.farmerProfile.farmLocation} onChange={(e) => updateField("farmerProfile.farmLocation", e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#1a237e] focus:border-transparent text-sm" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Irrigation Type</label><input value={profileData.farmerProfile.irrigationType} onChange={(e) => updateField("farmerProfile.irrigationType", e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#1a237e] focus:border-transparent text-sm" /></div>
                </div>
              </div>
            )}

            {/* Finance Tab */}
            {activeTab === "finance" && (
              <div className="space-y-5">
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-3">Bank Account Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name</label><input value={profileData.bankAccount.accountHolderName} onChange={(e) => updateField("bankAccount.accountHolderName", e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#1a237e] focus:border-transparent text-sm" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label><input value={profileData.bankAccount.accountNumber} onChange={(e) => updateField("bankAccount.accountNumber", e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#1a237e] focus:border-transparent text-sm" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label><input value={profileData.bankAccount.ifsc} onChange={(e) => updateField("bankAccount.ifsc", e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#1a237e] focus:border-transparent text-sm" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label><input value={profileData.bankAccount.bankName} onChange={(e) => updateField("bankAccount.bankName", e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#1a237e] focus:border-transparent text-sm" /></div>
                </div>
              </div>
            )}

            {/* IT Tab */}
            {activeTab === "it" && (
              <div className="space-y-5">
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-3">IT / Development Profile</h3>
                <div className="grid grid-cols-1 gap-5">
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Project Type</label><input value={profileData.itProfile.projectType} onChange={(e) => updateField("itProfile.projectType", e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#1a237e] focus:border-transparent text-sm" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Tech Stack</label><input value={profileData.itProfile.techStack} onChange={(e) => updateField("itProfile.techStack", e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#1a237e] focus:border-transparent text-sm" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label><input value={profileData.itProfile.experience} onChange={(e) => updateField("itProfile.experience", e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#1a237e] focus:border-transparent text-sm" /></div>
                </div>
              </div>
            )}

            {/* Social Tab */}
            {activeTab === "social" && (
              <div className="space-y-5">
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-3">Social & Media Profile</h3>
                <div className="grid grid-cols-1 gap-5">
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Username</label><input value={profileData.socialProfile.username} onChange={(e) => updateField("socialProfile.username", e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#1a237e] focus:border-transparent text-sm" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Bio</label><textarea rows={2} value={profileData.socialProfile.bio} onChange={(e) => updateField("socialProfile.bio", e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#1a237e] focus:border-transparent text-sm" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Interests</label><input value={profileData.socialProfile.interests} onChange={(e) => updateField("socialProfile.interests", e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#1a237e] focus:border-transparent text-sm" /></div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <label className="flex items-center gap-2"><input type="checkbox" checked={profileData.mediaCreatorProfile.isCreator} onChange={(e) => updateField("mediaCreatorProfile.isCreator", e.target.checked)} className="w-4 h-4 text-[#1a237e] rounded" /> <span className="text-sm font-medium text-gray-700">Enable Media Creator (Post news / videos)</span></label>
                  {profileData.mediaCreatorProfile.isCreator && <div className="mt-3"><label className="block text-sm font-medium text-gray-700 mb-1">Media Creator Bio</label><input placeholder="Tell about your media work" value={profileData.mediaCreatorProfile.bio} onChange={(e) => updateField("mediaCreatorProfile.bio", e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#1a237e] focus:border-transparent text-sm" /></div>}
                </div>
              </div>
            )}

            {/* Seller Tab */}
            {activeTab === "seller" && (
              <div className="space-y-5">
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-3">E‑commerce Seller Profile</h3>
                <div className="space-y-4">
                  <label className="flex items-center gap-2"><input type="checkbox" checked={profileData.sellerProfile.isSeller} onChange={(e) => updateField("sellerProfile.isSeller", e.target.checked)} className="w-4 h-4 text-[#1a237e] rounded" /> <span className="text-sm font-medium text-gray-700">I want to sell products on the platform</span></label>
                  {profileData.sellerProfile.isSeller && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div><label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label><input value={profileData.sellerProfile.storeName} onChange={(e) => updateField("sellerProfile.storeName", e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#1a237e] focus:border-transparent text-sm" /></div>
                      <div><label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label><input value={profileData.sellerProfile.gstNumber} onChange={(e) => updateField("sellerProfile.gstNumber", e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#1a237e] focus:border-transparent text-sm" /></div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}