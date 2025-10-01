import { Star, Users } from "lucide-react";

const Stats = () => {
  return (
    <section className="py-12 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-12">
          {/* Rating */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Star className="w-8 h-8 text-primary fill-primary" />
            </div>
            <div>
              <div className="text-4xl font-bold">4.8</div>
              <div className="text-sm text-muted-foreground">Service Rating</div>
            </div>
          </div>

          {/* Customers */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <div>
              <div className="text-4xl font-bold">12M+</div>
              <div className="text-sm text-muted-foreground">Customers Globally</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
