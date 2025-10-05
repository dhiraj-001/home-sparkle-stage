import { MousePointerClick, Calendar, Home } from "lucide-react";
import { motion } from "framer-motion";

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

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 50,
    scale: 0.8
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

const iconVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0,
    rotate: -180
  },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      duration: 0.8,
      ease: "backOut"
    }
  },
  hover: {
    scale: 1.1,
    rotate: 5,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const HowItWorks = () => {
  return (
    <motion.section 
      className="py-16 bg-warning text-foreground relative overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      {/* Background decorative elements */}
      <motion.div 
        className="absolute top-0 left-0 w-32 h-32 bg-foreground/5 rounded-full -translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
      />
      <motion.div 
        className="absolute bottom-0 right-0 w-40 h-40 bg-foreground/5 rounded-full translate-x-1/2 translate-y-1/2"
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.4 }}
      />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Get your home services in just 3 simple steps
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                custom={index}
                whileHover={{ y: -5 }}
                className="flex flex-col items-center text-center group"
              >
                {/* Icon Container */}
                <motion.div 
                  className="w-20 h-20 rounded-full bg-foreground flex items-center justify-center mb-6 relative shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                  variants={iconVariants}
                  whileHover="hover"
                >
                  <Icon className="w-10 h-10 text-warning" />
                  
                  {/* Pulse Animation on Hover */}
                  <motion.div 
                    className="absolute inset-0 rounded-full border-2 border-foreground/30"
                    initial={{ scale: 1, opacity: 0 }}
                    whileHover={{ 
                      scale: 1.2, 
                      opacity: 1,
                      transition: { duration: 0.6, ease: "easeOut" }
                    }}
                  />
                </motion.div>

                {/* Content */}
                <motion.h3 
                  className="text-xl font-bold mb-3"
                  variants={textVariants}
                >
                  {step.title}
                </motion.h3>
                
                <motion.p 
                  className="text-sm text-foreground/80 leading-relaxed"
                  variants={textVariants}
                >
                  {step.description}
                </motion.p>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Button */}
        {/* <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <motion.button
            className="px-8 py-3 bg-foreground text-warning rounded-lg font-semibold hover:bg-foreground/90 transition-colors duration-300 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started Today
          </motion.button>
        </motion.div> */}
      </div>
    </motion.section>
  );
};

export default HowItWorks;