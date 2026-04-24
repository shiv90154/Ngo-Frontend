"use client";

import { useState } from "react";
import { adminAPI } from "@/lib/api";
import { Loader2, Activity, BookOpen, Wallet, Monitor, ExternalLink } from "lucide-react";
import Link from "next/link";

const MODULES = [
  { key: "healthcare", label: "Healthcare", icon: Activity, color: "bg-red-100 text-red-700" },
  { key: "education", label: "Education", icon: BookOpen, color: "bg-purple-100 text-purple-700" },
  { key: "finance", label: "Finance", icon: Wallet, color: "bg-blue-100 text-blue-700" },
  { key: "it", label: "IT Services", icon: Monitor, color: "bg-teal-100 text-teal-700" },
];

export default function ModulesPage() {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchModuleData = async (module: string) => {
    setSelectedModule(module);
    setLoading(true);
    try {
      const res = await adminAPI.getModuleData(module);
      setData(res.data.data);
    } catch (error) {
      console.error("Failed to fetch module data", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Module Oversight</h1>

      {/* Module Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {MODULES.map((mod) => {
          const Icon = mod.icon;
          return (
            <button
              key={mod.key}
              onClick={() => fetchModuleData(mod.key)}
              className={`bg-white p-5 rounded-xl shadow-sm border hover:shadow-md transition text-left ${
                selectedModule === mod.key ? "ring-2 ring-[#1a237e]" : ""
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${mod.color}`}>
                  <Icon size={20} />
                </div>
                <h3 className="font-semibold">{mod.label}</h3>
              </div>
              <p className="text-sm text-gray-500">Click to view details</p>
            </button>
          );
        })}
      </div>

      {/* Module Details */}
      {selectedModule && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold capitalise">{selectedModule} Overview</h2>
            <Link href={`/${selectedModule}`} className="text-[#1a237e] text-sm flex items-center gap-1">
              Go to module <ExternalLink size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="animate-spin h-6 w-6 text-[#1a237e]" />
            </div>
          ) : data ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(data)
                .filter(([key]) => key !== "recentAppointments" && key !== "recentCourses" && key !== "recentTransactions")
                .map(([key, value]) => (
                  <div key={key} className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 capitalize">{key.replace(/([A-Z])/g, " $1")}</p>
                    <p className="text-2xl font-bold text-gray-800">{value as number}</p>
                  </div>
                ))}
              {data.recentAppointments && (
                <div className="md:col-span-3 mt-4">
                  <h3 className="font-medium mb-2">Recent Appointments</h3>
                  <div className="space-y-2">
                    {data.recentAppointments.map((apt: any) => (
                      <div key={apt._id} className="flex justify-between text-sm bg-gray-50 p-2 rounded">
                        <span>{apt.patientId?.fullName} with Dr. {apt.doctorId?.fullName}</span>
                        <span className="text-gray-500">{new Date(apt.createdAt).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {data.recentCourses && (
                <div className="md:col-span-3 mt-4">
                  <h3 className="font-medium mb-2">Recent Courses</h3>
                  <div className="space-y-2">
                    {data.recentCourses.map((course: any) => (
                      <div key={course._id} className="flex justify-between text-sm bg-gray-50 p-2 rounded">
                        <span>{course.title} by {course.instructor?.fullName}</span>
                        <span className="text-gray-500">{new Date(course.createdAt).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {data.recentTransactions && (
                <div className="md:col-span-3 mt-4">
                  <h3 className="font-medium mb-2">Recent Transactions</h3>
                  <div className="space-y-2">
                    {data.recentTransactions.map((txn: any) => (
                      <div key={txn._id} className="flex justify-between text-sm bg-gray-50 p-2 rounded">
                        <span>{txn.description}</span>
                        <span className="text-gray-500">{new Date(txn.createdAt).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}