import { Link } from 'react-router-dom';
import { Star, Heart, Users } from 'lucide-react';

interface ServiceCardProps {
  service: {
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
      zone_wise_variations: Array<{
        variant_key: string;
        variant_name: string;
        price: number;
      }>;
      default_price: number;
    };
    category: {
      name: string;
      image_full_path: string;
    };
  };
  className?: string;
}

const ServiceCard = ({ service, className = '' }: ServiceCardProps) => {
  const getStartingPrice = () => {
    const variations = service.variations_app_format?.zone_wise_variations;
    if (variations && variations.length > 0) {
      return Math.min(...variations.map(v => v.price));
    }
    return service.variations_app_format?.default_price || parseInt(service.min_bidding_price) || 0;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Implement favorite logic here
    console.log('Toggle favorite for:', service.id);
  };

  return (
    <Link
      to={`/service/${service.id}`}
      className={`group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:scale-105 ${className}`}
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={service.cover_image_full_path || service.thumbnail_full_path}
          alt={service.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700">
            {service.category?.name}
          </div>
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleFavorite}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
        >
          <Heart
            className={`w-4 h-4 ${
              service.is_favorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
            }`}
          />
        </button>

        {/* Bookings Badge */}
        {service.bookings_count > 0 && (
          <div className="absolute bottom-3 left-3">
            <div className="flex items-center gap-1 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              <Users className="w-3 h-3" />
              <span>{service.bookings_count}+ booked</span>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Service Name */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {service.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {service.short_description.replace(/\*\*(.*?)\*\*/g, '$1')}
        </p>

        {/* Rating and Price Row */}
        <div className="flex items-center justify-between">
          {/* Rating */}
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium text-gray-900">
                {service.avg_rating || 'New'}
              </span>
            </div>
            {service.rating_count > 0 && (
              <span className="text-xs text-gray-500">
                ({service.rating_count})
              </span>
            )}
          </div>

          {/* Price */}
          <div className="text-right">
            <div className="text-lg font-bold text-blue-600">
              {formatPrice(getStartingPrice())}
            </div>
            <div className="text-xs text-gray-500">starting price</div>
          </div>
        </div>

        {/* Variations Count */}
        {service.variations_app_format?.zone_wise_variations &&
          service.variations_app_format.zone_wise_variations.length > 1 && (
          <div className="mt-2 text-xs text-gray-500">
            {service.variations_app_format.zone_wise_variations.length} options available
          </div>
        )}
      </div>
    </Link>
  );
};

export default ServiceCard;