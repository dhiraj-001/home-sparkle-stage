"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Star, Users, Heart, ArrowLeft, Clock, Shield, Award, Zap, CheckCircle, MapPin } from "lucide-react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

interface ServiceVariation {
  variant_key: string
  variant_name: string
  price: number
}

interface ServiceDetail {
  id: string
  name: string
  short_description: string
  description: string
  thumbnail: string
  cover_image: string
  category_id: string
  sub_category_id: string
  category_name?: string
  sub_category_name?: string
  tax: number
  order_count: number
  is_active: number
  rating_count: number
  avg_rating: number
  min_bidding_price: string
  is_favorite: number
  variations_app_format: {
    zone_id: string
    default_price: number
    zone_wise_variations: ServiceVariation[]
  }
  created_at: string
  updated_at: string
}

interface ServiceDetailResponse {
  response_code: string
  message: string
  content: ServiceDetail
  errors: any[]
}

const ServiceDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [service, setService] = useState<ServiceDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedVariation, setSelectedVariation] = useState<ServiceVariation | null>(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const authToken = localStorage.getItem('auth_token')

  useEffect(() => {
    if (id) {
      fetchServiceDetail(id)
    }
  }, [id])

  const fetchServiceDetail = async (serviceId: string) => {
    setLoading(true)
    setError(null)

    try {
    const baseUrl = import.meta.env.VITE_API_URL || "https://admin.sarvoclub.com";

    // Prepare headers
    const headers = {
      // CRITICAL: This tells the server you want a JSON response.
      "Accept": "application/json",
      "zoneId": "a02c55ff-cb84-4bbb-bf91-5300d1766a29",
      "X-localization": "en",
    };

    // Conditionally add guest_id or Authorization token
    if (authToken) {
      // If the user is logged in, add the Authorization header
      headers["Authorization"] = `Bearer ${authToken}`;
    } else {
      // If the user is a guest, add the guest_id header
      headers["guest_id"] = "7e223db0-9f62-11f0-bba0-779e4e64bbc8";
    }

    const response = await fetch(`${baseUrl}/api/v1/customer/service/detail?service_id=${serviceId}`, {
      method: 'GET', // Explicitly setting the method is good practice
      headers: headers,
    });

      const data: ServiceDetailResponse = await response.json()

      if (data.response_code === "default_200" && data.content) {
        setService(data.content)
        setIsFavorite(data.content.is_favorite === 1)

        // Set default variation
        if (data.content.variations_app_format?.zone_wise_variations?.length > 0) {
          setSelectedVariation(data.content.variations_app_format.zone_wise_variations[0])
        }
      } else {
        throw new Error("Failed to fetch service details")
      }
    } catch (err) {
      console.error("Error fetching service details:", err)
      setError("Failed to load service details. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getImageUrl = (imagePath: string) => {
    const baseUrl = "https://admin.sarvoclub.com/storage/app/public/service/"
    return imagePath ? `${baseUrl}${imagePath}` : "/customer-service-interaction.png"
  }

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
    // Here you would typically make an API call to update favorite status
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
          <div className="container mx-auto px-4 py-8">
            <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-32 mb-8 animate-pulse" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              <div className="h-96 bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl animate-pulse" />
              <div className="space-y-6">
                <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse" />
                <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4 animate-pulse" />
                <div className="h-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse" />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (error || !service) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 flex items-center justify-center">
          <div className="max-w-md mx-auto text-center bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-red-100">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Service Not Found</h3>
            <p className="text-gray-600 mb-6">{error || "The service you're looking for doesn't exist."}</p>
            <button
              onClick={() => navigate("/services")}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Browse All Services
            </button>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />

        <div className="relative container mx-auto px-4 py-8">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 group transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-semibold">Back</span>
          </button>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            {/* Image Section */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
                <img
                  src={getImageUrl(service.cover_image || service.thumbnail)}
                  alt={service.name}
                  className="w-full h-[500px] object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60" />

                {/* Status Badge */}
                {service.is_active === 1 && (
                  <div className="absolute top-6 left-6">
                    <div className="bg-green-500/95 backdrop-blur-md px-4 py-2 rounded-full text-sm font-semibold text-white shadow-lg flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Available Now
                    </div>
                  </div>
                )}

                {/* Favorite Button */}
                <button
                  onClick={toggleFavorite}
                  className="absolute top-6 right-6 p-3 bg-white/95 backdrop-blur-md rounded-full hover:bg-white transition-all duration-300 shadow-lg hover:scale-110 border border-white/50"
                >
                  <Heart
                    className={`w-6 h-6 transition-all duration-300 ${
                      isFavorite ? "fill-red-500 text-red-500 scale-110" : "text-gray-600"
                    }`}
                  />
                </button>

                {/* Order Count Badge */}
                {service.order_count > 0 && (
                  <div className="absolute bottom-6 left-6">
                    <div className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                      <Users className="w-4 h-4" />
                      <span>{service.order_count}+ orders completed</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 text-center shadow-lg border border-white/50">
                  <Shield className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-gray-700">Verified Service</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 text-center shadow-lg border border-white/50">
                  <Award className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-gray-700">Quality Assured</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 text-center shadow-lg border border-white/50">
                  <Clock className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-gray-700">Quick Service</p>
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div className="space-y-6">
              {/* Title and Rating */}
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">{service.name}</h1>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-xl border border-yellow-100">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-lg font-bold text-gray-900">
                      {service.avg_rating > 0 ? service.avg_rating.toFixed(1) : "New"}
                    </span>
                    {service.rating_count > 0 && (
                      <span className="text-sm text-gray-600">({service.rating_count} reviews)</span>
                    )}
                  </div>

                  {service.category_name && (
                    <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">
                      <MapPin className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-semibold text-gray-700">{service.category_name}</span>
                    </div>
                  )}
                </div>

                <p className="text-lg text-gray-600 leading-relaxed">{service.short_description}</p>
              </div>

              {/* Pricing Section */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-6 border border-blue-100 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-500" />
                  Service Options
                </h3>

                {service.variations_app_format?.zone_wise_variations &&
                service.variations_app_format.zone_wise_variations.length > 0 ? (
                  <div className="space-y-3">
                    {service.variations_app_format.zone_wise_variations.map((variation) => (
                      <button
                        key={variation.variant_key}
                        onClick={() => setSelectedVariation(variation)}
                        className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-300 ${
                          selectedVariation?.variant_key === variation.variant_key
                            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105"
                            : "bg-white hover:bg-gray-50 text-gray-900 border border-gray-200"
                        }`}
                      >
                        <span className="font-semibold">{variation.variant_name}</span>
                        <span className="text-xl font-bold">{formatPrice(variation.price)}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-900">Standard Service</span>
                      <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {formatPrice(
                          service.variations_app_format?.default_price ||
                            Number.parseInt(service.min_bidding_price) ||
                            0,
                        )}
                      </span>
                    </div>
                  </div>
                )}

                {service.tax > 0 && (
                  <p className="text-sm text-gray-600 mt-3">* Tax of {service.tax}% will be applied at checkout</p>
                )}
              </div>

              {/* Book Now Button */}
              <button className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-bold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl">
                Book Now
              </button>

              {/* Description */}
              {service.description && (
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/50">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">About This Service</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{service.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default ServiceDetail
