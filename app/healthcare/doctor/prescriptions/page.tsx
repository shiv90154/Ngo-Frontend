"use client";

import { useEffect, useRef, useState } from "react";
import { healthcareAPI } from "@/lib/api";
import { Loader2, FileText, Search } from "lucide-react";
import Link from "next/link";

export default function DoctorPrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const requestIdRef = useRef(0);

  const fetchPrescriptions = async (searchValue = "") => {
    const currentRequestId = ++requestIdRef.current;

    try {
      setLoading(true);

      const apptRes = await healthcareAPI.getDoctorAppointments({
        page: 1,
        limit: 200,
      });

      const appointments = apptRes.data.appointments || [];

      const patientMap = new Map<string, any>();

      appointments.forEach((a: any) => {
        const patient = a.patientId;

        if (patient?._id) {
          patientMap.set(String(patient._id), patient);
        } else if (patient) {
          patientMap.set(String(patient), { _id: patient });
        }
      });

      const patientIds = Array.from(patientMap.keys());

      let allPrescriptions: any[] = [];

      await Promise.all(
        patientIds.map(async (patientId: string) => {
          try {
            const res = await healthcareAPI.getPatientPrescriptions(patientId, {
              page: 1,
              limit: 100,
            });

            const patientData = patientMap.get(String(patientId));

            const prescriptionsWithPatient = (
              res.data.prescriptions || []
            ).map((pres: any) => {
              const presPatientId =
                pres.patientId?._id || pres.patientId || patientId;

              const matchedPatient =
                patientMap.get(String(presPatientId)) || patientData;

              return {
                ...pres,
                patientId:
                  typeof pres.patientId === "object"
                    ? {
                        ...matchedPatient,
                        ...pres.patientId,
                      }
                    : matchedPatient || {
                        _id: presPatientId,
                        fullName: "Unknown Patient",
                      },
              };
            });

            allPrescriptions.push(...prescriptionsWithPatient);
          } catch (error) {
            console.error("Failed to fetch patient prescriptions:", error);
          }
        })
      );

      if (currentRequestId !== requestIdRef.current) return;

      const uniquePrescriptions = Array.from(
        new Map(allPrescriptions.map((p: any) => [p._id, p])).values()
      );

      const cleanSearch = searchValue.trim().toLowerCase();

      const filteredPrescriptions = cleanSearch
        ? uniquePrescriptions.filter((p: any) => {
            const patientName =
              p.patientId?.fullName?.toLowerCase() || "";
            const diagnosis = p.diagnosis?.toLowerCase() || "";
            const medicines =
              p.medicines
                ?.map((m: any) => m.name)
                .join(" ")
                .toLowerCase() || "";

            return (
              patientName.includes(cleanSearch) ||
              diagnosis.includes(cleanSearch) ||
              medicines.includes(cleanSearch)
            );
          })
        : uniquePrescriptions;

      filteredPrescriptions.sort(
        (a: any, b: any) =>
          new Date(b.prescriptionDate || b.createdAt).getTime() -
          new Date(a.prescriptionDate || a.createdAt).getTime()
      );

      setPrescriptions(filteredPrescriptions);
    } catch (error) {
      console.error("Failed to fetch prescriptions:", error);
      setPrescriptions([]);
    } finally {
      if (currentRequestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPrescriptions(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              My Prescriptions
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              View prescriptions issued to your patients
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search patient, diagnosis, medicine..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a237e]/20 focus:border-[#1a237e]"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border min-h-[50vh] flex items-center justify-center">
          <Loader2 className="animate-spin h-8 w-8 text-[#1a237e]" />
        </div>
      ) : prescriptions.length === 0 ? (
        <div className="bg-white rounded-xl border min-h-[50vh] flex items-center justify-center">
          <div className="text-center px-4">
            <FileText className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">
              {search.trim()
                ? "No matching prescriptions found."
                : "No prescriptions issued yet."}
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Patient
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Diagnosis
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Medicines
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Date
                </th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {prescriptions.map((pres: any) => (
                <tr key={pres._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {pres.patientId?.fullName || "Unknown Patient"}
                  </td>

                  <td className="px-4 py-3 text-gray-600">
                    {pres.diagnosis || "No diagnosis added"}
                  </td>

                  <td className="px-4 py-3 text-gray-600">
                    {pres.medicines?.length || 0} medicine(s)
                  </td>

                  <td className="px-4 py-3 text-xs text-gray-500">
                    {pres.prescriptionDate || pres.createdAt
                      ? new Date(
                          pres.prescriptionDate || pres.createdAt
                        ).toLocaleDateString()
                      : "N/A"}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <Link
  href={`/healthcare/doctor/prescriptions/${pres.patientId?._id || pres.patientId}`}
  className="text-[#1a237e] hover:underline text-sm font-medium"
>
  View
</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}