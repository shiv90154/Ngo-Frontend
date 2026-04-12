"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/config/api";

export default function CertificateView() {
  const { certId } = useParams();
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/education/certificates/${certId}`) // you need this endpoint
      .then((res) => setCert(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [certId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  if (!cert) {
    return <div className="text-center py-10">Certificate not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Certificate of Completion</h1>
        <p className="text-gray-600">This certifies that</p>
        <p className="text-xl font-bold mt-2">{cert.user?.fullName}</p>
        <p className="text-gray-600 mt-2">has successfully completed the course</p>
        <p className="text-xl font-bold text-blue-700 mt-1">{cert.course?.title}</p>
        <p className="text-gray-500 mt-4">Certificate ID: {cert.certificateId}</p>
        <p className="text-gray-500">Issued on: {new Date(cert.issueDate).toLocaleDateString()}</p>
        <button
          onClick={() => window.print()}
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Download / Print
        </button>
      </div>
    </div>
  );
}