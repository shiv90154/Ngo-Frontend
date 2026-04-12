"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/config/api";
import {
  User, Mail, Phone, Calendar, MapPin, Fingerprint, CreditCard,
  GraduationCap, HeartPulse, Sprout, Wallet, Banknote,
  MonitorSmartphone, Users, Video, Store, Save, Camera, X,
  Loader2, Eye, EyeOff, CheckCircle, AlertCircle
} from "lucide-react";

export default function ProfilePage() {
  const { user, setUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef(null);

  // ─────────────────────────────────────────────────────────────────
  // State for all editable fields (mirrors backend schema)
  // ─────────────────────────────────────────────────────────────────
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

  // Load user data from API (fresh)
  const loadProfile = async () => {
    try {
      const res = await api.get("/users/profile");
      const userData = res.data.user;
      // Map backend fields to our form state
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

  // Helper to update nested fields
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

    // Append all fields as JSON (backend expects JSON in req.body)
    const jsonData = { ...profileData };
    // Convert nested objects properly
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

    // Teacher
    formData.append("teacherSpecialization", jsonData.teacherProfile.specialization);
    formData.append("qualifications", jsonData.teacherProfile.qualifications.join(","));
    formData.append("teacherExperience", jsonData.teacherProfile.experienceYears);

    // Doctor
    formData.append("doctorSpecialization", jsonData.doctorProfile.specialization);
    formData.append("doctorExperience", jsonData.doctorProfile.experienceYears);
    formData.append("consultationFee", jsonData.doctorProfile.consultationFee);
    formData.append("registrationNumber", jsonData.doctorProfile.registrationNumber);

    // Farmer
    formData.append("landSize", jsonData.farmerProfile.landSize);
    formData.append("crops", jsonData.farmerProfile.crops.join(","));
    formData.append("farmingType", jsonData.farmerProfile.farmingType);
    formData.append("isContractFarmer", jsonData.farmerProfile.isContractFarmer);
    formData.append("farmLocation", jsonData.farmerProfile.farmLocation);
    formData.append("irrigationType", jsonData.farmerProfile.irrigationType);

    // Education
    formData.append("className", jsonData.educationProfile.className);
    formData.append("schoolName", jsonData.educationProfile.schoolName);
    formData.append("board", jsonData.educationProfile.board);
    formData.append("percentage", jsonData.educationProfile.percentage);

    // IT
    formData.append("projectType", jsonData.itProfile.projectType);
    formData.append("techStack", jsonData.itProfile.techStack);
    formData.append("experience", jsonData.itProfile.experience);

    // Social
    formData.append("username", jsonData.socialProfile.username);
    formData.append("bio", jsonData.socialProfile.bio);
    formData.append("interests", jsonData.socialProfile.interests);

    // Media Creator
    formData.append("isMediaCreator", jsonData.mediaCreatorProfile.isCreator);
    formData.append("mediaBio", jsonData.mediaCreatorProfile.bio);

    // Seller
    formData.append("isSeller", jsonData.sellerProfile.isSeller);
    formData.append("storeName", jsonData.sellerProfile.storeName);
    formData.append("gstNumber", jsonData.sellerProfile.gstNumber);

    // Bank
    formData.append("bankAccount", JSON.stringify(jsonData.bankAccount));

    try {
      const res = await api.put("/users/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSaveMessage({ type: "success", text: "Profile updated successfully!" });
      // Refresh user context
      setUser(res.data.user);
      // Reload profile data
      loadProfile();
      setTimeout(() => setSaveMessage({ type: "", text: "" }), 3000);
    } catch (err) {
      setSaveMessage({ type: "error", text: err.response?.data?.message || "Update failed" });
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
      </div>
    );
  }

  const tabs = [
    { id: "basic", label: "Basic Info", icon: User },
    { id: "kyc", label: "KYC / ID", icon: Fingerprint },
    { id: "address", label: "Address", icon: MapPin },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "healthcare", label: "Healthcare", icon: HeartPulse },
    { id: "agriculture", label: "Agriculture", icon: Sprout },
    { id: "finance", label: "Finance & Bank", icon: Wallet },
    { id: "it", label: "IT / CRM", icon: MonitorSmartphone },
    { id: "social", label: "Social & Media", icon: Users },
    { id: "seller", label: "Seller / Store", icon: Store },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            Save Changes
          </button>
        </div>

        {/* Save message */}
        {saveMessage.text && (
          <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
            saveMessage.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
          }`}>
            {saveMessage.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            {saveMessage.text}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - Profile Picture & Tabs */}
          <div className="lg:w-80">
            <div className="bg-white rounded-xl shadow-sm p-5 text-center mb-4">
              <div className="relative inline-block">
                <div className="w-28 h-28 rounded-full bg-gray-200 overflow-hidden mx-auto">
                  {profileImagePreview ? (
                    <img src={profileImagePreview} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
                      {profileData.fullName?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full shadow-md hover:bg-blue-700"
                >
                  <Camera size={14} />
                </button>
                <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleFileChange} />
              </div>
              <h2 className="mt-3 font-semibold text-gray-800">{profileData.fullName || "Your Name"}</h2>
              <p className="text-sm text-gray-500">{profileData.email}</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-left transition ${
                    activeTab === tab.id ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <tab.icon size={18} />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Form */}
          <div className="flex-1 bg-white rounded-xl shadow-sm p-6">
            <form onSubmit={handleSubmit}>
              {/* Basic Info Tab */}
              {activeTab === "basic" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium">Full Name *</label><input name="fullName" value={profileData.fullName} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2" /></div>
                    <div><label className="block text-sm font-medium">Email</label><input value={profileData.email} disabled className="w-full border rounded-lg px-3 py-2 bg-gray-50" /></div>
                    <div><label className="block text-sm font-medium">Phone</label><input name="phone" value={profileData.phone} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2" /></div>
                    <div><label className="block text-sm font-medium">Father's Name</label><input name="fatherName" value={profileData.fatherName} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2" /></div>
                    <div><label className="block text-sm font-medium">Mother's Name</label><input name="motherName" value={profileData.motherName} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2" /></div>
                    <div><label className="block text-sm font-medium">Date of Birth</label><input type="date" name="dob" value={profileData.dob} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2" /></div>
                    <div><label className="block text-sm font-medium">Gender</label><select name="gender" value={profileData.gender} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2"><option value="">Select</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select></div>
                  </div>
                </div>
              )}

              {/* KYC Tab */}
              {activeTab === "kyc" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Identity Documents</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium">Aadhaar Number</label><input name="aadhaarNumber" value={profileData.aadhaarNumber} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2" /></div>
                    <div><label className="block text-sm font-medium">PAN Number</label><input name="panNumber" value={profileData.panNumber} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2" /></div>
                    <div><label className="block text-sm font-medium">Voter ID</label><input name="voterId" value={profileData.voterId} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2" /></div>
                    <div><label className="block text-sm font-medium">Passport Number</label><input name="passportNumber" value={profileData.passportNumber} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2" /></div>
                  </div>
                </div>
              )}

              {/* Address Tab */}
              {activeTab === "address" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Address Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label>State</label><input name="state" value={profileData.state} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2" /></div>
                    <div><label>District</label><input name="district" value={profileData.district} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2" /></div>
                    <div><label>Block / Tehsil</label><input name="block" value={profileData.block} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2" /></div>
                    <div><label>Village / City</label><input name="village" value={profileData.village} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2" /></div>
                    <div><label>Pincode</label><input name="pincode" value={profileData.pincode} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2" /></div>
                    <div className="md:col-span-2"><label>Full Address</label><textarea name="fullAddress" value={profileData.fullAddress} onChange={handleInputChange} rows={2} className="w-full border rounded-lg px-3 py-2" /></div>
                  </div>
                </div>
              )}

              {/* Education Tab */}
              {activeTab === "education" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Education Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label>Class / Qualification</label><input name="educationProfile.className" value={profileData.educationProfile.className} onChange={(e) => updateField("educationProfile.className", e.target.value)} className="w-full border rounded-lg px-3 py-2" /></div>
                    <div><label>School / College</label><input name="educationProfile.schoolName" value={profileData.educationProfile.schoolName} onChange={(e) => updateField("educationProfile.schoolName", e.target.value)} className="w-full border rounded-lg px-3 py-2" /></div>
                    <div><label>Board / University</label><input name="educationProfile.board" value={profileData.educationProfile.board} onChange={(e) => updateField("educationProfile.board", e.target.value)} className="w-full border rounded-lg px-3 py-2" /></div>
                    <div><label>Percentage / CGPA</label><input name="educationProfile.percentage" value={profileData.educationProfile.percentage} onChange={(e) => updateField("educationProfile.percentage", e.target.value)} className="w-full border rounded-lg px-3 py-2" /></div>
                  </div>
                </div>
              )}

              {/* Healthcare Tab */}
              {activeTab === "healthcare" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Healthcare Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label>Blood Group</label><select name="bloodGroup" value={profileData.bloodGroup} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2"><option value="">Select</option><option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>O+</option><option>O-</option><option>AB+</option><option>AB-</option></select></div>
                    <div><label>Allergies</label><input name="allergies" value={profileData.allergies} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2" /></div>
                    <div className="md:col-span-2"><label>Medical History</label><textarea name="medicalHistory" value={profileData.medicalHistory} onChange={handleInputChange} rows={2} className="w-full border rounded-lg px-3 py-2" /></div>
                    <div><label>Emergency Contact Name</label><input value={profileData.emergencyContact.name} onChange={(e) => updateField("emergencyContact.name", e.target.value)} className="w-full border rounded-lg px-3 py-2" /></div>
                    <div><label>Emergency Contact Relation</label><input value={profileData.emergencyContact.relationship} onChange={(e) => updateField("emergencyContact.relationship", e.target.value)} className="w-full border rounded-lg px-3 py-2" /></div>
                    <div><label>Emergency Phone</label><input value={profileData.emergencyContact.phone} onChange={(e) => updateField("emergencyContact.phone", e.target.value)} className="w-full border rounded-lg px-3 py-2" /></div>
                  </div>
                  {/* Doctor specific */}
                  {user?.role === "DOCTOR" && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="font-medium">Doctor Profile</h4>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <div><label>Specialization</label><input value={profileData.doctorProfile.specialization} onChange={(e) => updateField("doctorProfile.specialization", e.target.value)} className="w-full border rounded-lg px-3 py-2" /></div>
                        <div><label>Experience (years)</label><input type="number" value={profileData.doctorProfile.experienceYears} onChange={(e) => updateField("doctorProfile.experienceYears", parseInt(e.target.value))} className="w-full border rounded-lg px-3 py-2" /></div>
                        <div><label>Consultation Fee (₹)</label><input type="number" value={profileData.doctorProfile.consultationFee} onChange={(e) => updateField("doctorProfile.consultationFee", parseFloat(e.target.value))} className="w-full border rounded-lg px-3 py-2" /></div>
                        <div><label>Registration Number</label><input value={profileData.doctorProfile.registrationNumber} onChange={(e) => updateField("doctorProfile.registrationNumber", e.target.value)} className="w-full border rounded-lg px-3 py-2" /></div>
                      </div>
                    </div>
                  )}
                  {user?.role === "TEACHER" && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="font-medium">Teacher Profile</h4>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <div><label>Specialization</label><input value={profileData.teacherProfile.specialization} onChange={(e) => updateField("teacherProfile.specialization", e.target.value)} className="w-full border rounded-lg px-3 py-2" /></div>
                        <div><label>Experience (years)</label><input type="number" value={profileData.teacherProfile.experienceYears} onChange={(e) => updateField("teacherProfile.experienceYears", parseInt(e.target.value))} className="w-full border rounded-lg px-3 py-2" /></div>
                        <div className="col-span-2"><label>Qualifications (comma separated)</label><input value={profileData.teacherProfile.qualifications.join(",")} onChange={(e) => handleArrayChange("teacherProfile.qualifications", e.target.value)} className="w-full border rounded-lg px-3 py-2" /></div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Agriculture Tab */}
              {activeTab === "agriculture" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Agriculture / Farmer Profile</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label>Land Size (acres)</label><input type="number" value={profileData.farmerProfile.landSize} onChange={(e) => updateField("farmerProfile.landSize", parseFloat(e.target.value))} className="w-full border rounded-lg px-3 py-2" /></div>
                    <div><label>Crops (comma separated)</label><input value={profileData.farmerProfile.crops.join(",")} onChange={(e) => handleArrayChange("farmerProfile.crops", e.target.value)} className="w-full border rounded-lg px-3 py-2" /></div>
                    <div><label>Farming Type</label><select value={profileData.farmerProfile.farmingType} onChange={(e) => updateField("farmerProfile.farmingType", e.target.value)} className="w-full border rounded-lg px-3 py-2"><option value="conventional">Conventional</option><option value="organic">Organic</option><option value="mixed">Mixed</option></select></div>
                    <div><label className="flex items-center gap-2"><input type="checkbox" checked={profileData.farmerProfile.isContractFarmer} onChange={(e) => updateField("farmerProfile.isContractFarmer", e.target.checked)} /> Contract Farmer</label></div>
                    <div><label>Farm Location</label><input value={profileData.farmerProfile.farmLocation} onChange={(e) => updateField("farmerProfile.farmLocation", e.target.value)} className="w-full border rounded-lg px-3 py-2" /></div>
                    <div><label>Irrigation Type</label><input value={profileData.farmerProfile.irrigationType} onChange={(e) => updateField("farmerProfile.irrigationType", e.target.value)} className="w-full border rounded-lg px-3 py-2" /></div>
                  </div>
                </div>
              )}

              {/* Finance & Bank Tab */}
              {activeTab === "finance" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Bank Account Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label>Account Holder Name</label><input value={profileData.bankAccount.accountHolderName} onChange={(e) => updateField("bankAccount.accountHolderName", e.target.value)} className="w-full border rounded-lg px-3 py-2" /></div>
                    <div><label>Account Number</label><input value={profileData.bankAccount.accountNumber} onChange={(e) => updateField("bankAccount.accountNumber", e.target.value)} className="w-full border rounded-lg px-3 py-2" /></div>
                    <div><label>IFSC Code</label><input value={profileData.bankAccount.ifsc} onChange={(e) => updateField("bankAccount.ifsc", e.target.value)} className="w-full border rounded-lg px-3 py-2" /></div>
                    <div><label>Bank Name</label><input value={profileData.bankAccount.bankName} onChange={(e) => updateField("bankAccount.bankName", e.target.value)} className="w-full border rounded-lg px-3 py-2" /></div>
                  </div>
                </div>
              )}

              {/* IT Tab */}
              {activeTab === "it" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">IT / Development Profile</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div><label>Project Type</label><input value={profileData.itProfile.projectType} onChange={(e) => updateField("itProfile.projectType", e.target.value)} className="w-full border rounded-lg px-3 py-2" /></div>
                    <div><label>Tech Stack</label><input value={profileData.itProfile.techStack} onChange={(e) => updateField("itProfile.techStack", e.target.value)} className="w-full border rounded-lg px-3 py-2" /></div>
                    <div><label>Experience Level</label><input value={profileData.itProfile.experience} onChange={(e) => updateField("itProfile.experience", e.target.value)} className="w-full border rounded-lg px-3 py-2" /></div>
                  </div>
                </div>
              )}

              {/* Social & Media Tab */}
              {activeTab === "social" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Social & Media Profile</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div><label>Username</label><input value={profileData.socialProfile.username} onChange={(e) => updateField("socialProfile.username", e.target.value)} className="w-full border rounded-lg px-3 py-2" /></div>
                    <div><label>Bio</label><textarea rows={2} value={profileData.socialProfile.bio} onChange={(e) => updateField("socialProfile.bio", e.target.value)} className="w-full border rounded-lg px-3 py-2" /></div>
                    <div><label>Interests</label><input value={profileData.socialProfile.interests} onChange={(e) => updateField("socialProfile.interests", e.target.value)} className="w-full border rounded-lg px-3 py-2" /></div>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <label className="flex items-center gap-2"><input type="checkbox" checked={profileData.mediaCreatorProfile.isCreator} onChange={(e) => updateField("mediaCreatorProfile.isCreator", e.target.checked)} /> Enable Media Creator (Post news / videos)</label>
                    {profileData.mediaCreatorProfile.isCreator && <input placeholder="Media Creator Bio" value={profileData.mediaCreatorProfile.bio} onChange={(e) => updateField("mediaCreatorProfile.bio", e.target.value)} className="mt-2 w-full border rounded-lg px-3 py-2" />}
                  </div>
                </div>
              )}

              {/* Seller Tab */}
              {activeTab === "seller" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">E‑commerce Seller Profile</h3>
                  <div className="space-y-4">
                    <label className="flex items-center gap-2"><input type="checkbox" checked={profileData.sellerProfile.isSeller} onChange={(e) => updateField("sellerProfile.isSeller", e.target.checked)} /> I want to sell products on the platform</label>
                    {profileData.sellerProfile.isSeller && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label>Store Name</label><input value={profileData.sellerProfile.storeName} onChange={(e) => updateField("sellerProfile.storeName", e.target.value)} className="w-full border rounded-lg px-3 py-2" /></div>
                        <div><label>GST Number</label><input value={profileData.sellerProfile.gstNumber} onChange={(e) => updateField("sellerProfile.gstNumber", e.target.value)} className="w-full border rounded-lg px-3 py-2" /></div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Hidden submit button for form submission (already handled by main save button) */}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}