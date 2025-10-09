const BASE_URL = import.meta.env.VITE_API_URL || "https://admin.sarvoclub.com";

const getHeaders = (token) => {
  const headers = {
    "Content-Type": "application/json",
    zoneId: "a02c55ff-cb84-4bbb-bf91-5300d1766a29",
    "X-localization": "en",
    "Accept-Encoding": "gzip, deflate, br",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  } else {
    headers["guest_id"] = "7e223db0-9f62-11f0-bba0-779e4e64bbc8";
  }

  return headers;
};

export const fetchAllServices = async (limit = 20, offset = 1, token = null) => {
  try {
    const response = await fetch(
      `${BASE_URL}/api/v1/customer/service?limit=${limit}&offset=${offset}`,
      {
        method: "GET",
        headers: getHeaders(token),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.response_code === "default_200") {
      return {
        data: data.content.data,
        current_page: data.content.current_page,
        last_page: data.content.last_page,
        total: data.content.total,
        per_page: data.content.per_page,
      };
    } else {
      throw new Error(data.message || "Failed to fetch services");
    }
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
