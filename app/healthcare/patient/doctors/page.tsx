"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  Stethoscope,
  Star,
  Loader2,
  UserRound,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Calendar,
  Clock,
  Video,
  Phone,
  MessageCircle,
  IndianRupee,
} from "lucide-react";
import { healthcareAPI } from "@/lib/api";

type Doctor = {
  _id?: string;
  id?: string;
  fullName?: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  specialization?: string;
  experience?: number | string;
  qualifications?: string;
  qualification?: string;
  state?: string;
  district?: string;
  city?: string;
  consultationFee?: number;
  rating?: number;
  isActive?: boolean;
  doctorProfile?: {
    specialization?: string;
    experienceYears?: number;
    consultationFee?: number;
    qualifications?: string[];
  };
};

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specialization, setSpecialization] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const limit = 8;

  const fetchDoctors = async (pageNumber = page) => {
    try {
      setLoading(true);
      setError("");

      const res = await healthcareAPI.searchDoctors({
        search: specialization.trim() || undefined,
        page: pageNumber,
        limit,
      });

      const payload = res.data;
      const doctorList = payload?.data?.doctors || payload?.doctors || payload?.data || [];

      setDoctors(Array.isArray(doctorList) ? doctorList : []);
      setTotalPages(payload?.data?.totalPages || payload?.totalPages || 1);
      setTotalDoctors(payload?.data?.total || payload?.total || doctorList.length || 0);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Unable to fetch doctors. Please try again.");
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (page !== 1) {
        setPage(1);
      } else {
        fetchDoctors(1);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [specialization]);

  useEffect(() => {
    fetchDoctors(page);
  }, [page]);

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-[#1a237e] via-[#283593] to-[#3949ab] p-6 shadow-sm">
        <div className="absolute right-6 top-6 opacity-10">
          <Stethoscope className="h-28 w-28 text-white" />
        </div>
        <div className="relative">
          <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">
            <Stethoscope className="h-3.5 w-3.5" />
            Healthcare Directory
          </p>
          <h1 className="text-2xl font-bold text-white md:text-3xl">
            Find Trusted Doctors
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-indigo-100">
            Search doctors by specialization. Patients can view available doctors and choose the right specialist.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            placeholder="Search doctors by Specialization, Name, or Location"
            className="h-11 w-full rounded-xl border border-gray-200 pl-10 pr-4 text-sm outline-none transition focus:border-[#1a237e] focus:ring-2 focus:ring-[#1a237e]/15"
          />
        </div>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {loading ? "Searching doctors..." : `${totalDoctors} doctor${totalDoctors === 1 ? "" : "s"} found`}
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex min-h-[280px] items-center justify-center rounded-2xl border border-gray-200 bg-white">
          <div className="text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#1a237e]" />
            <p className="mt-3 text-sm text-gray-500">Loading doctors...</p>
          </div>
        </div>
      ) : doctors.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-12 text-center">
          <Stethoscope className="mx-auto mb-3 h-12 w-12 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-800">No doctors found</h3>
          <p className="mt-1 text-sm text-gray-500">Try changing your specialization.</p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {doctors.map((doctor) => {
            const doctorId = doctor._id || doctor.id;
            const name = doctor.fullName || doctor.name || "Doctor";
            const specialization = doctor.specialization || doctor.doctorProfile?.specialization || "General Healthcare";
            const experience = doctor.experience || doctor.doctorProfile?.experienceYears || 0;
            const consultationFee = doctor.consultationFee || doctor.doctorProfile?.consultationFee || 500;
            const qualification = doctor.qualifications || doctor.qualification || "Medical Professional";
            
            // Prepare doctor data to pass via query params
            const doctorData = {
              id: doctorId,
              name: name,
              specialization: specialization,
              experience: experience,
              consultationFee: consultationFee,
              qualification: qualification,
              location: [doctor.city, doctor.district, doctor.state].filter(Boolean).join(", "),
              city: doctor.city,
              district: doctor.district,
              state: doctor.state,
              isActive: doctor.isActive,
              rating: doctor.rating || 4.8,
              doctorProfile: doctor.doctorProfile
            };

            return (
              <div
                key={doctorId || name}
                className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#1a237e]/30 hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#1a237e]/10 text-[#1a237e]">
                    <UserRound className="h-7 w-7" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="truncate text-lg font-bold text-gray-850">Dr. {name}</h2>
                    <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-[#1a237e]">
                      <Stethoscope className="h-3.5 w-3.5" />
                      {specialization}
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-gray-400" />
                    <span>{qualification}</span>
                  </div>
                  {(doctor.district || doctor.state || doctor.city) && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>{[doctor.city, doctor.district, doctor.state].filter(Boolean).join(", ")}</span>
                    </div>
                  )}
                  {experience > 0 && (
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-gray-400" />
                      <span>{experience} years experience</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <IndianRupee className="h-4 w-4 text-gray-400" />
                    <span className="font-semibold text-gray-800">₹{consultationFee}</span>
                    <span className="text-gray-400">per consultation</span>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                  <div>
                    <p className="text-xs text-gray-400">Status</p>
                    <p className={`text-sm font-semibold ${doctor.isActive === false ? "text-gray-500" : "text-emerald-600"}`}>
                      {doctor.isActive === false ? "Unavailable" : "Available"}
                    </p>
                  </div>

                  {doctorId ? (
                    <Link
                      href={{
                        pathname: `/healthcare/patient/doctors/${doctorId}`,
                        query: { data: JSON.stringify(doctorData) }
                      }}
                      className="inline-flex items-center justify-center rounded-xl bg-[#1a237e] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#11195f]"
                    >
                      View Profile
                    </Link>
                  ) : (
                    <button disabled className="rounded-xl bg-[#1a237e] px-4 py-2 text-sm font-semibold text-white opacity-50 cursor-not-allowed">
                      View Profile
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            disabled={page <= 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            className="inline-flex items-center gap-1 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
            Prev
          </button>
          <span className="text-sm font-medium text-gray-600">Page {page} of {totalPages}</span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            className="inline-flex items-center gap-1 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}