"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import {
  Calendar,
  FileText,
  Pill,
  Search,
  Stethoscope,
  Video,
  Phone,
  MessageCircle,
  ChevronRight,
  Plus,
  Heart,
  Activity,
  Clock,
} from "lucide-react";
import { healthcareAPI } from "@/lib/api";

export default function HealthcareDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    upcomingAppointments: 0,
    prescriptions: 0,
    healthRecords: 0,
  });
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [recentPrescriptions, setRecentPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [appointmentsRes, prescriptionsRes, recordsRes] = await Promise.allSettled([
        healthcareAPI.getPatientAppointments({ status: "confirmed", limit: 5 }),
        healthcareAPI.getPatientPrescriptions({ limit: 5 }),
        healthcareAPI.getPatientHealthRecords({ limit: 1 }),
      ]);

      if (appointmentsRes.status === "fulfilled") {
        setUpcomingAppointments(appointmentsRes.value.data.appointments || []);
        setStats(prev => ({ ...prev, upcomingAppointments: appointmentsRes.value.data.total || 0 }));
      }
      if (prescriptionsRes.status === "fulfilled") {
        setRecentPrescriptions(prescriptionsRes.value.data.prescriptions || []);
        setStats(prev => ({ ...prev, prescriptions: prescriptionsRes.value.data.total || 0 }));
      }
      if (recordsRes.status === "fulfilled") {
        setStats(prev => ({ ...prev, healthRecords: recordsRes.value.data.total || 0 }));
      }
    } catch (error) {
      console.error("Failed to load dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: "Upcoming Appointments", value: stats.upcomingAppointments, icon: Calendar, color: "bg-blue-100 text-blue-700", link: "/healthcare/appointments" },
    { label: "Prescriptions", value: stats.prescriptions, icon: Pill, color: "bg-purple-100 text-purple-700", link: "/healthcare/prescriptions" },
    { label: "Health Records", value: stats.healthRecords, icon: FileText, color: "bg-green-100 text-green-700", link: "/healthcare/records" },
  ];

  const quickActions = [
    { label: "Find Doctor", icon: Search, href: "/healthcare/doctors", color: "from-blue-600 to-blue-700" },
    { label: "Book Appointment", icon: Calendar, href: "/healthcare/doctors", color: "from-green-600 to-green-700" },
    { label: "Upload Record", icon: FileText, href: "/healthcare/records", color: "from-purple-600 to-purple-700" },
    { label: "Emergency", icon: Heart, href: "#", color: "from-red-600 to-red-700", emergency: true },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1a237e]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#1a237e] to-[#283593] rounded-xl shadow-md p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center">
            <Stethoscope size={28} className="text-[#FF9933]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Healthcare Dashboard</h1>
            <p className="text-blue-100 text-sm mt-1">
              Welcome back, {user?.fullName?.split(" ")[0] || "Patient"}! Manage your health with ease.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {quickActions.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className={`bg-gradient-to-r ${action.color} text-white rounded-xl p-4 shadow-sm hover:shadow-md transition flex flex-col items-center text-center gap-2`}
          >
            <action.icon size={24} />
            <span className="text-sm font-medium">{action.label}</span>
            {action.emergency && <span className="text-xs animate-pulse">24/7</span>}
          </Link>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statCards.map((stat) => (
          <Link
            key={stat.label}
            href={stat.link}
            className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                <stat.icon size={22} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-[#1a237e]">
              View details <ChevronRight size={16} className="ml-1" />
            </div>
          </Link>
        ))}
      </div>

      {/* Upcoming Appointments */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Upcoming Appointments</h2>
          <Link href="/healthcare/appointments" className="text-sm text-[#1a237e] hover:underline">
            See all
          </Link>
        </div>
        {upcomingAppointments.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <Calendar className="w-10 h-10 mx-auto text-gray-300 mb-2" />
            <p>No upcoming appointments</p>
            <Link href="/healthcare/doctors" className="text-[#1a237e] text-sm mt-2 inline-block">
              Book an appointment →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingAppointments.slice(0, 3).map((apt: any) => (
              <div key={apt._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700">
                    {apt.consultationType === "video" && <Video size={18} />}
                    {apt.consultationType === "audio" && <Phone size={18} />}
                    {apt.consultationType === "chat" && <MessageCircle size={18} />}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Dr. {apt.doctorId?.fullName}</p>
                    <p className="text-xs text-gray-500">{apt.doctorId?.doctorProfile?.specialization}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {new Date(apt.appointmentDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </p>
                  <p className="text-xs text-gray-500">{apt.timeSlot.start}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Prescriptions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Recent Prescriptions</h2>
          <Link href="/healthcare/prescriptions" className="text-sm text-[#1a237e] hover:underline">
            See all
          </Link>
        </div>
        {recentPrescriptions.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <Pill className="w-10 h-10 mx-auto text-gray-300 mb-2" />
            <p>No prescriptions yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentPrescriptions.map((pres: any) => (
              <Link
                key={pres._id}
                href={`/healthcare/prescriptions/${pres._id}`}
                className="block p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition"
              >
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium text-gray-800">Dr. {pres.doctorId?.fullName}</p>
                    <p className="text-sm text-gray-600">{pres.diagnosis}</p>
                  </div>
                  <p className="text-xs text-gray-400">
                    {new Date(pres.prescriptionDate).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}