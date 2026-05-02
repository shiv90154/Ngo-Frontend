"use client";

import { useEffect, useRef, useState } from "react";
import { healthcareAPI } from "@/lib/api";
import { Search, Loader2, User, Mail, Phone, Users } from "lucide-react";
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

      if (currentRequestId !== requestIdRef.current) return;

      let fetchedPatients = res.data.patients || [];

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

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPatients(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="min-h-screen bg-gray-50/70 p-4 md:p-6">
      <div className="space-y-6">
        <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#1a237e] via-blue-500 to-cyan-400" />

          <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1a237e]/10 text-[#1a237e]">
                  <Users className="h-5 w-5" />
                </div>

                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                    My Patients
                  </h1>
                  <p className="mt-1 text-sm text-gray-500">
                    View, search and manage your patient records
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-full bg-[#1a237e]/10 px-4 py-2 text-sm font-semibold text-[#1a237e]">
              {patients.length} {patients.length === 1 ? "Patient" : "Patients"}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              placeholder="Search patients by name, email or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pl-11 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#1a237e] focus:bg-white focus:ring-4 focus:ring-[#1a237e]/10"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-[260px] items-center justify-center rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#1a237e]" />
              <p className="mt-3 text-sm text-gray-500">Loading patients...</p>
            </div>
          </div>
        ) : patients.length === 0 ? (
          <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white shadow-sm">
            <div className="px-4 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                <User className="h-7 w-7 text-gray-400" />
              </div>

              <h3 className="text-base font-semibold text-gray-800">
                {search.trim() ? "No matching patients found" : "No patients found"}
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                {search.trim()
                  ? "Try searching with another name, email or phone number."
                  : "Your patient list will appear here once available."}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {patients.map((p: any) => (
              <Link
                key={p._id}
                href={`/healthcare/doctor/patients/${p._id}`}
                className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#1a237e]/30 hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1a237e] to-blue-700 text-lg font-bold uppercase text-white shadow-sm">
                    {p.fullName?.charAt(0) || "P"}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-base font-semibold text-gray-900 group-hover:text-[#1a237e]">
                      {p.fullName || "Unknown Patient"}
                    </p>

                    <div className="mt-3 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Mail className="h-4 w-4 shrink-0 text-gray-400" />
                        <span className="truncate">{p.email || "No email"}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Phone className="h-4 w-4 shrink-0 text-gray-400" />
                        <span className="truncate">{p.phone || "No phone number"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                  <span className="text-xs font-medium text-gray-400">
                    Patient Profile
                  </span>

                  <span className="text-xs font-semibold text-[#1a237e] transition group-hover:translate-x-1">
                    View Details →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}