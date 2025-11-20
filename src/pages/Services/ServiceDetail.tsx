"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  Star,
  Users,
  Heart,
  ArrowLeft,
  Clock,
  Shield,
  Award,
  Zap,
  CheckCircle,
  MapPin,
  Tag,
  ChevronRight,
  HelpCircle,
  Sparkles,
  Plus,
  Minus,
  ShoppingCart,
} from "lucide-react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { useToast } from "@/hooks/use-toast"
import { addToCart } from "@/helpers/addtocart"
import { toggleFavorite as toggleFavoriteApi } from "@/helpers/toggleFavorite"

interface ServiceVariation {
  variant_key: string
  variant_name: string
  price: number
}

interface Discount {
  id: string
  discount_title: string
  discount_type: string
  discount_amount: number
  discount_amount_type: string
  min_purchase: number
  max_discount_amount: number
  start_date: string
  end_date: string
}

interface CampaignDiscount {
  id: number
  discount_id: string
  discount_type: string
  type_wise_id: string
  discount: Discount
}

interface FAQ {
  question: string
  answer: string
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
  category?: {
    id: string
    name: string
    parent_id: string
  }
  campaign_discount?: CampaignDiscount[]
  faqs?: FAQ[]
  thumbnail_full_path?: string
  cover_image_full_path?: string
}

const ServiceDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [service, setService] = useState<ServiceDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedVariation, setSelectedVariation] = useState<ServiceVariation | null>(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const { toast } = useToast()
  const authToken = localStorage.getItem("demand_token")

  useEffect(() => {
    if (id) {
      fetchServiceDetail(id)
    }
  }, [id])

  const fetchServiceDetail = async (serviceId: string) => {
    setLoading(true)
    setError(null)

    try {
      const baseUrl = import.meta.env.VITE_API_URL || "https://admin.sarvoclub.com"

      // Prepare headers
      const headers = {
        // CRITICAL: This tells the server you want a JSON response.
        Accept: "application/json",
        zoneId: "a02c55ff-cb84-4bbb-bf91-5300d1766a29",
        "X-localization": "en",
      }

      // Conditionally add guest_id or Authorization token
      if (authToken) {
        // If the user is logged in, add the Authorization header
        headers["Authorization"] = `Bearer ${authToken}`
      } else {
        // If the user is a guest, add the guest_id header
        headers["guest_id"] = "7e223db0-9f62-11f0-bba0-779e4e64bbc8"
      }

      const response = await fetch(`${baseUrl}/api/v1/customer/service/detail/${serviceId}`, {
        method: "GET", // Explicitly setting the method is good practice
        headers: headers,
      })

      const data: any = await response.json()
      console.log(data)
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
    const baseUrl = (import.meta.env.VITE_API_URL || "https://admin.sarvoclub.com") + "/storage/app/public/service/"
    return imagePath ? `${baseUrl}${imagePath}` : "/customer-service-interaction.png"
  }

  const toggleFavorite = async () => {
    if (!service) {
      toast({
        title: "Error",
        description: "Service not loaded yet.",
        variant: "destructive",
      })
      return
    }

    try {
      await toggleFavoriteApi(service.id, authToken)
      setIsFavorite(!isFavorite)
      toast({
        title: isFavorite ? "Removed from Favorites" : "Added to Favorites",
        description: `${service.name} has been ${isFavorite ? "removed from" : "added to"} your favorites.`,
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

  const renderHTML = (htmlString: string) => {
    return { __html: htmlString }
  }

  const getDiscountedPrice = (originalPrice: number) => {
    if (!service?.campaign_discount || service.campaign_discount.length === 0) {
      return originalPrice
    }

    const discount = service.campaign_discount[0].discount
    if (discount.discount_amount_type === "amount") {
      return Math.max(0, originalPrice - discount.discount_amount)
    } else {
      return originalPrice - (originalPrice * discount.discount_amount) / 100
    }
  }

  const hasActiveDiscount = () => {
    if (!service?.campaign_discount || service.campaign_discount.length === 0) return false
    const discount = service.campaign_discount[0].discount
    const now = new Date()
    const startDate = new Date(discount.start_date)
    const endDate = new Date(discount.end_date)
    return now >= startDate && now <= endDate
  }

  const handleAddToCart = async () => {
    if (!service || !selectedVariation) {
      toast({
        title: "Error",
        description: "Please select a service option",
        variant: "destructive",
      })
      return
    }

    setIsAddingToCart(true)

    try {
      const result = await addToCart({
        serviceId: service.id,
        categoryId: service.category_id,
        subCategoryId: service.sub_category_id,
        variantKey: selectedVariation.variant_key,
        quantity: quantity,
        authToken: authToken || undefined,
        guestId: authToken ? undefined : "7e223db0-9f62-11f0-bba0-779e4e64bbc8",
      })

      if (result.success) {
        toast({
          title: "Added to Cart!",
          description: `${service.name} (${selectedVariation.variant_name}) has been added to your cart.`,
        })
        // Reset quantity after successful add
        setQuantity(1)
      } else {
        toast({
          title: "Failed to Add",
          description: result.error || "Could not add item to cart. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAddingToCart(false)
    }
  }

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1)
  }

  const decrementQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1))
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="h-6 bg-gray-100 rounded-lg w-48 mb-8 animate-pulse" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
              <div className="h-[600px] bg-gray-100 rounded-2xl animate-pulse" />
              <div className="space-y-8">
                <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
                <div className="h-6 bg-gray-100 rounded w-3/4 animate-pulse" />
                <div className="h-40 bg-gray-100 rounded-lg animate-pulse" />
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
        <div className="min-h-screen bg-white flex items-center justify-center px-4">
          <div className="max-w-md mx-auto text-center bg-white rounded-2xl shadow-sm border border-gray-200 p-12">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">Service Not Found</h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              {error || "The service you're looking for doesn't exist."}
            </p>
            <button
              onClick={() => navigate("/allservices")}
              className="px-8 py-3.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-all duration-200 shadow-sm"
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
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
            <button onClick={() => navigate("/")} className="hover:text-gray-900 transition-colors font-medium">
              Home
            </button>
            <ChevronRight className="w-4 h-4" />
            <button
              onClick={() => navigate("/allservices")}
              className="hover:text-gray-900 transition-colors font-medium"
            >
              Services
            </button>
            {service.category && (
              <>
                <ChevronRight className="w-4 h-4" />
                <span className="text-gray-900 font-medium">{service.category.name}</span>
              </>
            )}
          </nav>

          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-12 group transition-colors"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="font-medium">Back</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
            {/* Image Section */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-lg group">
                <img
                  src={service.cover_image_full_path || getImageUrl(service.cover_image || service.thumbnail)}
                  alt={service.name}
                  className="w-full h-[600px] object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                {hasActiveDiscount() && (
                  <div className="absolute top-6 left-6">
                    <div className="bg-red-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      {service.campaign_discount![0].discount.discount_amount_type === "amount"
                        ? `₹${service.campaign_discount![0].discount.discount_amount} OFF`
                        : `${service.campaign_discount![0].discount.discount_amount}% OFF`}
                    </div>
                  </div>
                )}

                {service.is_active === 1 && (
                  <div className="absolute top-6 right-6">
                    <div className="bg-green-600 px-4 py-2 rounded-full text-sm font-medium text-white shadow-lg flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Available
                    </div>
                  </div>
                )}

                <button
                  onClick={toggleFavorite}
                  className="absolute bottom-6 right-6 p-3.5 bg-white rounded-full hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Heart
                    className={`w-5 h-5 transition-colors ${
                      isFavorite ? "fill-red-600 text-red-600" : "text-gray-600"
                    }`}
                  />
                </button>

                {service.order_count > 0 && (
                  <div className="absolute bottom-6 left-6">
                    <div className="flex items-center gap-2 bg-white text-gray-900 px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                      <Users className="w-4 h-4 text-gray-600" />
                      <span>{service.order_count}+ bookings</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Details Section */}
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
                  {service.name}
                </h1>

                <div className="flex items-center gap-3 mb-6 flex-wrap">
                  <div className="flex items-center gap-2 bg-amber-50 px-4 py-2.5 rounded-xl border border-amber-100">
                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                    <span className="text-lg font-semibold text-gray-900">
                      {service.avg_rating > 0 ? service.avg_rating.toFixed(1) : "New"}
                    </span>
                    {service.rating_count > 0 && (
                      <span className="text-sm text-gray-600">({service.rating_count})</span>
                    )}
                  </div>

                  {service.category && (
                    <div className="flex items-center gap-2 bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-200">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">{service.category.name}</span>
                    </div>
                  )}
                </div>

                <p className="text-lg text-gray-600 leading-relaxed">{service.short_description}</p>
              </div>

              {hasActiveDiscount() && (
                <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-100 rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 bg-red-600 rounded-xl flex-shrink-0">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {service.campaign_discount![0].discount.discount_title}
                      </h3>
                      <p className="text-sm text-gray-700 mb-2">
                        Save{" "}
                        {service.campaign_discount![0].discount.discount_amount_type === "amount"
                          ? `₹${service.campaign_discount![0].discount.discount_amount}`
                          : `${service.campaign_discount![0].discount.discount_amount}%`}{" "}
                        on this service
                      </p>
                      <p className="text-xs text-gray-600">
                        Valid until{" "}
                        {new Date(service.campaign_discount![0].discount.end_date).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-gray-700" />
                  Service Options
                </h3>

                {service.variations_app_format?.zone_wise_variations &&
                service.variations_app_format.zone_wise_variations.length > 0 ? (
                  <div className="space-y-3">
                    {service.variations_app_format.zone_wise_variations.map((variation) => {
                      const originalPrice = variation.price
                      const discountedPrice = getDiscountedPrice(originalPrice)
                      const hasDiscount = hasActiveDiscount() && discountedPrice < originalPrice

                      return (
                        <button
                          key={variation.variant_key}
                          onClick={() => setSelectedVariation(variation)}
                          className={`w-full flex items-center justify-between p-5 rounded-xl transition-all duration-200 ${
                            selectedVariation?.variant_key === variation.variant_key
                              ? "bg-gray-900 text-white shadow-md"
                              : "bg-white hover:bg-gray-50 text-gray-900 border border-gray-200"
                          }`}
                        >
                          <span className="font-medium text-base">{variation.variant_name}</span>
                          <div className="flex items-center gap-3">
                            {hasDiscount && (
                              <span className="text-sm line-through opacity-60">{formatPrice(originalPrice)}</span>
                            )}
                            <span className="text-xl font-semibold">{formatPrice(discountedPrice)}</span>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl p-5 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">Standard Service</span>
                      <div className="flex items-center gap-3">
                        {hasActiveDiscount() && (
                          <span className="text-sm line-through text-gray-500">
                            {formatPrice(
                              service.variations_app_format?.default_price ||
                                Number.parseInt(service.min_bidding_price) ||
                                0,
                            )}
                          </span>
                        )}
                        <span className="text-2xl font-semibold text-gray-900">
                          {formatPrice(
                            getDiscountedPrice(
                              service.variations_app_format?.default_price ||
                                Number.parseInt(service.min_bidding_price) ||
                                0,
                            ),
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {service.tax > 0 && (
                  <p className="text-sm text-gray-600 mt-4">Tax of {service.tax}% will be applied at checkout</p>
                )}
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quantity</h3>
                <div className="flex items-center gap-4">
                  <button
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus className="w-5 h-5 text-gray-700" />
                  </button>
                  <span className="text-2xl font-semibold text-gray-900 min-w-[3rem] text-center">{quantity}</span>
                  <button
                    onClick={incrementQuantity}
                    className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <Plus className="w-5 h-5 text-gray-700" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart || !selectedVariation}
                className="w-full py-4 bg-blue-500 text-white rounded-xl font-semibold text-lg hover:bg-blue-600 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isAddingToCart ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Adding to Cart...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </>
                )}
              </button>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-5 text-center shadow-sm border border-green-500 hover:border-gray-300 transition-colors">
                  <Shield className="w-7 h-7 text-green-400 mx-auto mb-2" />
                  <p className="text-xs font-medium text-green-700">Verified</p>
                </div>
                <div className="bg-white rounded-xl p-5 text-center shadow-sm border border-blue-200 hover:border-gray-300 transition-colors">
                  <Award className="w-7 h-7 text-blue-700 mx-auto mb-2" />
                  <p className="text-xs font-medium text-blue-700">Quality</p>
                </div>
                <div className="bg-white rounded-xl p-5 text-center shadow-sm border border-yellow-200 hover:border-gray-300 transition-colors">
                  <Clock className="w-7 h-7 text-yellow-500 mx-auto mb-2" />
                  <p className="text-xs font-medium text-yellow-500">Fast</p>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto space-y-12">
            {/* Description */}
            {service.description && (
              <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-200">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                  <Sparkles className="w-7 h-7 text-gray-700" />
                  About This Service
                </h2>
                <div
                  className="prose prose-lg prose-gray max-w-none text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={renderHTML(service.description)}
                />
              </div>
            )}

            <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-200">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <HelpCircle className="w-7 h-7 text-gray-700" />
                Frequently Asked Questions
              </h2>
              {service.faqs && service.faqs.length > 0 ? (
                <div className="space-y-6">
                  {service.faqs.map((faq, index) => (
                    <div key={index} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                      <h3 className="font-semibold text-gray-900 mb-3 text-lg">{faq.question}</h3>
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <HelpCircle className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 font-medium mb-2">No FAQs available yet</p>
                  <p className="text-sm text-gray-500">Have questions? Contact our support team for assistance.</p>
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
