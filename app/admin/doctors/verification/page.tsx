"use client";

import { useEffect, useState } from "react";
import { healthcareAPI } from "@/lib/api";
import { Loader2, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";

export default function DoctorVerificationPage() {
  const [pendingDoctors, setPendingDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectTargetId, setRejectTargetId] = useState<string | null>(null);

  const fetchPending = async () => {
    try {
      setLoading(true);
      const res = await healthcareAPI.getPendingDoctors();
      setPendingDoctors(res.data.doctors || []);
    } catch (error: any) {
      toast.error("Failed to load pending doctors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPending(); }, []);

  const handleApprove = async (doctorId: string) => {
    try {
      await healthcareAPI.verifyDoctor(doctorId);
      toast.success("Doctor approved");
      fetchPending();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Approval failed");
    }
  };

  const handleReject = async (doctorId: string) => {
    try {
      if (!rejectReason.trim()) {
        toast.error("Please provide a rejection reason");
        return;
      }
      await healthcareAPI.rejectDoctor(doctorId, rejectReason);
      toast.success("Doctor rejected");
      setRejectTargetId(null);
      setRejectReason("");
      fetchPending();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Rejection failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h1 className="text-2xl font-bold text-gray-800">Doctor Verification</h1>
        <p className="text-gray-500 mt-1">Approve or reject doctor registrations</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin h-8 w-8 text-[#1a237e]" />
        </div>
      ) : pendingDoctors.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center">
          <CheckCircle className="w-12 h-12 mx-auto text-green-300 mb-3" />
          <p className="text-gray-500">No pending doctor verifications</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingDoctors.map((doc: any) => (
            <div key={doc._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold text-gray-800">{doc.fullName}</h2>
                  <p className="text-sm text-gray-500">{doc.email} • {doc.phone}</p>
                  <div className="flex flex-wrap gap-2 mt-2 text-sm">
                    <span className="px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs">
                      {doc.doctorVerification?.qualification || "No qualification"}
                    </span>
                    <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-700 text-xs">
                      {doc.doctorVerification?.college || "No college"}
                    </span>
                    {doc.doctorVerification?.yearOfPassing && (
                      <span className="px-2 py-1 rounded-full bg-green-50 text-green-700 text-xs">
                        Passed: {doc.doctorVerification.yearOfPassing}
                      </span>
                    )}
                  </div>
                  {doc.doctorVerification?.registrationCertificate && (
                    <a
                      href={doc.doctorVerification.registrationCertificate}
                      target="_blank"
                      className="text-xs text-[#1a237e] underline block mt-1"
                    >
                      View Registration Certificate
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleApprove(doc._id)}
                    className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                  >
                    <CheckCircle size={16} /> Approve
                  </button>

                  {rejectTargetId === doc._id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Reason..."
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-40"
                      />
                      <button
                        onClick={() => handleReject(doc._id)}
                        className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => { setRejectTargetId(null); setRejectReason(""); }}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setRejectTargetId(doc._id)}
                      className="flex items-center gap-1 px-4 py-2 border border-red-300 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50"
                    >
                      <XCircle size={16} /> Reject
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}