/**
 * A helper function to add a service to the user's cart.
 * It handles both authenticated users and guest users.
 *
 * @async
 * @param {object} cartItemDetails - The details of the item to add.
 * @param {string} cartItemDetails.serviceId - The ID of the service.
 * @param {string} cartItemDetails.categoryId - The ID of the parent category.
 * @param {string} cartItemDetails.subCategoryId - The ID of the sub-category.
 * @param {string} cartItemDetails.variantKey - The specific variant key for the service (e.g., "2-ACs-pack").
 * @param {number} cartItemDetails.quantity - The quantity of the service to add.
 * @param {string} [cartItemDetails.authToken] - The user's authentication token (for logged-in users).
 * @param {string} [cartItemDetails.guestId] - The guest user's unique ID (for users who are not logged in).
 * @returns {Promise<{success: boolean, data: object|null, error: string|null}>} An object indicating success or failure.
 */
export async function addToCart({
  serviceId,
  categoryId,
  subCategoryId,
  variantKey,
  quantity,
  authToken,
  guestId="7e223db0-9f62-11f0-bba0-779e4e64bbc8",
}) {
  // 1. Define the base URL and endpoint
  const baseUrl = import.meta.env.VITE_API_URL || "https://admin.sarvoclub.com";
  const endpoint = "/api/v1/customer/cart/add";

  // 2. Prepare the request headers
  const headers = {
    // This is crucial to prevent the server from redirecting to a login page
    "Accept": "application/json",
    "Content-Type": "application/json; charset=UTF-8",
    // These should be dynamically set based on your app's context
    "zoneId": "a02c55ff-cb84-4bbb-bf91-5300d1766a29",
    "X-localization": "en",
  };

  // 3. Conditionally add authentication (either token or guest_id)
  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  } else if (guestId) {
    headers["guest_id"] = guestId;
  } else {
    // If neither token nor guestId is provided, the call will likely fail for a user-specific cart.
    console.error("Authentication missing: Please provide either an authToken or a guestId.");
    return {
      success: false,
      data: null,
      error: "Authentication missing."
    };
  }

  // 4. Prepare the request body
  const body = JSON.stringify({
    service_id: serviceId,
    category_id: categoryId,
    sub_category_id: subCategoryId,
    variant_key: variantKey,
    quantity: quantity,
  });


  // 5. Make the API call and handle the response
  try {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: "POST",
      headers: headers,
      body: body,
    });

    const responseData = await response.json();

    if (!response.ok) {
      // If the server returns an error (e.g., 4xx or 5xx)
      throw new Error(responseData.message || `HTTP error! Status: ${response.status}`);
    }

    // Return a success object with the response data
    return {
      success: true,
      data: responseData,
      error: null
    };

  } catch (error) {
    console.error("Failed to add item to cart:", error);
    // Return a failure object with the error message
    return {
      success: false,
      data: null,
      error: error.message
    };
  }
}

// --- HOW TO USE THE FUNCTION ---

// Example for a GUEST user:
async function addGuestCartItem() {
  const result = await addToCart({
    serviceId: "039aa073-d10a-4ab6-b9be-e4f4c31a35b5",
    categoryId: "5c5984f7-ec6f-4d38-b282-ad1af20e9d1f",
    subCategoryId: "4f93e340-afac-44f7-a76c-90cc77b63513",
    variantKey: "2-ACs-pack",
    quantity: 1,
    guestId: "some-unique-guest-id-12345" // Get this from localStorage or generate it
  });

  if (result.success) {
    console.log("Guest item added successfully!", result.data);
    // You can now show a success message to the user
  } else {
    console.error("Error adding guest item:", result.error);
    // Show an error message
  }
}


// Example for a LOGGED-IN user:
async function addAuthUserCartItem() {
  const userToken = "eyJ0eXAiOiJKV1QiLCJ..."; // Get this from localStorage after login

  const result = await addToCart({
    serviceId: "039aa073-d10a-4ab6-b9be-e4f4c31a35b5",
    categoryId: "5c5984f7-ec6f-4d38-b282-ad1af20e9d1f",
    subCategoryId: "4f93e340-afac-44f7-a76c-90cc77b63513",
    variantKey: "1ACs-pack",
    quantity: 1,
    authToken: userToken
  });

  if (result.success) {
    console.log("Authenticated user item added successfully!", result.data);
    // Refresh the cart display or show a success toast
  } else {
    console.error("Error adding item for logged-in user:", result.error);
    // Handle the error, e.g., show an error modal
  }
}

// You can call these functions when a user clicks an "Add to Cart" button.
// addGuestCartItem();
// addAuthUserCartItem();
