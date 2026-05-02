"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { healthcareAPI } from "@/lib/api";
import { Calendar, FileText, Pill, Loader2, Stethoscope } from "lucide-react";
import Link from "next/link";

type Appointment = {
  _id: string;
  appointmentDate: string;
  timeSlot?: {
    start?: string;
    end?: string;
  };
  status: string;
  doctorId?: {
    fullName?: string;
  };
};

export default function HealthcareDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    appointments: 0,
    prescriptions: 0,
    records: 0,
  });

  const [recentAppointments, setRecentAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role === "DOCTOR") {
      router.replace("/healthcare/doctor/dashboard");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        const [aptRes, presRes, recRes] = await Promise.all([
          healthcareAPI.getPatientAppointments({
            page: 1,
            limit: 5,
          }),
          healthcareAPI.getPatientPrescriptions(),
          healthcareAPI.getPatientHealthRecords(),
        ]);

        const appointments = aptRes.data?.appointments || [];

        const uniqueAppointments = Array.from(
          new Map(
            appointments.map((apt: Appointment) => [apt._id, apt])
          ).values()
        ) as Appointment[];

        setRecentAppointments(uniqueAppointments);

        setStats({
          appointments: aptRes.data?.total || uniqueAppointments.length || 0,
          prescriptions:
            presRes.data?.prescriptions?.length || presRes.data?.length || 0,
          records:
            recRes.data?.records?.length || recRes.data?.length || 0,
        });
      } catch (error) {
        console.error("Failed to load dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin h-8 w-8 text-[#1a237e]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#1a237e] to-[#283593] rounded-xl p-6 text-white">
        <div className="flex items-center gap-4">
          <Stethoscope className="w-10 h-10" />
          <div>
            <h1 className="text-2xl font-bold">
              Welcome, {user?.fullName?.split(" ")[0]}
            </h1>
            <p className="text-blue-100 text-sm mt-1">
              Manage your health records and appointments
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={Calendar}
          label="Total Appointments"
          value={stats.appointments}
          href="/healthcare/appointments"
        />
        <StatCard
          icon={Pill}
          label="Prescriptions"
          value={stats.prescriptions}
          href="/healthcare/prescriptions"
        />
        <StatCard
          icon={FileText}
          label="Health Records"
          value={stats.records}
          href="/healthcare/records"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-5">
        <h2 className="text-lg font-semibold mb-4">Recent Appointments</h2>

        {recentAppointments.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No appointments found
          </p>
        ) : (
          <div className="divide-y">
            {recentAppointments.map((apt) => (
              <div
                key={apt._id}
                className="py-3 flex items-center justify-between gap-4"
              >
                <div>
                  <p className="font-medium">
                    Dr. {apt.doctorId?.fullName || "Unknown Doctor"}
                  </p>

                  <p className="text-sm text-gray-500">
                    {new Date(apt.appointmentDate).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}

                    {apt.timeSlot?.start && apt.timeSlot?.end
                      ? `, ${apt.timeSlot.start} - ${apt.timeSlot.end}`
                      : ""}
                  </p>
                </div>

                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    apt.status?.toUpperCase() === "CONFIRMED"
                      ? "bg-blue-100 text-blue-800"
                      : apt.status?.toUpperCase() === "COMPLETED"
                      ? "bg-green-100 text-green-800"
                      : apt.status?.toUpperCase() === "CANCELLED"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {apt.status
                    ? apt.status.charAt(0).toUpperCase() +
                      apt.status.slice(1).toLowerCase()
                    : "Pending"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, href }: any) {
  return (
    <Link
      href={href}
      className="bg-white rounded-xl p-5 shadow-sm border hover:shadow-md transition"
    >
      <Icon className="text-[#1a237e] mb-2" />
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-gray-500">{label}</p>
    </Link>
  );
}