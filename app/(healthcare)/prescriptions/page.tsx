"use client";

import { Pill } from "lucide-react";

export default function PrescriptionsPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h1 className="text-2xl font-bold text-gray-800">Prescriptions</h1>
        <p className="text-gray-500 mt-1">View your digital prescriptions</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <Pill className="w-12 h-12 mx-auto text-gray-300 mb-3" />
        <p className="text-gray-500">No prescriptions yet</p>
      </div>
    </div>
  );
}