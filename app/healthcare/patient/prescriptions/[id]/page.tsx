"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { healthcareAPI, medicineAPI } from "@/lib/api";
import {
  Pill,
  Calendar,
  User,
  Loader2,
  ChevronLeft,
  Printer,
  Stethoscope,
  Mail,
  ClipboardList,
  AlertCircle,
  ShoppingBag,
} from "lucide-react";
import { toast } from "react-toastify";

export default function PrescriptionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const prescriptionId = params?.id as string;

  const [prescription, setPrescription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(false);

  useEffect(() => {
    if (!prescriptionId) return;
    fetchPrescription();
  }, [prescriptionId]);

  const fetchPrescription = async () => {
    try {
      setLoading(true);
      const res = await healthcareAPI.getPrescriptionById(prescriptionId);
      const data = res.data?.prescription || res.data?.data || res.data || null;
      setPrescription(data);
    } catch (error) {
      console.error(error);
      setPrescription(null);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderFromPrescription = async () => {
    try {
      setOrdering(true);
      const res = await healthcareAPI.getOrderItemsFromPrescription(prescriptionId);
      const items = res.data.items;
      if (!items?.length) {
        toast.error("No medicines found");
        return;
      }
      await medicineAPI.createOrder({
        items: items.map((item: any) => ({
          medicine: item.medicine,
          quantity: item.quantity || 1,
        })),
        paymentMethod: "wallet",
        prescriptionId,
      });
      toast.success("Order placed!");
      router.push("/healthcare/medicines/orders");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Order failed");
    } finally {
      setOrdering(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const doctor = prescription?.doctorId || prescription?.doctor || {};
  const patient = prescription?.patientId || prescription?.patient || {};
  const medicines = prescription?.medicines || [];
  const tests = prescription?.tests || [];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin h-9 w-9 text-[#1a237e]" />
      </div>
    );
  }

  if (!prescription) {
    return (
      <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-gray-200 p-10 text-center">
        <AlertCircle className="w-12 h-12 mx-auto text-red-400 mb-3" />
        <h2 className="text-xl font-semibold text-gray-800">
          Prescription not found
        </h2>
        <p className="text-gray-500 mt-1">Unable to load prescription details.</p>
        <button
          onClick={() => router.back()}
          className="mt-5 px-5 py-2 rounded-lg bg-[#1a237e] text-white"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-5 print:max-w-full">
      <div className="flex items-center justify-between print:hidden">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-[#1a237e] font-medium"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>

        <div className="flex gap-2">
          <button
            onClick={handleOrderFromPrescription}
            disabled={ordering}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-60"
          >
            {ordering ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ShoppingBag className="w-4 h-4" />
            )}
            Order Medicines
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-[#1a237e] text-white px-4 py-2 rounded-lg hover:bg-[#12195c]"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
        </div>
      </div>

      {/* … rest of the prescription display is unchanged … */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden print:shadow-none print:border-0">
        <div className="bg-gradient-to-r from-[#1a237e] to-purple-700 text-white p-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center">
              <Pill className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Digital Prescription</h1>
              <p className="text-white/80 text-sm">Prescription ID: {prescription._id}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Doctor Details */}
            <div className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Stethoscope className="w-5 h-5 text-[#1a237e]" />
                <h2 className="font-semibold text-gray-800">Doctor Details</h2>
              </div>
              <p className="text-lg font-semibold text-gray-900">
                Dr. {doctor?.fullName || "Unknown Doctor"}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {doctor?.doctorProfile?.specialization || "Specialization not available"}
              </p>
              {doctor?.email && (
                <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                  <Mail className="w-4 h-4" /> {doctor.email}
                </p>
              )}
            </div>

            {/* Patient Details */}
            <div className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <User className="w-5 h-5 text-purple-700" />
                <h2 className="font-semibold text-gray-800">Patient Details</h2>
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {patient?.fullName || "Unknown Patient"}
              </p>
              {patient?.email && <p className="text-sm text-gray-600 mt-1">{patient.email}</p>}
              {patient?.phone && <p className="text-sm text-gray-500 mt-1">{patient.phone}</p>}
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-3">
                <Calendar className="w-4 h-4" />
                {prescription.prescriptionDate
                  ? new Date(prescription.prescriptionDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "Date not available"}
              </div>
            </div>
          </div>

          {/* Diagnosis */}
          <div className="border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <ClipboardList className="w-5 h-5 text-[#1a237e]" />
              <h2 className="font-semibold text-gray-800">Diagnosis</h2>
            </div>
            <p className="text-gray-700">{prescription.diagnosis || "No diagnosis added"}</p>
          </div>

          {/* Medicines (unchanged) */}
          <div>
            <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Pill className="w-5 h-5 text-purple-700" />
              Medicines
            </h2>
            {medicines.length === 0 ? (
              <div className="border border-dashed border-gray-300 rounded-xl p-5 text-center text-gray-500">
                No medicines added
              </div>
            ) : (
              <div className="space-y-3">
                {medicines.map((med: any, idx: number) => (
                  <div key={idx} className="border border-gray-200 bg-gray-50 rounded-xl p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {idx + 1}. {med.name || med.medicineName || "Unnamed Medicine"}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2 text-sm">
                          <span className="px-3 py-1 bg-white border rounded-full text-gray-700">
                            Dosage: {med.dosage || "N/A"}
                          </span>
                          <span className="px-3 py-1 bg-white border rounded-full text-gray-700">
                            Frequency: {med.frequency || "N/A"}
                          </span>
                          <span className="px-3 py-1 bg-white border rounded-full text-gray-700">
                            Duration: {med.duration || "N/A"}
                          </span>
                        </div>
                        {med.instructions && (
                          <p className="text-sm text-gray-600 mt-3">Instructions: {med.instructions}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tests, Advice, Follow-up (unchanged) */}
          {tests.length > 0 && (
            <div className="border border-gray-200 rounded-xl p-4">
              <h2 className="font-semibold text-gray-800 mb-3">Recommended Tests</h2>
              <ul className="space-y-2">
                {tests.map((test: any, idx: number) => (
                  <li key={idx} className="text-gray-700 flex gap-2">
                    <span className="font-medium">{idx + 1}.</span>
                    {test.name || test}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {prescription.advice && (
            <div className="border border-gray-200 rounded-xl p-4">
              <h2 className="font-semibold text-gray-800 mb-2">Advice</h2>
              <p className="text-gray-700">{prescription.advice}</p>
            </div>
          )}
          {prescription.followUpDate && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-600 font-medium">Follow-up Date</p>
              <p className="text-gray-800 font-semibold mt-1">
                {new Date(prescription.followUpDate).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}