"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { sendBookingRequest } from "@/helpers/bookinghelper"
import { MapPin, Calendar, CreditCard, User, CheckCircle2, Loader2, Navigation, ChevronDown } from "lucide-react"

interface CartItem {
  id: string
  customer_id: string
  provider_id: string | null
  service_id: string
  category_id: string
  sub_category_id: string
  variant_key: string
  service_cost: number
  quantity: number
  discount_amount: number
  coupon_code: string | null
  coupon_discount: number
  campaign_discount: number
  tax_amount: number
  total_cost: number
  created_at: string
  updated_at: string
  is_guest: number
  coupon_id: string
  service: {
    id: string
    name: string
    short_description: string
    description: string
    thumbnail_full_path: string
    cover_image_full_path: string
  }
  category: {
    id: string
    name: string
    image_full_path: string
  }
}

interface CartResponse {
  response_code: string
  message: string
  content: {
    total_cost: number
    referral_amount: number
    wallet_balance: number
    cart: {
      current_page: number
      data: CartItem[]
      first_page_url: string
      from: number
      last_page: number
      last_page_url: string
      links: Array<{
        url: string | null
        label: string
        active: boolean
      }>
      next_page_url: string | null
      path: string
      per_page: number
      prev_page_url: string | null
      to: number
      total: number
    }
  }
  errors: string[]
}

interface AddressForm {
  address_type: string
  address_label: string
  contact_person_name: string
  contact_person_number: string
  address: string
  lat: string
  lon: string
  city: string
  zip_code: string
  country: string
  street: string
  house: string
  floor: string
}

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const baseUrl = import.meta.env.VITE_API_URL || "https://admin.sarvoclub.com"
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const [cartLoading, setCartLoading] = useState(true)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [gettingLocation, setGettingLocation] = useState(false)

  // Country code options (same as Login.tsx)
  const countryCodes = [
    { code: "+91", country: "India", flag: "🇮🇳" },
    { code: "+1", country: "USA", flag: "🇺🇸" },
    { code: "+44", country: "UK", flag: "🇬🇧" },
    { code: "+61", country: "Australia", flag: "🇦🇺" },
    { code: "+65", country: "Singapore", flag: "🇸🇬" },
    { code: "+971", country: "UAE", flag: "🇦🇪" },
    { code: "+86", country: "China", flag: "🇨🇳" },
    { code: "+81", country: "Japan", flag: "🇯🇵" },
    { code: "+82", country: "South Korea", flag: "🇰🇷" },
    { code: "+33", country: "France", flag: "🇫🇷" },
    { code: "+49", country: "Germany", flag: "🇩🇪" },
  ]

  const [selectedCountryCode, setSelectedCountryCode] = useState("+91")
  const [showCountryDropdown, setShowCountryDropdown] = useState(false)

  const [addressForm, setAddressForm] = useState<AddressForm>({
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
    street: "",
    house: "",
    floor: "",
  })

  const [serviceSchedule, setServiceSchedule] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("cash_after_service")

  // Function to handle country selection in dropdown
  const handleCountrySelect = (countryCode: string) => {
    setSelectedCountryCode(countryCode)
    setShowCountryDropdown(false)
  }

  const fetchCartItems = async () => {
    const token = localStorage.getItem("demand_token")
    if (!token) {
      toast({
        title: "Not Logged In",
        description: "Please login to view your cart.",
        variant: "destructive",
      })
      setTimeout(() => navigate("/login"), 2000)
      return
    }

    try {
      setCartLoading(true)
      const response = await fetch(
        `${baseUrl}/api/v1/customer/cart/list?limit=100&offset=1`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "X-localization": "en",
            zoneId: "a02c55ff-cb84-4bbb-bf91-5300d1766a29",
            guest_id: "7e223db0-9f62-11f0-bba0-779e4e64bbc8",
            "Accept-Charset": "UTF-8",
          },
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: CartResponse = await response.json()

      if (data.response_code.includes("200")) {
        setCartItems(data.content.cart.data)
        if (data.content.cart.data.length === 0) {
          toast({
            title: "Empty Cart",
            description: "Your cart is empty. Redirecting...",
            variant: "destructive",
          })
          setTimeout(() => navigate("/cart"), 2000)
        }
      } else {
        throw new Error(data.message || "Failed to fetch cart data")
      }
    } catch (err: any) {
      console.error("Failed to fetch cart data:", err)
      toast({
        title: "Error",
        description: err.message || "An error occurred while fetching cart data",
        variant: "destructive",
      })
      setTimeout(() => navigate("/cart"), 2000)
    } finally {
      setCartLoading(false)
    }
  }

  useEffect(() => {
    fetchCartItems()
  }, [navigate, toast])

  const handleInputChange = (field: keyof AddressForm, value: string) => {
    setAddressForm((prev) => ({ ...prev, [field]: value }))
  }

  const getCurrentLocation = () => {
    setGettingLocation(true)
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setAddressForm((prev) => ({
            ...prev,
            lat: position.coords.latitude.toString(),
            lon: position.coords.longitude.toString(),
          }))
          toast({
            title: "Location Retrieved",
            description: "Your current location has been set.",
          })
          setGettingLocation(false)
        },
        (error) => {
          toast({
            title: "Location Error",
            description: "Unable to retrieve your location. Please enter manually.",
            variant: "destructive",
          })
          setGettingLocation(false)
        },
      )
    } else {
      toast({
        title: "Not Supported",
        description: "Geolocation is not supported by your browser.",
        variant: "destructive",
      })
      setGettingLocation(false)
    }
  }

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.total_cost, 0)
  }

  const validateForm = () => {
    if (!addressForm.contact_person_name.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter contact person name.",
        variant: "destructive",
      })
      return false
    }
    if (!addressForm.contact_person_number.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter contact person number.",
        variant: "destructive",
      })
      return false
    }
    if (!addressForm.address.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter your address.",
        variant: "destructive",
      })
      return false
    }
    if (!addressForm.lat || !addressForm.lon) {
      toast({
        title: "Validation Error",
        description: "Please provide location coordinates.",
        variant: "destructive",
      })
      return false
    }
    if (!serviceSchedule) {
      toast({
        title: "Validation Error",
        description: "Please select a service schedule.",
        variant: "destructive",
      })
      return false
    }
    return true
  }

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    setLoading(true);

    const token = localStorage.getItem("demand_token");
    if (!token) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to place an order.",
        variant: "destructive",
      });
      setLoading(false);
      navigate("/login");
      return;
    }

    try {
      const baseUrl = import.meta.env.VITE_API_URL || "https://admin.sarvoclub.com";
      const zoneId = "a02c55ff-cb84-4bbb-bf91-5300d1766a29";
      const guestId = "7e223db0-9f62-11f0-bba0-779e4e64bbc8";

      const bookingData = {
        payment_method: paymentMethod,
        zone_id: zoneId,
        service_schedule: serviceSchedule,
        service_address_id: "0", // New address
        guest_id: guestId,
        service_address: {
          id: "null",
          address_type: addressForm.address_type,
          address_label: addressForm.address_label,
          contact_person_name: addressForm.contact_person_name,
          contact_person_number: `${selectedCountryCode}${addressForm.contact_person_number}`,
          address: addressForm.address,
          lat: addressForm.lat,
          lon: addressForm.lon,
          city: addressForm.city,
          zip_code: addressForm.zip_code,
          country: addressForm.country,
          zone_id: zoneId,
          _method: null,
          street: addressForm.street,
          house: addressForm.house,
          floor: addressForm.floor,
          available_service_count: cartItems.length,
        },
        is_partial: 0,
        service_type: "regular",
        booking_type: "daily",
        dates: null,
        new_user_info: null,
        service_location: "customer",
      };

      const bookingConfig = {
        authorization: `Bearer ${token}`,
        baseURL: baseUrl,
        bookingData: bookingData,
        additionalHeaders: {
          "X-localization": "en",
          zoneId: zoneId,
          guest_id: guestId,
          "Accept-Charset": "UTF-8",
        },
      };

      const response = await sendBookingRequest(bookingConfig);

      if (response.response_code.include("200") || response.response_code === "200") {
        setBookingSuccess(true);
        // Clear cart
        localStorage.removeItem("cart");
        toast({
          title: "Booking Successful!",
          description: "Your service has been booked successfully.",
        });
        // Redirect after 3 seconds
        setTimeout(() => {
          navigate("/bookings");
        }, 3000);
      } else {
        throw new Error(response.message || "Booking failed");
      }
    } catch (error: any) {
      toast({
        title: "Booking Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (bookingSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <CheckCircle2 className="w-24 h-24 text-green-500 mx-auto mb-6" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600 mb-4">
            Your service has been booked successfully. Redirecting to your bookings...
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Redirecting...</span>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your booking details</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contact_name">Contact Person Name *</Label>
                      <Input
                        id="contact_name"
                        placeholder="Enter full name"
                        value={addressForm.contact_person_name}
                        onChange={(e) => handleInputChange("contact_person_name", e.target.value)}
                      />
                    </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact_number">Contact Number *</Label>
                    <div className="flex">
                      {/* Country Code Dropdown */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                          className="flex items-center gap-1 h-11 px-3 rounded-l-md border border-r-0 border-input bg-muted text-sm text-muted-foreground hover:bg-muted/80 transition-colors"
                        >
                          <span>{countryCodes.find(c => c.code === selectedCountryCode)?.flag}</span>
                          <span>{selectedCountryCode}</span>
                          <ChevronDown className="h-4 w-4 opacity-50" />
                        </button>

                        {showCountryDropdown && (
                          <div className="absolute top-full left-0 mt-1 w-48 max-h-60 overflow-y-auto bg-background border border-input rounded-md shadow-lg z-10">
                            {countryCodes.map((country) => (
                              <button
                                key={country.code}
                                type="button"
                                onClick={() => handleCountrySelect(country.code)}
                                className={`flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted transition-colors ${
                                  selectedCountryCode === country.code ? 'bg-primary/10 text-primary' : ''
                                }`}
                              >
                                <span className="text-base">{country.flag}</span>
                                <span className="flex-1 text-left">{country.country}</span>
                                <span className="text-muted-foreground">{country.code}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <Input
                        id="contact_number"
                        type="tel"
                        placeholder="1234567890"
                        value={addressForm.contact_person_number}
                        onChange={(e) => handleInputChange("contact_person_number", e.target.value)}
                        className="h-11 rounded-l-none transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Service Address */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Service Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="address_type">Address Type</Label>
                      <Select
                        value={addressForm.address_type}
                        onValueChange={(value) => handleInputChange("address_type", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="home">Home</SelectItem>
                          <SelectItem value="office">Office</SelectItem>
                          <SelectItem value="others">Others</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address_label">Address Label</Label>
                      <Input
                        id="address_label"
                        placeholder="e.g., Home, Office"
                        value={addressForm.address_label}
                        onChange={(e) => handleInputChange("address_label", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Full Address *</Label>
                    <Textarea
                      id="address"
                      placeholder="Enter your complete address"
                      value={addressForm.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="street">Street</Label>
                      <Input
                        id="street"
                        placeholder="Street name"
                        value={addressForm.street}
                        onChange={(e) => handleInputChange("street", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="house">House/Building</Label>
                      <Input
                        id="house"
                        placeholder="House number"
                        value={addressForm.house}
                        onChange={(e) => handleInputChange("house", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="floor">Floor</Label>
                      <Input
                        id="floor"
                        placeholder="Floor number"
                        value={addressForm.floor}
                        onChange={(e) => handleInputChange("floor", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        placeholder="City"
                        value={addressForm.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zip_code">Zip Code</Label>
                      <Input
                        id="zip_code"
                        placeholder="Zip code"
                        value={addressForm.zip_code}
                        onChange={(e) => handleInputChange("zip_code", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        placeholder="Country"
                        value={addressForm.country}
                        onChange={(e) => handleInputChange("country", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Location Coordinates *</Label>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input
                        placeholder="Latitude"
                        value={addressForm.lat}
                        onChange={(e) => handleInputChange("lat", e.target.value)}
                      />
                      <Input
                        placeholder="Longitude"
                        value={addressForm.lon}
                        onChange={(e) => handleInputChange("lon", e.target.value)}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={getCurrentLocation}
                      disabled={gettingLocation}
                      className="mt-2 bg-transparent"
                    >
                      {gettingLocation ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Getting Location...
                        </>
                      ) : (
                        <>
                          <Navigation className="w-4 h-4 mr-2" />
                          Use Current Location
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Service Schedule */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Service Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="schedule">Select Date & Time *</Label>
                    <Input
                      id="schedule"
                      type="datetime-local"
                      value={serviceSchedule}
                      onChange={(e) => setServiceSchedule(e.target.value)}
                      min={new Date().toISOString().slice(0, 16)}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Payment Method */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash_after_service">Cash After Service</SelectItem>
                      <SelectItem value="digital_payment">Digital Payment</SelectItem>
                      <SelectItem value="wallet_payment">Wallet Payment</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="sticky top-8"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        {item.service.thumbnail_full_path && (
                          <img
                            src={item.service.thumbnail_full_path || "/placeholder.svg"}
                            alt={item.service.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{item.service.name}</p>
                          <p className="text-xs text-gray-500">{item.variant_key}</p>
                          <p className="text-sm text-gray-600">
                            ₹{item.service_cost} × {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">₹{item.total_cost.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">₹{calculateTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Service Fee</span>
                      <span className="font-medium">₹0.00</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>₹{calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>

                  <Button className="w-full" size="lg" onClick={handlePlaceOrder} disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Place Order"
                    )}
                  </Button>

                  <p className="text-xs text-center text-gray-500">
                    By placing this order, you agree to our terms and conditions
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Overlay to close dropdown when clicking outside */}
      {showCountryDropdown && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowCountryDropdown(false)}
        />
      )}
    </div>
  )
}
