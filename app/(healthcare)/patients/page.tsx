"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Users, Search, Calendar, FileText, Loader2 } from "lucide-react";
import Link from "next/link";
import { healthcareAPI } from "@/lib/api";

export default function PatientsPage() {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (user?.role === "DOCTOR") {
      fetchPatients();
    }
  }, [user]);

  const fetchPatients = async () => {
    try {
      // Assuming an endpoint exists; if not, this will be a placeholder
      const res = await healthcareAPI.getDoctorAppointments({ limit: 100 });
      // Extract unique patients from appointments
      const uniquePatients = Array.from(
        new Map(res.data.appointments.map((apt: any) => [apt.patientId._id, apt.patientId])).values()
      );
      setPatients(uniquePatients as any);
    } catch (error) {
      console.error("Failed to fetch patients:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter((p: any) =>
    p.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (user?.role !== "DOCTOR") {
    return (
      <div className="bg-white rounded-xl p-8 text-center">
        <Users className="w-12 h-12 mx-auto text-gray-300 mb-3" />
        <p className="text-gray-500">This section is only accessible to doctors.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h1 className="text-2xl font-bold text-gray-800">My Patients</h1>
        <p className="text-gray-500 mt-1">View and manage your patient list</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search patients by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a237e]"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="animate-spin h-8 w-8 text-[#1a237e]" />
        </div>
      ) : filteredPatients.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <Users className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No patients found</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y">
          {filteredPatients.map((patient: any) => (
            <div key={patient._id} className="p-4 flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#1a237e]/10 rounded-full flex items-center justify-center text-[#1a237e] font-medium">
                  {patient.fullName?.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-gray-800">{patient.fullName}</p>
                  <p className="text-sm text-gray-500">{patient.email} • {patient.phone}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/healthcare/records/patient/${patient._id}`}
                  className="p-2 text-gray-500 hover:text-[#1a237e]"
                >
                  <FileText className="w-5 h-5" />
                </Link>
                <Link
                  href={`/healthcare/appointments?patient=${patient._id}`}
                  className="p-2 text-gray-500 hover:text-[#1a237e]"
                >
                  <Calendar className="w-5 h-5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}