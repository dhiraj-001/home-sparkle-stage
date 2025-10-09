const BASE_URL = import.meta.env.VITE_API_URL || "https://admin.sarvoclub.com";

export const fetchUserInfo = async (token = null) => {
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
      `${BASE_URL}/api/v1/customer/info`,
      {
        method: "GET",
        headers: headers,
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.response_code === "default_200" && data.content) {
      return data.content;
    } else {
      throw new Error(data.message || "Failed to fetch user data");
    }
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw error;
  }
};

export const logoutUser = async (token) => {
  try {
    const response = await fetch(
      `${BASE_URL}/api/v1/customer/auth/logout`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};

export const deleteUserAccount = async (token) => {
  try {
    const response = await fetch(
      `${BASE_URL}/api/v1/customer/remove-account`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Failed to delete account");
    }

    return true;
  } catch (error) {
    console.error("Error deleting account:", error);
    throw error;
  }
};

export const updateUserProfile = async (formData, token) => {
  try {
    const body = new FormData();
    body.append("first_name", formData.first_name);
    body.append("last_name", formData.last_name);
    body.append("email", formData.email);
    body.append("phone", formData.phone);
    body.append("identification_type", formData.identification_type);
    body.append("identification_number", formData.identification_number || "");
    body.append("date_of_birth", formData.date_of_birth || "");
    body.append("gender", formData.gender);
    if (formData.profileImage) {
      body.append("profile_image", formData.profileImage);
    }
    body.append("_method", "PUT");

    const response = await fetch(
      `${BASE_URL}/api/v1/customer/update/profile`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          zoneId: "a02c55ff-cb84-4bbb-bf91-5300d1766a29",
          "X-localization": "en",
        },
        body: body,
      }
    );

    const data = await response.json();

    if (response.ok && data.response_code === "default_update_200") {
      return data.content;
    } else {
      throw new Error(data.message || "Failed to update profile");
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};
