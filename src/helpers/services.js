<<<<<<< HEAD
// Service-related API helper functions

/**
 * Fetch all services with pagination
 * @param {number} page - Page number (default: 1)
 * @param {string} authToken - Optional auth token
 * @returns {Promise<Object>} API response
 */
export async function fetchAllServices(page = 1, authToken = null) {
  const baseUrl = import.meta.env.VITE_API_URL || "https://admin.sarvoclub.com";

=======
const BASE_URL = import.meta.env.VITE_API_URL || "https://admin.sarvoclub.com";

const getHeaders = (token) => {
>>>>>>> 89157855edb7361a392231d95d8427c4893a3bd1
  const headers = {
    "Content-Type": "application/json",
    zoneId: "a02c55ff-cb84-4bbb-bf91-5300d1766a29",
    "X-localization": "en",
    "Accept-Encoding": "gzip, deflate, br",
  };

<<<<<<< HEAD
  // Add authorization if token provided
  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
=======
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
>>>>>>> 89157855edb7361a392231d95d8427c4893a3bd1
  } else {
    headers["guest_id"] = "7e223db0-9f62-11f0-bba0-779e4e64bbc8";
  }

<<<<<<< HEAD
  try {
    const response = await fetch(`${baseUrl}/api/v1/customer/service?limit=20&offset=${page}`, {
      headers,
    });

    const data = await response.json();

    if (data.response_code === "default_200" && data.content.data) {
      return {
        success: true,
        services: data.content.data,
        total: data.content.total,
        perPage: data.content.per_page,
        totalPages: Math.ceil(data.content.total / data.content.per_page),
      };
    } else {
      throw new Error("Failed to fetch services");
    }
  } catch (err) {
    console.error("Error fetching services:", err);
    return {
      success: false,
      error: err.message || "Failed to load services. Please try again.",
    };
  }
}

/**
 * Fetch service details by ID
 * @param {string} serviceId - Service ID
 * @param {string} authToken - Optional auth token
 * @returns {Promise<Object>} API response
 */
export async function fetchServiceDetail(serviceId, authToken = null) {
  const baseUrl = import.meta.env.VITE_API_URL || "https://admin.sarvoclub.com";

  const headers = {
    Accept: "application/json",
    zoneId: "a02c55ff-cb84-4bbb-bf91-5300d1766a29",
    "X-localization": "en",
  };

  // Add authorization if token provided
  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  } else {
    headers["guest_id"] = "7e223db0-9f62-11f0-bba0-779e4e64bbc8";
  }

  try {
    const response = await fetch(`${baseUrl}/api/v1/customer/service/detail/${serviceId}`, {
      method: "GET",
      headers,
    });

    const data = await response.json();

    if (data.response_code === "default_200" && data.content) {
      return {
        success: true,
        service: data.content,
      };
    } else {
      throw new Error("Failed to fetch service details");
    }
  } catch (err) {
    console.error("Error fetching service details:", err);
    return {
      success: false,
      error: err.message || "Failed to load service details. Please try again.",
    };
  }
}

/**
 * Fetch services for a subcategory
 * @param {string} subcategoryId - Subcategory ID
 * @param {number} page - Page number (default: 1)
 * @param {string} authToken - Optional auth token
 * @returns {Promise<Object>} API response
 */
export async function fetchSubcategoryServices(subcategoryId, page = 1, authToken = null) {
  const baseUrl = import.meta.env.VITE_API_URL || "https://admin.sarvoclub.com";

  const headers = {
    "Content-Type": "application/json; charset=UTF-8",
    zoneId: "a02c55ff-cb84-4bbb-bf91-5300d1766a29",
    "X-localization": "en",
  };

  // Add authorization if token provided
  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  } else {
    headers["guest_id"] = "7e223db0-9f62-11f0-bba0-779e4e64bbc8";
  }

  try {
    const response = await fetch(
      `${baseUrl}/api/v1/customer/service/sub-category/${subcategoryId}?limit=12&offset=${page}`,
      {
        method: "GET",
        headers,
=======
  return headers;
};

export const fetchAllServices = async (limit = 20, offset = 1, token = null) => {
  try {
    const response = await fetch(
      `${BASE_URL}/api/v1/customer/service?limit=${limit}&offset=${offset}`,
      {
        method: "GET",
        headers: getHeaders(token),
>>>>>>> 89157855edb7361a392231d95d8427c4893a3bd1
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.response_code === "default_200") {
      return {
<<<<<<< HEAD
        success: true,
        services: data.content.data,
        currentPage: data.content.current_page,
        totalPages: data.content.last_page,
        total: data.content.total,
        category: data.content.data.length > 0 ? {
          id: data.content.data[0].category_id,
          name: data.content.data[0].category.name,
          image_full_path: data.content.data[0].category.image_full_path,
          description: data.content.data[0].category.name + " Services"
        } : null,
=======
        data: data.content.data,
        current_page: data.content.current_page,
        last_page: data.content.last_page,
        total: data.content.total,
        per_page: data.content.per_page,
>>>>>>> 89157855edb7361a392231d95d8427c4893a3bd1
      };
    } else {
      throw new Error(data.message || "Failed to fetch services");
    }
<<<<<<< HEAD
  } catch (err) {
    console.error("Error fetching subcategory services:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "An error occurred",
    };
  }
}
=======
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
};

export const fetchServiceDetail = async (serviceId, token = null) => {
  try {
    const headers = {
      Accept: "application/json",
      zoneId: "a02c55ff-cb84-4bbb-bf91-5300d1766a29",
      "X-localization": "en",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    } else {
      headers["guest_id"] = "7e223db0-9f62-11f0-bba0-779e4e64bbc8";
    }

    const response = await fetch(
      `${BASE_URL}/api/v1/customer/service/detail/${serviceId}`,
      {
        method: "GET",
        headers: headers,
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.response_code === "default_200") {
      return data.content;
    } else {
      throw new Error(data.message || "Failed to fetch service details");
    }
  } catch (error) {
    console.error("Error fetching service details:", error);
    throw error;
  }
};
>>>>>>> 89157855edb7361a392231d95d8427c4893a3bd1
