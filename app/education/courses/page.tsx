"use client";

import { useEffect, useState } from "react";
import { educationAPI } from "@/lib/api";
import CourseCard from "@/components/education/CourseCard";
import { Search, Filter, Loader2 } from "lucide-react";

const categories = ["All", "UPSC", "Banking", "Agriculture", "School", "Skill", "Technology"];

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const res = await educationAPI.getPublishedCourses({
          search: search || undefined,
          category: category === "All" ? undefined : category,
        });
        setCourses(res.data.courses);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    const timer = setTimeout(fetchCourses, 300);
    return () => clearTimeout(timer);
  }, [search, category]);

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#1a237e] to-[#283593] rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold">Learn without limits</h1>
        <p className="mt-2 text-blue-100">Start, switch, or advance your career with thousands of courses</p>
        <div className="mt-6 relative max-w-md">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="What do you want to learn?"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-800"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-1 px-4 py-2 border rounded-full text-sm">
          <Filter size={14} /> Filters
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${category === cat ? "bg-[#1a237e] text-white" : "bg-white border"}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="animate-spin text-[#1a237e]" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {courses.map((course: any) => <CourseCard key={course._id} course={course} />)}
        </div>
      )}
    </div>
  );
}