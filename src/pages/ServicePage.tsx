import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ServicePage = () => {
  const { serviceName } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>

          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4 capitalize">
              {serviceName?.replace(/-/g, ' ')} Service
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              This is a placeholder page for the service details. In a real application, 
              this would contain detailed information about the service, pricing, 
              professional profiles, and a booking form.
            </p>
            
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Book This Service
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ServicePage;
