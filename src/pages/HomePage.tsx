import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ServiceGrid from "@/components/ServiceGrid";
import Stats from "@/components/Stats";
import ApplianceCarousel from "@/components/ApplianceCarousel";
import PromoGrid from "@/components/PromoGrid";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";
import BannersPage from "@/components/Banners";
import Banner from "@/components/Banners";
import TestimonialSlider from "@/components/TestimoniaSlider";


const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <ServiceGrid />
        {/* <Stats /> */}
        <Banner/>
        <ApplianceCarousel />
        <PromoGrid />
        <HowItWorks />
        <TestimonialSlider/>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
