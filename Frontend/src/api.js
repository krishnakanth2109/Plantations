import axios from "axios";
const baseURL = import.meta.env.MODE === "production" ? import.meta.env.VITE_API_URL_PRODUCTION : import.meta.env.VITE_API_URL_DEVELOPMENT || "http://localhost:5000";
const api = axios.create({
  baseURL,
  timeout: 5e5,
  headers: { "Content-Type": "application/json" }
});
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("yp_auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem("yp_auth_user");
      sessionStorage.removeItem("yp_auth_token");
      window.dispatchEvent(new Event("yp-auth-change"));
    }
    const apiError = error.response?.data;
    if (apiError?.message) {
      return Promise.reject(new Error(apiError.code ? `${apiError.message} (${apiError.code})` : apiError.message));
    }
    return Promise.reject(error);
  }
);
const loginUser = async (email, password) => {
  const response = await api.post("/api/auth/login", { email, password });
  return response.data;
};
const registerUser = async (data) => {
  const response = await api.post("/api/auth/register", data);
  return response.data;
};
const getCurrentUser = async () => {
  const response = await api.get("/api/auth/me");
  return response.data;
};
const seedDatabase = async () => {
  const response = await api.post("/api/seed");
  return response.data;
};
const healthCheck = async () => {
  const response = await api.get("/api/health");
  return response.data;
};
const getServices = async () => (await api.get("/api/services")).data;
const getServiceBySlug = async (slug) => (await api.get(`/api/services/${slug}`)).data;
const createService = async (data) => (await api.post("/api/services", data)).data;
const updateService = async (id, data) => (await api.put(`/api/services/${id}`, data)).data;
const deleteService = async (id) => (await api.delete(`/api/services/${id}`)).data;
const createBooking = async (data) => (await api.post("/api/bookings", data)).data;
const getMyBookings = async () => (await api.get("/api/bookings/my")).data;
const cancelBooking = async (id, cancelReason) => (await api.patch(`/api/bookings/${id}/cancel`, { cancelReason })).data;
const getAllBookings = async () => (await api.get("/api/bookings")).data;
const updateBookingStatus = async (id, data) => (await api.patch(`/api/bookings/${id}/status`, data)).data;
const getMaintenancePlans = async () => (await api.get("/api/maintenance-plans")).data;
const createMaintenancePlan = async (data) => (await api.post("/api/maintenance-plans", data)).data;
const updateMaintenancePlan = async (id, data) => (await api.put(`/api/maintenance-plans/${id}`, data)).data;
const deleteMaintenancePlan = async (id) => (await api.delete(`/api/maintenance-plans/${id}`)).data;
const createSubscription = async (data) => (await api.post("/api/subscriptions", data)).data;
const getMySubscriptions = async () => (await api.get("/api/subscriptions/my")).data;
const getAllSubscriptions = async () => (await api.get("/api/subscriptions")).data;
const updateSubscriptionStatus = async (id, data) => (await api.patch(`/api/subscriptions/${id}/status`, data)).data;
const renewSubscription = async (id, months = 6) => (await api.patch(`/api/subscriptions/${id}/renew`, { months })).data;
const getMyPayments = async () => (await api.get("/api/payments/my")).data;
const getAllPayments = async () => (await api.get("/api/payments")).data;
const updatePaymentStatus = async (id, status) => (await api.patch(`/api/payments/${id}/status`, { status })).data;
const createWellnessTicket = async (data) => (await api.post("/api/wellness-tickets", data)).data;
const getMyWellnessTickets = async () => (await api.get("/api/wellness-tickets/my")).data;
const getAllWellnessTickets = async () => (await api.get("/api/wellness-tickets")).data;
const diagnoseWellnessTicket = async (id, diagnosis) => (await api.patch(`/api/wellness-tickets/${id}/diagnose`, { diagnosis })).data;
const resolveWellnessTicket = async (id) => (await api.patch(`/api/wellness-tickets/${id}/resolve`)).data;
const getLibraryArticles = async () => (await api.get("/api/library")).data;
const getLibraryArticleBySlug = async (slug) => (await api.get(`/api/library/${slug}`)).data;
const createLibraryArticle = async (data) => (await api.post("/api/library", data)).data;
const updateLibraryArticle = async (id, data) => (await api.put(`/api/library/${id}`, data)).data;
const deleteLibraryArticle = async (id) => (await api.delete(`/api/library/${id}`)).data;
const getWishlist = async () => (await api.get("/api/wishlist")).data;
const addWishlistItem = async (serviceId) => (await api.post("/api/wishlist", { serviceId })).data;
const removeWishlistItem = async (serviceId) => (await api.delete(`/api/wishlist/${serviceId}`)).data;
const createLead = async (data) => (await api.post("/api/leads", data)).data;
const getLeads = async () => (await api.get("/api/leads")).data;
const updateLeadStatus = async (id, status) => (await api.patch(`/api/leads/${id}/status`, { status })).data;
const createReview = async (data) => (await api.post("/api/reviews", data)).data;
const getMyReviews = async () => (await api.get("/api/reviews/my")).data;
const getPublicReviews = async () => (await api.get("/api/reviews/public")).data;
const getAllReviews = async () => (await api.get("/api/reviews")).data;
const approveReview = async (id) => (await api.patch(`/api/reviews/${id}/approve`)).data;
const deleteReview = async (id) => (await api.delete(`/api/reviews/${id}`)).data;
const uploadFile = async (file, folder) => {
  const formData = new FormData();
  formData.append("file", file);
  if (folder) formData.append("folder", folder);
  const response = await api.post("/api/uploads", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return response.data;
};
var stdin_default = api;
export {
  addWishlistItem,
  approveReview,
  baseURL,
  cancelBooking,
  createBooking,
  createLibraryArticle,
  createLead,
  createMaintenancePlan,
  createReview,
  createService,
  createSubscription,
  createWellnessTicket,
  stdin_default as default,
  deleteLibraryArticle,
  deleteMaintenancePlan,
  deleteReview,
  deleteService,
  diagnoseWellnessTicket,
  getAllBookings,
  getAllPayments,
  getAllReviews,
  getAllSubscriptions,
  getAllWellnessTickets,
  getCurrentUser,
  getLibraryArticleBySlug,
  getLibraryArticles,
  getLeads,
  getMaintenancePlans,
  getMyBookings,
  getMyPayments,
  getMyReviews,
  getMySubscriptions,
  getMyWellnessTickets,
  getPublicReviews,
  getServiceBySlug,
  getServices,
  getWishlist,
  healthCheck,
  loginUser,
  registerUser,
  removeWishlistItem,
  renewSubscription,
  resolveWellnessTicket,
  seedDatabase,
  updateBookingStatus,
  updateLibraryArticle,
  updateLeadStatus,
  updateMaintenancePlan,
  updatePaymentStatus,
  updateService,
  updateSubscriptionStatus,
  uploadFile
};
