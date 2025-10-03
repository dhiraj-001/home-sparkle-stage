import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Service {
  id: string;
  name: string;
  short_description: string;
  thumbnail_full_path: string | null;
}

interface Category {
  id: string;
  name: string;
  image_full_path: string | null;
}

interface Banner {
  id: string;
  banner_title: string;
  resource_type: "service" | "category";
  resource_id: string;
  redirect_link: string | null;
  banner_image_full_path: string;
  service?: Service | null;
  category?: Category | null;
}

interface ApiResponse {
  response_code: string;
  message: string;
  content: {
    current_page: number;
    data: Banner[];
    total: number;
  };
}

const BannersPage = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch(
          "https://admin.sarvoclub.com/api/v1/customer/banner?limit=10&offset=1",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Connection": "keep-alive",
              "X-localization": "en",
              "zoneId": "a02c55ff-cb84-4bbb-bf91-5300d1766a29", // from screenshot
              "guest_id": "7e223db0-9f62-11f0-bba0-779e4e64bbc8", // constant guest_id
              "Accept-Charset": "UTF-8",
            },
          }
        );

        const data: ApiResponse = await response.json();
        if (data.response_code === "default_200" && data.content?.data) {
          setBanners(data.content.data);
        }
      } catch (error) {
        console.error("Error fetching banners:", error);
      }
    };

    fetchBanners();
  }, []);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleClick = (banner: Banner) => {
    if (banner.redirect_link) {
      window.open(banner.redirect_link, "_blank");
    } else if (banner.resource_type === "service" && banner.service) {
      navigate(`/services/${banner.service.id}`);
    } else if (banner.resource_type === "category" && banner.category) {
      navigate(`/categories/${banner.category.id}`);
    }
  };

  if (banners.length === 0) {
    return <div className="flex justify-center items-center h-screen">No banners available</div>;
  }

  const currentBanner = banners[currentIndex];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Promotional Banners</h1>

      <div className="relative w-full max-w-3xl mx-auto">
        <img
          src={currentBanner.banner_image_full_path}
          alt={currentBanner.banner_title}
          className="w-full h-64 object-cover rounded-xl shadow-lg cursor-pointer"
          onClick={() => handleClick(currentBanner)}
        />

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-3 rounded-b-xl">
          <h2 className="text-lg font-semibold">{currentBanner.banner_title}</h2>
          {currentBanner.resource_type === "service" && currentBanner.service && (
            <p className="text-sm">{currentBanner.service.short_description}</p>
          )}
          {currentBanner.resource_type === "category" && currentBanner.category && (
            <p className="text-sm">{currentBanner.category.name}</p>
          )}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={handleNext}
          className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default BannersPage;
