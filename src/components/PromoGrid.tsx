import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import wallPanelsImage from "@/assets/promo-wall-panels.jpg";
import kitchenImage from "@/assets/promo-kitchen.jpg";
import paintingImage from "@/assets/hero-painting.jpg";

const promos = [
  {
    id: "wall-panels",
    title: "Transform your space with wall panels",
    subtitle: "Starts at ₹16,999 only",
    image: wallPanelsImage,
    bgGradient: "from-amber-900/80 to-amber-900/60",
  },
  {
    id: "kitchen-cleaning",
    title: "Kitchen cleaning starting at ₹399 only",
    subtitle: "",
    image: kitchenImage,
    bgGradient: "from-success/90 to-success/70",
  },
  {
    id: "painting",
    title: "Home painting & waterproofing",
    subtitle: "Pay after 100% satisfaction",
    image: paintingImage,
    bgGradient: "from-pink-900/70 to-pink-900/50",
  },
];

const PromoGrid = () => {
  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-6">
          {promos.map((promo) => (
            <Link
              key={promo.id}
              to={`/service/${promo.id}`}
              className="group relative h-64 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              {/* Background Image */}
              <img
                src={promo.image}
                alt={promo.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              
              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${promo.bgGradient}`} />
              
              {/* Content */}
              <div className="relative h-full flex flex-col justify-end p-6 text-white">
                <h3 className="text-xl font-bold mb-2">{promo.title}</h3>
                {promo.subtitle && (
                  <p className="text-sm mb-4 text-white/90">{promo.subtitle}</p>
                )}
                <Button 
                  variant="secondary" 
                  size="sm"
                  className="w-fit bg-white text-foreground hover:bg-white/90"
                >
                  Book now
                </Button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromoGrid;
