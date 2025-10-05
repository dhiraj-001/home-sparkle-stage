"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Star,
  Users,
  Zap,
  Heart,
  ArrowRight,
  TrendingUp,
  ShoppingCart,
  Plus,
  Minus,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { addToCart } from "@/helpers/addtocart";
import { motion } from "framer-motion";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.9,
      ease: "easein"
    }
  }
};

const headerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: "easeOut"
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
};

const buttonVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.8,
      duration: 0.6,
      ease: "easeOut"
    }
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2
    }
  }
};

interface ServiceVariation {
  variant_key: string;
  variant_name: string;
  price: number;
}

interface Service {
  id: string;
  name: string;
  short_description: string;
  thumbnail_full_path: string;
  cover_image_full_path: string;
  min_bidding_price: string;
  avg_rating: number;
  rating_count: number;
  bookings_count: number;
  is_favorite: number;
  variations_app_format: {
    zone_wise_variations: ServiceVariation[];
    default_price: number;
  };
  category: {
    name: string;
    image_full_path: string;
    id: string;
  };
  sub_category_id: string;
}

interface TrendingServicesResponse {
  response_code: string;
  message: string;
  content: {
    data: Service[];
    current_page: number;
    total: number;
  };
}

const TrendingServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedVariant, setSelectedVariant] =
    useState<ServiceVariation | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { toast } = useToast();
  const location = useLocation();

  useEffect(() => {
    if (location.hash === '#trending') {
      setTimeout(() => {
        document.getElementById('trending')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [location]);

  useEffect(() => {
    fetchTrendingServices();

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchTrendingServices = async () => {
    try {
      const baseUrl =
        import.meta.env.VITE_API_URL || "https://admin.sarvoclub.com";
      const response = await fetch(
        `${baseUrl}/api/v1/customer/service/trending?limit=10&offset=1`,
        {
          headers: {
            "Content-Type": "application/json",
            zoneId: "a02c55ff-cb84-4bbb-bf91-5300d1766a29",
            "X-localization": "en",
            guest_id: "7e223db0-9f62-11f0-bba0-779e4e64bbc8",
            "Accept-Encoding": "gzip, deflate, br",
          },
        }
      );

      const data: TrendingServicesResponse = await response.json();

      if (data.response_code === "default_200" && data.content.data) {
        setServices(data.content.data);
      } else {
        throw new Error("Failed to fetch trending services");
      }
    } catch (err) {
      console.error("Error fetching trending services:", err);
      setError("Failed to load trending services");
    } finally {
      setLoading(false);
    }
  };

  const getStartingPrice = (service: Service) => {
    const variations = service.variations_app_format?.zone_wise_variations;
    if (variations && variations.length > 0) {
      return Math.min(...variations.map((v) => v.price));
    }
    return (
      service.variations_app_format?.default_price ||
      Number.parseInt(service.min_bidding_price) ||
      0
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getVisibleServicesCount = () => {
    if (windowWidth < 768) return 3;
    if (windowWidth < 1024) return 4;
    return 8;
  };

  const getGridColumns = () => {
    if (windowWidth < 768) return "grid-cols-1";
    if (windowWidth < 1024) return "grid-cols-2";
    return "grid-cols-4";
  };

  const handleAddToCartClick = (e: React.MouseEvent, service: Service) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedService(service);
    setQuantity(1);
    if (service.variations_app_format?.zone_wise_variations?.length === 1) {
      setSelectedVariant(service.variations_app_format.zone_wise_variations[0]);
    } else {
      setSelectedVariant(null);
    }
  };

  const handleCloseModal = () => {
    setSelectedService(null);
    setSelectedVariant(null);
    setQuantity(1);
  };

  const handleConfirmAddToCart = async () => {
    if (!selectedService || !selectedVariant) {
      toast({
        title: "Please select a variant",
        description: "Choose a service option before adding to cart",
        variant: "destructive",
      });
      return;
    }

    setIsAddingToCart(true);

    try {
      const authToken = localStorage.getItem("demand_token") || undefined;
      const guestId =
        localStorage.getItem("guest_id") ||
        "7e223db0-9f62-11f0-bba0-779e4e64bbc8";

      const result = await addToCart({
        serviceId: selectedService.id,
        categoryId: selectedService.category?.id || "",
        subCategoryId: selectedService.sub_category_id || "",
        variantKey: selectedVariant.variant_key,
        quantity,
        authToken,
        guestId,
      });

      if (result.success) {
        toast({
          title: "Added to cart!",
          description: `${selectedService.name} has been added to your cart`,
        });
        handleCloseModal();
      } else {
        toast({
          title: "Failed to add to cart",
          description:
            result.error || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-400/10 to-pink-400/10 rounded-full blur-3xl" />

        <div className="relative container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-48 mx-auto mb-4 animate-pulse" />
            <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-96 mx-auto mb-3 animate-pulse" />
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-64 mx-auto animate-pulse" />
          </div>
          <div className={`grid ${getGridColumns()} gap-8`}>
            {[...Array(getVisibleServicesCount())].map((_, i) => (
              <div
                key={i}
                className="group relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden animate-pulse"
              >
                <div className="h-56 bg-gradient-to-br from-gray-200 to-gray-300" />
                <div className="p-6">
                  <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded mb-3" />
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4 mb-4" />
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20" />
                    <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20" />

        <div className="relative container mx-auto px-4">
          <div className="max-w-md mx-auto text-center bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-red-100">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Oops! Something went wrong
            </h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={fetchTrendingServices}
              className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <motion.section 
        className="relative py-20 overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
        id="trending"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />

        <div className="relative container mx-auto px-4">
          <motion.div 
            className="mb-16"
            variants={headerVariants}
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-blue-200/50 text-blue-600 px-6 py-3 rounded-full text-sm font-semibold mb-6 shadow-lg">
              <TrendingUp className="w-5 h-5" />
              Trending Now
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-black">
              Popular Services
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl leading-relaxed">
              Discover our most booked and highly-rated services that customers
              love
            </p>
          </motion.div>

          {services.length === 0 ? (
            <motion.div 
              className="text-center py-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg font-medium">
                No trending services available at the moment.
              </p>
            </motion.div>
          ) : (
            <div className={`grid ${getGridColumns()} gap-8`}>
              {services.slice(0, getVisibleServicesCount()).map((service, index) => (
                <motion.div
                  key={service.id}
                  className="group relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-white/50"
                  custom={index}
                  variants={cardVariants}
                  whileHover="hover"
                >
                  <Link to={`/service/${service.id}`} className="block">
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={
                          service.cover_image_full_path ||
                          service.thumbnail_full_path
                        }
                        alt={service.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />

                      <div className="absolute top-4 left-4">
                        <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold text-gray-700 shadow-lg border border-white/50">
                          {service.category?.name}
                        </div>
                      </div>

                      {/* Variant Badge - Top right corner */}
                      {service.variations_app_format?.zone_wise_variations &&
                        service.variations_app_format.zone_wise_variations
                          .length > 1 && (
                          <div className="absolute top-4 right-4">
                            <div className="flex items-center gap-1.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm">
                              <Zap className="w-3 h-3" />
                              <span>
                                {
                                  service.variations_app_format
                                    .zone_wise_variations.length
                                }
                              </span>
                            </div>
                          </div>
                        )}

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        className={`absolute p-2.5 bg-white/95 backdrop-blur-md rounded-full hover:bg-white transition-all duration-300 shadow-lg hover:scale-110 border border-white/50 ${
                          service.variations_app_format?.zone_wise_variations &&
                          service.variations_app_format.zone_wise_variations
                            .length > 1
                            ? "top-16 right-4"
                            : "top-4 right-4"
                        }`}
                      >
                        <Heart
                          className={`w-4 h-4 transition-all duration-300 ${
                            service.is_favorite
                              ? "fill-red-500 text-red-500 scale-110"
                              : "text-gray-600"
                          }`}
                        />
                      </button>

                      {service.bookings_count > 0 && (
                        <div className="absolute bottom-4 left-4">
                          <div className="flex items-center gap-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
                            <Users className="w-3.5 h-3.5" />
                            <span>{service.bookings_count}+ booked</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <h3 className="font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300 text-lg">
                        {service.name}
                      </h3>

                      <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                        {service.short_description.replace(
                          /\*\*(.*?)\*\*/g,
                          "$1"
                        )}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-1.5">
                          <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1.5 rounded-lg">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-bold text-gray-900">
                              {service.avg_rating || "New"}
                            </span>
                          </div>
                          {service.rating_count > 0 && (
                            <span className="text-xs text-gray-500 font-medium">
                              ({service.rating_count})
                            </span>
                          )}
                        </div>

                        <div className="text-right">
                          <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            {formatPrice(getStartingPrice(service))}
                          </div>
                          <div className="text-xs text-gray-500 font-medium">
                            starting price
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  </Link>

                  <div className="p-6 pt-0">
                    <Button
                      onClick={(e) => handleAddToCartClick(e, service)}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {services.length > 0 && (
            <motion.div 
              className="text-center mt-16"
              variants={buttonVariants}
            >
              <Link
                to="/allservices"
                className="inline-flex items-center gap-3 px-10 py-4 text-gray-900 rounded-2xl font-bold hover:text-blue-600 transition-all duration-300 transform hover:scale-105 group"
              >
                View All Services
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </motion.div>
          )}
        </div>
      </motion.section>

      <Dialog open={!!selectedService} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Select Service Option
            </DialogTitle>
            <DialogDescription>{selectedService?.name}</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-3 block">
                Choose Variant
              </label>
              <div className="space-y-2">
                {selectedService?.variations_app_format?.zone_wise_variations?.map(
                  (variant) => (
                    <button
                      key={variant.variant_key}
                      onClick={() => setSelectedVariant(variant)}
                      className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                        selectedVariant?.variant_key === variant.variant_key
                          ? "border-blue-500 bg-blue-50 shadow-md"
                          : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-900">
                          {variant.variant_name}
                        </span>
                        <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          {formatPrice(variant.price)}
                        </span>
                      </div>
                    </button>
                  )
                )}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-3 block">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="h-10 w-10 rounded-lg"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-2xl font-bold text-gray-900 min-w-[3rem] text-center">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                  className="h-10 w-10 rounded-lg"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {selectedVariant && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-200">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-semibold">
                    Total Price:
                  </span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {formatPrice(selectedVariant.price * quantity)}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleCloseModal}
              className="flex-1 bg-transparent"
              disabled={isAddingToCart}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmAddToCart}
              disabled={!selectedVariant || isAddingToCart}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold"
            >
              {isAddingToCart ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Adding...
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TrendingServices;