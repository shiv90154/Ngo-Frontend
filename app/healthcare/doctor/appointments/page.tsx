"use client";

import { useEffect, useState } from "react";
import { healthcareAPI } from "@/lib/api";
import { Loader2, Calendar, Clock, Search, Filter, CheckCircle, XCircle, Video, Phone, MessageCircle } from "lucide-react";
import { toast } from "react-toastify";
import Link from "next/link";

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => { fetchAppointments(); }, [statusFilter]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const status = statusFilter === "all" ? undefined : statusFilter;
      const res = await healthcareAPI.getDoctorAppointments({ status, limit: 50 });
      setAppointments(res.data.appointments || []);
    } catch (error) {
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await healthcareAPI.updateAppointmentStatus(id, { status: newStatus });
      toast.success(`Appointment ${newStatus}`);
      fetchAppointments();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  const filtered = appointments.filter((apt: any) =>
    apt.patientId?.fullName?.toLowerCase().includes(search.toLowerCase())
  );

  const getConsultationIcon = (type: string) => {
    if (type === "video") return <Video size={16} />;
    if (type === "audio") return <Phone size={16} />;
    return <MessageCircle size={16} />;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">My Appointments</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search patient..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg text-sm"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="animate-spin text-[#1a237e]" /></div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center shadow-sm border">
          <Calendar className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No appointments found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left">Patient</th>
                <th className="px-4 py-3 text-left">Date & Time</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((apt: any) => (
                <tr key={apt._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium">{apt.patientId?.fullName}</p>
                    <p className="text-xs text-gray-500">{apt.patientId?.phone}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p>{new Date(apt.appointmentDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</p>
                    <p className="text-xs text-gray-500">{apt.timeSlot?.start} - {apt.timeSlot?.end}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 text-gray-600">
                      {getConsultationIcon(apt.consultationType)}
                      {apt.consultationType}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      apt.status === "confirmed" ? "bg-green-100 text-green-700" :
                      apt.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                      apt.status === "cancelled" ? "bg-red-100 text-red-700" :
                      "bg-blue-100 text-blue-700"
                    }`}>{apt.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      {apt.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleStatusChange(apt._id, "confirmed")}
                            className="p-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200"
                            title="Confirm"
                          >
                            <CheckCircle size={16} />
                          </button>
                          <button
                            onClick={() => handleStatusChange(apt._id, "cancelled")}
                            className="p-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200"
                            title="Cancel"
                          >
                            <XCircle size={16} />
                          </button>
                        </>
                      )}
                      {apt.status === "confirmed" && (
                        <button
                          onClick={() => handleStatusChange(apt._id, "completed")}
                          className="p-1.5 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                          title="Mark Completed"
                        >
                          <CheckCircle size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}