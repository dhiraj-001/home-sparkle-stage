const BASE_URL = import.meta.env.VITE_API_URL || "https://admin.sarvoclub.com";

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string | null;
  profile_image: string | null;
  profile_image_full_path: string | null;
  is_phone_verified: number;
  is_email_verified: number;
  wallet_balance: number;
  loyalty_point: number;
  ref_code: string | null;
  bookings_count: number;
  created_at: string;
  date_of_birth: string | null;
  identification_number: string | null;
}

export const fetchUserInfo = async (token: string | null = null): Promise<User> => {
  try {
    const headers: Record<string, string> = {
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

export const logoutUser = async (token: string): Promise<boolean> => {
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

export const deleteUserAccount = async (token: string): Promise<boolean> => {
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

export const updateUserProfile = async (formData: FormData, token: string): Promise<User> => {
  try {
    const response = await fetch(
      `${BASE_URL}/api/v1/customer/update/profile`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          zoneId: "a02c55ff-cb84-4bbb-bf91-5300d1766a29",
          "X-localization": "en",
        },
        body: formData,
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
