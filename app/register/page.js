"use client";

import { useState, useRef } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import {
    FaUser, FaEnvelope, FaLock, FaMobile, FaCalendarAlt, FaVenusMars, FaArrowLeft, FaCheckCircle,
    FaCloudUploadAlt, FaEye, FaEyeSlash, FaChevronRight
} from 'react-icons/fa';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Register = () => {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({});
    const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Basic Info (Step 1 - Compulsory) – matches backend schema
    const [basicInfo, setBasicInfo] = useState({
        fullName: '', email: '', password: '', confirmPassword: '', phone: '', dob: '', gender: '', role: 'USER',
    });

    // Identity documents (matches backend)
    const [identityInfo, setIdentityInfo] = useState({
        aadhaarNumber: '', aadhaarImage: null,
        panNumber: '', panImage: null,
    });

    // Profile image
    const [profileImage, setProfileImage] = useState(null);

    // Refs for file inputs
    const aadhaarInputRef = useRef();
    const panInputRef = useRef();
    const profilePicInputRef = useRef();

    const handleBasicChange = (e) => {
        setBasicInfo({ ...basicInfo, [e.target.name]: e.target.value });
        if (error[e.target.name]) setError({ ...error, [e.target.name]: '' });
    };

    const handleIdentityChange = (e) => {
        setIdentityInfo({ ...identityInfo, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e, fieldName) => {
        const file = e.target.files[0];
        if (file && (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'application/pdf')) {
            setIdentityInfo({ ...identityInfo, [fieldName]: file });
        } else {
            setError({ ...error, [fieldName]: 'Only JPG, JPEG, or PDF files are allowed' });
        }
    };

    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        if (file && (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png')) {
            setProfileImage(file);
        } else {
            setError({ ...error, profileImage: 'Only JPG, JPEG, or PNG files are allowed' });
        }
    };

    const validateStep1 = () => {
        const newErrors = {};
        if (!basicInfo.fullName) newErrors.fullName = "Full name is required";
        if (!basicInfo.email) newErrors.email = "Email is required";
        else if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(basicInfo.email)) newErrors.email = "Only Gmail addresses are allowed";
        if (!basicInfo.password) newErrors.password = "Password is required";
        else if (basicInfo.password.length < 6) newErrors.password = "Password must be at least 6 characters";
        if (basicInfo.password !== basicInfo.confirmPassword) newErrors.confirmPassword = "Passwords don't match";
        if (!basicInfo.phone) newErrors.phone = "Mobile number is required";
        else if (!/^\d{10}$/.test(basicInfo.phone)) newErrors.phone = "Mobile number must be 10 digits";
        if (!basicInfo.dob) newErrors.dob = "Date of birth is required";
        if (!basicInfo.gender) newErrors.gender = "Gender is required";

        setError(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = (nextStep) => {
        if (step === 1 && !validateStep1()) return;
        setStep(nextStep);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBack = (prevStep) => {
        setStep(prevStep);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError({});

        const formData = new FormData();

        // Basic info – exact field names as per backend schema
        formData.append('fullName', basicInfo.fullName);
        formData.append('email', basicInfo.email);
        formData.append('password', basicInfo.password);
        formData.append('phone', basicInfo.phone);
        formData.append('dob', basicInfo.dob);
        formData.append('gender', basicInfo.gender);
        // Convert role to uppercase enum expected by backend
        const roleMap = { user: 'USER', doctor: 'DOCTOR', teacher: 'TEACHER', agent: 'AGENT' };
        formData.append('role', roleMap[basicInfo.role] || 'USER');

        // Identity documents
        if (identityInfo.aadhaarNumber) formData.append('aadhaarNumber', identityInfo.aadhaarNumber);
        if (identityInfo.aadhaarImage) formData.append('aadhaarImage', identityInfo.aadhaarImage);
        if (identityInfo.panNumber) formData.append('panNumber', identityInfo.panNumber);
        if (identityInfo.panImage) formData.append('panImage', identityInfo.panImage);

        // Profile image
        if (profileImage) formData.append('profileImage', profileImage);

        try {
            const response = await axios.post(`${API_URL}/users/register`, formData);
            // Backend likely returns { message, userId } – not a token yet
            setSuccess('Registration successful! Please verify your email with OTP.');
            setTimeout(() => {
                router.push(`/verify-otp?email=${encodeURIComponent(basicInfo.email)}`);
            }, 2000);
        } catch (err) {
            setError({ submit: err.response?.data?.message || 'Registration failed' });
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        { number: 1, title: 'Basic Info', icon: '📝' },
        { number: 2, title: 'Identity', icon: '🆔' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header with Government Emblem */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center gap-2 mb-3">
                        <div className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center">
                            <div className="w-8 h-8 rounded-full border-2 border-[#FF9933] flex items-center justify-center">
                                <div className="w-4 h-4 rounded-full bg-[#138808]"></div>
                            </div>
                        </div>
                        <span className="text-xs text-gray-500">Government of India</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Samraddh Bharat Foundation</h1>
                    <p className="text-gray-500 mt-1">Citizen Registration Portal</p>
                    <div className="flex justify-center gap-1 mt-3">
                        <div className="w-12 h-0.5 bg-[#FF9933]"></div>
                        <div className="w-12 h-0.5 bg-white"></div>
                        <div className="w-12 h-0.5 bg-[#138808]"></div>
                    </div>
                </div>

                {/* Progress Steps */}
                <div className="bg-white rounded-xl shadow-md p-4 mb-6">
                    <div className="flex justify-between items-center">
                        {steps.map((s) => (
                            <button
                                key={s.number}
                                onClick={() => setStep(s.number)}
                                className="flex flex-col items-center group focus:outline-none"
                            >
                                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all
                                    ${step > s.number ? 'bg-green-600 text-white' :
                                        step === s.number ? 'bg-blue-700 text-white ring-2 ring-blue-300' :
                                        'bg-gray-200 text-gray-500'}`}
                                >
                                    {step > s.number ? '✓' : s.number}
                                </div>
                                <span className={`text-xs mt-1 hidden sm:block ${step === s.number ? 'text-blue-700 font-medium' : 'text-gray-400'}`}>
                                    {s.title}
                                </span>
                            </button>
                        ))}
                    </div>
                    <div className="relative mt-2">
                        <div className="absolute top-0 left-0 h-1 bg-gray-200 rounded-full w-full"></div>
                        <div className="absolute top-0 left-0 h-1 bg-blue-700 rounded-full transition-all duration-300"
                            style={{ width: `${((step - 1) / 1) * 100}%` }}></div>
                    </div>
                </div>

                {/* Success / Error Messages */}
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

                {/* STEP 1: Basic Information */}
                {step === 1 && (
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                        <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
                            <h2 className="text-xl font-bold text-blue-800">Step 1: Basic Information</h2>
                            <p className="text-blue-600 text-sm">All fields marked with * are mandatory</p>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-1">Full Name <span className="text-red-500">*</span></label>
                                    <input type="text" name="fullName" value={basicInfo.fullName} onChange={handleBasicChange}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${error.fullName ? 'border-red-400' : 'border-gray-300'}`}
                                        placeholder="Enter your full name" />
                                    {error.fullName && <p className="text-red-500 text-xs mt-1">{error.fullName}</p>}
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-1">Email Address <span className="text-red-500">*</span></label>
                                    <input type="email" name="email" value={basicInfo.email} onChange={handleBasicChange}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${error.email ? 'border-red-400' : 'border-gray-300'}`}
                                        placeholder="you@gmail.com" />
                                    {error.email && <p className="text-red-500 text-xs mt-1">{error.email}</p>}
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-1">Password <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <input type={showPassword ? "text" : "password"} name="password" value={basicInfo.password} onChange={handleBasicChange}
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${error.password ? 'border-red-400' : 'border-gray-300'}`}
                                            placeholder="Min. 6 characters" />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                    {error.password && <p className="text-red-500 text-xs mt-1">{error.password}</p>}
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-1">Confirm Password <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={basicInfo.confirmPassword} onChange={handleBasicChange}
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${error.confirmPassword ? 'border-red-400' : 'border-gray-300'}`}
                                            placeholder="Re-enter password" />
                                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                    {error.confirmPassword && <p className="text-red-500 text-xs mt-1">{error.confirmPassword}</p>}
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-1">Mobile Number <span className="text-red-500">*</span></label>
                                    <input type="tel" name="phone" value={basicInfo.phone} onChange={handleBasicChange}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${error.phone ? 'border-red-400' : 'border-gray-300'}`}
                                        placeholder="10-digit mobile number" />
                                    {error.phone && <p className="text-red-500 text-xs mt-1">{error.phone}</p>}
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-1">Date of Birth <span className="text-red-500">*</span></label>
                                    <input type="date" name="dob" value={basicInfo.dob} onChange={handleBasicChange}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${error.dob ? 'border-red-400' : 'border-gray-300'}`} />
                                    {error.dob && <p className="text-red-500 text-xs mt-1">{error.dob}</p>}
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-1">Gender <span className="text-red-500">*</span></label>
                                    <select name="gender" value={basicInfo.gender} onChange={handleBasicChange}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${error.gender ? 'border-red-400' : 'border-gray-300'}`}>
                                        <option value="">Select</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                    {error.gender && <p className="text-red-500 text-xs mt-1">{error.gender}</p>}
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-1">Role (Optional)</label>
                                    <select name="role" value={basicInfo.role} onChange={handleBasicChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="USER">User</option>
                                        <option value="DOCTOR">Doctor</option>
                                        <option value="TEACHER">Teacher</option>
                                        <option value="AGENT">Agent</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end mt-8">
                                <button onClick={() => handleNext(2)} className="bg-blue-700 hover:bg-blue-800 text-white font-medium py-2 px-6 rounded-md transition flex items-center gap-2 shadow-sm">
                                    Next <FaChevronRight className="text-sm" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 2: Identity Documents */}
                {step === 2 && (
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                        <div className="bg-yellow-50 px-6 py-4 border-b border-yellow-100">
                            <h2 className="text-xl font-bold text-yellow-800">Step 2: Identity Documents</h2>
                            <p className="text-yellow-600 text-sm">Optional but recommended for full access</p>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-1">Aadhaar Number</label>
                                    <div className="flex gap-2">
                                        <input type="text" name="aadhaarNumber" placeholder="12-digit Aadhaar" value={identityInfo.aadhaarNumber} onChange={handleIdentityChange}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        <button onClick={() => aadhaarInputRef.current.click()} className="bg-gray-100 px-3 rounded-md hover:bg-gray-200 text-gray-700 text-sm">
                                            Upload
                                        </button>
                                        <input type="file" ref={aadhaarInputRef} onChange={(e) => handleFileChange(e, 'aadhaarImage')} accept=".jpg,.jpeg,.pdf" className="hidden" />
                                    </div>
                                    {identityInfo.aadhaarImage && <p className="text-green-600 text-xs mt-1">✓ File uploaded</p>}
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-1">PAN Number</label>
                                    <div className="flex gap-2">
                                        <input type="text" name="panNumber" placeholder="PAN Number" value={identityInfo.panNumber} onChange={handleIdentityChange}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        <button onClick={() => panInputRef.current.click()} className="bg-gray-100 px-3 rounded-md hover:bg-gray-200 text-gray-700 text-sm">
                                            Upload
                                        </button>
                                        <input type="file" ref={panInputRef} onChange={(e) => handleFileChange(e, 'panImage')} accept=".jpg,.jpeg,.pdf" className="hidden" />
                                    </div>
                                    {identityInfo.panImage && <p className="text-green-600 text-xs mt-1">✓ File uploaded</p>}
                                </div>
                            </div>

                            {/* Profile picture section */}
                            <div className="mt-6 pt-4 border-t border-gray-200">
                                <label className="block text-gray-700 text-sm font-medium mb-2">Profile Picture</label>
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border border-gray-300">
                                        {profileImage ? (
                                            <img src={URL.createObjectURL(profileImage)} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <FaUser className="text-gray-400 text-2xl" />
                                        )}
                                    </div>
                                    <div>
                                        <button onClick={() => profilePicInputRef.current.click()} className="bg-gray-100 px-3 py-1.5 rounded-md text-sm hover:bg-gray-200 border border-gray-300">
                                            <FaCloudUploadAlt className="inline mr-1" /> Upload Photo
                                        </button>
                                        <input type="file" ref={profilePicInputRef} onChange={handleProfilePictureChange} accept=".jpg,.jpeg,.png" className="hidden" />
                                        <p className="text-gray-400 text-xs mt-1">JPG, PNG only</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between mt-8">
                                <button onClick={() => handleBack(1)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-5 rounded-md transition flex items-center gap-2">
                                    <FaArrowLeft /> Back
                                </button>
                                <button onClick={handleSubmit} disabled={loading}
                                    className="bg-green-700 hover:bg-green-800 text-white font-medium py-2 px-6 rounded-md transition disabled:opacity-50 flex items-center gap-2">
                                    {loading ? 'Registering...' : 'Submit Registration'} <FaCheckCircle />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Login Link */}
                <div className="text-center mt-6 text-gray-500 text-sm">
                    Already have an account? <a href="/login" className="text-blue-700 hover:underline">Sign in here</a>
                </div>
            </div>
        </div>
    );
};

export default Register;