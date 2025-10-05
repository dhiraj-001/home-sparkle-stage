// couponHelpers.js

/**
 * Apply a coupon code to the cart
 */
export const applyCoupon = async (couponCode) => {
  const baseUrl = import.meta.env.VITE_API_URL || "https://admin.sarvoclub.com";
  const token = localStorage.getItem("demand_token")
  if (!token) {
    throw new Error("User not authenticated")
  }

  if (!couponCode.trim()) {
    throw new Error("Coupon code is required")
  }

  try {
    const response = await fetch(
      `${baseUrl}/api/v1/customer/coupon/apply`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-localization": "en",
          zoneId: "a02c55ff-cb84-4bbb-bf91-5300d1766a29",
          guest_id: "7e223db0-9f62-11f0-bba0-779e4e64bbc8",
          "Accept-Charset": "UTF-8",
        },
        body: JSON.stringify({
          coupon_code: couponCode.trim(),
        }),
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (data.response_code.includes("200")) {
      return data
    } else {
      throw new Error(data.message || "Failed to apply coupon")
    }
  } catch (error) {
    console.error("Failed to apply coupon:", error)
    throw new Error(error.message || "An error occurred while applying coupon")
  }
}

/**
 * Remove applied coupon from the cart
 */
export const removeCoupon = async () => {
  const baseUrl = import.meta.env.VITE_API_URL || "https://admin.sarvoclub.com";
  const token = localStorage.getItem("demand_token")
  if (!token) {
    throw new Error("User not authenticated")
  }

  try {
    const response = await fetch(
      `${baseUrl}/api/v1/customer/coupon/remove`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-localization": "en",
          zoneId: "a02c55ff-cb84-4bbb-bf91-5300d1766a29",
          guest_id: "7e223db0-9f62-11f0-bba0-779e4e64bbc8",
          "Accept-Charset": "UTF-8",
        },
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (data.response_code.includes("200")) {
      return data
    } else {
      throw new Error(data.message || "Failed to remove coupon")
    }
  } catch (error) {
    console.error("Failed to remove coupon:", error)
    throw new Error(error.message || "An error occurred while removing coupon")
  }
}

/**
 * Validate coupon code without applying it
 */
export const validateCoupon = async (couponCode) => {
  const baseUrl = import.meta.env.VITE_API_URL || "https://admin.sarvoclub.com";
  const token = localStorage.getItem("demand_token")
  if (!token) {
    throw new Error("User not authenticated")
  }

  if (!couponCode.trim()) {
    throw new Error("Coupon code is required")
  }

  try {
    const response = await fetch(
      `${baseUrl}/api/v1/customer/coupon/validate`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-localization": "en",
          zoneId: "a02c55ff-cb84-4bbb-bf91-5300d1766a29",
          guest_id: "7e223db0-9f62-11f0-bba0-779e4e64bbc8",
          "Accept-Charset": "UTF-8",
        },
        body: JSON.stringify({
          coupon_code: couponCode.trim(),
        }),
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Failed to validate coupon:", error)
    throw new Error(error.message || "An error occurred while validating coupon")
  }
}

/**
 * Get available coupons for the user
 */
export const getAvailableCoupons = async () => {
  const baseUrl = import.meta.env.VITE_API_URL || "https://admin.sarvoclub.com";
  const token = localStorage.getItem("demand_token")
  if (!token) {
    throw new Error("User not authenticated")
  }

  try {
    const response = await fetch(
      `${baseUrl}/api/v1/customer/coupon/list`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-localization": "en",
          zoneId: "a02c55ff-cb84-4bbb-bf91-5300d1766a29",
          guest_id: "7e223db0-9f62-11f0-bba0-779e4e64bbc8",
          "Accept-Charset": "UTF-8",
        },
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Failed to fetch coupons:", error)
    throw new Error(error.message || "An error occurred while fetching coupons")
  }
}

/**
 * Fetch coupons for display
 */
export const fetchCoupons = async (setCoupons, setLoadingCoupons) => {
  const baseUrl = import.meta.env.VITE_API_URL || "https://admin.sarvoclub.com";
  try {
    const response = await fetch(
      `${baseUrl}/api/v1/customer/coupon?limit=100&offset=1`,
      {
        headers: {
          "Content-Type": "application/json",
          zoneId: "a02c55ff-cb84-4bbb-bf91-5300d1766a29",
          "X-localization": "en",
          guest_id: "7e223db0-9f62-11f0-bba0-779e4e64bbc8",
          "Accept-Charset": "UTF-8",
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      if (data.response_code === "default_200" && data.content) {
        setCoupons(data.content);
      }
    }
  } catch (error) {
    console.error("Failed to fetch coupons:", error);
  } finally {
    setLoadingCoupons(false);
  }
};

/**
 * Check if coupon is already applied in cart items
 */
export const isCouponApplied = (cartItems, couponCode) => {
  return cartItems.some(item => item.coupon_code === couponCode);
};

/**
 * Get total coupon discount from cart items
 */
export const getTotalCouponDiscount = (cartItems) => {
  return cartItems.reduce((total, item) => total + (item.coupon_discount || 0), 0);
};

/**
 * Get applied coupon codes from cart items
 */
export const getAppliedCouponCodes = (cartItems) => {
  const couponCodes = cartItems
    .map(item => item.coupon_code)
    .filter(code => code && code.trim() !== '');
  
  return [...new Set(couponCodes)]; // Return unique coupon codes
};