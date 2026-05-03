"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  FaUser, FaArrowLeft, FaCheckCircle, FaCloudUploadAlt,
  FaEye, FaEyeSlash, FaChevronRight, FaIdCard, FaStethoscope,
  FaChalkboardTeacher, FaTractor, FaLaptopCode, FaStore,
} from "react-icons/fa";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ────────────────────────────────────────────
// Module field groups
// ────────────────────────────────────────────
const MODULE_FIELDS: Record<string, {
  label: string;
  required?: boolean;
  type: "text" | "file" | "select" | "date" | "checkbox";
  options?: string[];
}> = {
  // TEACHER
  specialization: { label: "Specialization (Teacher)", type: "text", required: true },
  qualifications: { label: "Qualifications (comma)", type: "text" },
  teacherExperience: { label: "Experience (years)", type: "text" },
  // DOCTOR
  doctorSpecialization: { label: "Specialization (Doctor)", type: "text", required: true },
  doctorExperience: { label: "Experience (years)", type: "text" },
  consultationFee: { label: "Consultation Fee (₹)", type: "text" },
  registrationNumber: { label: "Registration Number", type: "text", required: true },
  qualification: { label: "Qualification", type: "text", required: true },
  college: { label: "Medical College", type: "text", required: true },
  yearOfPassing: { label: "Year of Passing", type: "text" },
  medicalCouncilRegNumber: { label: "Medical Council Reg. No.", type: "text" },
  degreeCertificate: { label: "Degree Certificate", type: "file" },
  registrationCertificate: { label: "Registration Certificate", type: "file" },
  // FARMER
  farmLocation: { label: "Farm Location", type: "text" },
  irrigationType: { label: "Irrigation Type", type: "text" },
  isContractFarmer: { label: "Contract Farmer?", type: "checkbox" },
  // STUDENT (EDUCATION)
  className: { label: "Class", type: "text" },
  schoolName: { label: "School Name", type: "text" },
  board: { label: "Board", type: "text" },
  percentage: { label: "Percentage", type: "text" },
  // IT
  projectType: { label: "Project Type", type: "text" },
  techStack: { label: "Tech Stack", type: "text" },
  itExperience: { label: "Experience (years)", type: "text" },
  // MEDIA
  username: { label: "Username", type: "text" },
  bio: { label: "Bio", type: "text" },
  interests: { label: "Interests (comma)", type: "text" },
  isMediaCreator: { label: "I want to create posts", type: "checkbox" },
  // SELLER (ECOMMERCE)
  storeName: { label: "Store Name", type: "text" },
  gstNumber: { label: "GST Number", type: "text" },
  isSeller: { label: "I want to sell products", type: "checkbox" },
};

// Which fields belong to which module
const MODULE_FIELD_MAP: Record<string, string[]> = {
  EDUCATION: ["specialization","qualifications","teacherExperience","className","schoolName","board","percentage"],
  AGRICULTURE: ["farmLocation","irrigationType","isContractFarmer"],
  FINANCE: [], // no extra fields; bank details can be added later
  HEALTHCARE: ["doctorSpecialization","doctorExperience","consultationFee","registrationNumber",
               "qualification","college","yearOfPassing","medicalCouncilRegNumber",
               "degreeCertificate","registrationCertificate"],
  SOCIAL: ["username","bio","interests"],
  IT: ["projectType","techStack","itExperience"],
  MEDIA: ["username","bio","interests","isMediaCreator"],
  ECOMMERCE: ["storeName","gstNumber","isSeller"],
};

const Register = () => {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [basicInfo, setBasicInfo] = useState({
    fullName: "", email: "", password: "", confirmPassword: "",
    phone: "", dob: "", gender: "", role: "USER",
  });

  const [identityInfo, setIdentityInfo] = useState({
    aadhaarNumber: "", aadhaarImage: null as File | null,
    panNumber: "", panImage: null as File | null,
  });

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);

  // Selected modules (array)
  const [selectedModules, setSelectedModules] = useState<string[]>([]);

  // All extra fields (text/checkbox values)
  const [extraFields, setExtraFields] = useState<Record<string, any>>({});
  // File objects
  const [extraFiles, setExtraFiles] = useState<Record<string, File | null>>({});

  // Input refs for identity
  const aadhaarInputRef = useRef<HTMLInputElement>(null);
  const panInputRef = useRef<HTMLInputElement>(null);
  const profilePicInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => { if (profilePreview) URL.revokeObjectURL(profilePreview); };
  }, [profilePreview]);

  // helpers
  const onlyChars = (v: string) => v.replace(/[^a-zA-Z\s]/g, "");
  const onlyNums = (v: string) => v.replace(/[^0-9]/g, "");

  const handleBasicChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let { name, value } = e.target;
    if (name === "fullName") value = onlyChars(value);
    if (name === "phone") value = onlyNums(value).slice(0, 10);
    setBasicInfo(prev => ({ ...prev, [name]: value }));
    if (error[name]) setError(prev => ({ ...prev, [name]: "" }));
  };

  const handleIdentityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;
    if (name === "aadhaarNumber") value = onlyNums(value).slice(0, 12);
    if (name === "panNumber") value = value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10);
    setIdentityInfo(prev => ({ ...prev, [name]: value }));
    if (error[name]) setError(prev => ({ ...prev, [name]: "" }));
  };

  const handleIdentityFile = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/jpg", "application/pdf", "image/png"].includes(file.type)) {
      setError(prev => ({ ...prev, [field]: "Only JPG, PDF, PNG allowed" }));
      e.target.value = "";
      return;
    }
    setIdentityInfo(prev => ({ ...prev, [field]: file }));
    if (error[field]) setError(prev => ({ ...prev, [field]: "" }));
  };

  const handleProfilePic = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
      setError(prev => ({ ...prev, profileImage: "Only JPG/PNG allowed" }));
      e.target.value = "";
      return;
    }
    setProfileImage(file);
    if (profilePreview) URL.revokeObjectURL(profilePreview);
    setProfilePreview(URL.createObjectURL(file));
    if (error.profileImage) setError(prev => ({ ...prev, profileImage: "" }));
  };

  // Module toggle
  const toggleModule = (mod: string) => {
    setSelectedModules(prev =>
      prev.includes(mod) ? prev.filter(m => m !== mod) : [...prev, mod]
    );
  };

  // extra field change
  const handleExtraChange = (name: string, value: string | boolean) => {
    setExtraFields(prev => ({ ...prev, [name]: value }));
    if (error[name]) setError(prev => ({ ...prev, [name]: "" }));
  };

  const handleExtraFile = (name: string, file: File | null) => {
    setExtraFiles(prev => ({ ...prev, [name]: file }));
    if (error[name]) setError(prev => ({ ...prev, [name]: "" }));
  };

  // Validations
  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!basicInfo.fullName.trim()) e.fullName = "Full name required";
    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(basicInfo.email)) e.email = "Only Gmail allowed";
    if (basicInfo.password.length < 6) e.password = "Min 6 characters";
    if (basicInfo.password !== basicInfo.confirmPassword) e.confirmPassword = "Passwords don't match";
    if (!/^\d{10}$/.test(basicInfo.phone)) e.phone = "10 digits required";
    if (!basicInfo.dob) e.dob = "Date of birth required";
    if (!basicInfo.gender) e.gender = "Gender required";
    setError(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e: Record<string, string> = {};
    if (identityInfo.aadhaarNumber && !/^\d{12}$/.test(identityInfo.aadhaarNumber)) e.aadhaarNumber = "Invalid Aadhaar";
    if (identityInfo.panNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(identityInfo.panNumber)) e.panNumber = "Invalid PAN";
    setError(e);
    return Object.keys(e).length === 0;
  };

  const validateStep3 = () => {
    const e: Record<string, string> = {};
    // Only validate required fields for selected modules
    selectedModules.forEach(mod => {
      const fields = MODULE_FIELD_MAP[mod] || [];
      fields.forEach(fieldName => {
        const config = MODULE_FIELDS[fieldName];
        if (config && config.required && !extraFields[fieldName] && !extraFiles[fieldName]) {
          e[fieldName] = `${config.label} is required`;
        }
      });
    });
    setError(e);
    return Object.keys(e).length === 0;
  };

  const totalSteps = 3; // always 3 steps now

  const handleNext = async () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    if (step === 3) {
      if (!validateStep3()) return;
      await handleSubmit();
      return;
    }
    setStep(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setStep(prev => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError({});

    const fd = new FormData();
    fd.append("fullName", basicInfo.fullName.trim());
    fd.append("email", basicInfo.email.trim());
    fd.append("password", basicInfo.password);
    fd.append("phone", basicInfo.phone);
    fd.append("dob", basicInfo.dob);
    fd.append("gender", basicInfo.gender);
    fd.append("role", basicInfo.role);

    // Send selected modules as array
    selectedModules.forEach(m => fd.append("modules", m));

    if (identityInfo.aadhaarNumber) fd.append("aadhaarNumber", identityInfo.aadhaarNumber);
    if (identityInfo.aadhaarImage) fd.append("aadhaarImage", identityInfo.aadhaarImage);
    if (identityInfo.panNumber) fd.append("panNumber", identityInfo.panNumber);
    if (identityInfo.panImage) fd.append("panImage", identityInfo.panImage);
    if (profileImage) fd.append("profileImage", profileImage);

    // Append extra fields
    Object.entries(extraFields).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "") {
        if (typeof val === "boolean") fd.append(key, val ? "true" : "false");
        else fd.append(key, val as string);
      }
    });
    Object.entries(extraFiles).forEach(([key, file]) => {
      if (file) fd.append(key, file);
    });

    try {
      await axios.post(`${API_URL}/users/register`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess("Registration successful! Please verify your email with OTP.");
      setTimeout(() => {
        router.push(`/verify-otp?email=${encodeURIComponent(basicInfo.email)}`);
      }, 2000);
    } catch (err: any) {
      setError({ submit: err.response?.data?.message || "Registration failed" });
    } finally {
      setLoading(false);
    }
  };

  const inputCls = (field: string) =>
    `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a237e] ${
      error[field] ? "border-red-400" : "border-gray-300"
    }`;

  // Step titles
  const steps = [
    { number: 1, title: "Basic Info", icon: FaUser },
    { number: 2, title: "Identity", icon: FaIdCard },
    { number: 3, title: "Modules & Profile", icon: FaCloudUploadAlt },
  ];

  const allModules = ["EDUCATION", "AGRICULTURE", "FINANCE", "HEALTHCARE", "SOCIAL", "IT", "MEDIA", "ECOMMERCE"];

  // Get fields to display for currently selected modules
  const visibleFields = Array.from(
    new Set(
      selectedModules.flatMap(mod => MODULE_FIELD_MAP[mod] || [])
    )
  );

  return (
    <div className="min-h-screen bg-[#f0f2f5] py-8 px-6 md:px-10 lg:px-16">
      <div className="w-full">
      
        {/* Step progress */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 mb-6">
          <div className="flex justify-evenly items-center gap-6 md:gap-12">
            {steps.map((s) => (
              <div
                key={s.number}
                className={`flex flex-col items-center ${
                  step >= s.number ? "cursor-pointer" : "cursor-default"
                }`}
                onClick={() => { if (s.number < step) setStep(s.number); }}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    step > s.number ? "bg-green-600 text-white" :
                    step === s.number ? "bg-[#1a237e] text-white ring-2 ring-blue-300" :
                    "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step > s.number ? "✓" : s.number}
                </div>
                <span className={`text-xs mt-1.5 ${step === s.number ? "text-[#1a237e] font-medium" : "text-gray-400"}`}>{s.title}</span>
              </div>
            ))}
          </div>
          <div className="relative mt-3 mx-4">
            <div className="absolute top-0 left-0 h-1 bg-gray-200 rounded-full w-full" />
            <div
              className="absolute top-0 left-0 h-1 bg-[#1a237e] rounded-full transition-all"
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            />
          </div>
        </div>

        {success && (
          <div className="bg-green-50 border-l-4 border-green-600 text-green-700 p-4 rounded-md mb-6 flex items-center gap-2">
            <FaCheckCircle className="text-green-600" /> {success}
          </div>
        )}
        {error.submit && (
          <div className="bg-red-50 border-l-4 border-red-600 text-red-700 p-4 rounded-md mb-6">{error.submit}</div>
        )}

        {/* Step 1 */}
        {step === 1 && (
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
              <h2 className="text-xl font-bold text-blue-800 flex items-center gap-2"><FaUser /> Step 1: Basic Information</h2>
              <p className="text-blue-600 text-sm">All fields marked with * are mandatory</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {["fullName","email","password","confirmPassword","phone","dob","gender","role"].map((field) => (
                  <div key={field}>
                    <label className="block text-gray-700 text-sm font-medium mb-1 capitalize">
                      {field.replace(/([A-Z])/g, ' $1').trim()} {field !== "role" && <span className="text-red-500">*</span>}
                    </label>
                    {field === "gender" ? (
                      <select name="gender" value={basicInfo.gender} onChange={handleBasicChange} className={inputCls("gender")}>
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    ) : field === "role" ? (
                      <select name="role" value={basicInfo.role} onChange={handleBasicChange} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                        <option value="USER">User</option>
                        <option value="DOCTOR">Doctor</option>
                        <option value="TEACHER">Teacher</option>
                        <option value="AGENT">Agent</option>
                      </select>
                    ) : field === "dob" ? (
                      <input type="date" name="dob" value={basicInfo.dob} onChange={handleBasicChange} className={inputCls("dob")} />
                    ) : field.includes("password") ? (
                      <div className="relative">
                        <input
                          type={field === "password" ? (showPassword ? "text" : "password") : (showConfirmPassword ? "text" : "password")}
                          name={field}
                          value={field === "password" ? basicInfo.password : basicInfo.confirmPassword}
                          onChange={handleBasicChange}
                          className={inputCls(field)}
                          placeholder={field === "password" ? "Min 6 characters" : "Re-enter password"}
                        />
                        <button type="button" onClick={() => field === "password" ? setShowPassword(!showPassword) : setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-2.5 text-gray-400">
                          {field === "password" ? (showPassword ? <FaEyeSlash /> : <FaEye />) : (showConfirmPassword ? <FaEyeSlash /> : <FaEye />)}
                        </button>
                      </div>
                    ) : (
                      <input
                        type={field === "phone" ? "tel" : "text"}
                        name={field}
                        maxLength={field === "phone" ? 10 : undefined}
                        value={(basicInfo as any)[field]}
                        onChange={handleBasicChange}
                        className={inputCls(field)}
                      />
                    )}
                    {error[field] && <p className="text-red-500 text-xs mt-1">{error[field]}</p>}
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-8">
                <button onClick={handleNext} className="bg-[#1a237e] hover:bg-[#0d1757] text-white font-medium py-2 px-6 rounded-md flex items-center gap-2">
                  Next <FaChevronRight />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="bg-yellow-50 px-6 py-4 border-b border-yellow-100">
              <h2 className="text-xl font-bold text-yellow-800 flex items-center gap-2"><FaIdCard /> Step 2: Identity Documents</h2>
              <p className="text-yellow-600 text-sm">Optional but recommended for full access</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Aadhaar Number</label>
                  <div className="flex gap-2">
                    <input type="text" name="aadhaarNumber" maxLength={12} placeholder="12-digit Aadhaar"
                      value={identityInfo.aadhaarNumber} onChange={handleIdentityChange}
                      className={`flex-1 px-3 py-2 border rounded-md ${error.aadhaarNumber ? "border-red-400" : "border-gray-300"}`} />
                    <button type="button" onClick={() => aadhaarInputRef.current?.click()} className="bg-gray-100 px-3 rounded-md hover:bg-gray-200">Upload</button>
                    <input type="file" ref={aadhaarInputRef} onChange={(e) => handleIdentityFile(e, "aadhaarImage")} accept=".jpg,.jpeg,.pdf" hidden />
                  </div>
                  {error.aadhaarNumber && <p className="text-red-500 text-xs mt-1">{error.aadhaarNumber}</p>}
                  {error.aadhaarImage && <p className="text-red-500 text-xs mt-1">{error.aadhaarImage}</p>}
                  {identityInfo.aadhaarImage && <p className="text-green-600 text-xs mt-1">✓ {identityInfo.aadhaarImage.name}</p>}
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">PAN Number</label>
                  <div className="flex gap-2">
                    <input type="text" name="panNumber" maxLength={10} placeholder="ABCDE1234F"
                      value={identityInfo.panNumber} onChange={handleIdentityChange}
                      className={`flex-1 px-3 py-2 border rounded-md ${error.panNumber ? "border-red-400" : "border-gray-300"}`} />
                    <button type="button" onClick={() => panInputRef.current?.click()} className="bg-gray-100 px-3 rounded-md hover:bg-gray-200">Upload</button>
                    <input type="file" ref={panInputRef} onChange={(e) => handleIdentityFile(e, "panImage")} accept=".jpg,.jpeg,.pdf" hidden />
                  </div>
                  {error.panNumber && <p className="text-red-500 text-xs mt-1">{error.panNumber}</p>}
                  {error.panImage && <p className="text-red-500 text-xs mt-1">{error.panImage}</p>}
                  {identityInfo.panImage && <p className="text-green-600 text-xs mt-1">✓ {identityInfo.panImage.name}</p>}
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200">
                <label className="block text-gray-700 text-sm font-medium mb-2">Profile Picture</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border">
                    {profilePreview ? <img src={profilePreview} className="w-full h-full object-cover" /> : <FaUser className="text-gray-400 text-2xl" />}
                  </div>
                  <div>
                    <button type="button" onClick={() => profilePicInputRef.current?.click()} className="bg-gray-100 px-3 py-1.5 rounded-md text-sm hover:bg-gray-200 border">
                      <FaCloudUploadAlt className="inline mr-1" /> Upload Photo
                    </button>
                    <input type="file" ref={profilePicInputRef} onChange={handleProfilePic} accept=".jpg,.jpeg,.png" hidden />
                    <p className="text-gray-400 text-xs mt-1">JPG, PNG only</p>
                  </div>
                </div>
                {error.profileImage && <p className="text-red-500 text-xs mt-1">{error.profileImage}</p>}
              </div>
              <div className="flex justify-between mt-8">
                <button onClick={handleBack} className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-5 rounded-md flex items-center gap-2">
                  <FaArrowLeft /> Back
                </button>
                <button onClick={handleNext} className="bg-[#1a237e] hover:bg-[#0d1757] text-white font-medium py-2 px-6 rounded-md flex items-center gap-2">
                  Next <FaChevronRight />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Modules & Profile */}
        {step === 3 && (
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="bg-purple-50 px-6 py-4 border-b border-purple-100">
              <h2 className="text-xl font-bold text-purple-800 flex items-center gap-2"><FaCloudUploadAlt /> Step 3: Modules & Professional Profile</h2>
              <p className="text-purple-600 text-sm">Select the modules you want to join and fill relevant details</p>
            </div>
            <div className="p-6">
              <label className="block text-gray-700 text-sm font-semibold mb-3">Select Modules</label>
              <div className="flex flex-wrap gap-2 mb-6">
                {allModules.map(mod => (
                  <button
                    key={mod}
                    type="button"
                    onClick={() => toggleModule(mod)}
                    className={`px-4 py-2 rounded-full text-xs font-medium border transition ${
                      selectedModules.includes(mod)
                        ? "bg-[#1a237e] text-white border-[#1a237e]"
                        : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
                    }`}
                  >
                    {mod}
                  </button>
                ))}
              </div>

              {visibleFields.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
                  {visibleFields.map(fieldName => {
                    const config = MODULE_FIELDS[fieldName];
                    if (!config) return null;
                    if (config.type === "file") {
                      return (
                        <div key={fieldName}>
                          <label className="block text-sm font-medium mb-1">{config.label}{config.required ? " *" : ""}</label>
                          <input
                            type="file"
                            onChange={(e) => handleExtraFile(fieldName, e.target.files?.[0] || null)}
                            accept=".jpg,.jpeg,.pdf"
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#1a237e]/10 file:text-[#1a237e] hover:file:bg-[#1a237e]/20"
                          />
                          {error[fieldName] && <p className="text-red-500 text-xs mt-1">{error[fieldName]}</p>}
                          {extraFiles[fieldName] && <p className="text-green-600 text-xs mt-1">✓ {extraFiles[fieldName]?.name}</p>}
                        </div>
                      );
                    }
                    if (config.type === "checkbox") {
                      return (
                        <div key={fieldName} className="flex items-center gap-2 md:col-span-2">
                          <input
                            type="checkbox"
                            checked={!!extraFields[fieldName]}
                            onChange={(e) => handleExtraChange(fieldName, e.target.checked)}
                            className="rounded border-gray-300"
                          />
                          <label className="text-sm font-medium">{config.label}</label>
                        </div>
                      );
                    }
                    return (
                      <div key={fieldName}>
                        <label className="block text-sm font-medium mb-1">{config.label}{config.required ? " *" : ""}</label>
                        <input
                          type={config.type === "date" ? "date" : "text"}
                          value={extraFields[fieldName] || ""}
                          onChange={(e) => handleExtraChange(fieldName, e.target.value)}
                          className={inputCls(fieldName)}
                        />
                        {error[fieldName] && <p className="text-red-500 text-xs mt-1">{error[fieldName]}</p>}
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="flex justify-between mt-8">
                <button onClick={handleBack} className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-5 rounded-md flex items-center gap-2">
                  <FaArrowLeft /> Back
                </button>
                <button onClick={handleNext} disabled={loading} className="bg-green-700 hover:bg-green-800 text-white font-medium py-2 px-6 rounded-md flex items-center gap-2">
                  {loading ? "Registering..." : "Submit Registration"} <FaCheckCircle />
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="text-center mt-6 text-gray-500 text-sm">
          Already have an account? <a href="/login" className="text-[#1a237e] hover:underline font-medium">Sign in here</a>
        </div>
      </div>
    </div>
  );
};

export default Register;