
"use client"

import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, ArrowLeft } from "lucide-react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

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

interface Address {
  id: string
  address: string
  city: string
  state: string
  zip_code: string
  country: string
  latitude: string
  longitude: string
  contact_person_name: string
  contact_person_number: string
  is_default: number
}

const CheckoutPage: React.FC = () => {
  const [cartData, setCartData] = useState<CartResponse | null>(null)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedAddressId, setSelectedAddressId] = useState<string>("")
  const [showAddAddress, setShowAddAddress] = useState(false)
  const [addingAddress, setAddingAddress] = useState(false)
  const [addressSuggestions, setAddressSuggestions] = useState<any[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1)
  const navigate = useNavigate()

  const handleAddAddress = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const addressData = {
      contact_person_name: formData.get("contact_person_name") as string,
      contact_person_number: formData.get("contact_person_number") as string,
      address: formData.get("address") as string,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      zip_code: formData.get("zip_code") as string,
      country: formData.get("country") as string,
      lat: formData.get("lat") as string || "28.6139", // Default to Delhi coordinates
      lon: formData.get("lon") as string || "77.2090",
      address_type: formData.get("address_type") as string || "home",
      address_label: formData.get("address_label") as string || "Home",
      house: formData.get("house") as string || "",
      floor: formData.get("floor") as string || "",
      street: formData.get("street") as string || "",
    }

    const token = localStorage.getItem("demand_token")
    if (!token) return

    try {
      setAddingAddress(true)
      setError(null)

      const response = await fetch(
        "https://admin.sarvoclub.com/api/v1/customer/address",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "X-localization": "en",
            zoneId: "a02c55ff-cb84-4bbb-bf91-5300d1766a29",
            guest_id: "7e223db0-9f62-11f0-bba0-779e4e64bbc8",
            "Accept-Charset": "UTF-8",
          },
          body: JSON.stringify(addressData),
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.response_code === "default_200") {
        setShowAddAddress(false)
        form.reset()
        await fetchAddresses()
      } else {
        throw new Error(data.message || "Failed to add address")
      }
    } catch (err: any) {
      console.error("Failed to add address:", err)
      setError(err.message || "An error occurred while adding address")
    } finally {
      setAddingAddress(false)
    }
  }

  const fetchAddresses = async () => {
    const token = localStorage.getItem("demand_token")
    if (!token) return

    try {
      const response = await fetch(
        "https://admin.sarvoclub.com/api/v1/customer/address",
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

      if (response.ok) {
        const data = await response.json()
        if (data.response_code === "default_200") {
          setAddresses(data.content || [])
          // Auto-select default address if available
          const defaultAddr = data.content?.find((addr: Address) => addr.is_default === 1)
          if (defaultAddr) {
            setSelectedAddressId(defaultAddr.id)
          }
        }
      }
    } catch (err) {
      console.error("Failed to fetch addresses:", err)
    }
  }

  const fetchCartData = async () => {
    const token = localStorage.getItem("demand_token")
    if (!token) {
      navigate("/login")
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(
        "https://admin.sarvoclub.com/api/v1/customer/cart/list?limit=100&offset=1",
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

      if (data.response_code === "default_200") {
        setCartData(data)
      } else {
        throw new Error(data.message || "Failed to fetch cart data")
      }
    } catch (err: any) {
      console.error("Failed to fetch cart data:", err)
      setError(err.message || "An error occurred while fetching cart data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCartData()
    fetchAddresses()
  }, [])

  const cartItems = cartData?.content.cart.data || []
  const totalCost = cartData?.content.total_cost || 0

  const handleProceedToPayment = () => {
    if (!selectedDate) {
      setError("Please select a date for the service")
      return
    }
    if (!selectedAddressId) {
      setError("Please select a delivery address")
      return
    }
    // TODO: Implement payment logic
    alert(`Proceeding to payment for date: ${selectedDate} at address ID: ${selectedAddressId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-gray-600">Loading checkout...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card className="text-center py-12">
            <CardContent className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Your cart is empty</h3>
              <p className="text-gray-600">Add some services to proceed with checkout.</p>
              <Button onClick={() => navigate("/")}>Browse Services</Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate(-1)}
              className="rounded-full"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
              <p className="text-gray-600 mt-1">Complete your booking</p>
            </div>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>{cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your order</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <img
                      src={item.service.thumbnail_full_path || "/placeholder.svg"}
                      alt={item.service.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.service.name}</h3>
                      <p className="text-sm text-gray-600">{item.category.name}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">₹{item.total_cost}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Checkout Details */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Service Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Address Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Select Delivery Address</label>
                  {addresses.length > 0 ? (
                    <div className="space-y-2">
                      {addresses.map((addr) => (
                        <div
                          key={addr.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedAddressId === addr.id
                              ? 'border-primary bg-primary/5'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setSelectedAddressId(addr.id)}
                        >
                          <div className="flex items-start gap-2">
                            <input
                              type="radio"
                              checked={selectedAddressId === addr.id}
                              onChange={() => setSelectedAddressId(addr.id)}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-sm">{addr.contact_person_name}</p>
                              <p className="text-sm text-gray-600">{addr.contact_person_number}</p>
                              <p className="text-sm text-gray-600">{addr.address}, {addr.city}, {addr.state} {addr.zip_code}</p>
                              {addr.is_default === 1 && (
                                <span className="inline-block mt-1 px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Default</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No addresses found. Add a new address below.</p>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => setShowAddAddress(!showAddAddress)}
                    className="w-full"
                  >
                    {showAddAddress ? 'Cancel' : 'Add New Address'}
                  </Button>

                  {/* Add New Address Form */}
                  {showAddAddress && (
                    <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Add New Address</h4>
                      <form onSubmit={handleAddAddress} className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            name="contact_person_name"
                            placeholder="Contact Person Name"
                            required
                            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                          <input
                            type="tel"
                            name="contact_person_number"
                            placeholder="Contact Number"
                            required
                            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            name="house"
                            placeholder="House/Building"
                            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                          <input
                            type="text"
                            name="floor"
                            placeholder="Floor"
                            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                        <input
                          type="text"
                          name="street"
                          placeholder="Street/Area"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                        <textarea
                          name="address"
                          placeholder="Full Address"
                          required
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            name="city"
                            placeholder="City"
                            required
                            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                          <input
                            type="text"
                            name="state"
                            placeholder="State"
                            required
                            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            name="zip_code"
                            placeholder="ZIP Code"
                            required
                            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                          <input
                            type="text"
                            name="country"
                            placeholder="Country"
                            required
                            defaultValue="India"
                            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <select
                            name="address_type"
                            defaultValue="home"
                            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          >
                            <option value="home">Home</option>
                            <option value="office">Office</option>
                            <option value="others">Other</option>
                          </select>
                          <input
                            type="text"
                            name="address_label"
                            placeholder="Address Label (e.g., My Home)"
                            defaultValue="Home"
                            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                        {/* <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Location Coordinates</label>
                          <div className="grid grid-cols-2 gap-3">
                            <input
                              type="text"
                              name="lat"
                              placeholder="Latitude"
                              defaultValue="28.6139"
                              required
                              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                            <input
                              type="text"
                              name="lon"
                              placeholder="Longitude"
                              defaultValue="77.2090"
                              required
                              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={async () => {
                              if (navigator.geolocation) {
                                navigator.geolocation.getCurrentPosition(
                                  async (position) => {
                                    const lat = position.coords.latitude.toString()
                                    const lon = position.coords.longitude.toString()

                                    const latInput = document.querySelector('input[name="lat"]') as HTMLInputElement
                                    const lonInput = document.querySelector('input[name="lon"]') as HTMLInputElement
                                    if (latInput && lonInput) {
                                      latInput.value = lat
                                      lonInput.value = lon
                                    }

                                    // Reverse geocoding to fill address fields
                                    try {
                                      const response = await fetch(
                                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`
                                      )
                                      const data = await response.json()

                                      if (data && data.address) {
                                        const address = data.address
                                        const addressInput = document.querySelector('textarea[name="address"]') as HTMLTextAreaElement
                                        const cityInput = document.querySelector('input[name="city"]') as HTMLInputElement
                                        const stateInput = document.querySelector('input[name="state"]') as HTMLInputElement
                                        const zipInput = document.querySelector('input[name="zip_code"]') as HTMLInputElement
                                        const countryInput = document.querySelector('input[name="country"]') as HTMLInputElement

                                        if (addressInput) {
                                          const fullAddress = [
                                            address.house_number,
                                            address.road,
                                            address.suburb,
                                            address.city_district
                                          ].filter(Boolean).join(', ')
                                          addressInput.value = fullAddress || data.display_name.split(',')[0]
                                        }
                                        if (cityInput) cityInput.value = address.city || address.town || address.village || ''
                                        if (stateInput) stateInput.value = address.state || ''
                                        if (zipInput) zipInput.value = address.postcode || ''
                                        if (countryInput) countryInput.value = address.country || ''
                                      }
                                    } catch (geoError) {
                                      console.warn("Reverse geocoding failed:", geoError)
                                      // Location coordinates are still filled
                                    }
                                  },
                                  (error) => {
                                    console.error("Error getting location:", error)
                                    alert("Unable to get your location. Please enter coordinates manually or allow location access.")
                                  }
                                )
                              } else {
                                alert("Geolocation is not supported by this browser.")
                              }
                            }}
                            className="w-full"
                          >
                            Use Current Location
                          </Button>
                        </div> */}
                        <Button
                          type="submit"
                          disabled={addingAddress}
                          className="w-full"
                          size="sm"
                        >
                          {addingAddress ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : null}
                          Add Address
                        </Button>
                      </form>
                    </div>
                  )}
                </div>

                {/* Date Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Select Service Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500">Choose the date when you want the service</p>
                </div>

                {/* Total */}
                <div className="border-t pt-4">
                  <div className="flex justify-between font-semibold">
                    <span>Total Amount</span>
                    <span className="text-lg">₹{totalCost}</span>
                  </div>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleProceedToPayment}
                  disabled={!selectedDate || !selectedAddressId}
                >
                  Proceed to Payment
                </Button>

                <div className="text-center">
                  <Button
                    variant="outline"
                    onClick={() => navigate("/cart")}
                    className="w-full"
                  >
                    Back to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default CheckoutPage
