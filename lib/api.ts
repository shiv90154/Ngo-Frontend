// lib/api.ts
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor – adds token from localStorage (client‑side only)
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ======================
// HEALTHCARE API
// ======================
export const healthcareAPI = {
  // ---------- DOCTOR AVAILABILITY ----------
  setDoctorAvailability: (data: {
    workingDays?: string[];
    timeSlots?: any[];
    consultationModes?: Record<string, boolean>;
    isAcceptingAppointments?: boolean;
  }) => api.post("/healthcare/availability", data),

  getDoctorAvailability: (doctorId: string) =>
    api.get(`/healthcare/availability/${doctorId}`),

  getAvailableSlots: (doctorId: string, date: string) =>
    api.get("/healthcare/slots", { params: { doctorId, date } }),

  // ---------- APPOINTMENTS ----------
  bookAppointment: (data: {
    doctorId: string;
    appointmentDate: string;
    timeSlot: { start: string; end: string };
    consultationType: "video" | "audio" | "chat" | "in-person";
    symptoms?: string;
    notes?: string;
  }) => api.post("/healthcare/appointments", data),

  updateAppointmentStatus: (
    id: string,
    data: {
      status?: "confirmed" | "cancelled" | "completed" | "no-show";
      cancellationReason?: string;
      meetingLink?: string;
      roomId?: string;
    }
  ) => api.put(`/healthcare/appointments/${id}`, data),

  getPatientAppointments: (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }) => api.get("/healthcare/appointments/patient", { params }),

  getDoctorAppointments: (params?: {
    status?: string;
    date?: string;
    page?: number;
    limit?: number;
  }) => api.get("/healthcare/appointments/doctor", { params }),

  getAppointmentById: (id: string) => api.get(`/healthcare/appointments/${id}`),

  // ---------- PRESCRIPTIONS ----------
  createPrescription: (data: {
    patientId: string;
    appointmentId?: string;
    diagnosis: string;
    medicines: Array<{
      name: string;
      dosage: string;
      frequency: string;
      duration: string;
      instructions?: string;
    }>;
    tests?: Array<{ name: string; instructions?: string }>;
    advice?: string;
    followUpDate?: string;
  }) => api.post("/healthcare/prescriptions", data),

  getPatientPrescriptions: (patientId?: string, params?: { page?: number; limit?: number }) =>
    api.get(
      patientId
        ? `/healthcare/prescriptions/patient/${patientId}`
        : "/healthcare/prescriptions/patient",
      { params }
    ),

  getPrescriptionById: (id: string) => api.get(`/healthcare/prescriptions/${id}`),

  // ---------- HEALTH RECORDS ----------
  addHealthRecord: (formData: FormData) =>
    api.post("/healthcare/records", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  getPatientHealthRecords: (patientId?: string, params?: { recordType?: string; page?: number; limit?: number }) =>
    api.get(
      patientId
        ? `/healthcare/records/patient/${patientId}`
        : "/healthcare/records/patient",
      { params }
    ),

  getHealthRecordById: (id: string) => api.get(`/healthcare/records/${id}`),

  deleteHealthRecord: (id: string) => api.delete(`/healthcare/records/${id}`),

  // ---------- DOCTOR SEARCH ----------
  searchDoctors: (params: {
    specialization?: string;
    state?: string;
    district?: string;
    page?: number;
    limit?: number;
  }) => api.get("/healthcare/doctors/search", { params }),

  getDoctorById: (id: string) => api.get(`/users/${id}`), // uses admin/user route
};

// ======================
// MEDIA (NEWS) API
// ======================
export const mediaAPI = {
  // Feed
  getFeed: (params?: { page?: number; limit?: number }) =>
    api.get("/media/feed", { params }),

  // Posts
  createPost: (formData: FormData) =>
    api.post("/media/posts", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getPost: (id: string) => api.get(`/media/posts/${id}`),
  updatePost: (id: string, data: any) => api.put(`/media/posts/${id}`, data),
  deletePost: (id: string) => api.delete(`/media/posts/${id}`),
  getUserPosts: (userId: string, params?: { page?: number; limit?: number }) =>
    api.get(`/media/users/${userId}/posts`, { params }),

  // Likes
  likePost: (id: string) => api.post(`/media/posts/${id}/like`),
  unlikePost: (id: string) => api.delete(`/media/posts/${id}/like`),

  // Comments
  getComments: (postId: string, params?: { page?: number; limit?: number }) =>
    api.get(`/media/posts/${postId}/comments`, { params }),
  addComment: (postId: string, text: string) =>
    api.post(`/media/posts/${postId}/comments`, { text }),
  deleteComment: (commentId: string) => api.delete(`/media/comments/${commentId}`),

  // Follow
  followUser: (userId: string) => api.post(`/media/follow/${userId}`),
  unfollowUser: (userId: string) => api.delete(`/media/follow/${userId}`),
  getFollowers: (userId?: string, params?: { page?: number; limit?: number }) =>
    api.get(userId ? `/media/followers/${userId}` : "/media/followers", { params }),
  getFollowing: (userId?: string, params?: { page?: number; limit?: number }) =>
    api.get(userId ? `/media/following/${userId}` : "/media/following", { params }),
  checkFollowStatus: (userId: string) => api.get(`/media/follow-status/${userId}`),

  // Search
  searchCreators: (q: string, params?: { page?: number; limit?: number }) =>
    api.get("/media/search/creators", { params: { q, ...params } }),

  // Become creator
  becomeCreator: () => api.post("/media/become-creator"),
};

// ======================
// AUTH API
// ======================
export const authAPI = {
  login: (email: string, password: string) =>
    api.post("/users/login", { email, password }),
  register: (formData: FormData) =>
    api.post("/users/register", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  verifyOTP: (email: string, otp: string) =>
    api.post("/users/verify-otp", { email, otp }),
  resendOTP: (email: string) =>
    api.post("/users/resend-otp", { email }),
  forgotPassword: (email: string) =>
    api.post("/users/forgot-password", { email }),
  verifyResetOtp: (email: string, otp: string) =>
    api.post("/users/verify-reset-otp", { email, otp }),
  resetPassword: (email: string, otp: string, newPassword: string) =>
    api.post("/users/reset-password", { email, otp, newPassword }),
  getProfile: () => api.get("/users/profile"),
  updateProfile: (formData: FormData) =>
    api.put("/users/profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  logout: () => api.post("/users/logout"),
};

export default api;