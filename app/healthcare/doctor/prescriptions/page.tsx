"use client";

import { useEffect, useState } from "react";
import { healthcareAPI } from "@/lib/api";
import { Loader2, FileText, Search, Calendar } from "lucide-react";
import Link from "next/link";

export default function DoctorPrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => { fetchPrescriptions(); }, []);

  const fetchPrescriptions = async () => {
    try {
      // Get all patients first, then their prescriptions (simplified)
      const apptRes = await healthcareAPI.getDoctorAppointments({ limit: 200 });
      const patientIds = [...new Set(apptRes.data.appointments.map((a: any) => a.patientId?._id).filter(Boolean))];
      
      let allPrescriptions: any[] = [];
      for (const pid of patientIds) {
        try {
          const res = await healthcareAPI.getPatientPrescriptions(pid);
          allPrescriptions = [...allPrescriptions, ...(res.data.prescriptions || [])];
        } catch (e) { /* skip */ }
      }
      // Sort by date desc
      allPrescriptions.sort((a, b) => new Date(b.prescriptionDate).getTime() - new Date(a.prescriptionDate).getTime());
      setPrescriptions(allPrescriptions);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = prescriptions.filter((p: any) =>
    p.patientId?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    p.diagnosis?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">My Prescriptions</h1>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search by patient or diagnosis..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg text-sm w-64"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="animate-spin text-[#1a237e]" /></div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center shadow-sm border">
          <FileText className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No prescriptions issued yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left">Patient</th>
                <th className="px-4 py-3 text-left">Diagnosis</th>
                <th className="px-4 py-3 text-left">Medicines</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((pres: any) => (
                <tr key={pres._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{pres.patientId?.fullName}</td>
                  <td className="px-4 py-3">{pres.diagnosis}</td>
                  <td className="px-4 py-3">{pres.medicines?.length || 0} medicine(s)</td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {new Date(pres.prescriptionDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Link
                      href={`/healthcare/prescriptions/${pres._id}`}
                      className="text-[#1a237e] hover:underline text-sm"
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