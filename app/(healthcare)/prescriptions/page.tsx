"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { healthcareAPI } from "@/lib/api";
import { Pill, Loader2, Calendar, User } from "lucide-react";

export default function PrescriptionsPage() {
  const router = useRouter();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const res = await healthcareAPI.getPatientPrescriptions();
      setPrescriptions(res.data.prescriptions || []);
    } catch (error) {
      console.error("Failed to fetch prescriptions:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h1 className="text-2xl font-bold text-gray-800">Prescriptions</h1>
        <p className="text-gray-500 mt-1">View your digital prescriptions</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin h-8 w-8 text-[#1a237e]" />
        </div>
      ) : prescriptions.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center">
          <Pill className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No prescriptions yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y">
          {prescriptions.map((pres: any) => (
            <div
              key={pres._id}
              onClick={() => router.push(`/healthcare/prescriptions/${pres._id}`)}
              className="p-5 hover:bg-gray-50 cursor-pointer transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Pill className="w-5 h-5 text-purple-700" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Dr. {pres.doctorId?.fullName}</p>
                    <p className="text-sm text-gray-600">{pres.diagnosis}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(pres.prescriptionDate).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Pill className="w-3 h-3" />
                        {pres.medicines?.length || 0} medicine(s)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}