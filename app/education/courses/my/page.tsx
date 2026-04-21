"use client";

import { useEffect, useState } from "react";
import { educationAPI } from "@/lib/api";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function MyCoursesPage() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        // 假设后端提供了获取我的注册的接口，如果没有则需要遍历课程
        const res = await educationAPI.getPublishedCourses(); // 临时方案
        const allCourses = res.data.courses;
        const myEnrollments = [];
        for (const course of allCourses) {
          const detail = await educationAPI.getCourseDetails(course._id);
          if (detail.data.isEnrolled) myEnrollments.push(detail.data);
        }
        setEnrollments(myEnrollments);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, []);

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Learning</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {enrollments.map((item: any) => (
          <Link key={item.course._id} href={`/education/courses/${item.course._id}`} className="bg-white rounded-xl shadow-sm border p-4 hover:shadow-md">
            <h3 className="font-semibold">{item.course.title}</h3>
            <div className="mt-2 h-2 bg-gray-200 rounded-full">
              <div className="h-2 bg-[#1a237e] rounded-full" style={{ width: `${item.enrollment?.progress || 0}%` }} />
            </div>
            <p className="text-sm text-gray-500 mt-2">Progress: {Math.round(item.enrollment?.progress || 0)}%</p>
          </Link>
        ))}
      </div>
    </div>
  );
}