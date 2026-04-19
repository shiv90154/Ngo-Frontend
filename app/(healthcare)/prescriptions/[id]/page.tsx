"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { healthcareAPI } from "@/lib/api";
import { Pill, Calendar, User, Loader2, ChevronLeft, Printer } from "lucide-react";

export default function PrescriptionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [prescription, setPrescription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrescription();
  }, [params.id]);

  const fetchPrescription = async () => {
    try {
      const res = await healthcareAPI.getPrescriptionById(params.id as string);
      setPrescription(res.data.prescription);
    } catch (error) {
      console.error("Failed to fetch prescription:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin h-8 w-8 text-[#1a237e]" />
      </div>
    );
  }

  if (!prescription) {
    return <div className="text-center py-12">Prescription not found</div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-[#1a237e]"
      >
        <ChevronLeft className="w-5 h-5" /> Back
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 print:shadow-none print:border-0">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Prescription</h1>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 text-[#1a237e] print:hidden"
          >
            <Printer className="w-4 h-4" /> Print
          </button>
        </div>

        <div className="border-b pb-4 mb-4">
          <p className="text-lg font-semibold">Dr. {prescription.doctorId?.fullName}</p>
          <p className="text-gray-600">{prescription.doctorId?.doctorProfile?.specialization}</p>
          <p className="text-sm text-gray-500">Reg. No: {prescription.doctorId?.doctorProfile?.registrationNumber}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-500">Patient</p>
            <p className="font-medium">{prescription.patientId?.fullName}</p>
            <p className="text-sm text-gray-600">{prescription.patientId?.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date</p>
            <p className="font-medium">
              {new Date(prescription.prescriptionDate).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-1">Diagnosis</p>
          <p className="font-medium text-gray-800">{prescription.diagnosis}</p>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-2">Medicines</p>
          <div className="space-y-3">
            {prescription.medicines.map((med: any, idx: number) => (
              <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                <p className="font-medium">{med.name} ({med.dosage})</p>
                <p className="text-sm text-gray-600">{med.frequency} for {med.duration}</p>
                {med.instructions && <p className="text-xs text-gray-500 mt-1">{med.instructions}</p>}
              </div>
            ))}
          </div>
        </div>

        {prescription.tests?.length > 0 && (
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-2">Recommended Tests</p>
            <ul className="list-disc list-inside">
              {prescription.tests.map((test: any, idx: number) => (
                <li key={idx} className="text-gray-700">{test.name}</li>
              ))}
            </ul>
          </div>
        )}

        {prescription.advice && (
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-1">Advice</p>
            <p className="text-gray-700">{prescription.advice}</p>
          </div>
        )}

        {prescription.followUpDate && (
          <div className="mb-6">
            <p className="text-sm text-gray-500">Follow-up Date</p>
            <p>{new Date(prescription.followUpDate).toLocaleDateString()}</p>
          </div>
        )}
      </div>
    </div>
  );
}