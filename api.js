import axios from "axios";

// ========================
// Base Config
// ========================
const BASE_URL = import.meta.env.VITE_API_URL || "https://admin.sarvoclub.com";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
    "zoneId": "configuration", // From Flutter constants
  },
});

// ========================
// Auth & User APIs
// ========================
export const AuthAPI = {
  register: (data) => api.post("/api/v1/customer/auth/registration", data),
  login: (data) => api.post("/api/v1/customer/auth/login", data),
  logout: () => api.post("/api/v1/customer/auth/logout"),
  socialLogin: (data) => api.post("/api/v1/customer/auth/social-login", data),
  registerWithSocial: (data) => api.post("/api/v1/customer/auth/registration-with-social-media", data),
  existingAccountCheck: (data) => api.post("/api/v1/customer/auth/existing-account-check", data),
  checkExistingUser: (data) => api.post("/api/v1/user/check-existing-customer", data),
};

export const OtpAPI = {
  sendVerificationOtp: (data) => api.post("/api/v1/user/verification/send-otp", data),
  verifyOtp: (data) => api.post("/api/v1/user/verification/verify-otp", data),
  phoneOtpVerify: (data) => api.post("/api/v1/user/verification/login-otp-verify", data),
  firebaseOtpVerify: (data) => api.post("/api/v1/user/verification/firebase-auth-verify", data),
  registerWithOtp: (data) => api.post("/api/v1/user/verification/registration-with-otp", data),

  sendForgetPasswordOtp: (data) => api.post("/api/v1/user/forget-password/send-otp", data),
  verifyForgetPasswordOtp: (data) => api.post("/api/v1/user/forget-password/verify-otp", data),
  resetPassword: (data) => api.post("/api/v1/user/forget-password/reset", data),
};

export const UserAPI = {
  info: () => api.get("/api/v1/customer/info"),
  updateProfile: (data) => api.post("/api/v1/customer/update/profile", data),
  removeAccount: () => api.delete("/api/v1/customer/remove-account"),
};

// ========================
// Category & Service APIs
// ========================
export const CategoryAPI = {
  all: () => api.get("/api/v1/customer/category?limit=20"),
  subcategories: (id) => api.get(`/api/v1/customer/category/childes?limit=20&offset=1&id=${id}`),
  categoryServices: (id) => api.get(`/api/v1/categories/service/${id}`),
};

export const ServiceAPI = {
  all: () => api.get("/api/v1/customer/service"),
  popular: () => api.get("/api/v1/customer/service/popular"),
  trending: () => api.get("/api/v1/customer/service/trending"),
  recentlyViewed: () => api.get("/api/v1/customer/service/recently-viewed"),
  recommended: () => api.get("/api/v1/customer/service/recommended"),
  recommendedSearch: () => api.get("/api/v1/customer/service/search/recommended"),
  offers: () => api.get("/api/v1/customer/service/offers"),
  serviceBySubcategory: (id) => api.get(`/api/v1/customer/service/sub-category/${id}`),
  itemsByCampaign: (id) => api.get(`/api/v1/customer/campaign/data/items?campaign_id=${id}`),
  details: (id) => api.get(`/api/v1/customer/service/detail?id=${id}`),
  reviews: (id) => api.get(`/api/v1/customer/service/review/${id}`),
  search: (q) => api.get(`/api/v1/customer/service/search?q=${q}`),
  searchSuggestion: (q) => api.get(`/api/v1/customer/service/search-suggestion?q=${q}`),
  suggestedSearch: () => api.get("/api/v1/customer/recently-searched-keywords"),
  removeSuggestedSearch: () => api.delete("/api/v1/customer/remove-searched-keywords"),
  featuredCategories: () => api.get("/api/v1/customer/featured-categories?limit=100&offset=1"),
};

// ========================
// Cart APIs
// ========================
export const CartAPI = {
  add: (data) => api.post("/api/v1/customer/cart/add", data),
  list: () => api.get("/api/v1/customer/cart/list?limit=100&offset=1"),
  remove: (id) => api.delete(`/api/v1/customer/cart/remove/${id}`),
  empty: () => api.delete("/api/v1/customer/cart/data/empty"),
  updateQuantity: (id, data) => api.put(`/api/v1/customer/cart/update-quantity/${id}`, data),
  updateProvider: (data) => api.post("/api/v1/customer/cart/update/provider", data),
  otherInfo: () => api.get("/api/v1/customer/cart/other-info"),
};

// ========================
// Booking APIs
// ========================
export const BookingAPI = {
  list: () => api.get("/api/v1/customer/booking"),
  details: (id) => api.get(`/api/v1/customer/booking?id=${id}`),
  subDetails: (id) => api.get(`/api/v1/customer/booking/single?id=${id}`),
  repeat: (data) => api.post("/api/v1/customer/booking/repeat", data),
  track: (id) => api.get(`/api/v1/customer/booking/track?id=${id}`),
  cancel: (data) => api.post("/api/v1/customer/booking/status-update", data),
  subCancel: (data) => api.post("/api/v1/customer/booking/single-repeat-cancel", data),
  request: (data) => api.post("/api/v1/customer/booking/request/send", data),
  invoiceRegular: (id) => `${BASE_URL}/admin/booking/customer-invoice/${id}`,
  invoiceRepeat: (id) => `${BASE_URL}/admin/booking/customer-fullbooking-invoice/${id}`,
  invoiceSingleRepeat: (id) => `${BASE_URL}/admin/booking/customer-fullbooking-single-invoice/${id}`,
  rebook: (data) => api.post("/api/v1/customer/rebook/cart-add", data),
  rebookAvailability: () => api.get("/api/v1/customer/rebooking-information?limit=100&offset=1"),
};

// ========================
// Review APIs
// ========================
export const ReviewAPI = {
  submitServiceReview: (data) => api.post("/api/v1/customer/review/submit", data),
  bookingReviewList: () => api.get("/api/v1/customer/review"),
};

// ========================
// Address & Location APIs
// ========================
export const LocationAPI = {
  address: () => api.get("/api/v1/customer/address"),
  zone: () => api.get("/api/v1/customer/config/get-zone-id"),
  updateZone: (data) => api.post("/api/v1/customer/update-zone", data),
  searchLocation: (query) => api.get(`/api/v1/customer/config/place-api-autocomplete?q=${query}`),
  placeDetails: (id) => api.get(`/api/v1/customer/config/place-api-details?id=${id}`),
  geocode: (lat, lng) => api.get(`/api/v1/customer/config/geocode-api?lat=${lat}&lng=${lng}`),
  zoneList: () => api.get("/api/v1/customer/service/area-availability?offset=1&limit=200"),
};

// ========================
// Coupon APIs
// ========================
export const CouponAPI = {
  list: () => api.get("/api/v1/customer/coupon?limit=100&offset=1"),
  apply: (data) => api.post("/api/v1/customer/coupon/apply", data),
  remove: () => api.post("/api/v1/customer/coupon/remove"),
};

// ========================
// Order APIs
// ========================
export const OrderAPI = {
  cancel: (data) => api.post("/api/v1/customer/order/cancel", data),
  switchPayment: (data) => api.post("/api/v1/customer/order/payment-method", data),
  details: (id) => api.get(`/api/v1/customer/order/details?order_id=${id}`),
};

// ========================
// Notifications
// ========================
export const NotificationAPI = {
  list: () => api.get("/api/v1/customer/notification"),
};

// ========================
// Campaigns
// ========================
export const CampaignAPI = {
  list: () => api.get("/api/v1/customer/campaign?limit=10&offset=1"),
};

// ========================
// Chat APIs
// ========================
export const ChatAPI = {
  createChannel: (data) => api.post("/api/v1/customer/chat/create-channel", data),
  channelList: () => api.get("/api/v1/customer/chat/channel-list"),
  searchChannel: (q) => api.get(`/api/v1/customer/chat/channel-list-search?q=${q}`),
  conversation: (id) => api.get(`/api/v1/customer/chat/conversation?id=${id}`),
  sendMessage: (data) => api.post("/api/v1/customer/chat/send-message", data),
};

// ========================
// Posts APIs
// ========================
export const PostAPI = {
  create: (data) => api.post("/api/v1/customer/post", data),
  myPosts: () => api.get("/api/v1/customer/post"),
  interestedProviders: (postId) => api.get(`/api/v1/customer/post/bid?post_id=${postId}`),
  updateStatus: (data) => api.post("/api/v1/customer/post/bid/update-status", data),
  details: (id) => api.get(`/api/v1/customer/post/details?id=${id}`),
  updateInfo: (data) => api.post("/api/v1/customer/post/update-info", data),
  providerBidDetails: (id) => api.get(`/api/v1/customer/post/bid/details?id=${id}`),
};

// ========================
// Wallet & Loyalty APIs
// ========================
export const WalletAPI = {
  convertLoyalty: (data) => api.post("/api/v1/customer/loyalty-point/wallet-transfer", data),
  loyaltyTransactions: () => api.get("/api/v1/customer/loyalty-point-transaction"),
  walletTransactions: () => api.get("/api/v1/customer/wallet-transaction"),
};

// ========================
// Providers
// ========================
export const ProviderAPI = {
  list: () => api.get("/api/v1/customer/provider/list"),
  details: (id) => api.get(`/api/v1/customer/provider-details?id=${id}`),
  bySubcategory: (id) => api.get(`/api/v1/customer/provider/list-by-sub-category?id=${id}`),
};

// ========================
// Favorites
// ========================
export const FavoriteAPI = {
  serviceList: () => api.get("/api/v1/customer/favorite/service-list"),
  removeService: (id) => api.delete(`/api/v1/customer/favorite/service-delete/${id}`),
  updateService: (data) => api.post("/api/v1/customer/favorite/service", data),
  providerList: () => api.get("/api/v1/customer/favorite/provider-list"),
  removeProvider: (id) => api.delete(`/api/v1/customer/favorite/provider-destroy/${id}`),
  updateProvider: (data) => api.post("/api/v1/customer/favorite/provider", data),
};

// ========================
// Advertisements & Misc
// ========================
export const MiscAPI = {
  advertisements: () => api.get("/api/v1/customer/advertisements/ads-list?limit=50&offset=1"),
  pages: (id) => api.get(`/api/v1/customer/config/page-details?id=${id}`),
  newsletterSubscribe: (data) => api.post("/api/v1/customer/subscribe-newsletter", data),
  addError404: (data) => api.post("/api/v1/customer/error-link", data),
  changeLanguage: (data) => api.post("/api/v1/customer/change-language", data),
};

// ========================
// Payments
// ========================
export const PaymentAPI = {
  offlineMethods: () => api.get("/api/v1/customer/offline-payment/methods?limit=100&offset=1"),
  storeOfflineData: (data) => api.post("/api/v1/customer/booking/store-offline-payment-data", data),
  switchMethod: (data) => api.post("/api/v1/customer/booking/switch-payment-method", data),
  digitalResponse: (data) => api.post("/api/v1/digital-payment-booking-response", data),
};

// ========================
// Config API
// ========================
export const ConfigAPI = {
  appConfig: () => api.get("/api/v1/customer/config"),
};


// ========================
// Helper: Token Handling
// ========================
export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("demand_token", token);
  } else {
    delete api.defaults.headers.common["Authorization"];
    localStorage.removeItem("demand_token");
  }
}

export function setZoneId(zoneId) {
  if (zoneId) {
    api.defaults.headers.common["zoneId"] = zoneId;
  } else {
    delete api.defaults.headers.common["zoneId"];
  }
}

export default api;
