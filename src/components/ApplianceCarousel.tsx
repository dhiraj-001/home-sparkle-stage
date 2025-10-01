import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import acImage from "@/assets/appliance-ac.jpg";
import washingImage from "@/assets/appliance-washing.jpg";
import purifierImage from "@/assets/appliance-purifier.jpg";
import chimneyImage from "@/assets/appliance-chimney.jpg";
import fridgeImage from "@/assets/appliance-fridge.jpg";

const appliances = [
  { id: "ac", name: "AC Service & Repair", image: acImage },
  { id: "washing", name: "Washing Machine", image: washingImage },
  { id: "purifier", name: "Water Purifier", image: purifierImage },
  { id: "chimney", name: "Chimney", image: chimneyImage },
  { id: "fridge", name: "Refrigerator", image: fridgeImage },
];

const ApplianceCarousel = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Appliance repair & service</h2>
          <Link 
            to="/service/appliances" 
            className="text-primary hover:text-primary/80 font-medium flex items-center gap-1"
          >
            See all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto pb-4 -mx-4 px-4">
          <div className="flex gap-6 min-w-max">
            {appliances.map((appliance) => (
              <Link
                key={appliance.id}
                to={`/service/${appliance.id}`}
                className="flex flex-col items-center group"
              >
                <div className="w-48 h-48 bg-gradient-to-br from-secondary to-secondary/50 rounded-xl overflow-hidden mb-3 group-hover:shadow-lg transition-shadow">
                  <img
                    src={appliance.image}
                    alt={appliance.name}
                    className="w-full h-full object-contain p-4"
                  />
                </div>
                <h3 className="text-sm font-medium text-center">{appliance.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ApplianceCarousel;
