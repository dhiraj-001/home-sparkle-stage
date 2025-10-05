export const toggleFavorite = async (serviceId, authToken) => {
  if (!authToken) {
    throw new Error("Authentication required");
  }

  const baseUrl = import.meta.env.VITE_API_URL || "https://admin.sarvoclub.com";
  const response = await fetch(`${baseUrl}/api/v1/customer/favorite/service`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({ service_id: serviceId }),
  });

  const data = await response.json();

  // Check if response code contains "200" anywhere in the string
  if (!response.ok || !data.response_code?.includes("200")) {
    throw new Error(data.message || "Failed to update favorite status");
  }

  return data;
};