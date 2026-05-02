"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  FaUser,
  FaArrowLeft,
  FaCheckCircle,
  FaCloudUploadAlt,
  FaEye,
  FaEyeSlash,
  FaChevronRight,
  FaIdCard,
} from "react-icons/fa";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Register = () => {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [basicInfo, setBasicInfo] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    dob: "",
    gender: "",
    role: "USER",
  });

  const [identityInfo, setIdentityInfo] = useState({
    aadhaarNumber: "",
    aadhaarImage: null as File | null,
    panNumber: "",
    panImage: null as File | null,
  });

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);

  const aadhaarInputRef = useRef<HTMLInputElement>(null);
  const panInputRef = useRef<HTMLInputElement>(null);
  const profilePicInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (profilePreview) URL.revokeObjectURL(profilePreview);
    };
  }, [profilePreview]);

  const onlyCharacters = (value: string) => {
    return value.replace(/[^a-zA-Z\s]/g, "");
  };

  const onlyNumbers = (value: string) => {
    return value.replace(/[^0-9]/g, "");
  };

  const handleBasicChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    let { name, value } = e.target;

    if (name === "fullName") {
      value = onlyCharacters(value);
    }

    if (name === "phone") {
      value = onlyNumbers(value).slice(0, 10);
    }

    setBasicInfo((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error[name]) {
      setError((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleIdentityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;

    if (name === "aadhaarNumber") {
      value = onlyNumbers(value).slice(0, 12);
    }

    if (name === "panNumber") {
      value = value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10);
    }

    setIdentityInfo((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error[name]) {
      setError((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: "aadhaarImage" | "panImage"
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "application/pdf"];

    if (!allowedTypes.includes(file.type)) {
      setError((prev) => ({
        ...prev,
        [fieldName]: "Only JPG, JPEG, or PDF files are allowed",
      }));
      e.target.value = "";
      return;
    }

    setIdentityInfo((prev) => ({
      ...prev,
      [fieldName]: file,
    }));

    setError((prev) => ({
      ...prev,
      [fieldName]: "",
    }));
  };

  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

    if (!allowedTypes.includes(file.type)) {
      setError((prev) => ({
        ...prev,
        profileImage: "Only JPG, JPEG, or PNG files are allowed",
      }));
      e.target.value = "";
      return;
    }

    setProfileImage(file);

    if (profilePreview) URL.revokeObjectURL(profilePreview);

    setProfilePreview(URL.createObjectURL(file));

    setError((prev) => ({
      ...prev,
      profileImage: "",
    }));
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!basicInfo.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (!/^[a-zA-Z\s]+$/.test(basicInfo.fullName)) {
      newErrors.fullName = "Only characters are allowed";
    }

    if (!basicInfo.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(basicInfo.email)) {
      newErrors.email = "Only Gmail addresses are allowed";
    }

    if (!basicInfo.password) {
      newErrors.password = "Password is required";
    } else if (basicInfo.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!basicInfo.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (basicInfo.password !== basicInfo.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }

    if (!basicInfo.phone) {
      newErrors.phone = "Mobile number is required";
    } else if (!/^\d{10}$/.test(basicInfo.phone)) {
      newErrors.phone = "Mobile number must be 10 digits";
    }

    if (!basicInfo.dob) {
      newErrors.dob = "Date of birth is required";
    }

    if (!basicInfo.gender) {
      newErrors.gender = "Gender is required";
    }

    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};

    if (
      identityInfo.aadhaarNumber &&
      !/^\d{12}$/.test(identityInfo.aadhaarNumber)
    ) {
      newErrors.aadhaarNumber = "Aadhaar must be 12 digits";
    }

    if (
      identityInfo.panNumber &&
      !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(identityInfo.panNumber)
    ) {
      newErrors.panNumber = "Invalid PAN format. Example: ABCDE1234F";
    }

    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep1()) return;
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return;

    setLoading(true);
    setError({});

    const formData = new FormData();

    formData.append("fullName", basicInfo.fullName.trim());
    formData.append("email", basicInfo.email.trim());
    formData.append("password", basicInfo.password);
    formData.append("phone", basicInfo.phone);
    formData.append("dob", basicInfo.dob);
    formData.append("gender", basicInfo.gender);
    formData.append("role", basicInfo.role);

    if (identityInfo.aadhaarNumber) {
      formData.append("aadhaarNumber", identityInfo.aadhaarNumber);
    }

    if (identityInfo.aadhaarImage) {
      formData.append("aadhaarImage", identityInfo.aadhaarImage);
    }

    if (identityInfo.panNumber) {
      formData.append("panNumber", identityInfo.panNumber);
    }

    if (identityInfo.panImage) {
      formData.append("panImage", identityInfo.panImage);
    }

    if (profileImage) {
      formData.append("profileImage", profileImage);
    }

    try {
      await axios.post(`${API_URL}/users/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess("Registration successful! Please verify your email with OTP.");

      setTimeout(() => {
        router.push(`/verify-otp?email=${encodeURIComponent(basicInfo.email)}`);
      }, 2000);
    } catch (err: any) {
      setError({
        submit: err.response?.data?.message || "Registration failed",
      });
    } finally {
      setLoading(false);
    }
  };

  const inputCls = (field: string) =>
    `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a237e] focus:border-[#1a237e] ${
      error[field] ? "border-red-400" : "border-gray-300"
    }`;

  const steps = [
    { number: 1, title: "Basic Info", icon: FaUser },
    { number: 2, title: "Identity", icon: FaIdCard },
  ];

  return (
    <div className="min-h-screen bg-[#f0f2f5] py-8 px-6 md:px-10 lg:px-16">
      <div className="w-full">
        <div className="bg-[#1a237e] rounded-xl mb-6 px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-white/15 border border-white/25 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">SB</span>
            </div>

            <div>
              <h1 className="text-white text-2xl md:text-3xl font-bold leading-tight">
                Samraddh Bharat Foundation
              </h1>
              <p className="text-blue-200 text-xs mt-0.5">
                डिजिटल इंडिया &nbsp;·&nbsp; Citizen Registration Portal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-white/10 border border-white/20 text-white text-xs px-3 py-1 rounded-full">
              Government Initiative
            </span>
            <span className="bg-white/10 border border-white/20 text-white text-xs px-3 py-1 rounded-full">
              Digital India
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 mb-6">
          <div className="flex justify-evenly items-center gap-6 md:gap-12">
            {steps.map((s) => (
              <button
                type="button"
                key={s.number}
                onClick={() => {
                  if (s.number === 1) setStep(1);
                  if (s.number === 2 && validateStep1()) setStep(2);
                }}
                className="flex flex-col items-center group focus:outline-none"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    step > s.number
                      ? "bg-green-600 text-white"
                      : step === s.number
                      ? "bg-[#1a237e] text-white ring-2 ring-blue-300 ring-offset-2"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step > s.number ? "✓" : s.number}
                </div>

                <span
                  className={`text-xs mt-1.5 ${
                    step === s.number
                      ? "text-[#1a237e] font-medium"
                      : "text-gray-400"
                  }`}
                >
                  {s.title}
                </span>
              </button>
            ))}
          </div>

          <div className="relative mt-3 mx-4">
            <div className="absolute top-0 left-0 h-1 bg-gray-200 rounded-full w-full" />
            <div
              className="absolute top-0 left-0 h-1 bg-[#1a237e] rounded-full transition-all duration-300"
              style={{ width: `${((step - 1) / 1) * 100}%` }}
            />
          </div>
        </div>

        {success && (
          <div className="bg-green-50 border-l-4 border-green-600 text-green-700 p-4 rounded-md mb-6 flex items-center gap-2">
            <FaCheckCircle className="text-green-600" />
            <span>{success}</span>
          </div>
        )}

        {error.submit && (
          <div className="bg-red-50 border-l-4 border-red-600 text-red-700 p-4 rounded-md mb-6">
            {error.submit}
          </div>
        )}

        {step === 1 && (
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
              <h2 className="text-xl font-bold text-blue-800 flex items-center gap-2">
                <FaUser className="text-blue-700" /> Step 1: Basic Information
              </h2>
              <p className="text-blue-600 text-sm">
                All fields marked with * are mandatory
              </p>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={basicInfo.fullName}
                    onChange={handleBasicChange}
                    placeholder="Enter your full name"
                    className={inputCls("fullName")}
                  />
                  {error.fullName && (
                    <p className="text-red-500 text-xs mt-1">
                      {error.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={basicInfo.email}
                    onChange={handleBasicChange}
                    placeholder="you@gmail.com"
                    className={inputCls("email")}
                  />
                  {error.email && (
                    <p className="text-red-500 text-xs mt-1">{error.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Password <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={basicInfo.password}
                      onChange={handleBasicChange}
                      placeholder="Min. 6 characters"
                      className={inputCls("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>

                  {error.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {error.password}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={basicInfo.confirmPassword}
                      onChange={handleBasicChange}
                      placeholder="Re-enter password"
                      className={inputCls("confirmPassword")}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>

                  {error.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">
                      {error.confirmPassword}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    maxLength={10}
                    value={basicInfo.phone}
                    onChange={handleBasicChange}
                    placeholder="10-digit mobile number"
                    className={inputCls("phone")}
                  />
                  {error.phone && (
                    <p className="text-red-500 text-xs mt-1">{error.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={basicInfo.dob}
                    onChange={handleBasicChange}
                    className={inputCls("dob")}
                  />
                  {error.dob && (
                    <p className="text-red-500 text-xs mt-1">{error.dob}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="gender"
                    value={basicInfo.gender}
                    onChange={handleBasicChange}
                    className={inputCls("gender")}
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {error.gender && (
                    <p className="text-red-500 text-xs mt-1">{error.gender}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Role Optional
                  </label>
                  <select
                    name="role"
                    value={basicInfo.role}
                    onChange={handleBasicChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a237e] focus:border-[#1a237e]"
                  >
                    <option value="USER">User</option>
                    <option value="DOCTOR">Doctor</option>
                    <option value="TEACHER">Teacher</option>
                    <option value="AGENT">Agent</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end mt-8">
                <button
                  type="button"
                  onClick={handleNext}
                  className="bg-[#1a237e] hover:bg-[#0d1757] text-white font-medium py-2 px-6 rounded-md transition flex items-center gap-2 shadow-sm"
                >
                  Next <FaChevronRight className="text-sm" />
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="bg-yellow-50 px-6 py-4 border-b border-yellow-100">
              <h2 className="text-xl font-bold text-yellow-800 flex items-center gap-2">
                <FaIdCard className="text-yellow-700" /> Step 2: Identity
                Documents
              </h2>
              <p className="text-yellow-600 text-sm">
                Optional but recommended for full access
              </p>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Aadhaar Number
                  </label>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="aadhaarNumber"
                      maxLength={12}
                      placeholder="12-digit Aadhaar"
                      value={identityInfo.aadhaarNumber}
                      onChange={handleIdentityChange}
                      className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a237e] ${
                        error.aadhaarNumber
                          ? "border-red-400"
                          : "border-gray-300"
                      }`}
                    />

                    <button
                      type="button"
                      onClick={() => aadhaarInputRef.current?.click()}
                      className="bg-gray-100 px-3 rounded-md hover:bg-gray-200 text-gray-700 text-sm"
                    >
                      Upload
                    </button>

                    <input
                      type="file"
                      ref={aadhaarInputRef}
                      onChange={(e) => handleFileChange(e, "aadhaarImage")}
                      accept=".jpg,.jpeg,.pdf"
                      className="hidden"
                    />
                  </div>

                  {error.aadhaarNumber && (
                    <p className="text-red-500 text-xs mt-1">
                      {error.aadhaarNumber}
                    </p>
                  )}

                  {error.aadhaarImage && (
                    <p className="text-red-500 text-xs mt-1">
                      {error.aadhaarImage}
                    </p>
                  )}

                  {identityInfo.aadhaarImage && (
                    <p className="text-green-600 text-xs mt-1">
                      ✓ {identityInfo.aadhaarImage.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    PAN Number
                  </label>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="panNumber"
                      maxLength={10}
                      placeholder="ABCDE1234F"
                      value={identityInfo.panNumber}
                      onChange={handleIdentityChange}
                      className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a237e] ${
                        error.panNumber ? "border-red-400" : "border-gray-300"
                      }`}
                    />

                    <button
                      type="button"
                      onClick={() => panInputRef.current?.click()}
                      className="bg-gray-100 px-3 rounded-md hover:bg-gray-200 text-gray-700 text-sm"
                    >
                      Upload
                    </button>

                    <input
                      type="file"
                      ref={panInputRef}
                      onChange={(e) => handleFileChange(e, "panImage")}
                      accept=".jpg,.jpeg,.pdf"
                      className="hidden"
                    />
                  </div>

                  {error.panNumber && (
                    <p className="text-red-500 text-xs mt-1">
                      {error.panNumber}
                    </p>
                  )}

                  {error.panImage && (
                    <p className="text-red-500 text-xs mt-1">
                      {error.panImage}
                    </p>
                  )}

                  {identityInfo.panImage && (
                    <p className="text-green-600 text-xs mt-1">
                      ✓ {identityInfo.panImage.name}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Profile Picture
                </label>

                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border border-gray-300">
                    {profilePreview ? (
                      <img
                        src={profilePreview}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FaUser className="text-gray-400 text-2xl" />
                    )}
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={() => profilePicInputRef.current?.click()}
                      className="bg-gray-100 px-3 py-1.5 rounded-md text-sm hover:bg-gray-200 border border-gray-300"
                    >
                      <FaCloudUploadAlt className="inline mr-1" /> Upload Photo
                    </button>

                    <input
                      type="file"
                      ref={profilePicInputRef}
                      onChange={handleProfilePictureChange}
                      accept=".jpg,.jpeg,.png"
                      className="hidden"
                    />

                    <p className="text-gray-400 text-xs mt-1">JPG, PNG only</p>
                  </div>
                </div>

                {error.profileImage && (
                  <p className="text-red-500 text-xs mt-2">
                    {error.profileImage}
                  </p>
                )}
              </div>

              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={handleBack}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-5 rounded-md transition flex items-center gap-2"
                >
                  <FaArrowLeft /> Back
                </button>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-green-700 hover:bg-green-800 text-white font-medium py-2 px-6 rounded-md transition disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? "Registering..." : "Submit Registration"}{" "}
                  <FaCheckCircle />
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="text-center mt-6 text-gray-500 text-sm">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-[#1a237e] hover:underline font-medium"
          >
            Sign in here
          </a>
        </div>
      </div>
    </div>
  );
};

export default Register;