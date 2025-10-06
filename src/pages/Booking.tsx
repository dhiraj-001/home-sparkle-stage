
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Calendar,
  MapPin,
  Clock,
  User,
  Phone,
  Search,
  Filter,
  IndianRupee,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Package,
  Download,
} from "lucide-react"

interface Customer {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  profile_image_full_path: string
}

interface Booking {
  id: string
  readable_id: number
  customer_id: string
  provider_id: string | null
  zone_id: string
  booking_status: string
  is_paid: number
  payment_method: string
  transaction_id: string
  total_booking_amount: number
  total_tax_amount: number
  total_discount_amount: number
  service_schedule: string
  service_address_id: string
  created_at: string
  updated_at: string
  category_id: string
  sub_category_id: string
  serviceman_id: string | null
  total_campaign_discount_amount: number
  total_coupon_discount_amount: number
  coupon_code: string | null
  is_checked: number
  additional_charge: number
  additional_tax_amount: number
  additional_discount_amount: number
  additional_campaign_discount_amount: number
  removed_coupon_amount: string
  evidence_photos: string | null
  booking_otp: string
  is_guest: number
  is_verified: number
  extra_fee: number
  total_referral_discount_amount: number
  is_repeated: number
  assigned_by: string | null
  service_location: string
  service_address_location: string
  evidence_photos_full_path: string[]
  customer: Customer
}

interface BookingsResponse {
  response_code: string
  message: string
  content: {
    current_page: number
    data: Booking[]
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
  errors: string[]
}

interface BookingListProps {
  initialStatus?: string
  showFilters?: boolean
  limit?: number
  offset?: number
}

const BookingList: React.FC<BookingListProps> = ({
  initialStatus = "all",
  showFilters = true,
  limit = 100,
  offset = 1,
}) => {
  const baseUrl = import.meta.env.VITE_API_URL || "https://admin.sarvoclub.com"
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState(initialStatus)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("newest")

  const statusOptions = [
    { value: "all", label: "All Bookings" },
    { value: "pending", label: "Pending" },
    { value: "accepted", label: "Accepted" },
    { value: "ongoing", label: "Ongoing" },
    { value: "completed", label: "Completed" },
    { value: "canceled", label: "Canceled" },
  ]

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "amount_high", label: "Amount: High to Low" },
    { value: "amount_low", label: "Amount: Low to High" },
  ]

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "secondary"
      case "accepted":
        return "default"
      case "ongoing":
        return "default"
      case "completed":
        return "success"
      case "canceled":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <AlertCircle className="h-4 w-4" />
      case "accepted":
        return <CheckCircle2 className="h-4 w-4" />
      case "ongoing":
        return <Package className="h-4 w-4" />
      case "completed":
        return <CheckCircle2 className="h-4 w-4" />
      case "canceled":
        return <XCircle className="h-4 w-4" />
      default:
        return null
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const fetchBookings = async () => {
    const token = localStorage.getItem("demand_token")
    if (!token) {
      setError("Please login to view your bookings")
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        booking_status: selectedStatus,
        limit: limit.toString(),
        offset: offset.toString(),
        service_type: "all",
      })

      const url = `${baseUrl}/api/v1/customer/booking?${params.toString()}`

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-localization": "en",
          zoneId: "a02c55ff-cb84-4bbb-bf91-5300d1766a29",
          guest_id: "7e223db0-9f62-11f0-bba0-779e4e64bbc8",
          "Accept-Charset": "UTF-8",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: BookingsResponse = await response.json()

      if (data.response_code === "default_200") {
        setBookings(data.content?.data || [])
        setFilteredBookings(data.content?.data || [])
      } else {
        throw new Error(data.message || "Failed to fetch bookings")
      }
    } catch (err: any) {
      console.error("Failed to fetch bookings:", err)
      setError(err.message || "An error occurred while fetching bookings")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let result = [...bookings]

    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase()
      result = result.filter(
        (booking) =>
          booking.readable_id.toString().includes(lowerSearchTerm) ||
          booking.customer.first_name.toLowerCase().includes(lowerSearchTerm) ||
          booking.customer.last_name.toLowerCase().includes(lowerSearchTerm) ||
          booking.customer.phone.includes(lowerSearchTerm) ||
          booking.payment_method.toLowerCase().includes(lowerSearchTerm),
      )
    }

    switch (sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        break
      case "oldest":
        result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        break
      case "amount_high":
        result.sort((a, b) => b.total_booking_amount - a.total_booking_amount)
        break
      case "amount_low":
        result.sort((a, b) => a.total_booking_amount - b.total_booking_amount)
        break
    }

    setFilteredBookings(result)
  }, [bookings, searchTerm, sortBy])

  useEffect(() => {
    fetchBookings()
  }, [selectedStatus])

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value)
  }

  const handleRetry = () => {
    fetchBookings()
  }

  const getPaymentMethodLabel = (method: string) => {
    return method
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="h-20 w-20 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin mx-auto" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-lg font-semibold text-gray-900">Loading your bookings</p>
            <p className="text-sm text-gray-600">Please wait while we fetch your data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50 p-4">
        <Card className="max-w-md w-full border-red-200 shadow-lg">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mx-auto">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">Oops! Something went wrong</h3>
                <p className="text-sm text-gray-600">{error}</p>
              </div>
              <Button
                onClick={handleRetry}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              My Bookings
            </h1>
            <p className="text-gray-600 text-lg">Manage and track your service bookings</p>
          </div>

          <div className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full shadow-lg">
            <Package className="h-5 w-5" />
            <span className="font-semibold text-lg">
              {filteredBookings.length} booking{filteredBookings.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {showFilters && (
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
              <CardTitle className="text-xl flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                  <Filter className="h-5 w-5 text-white" />
                </div>
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Filters & Search
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-600" />
                    Booking Status
                  </label>
                  <Select value={selectedStatus} onValueChange={handleStatusChange}>
                    <SelectTrigger className="border-2 hover:border-blue-400 transition-colors">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-purple-600" />
                    Search
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="Search by ID, name, phone..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-11 border-2 hover:border-purple-400 focus:border-purple-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-pink-600" />
                    Sort By
                  </label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="border-2 hover:border-pink-400 transition-colors">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {filteredBookings.length === 0 ? (
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="text-center py-16">
              <div className="space-y-6">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mx-auto">
                  <Calendar className="h-12 w-12 text-blue-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-gray-900">No bookings found</h3>
                  <p className="text-gray-600 text-lg">
                    {selectedStatus === "all"
                      ? "You don't have any bookings yet. Start exploring our services!"
                      : `No ${selectedStatus} bookings found.`}
                  </p>
                  {searchTerm && (
                    <p className="text-sm text-gray-500 mt-4">Try adjusting your search terms or filters</p>
                  )}
                </div>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg">
                  Browse Services
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <Card
                key={booking.id}
                className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm hover:scale-[1.02] group"
              >
                <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border-b-2 border-gray-100">
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 flex-wrap">
                        <CardTitle className="text-xl font-bold text-gray-900">
                          Booking #{booking.readable_id}
                        </CardTitle>
                        <Badge
                          variant={getStatusBadgeVariant(booking.booking_status)}
                          className="px-4 py-1.5 text-sm font-semibold flex items-center gap-2"
                        >
                          {getStatusIcon(booking.booking_status)}
                          {booking.booking_status.toUpperCase()}
                        </Badge>
                      </div>
                      <CardDescription className="flex flex-wrap items-center gap-4 text-base">
                        <span className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg shadow-sm">
                          <Calendar className="h-4 w-4 text-blue-600" />
                          <span className="font-medium text-gray-700">{formatDate(booking.service_schedule)}</span>
                        </span>
                        <span className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg shadow-sm">
                          <Clock className="h-4 w-4 text-purple-600" />
                          <span className="font-medium text-gray-700">{formatDate(booking.created_at)}</span>
                        </span>
                      </CardDescription>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-lg border-2 border-gray-100 space-y-2">
                      <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center justify-end gap-1">
                        <IndianRupee className="h-6 w-6" />
                        {booking.total_booking_amount}
                      </p>
                      <p className="text-sm text-gray-600 capitalize font-medium">
                        {getPaymentMethodLabel(booking.payment_method)}
                      </p>
                      {booking.is_paid === 1 ? (
                        <Badge className="text-xs bg-green-100 text-green-700 hover:bg-green-100 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Paid
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          Pending Payment
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h4 className="font-bold text-gray-900 flex items-center gap-2 text-lg">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                          <User className="h-4 w-4 text-white" />
                        </div>
                        Customer Details
                      </h4>
                      <div className="flex items-start gap-4 bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-xl">
                        <img
                          src={booking.customer.profile_image_full_path || "/placeholder.svg"}
                          alt={`${booking.customer.first_name} ${booking.customer.last_name}`}
                          className="w-14 h-14 rounded-full object-cover border-4 border-white shadow-lg"
                        />
                        <div className="space-y-2 flex-1">
                          <p className="font-bold text-gray-900 text-lg">
                            {booking.customer.first_name} {booking.customer.last_name}
                          </p>
                          <p className="text-sm text-gray-700 flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg w-fit">
                            <Phone className="h-4 w-4 text-blue-600" />
                            {booking.customer.phone}
                          </p>
                          <p className="text-sm text-gray-600">{booking.customer.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-bold text-gray-900 flex items-center gap-2 text-lg">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                          <MapPin className="h-4 w-4 text-white" />
                        </div>
                        Service Details
                      </h4>
                      <div className="space-y-3 bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl">
                        <div className="flex justify-between items-center bg-white px-4 py-3 rounded-lg">
                          <span className="text-gray-600 font-medium">Service Location:</span>
                          <span className="font-bold capitalize text-gray-900">{booking.service_location}</span>
                        </div>
                        <div className="flex justify-between items-center bg-white px-4 py-3 rounded-lg">
                          <span className="text-gray-600 font-medium">OTP:</span>
                          <span className="font-mono font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            {booking.booking_otp}
                          </span>
                        </div>
                        {booking.coupon_code && (
                          <div className="flex justify-between items-center bg-white px-4 py-3 rounded-lg">
                            <span className="text-gray-600 font-medium">Coupon Applied:</span>
                            <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700">
                              {booking.coupon_code}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t-2 border-gray-100">
                    <div className="flex justify-end">
                      <Button
                        onClick={() => window.open(`https://admin.sarvoclub.com/admin/booking/customer-invoice/${booking.id}/en`, '_blank')}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Invoice
                      </Button>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t-2 border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl">
                      <p className="text-xs font-semibold text-gray-600 mb-1">DISCOUNTS</p>
                      <p className="text-sm font-bold text-gray-900">
                        Campaign: ₹{booking.total_campaign_discount_amount}
                        {booking.total_coupon_discount_amount > 0 && (
                          <span className="block">Coupon: ₹{booking.total_coupon_discount_amount}</span>
                        )}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-xl">
                      <p className="text-xs font-semibold text-gray-600 mb-1">TAX AMOUNT</p>
                      <p className="text-sm font-bold text-gray-900">₹{booking.total_tax_amount}</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl">
                      <p className="text-xs font-semibold text-gray-600 mb-1">LAST UPDATED</p>
                      <p className="text-sm font-bold text-gray-900">{formatDate(booking.updated_at)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default BookingList
