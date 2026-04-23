"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/config/api"; // ✅ direct API instance
import { Loader2, Calendar, Users, Activity, ClipboardList } from "lucide-react";

export default function DoctorDashboard() {
  const { user } = useAuth();
  const doctorId = user?._id; // adjust if your user id field is different

  const [stats, setStats] = useState({
    totalAppointments: 0,
    totalPatients: 0,
    totalPrescriptions: 0,
    totalRevenue: 0,
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!doctorId) {
      setLoading(false);
      return;
    }
    fetchDashboard();
  }, [doctorId]);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      // ✅ using direct API call instead of missing method
      const res = await api.get("/doctor/dashboard");
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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1a237e] to-[#283593] rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold">Doctor Dashboard</h1>
        <p className="mt-1 text-blue-100">Welcome back, Dr. {user?.fullName}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Appointments"
          value={stats.totalAppointments}
          icon={<Calendar size={20} />}
          color="bg-blue-100 text-blue-700"
        />
        <StatCard
          label="Patients"
          value={stats.totalPatients}
          icon={<Users size={20} />}
          color="bg-green-100 text-green-700"
        />
        <StatCard
          label="Prescriptions"
          value={stats.totalPrescriptions}
          icon={<ClipboardList size={20} />}
          color="bg-purple-100 text-purple-700"
        />
        <StatCard
          label="Revenue"
          value={`₹${stats.totalRevenue.toLocaleString()}`}
          icon={<Activity size={20} />}
          color="bg-orange-100 text-orange-700"
        />
      </div>

      {/* Recent Appointments */}
      <div className="bg-white rounded-xl border shadow-sm p-5">
        <h2 className="text-lg font-semibold mb-4">Recent Appointments</h2>
        {recentAppointments.length === 0 ? (
          <p className="text-gray-500">No recent appointments</p>
        ) : (
          <div className="space-y-3">
            {recentAppointments.map((appt: any) => (
              <div
                key={appt._id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium">{appt.patientId?.fullName || "Patient"}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(appt.appointmentDate).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                    })}{" "}
                    {appt.timeSlot?.start}
                  </p>
                </div>
                <span className="text-xs capitalize px-2 py-1 rounded-full bg-blue-100 text-blue-700">
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
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}