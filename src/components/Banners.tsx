"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import type { BannerItem } from "../types/banner"


const Banner: React.FC = () => {
  const navigate = useNavigate()
  const [banners, setBanners] = useState<BannerItem[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const baseUrl = import.meta.env.VITE_API_URL || "https://admin.sarvoclub.com"

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch(
          `${baseUrl}/api/v1/customer/banner?limit=10&offset=1`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Connection": "keep-alive",
              "zoneId": "a02c55ff-cb84-4bbb-bf91-5300d1766a29", // required
              "X-localization": "en", // required
              "guest_id": "7e223db0-9f62-11f0-bba0-779e4e64bbc8", // constant
              "Accept-Charset": "UTF-8",
            },
          }
        )
        const data = await response.json()
        if (data.response_code === "default_200" && data.content.data) {
          setBanners(data.content.data.filter((banner: BannerItem) => banner.is_active === 1))
        }
      } catch (error) {
        console.error("Failed to fetch banners:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBanners()
  }, [])

  useEffect(() => {
    if (!isAutoPlaying || banners.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, banners.length])

  const handleBannerClick = (banner: BannerItem) => {
    if (banner.redirect_link) {
      window.location.href = banner.redirect_link
    } else if (banner.resource_type === "service" && banner.service) {
      navigate(`/offer/${banner.resource_type}/${banner.resource_id}`)
    } else if (banner.resource_type === "category" && banner.category) {
      navigate(`/offer/${banner.resource_type}/${banner.resource_id}`)
    }
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length)
    setIsAutoPlaying(false)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length)
    setIsAutoPlaying(false)
  }

  if (loading) {
    return (
      <div className="relative w-full h-[500px] bg-gradient-to-br from-primary/10 via-accent/5 to-background animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  if (banners.length === 0) {
    return (
      <div className="relative w-full h-[500px] bg-gradient-to-br from-primary/10 via-accent/5 to-background flex items-center justify-center">
        <p className="text-muted-foreground text-lg">No banners available</p>
      </div>
    )
  }

  const currentBanner = banners[currentIndex]

  return (
    <div className="relative w-full h-[500px] lg:h-[600px] overflow-hidden group">
      <div
        className="flex transition-transform duration-700 ease-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {banners.map((banner) => (
          <div key={banner.id} className="min-w-full h-full relative">
            <img
              src={banner.banner_image_full_path || "/placeholder.svg"}
              alt={banner.banner_title}
              className="w-full h-full object-cover"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>

            {/* Content overlay */}
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-2xl space-y-6">
                  <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                    {banner.banner_title}
                  </h2>

                  {banner.resource_type === "service" && banner.service && (
                    <>
                      <p className="text-lg sm:text-xl text-white/90 leading-relaxed">
                        {banner.service.short_description}
                      </p>
                      <div className="flex items-center gap-4 text-white/80">
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="font-medium">{banner.service.avg_rating || "New"}</span>
                        </div>
                        <span className="text-2xl font-bold">₹{banner.service.min_bidding_price}</span>
                      </div>
                    </>
                  )}

                  {banner.resource_type === "category" && banner.category && (
                    <p className="text-lg sm:text-xl text-white/90 leading-relaxed">
                      Explore our {banner.category.name} services
                    </p>
                  )}

               
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {banners.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100"
            aria-label="Previous slide"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/20 backdrop-blur-sm hover:bg-black/40 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100"
            aria-label="Next slide"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {banners.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex ? "w-8 h-2 bg-white" : "w-2 h-2 bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Banner
