"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { authAPI } from "@/lib/api";
import {
  X, Check, Loader2, User, Upload,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

type FieldConfig = {
  name: string;
  label: string;
  type: "text" | "select" | "date" | "file";
  options?: string[];
  required?: boolean;
  accept?: string;          // for file inputs
  multiple?: boolean;       // for file inputs
};

type ModuleConfig = {
  title: string;
  description: string;
  fields: FieldConfig[];
};

const MODULE_CONFIGS: Record<string, ModuleConfig> = {
  education: {
    title: "Education Profile",
    description: "Set up your teacher or student profile to get started.",
    fields: [
      { name: "teacherSpecialization", label: "Specialization", type: "text", required: true },
      { name: "qualifications", label: "Qualifications (comma separated)", type: "text" },
      { name: "teacherExperience", label: "Experience (years)", type: "text" },
    ],
  },
  healthcare: {
    title: "Doctor Profile",
    description: "Complete your professional details to start consulting.",
    fields: [
      // Doctor basic profile
      { name: "doctorProfile.specialization", label: "Specialization", type: "text", required: true },
      { name: "doctorProfile.experienceYears", label: "Experience (years)", type: "text" },
      { name: "doctorProfile.consultationFee", label: "Consultation Fee (₹)", type: "text" },
      { name: "doctorProfile.registrationNumber", label: "Registration Number", type: "text", required: true },
      // Verification fields
      { name: "doctorVerification.qualification", label: "Qualification (e.g., MBBS, MD)", type: "text", required: true },
      { name: "doctorVerification.college", label: "Medical College / University", type: "text", required: true },
      { name: "doctorVerification.yearOfPassing", label: "Year of Passing", type: "text", required: true },
      { name: "doctorVerification.medicalCouncilRegNumber", label: "Medical Council Reg. Number", type: "text", required: true },
      { name: "degreeCertificate", label: "Degree Certificate (PDF/Image)", type: "file", accept: "image/*,.pdf", required: true },
      { name: "registrationCertificate", label: "Registration Certificate (PDF/Image)", type: "file", accept: "image/*,.pdf", required: true },
    ],
  },
  news: {
    title: "Media Creator Profile",
    description: "Become a creator — add your bio and preferences.",
    fields: [
      { name: "isMediaCreator", label: "I want to create posts", type: "select", options: ["true", "false"] },
      { name: "mediaBio", label: "Creator Bio", type: "text" },
      { name: "username", label: "Username", type: "text" },
      { name: "bio", label: "Short Bio", type: "text" },
    ],
  },
  agriculture: {
    title: "Farmer Profile",
    description: "Tell us about your farm to get the best prices.",
    fields: [
      { name: "landSize", label: "Land Size (acres)", type: "text" },
      { name: "crops", label: "Crops (comma separated)", type: "text" },
      { name: "farmingType", label: "Farming Type", type: "select", options: ["conventional", "organic", "mixed"] },
      { name: "isContractFarmer", label: "Contract Farmer?", type: "select", options: ["true", "false"] },
      { name: "farmLocation", label: "Farm Location", type: "text" },
      { name: "irrigationType", label: "Irrigation Type", type: "text" },
    ],
  },
  finance: {
    title: "Bank Account",
    description: "Add your bank details for withdrawals.",
    fields: [
      { name: "accountNumber", label: "Account Number", type: "text", required: true },
      { name: "ifsc", label: "IFSC Code", type: "text", required: true },
      { name: "bankName", label: "Bank Name", type: "text" },
      { name: "accountHolderName", label: "Account Holder Name", type: "text", required: true },
    ],
  },
  it: {
    title: "Seller / IT Profile",
    description: "Set up your store or IT skills.",
    fields: [
      { name: "isSeller", label: "I want to sell products", type: "select", options: ["true", "false"] },
      { name: "storeName", label: "Store Name", type: "text" },
      { name: "gstNumber", label: "GST Number", type: "text" },
      { name: "projectType", label: "Project Type", type: "text" },
      { name: "techStack", label: "Tech Stack", type: "text" },
      { name: "experience", label: "Experience Level", type: "text" },
    ],
  },
};

interface ModuleSetupWizardProps {
  module: string;
}

export default function ModuleSetupWizard({ module }: ModuleSetupWizardProps) {
  const { user, setUser, loading } = useAuth();
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [form, setForm] = useState<Record<string, any>>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const config = MODULE_CONFIGS[module];
  if (!config) return null;

  const getMissingFields = useCallback(() => {
    if (!user) return config.fields;
    return config.fields.filter(f => {
      // For file fields, we check if the corresponding user field exists and is truthy
      if (f.type === "file") {
        // Check if the user has the uploaded file URL stored (e.g., degreeCertificate)
        const val = user[f.name] || user.doctorVerification?.[f.name];
        return !val;
      }
      // For nested keys like "doctorProfile.specialization", we need to traverse
      const keys = f.name.split(".");
      let current: any = user;
      for (const key of keys) {
        current = current?.[key];
        if (current === undefined || current === null || current === "") return true;
      }
      return false;
    });
  }, [user, config.fields]);

  useEffect(() => {
    if (loading || !user) return;
    const flagKey = `module_setup_${module}_completed`;
    if (localStorage.getItem(flagKey)) return;

    const missing = getMissingFields();
    if (missing.length > 0) {
      // Prefill existing values
      const prefill: any = {};
      config.fields.forEach(f => {
        if (f.type === "file") return; // can't prefill file inputs
        const keys = f.name.split(".");
        let current: any = user;
        let val = current;
        for (const key of keys) {
          val = current?.[key];
          if (val === undefined || val === null) break;
          current = val;
        }
        if (val !== undefined && val !== null && val !== "") {
          prefill[f.name] = val;
        }
      });
      setForm(prefill);
      setVisible(true);
    }
  }, [user, loading, module, config.fields, getMissingFields]);

  const handleInputChange = (field: string, value: string | File) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field: string, file: File | null) => {
    setForm(prev => ({ ...prev, [field]: file }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, val]) => {
        if (val === undefined || val === null || val === "") return;
        if (val instanceof File) {
          fd.append(key, val);
        } else {
          fd.append(key, val as string);
        }
      });

      const res = await authAPI.updateProfile(fd);
      setUser(res.data.user);
      toast.success("Profile updated!");

      localStorage.setItem(`module_setup_${module}_completed`, "true");
      setExiting(true);
      setTimeout(() => setVisible(false), 300);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setUpdating(false);
    }
  };

  if (!visible) return null;

  const missingFields = getMissingFields();
  if (missingFields.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: exiting ? 0 : 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.95, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 20, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto max-w-lg w-full relative"
        >
          {/* Top trim – tricolor */}
          <div className="h-1 flex">
            <div className="w-1/3 bg-[#FF9933]" />
            <div className="w-1/3 bg-white" />
            <div className="w-1/3 bg-[#138808]" />
          </div>

          {/* Close */}
          <button
            onClick={() => {
              localStorage.setItem(`module_setup_${module}_completed`, "true");
              setExiting(true);
              setTimeout(() => setVisible(false), 300);
            }}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition z-10"
          >
            <X size={20} />
          </button>

          <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 bg-[#1a237e]/10 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-[#1a237e]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{config.title}</h3>
                <p className="text-sm text-gray-500">{config.description}</p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="space-y-4 mb-6">
              {missingFields.map(field => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {field.label} {field.required ? <span className="text-red-500">*</span> : ""}
                  </label>
                  {field.type === "select" && field.options ? (
                    <select
                      value={form[field.name] || ""}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#1a237e] focus:border-[#1a237e] outline-none bg-white"
                    >
                      <option value="">Select</option>
                      {field.options.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : field.type === "date" ? (
                    <input
                      type="date"
                      value={form[field.name] || ""}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#1a237e] focus:border-[#1a237e] outline-none"
                    />
                  ) : field.type === "file" ? (
                    <div>
                      <input
                        type="file"
                        accept={field.accept}
                        multiple={field.multiple}
                        ref={(el) => { fileInputRefs.current[field.name] = el; }}
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          handleFileChange(field.name, file);
                        }}
                        className="w-full border border-gray-300 rounded-lg p-2 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#1a237e]/10 file:text-[#1a237e] hover:file:bg-[#1a237e]/20 transition"
                      />
                      {form[field.name] && form[field.name] instanceof File && (
                        <p className="text-xs text-gray-500 mt-1">Selected: {form[field.name].name}</p>
                      )}
                    </div>
                  ) : (
                    <input
                      type="text"
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                      value={form[field.name] || ""}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#1a237e] focus:border-[#1a237e] outline-none"
                    />
                  )}
                </div>
              ))}
            </form>

            {/* Action */}
            <button
              onClick={handleSave}
              disabled={updating}
              className="w-full flex items-center justify-center gap-2 bg-[#1a237e] text-white py-2.5 rounded-lg font-semibold hover:bg-[#0d1757] transition disabled:opacity-60 shadow-sm"
            >
              {updating ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  <Check size={18} /> Save & Continue
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}