"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, Grid3x3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Footer from "@/components/Footer"
import Header from "@/components/Header"

interface Category {
  id: string
  name: string
  image: string
  image_full_path: string
  is_active: number
  parent_id: string | null
  position: number
  description: string
  services_count: number
}

interface ApiResponse {
  response_code: string
  message: string
  content: {
    data: Category[]
    current_page: number
    total: number
    per_page: number
    last_page: number
  }
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCategories(offset = 1, limit = 100) {
      const baseUrl = import.meta.env.VITE_API_URL || "https://admin.sarvoclub.com";
      const url = `${baseUrl}/api/v1/customer/category?offset=${offset}&limit=${limit}`

      const headers = {
        "Content-Type": "application/json; charset=UTF-8",
        zoneId: "a02c55ff-cb84-4bbb-bf91-5300d1766a29",
        "X-localization": "en",
        guest_id: "7e223db0-9f62-11f0-bba0-779e4e64bbc8",
      }

      try {
        const response = await fetch(url, { headers })

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data: ApiResponse = await response.json()

        if (data.response_code === "default_200" && data.content?.data) {
          const activeCategories = data.content.data.filter((category) => category.is_active === 1)
          setCategories(activeCategories)
        } else {
          throw new Error("Invalid response format")
        }
      } catch (err) {
        console.error("Error fetching categories:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch categories")
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
          <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-32 mb-4 animate-pulse" />
              <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-64 mb-3 animate-pulse" />
              <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-96 animate-pulse" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden animate-pulse"
                >
                  <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300" />
                  <div className="p-5">
                    <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded mb-3" />
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4 mb-3" />
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24" />
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
            <Button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
            >
              Try Again
            </Button>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />

        <div className="relative container mx-auto px-4 py-8">
          <div className="mb-12">
            <Link to="/">
              <Button variant="ghost" className="mb-6 hover:bg-white/50">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>

           

            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-black">Browse All Categories</h1>
            <p className="text-lg text-gray-600 max-w-2xl leading-relaxed">
              Explore our complete collection of {categories.length} service categories
            </p>
          </div>

          {categories.length === 0 ? (
            <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Grid3x3 className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg font-medium">No services available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/category/${category.id}`}
                  className="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden hover:-translate-y-2 border border-white/50"
                >
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
                    <img
                      src={category.image_full_path || "/placeholder.svg"}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder.svg?height=200&width=400"
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />

                    {category.services_count > 0 && (
                      <div className="absolute top-4 right-4">
                        <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold text-gray-700 shadow-lg border border-white/50">
                          {category.services_count} services
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300 text-lg">
                      {category.name}
                    </h3>

                    {category.description && (
                      <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed mb-3">{category.description}</p>
                    )}

                    <div className="flex items-center gap-2 text-sm font-medium text-blue-600 group-hover:text-purple-600 transition-colors duration-300">
                      <span>Explore services</span>
                      <svg
                        className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}
