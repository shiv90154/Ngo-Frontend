"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
  IndianRupee,
  ChevronLeft,
} from "lucide-react";
import { healthcareAPI } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";

export default function DoctorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  // ✅ Extract doctorId safely (handle both string and string[])
  const doctorId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [doctor, setDoctor] = useState<any>(null);
  const [availability, setAvailability] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [consultationType, setConsultationType] = useState("video");
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(true);
  const [bookingStep, setBookingStep] = useState(1);

  useEffect(() => {
    fetchDoctorDetails();
  }, [doctorId]);

  useEffect(() => {
    if (selectedDate && doctor) {
      fetchAvailableSlots();
    }
  }, [selectedDate, doctor]);

  const fetchDoctorDetails = async () => {
    try {
      const [doctorRes, availRes] = await Promise.all([
        healthcareAPI.getDoctorById(doctorId),
        healthcareAPI.getDoctorAvailability(doctorId),
      ]);
      setDoctor(doctorRes.data.user || doctorRes.data.doctor);
      setAvailability(availRes.data.availability);
    } catch (error) {
      console.error("Failed to fetch doctor:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSlots = async () => {
    try {
      const res = await healthcareAPI.getAvailableSlots(doctorId, selectedDate);
      setAvailableSlots(res.data.slots);
    } catch (error) {
      console.error("Failed to fetch slots:", error);
    }
  };

  const handleBookAppointment = async () => {
    if (!selectedSlot) {
      toast.error("Please select a time slot");
      return;
    }
    try {
      await healthcareAPI.bookAppointment({
        doctorId: doctorId, // ✅ now guaranteed to be string
        appointmentDate: selectedDate,
        timeSlot: selectedSlot.start, // ✅ assuming API expects start time string
        consultationType,
        symptoms,
      });
      toast.success("Appointment booked successfully!");
      router.push("/appointments");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Booking failed");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!doctor) {
    return <div className="text-center py-12">Doctor not found</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-green-700"
      >
        <ChevronLeft className="w-5 h-5" /> Back to doctors
      </button>

      {/* Doctor Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 h-24"></div>
        <div className="p-6 -mt-12">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center text-3xl font-bold text-green-700 border-4 border-white">
              {doctor.fullName?.charAt(0)}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-800">Dr. {doctor.fullName}</h1>
              <p className="text-gray-600 flex items-center gap-1 mt-1">
                <Stethoscope className="w-4 h-4" />
                {doctor.doctorProfile?.specialization}
              </p>
              <p className="text-gray-500 flex items-center gap-1 mt-1">
                <MapPin className="w-4 h-4" />
                {doctor.district}, {doctor.state}
              </p>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">4.8</span>
                  <span className="text-gray-500">(120+ reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <Award className="w-4 h-4" />
                  <span>{doctor.doctorProfile?.experienceYears}+ years exp.</span>
                </div>
              </div>
            </div>
            <div className="md:text-right">
              <p className="text-3xl font-bold text-gray-800">
                ₹{doctor.doctorProfile?.consultationFee}
              </p>
              <p className="text-sm text-gray-500">per consultation</p>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Book Appointment</h2>

        {/* Step 1: Date Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className="p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Step 2: Time Slots */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Time Slot
          </label>
          {availableSlots.length === 0 ? (
            <p className="text-gray-500">No slots available for this date</p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {availableSlots.map((slot: any) => (
                <button
                  key={slot.start}
                  onClick={() => setSelectedSlot(slot)}
                  className={`p-2 text-sm border rounded-lg transition ${
                    selectedSlot?.start === slot.start
                      ? "bg-green-600 text-white border-green-600"
                      : "border-gray-200 hover:border-green-300 hover:bg-green-50"
                  }`}
                >
                  {slot.start}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Step 3: Consultation Type */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Consultation Mode
          </label>
          <div className="flex gap-3">
            {["video", "audio", "chat"].map((type) => {
              const Icon = type === "video" ? Video : type === "audio" ? Phone : MessageCircle;
              return (
                <button
                  key={type}
                  onClick={() => setConsultationType(type)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition capitalize ${
                    consultationType === type
                      ? "bg-green-600 text-white border-green-600"
                      : "border-gray-200 hover:border-green-300"
                  }`}
                >
                  <Icon className="w-4 h-4" /> {type}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 4: Symptoms */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Symptoms (Optional)
          </label>
          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="Describe your symptoms..."
            rows={3}
            className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Book Button */}
        <button
          onClick={handleBookAppointment}
          disabled={!selectedSlot}
          className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
}