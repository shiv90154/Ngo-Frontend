"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { healthcareAPI } from "@/lib/api";
import { FileText, Activity, Loader2, User, Pill } from "lucide-react";
import PrescriptionModal from "@/components/healthcare/PrescriptionModal";

export default function PatientDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [patient, setPatient] = useState<any>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const [recordsRes, presRes, patientsRes, appointmentsRes] =
          await Promise.all([
            healthcareAPI.getPatientHealthRecords(id),
            healthcareAPI.getPatientPrescriptions(id),
            healthcareAPI.getDoctorPatients({ search: "", limit: 100 }),
            healthcareAPI.getDoctorAppointments({ limit: 200 }),
          ]);

        const allPatients = patientsRes.data.patients || [];

        const currentPatient = allPatients.find((p: any) => p._id === id);

        const allAppointments = appointmentsRes.data.appointments || [];

        const patientAppointments = allAppointments.filter((a: any) => {
          const appointmentPatientId =
            typeof a.patientId === "string"
              ? a.patientId
              : a.patientId?._id;

          return appointmentPatientId === id;
        });

        setPatient(currentPatient || null);
        setRecords(recordsRes.data.records || []);
        setPrescriptions(presRes.data.prescriptions || []);
        setAppointments(patientAppointments);
      } catch (error) {
        console.error("Failed to fetch patient details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#1a237e]" />
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <User className="w-10 h-10 mx-auto text-gray-300 mb-3" />
        <p className="text-gray-500">Patient not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="w-16 h-16 bg-[#1a237e] rounded-full text-white flex items-center justify-center text-2xl font-semibold uppercase">
            {patient.fullName?.charAt(0) || "P"}
          </div>

          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-gray-800">
              {patient.fullName || "Unknown Patient"}
            </h1>

            <p className="text-gray-500 text-sm break-words">
              {patient.email || "No email"}{" "}
              {patient.phone ? `• ${patient.phone}` : ""}
            </p>
          </div>

          <button
            onClick={() => setShowPrescriptionModal(true)}
            className="sm:ml-auto bg-[#1a237e] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#111a5c] transition"
          >
            Write Prescription
          </button>
        </div>
      </div>

      <div className=" flex flex-col gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2 mb-3">
            <FileText size={18} /> Health Records
          </h2>

          {records.length === 0 ? (
            <p className="text-gray-500 text-sm">No records</p>
          ) : (
            <div className="space-y-3">
              {records.map((r: any) => (
                <div key={r._id} className="border-b border-gray-100 pb-3">
                  <p className="font-medium text-gray-800">{r.title}</p>
                  <p className="text-sm text-gray-500 capitalize">
                    {r.recordType?.replace("_", " ")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2 mb-3">
            <Activity size={18} /> Past Appointments
          </h2>

          {appointments.length === 0 ? (
            <p className="text-gray-500 text-sm">No appointments</p>
          ) : (
            <div className="space-y-3">
              {appointments.map((a: any) => (
                <div key={a._id} className="border-b border-gray-100 pb-3">
                  <p className="text-gray-800 font-medium">
                    {a.appointmentDate
                      ? new Date(a.appointmentDate).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "No date"}
                  </p>

                  <p className="text-sm text-gray-500">
                    {a.timeSlot?.start || "No time"}
                    {a.timeSlot?.end ? ` - ${a.timeSlot.end}` : ""}
                  </p>

                  <p className="text-sm text-gray-500 capitalize">
                    {a.status || "No status"}
                  </p>

                  {a.consultationType && (
                    <p className="text-sm text-gray-500 capitalize">
                      {a.consultationType}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-800 flex items-center gap-2 mb-3">
          <Pill size={18} /> Prescriptions
        </h2>

        {prescriptions.length === 0 ? (
          <p className="text-gray-500 text-sm">No prescriptions</p>
        ) : (
          <div className="space-y-3">
            {prescriptions.map((p: any) => (
              <div key={p._id} className="border-b border-gray-100 pb-3">
                <p className="font-medium text-gray-800">
                  {p.diagnosis || "No diagnosis"}
                </p>

                <p className="text-sm text-gray-500">
                  {p.prescriptionDate
                    ? new Date(p.prescriptionDate).toLocaleDateString("en-IN")
                    : "No date"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <PrescriptionModal
        isOpen={showPrescriptionModal}
        onClose={() => setShowPrescriptionModal(false)}
        patientId={id}
      />
    </div>
  );
}