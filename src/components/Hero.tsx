import heroSalon from "@/assets/hero-salon.jpg";
import heroMassage from "@/assets/hero-massage.jpg";
import heroACRepair from "@/assets/hero-ac-repair.jpg";
import heroPainting from "@/assets/hero-painting.jpg";

const Hero = () => {
  return (
    <section className="py-12 bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Left Side: Heading */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Home services at your doorstep
            </h1>
          </div>

          {/* Right Side: Image Grid */}
          <div className="grid grid-cols-2 gap-4">
            <img
              src={heroSalon}
              alt="Women's salon service"
              className="w-full h-48 object-cover rounded-xl shadow-lg"
            />
            <img
              src={heroMassage}
              alt="Men's massage service"
              className="w-full h-48 object-cover rounded-xl shadow-lg"
            />
            <img
              src={heroPainting}
              alt="Painting service"
              className="w-full h-48 object-cover rounded-xl shadow-lg"
            />
            <img
              src={heroACRepair}
              alt="AC repair service"
              className="w-full h-48 object-cover rounded-xl shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
