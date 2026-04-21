"use client";

import { Calendar, Filter } from "lucide-react";

export default function AppointmentsPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">My Appointments</h1>
            <p className="text-gray-500 mt-1">View and manage your appointments</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <Calendar className="w-12 h-12 mx-auto text-gray-300 mb-3" />
        <p className="text-gray-500">No appointments found</p>
        <button className="mt-4 px-4 py-2 bg-[#1a237e] text-white rounded-lg text-sm">Book Appointment</button>
      </div>
    </div>
  );
}