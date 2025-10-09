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

export const fetchCartItems = async (token = null) => {
  try {
    const response = await fetch(
      `${BASE_URL}/api/v1/customer/cart/list?limit=100&offset=1`,
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
      return data.content;
    } else {
      throw new Error(data.message || "Failed to fetch cart items");
    }
  } catch (error) {
    console.error("Error fetching cart items:", error);
    throw error;
  }
};

export const updateCartQuantity = async (itemId, quantity, token) => {
  try {
    const response = await fetch(
      `${BASE_URL}/api/v1/customer/cart/update-quantity/${itemId}`,
      {
        method: "PUT",
        headers: {
          ...getHeaders(token),
          "Accept-Charset": "UTF-8",
        },
        body: JSON.stringify({
          quantity: quantity,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.response_code === "default_update_200") {
      return data;
    } else {
      throw new Error(data.message || "Failed to update quantity");
    }
  } catch (error) {
    console.error("Error updating cart quantity:", error);
    throw error;
  }
};

export const removeCartItem = async (itemId, token) => {
  try {
    const response = await fetch(
      `${BASE_URL}/api/v1/customer/cart/remove/${itemId}`,
      {
        method: "DELETE",
        headers: {
          ...getHeaders(token),
          "Accept-Charset": "UTF-8",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.response_code === "default_delete_200") {
      return data;
    } else {
      throw new Error(data.message || "Failed to remove item");
    }
  } catch (error) {
    console.error("Error removing cart item:", error);
    throw error;
  }
};
