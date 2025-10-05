"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Star, Users, Zap, Heart, Search, ArrowLeft } from "lucide-react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { useToast } from "@/hooks/use-toast"
import { toggleFavorite as toggleFavoriteApi } from "@/helpers/toggleFavorite"
import { addToCart } from "@/helpers/addtocart"

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
  thumbnail_full_path: string
  cover_image_full_path: string
  category: {
    id: string
    name: string
    image_full_path: string
  }
  variations: Array<{
    id: number
    variant: string
    variant_key: string
    price: number
  }>
  service_discount: any[]
  campaign_discount: Array<{
    id: number
    discount: {
      discount_title: string
      discount_amount: number
      discount_amount_type: string
    }
  }>
  translations: Array<{
    id: number
    translationable_type: string
    translationable_id: string
    locale: string
    key: string
    value: string
  }>
}

interface FavoritesResponse {
  response_code: string
  message: string
  content: {
    current_page: number
    data: Service[]
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
  errors: any[]
}

const FavoritesPage = () => {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()
  const authToken = localStorage.getItem("demand_token")

  useEffect(() => {
    if (authToken) {
      fetchFavorites()
    } else {
      setLoading(false)
      setError("Please login to view your favorites.")
    }
  }, [authToken])

  const fetchFavorites = async () => {
    setLoading(true)
    setError(null)

    try {
      const baseUrl = import.meta.env.VITE_API_URL || "https://admin.sarvoclub.com"
      const response = await fetch(`${baseUrl}/api/v1/customer/favorite/service-list?offset=1&limit=100`, {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${authToken}`,
          "zoneId": "a02c55ff-cb84-4bbb-bf91-5300d1766a29",
          "X-localization": "en",
          "guest_id": "7e223db0-9f62-11f0-bba0-779e4e64bbc8",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: FavoritesResponse = await response.json()

      // Check if response code contains "200" for success
      if (data.response_code?.includes("200") && data.content?.data) {
        setServices(data.content.data)
      } else {
        throw new Error(data.message || "Failed to fetch favorites")
      }
    } catch (err) {
      console.error("Error fetching favorites:", err)
      setError("Failed to load favorites. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const getStartingPrice = (service: Service) => {
    const variations = service.variations_app_format?.zone_wise_variations
    if (variations && variations.length > 0) {
      return Math.min(...variations.map((v) => v.price))
    }
    return service.variations_app_format?.default_price || Number.parseFloat(service.min_bidding_price) || 0
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getImageUrl = (service: Service) => {
    // Use the full path URLs from the response first
    if (service.cover_image_full_path) {
      return service.cover_image_full_path
    }
    if (service.thumbnail_full_path) {
      return service.thumbnail_full_path
    }
    
    // Fallback to constructing the URL from the image names
    const baseUrl = (import.meta.env.VITE_API_URL || "https://admin.sarvoclub.com") + "/storage/app/public/service/"
    return service.cover_image
      ? `${baseUrl}${service.cover_image}`
      : service.thumbnail
        ? `${baseUrl}${service.thumbnail}`
        : "/customer-service-interaction.png"
  }

  const toggleServiceFavorite = async (serviceId: string) => {
    if (!authToken) {
      toast({
        title: "Authentication Required",
        description: "Please login to manage favorites.",
        variant: "destructive",
      })
      return
    }

    try {
      await toggleFavoriteApi(serviceId, authToken)
      // Remove from favorites list
      setServices(prevServices => prevServices.filter(service => service.id !== serviceId))
      const service = services.find(s => s.id === serviceId)
      toast({
        title: "Removed from Favorites",
        description: `${service?.name} has been removed from your favorites.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to update favorite status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAddToCart = async (service: Service) => {
    if (!authToken) {
      toast({
        title: "Authentication Required",
        description: "Please login to add items to cart.",
        variant: "destructive",
      })
      return
    }

    // For simplicity, add quantity 1 and use first variant key if available
    const variantKey = service.variations_app_format?.zone_wise_variations?.[0]?.variant_key || ""

    const result = await addToCart({
      serviceId: service.id,
      categoryId: service.category_id,
      subCategoryId: service.sub_category_id,
      variantKey: variantKey,
      quantity: 1,
      authToken: authToken || undefined,
    })

    if (result.success) {
      toast({
        title: "Added to Cart",
        description: `${service.name} has been added to your cart.`,
      })
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to add item to cart. Please try again.",
        variant: "destructive",
      })
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
              {[...Array(8)].map((_, i) => (
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
            <h3 className="text-xl font-bold text-gray-900 mb-2">Unable to Load Favorites</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
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
            <Link
              to="/allservices"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 group transition-colors"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="font-medium">Back to Services</span>
            </Link>

            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-black">My Favorites</h1>
            <p className="text-lg text-gray-600 mb-8">
              Your saved services ({services.length} {services.length === 1 ? "service" : "services"})
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search your favorites..."
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
                <Heart className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg font-medium mb-2">
                {searchQuery ? "No favorites found matching your search." : "No favorites yet"}
              </p>
              <p className="text-sm text-gray-400 mb-6">
                {searchQuery ? "Try a different search term." : "Start exploring services and add them to your favorites!"}
              </p>
              {!searchQuery && (
                <Link
                  to="/allservices"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Browse Services
                </Link>
              )}
            </div>
          ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
  {filteredServices.map((service) => (
    <div
      key={service.id}
      className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-blue-200 hover:-translate-y-2"
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={getImageUrl(service) || "/placeholder.svg"}
          alt={service.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          <div className="flex flex-col gap-2">
            {service.is_active === 1 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-500 text-white shadow-lg backdrop-blur-sm">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                Active
              </span>
            )}
            {service.variations_app_format?.zone_wise_variations?.length > 1 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500 text-white shadow-lg">
                <Zap className="w-3 h-3" />
                {service.variations_app_format.zone_wise_variations.length} options
              </span>
            )}
          </div>
          
          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              toggleServiceFavorite(service.id)
            }}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-300 shadow-lg hover:scale-110 hover:shadow-xl"
          >
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
          </button>
        </div>

        {/* Bottom Info Overlay */}
        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex justify-between items-end">
            {service.order_count > 0 && (
              <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold text-white">
                <Users className="w-3.5 h-3.5" />
                <span>{service.order_count}+ orders</span>
              </div>
            )}
            
            {/* Rating */}
            <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold text-white">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <span>{service.avg_rating > 0 ? service.avg_rating.toFixed(1) : "New"}</span>
              {service.rating_count > 0 && (
                <span className="text-white/70">({service.rating_count})</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        {/* Title */}
        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-lg leading-tight group-hover:text-blue-600 transition-colors duration-300">
          {service.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
          {service.short_description}
        </p>

        {/* Price and Action Section */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex flex-col">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {formatPrice(getStartingPrice(service))}
            </div>
            <div className="text-xs text-gray-500 font-medium">starting price</div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Link 
              to={`/service/${service.id}`}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-300 hover:scale-105 text-sm"
            >
              View
            </Link>
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleAddToCart(service)
              }}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg text-sm"
            >
              Add to Cart
            </button>
          </div>
        </div>

        {/* Additional Info */}
        {service.campaign_discount?.length > 0 && (
          <div className="mt-3 flex items-center gap-2 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg px-3 py-2">
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
            <span className="text-xs font-semibold text-amber-700">
              {service.campaign_discount[0].discount.discount_amount_type === 'percentage' 
                ? `${service.campaign_discount[0].discount.discount_amount}% OFF`
                : `${formatPrice(service.campaign_discount[0].discount.discount_amount)} OFF`
              }
            </span>
          </div>
        )}
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500/30 rounded-2xl transition-colors duration-300 pointer-events-none" />
      
      {/* Shine Effect on Hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden">
        <div className="absolute -inset-full top-0 skew-x-12 group-hover:animate-shine group-hover:bg-gradient-to-r group-hover:from-transparent group-hover:via-white/20 group-hover:to-transparent" />
      </div>
    </div>
  ))}
</div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}

export default FavoritesPage