import { Link } from "react-router-dom";
import { Sparkles, Scissors, Wind, Sparkle, Wrench, Droplets, PaintBucket, Grid3x3 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const serviceRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            
            // Animate heading
            if (headingRef.current) {
              headingRef.current.classList.add('animate-fade-in-up');
            }

            // Animate service cards with stagger
            serviceRefs.current.forEach((service, index) => {
              if (service) {
                setTimeout(() => {
                  service.classList.add('animate-fade-in-scale');
                }, index * 100);
              }
            });
          }
        });
      },
      { 
        threshold: 0.2,
        rootMargin: '-50px 0px' // Starts animation when 50px into viewport
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  const addServiceRef = (el: HTMLAnchorElement | null, index: number) => {
    serviceRefs.current[index] = el;
  };

  return (
    <section ref={sectionRef} className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 
          ref={headingRef}
          className="text-3xl font-bold mb-8 opacity-0 translate-y-8 transition-all duration-700 ease-out"
        >
          What are you looking for?
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Link
                ref={(el) => addServiceRef(el, index)}
                key={service.id}
                to={`/service/${service.id}`}
                className="flex flex-col items-center justify-center p-6 bg-card rounded-xl border border-border hover:shadow-lg hover:border-primary/50 transition-all duration-200 group opacity-0 translate-y-8 scale-95"
              >
                <div className="w-16 h-16 mb-4 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors group-hover:scale-110 duration-300">
                  <Icon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-sm font-medium text-center group-hover:text-primary transition-colors duration-300">
                  {service.name}
                </h3>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServiceGrid;