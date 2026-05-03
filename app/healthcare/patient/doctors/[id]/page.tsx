"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  MapPin,
  Star,
  Stethoscope,
  Award,
  Clock,
  Calendar,
  Video,
  Phone,
  MessageCircle,
  ChevronLeft,
  AlertCircle,
  Loader2,
  CheckCircle,
  Shield,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import { healthcareAPI } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";

interface DoctorProfile {
  specialization?: string;
  experienceYears?: number;
  consultationFee?: number;
  qualifications?: string[];
}

interface Doctor {
  _id?: string;
  id?: string;
  fullName?: string;
  name?: string;
  email?: string;
  phone?: string;
  state?: string;
  district?: string;
  city?: string;
  doctorProfile?: DoctorProfile;
  isActive?: boolean;
  specialization?: string;
  experience?: number;
  consultationFee?: number;
  qualification?: string;
  location?: string;
  rating?: number;
}

interface TimeSlot {
  start: string;
  end: string;
  available?: number;
}

export default function DoctorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const doctorId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [consultationType, setConsultationType] = useState("video");
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(true);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [error, setError] = useState("");
  const [slotMessage, setSlotMessage] = useState("");
  const [activeTab, setActiveTab] = useState("booking");

  useEffect(() => {
    const dataParam = searchParams.get("data");

    if (dataParam) {
      try {
        const parsedData = JSON.parse(dataParam);
        setDoctor(parsedData);
        setLoading(false);
      } catch (err) {
        console.error("Failed to parse doctor data:", err);
        fetchDoctorDetails();
      }
    } else {
      fetchDoctorDetails();
    }
  }, [doctorId]);

  useEffect(() => {
    if (selectedDate && doctorId && activeTab === "booking") {
      fetchAvailableSlots();
    }
  }, [selectedDate, doctorId, activeTab]);

  const fetchDoctorDetails = async () => {
    if (!doctorId) return;

    try {
      setLoading(true);
      setError("");

      const doctorRes = await healthcareAPI.getDoctorById(doctorId);

      let doctorData = doctorRes.data;

      if (doctorData?.user) doctorData = doctorData.user;
      else if (doctorData?.doctor) doctorData = doctorData.doctor;
      else if (doctorData?.data) doctorData = doctorData.data;

      setDoctor(doctorData);
    } catch (error: any) {
      console.error("Failed to fetch doctor:", error);

      if (error.response?.status === 403) {
        setError("Please login to view complete doctor details and book appointments");
      } else if (error.response?.status === 404) {
        setError("Doctor not found");
      } else {
        setError("Failed to load doctor information");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSlots = async () => {
    if (!doctorId || !selectedDate) return;

    try {
      setSlotsLoading(true);
      setSlotMessage("");
      setAvailableSlots([]);
      setSelectedSlot(null);

      const res = await healthcareAPI.getAvailableSlots(doctorId, selectedDate);

      const responseData = res.data;

      const slots: TimeSlot[] = Array.isArray(responseData)
        ? responseData
        : Array.isArray(responseData?.slots)
        ? responseData.slots
        : [];

      setAvailableSlots(slots);
      setSlotMessage(responseData?.message || "");
    } catch (error: any) {
      console.error("Failed to fetch slots:", error);
      setAvailableSlots([]);
      setSlotMessage(
        error.response?.data?.message || "Failed to load available slots"
      );
    } finally {
      setSlotsLoading(false);
    }
  };

  const handleBookAppointment = async () => {
    setSubmitting(true);

    if (!user) {
      toast.error("Please login to book an appointment");
      router.push("/login");
      setSubmitting(false);
      return;
    }

    if (!selectedSlot) {
      toast.error("Please select a time slot");
      setSubmitting(false);
      return;
    }

    try {
      const bookingData = {
        doctorId,
        appointmentDate: selectedDate,
        timeSlot: {
          start: selectedSlot.start,
          end: selectedSlot.end,
        },
        consultationType,
        symptoms,
      };

      await healthcareAPI.bookAppointment(bookingData);

      toast.success("Appointment booked successfully!");
      router.push("/healthcare/patient/appointments");
    } catch (error: any) {
      console.error("Booking error:", error);
      toast.error(error.response?.data?.message || "Booking failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatSlotTime = (time: string) => {
    if (!time) return "";

    const [hourStr, minuteStr] = time.split(":");
    let hour = Number(hourStr);
    const minute = minuteStr || "00";

    const period = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;

    return `${hour}:${minute} ${period}`;
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center bg-slate-50">
        <div className="text-center bg-white border border-slate-200 rounded-2xl shadow-sm px-8 py-7">
          <Loader2 className="h-10 w-10 animate-spin text-[#1a237e] mx-auto" />
          <p className="mt-3 text-sm font-medium text-slate-700">
            Loading doctor profile...
          </p>
        </div>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="min-h-[60vh] bg-slate-50 px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center shadow-sm">
            <AlertCircle className="h-12 w-12 text-amber-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-amber-900 mb-2">
              {error || "Doctor not found"}
            </h3>
            <p className="text-amber-800 mb-5">
              You can still browse doctors and view their profiles.
            </p>
            <button
              onClick={() => router.push("/healthcare/doctors")}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1a237e] text-white rounded-xl hover:bg-[#11195f] transition shadow-sm"
            >
              Browse Doctors
            </button>
          </div>
        </div>
      </div>
    );
  }

  const doctorName = doctor.fullName || doctor.name || "Doctor";
  const specialization =
    doctor.specialization || doctor.doctorProfile?.specialization || "General Physician";
  const experience = doctor.experience || doctor.doctorProfile?.experienceYears || 0;
  const consultationFee =
    doctor.consultationFee || doctor.doctorProfile?.consultationFee || 500;
  const location =
    doctor.location || [doctor.city, doctor.district, doctor.state].filter(Boolean).join(", ");
  const qualification =
    doctor.qualification || doctor.doctorProfile?.qualifications?.[0] || "MBBS, MD";
  const rating = doctor.rating || 4.8;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/40">
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-[#1a237e] transition-colors"
        >
          <ChevronLeft className="w-5 h-5" /> Back to doctors
        </button>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="relative bg-gradient-to-r from-[#1a237e] via-[#283593] to-[#3949ab] h-32">
            <div className="absolute inset-0 bg-black/10" />
          </div>

          <div className="p-6 -mt-16 relative">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="w-28 h-28 bg-white rounded-2xl shadow-xl flex items-center justify-center text-4xl font-extrabold text-[#1a237e] border-4 border-white">
                {doctorName.charAt(0).toUpperCase()}
              </div>

              <div className="flex-1 pt-2">
                <h1 className="text-3xl font-extrabold text-white">
                  Dr. {doctorName}
                </h1>

                <div className="flex flex-wrap items-center gap-3 mt-3">
                  <p className="text-slate-700 flex items-center gap-1.5 font-medium">
                    <Stethoscope className="w-4 h-4 text-[#1a237e]" />
                    {specialization}
                  </p>

                  <span className="hidden sm:block text-slate-300">|</span>

                  <div className="flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-full">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-bold">{rating}</span>
                    <span className="text-amber-700 text-sm">(120+ reviews)</span>
                  </div>
                </div>

                {location && (
                  <p className="text-slate-600 flex items-center gap-1.5 mt-3">
                    <MapPin className="w-4 h-4 text-[#1a237e]" />
                    {location}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-3 mt-4">
                  {experience > 0 && (
                    <div className="flex items-center gap-1.5 text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full text-sm font-medium">
                      <Award className="w-4 h-4 text-[#1a237e]" />
                      <span>{experience}+ years exp.</span>
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full text-sm font-medium">
                    <GraduationCap className="w-4 h-4 text-[#1a237e]" />
                    <span>{qualification}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full text-sm font-semibold">
                    <Shield className="w-4 h-4" />
                    <span>Verified Doctor</span>
                  </div>
                </div>
              </div>

              <div className="lg:text-right bg-slate-50 border border-slate-200 rounded-2xl p-5 min-w-[210px]">
                <p className="text-4xl font-extrabold text-slate-950">
                  ₹{consultationFee}
                </p>
                <p className="text-sm text-slate-600 font-medium">per consultation</p>

                <div className="mt-3">
                  <p
                    className={`text-sm font-bold ${
                      doctor.isActive === false ? "text-slate-500" : "text-emerald-700"
                    }`}
                  >
                    {doctor.isActive === false
                      ? "Currently Unavailable"
                      : "Available for Consultation"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-2 shadow-sm overflow-x-auto">
          <nav className="flex gap-2 min-w-max">
            {[
              { id: "booking", label: "Book Appointment", icon: Calendar },
              { id: "availability", label: "Check Availability", icon: Clock },
              { id: "info", label: "Doctor Information", icon: Briefcase },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  activeTab === id
                    ? "bg-[#1a237e] text-white shadow-sm"
                    : "text-slate-600 hover:text-[#1a237e] hover:bg-indigo-50"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
          {activeTab === "booking" && (
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 mb-1">
                Book Appointment
              </h2>
              <p className="text-sm text-slate-600 mb-5">
                Choose your date, slot, and consultation mode.
              </p>

              {!user && (
                <div className="mb-6 bg-indigo-50 border border-indigo-200 rounded-2xl p-4">
                  <p className="text-indigo-950 text-sm font-medium">
                    Please login to book an appointment with Dr. {doctorName}
                  </p>
                  <button
                    onClick={() => router.push("/login")}
                    className="mt-3 px-4 py-2 bg-[#1a237e] text-white rounded-xl text-sm font-semibold hover:bg-[#11195f] transition"
                  >
                    Login Now
                  </button>
                </div>
              )}

              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-800 mb-2">
                  Select Date
                </label>

                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full md:w-auto p-3 bg-white text-slate-900 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a237e] focus:border-transparent"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-800 mb-2">
                  Select Time Slot
                </label>

                {slotsLoading ? (
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center text-slate-600">
                    <Loader2 className="w-5 h-5 mx-auto mb-2 animate-spin text-[#1a237e]" />
                    <p className="text-sm font-medium">Loading available slots...</p>
                  </div>
                ) : availableSlots.length === 0 ? (
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center text-slate-600">
                    <Clock className="w-5 h-5 mx-auto mb-2 text-slate-500" />
                    <p className="text-sm font-semibold">
                      {slotMessage || "No slots available for this date"}
                    </p>
                    <p className="text-xs mt-1 text-slate-500">Please select another date</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    {availableSlots.map((slot, index) => (
                      <button
                        key={`${slot.start}-${slot.end}-${index}`}
                        onClick={() => setSelectedSlot(slot)}
                        disabled={!user}
                        className={`p-2.5 text-sm border rounded-xl transition-all font-semibold ${
                          selectedSlot?.start === slot.start
                            ? "bg-[#1a237e] text-white border-[#1a237e] shadow-md"
                            : "bg-white text-slate-700 border-slate-300 hover:border-[#1a237e] hover:bg-indigo-50 hover:text-[#1a237e]"
                        } ${!user ? "cursor-not-allowed opacity-50" : ""}`}
                      >
                        <span className="block">{formatSlotTime(slot.start)}</span>
                        {slot.available !== undefined && (
                          <span className="block text-[10px] opacity-80">
                            {slot.available} left
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-800 mb-2">
                  Consultation Mode
                </label>

                <div className="flex gap-3 flex-wrap">
                  {[
                    { type: "video", icon: Video, label: "Video Call" },
                    { type: "audio", icon: Phone, label: "Audio Call" },
                    { type: "chat", icon: MessageCircle, label: "Chat" },
                  ].map(({ type, icon: Icon, label }) => (
                    <button
                      key={type}
                      onClick={() => setConsultationType(type)}
                      disabled={!user}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all capitalize font-semibold ${
                        consultationType === type
                          ? "bg-[#1a237e] text-white border-[#1a237e] shadow-md"
                          : "bg-white text-slate-700 border-slate-300 hover:border-[#1a237e] hover:bg-indigo-50 hover:text-[#1a237e]"
                      } ${!user ? "cursor-not-allowed opacity-50" : ""}`}
                    >
                      <Icon className="w-4 h-4" /> {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-800 mb-2">
                  Symptoms <span className="text-slate-500 font-medium">(Optional)</span>
                </label>

                <textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Describe your symptoms or any notes for the doctor..."
                  rows={3}
                  disabled={!user}
                  className="w-full p-3 bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a237e] focus:border-transparent resize-none disabled:bg-slate-100 disabled:text-slate-500"
                />
              </div>

              <button
                onClick={handleBookAppointment}
                disabled={!selectedSlot || !user || submitting}
                className="w-full py-3.5 bg-gradient-to-r from-[#1a237e] to-[#283593] text-white rounded-xl font-bold hover:shadow-lg hover:from-[#11195f] hover:to-[#1a237e] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {!user
                  ? "Login to Book Appointment"
                  : !selectedSlot
                  ? "Select a time slot to continue"
                  : submitting
                  ? "Booking..."
                  : "Book Appointment"}
              </button>
            </div>
          )}

          {activeTab === "availability" && (
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 mb-1">
                Doctor Availability
              </h2>
              <p className="text-sm text-slate-600 mb-5">
                General availability schedule for this doctor.
              </p>

              <div className="space-y-3">
                {[
                  ["Monday - Friday", "9:00 AM - 6:00 PM"],
                  ["Saturday", "10:00 AM - 4:00 PM"],
                  ["Sunday", "Closed"],
                ].map(([day, time]) => (
                  <div
                    key={day}
                    className="flex items-center justify-between gap-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl"
                  >
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-[#1a237e]" />
                      <span className="font-bold text-slate-800">{day}</span>
                    </div>
                    <span className="text-slate-700 font-medium">{time}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-700" />
                  <p className="text-sm font-medium text-emerald-900">
                    Select a date in the booking tab to view live available slots.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "info" && (
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 mb-1">
                Doctor Information
              </h2>
              <p className="text-sm text-slate-600 mb-5">
                Professional details and consultation information.
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                {[
                  ["Qualifications", qualification],
                  ["Specialization", specialization],
                  ...(experience > 0 ? [["Experience", `${experience}+ years`]] : []),
                  ["Location", location || "Not specified"],
                  ["Consultation Fee", `₹${consultationFee} per consultation`],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="p-4 bg-slate-50 border border-slate-200 rounded-2xl"
                  >
                    <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500">
                      {label}
                    </h3>
                    <p className="mt-1 text-slate-900 font-semibold">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}