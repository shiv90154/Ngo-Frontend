"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { healthcareAPI, medicineAPI } from "@/lib/api";
import { Pill, Loader2, Calendar, ShoppingBag } from "lucide-react";
import { toast } from "react-toastify";

export default function PrescriptionsPage() {
  const router = useRouter();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderingId, setOrderingId] = useState<string | null>(null);

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

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const handleOrderFromPrescription = async (prescriptionId: string) => {
    try {
      setOrderingId(prescriptionId);
      const res = await healthcareAPI.getOrderItemsFromPrescription(prescriptionId);
      const items = res.data.items;

      if (!items || items.length === 0) {
        toast.error("No matching medicines found for this prescription");
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

      toast.success("Order placed successfully!");
      router.push("/healthcare/medicines/orders");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to place order");
    } finally {
      setOrderingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin h-8 w-8 text-[#1a237e]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h1 className="text-2xl font-bold text-gray-800">Prescriptions</h1>
        <p className="text-gray-500 mt-1">View your digital prescriptions</p>
      </div>

      {prescriptions.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center">
          <Pill className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No prescriptions yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y">
          {prescriptions.map((pres: any) => (
            <div key={pres._id} className="p-5 hover:bg-gray-50 transition">
              <div className="flex items-start justify-between">
                <div
                  className="flex gap-4 flex-1 cursor-pointer"
                  onClick={() =>
                    router.push(`/healthcare/patient/prescriptions/${pres._id}`)
                  }
                >
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Pill className="w-5 h-5 text-purple-700" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      Dr. {pres.doctorId?.fullName}
                    </p>
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

                {/* 🆕 Order Medicines Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOrderFromPrescription(pres._id);
                  }}
                  disabled={orderingId === pres._id}
                  className="ml-4 flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 whitespace-nowrap"
                >
                  {orderingId === pres._id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ShoppingBag className="w-4 h-4" />
                  )}
                  Order Medicines
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}