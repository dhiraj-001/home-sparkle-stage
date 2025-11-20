"use client";

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Search,
  Filter,
  Grid3x3,
  Star,
  TrendingUp,
  Zap,
  MapPin,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  image_full_path: string;
  services_count: number;
}

interface ServicesStickyNavbarProps {
  // Optional props for external control
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  sortBy?: string;
  onSortChange?: (sort: string) => void;
  showFilters?: boolean;
  onToggleFilters?: () => void;
  totalServices?: number;
  filteredServicesCount?: number;
  isLoading?: boolean;
}

const ServicesStickyNavbar: React.FC<ServicesStickyNavbarProps> = ({
  searchQuery: externalSearchQuery,
  onSearchChange,
  sortBy: externalSortBy,
  onSortChange,
  showFilters: externalShowFilters,
  onToggleFilters,
  totalServices = 0,
  filteredServicesCount = 0,
  isLoading = false,
}) => {
  const location = useLocation();
  
  // Internal state management
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [internalSearchQuery, setInternalSearchQuery] = useState("");
  const [internalSortBy, setInternalSortBy] = useState("name");
  const [internalShowFilters, setInternalShowFilters] = useState(false);

  // Use external props if provided, otherwise use internal state
  const searchQuery = externalSearchQuery !== undefined ? externalSearchQuery : internalSearchQuery;
  const sortBy = externalSortBy !== undefined ? externalSortBy : internalSortBy;
  const showFilters = externalShowFilters !== undefined ? externalShowFilters : internalShowFilters;

  // Handle search change
  const handleSearchChange = (query: string) => {
    if (onSearchChange) {
      onSearchChange(query);
    } else {
      setInternalSearchQuery(query);
    }
  };

  // Handle sort change
  const handleSortChange = (sort: string) => {
    if (onSortChange) {
      onSortChange(sort);
    } else {
      setInternalSortBy(sort);
    }
  };

  // Handle filter toggle
  const handleToggleFilters = () => {
    if (onToggleFilters) {
      onToggleFilters();
    } else {
      setInternalShowFilters(!internalShowFilters);
    }
  };

  // Fetch categories independently
  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const baseUrl = import.meta.env.VITE_API_URL || "https://admin.sarvoclub.com";
      const token = localStorage.getItem("demand_token");
      
      const headers: Record<string, string> = {
        "Content-Type": "application/json; charset=UTF-8",
        zoneId: "a02c55ff-cb84-4bbb-bf91-5300d1766a29",
        "X-localization": "en",
        guest_id: "7e223db0-9f62-11f0-bba0-779e4e64bbc8",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(
        `${baseUrl}/api/v1/customer/category?limit=50&offset=1`,
        {
          method: "GET",
          headers: headers,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.response_code === "default_200") {
        setCategories(data.content.data || []);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setCategoriesLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const sortOptions = [
    { value: "name", label: "Name", icon: <Grid3x3 className="w-4 h-4" /> },
    { value: "price-low", label: "Price: Low to High", icon: <TrendingUp className="w-4 h-4" /> },
    { value: "price-high", label: "Price: High to Low", icon: <TrendingUp className="w-4 h-4" /> },
    { value: "rating", label: "Highest Rated", icon: <Star className="w-4 h-4" /> },
    { value: "popular", label: "Most Popular", icon: <Zap className="w-4 h-4" /> },
  ];

  return (
    <div className=" top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
       

        {/* Categories Horizontal Navigation with Images */}
        {categories.length > 0 && (
          <div className="py-4">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="text-sm font-medium text-gray-700 flex-shrink-0">
                Browse Categories:
              </span>
            </div>

            {/* Horizontal Scroll Container */}
            <div className="relative">
              <div className="flex gap-3 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pb-3 -mb-3">
                {categoriesLoading ? (
                  // Loading skeleton for categories
                  Array.from({ length: 8 }).map((_, index) => (
                    <div
                      key={index}
                      className="flex-shrink-0 flex flex-col items-center p-3 rounded-2xl border border-gray-200 min-w-[100px] max-w-[120px] animate-pulse"
                    >
                      <div className="w-12 h-12 mb-2 rounded-xl bg-gray-200"></div>
                      <div className="h-3 bg-gray-200 rounded w-16 mb-1"></div>
                      <div className="h-4 bg-gray-200 rounded w-8"></div>
                    </div>
                  ))
                ) : (
                  categories.map((category) => {
                    const isActive = location.pathname === `/category/${category.id}`;
                    return (
                      <Link
                        key={category.id}
                        to={`/category/${category.id}`}
                        className={`flex-shrink-0 flex flex-col items-center p-3 rounded-2xl border min-w-[100px] max-w-[120px] transition-all duration-200 group
                          ${
                            isActive
                              ? "bg-blue-50 border-blue-300 shadow-md scale-[1.02]"
                              : "bg-white border-gray-200 hover:border-blue-200 hover:shadow-sm hover:scale-[1.03]"
                          }
                        `}
                      >
                        {/* Category Image */}
                        <div className="w-12 h-12 mb-2 rounded-xl overflow-hidden flex items-center justify-center bg-gray-100 relative">
                          {category.image_full_path ? (
                            <img
                              src={category.image_full_path}
                              alt={category.name}
                              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                              onError={(e) => {
                                // Fallback if image fails to load
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent) {
                                  parent.innerHTML = `
                                    <div class="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center rounded-xl">
                                      <span class="text-xs font-medium text-blue-600">
                                        ${category.name.charAt(0).toUpperCase()}
                                      </span>
                                    </div>
                                  `;
                                }
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center rounded-xl">
                              <span className="text-xs font-medium text-blue-600">
                                {category.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Category Name */}
                        <div
                          className={`text-xs font-semibold text-center mb-1 truncate w-full ${
                            isActive ? "text-blue-700" : "text-gray-800"
                          }`}
                        >
                          {category.name}
                        </div>

                        {/* Services Count */}
                        {/* <div
                          className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                            isActive
                              ? "bg-blue-100 text-blue-600"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {category.services_count || 0}
                        </div> */}
                      </Link>
                    );
                  })
                )}
              </div>

              {/* Gradient fade effect for scroll indication */}
              <div className="absolute right-0 top-0 bottom-3 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none" />
              <div className="absolute left-0 top-0 bottom-3 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none" />
            </div>
          </div>
        )}

        {/* Loading Bar */}
        {isLoading && (
          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500">
            <div className="h-full w-1/2 bg-gradient-to-r from-transparent via-white to-transparent animate-slide"></div>
          </div>
        )}
      </div>

      {/* Loading animation style */}
      <style jsx>{`
        @keyframes slide {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }
        .animate-slide {
          animation: slide 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ServicesStickyNavbar;