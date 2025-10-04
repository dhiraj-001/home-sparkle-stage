import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ServicesPage from "./pages/Category/CategoryPage.js";
import NotFound from "./pages/NotFound";
import SplashScreen from "./components/SplashScreen";
import Register from "./pages/AuthPages/Registration";
import Login from "./pages/AuthPages/Login";
import { ConfigAPI, setZoneId } from "../api.js";
import CategoriesPage from "./pages/Category/CategoryPage.js";
import AllServices from "./pages/Services/AllServices.js";
import ServiceDetail from "./pages/Services/ServiceDetail.js";
import CategoryChildList from "./pages/Category/CategoryDetail.js";

const queryClient = new QueryClient();

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await ConfigAPI.appConfig();
        // NOTE: Based on a sample response, the zone ID is directly in the response data.
        // Adjust if the structure is different.
        if (res.data.zone_id) {
          setZoneId(res.data.zone_id);
          console.log("Zone ID set:", res.data.zone_id);
        }
      } catch (error) {
        console.error("Failed to fetch app config:", error);
      }
    };

    fetchConfig();
  }, []);

  if (loading) {
    return <SplashScreen onFinish={() => setLoading(false)} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/service/:id" element={<ServiceDetail />} />
            <Route path="/allservices" element={<AllServices />} />
            <Route path="/register" element={<Register />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/category/:id" element={<CategoryChildList  />} />
            <Route path="/login" element={<Login />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;