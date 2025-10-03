"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Star, Users, Zap, Heart, ArrowRight, TrendingUp } from "lucide-react"

interface ServiceVariation {
  variant_key: string
  variant_name: string
  price: number
}

interface Service {
  id: string
  name: string
  short_description: string
  thumbnail_full_path: string
  cover_image_full_path: string
  min_bidding_price: string
  avg_rating: number
  rating_count: number
  bookings_count: number
  is_favorite: number
  variations_app_format: {
    zone_wise_variations: ServiceVariation[]
    default_price: number
  }
  category: {
    name: string
    image_full_path: string
  }
}

interface TrendingServicesResponse {
  response_code: string
  message: string
  content: {
    data: Service[]
    current_page: number
    total: number
  }
}

const TrendingServices = () => {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTrendingServices()
  }, [])

  const fetchTrendingServices = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || "https://admin.sarvoclub.com"
      const response = await fetch(`${baseUrl}/api/v1/customer/service/trending?limit=10&offset=1`, {
        headers: {
          "Content-Type": "application/json",
          zoneId: "a02c55ff-cb84-4bbb-bf91-5300d1766a29",
          "X-localization": "en",
          guest_id: "7e223db0-9f62-11f0-bba0-779e4e64bbc8",
          "Accept-Encoding": "gzip, deflate, br",
        },
      })

      const data: TrendingServicesResponse = await response.json()

      if (data.response_code === "default_200" && data.content.data) {
        setServices(data.content.data)
      } else {
        throw new Error("Failed to fetch trending services")
      }
    } catch (err) {
      console.error("Error fetching trending services:", err)
      setError("Failed to load trending services")
    } finally {
      setLoading(false)
    }
  }

  const getStartingPrice = (service: Service) => {
    const variations = service.variations_app_format?.zone_wise_variations
    if (variations && variations.length > 0) {
      return Math.min(...variations.map((v) => v.price))
    }
    return service.variations_app_format?.default_price || Number.parseInt(service.min_bidding_price) || 0
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  if (loading) {
    return (
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-400/10 to-pink-400/10 rounded-full blur-3xl" />

        <div className="relative container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-48 mx-auto mb-4 animate-pulse" />
            <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-96 mx-auto mb-3 animate-pulse" />
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-64 mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="group relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden animate-pulse"
              >
                <div className="h-56 bg-gradient-to-br from-gray-200 to-gray-300" />
                <div className="p-6">
                  <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded mb-3" />
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4 mb-4" />
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20" />
                    <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20" />

        <div className="relative container mx-auto px-4">
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
            <h3 className="text-xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={fetchTrendingServices}
              className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse" />
      <div
        className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      <div className="relative container mx-auto px-4">
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-blue-200/50 text-blue-600 px-6 py-3 rounded-full text-sm font-semibold mb-6 shadow-lg">
            <TrendingUp className="w-5 h-5" />
            Trending Now
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-black">Most Popular Services</h2>
          <p className="text-lg text-gray-600 max-w-2xl leading-relaxed">
            Discover our most booked and highly-rated services that customers love
          </p>
        </div>

        {/* Services Grid */}
        {services.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg font-medium">No trending services available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {services.map((service) => (
              <Link
                key={service.id}
                to={`/service/${service.id}`}
                className="group relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden hover:-translate-y-2 border border-white/50"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={service.cover_image_full_path || service.thumbnail_full_path}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />

                  <div className="absolute top-4 left-4">
                    <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold text-gray-700 shadow-lg border border-white/50">
                      {service.category?.name}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                    className="absolute top-4 right-4 p-2.5 bg-white/95 backdrop-blur-md rounded-full hover:bg-white transition-all duration-300 shadow-lg hover:scale-110 border border-white/50"
                  >
                    <Heart
                      className={`w-4 h-4 transition-all duration-300 ${
                        service.is_favorite ? "fill-red-500 text-red-500 scale-110" : "text-gray-600"
                      }`}
                    />
                  </button>

                  {service.bookings_count > 0 && (
                    <div className="absolute bottom-4 left-4">
                      <div className="flex items-center gap-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
                        <Users className="w-3.5 h-3.5" />
                        <span>{service.bookings_count}+ booked</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300 text-lg">
                    {service.name}
                  </h3>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                    {service.short_description.replace(/\*\*(.*?)\*\*/g, "$1")}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-bold text-gray-900">{service.avg_rating || "New"}</span>
                      </div>
                      {service.rating_count > 0 && (
                        <span className="text-xs text-gray-500 font-medium">({service.rating_count})</span>
                      )}
                    </div>

                    <div className="text-right">
                      <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {formatPrice(getStartingPrice(service))}
                      </div>
                      <div className="text-xs text-gray-500 font-medium">starting price</div>
                    </div>
                  </div>

                  {service.variations_app_format?.zone_wise_variations &&
                    service.variations_app_format.zone_wise_variations.length > 1 && (
                      <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg">
                        <Zap className="w-3 h-3" />
                        <span className="font-medium">
                          {service.variations_app_format.zone_wise_variations.length} options available
                        </span>
                      </div>
                    )}
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </Link>
            ))}
          </div>
        )}

        {services.length > 0 && (
          <div className="text-center mt-16">
            <Link
              to="/services"
              className="inline-flex items-center gap-3 px-10 py-4 text-gray-900 rounded-2xl font-bold hover:text-blue-600 transition-all duration-300 transform hover:scale-105 group border-2 border-gray-900 hover:border-blue-600"
            >
              View All Services
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

export default TrendingServices
