const BASE_URL = import.meta.env.VITE_API_URL || "https://admin.sarvoclub.com";

export const fetchBannerList = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/customer/banner/list`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.response_code === "default_200" && data.content.data) {
      return data.content.data;
    } else {
      throw new Error(data.message || "Failed to fetch banner list");
    }
  } catch (error) {
    console.error("Error fetching banner list:", error);
    throw error;
  }
};

export const fetchBannerDetail = async (type, id) => {
  try {
    const banners = await fetchBannerList();
    const banner = banners.find(
      (item) => item.resource_id === id && item.resource_type === type
    );

    if (!banner) {
      throw new Error("Banner not found");
    }

    return banner;
  } catch (error) {
    console.error("Error fetching banner detail:", error);
    throw error;
  }
};
