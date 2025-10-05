"use client"

import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface Service {
  id: string
  name: string
  short_description: string
  cover_image_full_path: string
  thumbnail: string
  min_bidding_price: number
}

const gradients = [
  "from-amber-900/80 to-amber-900/60",
  "from-success/90 to-success/70",
  "from-pink-900/70 to-pink-900/50",
  "from-blue-900/80 to-blue-900/60",
  "from-purple-900/80 to-purple-900/60",
]

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
}

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 60,
    scale: 0.8
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
}

const slideVariants = {
  hidden: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 100 : -100,
    scale: 0.8
  }),
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -100 : 100,
    scale: 0.8,
    transition: {
      duration: 0.4,
      ease: "easeIn"
    }
  })
}

const PromoGrid = () => {
  const [allServices, setAllServices] = useState<Service[]>([])
  const [displayedServices, setDisplayedServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [slideDirection, setSlideDirection] = useState(1)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || "https://admin.sarvoclub.com"
        const response = await fetch(`${baseUrl}/api/v1/customer/service?limit=20&offset=1`, {
          headers: {
            "Content-Type": "application/json",
            zoneId: "a02c55ff-cb84-4bbb-bf91-5300d1766a29",
            "X-localization": "en",
            guest_id: "7e223db0-9f62-11f0-bba0-779e4e64bbc8",
            "Accept-Encoding": "gzip, deflate, br",
          },
        })

        if (!response.ok) throw new Error("Failed to fetch services")

        const data = await response.json()
        if (data.content?.data) {
          setAllServices(data.content.data)
          setDisplayedServices(getRandomServices(data.content.data, 3))
        }
      } catch (error) {
        console.error("Error fetching services:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  const getRandomServices = (services: Service[], count: number) => {
    const shuffled = [...services].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, count)
  }

  useEffect(() => {
    if (allServices.length === 0) return

    const interval = setInterval(() => {
      setSlideDirection(prev => prev * -1) // Alternate direction
      setDisplayedServices(getRandomServices(allServices, 3))
    }, 5000)

    return () => clearInterval(interval)
  }, [allServices])

  if (loading) {
    return (
      <motion.section 
        className="py-16 bg-secondary/30"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="h-64 rounded-xl bg-muted animate-pulse"
              />
            ))}
          </div>
        </div>
      </motion.section>
    )
  }

  return (
    <motion.section 
      className="py-16 bg-secondary/30"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout" custom={slideDirection}>
            {displayedServices.map((service, index) => (
              <motion.div
                key={service.id}
                custom={slideDirection}
                variants={slideVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
                className="group relative h-64 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <Link
                  to={`/service/${service.id}`}
                  className="block h-full"
                >
                  {/* Background Image */}
                  <motion.img
                    src={service.cover_image_full_path || "/placeholder.svg"}
                    alt={service.name}
                    className="absolute inset-0 w-full h-full object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                  />

                  {/* Gradient Overlay */}
                  <div 
                    className={`absolute inset-0 bg-gradient-to-br ${gradients[index % gradients.length]}`}
                  />

                  {/* Content */}
                  <div className="relative h-full flex flex-col justify-end p-6 text-white">
                    <motion.h3 
                      className="text-xl font-bold mb-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                    >
                      {service.name}
                    </motion.h3>
                    
                    {service.short_description && (
                      <motion.p 
                        className="text-sm mb-4 text-white/90 line-clamp-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                      >
                        {service.short_description}
                      </motion.p>
                    )}
                    
                    {/* Optional Button - Uncomment if needed */}
                    {/* <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                    >
                      <Button variant="secondary" size="sm" className="w-fit bg-white text-foreground hover:bg-white/90">
                        Book now
                      </Button>
                    </motion.div> */}
                  </div>

                  {/* Hover Overlay */}
                  <motion.div 
                    className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    whileHover={{ opacity: 0.2 }}
                  />
                  
                  {/* Border Animation */}
                  <motion.div 
                    className="absolute inset-0 border-2 border-transparent group-hover:border-white/30 rounded-xl transition-all duration-300"
                    whileHover={{ borderColor: "rgba(255,255,255,0.3)" }}
                  />
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  )
}

export default PromoGrid