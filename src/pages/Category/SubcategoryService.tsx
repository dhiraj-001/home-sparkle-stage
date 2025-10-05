"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  Home,
  Search,
  Grid3x3,
  TrendingUp,
  ArrowRight,
  Star,
  Users,
  ShoppingCart,
  Heart,
  Zap,
  ArrowLeft,
  Filter,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface ServiceVariation {
  variant_key: string;
  variant_name: string;
  price: number;
}

interface Service {
  id: string;
  name: string;
  short_description: string;
  description: string;
  cover_image: string;
  thumbnail: string;
  category_id: string;
  sub_category_id: string;
  is_active: number;
  rating_count: number;
  avg_rating: number;
  min_bidding_price: string;
  is_favorite: number;
  variations_app_format: {
    zone_id: string;
    default_price: number;
    zone_wise_variations: ServiceVariation[];
  };
  thumbnail_full_path: string;
  cover_image_full_path: string;
  category: {
    id: string;
    name: string;
    image_full_path: string;
  };
  variations: Array<{
    id: number;
    variant: string;
    variant_key: string;
    price: number;
  }>;
  service_discount: any[];
  campaign_discount: Array<{
    id: number;
    discount: {
      discount_title: string;
      discount_amount: number;
      discount_amount_type: string;
    };
  }>;
}

interface ServiceResponse {
  response_code: string;
  message: string;
  content: {
    current_page: number;
    data: Service[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
  errors: any[];
}

interface Category {
  id: string;
  name: string;
  image_full_path: string;
  description: string;
}

const SubcategoryServices: React.FC = () => {
  const baseUrl = import.meta.env.VITE_API_URL || "https://admin.sarvoclub.com";
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const subcategoryId = id || "";
  const token = undefined;
  const [services, setServices] = useState<Service[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalServices, setTotalServices] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("name");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const fetchServices = async (page: number = currentPage) => {
    try {
      setLoading(true);
      setError(null);

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
        `${baseUrl}/api/v1/customer/service/sub-category/${subcategoryId}?limit=12&offset=${page}`,
        {
          method: "GET",
          headers: headers,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ServiceResponse = await response.json();

      if (data.response_code === "default_200") {
        setServices(data.content.data);
        setCurrentPage(data.content.current_page);
        setTotalPages(data.content.last_page);
        setTotalServices(data.content.total);
        
        // Extract category info from first service
        if (data.content.data.length > 0) {
          const firstService = data.content.data[0];
          setCategory({
            id: firstService.category_id,
            name: firstService.category.name,
            image_full_path: firstService.category.image_full_path,
            description: firstService.category.name + " Services"
          });
        }
      } else {
        throw new Error(data.message || "Failed to fetch services");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (subcategoryId) {
      fetchServices();
    }
  }, [subcategoryId]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchServices(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getStartingPrice = (service: Service) => {
    const variations = service.variations_app_format?.zone_wise_variations;
    if (variations && variations.length > 0) {
      return Math.min(...variations.map((v) => v.price));
    }
    return service.variations_app_format?.default_price || Number.parseInt(service.min_bidding_price) || 0;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Filter and sort services
  const filteredAndSortedServices = services
    .filter(service =>
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.short_description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(service => {
      const price = getStartingPrice(service);
      return price >= priceRange[0] && price <= priceRange[1];
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return getStartingPrice(a) - getStartingPrice(b);
        case "price-high":
          return getStartingPrice(b) - getStartingPrice(a);
        case "rating":
          return (b.avg_rating || 0) - (a.avg_rating || 0);
        case "popular":
          return (b.rating_count || 0) - (a.rating_count || 0);
        default:
          return a.name.localeCompare(b.name);
      }
    });

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
          {/* Header Skeleton */}
          <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white py-20">
            <div className="container mx-auto px-4">
              <div className="h-6 bg-white/20 rounded w-48 mb-4 animate-pulse"></div>
              <div className="h-12 bg-white/20 rounded w-96 mb-6 animate-pulse"></div>
              <div className="h-6 bg-white/20 rounded w-64 animate-pulse"></div>
            </div>
          </div>

          {/* Content Skeleton */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div
                    key={item}
                    className="group relative bg-white rounded-2xl overflow-hidden shadow-lg animate-pulse"
                  >
                    <div className="h-56 bg-gray-200"></div>
                    <div className="p-6">
                      <div className="h-6 bg-gray-200 rounded mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                      <div className="flex justify-between items-center">
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                        <div className="h-6 bg-gray-200 rounded w-24"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700 text-center max-w-2xl mx-auto">
                <h3 className="text-lg font-semibold mb-2">
                  Error Loading Services
                </h3>
                <p className="mb-4">{error}</p>
                <Button onClick={() => fetchServices()} variant="destructive">
                  Try Again
                </Button>
              </div>
            </div>
          </section>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header Section */}
        <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          </div>

          <div className="relative container mx-auto px-4 py-16">
            <nav className="flex items-center space-x-2 text-sm mb-6">
              <Link
                to="/"
                className="hover:text-white/80 transition-colors flex items-center"
              >
                <Home className="w-4 h-4 mr-1" />
                Home
              </Link>
              <ChevronRight className="w-4 h-4" />
              <Link
                to="/services"
                className="hover:text-white/80 transition-colors"
              >
                Services
              </Link>
              <ChevronRight className="w-4 h-4" />
              {category && (
                <Link
                  to={`/category/${category.id}`}
                  className="hover:text-white/80 transition-colors"
                >
                  {category.name}
                </Link>
              )}
              <ChevronRight className="w-4 h-4" />
              <span className="text-white/90">Services</span>
            </nav>

            <div className="max-w-4xl">
              <Button
                onClick={() => navigate(-1)}
                variant="ghost"
                className="mb-6 text-white hover:bg-white/20"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Categories
              </Button>

              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
                Available Services
              </h1>
              <p className="text-lg text-white/90 mb-8 text-pretty">
                Browse through our premium services and find exactly what you need
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm mb-1">Total Services</p>
                    <p className="text-3xl font-bold">{totalServices}</p>
                  </div>
                  <TrendingUp className="w-10 h-10 text-white/60" />
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm mb-1">Active Services</p>
                    <p className="text-3xl font-bold">
                      {services.filter(s => s.is_active === 1).length}
                    </p>
                  </div>
                  <div className="w-10 h-10 flex items-center justify-center">
                    <span className="text-2xl">✅</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm mb-1">Featured</p>
                    <p className="text-3xl font-bold">
                      {services.filter(s => s.is_favorite === 1).length}
                    </p>
                  </div>
                  <div className="w-10 h-10 flex items-center justify-center">
                    <span className="text-2xl">⭐</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {/* Search and Filter Bar */}
            <div className="flex flex-col lg:flex-row gap-6 mb-12">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search services..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={() => setShowFilters(!showFilters)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                </Button>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                >
                  <option value="name">Sort by Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Price Range
                    </label>
                    <div className="space-y-2">
                      <input
                        type="range"
                        min="0"
                        max="10000"
                        step="100"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>{formatPrice(priceRange[0])}</span>
                        <span>{formatPrice(priceRange[1])}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Availability
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" defaultChecked className="mr-2" />
                        <span className="text-sm">Available Now</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span className="text-sm">Featured</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Rating
                    </label>
                    <div className="space-y-2">
                      {[4, 3, 2, 1].map((rating) => (
                        <label key={rating} className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          <span className="text-sm flex items-center">
                            {rating}+ <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 ml-1" />
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-end">
                    <Button
                      onClick={() => {
                        setPriceRange([0, 10000]);
                        setShowFilters(false);
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Services Grid */}
            {filteredAndSortedServices.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
                  <Search className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg mb-2">
                  {searchQuery || priceRange[1] < 10000
                    ? "No services found matching your criteria"
                    : "No services available for this subcategory"}
                </p>
                {(searchQuery || priceRange[1] < 10000) && (
                  <Button
                    onClick={() => {
                      setSearchQuery("");
                      setPriceRange([0, 10000]);
                    }}
                    variant="outline"
                    className="mt-4"
                  >
                    Clear Search & Filters
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {filteredAndSortedServices.map((service) => (
                    <div
                      key={service.id}
                      className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
                    >
                      {/* Image Container */}
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={service.cover_image_full_path || service.thumbnail_full_path}
                          alt={service.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                          {service.is_favorite === 1 && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-red-500 text-white shadow-lg">
                              <Heart className="w-3 h-3 fill-current" />
                              Favorite
                            </span>
                          )}
                          {service.variations_app_format?.zone_wise_variations?.length > 1 && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-blue-500 text-white shadow-lg ml-auto">
                              <Zap className="w-3 h-3" />
                              {service.variations_app_format.zone_wise_variations.length}
                            </span>
                          )}
                        </div>

                        {/* Rating */}
                        <div className="absolute bottom-3 left-3">
                          <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold text-gray-900 shadow-lg">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span>{service.avg_rating || "New"}</span>
                            {service.rating_count > 0 && (
                              <span className="text-gray-600">({service.rating_count})</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="p-4">
                        <h3 className="font-bold text-gray-900 mb-2 line-clamp-1 text-lg">
                          {service.name}
                        </h3>

                        <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                          {service.short_description}
                        </p>

                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center">
                              <Users className="w-3 h-3 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Booked</p>
                              <p className="text-sm font-semibold text-gray-900">
                                {service.rating_count || 0}
                              </p>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                              {formatPrice(getStartingPrice(service))}
                            </div>
                            <div className="text-xs text-gray-500 font-medium">
                              starting price
                            </div>
                          </div>
                        </div>

                        {/* Action Button */}
                        <Link to={`/service/${service.id}`}>
                          <Button
                            className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold group/btn"
                            size="sm"
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            <span>Book Now</span>
                            <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      </div>

                      {/* Hover Effect Border */}
                      <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500 rounded-2xl transition-colors pointer-events-none" />
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2 mt-12">
                    <Button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      variant="outline"
                      size="sm"
                    >
                      Previous
                    </Button>

                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <Button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          variant={
                            currentPage === pageNum ? "default" : "outline"
                          }
                          size="sm"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}

                    <Button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      variant="outline"
                      size="sm"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default SubcategoryServices;