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

  getDoctorById: (id: string) => api.get(`/users/${id}`),
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
// NOTIFICATION API
// ======================
export const notificationAPI = {
  getNotifications: (params?: {
    page?: number;
    limit?: number;
    filter?: "unread" | "all";
  }) => api.get("/notifications", { params }),

  markAsRead: (id: string) => api.patch(`/notifications/${id}/read`),

  markAllAsRead: () => api.patch("/notifications/read-all"),

  deleteNotification: (id: string) => api.delete(`/notifications/${id}`),
};

// ======================
// FINANCE API
// ======================
export const financeAPI = {
  // Dashboard
  getDashboard: () => api.get("/finance/dashboard"),

  // Wallet
  getWallet: () => api.get("/finance/wallet"),
  createWalletOrder: (amount: number) => api.post("/finance/wallet/add-order", { amount }),
  verifyPayment: (data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => api.post("/finance/wallet/verify", data),
  transferFunds: (toUserId: string, amount: number, description?: string) =>
    api.post("/finance/wallet/transfer", { toUserId, amount, description }),

  // Loans
  getMyLoans: () => api.get("/finance/loans"),
  applyLoan: (amount: number, tenureMonths: number) =>
    api.post("/finance/loans/apply", { amount, tenureMonths }),
  repayEMI: (loanId: string) => api.post(`/finance/loans/${loanId}/repay`),

  // Bills
  getBillHistory: () => api.get("/finance/bills/history"),
  payBill: (billType: string, billNumber: string, amount: number) =>
    api.post("/finance/bills/pay", { billType, billNumber, amount }),

  // Bank Account
  getBankAccount: () => api.get("/finance/bank-account"),
  updateBankAccount: (data: {
    accountNumber?: string;
    ifsc?: string;
    bankName?: string;
    accountHolderName?: string;
  }) => api.put("/finance/bank-account", data),
  verifyBankAccount: (data: {
    accountNumber: string;
    ifsc: string;
    accountHolderName?: string;
    bankName?: string;
  }) => api.post("/finance/bank-account/verify", data),

  // AEPS
  aepsWithdraw: (aadhaarNumber: string, amount: number, bankIIN?: string) =>
    api.post("/finance/aeps/withdraw", { aadhaarNumber, amount, bankIIN }),
};

// ======================
// IT SERVICES API
// ======================
export const itAPI = {
  // Dashboard
  getDashboard: () => api.get("/it/dashboard"),

  // Clients
  getClients: (params?: { page?: number; limit?: number; search?: string }) =>
    api.get("/it/clients", { params }),
  getClient: (id: string) => api.get(`/it/clients/${id}`),
  createClient: (data: any) => api.post("/it/clients", data),
  updateClient: (id: string, data: any) => api.put(`/it/clients/${id}`, data),
  deleteClient: (id: string) => api.delete(`/it/clients/${id}`),

  // Projects
  getProjects: (params?: { page?: number; limit?: number; status?: string; client?: string; search?: string }) =>
    api.get("/it/projects", { params }),
  getProject: (id: string) => api.get(`/it/projects/${id}`),
  createProject: (data: any) => api.post("/it/projects", data),
  updateProject: (id: string, data: any) => api.put(`/it/projects/${id}`, data),
  deleteProject: (id: string) => api.delete(`/it/projects/${id}`),

  // Invoices
  getInvoices: (params?: { page?: number; limit?: number; status?: string; client?: string; search?: string }) =>
    api.get("/it/invoices", { params }),
  getInvoice: (id: string) => api.get(`/it/invoices/${id}`),
  createInvoice: (data: any) => api.post("/it/invoices", data),
  updateInvoice: (id: string, data: any) => api.put(`/it/invoices/${id}`, data),
  deleteInvoice: (id: string) => api.delete(`/it/invoices/${id}`),

  // Tasks
  getTasks: (params?: { project?: string; assignedTo?: string; status?: string }) =>
    api.get("/it/tasks", { params }),
  createTask: (data: any) => api.post("/it/tasks", data),
  updateTask: (id: string, data: any) => api.put(`/it/tasks/${id}`, data),
  deleteTask: (id: string) => api.delete(`/it/tasks/${id}`),
};

// ======================
// ADMIN API (🆕)
// ======================
export const adminAPI = {
  // Stats
  getStats: () => api.get("/admin/stats"),

  // Users
  getUsers: (params?: { page?: number; limit?: number; role?: string; search?: string }) =>
    api.get("/admin/users", { params }),
  getUser: (id: string) => api.get(`/admin/users/${id}`),
  updateUser: (id: string, data: any) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),
  toggleUserActive: (id: string) => api.patch(`/admin/users/${id}/toggle-active`),
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