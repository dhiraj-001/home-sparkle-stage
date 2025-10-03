"use client"

import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { ArrowLeft, Star, Users, Calendar, ChevronLeft, ChevronRight, Sparkles } from "lucide-react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

interface Translation {
  id: string
  translationable_type: string
  translationable_id: string
  locale: string
  key: string
  value: string
  created_at: string
  updated_at: string
}

interface SubCategory {
  id: string
  parent_id: string
  name: string
  image: string
  position: number
  description: string
  is_active: number
  is_featured: number
  created_at: string
  updated_at: string
  services_count: number
  image_full_path: string
  translations: Translation[]
}

interface ServiceDetailsResponse {
  response_code: string
  message: string
  content: {
    current_page: number
    data: SubCategory[]
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
}

const ServiceDetails = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [subCategories, setSubCategories] = useState<SubCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)

  useEffect(() => {
    if (id) {
      fetchServiceDetails(currentPage)
    }
  }, [id, currentPage])

  const fetchServiceDetails = async (page: number) => {
    try {
      setLoading(true)
      const baseUrl = import.meta.env.VITE_API_URL || "https://admin.sarvoclub.com"
      const response = await fetch(`${baseUrl}/api/v1/customer/category/childes?id=${id}&limit=12&offset=${page}`, {
        headers: {
          "Content-Type": "application/json",
          zoneId: "a02c95ff-cb84-4bbb-bf91-5300d1766a20",
          "X-localization": "en",
          guest_id: "7e223db0-9f62-11f0-bba0-779e4e64bbc8",
          "Accept-Charset": "UTF-8",
          Accept: "application/json",
        },
      })

      const data: ServiceDetailsResponse = await response.json()

      if (data.response_code === "default_200" && data.content.data) {
        setSubCategories(data.content.data)
        setTotalPages(data.content.last_page)
        setTotalItems(data.content.total)
      } else {
        throw new Error("Failed to fetch service details")
      }
    } catch (err) {
      console.error("Error fetching service details:", err)
      setError("Failed to load service details")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
          <div className="container mx-auto px-4 py-12">
            <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-48 mb-8 animate-pulse" />
            <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-96 mb-4 animate-pulse" />
            <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-64 mb-12 animate-pulse" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden animate-pulse"
                >
                  <div className="h-64 bg-gradient-to-br from-gray-200 to-gray-300" />
                  <div className="p-6">
                    <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded mb-3" />
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4 mb-4" />
                    <div className="flex justify-between items-center">
                      <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20" />
                      <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24" />
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
              onClick={() => fetchServiceDetails(currentPage)}
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
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors duration-300 mb-8 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-semibold">Back</span>
          </button>

          <div className="mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-blue-200/50 text-blue-600 px-6 py-3 rounded-full text-sm font-semibold mb-6 shadow-lg">
              <Sparkles className="w-5 h-5" />
              Service Categories
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-black">Explore Our Services</h1>
            <p className="text-lg text-gray-600 max-w-2xl leading-relaxed">
              {totalItems > 0
                ? `Discover ${totalItems} amazing service${totalItems !== 1 ? "s" : ""} tailored to your needs`
                : "Browse through our curated selection of services"}
            </p>
          </div>

          {subCategories.length === 0 ? (
            <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg font-medium">No services available in this category yet.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {subCategories.map((subCategory) => (
                  <Link
                    key={subCategory.id}
                    to={`/service/${subCategory.id}`}
                    className="group relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden hover:-translate-y-2 border border-white/50"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={subCategory.image_full_path || "/placeholder.svg"}
                        alt={subCategory.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />

                      {subCategory.is_featured === 1 && (
                        <div className="absolute top-4 left-4">
                          <div className="flex items-center gap-1.5 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
                            <Star className="w-3.5 h-3.5 fill-white" />
                            <span>Featured</span>
                          </div>
                        </div>
                      )}

                      {subCategory.services_count > 0 && (
                        <div className="absolute bottom-4 left-4">
                          <div className="flex items-center gap-1.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
                            <Users className="w-3.5 h-3.5" />
                            <span>
                              {subCategory.services_count} service{subCategory.services_count !== 1 ? "s" : ""}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300 text-lg">
                        {subCategory.name}
                      </h3>

                      <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                        {subCategory.description ||
                          "Explore this service category to find the perfect solution for you."}
                      </p>

                      <div className="flex items-center gap-2 text-xs text-gray-500 pt-4 border-t border-gray-100">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Added {formatDate(subCategory.created_at)}</span>
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  </Link>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200 hover:bg-blue-50 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-2">
                    {[...Array(totalPages)].map((_, i) => {
                      const page = i + 1
                      if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`min-w-[40px] h-10 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl ${
                              currentPage === page
                                ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                                : "bg-white/80 backdrop-blur-sm border border-gray-200 hover:bg-blue-50 hover:border-blue-300 text-gray-700"
                            }`}
                          >
                            {page}
                          </button>
                        )
                      } else if (page === currentPage - 2 || page === currentPage + 2) {
                        return (
                          <span key={page} className="text-gray-400">
                            ...
                          </span>
                        )
                      }
                      return null
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200 hover:bg-blue-50 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
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

export default ServiceDetails
