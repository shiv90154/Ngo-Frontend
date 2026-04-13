"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/config/api";

export default function CourseDetail() {
  const { courseId } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    api
      .get(`/education/courses/${courseId}`)
      .then((res) => setCourse(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));

    // Check if user is enrolled
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      api
        .get("/education/my-courses")
        .then((res) => {
          const enrolled = res.data.some((e) => e.course?._id === courseId);
          setIsEnrolled(enrolled);
        })
        .catch(console.error);
    }
  }, [courseId]);

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      await api.post(`/education/enroll/${courseId}`);
      setIsEnrolled(true);
      alert("Successfully enrolled!");
    } catch (err) {
      alert(err.response?.data?.message || "Enrollment failed");
    } finally {
      setEnrolling(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );

  if (!course) return <div className="text-center py-10">Course not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        {course.thumbnail && <img src={course.thumbnail} alt={course.title} className="w-full h-64 object-cover" />}
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-800">{course.title}</h1>
          <p className="text-gray-600 mt-2">{course.description}</p>

          <div className="grid grid-cols-2 gap-4 mt-6 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-gray-500 text-sm">Duration</p>
              <p className="font-medium">{course.duration}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Level</p>
              <p className="font-medium capitalize">{course.level}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Price</p>
              <p className="font-bold text-xl text-blue-600">₹{course.price}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Enrolled</p>
              <p className="font-medium">{course.enrolledCount} students</p>
            </div>
          </div>

          {/* Syllabus */}
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-3">Syllabus</h2>
            <div className="space-y-3">
              {course.syllabus?.map((item, idx) => (
                <div key={idx} className="border-b pb-2">
                  <p className="font-medium">{idx + 1}. {item.title}</p>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Enroll button */}
          <div className="mt-8">
            {isEnrolled ? (
              <button
                onClick={() => router.push(`/education/dashboard/student`)}
                className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Go to My Courses
              </button>
            ) : (
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {enrolling ? "Enrolling..." : `Enroll Now - ₹${course.price}`}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}