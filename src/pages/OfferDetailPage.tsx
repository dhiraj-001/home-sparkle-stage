"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import type { BannerItem, BannerService, BannerCategory } from "../types/banner"
// import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Header from "@/components/Header"

const OfferDetailPage: React.FC = () => {
  const baseUrl = import.meta.env.VITE_API_URL || "https://admin.sarvoclub.com";
  const { type, id } = useParams<{ type: string; id: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [bannerData, setBannerData] = useState<BannerItem | null>(null)

  useEffect(() => {
    const fetchOfferDetails = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/v1/customer/banner/list`)
        const data = await response.json()

        if (data.response_code === "default_200" && data.content.data) {
          const banner = data.content.data.find(
            (item: BannerItem) => item.resource_id === id && item.resource_type === type,
          )
          setBannerData(banner || null)
        }
      } catch (error) {
        console.error("Failed to fetch offer details:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOfferDetails()
  }, [type, id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!bannerData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Offer not found</h2>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
            >
              Go back home
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const service = bannerData.service as BannerService | null
  const category = bannerData.category as BannerCategory | null

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <div className="relative h-[400px] lg:h-[500px]">
        <img
          src={bannerData.banner_image_full_path || "/placeholder.svg"}
          alt={bannerData.banner_title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4">{bannerData.banner_title}</h1>
            {service && <p className="text-xl text-white/90 max-w-3xl">{service.short_description}</p>}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {type === "service" && service && (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-card rounded-2xl p-8 shadow-lg">
                  <h2 className="text-3xl font-bold text-foreground mb-6">About This Service</h2>
                  <div
                    className="prose prose-lg max-w-none text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: service.description }}
                  />
                </div>

                {/* Service Images */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg">
                    <img
                      src={service.cover_image_full_path || "/placeholder.svg"}
                      alt={service.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg">
                    <img
                      src={service.thumbnail_full_path || "/placeholder.svg"}
                      alt={service.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-8 shadow-lg sticky top-24">
                  <div className="space-y-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Starting from</p>
                      <p className="text-4xl font-bold text-foreground">₹{service.min_bidding_price}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.floor(service.avg_rating) ? "text-yellow-400" : "text-gray-300"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {service.avg_rating > 0
                          ? `${service.avg_rating} (${service.rating_count} reviews)`
                          : "New Service"}
                      </span>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-border">
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>Verified Professionals</span>
                      </div>
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>Same-Day Service</span>
                      </div>
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>100% Satisfaction</span>
                      </div>
                    </div>

                    <button className="w-full py-4 bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {type === "category" && category && (
            <div className="space-y-8">
              <div className="bg-card rounded-2xl p-8 shadow-lg">
                <h2 className="text-3xl font-bold text-foreground mb-6">About {category.name}</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {category.description ||
                    `Explore our comprehensive ${category.name} services designed to meet all your needs.`}
                </p>
              </div>

              <div className="relative h-96 rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={category.image_full_path || "/placeholder.svg"}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="text-center">
                <button className="px-8 py-4 bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  Browse {category.name} Services
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default OfferDetailPage
