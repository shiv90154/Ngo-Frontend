"use client";

import { useEffect, useState } from "react";
import { educationAPI } from "@/lib/api";
import { Loader2, BookOpen, Users, IndianRupee } from "lucide-react";
import Link from "next/link";

export default function InstructorDashboard() {
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    educationAPI.getInstructorDashboard()
      .then(res => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-[#1a237e]" /></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Instructor Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border">
          <BookOpen className="text-[#1a237e] mb-2" />
          <p className="text-3xl font-bold">{stats.totalCourses || 0}</p>
          <p className="text-gray-500">Total Courses</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border">
          <Users className="text-[#1a237e] mb-2" />
          <p className="text-3xl font-bold">{stats.totalStudents || 0}</p>
          <p className="text-gray-500">Total Students</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border">
          <IndianRupee className="text-[#1a237e] mb-2" />
          <p className="text-3xl font-bold">₹{stats.totalRevenue || 0}</p>
          <p className="text-gray-500">Revenue</p>
        </div>
      </div>
      <div className="flex gap-3">
        <Link href="/education/instructor/courses/new" className="bg-[#1a237e] text-white px-4 py-2 rounded-lg">Create Course</Link>
        <Link href="/education/instructor/courses" className="border border-[#1a237e] text-[#1a237e] px-4 py-2 rounded-lg">My Courses</Link>
      </div>
    </div>
  );
}