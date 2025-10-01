import { MousePointerClick, Calendar, Home } from "lucide-react";

const steps = [
  {
    icon: MousePointerClick,
    title: "Select a Service",
    description: "Choose from a wide range of home services",
  },
  {
    icon: Calendar,
    title: "Book a Slot",
    description: "Pick a convenient date and time",
  },
  {
    icon: Home,
    title: "Door-step Care",
    description: "Our professionals arrive at your doorstep",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-16 bg-warning text-foreground">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-foreground flex items-center justify-center mb-4">
                  <Icon className="w-10 h-10 text-warning" />
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-foreground/80">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
