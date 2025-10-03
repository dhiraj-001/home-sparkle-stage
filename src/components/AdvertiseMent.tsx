"use client"

// components/AdvertisementList.tsx
import type React from "react"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import type { AdvertisementResponse, Advertisement } from "../types/advertisement"

interface AdvertisementListProps {
  token?: string
  limit?: number
  offset?: number
}

const AdvertisementList: React.FC<AdvertisementListProps> = ({ token, limit = 5, offset = 1 }) => {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(offset)
  const [totalPages, setTotalPages] = useState<number>(1)

  // Color gradients based on advertisement type
  const getGradientByType = (type: string) => {
    const gradients = {
      profile_promotion: "from-blue-600/90 via-blue-700/85 to-indigo-800/90",
      banner: "from-purple-600/90 via-fuchsia-700/85 to-pink-800/90",
      default: "from-slate-800/90 via-slate-900/85 to-gray-900/90",
    }

    return gradients[type as keyof typeof gradients] || gradients.default
  }

  const fetchAdvertisements = async (page: number = currentPage) => {
    try {
      setLoading(true)
      setError(null)

      const headers: HeadersInit = {
        "Content-Type": "application/json",
        zoneId: "a02c55ff-cb84-4bbb-bf91-5300d1766a29",
        "X-localization": "en",
        guest_id: "7e223db0-9f62-11f0-bba0-779e4e64bbc8",
        "Accept-Charset": "UTF-8",
      }

      if (token) {
        headers["Authorization"] = `Bearer ${token}`
      }

      const response = await fetch(
        `https://admin.sarvoclub.com/api/v1/customer/advertisements/ads-list?limit=${limit}&offset=${page}`,
        {
          method: "GET",
          headers: headers,
        },
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: AdvertisementResponse = await response.json()

      if (data.response_code === "default_200") {
        setAdvertisements(data.content.data)
        setCurrentPage(data.content.current_page)
        setTotalPages(data.content.last_page)
      } else {
        throw new Error(data.message || "Failed to fetch advertisements")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAdvertisements()
  }, [])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    fetchAdvertisements(page)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="group relative h-96 rounded-2xl overflow-hidden shadow-lg bg-muted animate-pulse"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted-foreground/10" />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto px-4">
          <div className="bg-destructive/5 border-2 border-destructive/20 rounded-2xl p-8 text-center max-w-md mx-auto">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <h3 className="text-xl font-bold mb-3 text-foreground">Error Loading Advertisements</h3>
            <p className="mb-6 text-muted-foreground">{error}</p>
            <Button onClick={() => fetchAdvertisements()} variant="destructive" className="font-semibold">
              Try Again
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gradient-to-b from-background via-secondary/10 to-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="text-sm font-semibold tracking-wider uppercase text-primary bg-primary/10 px-4 py-2 rounded-full">
              Featured
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">Exclusive Promotions</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Discover amazing deals and premium services from our trusted providers
          </p>
        </div>

        {/* Advertisement Grid */}
        {advertisements.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">📢</span>
            </div>
            <p className="text-muted-foreground text-lg font-medium">No advertisements available at the moment.</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {advertisements.map((ad) => (
                <Link
                  key={ad.id}
                  to={`/advertisement/${ad.id}`}
                  className="group relative h-[28rem] rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] border border-border/50"
                >
                  {/* Background Image */}
                  <div className="absolute inset-0 bg-background">
                    <img
                      src={ad.provider_cover_image_full_path || ad.provider_profile_image_full_path}
                      alt={ad.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src =
                          "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                      }}
                    />
                  </div>

                  {/* Gradient Overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${getGradientByType(ad.type)} backdrop-blur-[0.5px]`}
                  />

                  {/* Status Badge */}
                  <div className="absolute top-5 right-5">
                    <span
                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md border ${
                        ad.status === "approved"
                          ? "bg-green-500/20 text-green-100 border-green-400/30"
                          : "bg-yellow-500/20 text-yellow-100 border-yellow-400/30"
                      }`}
                    >
                      {ad.status}
                    </span>
                  </div>

                  {/* Provider Badge */}
                  <div className="absolute top-5 left-5 flex items-center">
                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border-2 border-white/30 p-0.5 shadow-lg">
                      <img
                        src={ad.provider.logo_full_path || "/placeholder.svg"}
                        alt={ad.provider.company_name}
                        className="w-full h-full rounded-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "https://via.placeholder.com/40?text=LOGO"
                        }}
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative h-full flex flex-col justify-end p-7 text-white">
                    {/* Rating */}
                    <div className="flex items-center mb-3 backdrop-blur-sm bg-white/10 rounded-lg px-3 py-1.5 w-fit border border-white/20">
                      <div className="flex items-center gap-1.5">
                        <span className="text-yellow-300 text-base">⭐</span>
                        <span className="text-sm font-bold">{ad.provider_rating}</span>
                        <span className="text-xs text-white/70">({ad.provider_review})</span>
                      </div>
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-2xl font-bold mb-2 line-clamp-2 text-balance leading-tight">{ad.title}</h3>

                    <p className="text-sm mb-4 text-white/90 line-clamp-2 text-pretty leading-relaxed">
                      {ad.description}
                    </p>

                    {/* Additional Info */}
                    <div className="text-xs text-white/80 mb-5 space-y-2 backdrop-blur-sm bg-white/5 rounded-lg p-3 border border-white/10">
                      <p className="flex items-center gap-2">
                        <span className="text-sm">📅</span>
                        <span className="font-medium">
                          {formatDate(ad.start_date)} - {formatDate(ad.end_date)}
                        </span>
                      </p>
                      {ad.is_paid === 1 && (
                        <p className="flex items-center gap-2">
                          <span className="text-sm">💎</span>
                          <span className="font-medium">Paid Promotion</span>
                        </p>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="flex items-center justify-between gap-3">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="bg-white text-foreground hover:bg-white/90 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex-1"
                        onClick={(e) => e.preventDefault()}
                      >
                        View Details →
                      </Button>

                      {/* Priority Indicator */}
                      {ad.priority > 0 && (
                        <span className="text-xs bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full font-semibold border border-white/30 whitespace-nowrap">
                          Priority {ad.priority}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-16">
                <Button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  variant="outline"
                  size="sm"
                  className="font-semibold"
                >
                  ← Previous
                </Button>

                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      className={currentPage === page ? "font-bold shadow-lg" : "font-medium"}
                    >
                      {page}
                    </Button>
                  ))}
                </div>

                <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  size="sm"
                  className="font-semibold"
                >
                  Next →
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}

export default AdvertisementList
