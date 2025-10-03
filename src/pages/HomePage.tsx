import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ServiceGrid from "@/components/CategoriesGrid";
import Stats from "@/components/Stats";
import ApplianceCarousel from "@/components/ApplianceCarousel";
import PromoGrid from "@/components/PromoGrid";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";
import BannersPage from "@/components/Banners";
import Banner from "@/components/Banners";
import TestimonialSlider from "@/components/TestimoniaSlider";
import TrendingServices from "@/components/TrendingServices";
import AdvertisementList from "@/components/AdvertiseMent";


const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <ServiceGrid />
        {/* <Stats /> */}
        <Banner/>
        {/* <ApplianceCarousel /> */}
        <TrendingServices/>
        <PromoGrid />
         <AdvertisementList 
        token={"XcgsD8CJtjnQm9cYJNUO_8ivfvnCyCzq8p0graX8j3GlnACPr0Y29om3c7yrLWthIlKxwVKeJmSQ75yAcg"}
        limit={5}
        offset={1}
      />
        <HowItWorks />
        <TestimonialSlider/>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
