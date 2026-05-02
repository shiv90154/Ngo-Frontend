"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { healthcareAPI } from "@/lib/api";
import {
  Loader2,
  Calendar,
  Users,
  Activity,
  ClipboardList,
  Search,
  RefreshCcw,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
} from "lucide-react";
import Link from "next/link";

type AppointmentStatus =
  | "booked"
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed"
  | "no-show";

type Appointment = {
  _id: string;
  patientId?: {
    _id?: string;
    fullName?: string;
    email?: string;
    phone?: string;
    profileImage?: string;
  };
  appointmentDate?: string;
  timeSlot?: {
    start?: string;
    end?: string;
  };
  consultationType?: string;
  status?: AppointmentStatus;
  symptoms?: string;
};

type DashboardStats = {
  totalAppointments: number;
  totalPatients: number;
  totalPrescriptions: number;
  totalRevenue: number;
};

export default function DoctorDashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState<DashboardStats>({
    totalAppointments: 0,
    totalPatients: 0,
    totalPrescriptions: 0,
    totalRevenue: 0,
  });

  const [recentAppointments, setRecentAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await healthcareAPI.getDoctorDashboard();

      const data = res.data;

      setStats({
        totalAppointments: data?.stats?.totalAppointments || 0,
        totalPatients: data?.stats?.totalPatients || 0,
        totalPrescriptions: data?.stats?.totalPrescriptions || 0,
        totalRevenue: data?.stats?.totalRevenue || 0,
      });

      setRecentAppointments(data?.recentAppointments || []);
    } catch (error) {
      console.error("Failed to fetch doctor dashboard:", error);
      setError("Failed to load dashboard. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (
    appointmentId: string,
    status: "confirmed" | "cancelled" | "completed" | "no-show"
  ) => {
    try {
      setActionLoadingId(appointmentId);
      await healthcareAPI.updateAppointmentStatus(appointmentId, { status });
      await fetchDashboard();
    } catch (error) {
      console.error("Failed to update appointment:", error);
      alert("Failed to update appointment status");
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredAppointments = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return recentAppointments;

    return recentAppointments.filter((appt) => {
      const patientName = appt.patientId?.fullName?.toLowerCase() || "";
      const status = appt.status?.toLowerCase() || "";
      const type = appt.consultationType?.toLowerCase() || "";

      return (
        patientName.includes(value) ||
        status.includes(value) ||
        type.includes(value)
      );
    });
  }, [search, recentAppointments]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-[#1a237e]" size={36} />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="bg-gradient-to-r from-[#1a237e] to-[#283593] rounded-2xl p-6 text-white shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Doctor Dashboard</h1>
            <p className="mt-1 text-blue-100">
              Welcome back, Dr. {user?.fullName || "Doctor"}
            </p>
          </div>

          <button
            onClick={fetchDashboard}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/15 hover:bg-white/25 px-4 py-2 text-sm font-medium transition"
          >
            <RefreshCcw size={16} />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Appointments"
          value={stats.totalAppointments}
          icon={<Calendar size={21} />}
          color="bg-blue-100 text-blue-700"
        />
        <StatCard
          label="Patients"
          value={stats.totalPatients}
          icon={<Users size={21} />}
          color="bg-green-100 text-green-700"
        />
        <StatCard
          label="Prescriptions"
          value={stats.totalPrescriptions}
          icon={<ClipboardList size={21} />}
          color="bg-purple-100 text-purple-700"
        />
        <StatCard
          label="Revenue"
          value={`₹${Number(stats.totalRevenue || 0).toLocaleString("en-IN")}`}
          icon={<Activity size={21} />}
          color="bg-orange-100 text-orange-700"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 lg:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Recent Appointments
              </h2>
              <p className="text-sm text-gray-500">
                View and manage latest patient bookings
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search appointment..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#1a237e] focus:ring-2 focus:ring-[#1a237e]/10"
              />
            </div>
          </div>

          {filteredAppointments.length === 0 ? (
            <div className="rounded-xl bg-gray-50 border border-dashed border-gray-200 p-8 text-center">
              <Calendar className="mx-auto text-gray-400 mb-3" size={34} />
              <p className="font-medium text-gray-700">No appointments found</p>
              <p className="text-sm text-gray-500 mt-1">
                Recent patient appointments will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAppointments.map((appt) => (
                <AppointmentCard key={appt._id} appt={appt} />
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>

          <div className="space-y-3">
            <QuickLink
              href="/doctor/appointments"
              icon={<Calendar size={18} />}
              title="Manage Appointments"
              desc="View all bookings"
            />
            <QuickLink
              href="/doctor/patients"
              icon={<Users size={18} />}
              title="My Patients"
              desc="Search patient records"
            />
            <QuickLink
              href="/doctor/prescriptions"
              icon={<ClipboardList size={18} />}
              title="Prescriptions"
              desc="Create and view prescriptions"
            />
            <QuickLink
              href="/doctor/availability"
              icon={<Clock size={18} />}
              title="Availability"
              desc="Manage slots and working days"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function AppointmentCard({ appt }: { appt: Appointment }) {
  const status = appt.status || "booked";

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#1a237e]/10 text-[#1a237e] flex items-center justify-center font-bold">
            {(appt.patientId?.fullName || "P").charAt(0).toUpperCase()}
          </div>

          <div>
            <p className="font-semibold text-gray-900">
              {appt.patientId?.fullName || "Patient"}
            </p>
            <p className="text-sm text-gray-500">
              {formatDate(appt.appointmentDate)}{" "}
              {appt.timeSlot?.start && `• ${appt.timeSlot.start}`}
              {appt.consultationType && ` • ${appt.consultationType}`}
            </p>
          </div>
        </div>

        {appt.symptoms && (
          <p className="text-sm text-gray-600 line-clamp-2">
            <span className="font-medium">Symptoms:</span> {appt.symptoms}
          </p>
        )}

        <div>
          <StatusBadge status={status} />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function QuickLink({
  href,
  icon,
  title,
  desc,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 hover:bg-[#1a237e]/5 hover:border-[#1a237e]/20 transition"
    >
      <div className="w-10 h-10 rounded-xl bg-[#1a237e]/10 text-[#1a237e] flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-900">{title}</p>
        <p className="text-xs text-gray-500">{desc}</p>
      </div>
    </Link>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    booked: "bg-blue-100 text-blue-700",
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
    completed: "bg-purple-100 text-purple-700",
    "no-show": "bg-gray-200 text-gray-700",
  };

  return (
    <span
      className={`text-xs capitalize px-3 py-1.5 rounded-full font-medium ${
        styles[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status.replace("-", " ")}
    </span>
  );
}

function formatDate(date?: string) {
  if (!date) return "No date";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}