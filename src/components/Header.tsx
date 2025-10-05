"use client"

import { MapPin, Search, ShoppingCart, User, X } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import logo from "../assets/logo.jpeg"
import { useState, useEffect, useRef } from "react"

interface SearchResult {
  id: string
  name: string
  type: "service" | "category"
  image?: string
  short_description?: string
}

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim().length > 2) {
        performSearch(searchQuery)
      } else {
        setSearchResults([])
        setShowDropdown(false)
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [searchQuery])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const performSearch = async (query: string) => {
    setIsSearching(true)
    try {
      const baseUrl = import.meta.env.VITE_API_URL || "https://admin.sarvoclub.com"

      // Search services
      const servicesResponse = await fetch(`${baseUrl}/api/v1/customer/service?limit=5&offset=1`, {
        headers: {
          "Content-Type": "application/json",
          zoneId: "a02c55ff-cb84-4bbb-bf91-5300d1766a29",
          "X-localization": "en",
          guest_id: "7e223db0-9f62-11f0-bba0-779e4e64bbc8",
          "Accept-Encoding": "gzip, deflate, br",
        },
      })

      const servicesData = await servicesResponse.json()

      // Filter services based on search query
      const filteredServices =
        servicesData.content?.data
          ?.filter((service: any) => service.name.toLowerCase().includes(query.toLowerCase()))
          .slice(0, 5)
          .map((service: any) => ({
            id: service.id,
            name: service.name,
            type: "service" as const,
            image: service.thumbnail_full_path,
            short_description: service.short_description,
          })) || []

      setSearchResults(filteredServices)
      setShowDropdown(filteredServices.length > 0)
    } catch (error) {
      console.error("Search error:", error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleSelectResult = (result: SearchResult) => {
    if (result.type === "service") {
      navigate(`/service/${result.id}`)
    } else {
      navigate(`/services/${result.id}`)
    }
    setSearchQuery("")
    setShowDropdown(false)
  }

  const handleClearSearch = () => {
    setSearchQuery("")
    setSearchResults([])
    setShowDropdown(false)
  }

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src={logo || "/placeholder.svg"} alt="SarvoClub" className="w-5 h-5 object-contain" />
            <span className="font-bold text-lg hidden sm:inline">SarvoClub</span>
          </Link>

          {/* Center Section: Location & Search */}
          <div className="flex items-center gap-4 flex-1 max-w-2xl">
            {/* Location Selector */}
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-secondary transition-colors shrink-0">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm hidden md:inline">Connaught Place, New...</span>
            </button>

            <div className="flex-1 relative" ref={searchRef}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search for services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
                className="w-full pl-10 pr-10 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {showDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg max-h-96 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                  {isSearching ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">Searching...</div>
                  ) : searchResults.length > 0 ? (
                    <div className="py-2">
                      {searchResults.map((result) => (
                        <button
                          key={result.id}
                          onClick={() => handleSelectResult(result)}
                          className="w-full px-4 py-3 flex items-center gap-3 hover:bg-secondary transition-colors text-left"
                        >
                          {result.image && (
                            <img
                              src={result.image || "/placeholder.svg"}
                              alt={result.name}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">{result.name}</div>
                            {result.short_description && (
                              <div className="text-xs text-muted-foreground truncate">{result.short_description}</div>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground capitalize px-2 py-1 bg-secondary rounded">
                            {result.type}
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-sm text-muted-foreground">No results found</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 shrink-0">
            <Link to="/cart" className="hidden sm:flex">
              <ShoppingCart className="w-5 h-5" />
            </Link>
            <Link to="/login">
              <User className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

export { Header }
export default Header
