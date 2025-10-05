import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { ChevronRight } from "lucide-react";

// Simple icon map with SVG paths
const iconMap: Record<string, string> = {
  sparkles:
    "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
  scissors:
    "M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z",
  wind: "M9.59 4.59A2 2 0 1112 7M12 7v10m0 0a2 2 0 100 4 2 2 0 000-4zm-8 0a2 2 0 100 4 2 2 0 000-4zm8 0a2 2 0 100 4 2 2 0 000-4z",
  shield:
    "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  wrench:
    "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
  droplets:
    "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10",
  "paint-bucket":
    "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01",
  "grid-3x3": "M4 6h16M4 10h16M4 14h16M4 18h16",
  zap: "M13 10V3L4 14h7v7l9-11h-7z",
  home: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  tv: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
};

// Category to icon mapping
const categoryIconMap: Record<string, string> = {
  "women salon & spa": "sparkles",
  "men's salon & massage": "scissors",
  "pest control": "shield",
  "full home cleaning": "sparkles",
  "furniture assembly": "wrench",
  "carpenter": "wrench",
  "electrician": "zap",
  "kitchen appliances": "home",
  "home appliances": "home",
  "television service": "tv",
  "ac & appliance repair": "wind",
  "cleaning & pest control": "shield",
  "native water purifier": "droplets",
  "painting & waterproofing": "paint-bucket",
  "wall panels & storage units": "grid-3x3",
};

// Dynamic icon component
const DynamicIcon = ({
  categoryName,
  className,
}: {
  categoryName: string;
  className?: string;
}) => {
  const iconKey = categoryIconMap[categoryName.toLowerCase()] || "sparkles";
  const pathData = iconMap[iconKey];

  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d={pathData}
      />
    </svg>
  );
};

interface Category {
  id: string;
  name: string;
  image: string | null;
  image_full_path: string | null;
  is_active: number;
  is_featured: number;
}

interface ApiResponse {
  response_code: string;
  message: string;
  content: {
    current_page: number;
    data: Category[];
    per_page: number;
    total: number;
  };
}

const CategoriesGrid = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const serviceRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1920
  );

  // Track window width for responsive card display
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    // Set initial width
    setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    async function fetchCategories(offset = 1, limit = 20) {
      const baseUrl = import.meta.env.VITE_API_URL || "https://admin.sarvoclub.com";
      const url = `${baseUrl}/api/v1/customer/category?offset=${offset}&limit=${limit}`;

      const headers = {
        "Content-Type": "application/json; charset=UTF-8",
        zoneId: "a02c55ff-cb84-4bbb-bf91-5300d1766a29",
        "X-localization": "en",
        guest_id: "7e223db0-9f62-11f0-bba0-779e4e64bbc8",
      }

      try {
        const response = await fetch(url, { headers });
        console.log("Fetch response:", url);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data: ApiResponse = await response.json();

        if (data.response_code === "default_200" && data.content?.data) {
          const activeCategories = data.content.data.filter(
            (category) => category.is_active === 1
          );
          setCategories(activeCategories);
          console.log("Fetched categories:", data);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch categories"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
    console.log("API URL:", import.meta.env.VITE_API_URL);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated && categories.length > 0) {
            setHasAnimated(true);

            if (headingRef.current) {
              headingRef.current.classList.add("animate-fade-in-up");
            }

            serviceRefs.current.forEach((service, index) => {
              if (service) {
                setTimeout(() => {
                  service.classList.add("animate-fade-in-scale");
                }, index * 100);
              }
            });
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "-50px 0px",
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated, categories.length]);

  const addServiceRef = (el: HTMLAnchorElement | null, index: number) => {
    serviceRefs.current[index] = el;
  };

  // Get categories to display based on screen size
  const getDisplayCount = () => {
    if (windowWidth < 768) return 3; // Mobile: 3 cards
    if (windowWidth < 1024) return 4; // Tablet: 4 cards
    return 8; // Laptop+: 8 cards
  };

  const displayedCategories = showAll ? categories : categories.slice(0, getDisplayCount());

  if (loading) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">Loading categories...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center text-red-500">Error: {error}</div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} id="categories" className="py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header with left-aligned heading and right-aligned button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 md:mb-12 gap-4">
          <h2
            ref={headingRef}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground opacity-0 translate-y-8 transition-all duration-700 ease-out"
          >
            What are you looking for?
          </h2>
          
          {/* See All Categories Button - Right aligned */}
          <Link 
            to="/categories" 
            className="text-primary hover:text-primary/80 font-semibold flex items-center gap-1 transition-colors group"
          >
            See all <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {categories.length === 0 ? (
          <div className="text-center text-muted-foreground text-lg py-12">
            No categories available at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
            {displayedCategories.map((category, index) => (
              <Link
                ref={(el) => addServiceRef(el, index)}
                key={category.id}
                to={`/category/${category.id}`}
                className="group relative bg-card rounded-xl md:rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-border/50 hover:border-primary/30 opacity-0 translate-y-8 scale-95"
              >
                {/* Card Content */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  {/* Background Image or Gradient */}
                  {category.image_full_path ? (
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={{
                        backgroundImage: `url(${category.image_full_path})`,
                      }}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10" />
                  )}
                  
                  {/* Gradient Overlay for better text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-all duration-300" />
                  
                  {/* Icon Badge */}
                  <div className="absolute top-3 right-3 w-10 h-10 md:w-12 md:h-12 rounded-full bg-background/95 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-300 ring-1 ring-border/50">
                    <DynamicIcon
                      categoryName={category.name}
                      className="w-5 h-5 md:w-6 md:h-6 text-primary group-hover:text-primary transition-colors"
                    />
                  </div>

                  {/* Category Name - Bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                    <h3 className="text-sm md:text-base font-bold text-white line-clamp-2 group-hover:text-primary-foreground transition-colors duration-300 drop-shadow-lg">
                      {category.name}
                    </h3>
                  </div>
                </div>

                {/* Subtle hover border glow */}
                <div className="absolute inset-0 rounded-xl md:rounded-2xl ring-2 ring-transparent group-hover:ring-primary/20 transition-all duration-300 pointer-events-none" />
                
                {/* Shine Effect on hover */}
                <div className="absolute inset-0 rounded-xl md:rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 -translate-x-full group-hover:translate-x-full transition-all duration-700" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoriesGrid;