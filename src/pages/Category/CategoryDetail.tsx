"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  Home,
  Search,
  Grid3x3,
  TrendingUp,
  ArrowRight,
  Star,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Category {
  id: string;
  parent_id: string;
  name: string;
  image: string;
  position: number;
  description: string;
  is_active: number;
  is_featured: number;
  created_at: string;
  updated_at: string;
  services_count: number;
  image_full_path: string;
  translations: Array<{
    id: number;
    translationable_type: string;
    translationable_id: string;
    locale: string;
    key: string;
    value: string;
  }>;
  storage: null;
}

interface CategoryResponse {
  response_code: string;
  message: string;
  content: {
    current_page: number;
    data: Category[];
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

const CategoryChildList: React.FC = () => {
  const baseUrl = import.meta.env.VITE_API_URL || "https://admin.sarvoclub.com";
  const { id } = useParams<{ id: string }>();
  const categoryId = id || "";
  const token = undefined;
  const limit = 50;
  const offset = 1;
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(offset);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCategories, setTotalCategories] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const fetchCategories = async (page: number = currentPage) => {
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
        `${baseUrl}/api/v1/customer/category/childes?id=${categoryId}&limit=${limit}&offset=${page}`,
        {
          method: "GET",
          headers: headers,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: CategoryResponse = await response.json();
      console.log("service is", data);
      if (data.response_code === "default_200") {
        setCategories(data.content.data);
        setCurrentPage(data.content.current_page);
        setTotalPages(data.content.last_page);
        setTotalCategories(data.content.total);
      } else {
        throw new Error(data.message || "Failed to fetch categories");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (categoryId) {
      fetchCategories();
    }
  }, [categoryId]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchCategories(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getGradientByCategory = (category: Category) => {
    if (category.is_featured === 1) {
      return "from-amber-900/80 to-amber-700/60";
    }

    const gradients = [
      "from-blue-900/80 to-blue-700/60",
      "from-green-900/80 to-green-700/60",
      "from-purple-900/80 to-purple-700/60",
      "from-pink-900/80 to-pink-700/60",
      "from-indigo-900/80 to-indigo-700/60",
    ];

    return gradients[category.position % gradients.length] || gradients[0];
  };

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalServices = categories.reduce(
    (sum, cat) => sum + cat.services_count,
    0
  );

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white py-20">
            <div className="container mx-auto px-4">
              <div className="h-8 bg-white/20 rounded w-64 mb-4 animate-pulse"></div>
              <div className="h-12 bg-white/20 rounded w-96 mb-6 animate-pulse"></div>
              <div className="flex gap-8 mt-8">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-20 bg-white/20 rounded-lg w-48 animate-pulse"
                  ></div>
                ))}
              </div>
            </div>
          </div>

          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="group relative h-96 rounded-2xl overflow-hidden shadow-lg bg-gray-200 animate-pulse"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400" />
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
                  Error Loading Categories
                </h3>
                <p className="mb-4">{error}</p>
                <Button onClick={() => fetchCategories()} variant="destructive">
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
              <span className="text-white/90">Sub Categories</span>
            </nav>

            <div className="max-w-4xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
                Explore Sub Categories
              </h1>
              <p className="text-lg text-white/90 mb-8 text-pretty">
                Discover our comprehensive range of specialized services
                tailored to meet your needs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm mb-1">
                      Total Categories
                    </p>
                    <p className="text-3xl font-bold">{totalCategories}</p>
                  </div>
                  <Grid3x3 className="w-10 h-10 text-white/60" />
                </div>
              </div>

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
                    <p className="text-white/80 text-sm mb-1">Featured</p>
                    <p className="text-3xl font-bold">
                      {categories.filter((c) => c.is_featured === 1).length}
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

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto mb-12">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                />
              </div>
            </div>

            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-balance">
                Browse All Sub Categories
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg text-pretty">
                Select a category to explore our specialized services and find
                exactly what you need
              </p>
            </div>

            {/* Categories Grid */}
            {filteredCategories.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
                  <Search className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg mb-2">
                  {searchQuery
                    ? "No categories found matching your search"
                    : "No sub-categories found for this category"}
                </p>
                {searchQuery && (
                  <Button
                    onClick={() => setSearchQuery("")}
                    variant="outline"
                    className="mt-4"
                  >
                    Clear Search
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredCategories.map((category) => (
                    <div
                      key={category.id}
                      className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                    >
                      {/* Image Container */}
                      <div className="relative h-64 overflow-hidden">
                        <img
                          src={category.image_full_path || "/placeholder.svg"}
                          alt={category.name}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src =
                              "https://images.unsplash.com/photo-1558618047-3c8c76c7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
                          }}
                        />

                        {/* Gradient Overlay */}
                        <div
                          className={`absolute inset-0 bg-gradient-to-t ${getGradientByCategory(
                            category
                          )} opacity-60`}
                        />

                        {/* Top Badges */}
                        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                          {category.is_featured === 1 && (
                            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-400 text-amber-900 shadow-lg">
                              <Star className="w-3 h-3 fill-current" />
                              Featured
                            </span>
                          )}
                          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-white/90 text-gray-900 backdrop-blur-sm shadow-lg ml-auto">
                            {category.services_count} Services
                          </span>
                        </div>

                        {/* Category Name Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                          <h3 className="text-2xl font-bold text-white mb-1 line-clamp-2">
                            {category.name}
                          </h3>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="p-6">
                        {/* Description */}
                        <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
                          {category.description ||
                            "Explore our range of professional services tailored to meet your specific needs."}
                        </p>

                        {/* Stats Row */}
                        <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-100">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                              <Grid3x3 className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Services</p>
                              <p className="text-sm font-semibold text-gray-900">
                                {category.services_count}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                              <TrendingUp className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Status</p>
                              <p className="text-sm font-semibold text-green-600">
                                {category.is_active === 1
                                  ? "Active"
                                  : "Inactive"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Action Button */}

                        <Link to={`/subcategory/${category.id}/services`}>
                          <Button
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold group/btn"
                            size="lg"
                          >
                            <span>Explore Services</span>
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
                {totalPages > 1 && !searchQuery && (
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

export default CategoryChildList;
