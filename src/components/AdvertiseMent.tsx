"use client"

// components/AdvertisementList.tsx
import type React from "react"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import type { AdvertisementResponse, Advertisement } from "../types/advertisement"
import { motion, AnimatePresence } from "framer-motion"

interface AdvertisementListProps {
  token?: string
  limit?: number
  offset?: number
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.15
    }
  }
}

const headerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
}

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 60,
    scale: 0.9,
    rotateX: 15
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.7,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }),
  hover: {
    y: -8,
    scale: 1.02,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
}

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
}

const paginationVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
}

const emptyStateVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
}

const AdvertisementList: React.FC<AdvertisementListProps> = ({ token, limit = 5, offset = 1 }) => {
  const baseUrl = import.meta.env.VITE_API_URL || "https://admin.sarvoclub.com";
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
        `${baseUrl}/api/v1/customer/advertisements/ads-list?limit=${limit}&offset=${page}`,
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
      <motion.section 
        className="py-16 bg-gradient-to-b from-background to-secondary/20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((item, index) => (
              <motion.div
                key={item}
                variants={cardVariants}
                custom={index}
                className="group relative h-96 rounded-2xl overflow-hidden shadow-lg bg-muted animate-pulse"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted-foreground/10" />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    )
  }

  if (error) {
    return (
      <motion.section 
        className="py-16 bg-gradient-to-b from-background to-secondary/20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="bg-destructive/5 border-2 border-destructive/20 rounded-2xl p-8 text-center max-w-md mx-auto"
            variants={emptyStateVariants}
          >
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <h3 className="text-xl font-bold mb-3 text-foreground">Error Loading Advertisements</h3>
            <p className="mb-6 text-muted-foreground">{error}</p>
            <Button onClick={() => fetchAdvertisements()} variant="destructive" className="font-semibold">
              Try Again
            </Button>
          </motion.div>
        </div>
      </motion.section>
    )
  }

  return (
    <motion.section 
      className="py-20 bg-gradient-to-b from-background via-secondary/10 to-background"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          variants={headerVariants}
        >
          <motion.div 
            className="inline-block mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-sm font-semibold tracking-wider uppercase text-primary bg-primary/10 px-4 py-2 rounded-full">
              Featured
            </span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">Exclusive Promotions</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Discover amazing deals and premium services from our trusted providers
          </p>
        </motion.div>

        {/* Advertisement Grid */}
        {advertisements.length === 0 ? (
          <motion.div 
            className="text-center py-20"
            variants={emptyStateVariants}
          >
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">📢</span>
            </div>
            <p className="text-muted-foreground text-lg font-medium">No advertisements available at the moment.</p>
          </motion.div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {advertisements.map((ad, index) => (
                  <motion.div
                    key={ad.id}
                    custom={index}
                    variants={cardVariants}
                    whileHover="hover"
                    layout
                    className="group relative h-[28rem] rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-border/50"
                  >
                    {/* Background Image */}
                    <div className="absolute inset-0 bg-background">
                      <motion.img
                        src={ad.provider_cover_image_full_path || ad.provider_profile_image_full_path}
                        alt={ad.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src =
                            "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                        }}
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.7 }}
                      />
                    </div>

                    {/* Gradient Overlay */}
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${getGradientByType(ad.type)} backdrop-blur-[0.5px]`}
                      whileHover={{ backdropBlur: "2px" }}
                      transition={{ duration: 0.3 }}
                    />

                    {/* Status Badge */}
                    <motion.div 
                      className="absolute top-5 right-5"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 + 0.5 }}
                    >
                      <span
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md border ${
                          ad.status === "approved"
                            ? "bg-green-500/20 text-green-100 border-green-400/30"
                            : "bg-yellow-500/20 text-yellow-100 border-yellow-400/30"
                        }`}
                      >
                        {ad.status}
                      </span>
                    </motion.div>

                    {/* Provider Badge */}
                    <motion.div 
                      className="absolute top-5 left-5 flex items-center"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 + 0.4 }}
                    >
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
                    </motion.div>

                    {/* Content */}
                    <div className="relative h-full flex flex-col justify-end p-7 text-white">
                      {/* Rating */}
                      <motion.div 
                        className="flex items-center mb-3 backdrop-blur-sm bg-white/10 rounded-lg px-3 py-1.5 w-fit border border-white/20"
                        variants={contentVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 + 0.3 }}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="text-yellow-300 text-base">⭐</span>
                          <span className="text-sm font-bold">{ad.provider_rating}</span>
                          <span className="text-xs text-white/70">({ad.provider_review})</span>
                        </div>
                      </motion.div>

                      {/* Title & Description */}
                      <motion.h3 
                        className="text-2xl font-bold mb-2 line-clamp-2 text-balance leading-tight"
                        variants={contentVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 + 0.4 }}
                      >
                        {ad.title}
                      </motion.h3>

                      <motion.p 
                        className="text-sm mb-4 text-white/90 line-clamp-2 text-pretty leading-relaxed"
                        variants={contentVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 + 0.5 }}
                      >
                        {ad.description}
                      </motion.p>

                      {/* Additional Info */}
                      <motion.div 
                        className="text-xs text-white mb-5 space-y-2 backdrop-blur-sm bg-white/10 rounded-lg p-3 border border-white/10"
                        variants={contentVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 + 0.6 }}
                      >
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
                      </motion.div>

                      {/* Action Button */}
                      <motion.div 
                        className="flex items-center justify-between gap-3"
                        variants={contentVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 + 0.7 }}
                      >
                        {/* Action buttons can be added here */}
                      </motion.div>
                    </div>

                    {/* Hover Effects */}
                    <motion.div 
                      className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      whileHover={{ opacity: 0.2 }}
                    />
                    
                    <motion.div 
                      className="absolute inset-0 border-2 border-transparent group-hover:border-white/30 rounded-2xl transition-all duration-300"
                      whileHover={{ borderColor: "rgba(255,255,255,0.3)" }}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div 
                className="flex justify-center items-center gap-2 mt-16"
                variants={paginationVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
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
              </motion.div>
            )}
          </>
        )}
      </div>
    </motion.section>
  )
}

export default AdvertisementList