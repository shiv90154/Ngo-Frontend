"use client";

import { useEffect, useState } from "react";
import {
  Calendar,
  Filter,
  User,
  Mail,
  FileText,
  Clock,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { healthcareAPI } from "@/lib/api"; 
import { useRouter } from "next/navigation";

type Appointment = {
  _id: string;
  appointmentDate: string;
  timeSlot?: string;
  status: string;
  consultationMode?: string;
  reason?: string;
  doctorId?: {
    fullName?: string;
    email?: string;
    profileImage?: string;
    doctorProfile?: {
      specialization?: string;
      experienceYears?: number;
    };
  };
  prescriptionId?: any;
};

const statusOptions = ["all", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];

export default function AppointmentsPage() {
  const router = useRouter();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      const params: {
        status?: string;
        page: number;
        limit: number;
      } = {
        page,
        limit: 10,
      };

      if (status !== "all") {
        params.status = status;
      }

      const res = await healthcareAPI.getPatientAppointments(params);

      setAppointments(res.data.appointments || []);
      setTotalPages(res.data.totalPages || 1);
      setTotal(res.data.total || 0);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to load appointments"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [status, page]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "CONFIRMED":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "COMPLETED":
        return "bg-green-50 text-green-700 border-green-200";
      case "CANCELLED":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              My Appointments
            </h1>
            <p className="text-gray-500 mt-1">
              View and manage your booked doctor appointments
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />

            <select
  value={status}
  onChange={(e) => {
    setStatus(e.target.value);
    setPage(1);
              }}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1a237e]/20 focus:border-[#1a237e]"
              
>
  {statusOptions.map((item) => {
    const val = item.toLowerCase();

    return (
      <option key={val} value={val}>
        {val === "all"
          ? "All Appointments"
          : val.charAt(0).toUpperCase() + val.slice(1)}
      </option>
    );
  })}
</select>
          </div>
        </div>
      </div>

      {loading && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 text-center">
          <Loader2 className="w-8 h-8 mx-auto text-[#1a237e] animate-spin mb-3" />
          <p className="text-gray-500">Loading appointments...</p>
        </div>
      )}

      {!loading && error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && appointments.length === 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 text-center">
          <Calendar className="w-14 h-14 mx-auto text-gray-300 mb-3" />
          <h2 className="text-lg font-semibold text-gray-800">
            No appointments found
          </h2>
          <p className="text-gray-500 mt-1">
            You have not booked any appointments yet.
          </p>

          <button
            onClick={() => router.push("/healthcare/doctors")}
            className="mt-5 px-5 py-2.5 bg-[#1a237e] text-white rounded-xl text-sm font-medium hover:bg-[#11195c] transition"
          >
            Book Appointment
          </button>
        </div>
      )}

      {!loading && !error && appointments.length > 0 && (
        <>
          <div className="grid gap-4">
            {appointments.map((appointment) => (
              <div
                key={appointment._id}
                className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-full bg-[#1a237e]/10 flex items-center justify-center overflow-hidden">
                      {appointment.doctorId?.profileImage ? (
                        <img
                          src={appointment.doctorId.profileImage}
                          alt="Doctor"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-7 h-7 text-[#1a237e]" />
                      )}
                    </div>

                    <div>
                      <h2 className="text-lg font-bold text-gray-900">
                        Dr. {appointment.doctorId?.fullName || "Unknown Doctor"}
                      </h2>

                      <p className="text-sm text-gray-500 mt-0.5">
                        {appointment.doctorId?.doctorProfile?.specialization ||
                          "Specialization not available"}
                      </p>
                      {appointment.doctorId?.email && (
                        <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-2">
                          <Mail className="w-4 h-4" />
                          {appointment.doctorId.email}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(
                        appointment.status.toUpperCase()
                      )}`}
                    >
                      {appointment.status.toUpperCase()} 
                    </span>

                    {appointment.consultationMode && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                        {appointment.consultationMode}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <Calendar className="w-4 h-4" />
                      Date
                    </div>
                    <p className="font-semibold text-gray-800 mt-1">
                      {formatDate(appointment.appointmentDate)}
                    </p>
                  </div>

                  <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <Clock className="w-4 h-4" />
                      Time Slot
                    </div>
                    <p className="font-semibold text-gray-800 mt-1">
                      {appointment.timeSlot
  ? `${appointment.timeSlot.start} - ${appointment.timeSlot.end}`
  : "Not specified"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <FileText className="w-4 h-4" />
                      Prescription
                    </div>
                    <p className="font-semibold text-gray-800 mt-1">
                      {appointment.prescriptionId ? "Available" : "Not added"}
                    </p>
                  </div>
                </div>

                {appointment.reason && (
                  <div className="mt-4 rounded-xl bg-gray-50 border border-gray-100 p-4">
                    <p className="text-sm text-gray-500">Reason</p>
                    <p className="text-gray-800 mt-1">{appointment.reason}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-sm text-gray-500">
              Showing page{" "}
              <span className="font-semibold text-gray-800">{page}</span> of{" "}
              <span className="font-semibold text-gray-800">{totalPages}</span>{" "}
              — Total {total} appointments
            </p>

            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((prev) => prev - 1)}
                className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <button
                disabled={page >= totalPages}
                onClick={() => setPage((prev) => prev + 1)}
                className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}