// app/profile/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import {
  User, Mail, Phone, Calendar, MapPin, Fingerprint, CreditCard,
  GraduationCap, HeartPulse, Sprout, Wallet, Banknote,
  MonitorSmartphone, Users, Video, Store, Save, Camera, X,
  Loader2, Eye, EyeOff, CheckCircle, AlertCircle, IndianRupee,
  Briefcase, Shield, Globe, Award, ChevronDown, Edit3, ArrowLeft,
  FileText, BadgePercent, Stethoscope,
} from "lucide-react";

// Media URL helper
const MEDIA_BASE_URL = process.env.NEXT_PUBLIC_MEDIA_URL || "http://localhost:5000";
const getMediaUrl = (url: string) => {
  if (!url) return "";
  return url.startsWith("http") ? url : `${MEDIA_BASE_URL}${url}`;
};

export default function ProfilePage() {
  const { user, setUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const degreeInputRef = useRef<HTMLInputElement>(null);
  const regCertInputRef = useRef<HTMLInputElement>(null);

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
    doctorVerification: {
      qualification: "",
      college: "",
      yearOfPassing: "",
      medicalCouncilRegNumber: "",
      degreeCertificate: "",
      registrationCertificate: "",
      verificationStatus: "pending",
    },
    farmerProfile: { landSize: 0, crops: [], farmingType: "conventional", isContractFarmer: false, farmLocation: "", irrigationType: "" },
    educationProfile: { className: "", schoolName: "", board: "", percentage: "" },
    itProfile: { projectType: "", techStack: "", experience: "" },
    socialProfile: { username: "", bio: "", interests: "" },
    mediaCreatorProfile: { isCreator: false, bio: "" },
    sellerProfile: { isSeller: false, storeName: "", gstNumber: "" },
    bankAccount: { accountNumber: "", ifsc: "", bankName: "", accountHolderName: "" },
    licenseStats: { totalLicensesSold: 0, monthlyLicensesSold: 0, salaryEligible: false },
    walletBalance: 0,
    totalEarnings: 0,
  });

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState("");
  const [degreeCertFile, setDegreeCertFile] = useState<File | null>(null);
  const [regCertFile, setRegCertFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [saveMessage, setSaveMessage] = useState({ type: "", text: "" });

  // ========== LOAD PROFILE ==========
  const loadProfile = async () => {
    try {
      const res = await api.get("/users/profile");
      const u = res.data.user;
      setProfileData({
        fullName: u.fullName || "",
        email: u.email || "",
        phone: u.phone || "",
        fatherName: u.fatherName || "",
        motherName: u.motherName || "",
        dob: u.dob ? u.dob.split("T")[0] : "",
        gender: u.gender || "",
        aadhaarNumber: u.aadhaarNumber || "",
        panNumber: u.panNumber || "",
        voterId: u.voterId || "",
        passportNumber: u.passportNumber || "",
        state: u.state || "",
        district: u.district || "",
        block: u.block || "",
        village: u.village || "",
        pincode: u.pincode || "",
        fullAddress: u.fullAddress || "",
        bloodGroup: u.bloodGroup || "",
        allergies: u.allergies || "",
        medicalHistory: u.medicalHistory || "",
        emergencyContact: u.emergencyContact || { name: "", relationship: "", phone: "" },
        teacherProfile: u.teacherProfile || { specialization: "", qualifications: [], experienceYears: 0 },
        doctorProfile: u.doctorProfile || { specialization: "", experienceYears: 0, consultationFee: 0, registrationNumber: "" },
        doctorVerification: u.doctorVerification || {
          qualification: "", college: "", yearOfPassing: "", medicalCouncilRegNumber: "",
          degreeCertificate: "", registrationCertificate: "", verificationStatus: "pending",
        },
        farmerProfile: u.farmerProfile || { landSize: 0, crops: [], farmingType: "conventional", isContractFarmer: false, farmLocation: "", irrigationType: "" },
        educationProfile: u.educationProfile || { className: "", schoolName: "", board: "", percentage: "" },
        itProfile: u.itProfile || { projectType: "", techStack: "", experience: "" },
        socialProfile: u.socialProfile || { username: "", bio: "", interests: "" },
        mediaCreatorProfile: u.mediaCreatorProfile || { isCreator: false, bio: "" },
        sellerProfile: u.sellerProfile || { isSeller: false, storeName: "", gstNumber: "" },
        bankAccount: u.bankAccount || { accountNumber: "", ifsc: "", bankName: "", accountHolderName: "" },
        licenseStats: u.licenseStats || { totalLicensesSold: 0, monthlyLicensesSold: 0, salaryEligible: false },
        walletBalance: u.walletBalance || 0,
        totalEarnings: u.totalEarnings || 0,
      });
      if (u.profileImage) {
        setProfileImagePreview(getMediaUrl(u.profileImage));
      }
    } catch (err) {
      console.error(err);
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
  const updateField = (path: string, value: any) => {
    const keys = path.split(".");
    setProfileData(prev => {
      const newData = { ...prev };
      let current: any = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      updateField(name, (e.target as HTMLInputElement).checked);
    } else {
      updateField(name, value);
    }
  };

  const handleArrayChange = (field: string, value: string) => {
    const arr = value.split(",").map(s => s.trim()).filter(Boolean);
    updateField(field, arr);
  };

  const handleProfilePic = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDegreeCert = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDegreeCertFile(file);
      updateField("doctorVerification.degreeCertificate", file.name); // temp for UI
    }
  };

  const handleRegCert = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setRegCertFile(file);
      updateField("doctorVerification.registrationCertificate", file.name); // temp for UI
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveMessage({ type: "", text: "" });

    const fd = new FormData();
    if (profileImage) fd.append("profileImage", profileImage);
    if (degreeCertFile) fd.append("degreeCertificate", degreeCertFile);
    if (regCertFile) fd.append("registrationCertificate", regCertFile);

    // Append all text fields
    const simpleFields = [
      "fullName", "phone", "fatherName", "motherName", "dob", "gender",
      "aadhaarNumber", "panNumber", "voterId", "passportNumber",
      "state", "district", "block", "village", "pincode", "fullAddress",
      "bloodGroup", "allergies", "medicalHistory",
    ];
    simpleFields.forEach(key => fd.append(key, (profileData as any)[key]));

    // emergency contact
    fd.append("emergencyContactName", profileData.emergencyContact.name);
    fd.append("emergencyContactRelation", profileData.emergencyContact.relationship);
    fd.append("emergencyContactPhone", profileData.emergencyContact.phone);

    // Teacher
    fd.append("teacherSpecialization", profileData.teacherProfile.specialization);
    fd.append("qualifications", profileData.teacherProfile.qualifications.join(","));
    fd.append("teacherExperience", String(profileData.teacherProfile.experienceYears));

    // Doctor
    fd.append("doctorSpecialization", profileData.doctorProfile.specialization);
    fd.append("doctorExperience", String(profileData.doctorProfile.experienceYears));
    fd.append("consultationFee", String(profileData.doctorProfile.consultationFee));
    fd.append("registrationNumber", profileData.doctorProfile.registrationNumber);

    // Doctor Verification
    fd.append("qualification", profileData.doctorVerification.qualification);
    fd.append("college", profileData.doctorVerification.college);
    fd.append("yearOfPassing", String(profileData.doctorVerification.yearOfPassing));
    fd.append("medicalCouncilRegNumber", profileData.doctorVerification.medicalCouncilRegNumber);

    // Farmer
    fd.append("landSize", String(profileData.farmerProfile.landSize));
    fd.append("crops", profileData.farmerProfile.crops.join(","));
    fd.append("farmingType", profileData.farmerProfile.farmingType);
    fd.append("isContractFarmer", String(profileData.farmerProfile.isContractFarmer));
    fd.append("farmLocation", profileData.farmerProfile.farmLocation);
    fd.append("irrigationType", profileData.farmerProfile.irrigationType);

    // Education
    fd.append("className", profileData.educationProfile.className);
    fd.append("schoolName", profileData.educationProfile.schoolName);
    fd.append("board", profileData.educationProfile.board);
    fd.append("percentage", profileData.educationProfile.percentage);

    // IT
    fd.append("projectType", profileData.itProfile.projectType);
    fd.append("techStack", profileData.itProfile.techStack);
    fd.append("experience", profileData.itProfile.experience);

    // Social / Media
    fd.append("username", profileData.socialProfile.username);
    fd.append("bio", profileData.socialProfile.bio);
    fd.append("interests", profileData.socialProfile.interests);
    fd.append("isMediaCreator", String(profileData.mediaCreatorProfile.isCreator));
    fd.append("mediaBio", profileData.mediaCreatorProfile.bio);

    // Seller
    fd.append("isSeller", String(profileData.sellerProfile.isSeller));
    fd.append("storeName", profileData.sellerProfile.storeName);
    fd.append("gstNumber", profileData.sellerProfile.gstNumber);

    // Bank
    fd.append("bankAccount", JSON.stringify(profileData.bankAccount));

    try {
      const res = await api.put("/users/profile", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUser(res.data.user);
      setSaveMessage({ type: "success", text: "Profile updated successfully!" });
      loadProfile();
      setTimeout(() => setSaveMessage({ type: "", text: "" }), 3000);
    } catch (err: any) {
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
    { id: "licenses", label: "Licenses", icon: BadgePercent },
  ];

  // ========== LOADING ==========
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

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex flex-col">
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        {/* Header with integrated photo */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
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
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 bg-white border border-gray-300 text-gray-600 p-1.5 rounded-full shadow-sm hover:bg-gray-50 transition"
                >
                  <Camera size={12} />
                </button>
                <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleProfilePic} />
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
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/services")}
                className="flex items-center gap-2 text-gray-700 hover:text-[#1a237e] font-medium transition border border-gray-300 hover:border-[#1a237e] px-4 py-2.5 rounded-lg text-sm"
              >
                <ArrowLeft size={16} /> Back to Services
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

        {/* Tabs */}
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
            {/* Personal Tab */}
            {activeTab === "basic" && (
              <div className="space-y-5">
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-3">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label><input name="fullName" value={profileData.fullName} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#1a237e] focus:border-transparent text-sm" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input value={profileData.email} disabled className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-gray-50 text-gray-500 text-sm" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label><input name="phone" value={profileData.phone} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#1a237e] focus:border-transparent text-sm" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Father's Name</label><input name="fatherName" value={profileData.fatherName} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#1a237e] focus:border-transparent text-sm" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Mother's Name</label><input name="motherName" value={profileData.motherName} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#1a237e] focus:border-transparent text-sm" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label><input type="date" name="dob" value={profileData.dob} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#1a237e] focus:border-transparent text-sm" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Gender</label><select name="gender" value={profileData.gender} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#1a237e] focus:border-transparent text-sm"><option value="">Select</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select></div>
                </div>
              </div>
            )}

            {/* KYC Tab */}
            {activeTab === "kyc" && (
              <div className="space-y-5">
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-3">Identity Documents</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div><label>Aadhaar Number</label><input name="aadhaarNumber" value={profileData.aadhaarNumber} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm" /></div>
                  <div><label>PAN Number</label><input name="panNumber" value={profileData.panNumber} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm" /></div>
                  <div><label>Voter ID</label><input name="voterId" value={profileData.voterId} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm" /></div>
                  <div><label>Passport Number</label><input name="passportNumber" value={profileData.passportNumber} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm" /></div>
                </div>
              </div>
            )}

            {/* Address Tab */}
            {activeTab === "address" && (
              <div className="space-y-5">
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-3">Address Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div><label>State</label><input name="state" value={profileData.state} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm" /></div>
                  <div><label>District</label><input name="district" value={profileData.district} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm" /></div>
                  <div><label>Block / Tehsil</label><input name="block" value={profileData.block} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm" /></div>
                  <div><label>Village / City</label><input name="village" value={profileData.village} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm" /></div>
                  <div><label>Pincode</label><input name="pincode" value={profileData.pincode} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm" /></div>
                  <div className="md:col-span-2"><label>Full Address</label><textarea name="fullAddress" value={profileData.fullAddress} onChange={handleInputChange} rows={2} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm" /></div>
                </div>
              </div>
            )}

            {/* Education Tab */}
            {activeTab === "education" && (
              <div className="space-y-5">
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-3">Educational Qualifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div><label>Class / Qualification</label><input value={profileData.educationProfile.className} onChange={(e) => updateField("educationProfile.className", e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm" /></div>
                  <div><label>School / College</label><input value={profileData.educationProfile.schoolName} onChange={(e) => updateField("educationProfile.schoolName", e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm" /></div>
                  <div><label>Board / University</label><input value={profileData.educationProfile.board} onChange={(e) => updateField("educationProfile.board", e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm" /></div>
                  <div><label>Percentage / CGPA</label><input value={profileData.educationProfile.percentage} onChange={(e) => updateField("educationProfile.percentage", e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm" /></div>
                </div>
              </div>
            )}

            {/* Healthcare Tab (includes doctor verification) */}
            {activeTab === "healthcare" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-3">Health Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div><label>Blood Group</label><select name="bloodGroup" value={profileData.bloodGroup} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm"><option value="">Select</option><option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>O+</option><option>O-</option><option>AB+</option><option>AB-</option></select></div>
                  <div><label>Allergies</label><input name="allergies" value={profileData.allergies} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm" /></div>
                  <div className="md:col-span-2"><label>Medical History</label><textarea name="medicalHistory" value={profileData.medicalHistory} onChange={handleInputChange} rows={2} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm" /></div>
                  <div><label>Emergency Contact Name</label><input value={profileData.emergencyContact.name} onChange={(e) => updateField("emergencyContact.name", e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm" /></div>
                  <div><label>Relationship</label><input value={profileData.emergencyContact.relationship} onChange={(e) => updateField("emergencyContact.relationship", e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm" /></div>
                  <div><label>Emergency Phone</label><input value={profileData.emergencyContact.phone} onChange={(e) => updateField("emergencyContact.phone", e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm" /></div>
                </div>

                {/* Doctor Professional Details (visible only for DOCTOR role or if data exists) */}
                {(user?.role === "DOCTOR" || user?.modules.includes("HEALTHCARE")) && (
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2"><Stethoscope size={18} /> Doctor Professional Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div><label>Specialization</label><input value={profileData.doctorProfile.specialization} onChange={(e) => updateField("doctorProfile.specialization", e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm" /></div>
                      <div><label>Experience (years)</label><input type="number" value={profileData.doctorProfile.experienceYears} onChange={(e) => updateField("doctorProfile.experienceYears", parseInt(e.target.value))} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm" /></div>
                      <div><label>Consultation Fee (₹)</label><input type="number" value={profileData.doctorProfile.consultationFee} onChange={(e) => updateField("doctorProfile.consultationFee", parseFloat(e.target.value))} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm" /></div>
                      <div><label>Registration Number</label><input value={profileData.doctorProfile.registrationNumber} onChange={(e) => updateField("doctorProfile.registrationNumber", e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm" /></div>
                    </div>

                    <h4 className="font-semibold text-gray-800 mt-5 mb-3 flex items-center gap-2"><Shield size={18} /> Verification Details ({profileData.doctorVerification.verificationStatus})</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div><label>Qualification</label><input value={profileData.doctorVerification.qualification} onChange={(e) => updateField("doctorVerification.qualification", e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm" /></div>
                      <div><label>Medical College</label><input value={profileData.doctorVerification.college} onChange={(e) => updateField("doctorVerification.college", e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm" /></div>
                      <div><label>Year of Passing</label><input value={profileData.doctorVerification.yearOfPassing} onChange={(e) => updateField("doctorVerification.yearOfPassing", e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm" /></div>
                      <div><label>Medical Council Reg. No.</label><input value={profileData.doctorVerification.medicalCouncilRegNumber} onChange={(e) => updateField("doctorVerification.medicalCouncilRegNumber", e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm" /></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Degree Certificate</label>
                        <div className="flex items-center gap-3">
                          <button type="button" onClick={() => degreeInputRef.current?.click()} className="bg-gray-100 px-3 py-1.5 rounded-md text-sm hover:bg-gray-200 border">Upload</button>
                          <input type="file" ref={degreeInputRef} onChange={handleDegreeCert} accept=".jpg,.jpeg,.pdf" hidden />
                          {profileData.doctorVerification.degreeCertificate && (
                            <a href={getMediaUrl(profileData.doctorVerification.degreeCertificate)} target="_blank" className="text-[#1a237e] text-sm underline">View</a>
                          )}
                          {degreeCertFile && <span className="text-green-600 text-xs">✓ New file</span>}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Registration Certificate</label>
                        <div className="flex items-center gap-3">
                          <button type="button" onClick={() => regCertInputRef.current?.click()} className="bg-gray-100 px-3 py-1.5 rounded-md text-sm hover:bg-gray-200 border">Upload</button>
                          <input type="file" ref={regCertInputRef} onChange={handleRegCert} accept=".jpg,.jpeg,.pdf" hidden />
                          {profileData.doctorVerification.registrationCertificate && (
                            <a href={getMediaUrl(profileData.doctorVerification.registrationCertificate)} target="_blank" className="text-[#1a237e] text-sm underline">View</a>
                          )}
                          {regCertFile && <span className="text-green-600 text-xs">✓ New file</span>}
                        </div>
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
                  <div><label>Land Size (acres)</label><input type="number" value={profileData.farmerProfile.landSize} onChange={(e) => updateField("farmerProfile.landSize", parseFloat(e.target.value))} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm" /></div>
                  <div><label>Crops (comma separated)</label><input value={profileData.farmerProfile.crops.join(",")} onChange={(e) => handleArrayChange("farmerProfile.crops", e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm" /></div>
                  <div><label>Farming Type</label><select value={profileData.farmerProfile.farmingType} onChange={(e) => updateField("farmerProfile.farmingType", e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm"><option value="conventional">Conventional</option><option value="organic">Organic</option><option value="mixed">Mixed</option></select></div>
                  <div className="flex items-center pt-6"><label className="flex items-center gap-2"><input type="checkbox" checked={profileData.farmerProfile.isContractFarmer} onChange={(e) => updateField("farmerProfile.isContractFarmer", e.target.checked)} className="w-4 h-4 text-[#1a237e] rounded" /> <span className="text-sm text-gray-700">Contract Farmer</span></label></div>
                  <div><label>Farm Location</label><input value={profileData.farmerProfile.farmLocation} onChange={(e) => updateField("farmerProfile.farmLocation", e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm" /></div>
                  <div><label>Irrigation Type</label><input value={profileData.farmerProfile.irrigationType} onChange={(e) => updateField("farmerProfile.irrigationType", e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm" /></div>
                </div>
              </div>
            )}

            {/* Finance Tab */}
            {activeTab === "finance" && (
              <div className="space-y-5">
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-3">Bank Account Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div><label>Account Holder Name</label><input value={profileData.bankAccount.accountHolderName} onChange={(e) => updateField("bankAccount.accountHolderName", e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm" /></div>
                  <div><label>Account Number</label><input value={profileData.bankAccount.accountNumber} onChange={(e) => updateField("bankAccount.accountNumber", e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm" /></div>
                  <div><label>IFSC Code</label><input value={profileData.bankAccount.ifsc} onChange={(e) => updateField("bankAccount.ifsc", e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm" /></div>
                  <div><label>Bank Name</label><input value={profileData.bankAccount.bankName} onChange={(e) => updateField("bankAccount.bankName", e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm" /></div>
                </div>

                <div className="mt-5 pt-4 border-t border-gray-200">
                  <h4 className="font-semibold">Wallet Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-3">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-gray-600">Wallet Balance</p>
                      <p className="text-2xl font-bold text-green-800">₹{profileData.walletBalance?.toLocaleString("en-IN")}</p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-600">Total Earnings</p>
                      <p className="text-2xl font-bold text-blue-800">₹{profileData.totalEarnings?.toLocaleString("en-IN")}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* IT Tab */}
            {activeTab === "it" && (
              <div className="space-y-5">
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-3">IT / Development Profile</h3>
                <div className="grid grid-cols-1 gap-5">
                  <div><label>Project Type</label><input value={profileData.itProfile.projectType} onChange={(e) => updateField("itProfile.projectType", e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm" /></div>
                  <div><label>Tech Stack</label><input value={profileData.itProfile.techStack} onChange={(e) => updateField("itProfile.techStack", e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm" /></div>
                  <div><label>Experience Level</label><input value={profileData.itProfile.experience} onChange={(e) => updateField("itProfile.experience", e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm" /></div>
                </div>
              </div>
            )}

            {/* Social Tab */}
            {activeTab === "social" && (
              <div className="space-y-5">
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-3">Social & Media Profile</h3>
                <div className="grid grid-cols-1 gap-5">
                  <div><label>Username</label><input value={profileData.socialProfile.username} onChange={(e) => updateField("socialProfile.username", e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm" /></div>
                  <div><label>Bio</label><textarea rows={2} value={profileData.socialProfile.bio} onChange={(e) => updateField("socialProfile.bio", e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm" /></div>
                  <div><label>Interests</label><input value={profileData.socialProfile.interests} onChange={(e) => updateField("socialProfile.interests", e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm" /></div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <label className="flex items-center gap-2"><input type="checkbox" checked={profileData.mediaCreatorProfile.isCreator} onChange={(e) => updateField("mediaCreatorProfile.isCreator", e.target.checked)} className="w-4 h-4 text-[#1a237e] rounded" /> <span className="text-sm font-medium text-gray-700">Enable Media Creator</span></label>
                  {profileData.mediaCreatorProfile.isCreator && <div className="mt-3"><label>Media Creator Bio</label><input value={profileData.mediaCreatorProfile.bio} onChange={(e) => updateField("mediaCreatorProfile.bio", e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm" /></div>}
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
                      <div><label>Store Name</label><input value={profileData.sellerProfile.storeName} onChange={(e) => updateField("sellerProfile.storeName", e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm" /></div>
                      <div><label>GST Number</label><input value={profileData.sellerProfile.gstNumber} onChange={(e) => updateField("sellerProfile.gstNumber", e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm" /></div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Licenses Tab (read‑only) */}
            {activeTab === "licenses" && (
              <div className="space-y-5">
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-3">Your License Sales & Incentives</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="p-4 bg-white border rounded-xl">
                    <p className="text-sm text-gray-500">Total Licenses Sold</p>
                    <p className="text-3xl font-bold text-[#1a237e]">{profileData.licenseStats.totalLicensesSold}</p>
                  </div>
                  <div className="p-4 bg-white border rounded-xl">
                    <p className="text-sm text-gray-500">This Month</p>
                    <p className="text-3xl font-bold text-[#1a237e]">{profileData.licenseStats.monthlyLicensesSold}</p>
                  </div>
                  <div className="p-4 bg-white border rounded-xl">
                    <p className="text-sm text-gray-500">Salary Eligible</p>
                    <p className={`text-3xl font-bold ${profileData.licenseStats.salaryEligible ? "text-green-600" : "text-gray-400"}`}>
                      {profileData.licenseStats.salaryEligible ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-2">Licenses are managed by your reporting officer.</p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}