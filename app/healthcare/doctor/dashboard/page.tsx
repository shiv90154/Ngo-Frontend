"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/config/api"; // <-- import the base Axios instance
import { Users, Calendar, Clock, Activity, Loader2, Stethoscope } from "lucide-react";
import Link from "next/link";

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    pendingAppointments: 0,
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        // Use the direct API call – no missing method
        const res = await api.get("/doctor/dashboard");
        if (res?.data) {
          setStats(res.data.stats);
          setRecentAppointments(res.data.recentAppointments);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin text-[#1a237e]" />
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#1a237e] to-[#283593] rounded-xl p-6 text-white">
        <div className="flex items-center gap-4">
          <Stethoscope className="w-10 h-10" />
          <div>
            <h1 className="text-2xl font-bold">Welcome, Dr. {user?.fullName}</h1>
            <p className="text-blue-100 text-sm mt-1">Manage your practice and patient care</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={Users} label="Total Patients" value={stats.totalPatients} />
        <StatCard icon={Calendar} label="Today's Appointments" value={stats.todayAppointments} />
        <StatCard icon={Clock} label="Pending Requests" value={stats.pendingAppointments} />
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Appointments</h2>
          <Link href="/healthcare/doctor/appointments" className="text-[#1a237e] text-sm">
            View all
          </Link>
        </div>
        {recentAppointments.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No recent appointments</p>
        ) : (
          <div className="divide-y">
            {recentAppointments.map((apt: any) => (
              <div key={apt._id} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#1a237e] rounded-full text-white flex items-center justify-center">
                    {apt.patientId?.fullName?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{apt.patientId?.fullName}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(apt.appointmentDate).toLocaleString()}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    apt.status === "confirmed"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {apt.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: any) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border">
      <Icon className="text-[#1a237e] mb-2" />
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-gray-500">{label}</p>
    </div>
  );
}