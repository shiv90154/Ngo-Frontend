import Link from "next/link";
import { Users, Star } from "lucide-react";

export default function CourseCard({ course }: any) {
  return (
    <Link href={`/education/courses/${course._id}`} className="bg-white rounded-xl shadow-sm border hover:shadow-md transition overflow-hidden group">
      <div className="aspect-video bg-gradient-to-br from-[#1a237e] to-[#283593] relative">
        {course.thumbnail ? (
          <img src={course.thumbnail} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white text-4xl font-serif">अ</div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 line-clamp-2 group-hover:text-[#1a237e]">{course.title}</h3>
        <p className="text-sm text-gray-500 mt-1">{course.instructor?.fullName}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-sm font-bold text-[#1a237e]">{course.price === 0 ? "Free" : `₹${course.price}`}</span>
          <span className="text-xs text-gray-400 flex items-center gap-1"><Users size={12} /> {course.totalEnrolled}</span>
        </div>
        <div className="flex items-center gap-1 mt-1">
          <Star size={14} className="fill-yellow-400 text-yellow-400" />
          <span className="text-xs text-gray-600">4.8 (120)</span>
        </div>
      </div>
    </Link>
  );
}