const sendBookingRequest = async (config) => {
  const {
    authorization,
    bookingData,
    additionalHeaders = {},
    baseURL = 'https://your-base-url.com' // Replace with actual base URL
  } = config;

  // Validate required parameters
  if (!authorization) {
    throw new Error('Authorization token is required');
  }

  if (!bookingData) {
    throw new Error('Booking data is required');
  }

  // Required fields validation
  const requiredFields = [
    'payment_method',
    'zone_id',
    'service_schedule',
    'service_address_id',
    'guest_id',
    'service_address',
    'is_partial',
    'service_type',
    'booking_type',
    'service_location'
  ];

  for (const field of requiredFields) {
    if (!bookingData[field] && bookingData[field] !== 0) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  // Validate service_address object
  const serviceAddressRequired = [
    'address_type',
    'address_label',
    'contact_person_name',
    'contact_person_number',
    'address',
    'lat',
    'lon',
    'zone_id'
  ];

  for (const field of serviceAddressRequired) {
    if (!bookingData.service_address[field] && bookingData.service_address[field] !== 0) {
      throw new Error(`Missing required service_address field: ${field}`);
    }
  }

  try {
    const response = await fetch(`${baseURL}/api/v1/customer/booking/request/send`, {
      method: 'POST',
      headers: {
        'Authorization': authorization,
        'Content-Type': 'application/json',
        ...additionalHeaders
      },
      body: JSON.stringify(bookingData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Booking request failed:', error);
    throw error;
  }
};

// Alternative simplified version with default values
const createBookingData = (overrides = {}) => {
  const defaultBookingData = {
    payment_method: "cash_after_service",
    zone_id: "",
    service_schedule: "",
    service_address_id: "0",
    guest_id: "",
    service_address: {
      id: "null",
      address_type: "others",
      address_label: "home",
      contact_person_name: "",
      contact_person_number: "",
      address: "",
      lat: "",
      lon: "",
      city: "",
      zip_code: "",
      country: "",
      zone_id: "",
      method: null,
      street: "",
      house: "",
      floor: null,
      available_service_count: 16
    },
    is_partial: 0,
    service_type: "regular",
    booking_type: "daily",
    dates: null,
    new_user_info: null,
    service_location: "customer"
  };

  // Deep merge for nested objects
  return {
    ...defaultBookingData,
    ...overrides,
    service_address: {
      ...defaultBookingData.service_address,
      ...overrides.service_address
    }
  };
};

// Example usage:
/*
const bookingConfig = {
  authorization: 'Bearer your-token-here',
  baseURL: 'https://api.example.com',
  bookingData: createBookingData({
    zone_id: 'a02c55ff-cb84-4bbb-bf91-5300d176ea29',
    service_schedule: '2025-10-04 15:40:02',
    guest_id: 'f57e4db0-a00c-1110-a35f-c5a8c7693b75',
    service_address: {
      contact_person_name: 'Hii Vibhuti',
      contact_person_number: '+916397890085',
      address: 'Unknown Location Found',
      lat: '29.4551971',
      lon: '77.7023243',
      zone_id: 'a02c55ff-cb84-4bbb-bf91-5300d176ea29'
    }
  })
};
*/

export { sendBookingRequest, createBookingData };
