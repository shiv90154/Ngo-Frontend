// app/(education)/certificates/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { educationAPI } from "@/lib/api";
import { Award, Download, ExternalLink, Loader2, ShieldCheck } from "lucide-react";

export default function CertificatesPage() {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchCertificates = async () => {
      try {
        // 获取所有已注册的课程，筛选出已颁发证书的
        const coursesRes = await educationAPI.getPublishedCourses({ limit: 50 });
        const courses = coursesRes.data.courses;
        const certList = [];

        for (const course of courses) {
          try {
            const detail = await educationAPI.getCourseDetails(course._id);
            if (detail.data.isEnrolled && detail.data.enrollment?.certificateIssued) {
              // 如果需要单独的证书数据，可从 enrollment 中提取或调用专门的证书接口
              certList.push({
                course: detail.data.course,
                enrollment: detail.data.enrollment,
                // 假设后端在 enrollment 中存储了 certificateUrl
                certificateUrl: detail.data.enrollment?.certificateUrl || `/certificates/${detail.data.enrollment._id}`,
                issuedAt: detail.data.enrollment?.completedAt || new Date(),
              });
            }
          } catch (e) {
            console.error(`Failed to check certificate for course ${course._id}`, e);
          }
        }
        setCertificates(certList);
      } catch (error) {
        console.error("Failed to load certificates", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCertificates();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-8 w-8 text-[#1a237e]" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Award className="text-[#1a237e]" />
          My Certificates
        </h1>
        <p className="text-gray-500 mt-1">
          Certificates awarded upon successful course completion
        </p>
      </div>

      {certificates.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border">
          <ShieldCheck className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            No certificates yet
          </h2>
          <p className="text-gray-500 mb-6">
            Complete a course to earn your certificate of completion.
          </p>
          <Link
            href="/education/courses"
            className="inline-flex items-center gap-2 bg-[#1a237e] text-white px-6 py-2 rounded-lg hover:bg-[#0d1757] transition"
          >
            <Award size={18} /> Browse Courses
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {certificates.map(({ course, certificateUrl, issuedAt }) => (
            <div
              key={course._id}
              className="bg-white rounded-xl p-5 shadow-sm border flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#1a237e] to-[#283593] rounded-full flex items-center justify-center text-white text-lg font-serif">
                  अ
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{course.title}</h3>
                  <p className="text-sm text-gray-500">
                    Issued on {new Date(issuedAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Certificate ID: CERT-{course._id.slice(-8).toUpperCase()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:ml-auto">
                <a
                  href={certificateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition"
                >
                  <ExternalLink size={16} /> View
                </a>
                <a
                  href={certificateUrl}
                  download
                  className="flex items-center gap-1 px-4 py-2 bg-[#1a237e] hover:bg-[#0d1757] text-white rounded-lg text-sm font-medium transition"
                >
                  <Download size={16} /> Download
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="pt-4">
        <Link
          href="/education/my-courses"
          className="text-[#1a237e] hover:underline inline-flex items-center gap-1"
        >
          ← Back to My Learning
        </Link>
      </div>
    </div>
  );
}