"use client";

import { useEffect, useRef, useState } from "react";
import { healthcareAPI } from "@/lib/api";
import { Search, Loader2, User } from "lucide-react";
import Link from "next/link";

export default function DoctorPatientsPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const requestIdRef = useRef(0);

  const fetchPatients = async (searchValue = "") => {
    const currentRequestId = ++requestIdRef.current;
    const cleanSearch = searchValue.trim().toLowerCase();

    try {
      setLoading(true);

      const res = await healthcareAPI.getDoctorPatients({
        search: cleanSearch || undefined,
        page: 1,
        limit: 20,
      });

      // Ignore old/stale responses
      if (currentRequestId !== requestIdRef.current) return;

      let fetchedPatients = res.data.patients || [];

      // Frontend safety filter
      // This helps if backend accidentally returns unmatched patients.
      if (cleanSearch) {
        fetchedPatients = fetchedPatients.filter((p: any) => {
          const fullName = p.fullName?.toLowerCase() || "";
          const email = p.email?.toLowerCase() || "";
          const phone = p.phone?.toLowerCase() || "";

          return (
            fullName.includes(cleanSearch) ||
            email.includes(cleanSearch) ||
            phone.includes(cleanSearch)
          );
        });
      }

      setPatients(fetchedPatients);
    } catch (error) {
      console.error("Failed to fetch patients:", error);
      setPatients([]);
    } finally {
      if (currentRequestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  };

  // Live search only
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPatients(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h1 className="text-2xl font-bold text-gray-800">My Patients</h1>
        <p className="text-gray-500 text-sm mt-1">
          View and manage your patients
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search patients by name, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a237e]/20 focus:border-[#1a237e]"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin h-8 w-8 text-[#1a237e]" />
        </div>
      ) : patients.length === 0 ? (
        <div className="mt-20 flex items-center justify-center">
  <div className="text-center px-4">
    <User className="w-10 h-10 mx-auto text-gray-300 mb-3" />
    <p className="text-gray-500">
      {search.trim() ? "No matching patients found" : "No patients found"}
    </p>
  </div>
</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {patients.map((p: any) => (
            <Link
              key={p._id}
              href={`/healthcare/doctor/patients/${p._id}`}
              className="bg-white p-4 rounded-xl shadow-sm border hover:shadow-md transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#1a237e]/10 text-[#1a237e] rounded-full flex items-center justify-center font-semibold uppercase">
                  {p.fullName?.charAt(0) || "P"}
                </div>

                <div className="min-w-0">
                  <p className="font-medium text-gray-800 truncate">
                    {p.fullName || "Unknown Patient"}
                  </p>

                  <p className="text-sm text-gray-500 truncate">
                    {p.email || "No email"}
                  </p>

                  {p.phone && (
                    <p className="text-xs text-gray-400">{p.phone}</p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}