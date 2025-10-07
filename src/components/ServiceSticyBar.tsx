"use client";

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { MapPin } from "lucide-react";

interface Category {
  id: string;
  name: string;
  image_full_path: string;
  services_count: number;
}

interface ServicesStickyNavbarProps {
  categories: Category[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  totalServices: number;
  filteredServicesCount: number;
  isLoading?: boolean;
}

const ServicesStickyNavbar: React.FC<ServicesStickyNavbarProps> = ({
  categories,
  isLoading = false,
}) => {
  const location = useLocation();

  return (
    <div className="top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        {/* Categories Horizontal Navigation with Images */}
        {categories.length > 0 && (
          <div className="pb-4 pt-4">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="text-sm font-medium text-gray-700 flex-shrink-0">
                Categories:
              </span>
            </div>

            {/* Horizontal Scroll Container */}
            <div className="relative">
              <div className="flex gap-3 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pb-3 -mb-3">
                {categories.map((category) => {
                  const isActive = location.pathname === `/category/${category.id}`;
                  return (
                    <Link
                      key={category.id}
                      to={`/category/${category.id}`}
                      className={`flex-shrink-0 flex flex-col items-center p-3 rounded-2xl border min-w-[100px] max-w-[120px] transition-all duration-200
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
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-500">
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
                      <div
                        className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                          isActive
                            ? "bg-blue-100 text-blue-600"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {category.services_count}
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Gradient fade effect for scroll indication */}
              <div className="absolute right-0 top-0 bottom-3 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none" />
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
