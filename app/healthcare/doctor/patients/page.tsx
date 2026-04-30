"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api"; // direct Axios instance
import { Search, Loader2 } from "lucide-react";
import Link from "next/link";

export default function DoctorPatientsPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Use direct API call instead of the missing getMyPatients method
    api.get("/doctor/patients")
      .then(res => {
        setPatients(res.data.patients);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = patients.filter((p: any) =>
    p.fullName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Patients</h1>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search patients..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg"
        />
      </div>
      {loading ? (
        <Loader2 className="animate-spin mx-auto" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((p: any) => (
            <Link
              key={p._id}
              href={`/healthcare/doctor/patients/${p._id}`}
              className="bg-white p-4 rounded-xl shadow-sm border hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#1a237e] rounded-full text-white flex items-center justify-center">
                  {p.fullName?.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{p.fullName}</p>
                  <p className="text-sm text-gray-500">
                    {p.email} • {p.phone}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}