"use client";

import { FileText, Upload } from "lucide-react";

export default function HealthRecordsPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Health Records</h1>
            <p className="text-gray-500 mt-1">Manage your medical history and documents</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1a237e] text-white rounded-lg text-sm">
            <Upload className="w-4 h-4" /> Upload Record
          </button>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <FileText className="w-12 h-12 mx-auto text-gray-300 mb-3" />
        <p className="text-gray-500">No health records yet</p>
      </div>
    </div>
  );
}