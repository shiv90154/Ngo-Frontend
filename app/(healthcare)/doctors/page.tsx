"use client";

import { Search, MapPin, Stethoscope, Star } from "lucide-react";

export default function DoctorsPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h1 className="text-2xl font-bold text-gray-800">Find Doctors</h1>
        <p className="text-gray-500 mt-1">Search and book appointments with BAMS specialists</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by doctor name or specialization..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a237e]"
          />
        </div>
      </div>
      <div className="text-center py-8 text-gray-500">
        <Stethoscope className="w-12 h-12 mx-auto text-gray-300 mb-3" />
        <p>Enter a search term to find doctors</p>
      </div>
    </div>
  );
}