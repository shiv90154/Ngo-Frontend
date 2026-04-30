import Link from "next/link";
import { Users, IndianRupee } from "lucide-react";

export default function CourseCard({ course }: any) {
  return (
    <Link
      href={`/education/courses/${course._id}`}
      className="bg-white rounded-xl shadow-sm border hover:shadow-md transition overflow-hidden"
    >
      <div className="h-40 bg-gradient-to-br from-[#1a237e] to-[#283593] relative">
        {course.thumbnail ? (
          <img src={course.thumbnail} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white text-4xl font-serif">अ</div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 line-clamp-2">{course.title}</h3>
        <p className="text-sm text-gray-500 mt-1">{course.instructor?.fullName}</p>
        <div className="flex items-center justify-between mt-3">
          <span className="flex items-center gap-1 text-sm text-gray-600">
            <Users size={14} /> {course.totalEnrolled || 0}
          </span>
          <span className="font-bold text-[#1a237e] flex items-center">
            <IndianRupee size={14} /> {course.price === 0 ? "Free" : course.price}
          </span>
        </div>
      </div>
    </Link>
  );
}