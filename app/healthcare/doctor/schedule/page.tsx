"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Clock, Save, Loader2, Plus, X, ShieldAlert, ShieldCheck } from "lucide-react";
import { healthcareAPI } from "@/lib/api";
import { toast } from "react-toastify";

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

export default function AvailabilityPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [availability, setAvailability] = useState<any>({
    workingDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
    timeSlots: [{ day: "monday", startTime: "09:00", endTime: "17:00", slotDuration: 30 }],
    consultationModes: { video: true, audio: true, chat: true, inPerson: false },
    isAcceptingAppointments: true,
  });
  const [verificationStatus, setVerificationStatus] = useState<string | null>(null);

  useEffect(() => {
    if (user?.role === "DOCTOR") {
      fetchAvailability();
      fetchVerificationStatus();
    }
  }, [user]);

  const fetchAvailability = async () => {
    try {
      const res = await healthcareAPI.getDoctorAvailability(user.id);
      if (res.data.availability) {
        setAvailability(res.data.availability);
      }
    } catch (error) {
      console.error("Failed to fetch availability:", error);
      toast.error("Failed to load your availability settings");
    } finally {
      setLoading(false);
    }
  };

  const fetchVerificationStatus = async () => {
    try {
      if (!user?.id) return;
      const res = await healthcareAPI.getDoctorById(user.id);
      const doctor = res.data?.user || res.data?.doctor || res.data?.data || res.data || {};
      setVerificationStatus(doctor.doctorVerification?.verificationStatus || null);
    } catch (error) {
      // silently fail
    }
  };

  const handleDayToggle = (day: string) => {
    setAvailability((prev: any) => ({
      ...prev,
      workingDays: prev.workingDays.includes(day)
        ? prev.workingDays.filter((d: string) => d !== day)
        : [...prev.workingDays, day],
    }));
  };

  const handleSlotChange = (index: number, field: string, value: any) => {
    setAvailability((prev: any) => {
      const newSlots = [...prev.timeSlots];
      newSlots[index] = { ...newSlots[index], [field]: value };
      return { ...prev, timeSlots: newSlots };
    });
  };

  const addTimeSlot = () => {
    setAvailability((prev: any) => ({
      ...prev,
      timeSlots: [...prev.timeSlots, { day: "monday", startTime: "09:00", endTime: "17:00", slotDuration: 30 }],
    }));
  };

  const removeTimeSlot = (index: number) => {
    setAvailability((prev: any) => ({
      ...prev,
      timeSlots: prev.timeSlots.filter((_: any, i: number) => i !== index),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await healthcareAPI.setDoctorAvailability(availability);
      toast.success("Availability saved successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save availability");
    } finally {
      setSaving(false);
    }
  };

  if (user?.role !== "DOCTOR") {
    return (
      <div className="bg-white rounded-xl p-8 text-center shadow-sm border">
        <Clock className="w-12 h-12 mx-auto text-gray-300 mb-3" />
        <p className="text-gray-500">This section is only accessible to doctors.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="animate-spin h-8 w-8 text-[#1a237e]" />
      </div>
    );
  }

  const isNotApproved = verificationStatus && verificationStatus !== "approved";

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h1 className="text-2xl font-bold text-gray-800">Manage Availability</h1>
        <p className="text-gray-500 mt-1">Set your working hours and consultation modes</p>
      </div>

      {/* Verification warning */}
      {isNotApproved && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 text-amber-800">
          <ShieldAlert className="w-5 h-5 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">
              {verificationStatus === "pending"
                ? "Your doctor account is pending verification."
                : "Your verification request was rejected."}
            </p>
            <p className="text-sm mt-0.5">
              {verificationStatus === "pending"
                ? "You can still set your availability, but you won't appear in searches until an admin approves your profile."
                : "Please contact the administrator for further information."}
            </p>
          </div>
        </div>
      )}

      {/* Working Days */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Working Days</h2>
        <div className="flex flex-wrap gap-2">
          {DAYS.map((day) => (
            <button
              key={day}
              onClick={() => handleDayToggle(day)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition ${
                availability.workingDays.includes(day)
                  ? "bg-[#1a237e] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Time Slots */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Time Slots</h2>
          <button
            onClick={addTimeSlot}
            className="flex items-center gap-1 text-sm text-[#1a237e] hover:underline"
          >
            <Plus className="w-4 h-4" /> Add Slot
          </button>
        </div>
        <div className="space-y-4">
          {availability.timeSlots.map((slot: any, index: number) => (
            <div key={index} className="flex flex-wrap items-end gap-3 p-4 bg-gray-50 rounded-lg">
              <div className="flex-1 min-w-[120px]">
                <label className="block text-xs text-gray-500 mb-1">Day</label>
                <select
                  value={slot.day}
                  onChange={(e) => handleSlotChange(index, "day", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                >
                  {DAYS.map((d) => (
                    <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div className="w-24">
                <label className="block text-xs text-gray-500 mb-1">Start</label>
                <input
                  type="time"
                  value={slot.startTime}
                  onChange={(e) => handleSlotChange(index, "startTime", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                />
              </div>
              <div className="w-24">
                <label className="block text-xs text-gray-500 mb-1">End</label>
                <input
                  type="time"
                  value={slot.endTime}
                  onChange={(e) => handleSlotChange(index, "endTime", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                />
              </div>
              <div className="w-20">
                <label className="block text-xs text-gray-500 mb-1">Duration</label>
                <select
                  value={slot.slotDuration}
                  onChange={(e) => handleSlotChange(index, "slotDuration", parseInt(e.target.value))}
                  className="w-full px-2 py-2 border border-gray-200 rounded-lg"
                >
                  <option value={15}>15m</option>
                  <option value={30}>30m</option>
                  <option value={45}>45m</option>
                  <option value={60}>60m</option>
                </select>
              </div>
              <button
                onClick={() => removeTimeSlot(index)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Consultation Modes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Consultation Modes</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(availability.consultationModes).map(([mode, enabled]) => (
            <button
              key={mode}
              onClick={() =>
                setAvailability((prev: any) => ({
                  ...prev,
                  consultationModes: { ...prev.consultationModes, [mode]: !enabled },
                }))
              }
              className={`px-4 py-3 rounded-lg text-sm font-medium capitalize transition ${
                enabled ? "bg-[#1a237e] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Accepting Appointments Toggle */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Accepting Appointments</h2>
            <p className="text-sm text-gray-500">Turn off to temporarily stop new bookings</p>
          </div>
          <button
            onClick={() =>
              setAvailability((prev: any) => ({
                ...prev,
                isAcceptingAppointments: !prev.isAcceptingAppointments,
              }))
            }
            className={`relative w-12 h-6 rounded-full transition ${
              availability.isAcceptingAppointments ? "bg-green-600" : "bg-gray-300"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition ${
                availability.isAcceptingAppointments ? "translate-x-6" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-[#1a237e] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#0d1757] transition disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving..." : "Save Availability"}
        </button>
      </div>
    </div>
  );
}