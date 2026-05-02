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

        const [
          recordsRes,
          presRes,
          patientsRes,
          apptRes,
        ] = await Promise.all([
          healthcareAPI.getPatientHealthRecords(id),
          healthcareAPI.getPatientPrescriptions(id),
          healthcareAPI.getDoctorPatients({ limit: 200 }),
          healthcareAPI.getDoctorAppointments({ limit: 200 }),
        ]);

        const allPatients = patientsRes.data.patients || [];
        const allAppointments = apptRes.data.appointments || [];

        let currentPatient = null;

        // 1️⃣ Find from doctor patients list
        currentPatient = allPatients.find(
          (p: any) => String(p._id) === String(id)
        );

        // 2️⃣ Fallback: find from appointments
        if (!currentPatient) {
          const appt = allAppointments.find(
            (a: any) =>
              String(a.patientId?._id || a.patientId) === String(id)
          );

          if (appt?.patientId) {
            currentPatient =
              typeof appt.patientId === "object"
                ? appt.patientId
                : { _id: appt.patientId };
          }
        }

        // 3️⃣ Fallback: derive from prescriptions
        if (!currentPatient && presRes.data.prescriptions?.length) {
          const p = presRes.data.prescriptions[0];
          if (p.patientId) {
            currentPatient =
              typeof p.patientId === "object"
                ? p.patientId
                : { _id: p.patientId };
          }
        }

        // 4️⃣ Final fallback (never break UI)
        if (!currentPatient) {
          currentPatient = {
            _id: id,
            fullName: "Unknown Patient",
          };
        }

        setPatient(currentPatient);
        setRecords(recordsRes.data.records || []);
        setPrescriptions(presRes.data.prescriptions || []);
        setAppointments(allAppointments.filter(
          (a: any) =>
            String(a.patientId?._id || a.patientId) === String(id)
        ));

      } catch (error) {
        console.error(error);
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

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* PATIENT HEADER */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="w-16 h-16 bg-[#1a237e] rounded-full text-white flex items-center justify-center text-2xl font-semibold uppercase">
            {patient?.fullName?.charAt(0) || "P"}
          </div>

          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-gray-800">
              {patient?.fullName || "Unknown Patient"}
            </h1>

            <p className="text-gray-500 text-sm break-words">
              {patient?.email || "No email"}{" "}
              {patient?.phone ? `• ${patient.phone}` : ""}
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

      {/* RECORDS + APPOINTMENTS */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* RECORDS */}
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

        {/* APPOINTMENTS */}
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
                    {new Date(a.appointmentDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500 capitalize">
                    {a.status}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

     {/* PRESCRIPTIONS */}
<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
  <h2 className="font-semibold text-gray-800 flex items-center gap-2 mb-3">
    <Pill size={18} /> Prescriptions
  </h2>

  {prescriptions.length === 0 ? (
    <p className="text-gray-500 text-sm">No prescriptions</p>
  ) : (
    <div className="space-y-4">
      {prescriptions.map((p: any) => (
        <div key={p._id} className="border border-gray-100 rounded-xl p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
            <div>
              <p className="font-semibold text-gray-800">
                {p.diagnosis || "No diagnosis"}
              </p>

              <p className="text-xs text-gray-500 mt-1">
                {p.prescriptionDate || p.createdAt
                  ? new Date(p.prescriptionDate || p.createdAt).toLocaleDateString()
                  : "No date"}
              </p>
            </div>
          </div>

          {p.medicines?.length > 0 ? (
            <div className="space-y-2">
              {p.medicines.map((medicine: any, index: number) => (
                <div
                  key={index}
                  className="bg-gray-50 border border-gray-100 rounded-lg p-3"
                >
                  <p className="font-medium text-gray-800">
                    {medicine.name || "Unnamed medicine"}
                  </p>

                  <div className="grid sm:grid-cols-3 gap-2 mt-2 text-xs text-gray-600">
                    <p>
                      <span className="font-medium text-gray-700">Dosage:</span>{" "}
                      {medicine.dosage || "N/A"}
                    </p>

                    <p>
                      <span className="font-medium text-gray-700">Frequency:</span>{" "}
                      {medicine.frequency || "N/A"}
                    </p>

                    <p>
                      <span className="font-medium text-gray-700">Duration:</span>{" "}
                      {medicine.duration || "N/A"}
                    </p>
                  </div>

                  {medicine.instructions && (
                    <p className="text-xs text-gray-500 mt-2">
                      <span className="font-medium text-gray-700">
                        Instructions:
                      </span>{" "}
                      {medicine.instructions}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No medicines added</p>
          )}
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