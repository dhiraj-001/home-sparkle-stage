import { useEffect, useRef } from "react";
import heroSalon from "@/assets/hero-salon.jpg";
import heroMassage from "@/assets/hero-massage.jpg";
import heroACRepair from "@/assets/hero-ac-repair.jpg";
import heroPainting from "@/assets/hero-painting.jpg";
import Stats from "./Stats";
import { Clock, Shield, Star, Users } from "lucide-react";

// Alternative version with Tailwind animations only
// Alternative compact stats design
const Hero = () => {
  return (
    <section className="py-12 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Left Side: Heading & Stats */}
          <div className="space-y-8">
            {/* Main Heading */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight animate-fade-in-up">
                Home services at your doorstep
              </h1>
              <p className="text-lg text-muted-foreground animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                Professional home services, booked instantly. Experience quality and convenience with our trusted professionals.
              </p>
            </div>

            {/* Compact Stats Row */}
           <div className="grid grid-cols-2 gap-4 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
  <div className="flex items-center gap-3 p-3 bg-card/50 rounded-lg border border-border hover:shadow-md transition-shadow duration-300">
    <Star className="w-6 h-6 text-primary fill-primary" />
    <div>
      <div className="text-2xl font-bold">4.8</div>
      <div className="text-xs text-muted-foreground">Rating</div>
    </div>
  </div>
  
  <div className="flex items-center gap-3 p-3 bg-card/50 rounded-lg border border-border hover:shadow-md transition-shadow duration-300">
    <Users className="w-6 h-6 text-primary" />
    <div>
      <div className="text-2xl font-bold">12M+</div>
      <div className="text-xs text-muted-foreground">Customers</div>
    </div>
  </div>
  
  <div className="flex items-center gap-3 p-3 bg-card/50 rounded-lg border border-border hover:shadow-md transition-shadow duration-300">
    <Clock className="w-6 h-6 text-primary" />
    <div>
      <div className="text-2xl font-bold">30min</div>
      <div className="text-xs text-muted-foreground">Response</div>
    </div>
  </div>
  
  <div className="flex items-center gap-3 p-3 bg-card/50 rounded-lg border border-border hover:shadow-md transition-shadow duration-300">
    <Shield className="w-6 h-6 text-primary" />
    <div>
      <div className="text-2xl font-bold">100%</div>
      <div className="text-xs text-muted-foreground">Guarantee</div>
    </div>
  </div>
</div>
            {/* CTA Button */}
            {/* <div className="animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors duration-300 shadow-lg hover:shadow-xl">
                Book a Service Now
              </button>
            </div> */}
          </div>

          {/* Right Side: Image Grid */}
          <div className="grid grid-cols-2 gap-4">
            <img
              src={heroSalon}
              alt="Women's salon service"
              className="w-full h-48 object-cover rounded-xl shadow-lg animate-fade-in-scale hover:scale-105 transition-transform duration-300 cursor-pointer"
              style={{ animationDelay: "0.1s" }}
            />
            <img
              src={heroMassage}
              alt="Men's massage service"
              className="w-full h-48 object-cover rounded-xl shadow-lg animate-fade-in-scale hover:scale-105 transition-transform duration-300 cursor-pointer"
              style={{ animationDelay: "0.2s" }}
            />
            <img
              src={heroPainting}
              alt="Painting service"
              className="w-full h-48 object-cover rounded-xl shadow-lg animate-fade-in-scale hover:scale-105 transition-transform duration-300 cursor-pointer"
              style={{ animationDelay: "0.3s" }}
            />
            <img
              src={heroACRepair}
              alt="AC repair service"
              className="w-full h-48 object-cover rounded-xl shadow-lg animate-fade-in-scale hover:scale-105 transition-transform duration-300 cursor-pointer"
              style={{ animationDelay: "0.4s" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
