"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { healthcareAPI } from "@/lib/api";
import {
  Loader2,
  Calendar,
  Users,
  Activity,
  ClipboardList,
  Clock,
} from "lucide-react";
import Link from "next/link";

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    pendingAppointments: 0,
  });
  const [recentAppointments, setRecentAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    fetchDashboard();
  }, [user]);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await healthcareAPI.getDoctorDashboard?.();
      if (res?.data) {
        setStats(res.data.stats);
        setRecentAppointments(res.data.recentAppointments || []);
      }
    } catch (error) {
      console.error("Failed to fetch doctor dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-[#1a237e]" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1a237e] to-[#283593] rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold">Doctor Dashboard</h1>
        <p className="mt-1 text-blue-100">
          Welcome back, Dr. {user?.fullName}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total Patients"
          value={stats.totalPatients}
          icon={<Users size={20} />}
          color="bg-blue-100 text-blue-700"
        />
        <StatCard
          label="Today's Appointments"
          value={stats.todayAppointments}
          icon={<Calendar size={20} />}
          color="bg-green-100 text-green-700"
        />
        <StatCard
          label="Pending Requests"
          value={stats.pendingAppointments}
          icon={<Clock size={20} />}
          color="bg-orange-100 text-orange-700"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link
          href="/healthcare/doctor/appointments"
          className="bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition flex flex-col items-center gap-2 text-center"
        >
          <Calendar size={24} className="text-[#1a237e]" />
          <span className="text-sm font-medium">Appointments</span>
        </Link>
        <Link
          href="/healthcare/doctor/patients"
          className="bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition flex flex-col items-center gap-2 text-center"
        >
          <Users size={24} className="text-[#1a237e]" />
          <span className="text-sm font-medium">Patients</span>
        </Link>
        <Link
          href="/healthcare/doctor/prescriptions"
          className="bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition flex flex-col items-center gap-2 text-center"
        >
          <ClipboardList size={24} className="text-[#1a237e]" />
          <span className="text-sm font-medium">Prescriptions</span>
        </Link>
        <Link
          href="/healthcare/doctor/schedule"
          className="bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition flex flex-col items-center gap-2 text-center"
        >
          <Clock size={24} className="text-[#1a237e]" />
          <span className="text-sm font-medium">Schedule</span>
        </Link>
      </div>

      {/* Recent Appointments */}
      <div className="bg-white rounded-xl border shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Appointments</h2>
          <Link
            href="/healthcare/doctor/appointments"
            className="text-sm text-[#1a237e] hover:underline"
          >
            View all
          </Link>
        </div>
        {recentAppointments.length === 0 ? (
          <p className="text-gray-500 text-center py-6">
            No recent appointments
          </p>
        ) : (
          <div className="space-y-3">
            {recentAppointments.map((appt: any) => (
              <div
                key={appt._id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#1a237e]/10 rounded-full flex items-center justify-center text-[#1a237e] font-medium">
                    {appt.patientId?.fullName?.charAt(0) || "P"}
                  </div>
                  <div>
                    <p className="font-medium">
                      {appt.patientId?.fullName || "Patient"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(appt.appointmentDate).toLocaleDateString(
                        "en-IN",
                        { day: "2-digit", month: "short", year: "numeric" }
                      )}{" "}
                      • {appt.timeSlot?.start}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-xs capitalize px-2 py-1 rounded-full font-medium ${
                    appt.status === "confirmed"
                      ? "bg-green-100 text-green-700"
                      : appt.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {appt.status || "Booked"}
                </span>
              </div>
            ))}
          </div>
        )}
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
    <div className="bg-white rounded-xl border p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}