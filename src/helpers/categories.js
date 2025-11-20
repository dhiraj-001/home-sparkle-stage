async function fetchCategories(offset = 1, limit = 50, token = undefined) {
  const baseUrl = import.meta.env.VITE_API_URL || "https://admin.sarvoclub.com";
  const url = `${baseUrl}/api/v1/customer/category?offset=${offset}&limit=${limit}`;

  const headers = {
    "Content-Type": "application/json; charset=UTF-8",
    zoneId: "a02c55ff-cb84-4bbb-bf91-5300d1766a29",
    "X-localization": "en",
    guest_id: "7e223db0-9f62-11f0-bba0-779e4e64bbc8",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (data.response_code === "default_200") {
      return data.content.data;
    } else {
      throw new Error(data.message || "Failed to fetch categories");
    }
  } catch (err) {
    console.error("Error fetching categories:", err);
    throw err;
  }
}

async function fetchChildCategories(categoryId, limit = 50, offset = 1, token = undefined) {
  const baseUrl = import.meta.env.VITE_API_URL || "https://admin.sarvoclub.com";
  const url = `${baseUrl}/api/v1/customer/category/childes?id=${categoryId}&limit=${limit}&offset=${offset}`;

  const headers = {
    "Content-Type": "application/json; charset=UTF-8",
    zoneId: "a02c55ff-cb84-4bbb-bf91-5300d1766a29",
    "X-localization": "en",
    guest_id: "7e223db0-9f62-11f0-bba0-779e4e64bbc8",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.response_code === "default_200") {
      return data.content.data;
    } else {
      throw new Error(data.message || "Failed to fetch categories");
    }
  } catch (err) {
    console.error("Error fetching child categories:", err);
    throw err;
  }
}

// Export the functions
export { fetchCategories, fetchChildCategories };
