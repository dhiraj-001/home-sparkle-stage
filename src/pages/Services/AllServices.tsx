"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Star, Users, Zap, Heart, ChevronLeft, ChevronRight, Search } from "lucide-react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { useToast } from "@/hooks/use-toast"
import { toggleFavorite as toggleFavoriteApi } from "@/helpers/toggleFavorite"

interface ServiceVariation {
  variant_key: string
  variant_name: string
  price: number
}

interface Service {
  id: string
  name: string
  short_description: string
  description: string
  thumbnail: string
  cover_image: string
  category_id: string
  sub_category_id: string
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

interface AllServicesResponse {
  response_code: string
  message: string
  content: {
    current_page: number
    data: Service[]
    next_page_url: string | null
    path: string
    per_page: number
    prev_page_url: string | null
    to: number
    total: number
  }
  errors: any[]
}

const AllServices = () => {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalServices, setTotalServices] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()
  const authToken = localStorage.getItem("demand_token")

  useEffect(() => {
    fetchAllServices(currentPage)
  }, [currentPage])

  const fetchAllServices = async (page: number) => {
    setLoading(true)
    setError(null)

    try {
      const baseUrl = import.meta.env.VITE_API_URL || "https://admin.sarvoclub.com"
      const response = await fetch(`${baseUrl}/api/v1/customer/service?limit=20&offset=${page}`, {
        headers: {
          "Content-Type": "application/json",
          zoneId: "a02c55ff-cb84-4bbb-bf91-5300d1766a29",
          "X-localization": "en",
          guest_id: "7e223db0-9f62-11f0-bba0-779e4e64bbc8",
          "Accept-Encoding": "gzip, deflate, br",
        },
      })

      const data: AllServicesResponse = await response.json()

      if (data.response_code === "default_200" && data.content.data) {
        setServices(data.content.data)
        setTotalServices(data.content.total)
        setTotalPages(Math.ceil(data.content.total / data.content.per_page))
      } else {
        throw new Error("Failed to fetch services")
      }
    } catch (err) {
      console.error("Error fetching services:", err)
      setError("Failed to load services. Please try again.")
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

  const getImageUrl = (service: Service) => {
    const baseUrl = (import.meta.env.VITE_API_URL || "https://admin.sarvoclub.com") + "/storage/app/public/service/"
    return service.cover_image
      ? `${baseUrl}${service.cover_image}`
      : service.thumbnail
        ? `${baseUrl}${service.thumbnail}`
        : "/customer-service-interaction.png"
  }

  const toggleServiceFavorite = async (serviceId: string) => {
    try {
      await toggleFavoriteApi(serviceId, authToken)
      // Update the services state to toggle is_favorite
      setServices(prevServices =>
        prevServices.map(service =>
          service.id === serviceId
            ? { ...service, is_favorite: service.is_favorite === 1 ? 0 : 1 }
            : service
        )
      )
      const service = services.find(s => s.id === serviceId)
      const isCurrentlyFavorite = service?.is_favorite === 1
      toast({
        title: isCurrentlyFavorite ? "Removed from Favorites" : "Added to Favorites",
        description: `${service?.name} has been ${isCurrentlyFavorite ? "removed from" : "added to"} your favorites.`,
      })
    } catch (error) {
      if ((error as Error).message === "Authentication required") {
        toast({
          title: "Authentication Required",
          description: "Please login to add or remove favorites.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Error",
          description: (error as Error).message || "Failed to update favorite status. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const filteredServices = services.filter(
    (service) =>
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.short_description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
          <div className="container mx-auto px-4 py-12">
            <div className="mb-12">
              <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-64 mb-4 animate-pulse" />
              <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-96 animate-pulse" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden animate-pulse"
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
        </div>
        <Footer />
      </>
    )
  }

  if (error) {
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
            <h3 className="text-xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => fetchAllServices(currentPage)}
              className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Try Again
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
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />

        <div className="relative container mx-auto px-4 py-12">
          {/* Header Section */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-black">All Services</h1>
            <p className="text-lg text-gray-600 mb-8">
              Browse through our complete collection of {totalServices} professional services
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-lg"
                />
              </div>
            </div>
          </div>

          {/* Services Grid */}
          {filteredServices.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg font-medium">
                {searchQuery ? "No services found matching your search." : "No services available at the moment."}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
                {filteredServices.map((service) => (
                  <Link
                    key={service.id}
                    to={`/service/${service.id}`}
                    className="group relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden hover:-translate-y-2 border border-white/50"
                  >
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={getImageUrl(service) || "/placeholder.svg"}
                        alt={service.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />

                      {service.is_active === 1 && (
                        <div className="absolute top-4 left-4">
                          <div className="bg-green-500/95 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold text-white shadow-lg">
                            Active
                          </div>
                        </div>
                      )}

                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          toggleServiceFavorite(service.id)
                        }}
                        className="absolute top-4 right-4 p-2.5 bg-white/95 backdrop-blur-md rounded-full hover:bg-white transition-all duration-300 shadow-lg hover:scale-110 border border-white/50"
                      >
                        <Heart
                          className={`w-4 h-4 transition-all duration-300 ${
                            service.is_favorite ? "fill-red-500 text-red-500 scale-110" : "text-gray-600"
                          }`}
                        />
                      </button>

                      {service.order_count > 0 && (
                        <div className="absolute bottom-4 left-4">
                          <div className="flex items-center gap-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
                            <Users className="w-3.5 h-3.5" />
                            <span>{service.order_count}+ orders</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300 text-lg">
                        {service.name}
                      </h3>

                      <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                        {service.short_description}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-1.5">
                          <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-bold text-gray-900">
                              {service.avg_rating > 0 ? service.avg_rating.toFixed(1) : "New"}
                            </span>
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

              {/* Pagination Controls */}
              {!searchQuery && totalPages > 1 && (
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-white hover:border-blue-500 hover:text-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white/80 disabled:hover:border-gray-200 disabled:hover:text-gray-700 shadow-lg"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Previous
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold shadow-lg">
                      {currentPage}
                    </span>
                    <span className="text-gray-500 font-medium">of</span>
                    <span className="px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl font-bold text-gray-700 shadow-lg">
                      {totalPages}
                    </span>
                  </div>

                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-white hover:border-blue-500 hover:text-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white/80 disabled:hover:border-gray-200 disabled:hover:text-gray-700 shadow-lg"
                  >
                    Next
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}

export default AllServices
