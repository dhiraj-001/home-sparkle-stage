import { Link } from "react-router-dom";
import { Sparkles, Scissors, Wind, Sparkle, Wrench, Droplets, PaintBucket, Grid3x3 } from "lucide-react";

const services = [
  {
    id: "womens-salon",
    name: "Women's Salon & Spa",
    icon: Sparkles,
  },
  {
    id: "mens-salon",
    name: "Men's Salon & Massage",
    icon: Scissors,
  },
  {
    id: "ac-repair",
    name: "AC & Appliance Repair",
    icon: Wind,
  },
  {
    id: "cleaning",
    name: "Cleaning & Pest Control",
    icon: Sparkle,
  },
  {
    id: "electrician",
    name: "Electrician, Plumber & Carpenter",
    icon: Wrench,
  },
  {
    id: "water-purifier",
    name: "Native Water Purifier",
    icon: Droplets,
  },
  {
    id: "painting",
    name: "Painting & Waterproofing",
    icon: PaintBucket,
  },
  {
    id: "wall-panels",
    name: "Wall Panels & Storage Units",
    icon: Grid3x3,
  },
];

const ServiceGrid = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">What are you looking for?</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Link
                key={service.id}
                to={`/service/${service.id}`}
                className="flex flex-col items-center justify-center p-6 bg-card rounded-xl border border-border hover:shadow-lg hover:border-primary/50 transition-all duration-200 group"
              >
                <div className="w-16 h-16 mb-4 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-sm font-medium text-center">{service.name}</h3>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServiceGrid;
