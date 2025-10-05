

async function fetchCategories(offset = 1, limit = 10) {
  const baseUrl = import.meta.env.VITE_API_URL || "https://admin.sarvoclub.com";
  const url = `${baseUrl}/api/v1/customer/category?offset=${offset}&limit=${limit}`;

  const headers = {
    "Content-Type": "application/json; charset=UTF-8",
    "zoneId": "a02c55ff-cb84-4bbb-bf91-5300d1766a29", // replace with dynamic zoneId if needed
    "X-localization": "en",
    "guest_id": "7e223db0-9f62-11f0-bba0-779e4e64bbc8", // replace with actual guest_id
    // "Authorization": `Bearer ${token}`  // only include if user is logged in
  };

  try {
    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error fetching categories:", err.message);
    return null;
  }
}

// Example usage
fetchCategories().then(data => {
  console.log("Categories:", data);
});
