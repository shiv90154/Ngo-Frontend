"use client";

import { useEffect, useState } from "react";
import { educationAPI } from "@/lib/api";
import { Users, BookOpen, IndianRupee } from "lucide-react";
import Link from "next/link";
import InstructorGuard from "@/components/education/InstructorGuard";

function DashboardContent() {
  const [stats, setStats] = useState<any>({});
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await educationAPI.getInstructorDashboard();
      setStats({ totalCourses: res.data.totalCourses, totalStudents: res.data.totalStudents, totalRevenue: res.data.totalRevenue });
      setRecent(res.data.recentEnrollments);
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Instructor Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border"><BookOpen className="text-[#1a237e]" /><p className="text-3xl font-bold">{stats.totalCourses}</p><p>Courses</p></div>
        <div className="bg-white p-5 rounded-xl shadow-sm border"><Users className="text-[#1a237e]" /><p className="text-3xl font-bold">{stats.totalStudents}</p><p>Students</p></div>
        <div className="bg-white p-5 rounded-xl shadow-sm border"><IndianRupee className="text-[#1a237e]" /><p className="text-3xl font-bold">₹{stats.totalRevenue}</p><p>Revenue</p></div>
      </div>
      <div className="bg-white p-5 rounded-xl shadow-sm border">
        <h2 className="font-semibold mb-3">Recent Enrollments</h2>
        {recent.map((e: any) => (
          <div key={e._id} className="flex justify-between py-2 border-b">
            <span>{e.student?.fullName}</span>
            <span>{e.course?.title}</span>
            <span>{new Date(e.enrolledAt).toLocaleDateString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function InstructorDashboard() {
  return <InstructorGuard><DashboardContent /></InstructorGuard>;
}