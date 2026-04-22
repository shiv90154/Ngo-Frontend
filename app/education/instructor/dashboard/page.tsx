"use client";

import { useEffect, useState } from "react";
import { educationAPI } from "@/lib/api";
import { BookOpen, Users, IndianRupee, Video } from "lucide-react";
import Link from "next/link";
import InstructorGuard from "@/components/education/InstructorGuard";

function DashboardContent() {
  const [stats, setStats] = useState<any>({});
  useEffect(() => {
    educationAPI.getInstructorDashboard().then(res => setStats(res.data));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Instructor Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard icon={BookOpen} label="Total Courses" value={stats.totalCourses} />
        <StatCard icon={Users} label="Total Students" value={stats.totalStudents} />
        <StatCard icon={IndianRupee} label="Revenue" value={`₹${stats.totalRevenue || 0}`} />
      </div>
      <div className="flex gap-4">
        <Link href="/education/instructor/courses/new" className="bg-[#1a237e] text-white px-5 py-2 rounded-lg">Create Course</Link>
        <Link href="/education/live" className="border px-5 py-2 rounded-lg">Manage Live Classes</Link>
      </div>
    </div>
  );
}

export default function InstructorDashboard() {
  return <InstructorGuard><DashboardContent /></InstructorGuard>;
}

function StatCard({ icon: Icon, label, value }: any) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border">
      <Icon className="text-[#1a237e] mb-2" />
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-gray-500">{label}</p>
    </div>
  );
}