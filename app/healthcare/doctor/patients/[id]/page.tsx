"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { healthcareAPI } from "@/lib/api";
import api from "@/config/api"; // direct Axios instance
import { Calendar, FileText, Activity, Loader2 } from "lucide-react";
import PrescriptionModal from "@/components/healthcare/PrescriptionModal";

export default function PatientDetailPage() {
  const { id } = useParams();
  const [patient, setPatient] = useState<any>(null);
  const [records, setRecords] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recordsRes, presRes, aptRes] = await Promise.all([
          healthcareAPI.getPatientHealthRecords(id as string),
          healthcareAPI.getPatientPrescriptions(id as string),
          // Use direct API call to get appointments for this patient
          api.get("/appointments", { params: { patientId: id } }),
        ]);
        setRecords(recordsRes.data.records);
        setPrescriptions(presRes.data.prescriptions);
        setAppointments(aptRes?.data?.appointments || []);
        // Extract patient info from the first appointment if available
        if (aptRes?.data?.appointments?.[0]?.patientId) {
          setPatient(aptRes.data.appointments[0].patientId);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin" />
      </div>
    );
  if (!patient) return <div>Patient not found</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-[#1a237e] rounded-full text-white flex items-center justify-center text-2xl">
            {patient.fullName?.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{patient.fullName}</h1>
            <p className="text-gray-500">
              {patient.email} • {patient.phone}
            </p>
          </div>
          <button
            onClick={() => setShowPrescriptionModal(true)}
            className="ml-auto bg-[#1a237e] text-white px-4 py-2 rounded-lg"
          >
            Write Prescription
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <h2 className="font-semibold flex items-center gap-2 mb-3">
            <FileText size={18} /> Health Records
          </h2>
          {records.length === 0 ? (
            <p className="text-gray-500">No records</p>
          ) : (
            records.map((r: any) => (
              <div key={r._id} className="border-b py-2">
                <p className="font-medium">{r.title}</p>
                <p className="text-sm text-gray-500">{r.recordType}</p>
              </div>
            ))
          )}
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <h2 className="font-semibold flex items-center gap-2 mb-3">
            <Activity size={18} /> Past Appointments
          </h2>
          {appointments.length === 0 ? (
            <p className="text-gray-500">No appointments</p>
          ) : (
            appointments.map((a: any) => (
              <div key={a._id} className="border-b py-2">
                <p>{new Date(a.appointmentDate).toLocaleDateString()}</p>
                <p className="text-sm text-gray-500">{a.status}</p>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-5">
        <h2 className="font-semibold mb-3">Prescriptions</h2>
        {prescriptions.length === 0 ? (
          <p className="text-gray-500">No prescriptions</p>
        ) : (
          prescriptions.map((p: any) => (
            <div key={p._id} className="border-b py-2">
              <p className="font-medium">{p.diagnosis}</p>
              <p className="text-sm text-gray-500">
                {new Date(p.prescriptionDate).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>

      <PrescriptionModal
        isOpen={showPrescriptionModal}
        onClose={() => setShowPrescriptionModal(false)}
        patientId={id as string}
      />
    </div>
  );
}