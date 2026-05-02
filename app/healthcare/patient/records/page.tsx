"use client";

import { useEffect, useState } from "react";
import {
  FileText,
  Upload,
  Loader2,
  Trash2,
  Calendar,
  X,
  Download,
} from "lucide-react";
import { healthcareAPI } from "@/lib/api";

type HealthRecord = {
  _id: string;
  recordType: string;
  title: string;
  description?: string;
  date: string;
  hospitalName?: string;
  isPrivate?: boolean;
  tags?: string[];
  attachments?: {
    fileUrl: string;
    fileName: string;
    fileType: string;
    uploadedAt?: string;
  }[];
  doctorId?: {
    fullName?: string;
  };
};

const recordTypes = [
  { value: "lab_report", label: "Lab Report" },
  { value: "diagnosis", label: "Diagnosis" },
  { value: "vaccination", label: "Vaccination" },
  { value: "surgery", label: "Surgery" },
  { value: "allergy", label: "Allergy" },
  { value: "medication", label: "Medication" },
  { value: "vital_signs", label: "Vital Signs" },
  { value: "imaging", label: "Imaging" },
  { value: "other", label: "Other" },
];

export default function HealthRecordsPage() {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    recordType: "other",
    title: "",
    description: "",
    date: "",
    hospitalName: "",
    tags: "",
    isPrivate: false,
  });

  const [files, setFiles] = useState<FileList | null>(null);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await healthcareAPI.getPatientHealthRecords(undefined, {
        page: 1,
        limit: 20,
      });

      setRecords(res.data.records || []);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to load health records"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const resetForm = () => {
    setForm({
      recordType: "other",
      title: "",
      description: "",
      date: "",
      hospitalName: "",
      tags: "",
      isPrivate: false,
    });
    setFiles(null);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title.trim()) {
      alert("Please enter record title");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append("recordType", form.recordType);
      formData.append("title", form.title.trim());
      formData.append("description", form.description.trim());
      formData.append("hospitalName", form.hospitalName.trim());
      formData.append("isPrivate", String(form.isPrivate));

      if (form.date) {
        formData.append("date", form.date);
      }

      if (form.tags.trim()) {
        const tagsArray = form.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean);

        tagsArray.forEach((tag) => {
          formData.append("tags", tag);
        });
      }

      if (files) {
        Array.from(files).forEach((file) => {
          formData.append("attachments", file);
        });
      }

      await healthcareAPI.addHealthRecord(formData);

      resetForm();
      setShowForm(false);
      fetchRecords();
    } catch (err: any) {
      alert(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to upload record"
      );
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this record?");
    if (!confirmDelete) return;

    try {
      await healthcareAPI.deleteHealthRecord(id);
      setRecords((prev) => prev.filter((record) => record._id !== id));
    } catch (err: any) {
      alert(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to delete record"
      );
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatRecordType = (type: string) => {
    return (
      recordTypes.find((item) => item.value === type)?.label ||
      type?.replaceAll("_", " ")
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Health Records
            </h1>
            <p className="text-gray-500 mt-1">
              Manage your medical history and documents
            </p>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-[#1a237e] text-white rounded-lg text-sm hover:bg-[#11195c] transition"
          >
            <Upload className="w-4 h-4" />
            Upload Record
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Add Health Record
            </h2>

            <button
              onClick={() => setShowForm(false)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleUpload} className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Record Type
              </label>
              <select
                value={form.recordType}
                onChange={(e) =>
                  setForm({ ...form, recordType: e.target.value })
                }
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#1a237e]/20"
              >
                {recordTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Record Date
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#1a237e]/20"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Example: Blood Test Report"
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#1a237e]/20"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Hospital Name
              </label>
              <input
                type="text"
                value={form.hospitalName}
                onChange={(e) =>
                  setForm({ ...form, hospitalName: e.target.value })
                }
                placeholder="Hospital or clinic name"
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#1a237e]/20"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={3}
                placeholder="Add short details about this record"
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#1a237e]/20"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700">
                Tags
              </label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder="Example: blood, sugar, report"
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#1a237e]/20"
              />
              <p className="text-xs text-gray-400 mt-1">
                Separate tags with commas
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700">
                Attachments
              </label>
              <input
                type="file"
                multiple
                onChange={(e) => setFiles(e.target.files)}
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2"
              />
            </div>

            <label className="md:col-span-2 flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={form.isPrivate}
                onChange={(e) =>
                  setForm({ ...form, isPrivate: e.target.checked })
                }
              />
              Keep this record private
            </label>

            <div className="md:col-span-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={uploading}
                className="px-4 py-2 bg-[#1a237e] text-white rounded-lg text-sm hover:bg-[#11195c] disabled:opacity-60 flex items-center gap-2"
              >
                {uploading && <Loader2 className="w-4 h-4 animate-spin" />}
                {uploading ? "Uploading..." : "Save Record"}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <Loader2 className="w-8 h-8 mx-auto text-[#1a237e] animate-spin mb-3" />
          <p className="text-gray-500">Loading health records...</p>
        </div>
      )}

      {!loading && error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-5">
          {error}
        </div>
      )}

      {!loading && !error && records.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <FileText className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No health records yet</p>
        </div>
      )}

      {!loading && !error && records.length > 0 && (
        <div className="grid gap-4">
          {records.map((record) => (
            <div
              key={record._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-5"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg font-bold text-gray-900">
                      {record.title}
                    </h2>

                    <span className="px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-700 border border-blue-100 capitalize">
                      {formatRecordType(record.recordType)}
                    </span>

                    {record.isPrivate && (
                      <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600 border border-gray-200">
                        Private
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                    <Calendar className="w-4 h-4" />
                    {formatDate(record.date)}
                  </div>

                  {record.hospitalName && (
                    <p className="text-sm text-gray-500 mt-1">
                      Hospital: {record.hospitalName}
                    </p>
                  )}

                  {record.doctorId?.fullName && (
                    <p className="text-sm text-gray-500 mt-1">
                      Doctor: Dr. {record.doctorId.fullName}
                    </p>
                  )}

                  {record.description && (
                    <p className="text-gray-700 mt-3">{record.description}</p>
                  )}

                  {record.tags && record.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {record.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 rounded-md text-xs bg-gray-50 border border-gray-200 text-gray-600"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleDelete(record._id)}
                  className="self-start p-2 rounded-lg text-red-600 hover:bg-red-50"
                  title="Delete record"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              {record.attachments && record.attachments.length > 0 && (
                <div className="mt-4 border-t pt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Attachments
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {record.attachments.map((file, index) => (
                      <a
                        key={index}
                        href={file.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Download className="w-4 h-4" />
                        {file.fileName || "View File"}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}