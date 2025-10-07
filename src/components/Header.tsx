"use client"

import { Heart, ShoppingCart, User, Menu, Search, ChevronDown, X } from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import logo from "../assets/logo.jpeg"

interface Service {
  id: string
  name: string
  short_description: string
  description: string
  thumbnail_full_path: string
  variations_app_format: {
    default_price: number
    zone_wise_variations: Array<{
      variant_name: string
      price: number
    }>
  }
  category: {
    name: string
  }
}

interface SearchResults {
  services: Service[]
  total: number
}

const Header = () => {
  const [cartCount, setCartCount] = useState(0)
  const [favoritesCount, setFavoritesCount] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResults>({ services: [], total: 0 })
  const [isSearching, setIsSearching] = useState(false)
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [allServices, setAllServices] = useState<Service[]>([])
  const [servicesLoaded, setServicesLoaded] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    fetchCartCount()
    fetchFavoritesCount()
    loadAllServices()

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Load all services for client-side search
  const loadAllServices = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || "https://admin.sarvoclub.com"
      const response = await fetch(`${baseUrl}/api/v1/customer/service?limit=100&offset=1`, {
        headers: {
          "Content-Type": "application/json",
          zoneId: "a02c55ff-cb84-4bbb-bf91-5300d1766a29",
          "X-localization": "en",
          guest_id: "7e223db0-9f62-11f0-bba0-779e4e64bbc8",
          "Accept-Encoding": "gzip, deflate, br",
        },
      })

      const data = await response.json()

      if (data.response_code === "default_200" && data.content.data) {
        setAllServices(data.content.data)
        setServicesLoaded(true)
      }
    } catch (err) {
      console.error("Error loading services for search:", err)
    }
  }

  // Client-side search function
  useEffect(() => {
    if (!servicesLoaded) return

    if (searchQuery.trim() === "") {
      setSearchResults({ services: [], total: 0 })
      setShowSearchResults(false)
      return
    }

    setIsSearching(true)
    setShowSearchResults(true)

    // Simulate slight delay for better UX
    const delayDebounceFn = setTimeout(() => {
      performClientSearch(searchQuery)
    }, 200)

    return () => clearTimeout(delayDebounceFn)
  }, [searchQuery, servicesLoaded])

  const performClientSearch = (query: string) => {
    if (!query.trim() || allServices.length === 0) {
      setSearchResults({ services: [], total: 0 })
      setIsSearching(false)
      return
    }

    const lowercaseQuery = query.toLowerCase().trim()

    // Filter services based on search query
    const filteredServices = allServices.filter(service =>
      service.name.toLowerCase().includes(lowercaseQuery) ||
      service.short_description.toLowerCase().includes(lowercaseQuery) ||
      service.category.name.toLowerCase().includes(lowercaseQuery) ||
      (service.description && service.description.toLowerCase().includes(lowercaseQuery))
    )

    setSearchResults({
      services: filteredServices,
      total: filteredServices.length
    })
    setIsSearching(false)
  }

  const fetchCartCount = async () => {
    const token = localStorage.getItem("demand_token")
    if (!token) return

    try {
      const response = await fetch(
        "https://admin.sarvoclub.com/api/v1/customer/cart/list?limit=100&offset=1",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "X-localization": "en",
            zoneId: "a02c55ff-cb84-4bbb-bf91-5300d1766a29",
            guest_id: "7e223db0-9f62-11f0-bba0-779e4e64bbc8",
            "Accept-Charset": "UTF-8",
          },
        }
      )

      if (response.ok) {
        const data = await response.json()
        if (data.response_code === "default_200") {
          setCartCount(data.content.cart.total)
        }
      }
    } catch (error) {
      console.error("Failed to fetch cart count:", error)
    }
  }

  const fetchFavoritesCount = async () => {
    const token = localStorage.getItem("demand_token")
    if (!token) return

    try {
      const baseUrl = import.meta.env.VITE_API_URL || "https://admin.sarvoclub.com"
      const response = await fetch(`${baseUrl}/api/v1/customer/favorite/service-list?offset=1&limit=100`, {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
          "zoneId": "a02c55ff-cb84-4bbb-bf91-5300d1766a29",
          "X-localization": "en",
          "guest_id": "7e223db0-9f62-11f0-bba0-779e4e64bbc8",
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.response_code?.includes("200") && data.content?.data) {
          setFavoritesCount(data.content.total)
        }
      }
    } catch (error) {
      console.error("Failed to fetch favorites count:", error)
    }
  }

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleSearchInputFocus = () => {
    if (searchQuery.trim() && searchResults.services.length > 0) {
      setShowSearchResults(true)
    } else if (servicesLoaded) {
      // Show some popular services when focusing on empty search
      setShowSearchResults(true)
      setSearchResults({
        services: allServices.slice(0, 5), // Show first 5 services as suggestions
        total: allServices.length
      })
    }
  }

  const clearSearch = () => {
    setSearchQuery("")
    setSearchResults({ services: [], total: 0 })
    setShowSearchResults(false)
  }

  const handleServiceClick = (serviceId: string) => {
    setShowSearchResults(false)
    setSearchQuery("")
    navigate(`/service/${serviceId}`)
  }

  const handleViewAllResults = () => {
    setShowSearchResults(false)
    navigate(`/allservices?search=${encodeURIComponent(searchQuery)}`)
  }

  const isActiveLink = (path: string) => {
    return location.pathname === path
  }

  // Get display services - either search results or popular suggestions
  const getDisplayServices = () => {
    if (searchQuery.trim() && searchResults.services.length > 0) {
      return searchResults.services
    } else if (!searchQuery.trim() && showSearchResults) {
      // Show popular services when search is empty but dropdown is open
      return allServices.slice(0, 5)
    }
    return []
  }

  const displayServices = getDisplayServices()

  return (
    <>
      <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50'
          : 'bg-white border-b border-gray-100'
        }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 shrink-0 group">
              <div className="relative">
                <img
                  src={logo || "/placeholder.svg"}
                  alt="SarvoClub"
                  className="w-8 h-8 lg:w-10 lg:h-10 object-contain rounded-lg transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl lg:text-2xl bg-gradient-to-r from-blue-600 to-green-700 bg-clip-text text-transparent">
                  SarvoClub
                </span>
                <span className="text-xs text-gray-500 hidden lg:block">Premium Services</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8 flex-1 max-w-2xl justify-center">
              <Link
                to="/allservices"
                className={`relative font-medium transition-all duration-300 group ${isActiveLink('/allservices')
                    ? 'text-blue-600 font-semibold'
                    : 'text-gray-700 hover:text-blue-600'
                  }`}
              >
                Services
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full ${isActiveLink('/allservices') ? 'w-full' : ''
                  }`} />
              </Link>
              <Link
                to="/categories"
                className={`relative font-medium transition-all duration-300 group ${isActiveLink('/categories')
                    ? 'text-blue-600 font-semibold'
                    : 'text-gray-700 hover:text-blue-600'
                  }`}
              >
                Categories
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full ${isActiveLink('/categories') ? 'w-full' : ''
                  }`} />
              </Link>
              <Link
                to="/#trending"
                className={`relative font-medium transition-all duration-300 group text-gray-700 hover:text-blue-600`}
                onClick={(e) => {
                  if (location.pathname === "/") {
                    e.preventDefault();
                    document.getElementById("trending")?.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                Trending
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full`} />
              </Link>
            </nav>

            {/* Search Bar - Desktop */}
            <div ref={searchRef} className="hidden lg:flex items-center flex-1 max-w-md mx-8 relative">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  onFocus={handleSearchInputFocus}
                  className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Search Results Dropdown */}
              {showSearchResults && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-96 overflow-y-auto z-50">
                  {!servicesLoaded ? (
                    <div className="p-4 text-center text-gray-500">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="mt-2">Loading services...</p>
                    </div>
                  ) : isSearching ? (
                    <div className="p-4 text-center text-gray-500">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="mt-2">Searching...</p>
                    </div>
                  ) : displayServices.length > 0 ? (
                    <>
                      <div className="p-3 border-b border-gray-100">
                        <p className="text-sm text-gray-600">
                          {searchQuery.trim() ? (
                            <>Found {searchResults.total} result{searchResults.total !== 1 ? 's' : ''}</>
                          ) : (
                            "Popular Services"
                          )}
                        </p>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {displayServices.slice(0, 5).map((service) => (
                          <div
                            key={service.id}
                            onClick={() => handleServiceClick(service.id)}
                            className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors last:border-b-0"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={service.thumbnail_full_path || "/placeholder.svg"}
                                alt={service.name}
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900 truncate">
                                  {service.name}
                                </h4>
                                <p className="text-sm text-gray-600 truncate">
                                  {service.short_description}
                                </p>
                                <div className="flex items-center justify-between mt-1">
                                  <span className="text-xs text-gray-500 capitalize">
                                    {service.category.name}
                                  </span>
                                  <span className="text-sm font-semibold text-blue-600">
                                    ₹{service.variations_app_format.default_price}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {searchQuery.trim() && searchResults.total > 5 && (
                        <div className="p-3 border-t border-gray-100 bg-gray-50">
                          <button
                            onClick={handleViewAllResults}
                            className="w-full text-center text-blue-600 hover:text-blue-700 font-medium text-sm py-2"
                          >
                            View all {searchResults.total} results
                          </button>
                        </div>
                      )}
                    </>
                  ) : searchQuery.trim() ? (
                    <div className="p-4 text-center text-gray-500">
                      <p>No services found for "{searchQuery}"</p>
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      <p>No services available</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Section: Actions */}
            <div className="flex items-center gap-3 lg:gap-4">
              {/* Cart */}
              <Link
                to="/cart"
                className="relative p-2.5 bg-gray-50 rounded-xl hover:bg-blue-50 transition-all duration-300 group"
                aria-label="Cart"
              >
                <ShoppingCart className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>

              {/* Favorites */}
              <Link
                to="/favorites"
                className="relative p-2.5 bg-gray-50 rounded-xl hover:bg-pink-50 transition-all duration-300 group"
                aria-label="Favorites"
              >
                <Heart className="w-5 h-5 text-gray-600 group-hover:text-pink-600 transition-colors" />
                {favoritesCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                    {favoritesCount > 99 ? '99+' : favoritesCount}
                  </span>
                )}
              </Link>

              {/* Profile */}
              <Link
                to="/profile"
                className="p-2.5 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl hover:from-blue-600 hover:to-green-600 transition-all duration-300 group shadow-lg hover:shadow-xl"
                aria-label="Profile"
              >
                <User className="w-5 h-5 text-white" />
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2.5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                aria-label="Menu"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="container mx-auto px-4 py-4">
              {/* Mobile Search */}
              {/* <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div> */}

              {/* Mobile Navigation */}
              <nav className="flex flex-col space-y-3">
                <Link
                  to="/allservices"
                  className={`px-4 py-3 rounded-xl font-medium transition-all duration-300 ${isActiveLink('/allservices')
                      ? 'bg-blue-50 text-blue-600 border border-blue-200'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Services
                </Link>
                <Link
                  to="/categories"
                  className={`px-4 py-3 rounded-xl font-medium transition-all duration-300 ${isActiveLink('/categories')
                      ? 'bg-blue-50 text-blue-600 border border-blue-200'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Categories
                </Link>
                <Link
                  to="/#trending"
                  className={`px-4 py-3 rounded-xl font-medium transition-all duration-300 bg-gray-50 text-gray-700 hover:bg-gray-100`}
                  onClick={(e) => {
                    if (location.pathname === "/") {
                      e.preventDefault();
                      document.getElementById("trending")?.scrollIntoView({ behavior: "smooth" });
                    }
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Trending
                </Link>
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  )
}

export default Header