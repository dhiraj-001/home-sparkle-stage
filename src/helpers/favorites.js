const BASE_URL = import.meta.env.VITE_API_URL || "https://admin.sarvoclub.com";

export const fetchFavorites = async (token, limit = 100, offset = 1) => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/customer/favorite/service-list?offset=${offset}&limit=${limit}`, {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`,
        "zoneId": "a02c55ff-cb84-4bbb-bf91-5300d1766a29",
        "X-localization": "en",
        "guest_id": "7e223db0-9f62-11f0-bba0-779e4e64bbc8",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.response_code?.includes("200") && data.content?.data) {
      return data.content.data;
    } else {
      throw new Error(data.message || "Failed to fetch favorites");
    }
  } catch (error) {
    console.error("Error fetching favorites:", error);
    throw error;
  }
};
