// This file holds all the configuration for your app.
// Instead of typing "https://admin.sarvoclub.com" everywhere, you just use `config.baseUrl`.

// ## SECTION 1: CORE APP & SERVER INFO ##
// Basic details about your application and where its backend server is located.
export const config = {
  appName: 'Sarvo Club',
  appVersion: '3.3',
  baseUrl: import.meta.env?.VITE_API_URL || 'https://admin.sarvoclub.com',
  // A flag used during development to bypass a "maintenance mode" screen
  avoidMaintenanceMode: false,
};

// ## SECTION 2: API ENDPOINTS ##
// These are the specific paths you add to the `baseUrl` to fetch or send data.
export const apiEndpoints = {
  // --- General Config & Content ---
  appConfig: '/api/v1/customer/config',
  webLandingContents: '/api/v1/customer/landing/contents',
  banners: '/api/v1/customer/banner?limit=10&offset=1',
  bonuses: '/api/v1/customer/bonus-list?limit=100&offset=1',
  campaigns: '/api/v1/customer/campaign?limit=10&offset=1',
  itemsByCampaignId: '/api/v1/customer/campaign/data/items?campaign_id=',
  pages: '/api/v1/customer/config/page-details',
  advertisements: '/api/v1/customer/advertisements/ads-list?limit=50&offset=1',
  newsletterSubscription: '/api/v1/customer/subscribe-newsletter',

  // --- Authentication ---
  register: '/api/v1/customer/auth/registration',
  registerWithSocialMedia: '/api/v1/customer/auth/registration-with-social-media',
  login: '/api/v1/customer/auth/login',
  logout: '/api/v1/customer/auth/logout',
  socialLogin: '/api/v1/customer/auth/social-login',
  existingAccountCheck: '/api/v1/customer/auth/existing-account-check',

  // --- OTP & Password Reset ---
  sendOtpForVerification: '/api/v1/user/verification/send-otp',
  sendOtpForForgetPassword: '/api/v1/user/forget-password/send-otp',
  verifyOtpForForgetPassword: '/api/v1/user/forget-password/verify-otp',
  verifyOtpForVerification: '/api/v1/user/verification/verify-otp',
  phoneOtpVerification: '/api/v1/user/verification/login-otp-verify',
  firebaseOtpVerify: '/api/v1/user/verification/firebase-auth-verify',
  registerWithOtp: '/api/v1/user/verification/registration-with-otp',
  resetPassword: '/api/v1/user/forget-password/reset',
  checkExistingUser: '/api/v1/user/check-existing-customer',

  // --- Services, Categories & Subcategories ---
  categories: '/api/v1/customer/category?limit=20',
  subcategories: '/api/v1/customer/category/childes?limit=20&offset=1&id=',
  allServices: '/api/v1/customer/service',
  popularServices: '/api/v1/customer/service/popular',
  trendingServices: '/api/v1/customer/service/trending',
  recentlyViewedServices: '/api/v1/customer/service/recently-viewed',
  recommendedServices: '/api/v1/customer/service/recommended',
  offerServices: '/api/v1/customer/service/offers',
  servicesBySubcategory: '/api/v1/customer/service/sub-category/',
  serviceDetails: '/api/v1/customer/service/detail',
  serviceReviews: '/api/v1/customer/service/review/',
  featuredCategoryServices: '/api/v1/customer/featured-categories?limit=100&offset=1',
  submitNewServiceRequest: '/api/v1/customer/service/request/make',
  getSuggestedServiceList: '/api/v1/customer/service/request/list',

  // --- Cart ---
  addToCart: '/api/v1/customer/cart/add',
  getCart: '/api/v1/customer/cart/list?limit=100&offset=1',
  removeCartItem: '/api/v1/customer/cart/remove/',
  emptyCart: '/api/v1/customer/cart/data/empty',
  updateCartQuantity: '/api/v1/customer/cart/update-quantity/',
  updateCartProvider: '/api/v1/customer/cart/update/provider',
  getCartOtherInfo: '/api/v1/customer/cart/other-info',

  // --- Booking & Invoices ---
  bookingList: '/api/v1/customer/booking',
  bookingDetails: '/api/v1/customer/booking',
  subBookingDetails: '/api/v1/customer/booking/single',
  repeatBookingDetails: '/api/v1/customer/booking/repeat',
  trackBooking: '/api/v1/customer/booking/track',
  cancelBooking: '/api/v1/customer/booking/status-update',
  cancelSubBooking: '/api/v1/customer/booking/single-repeat-cancel',
  placeBookingRequest: '/api/v1/customer/booking/request/send',
  rebook: '/api/v1/customer/rebook/cart-add',
  rebookingAvailability: '/api/v1/customer/rebooking-information?limit=100&offset=1',
  regularBookingInvoice: '/admin/booking/customer-invoice/',
  repeatBookingInvoice: '/admin/booking/customer-fullbooking-invoice/',
  singleRepeatBookingInvoice: '/admin/booking/customer-fullbooking-single-invoice/',

  // --- Reviews ---
  submitServiceReview: '/api/v1/customer/review/submit',
  bookingReviewList: '/api/v1/customer/review',

  // --- User Profile, Wallet & Points ---
  userInfo: '/api/v1/customer/info',
  updateProfile: '/api/v1/customer/update/profile',
  deleteAccount: '/api/v1/customer/remove-account',
  updateFcmToken: '/api/v1/customer/update/fcm-token',
  loyaltyPointTransactions: '/api/v1/customer/loyalty-point-transaction',
  walletTransactions: '/api/v1/customer/wallet-transaction',
  convertLoyaltyPoints: '/api/v1/customer/loyalty-point/wallet-transfer',
  changeLanguage: '/api/v1/customer/change-language',

  // --- Favorites ---
  favoriteServices: '/api/v1/customer/favorite/service-list',
  removeFavoriteService: "/api/v1/customer/favorite/service-delete",
  updateFavoriteService: "/api/v1/customer/favorite/service",
  favoriteProviders: '/api/v1/customer/favorite/provider-list',
  removeFavoriteProvider: "/api/v1/customer/favorite/provider-destroy",
  updateFavoriteProvider: "/api/v1/customer/favorite/provider",

  // --- Providers ---
  providers: '/api/v1/customer/provider/list',
  providerDetails: '/api/v1/customer/provider-details',
  providersBySubcategory: '/api/v1/customer/provider/list-by-sub-category',

  // --- Location & Zone ---
  addresses: '/api/v1/customer/address',
  getZoneId: '/api/v1/customer/config/get-zone-id',
  updateZone: '/api/v1/customer/update-zone',
  getZoneList: '/api/v1/customer/service/area-availability?offset=1&limit=200',
  searchLocation: '/api/v1/customer/config/place-api-autocomplete',
  placeDetails: '/api/v1/customer/config/place-api-details',
  geocode: '/api/v1/customer/config/geocode-api',

  // --- Search ---
  search: '/api/v1/customer/service/search',
  searchSuggestion: '/api/v1/customer/service/search-suggestion',
  recommendedSearches: '/api/v1/customer/service/search/recommended',
  suggestedSearchKeywords: '/api/v1/customer/recently-searched-keywords',
  removeSuggestedSearchKeywords: '/api/v1/customer/remove-searched-keywords',

  // --- Coupons ---
  coupons: '/api/v1/customer/coupon?limit=100&offset=1',
  applyCoupon: '/api/v1/customer/coupon/apply',
  removeCoupon: '/api/v1/customer/coupon/remove',

  // --- Chat ---
  createChannel: '/api/v1/customer/chat/create-channel',
  getChannelList: '/api/v1/customer/chat/channel-list',
  searchChannelList: '/api/v1/customer/chat/channel-list-search',
  getConversation: '/api/v1/customer/chat/conversation',
  sendMessage: '/api/v1/customer/chat/send-message',

  // --- Custom Posts & Bids ---
  createPost: '/api/v1/customer/post',
  getMyPosts: '/api/v1/customer/post',
  getPostDetails: '/api/v1/customer/post/details',
  updatePost: '/api/v1/customer/post/update-info',
  interestedProvidersForPost: '/api/v1/customer/post/bid',
  updatePostBidStatus: '/api/v1/customer/post/bid/update-status',
  providerBidDetails: '/api/v1/customer/post/bid/details',

  // --- Payment ---
  offlinePaymentMethods: '/api/v1/customer/offline-payment/methods?limit=100&offset=1',
  storeOfflinePayment: '/api/v1/customer/booking/store-offline-payment-data',
  switchPaymentMethod: '/api/v1/customer/booking/switch-payment-method',
  digitalPaymentResponse: '/api/v1/digital-payment-booking-response',
};

// ## SECTION 3: LOCAL STORAGE KEYS ##
// These are the "names" or "keys" you use to save data in the user's browser.
// Using constants prevents typos!
export const storageKeys = {
  TOKEN: 'demand_token',
  GUEST_ID: 'guest_id',
  THEME: 'demand_theme',
  USER_ADDRESS: 'demand_user_address',
  USER_NUMBER: 'demand_user_number',
  USER_COUNTRY_CODE: 'demand_user_country_code',
  USER_PASSWORD: 'demand_user_password', // For auto-fill, use with caution
  ZONE_ID: 'zoneId',
  LANGUAGE_CODE: 'demand_language_code',
  COUNTRY_CODE: 'demand_country_code',
  NOTIFICATION_KEY: 'demand_notification',
  NOTIFICATION_COUNT: 'demand_notification_count',
  SEARCH_HISTORY: 'demand_search_history',
  ONBOARDING_SCREEN: 'onboarding_screen',
  ACCEPT_COOKIES: 'demand_accept_cookies',
  COOKIES_MANAGEMENT: 'cookies_management',
  WALLET_ACCESS_TOKEN: 'wallet_access_token',
  LAST_INCOMPLETE_OFFLINE_BOOKING: 'last_incomplete_offline_booking_id',
};

// ## SECTION 4: APP RULES & STATIC DATA ##
// Fixed values that control app behavior or display static content.
export const appRules = {
  // Image and File Uploads
  maxImageUploadSizeMB: 2,
  maxIdentityImages: 2,

  // Chat
  maxConversationFileSizeMB: 25,
  maxTotalFilesToSend: 5,
  maxSingleChatFileSizeMB: 10,

  // Inputs
  walletInputLength: 10,
};

// Data for building UI elements, like a language selector or filter menus.
export const staticData = {
  languages: [
    { imageUrl: '/images/flags/us.png', name: 'English', countryCode: 'US', code: 'en' },
    { imageUrl: '/images/flags/sa.png', name: 'عربى', countryCode: 'SA', code: 'ar' },
    { imageUrl: '/images/flags/bd.png', name: 'বাংলা', countryCode: 'BD', code: 'bn' },
    { imageUrl: '/images/flags/in.png', name: 'Hindi', countryCode: 'IN', code: 'hi' },
  ],
  walletTransactionFilters: [
    { title: 'all_transactions', value: '' },
    { title: 'booking_transaction', value: 'wallet_payment' },
    { title: 'converted_from_loyalty_point', value: 'loyalty_point_earning' },
    { title: 'added_via_payment_method', value: 'add_fund' },
    { title: 'earned_by_bonus', value: 'add_fund_bonus' },
    { title: 'earned_by_referral', value: 'referral_earning' },
    { title: 'admin_fund', value: 'fund_by_admin' },
    { title: 'refund', value: 'booking_refund' },
  ],
};