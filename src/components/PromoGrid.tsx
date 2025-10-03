"use client"

import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

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

const PromoGrid = () => {
  const [allServices, setAllServices] = useState<Service[]>([])
  const [displayedServices, setDisplayedServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

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
          // Set initial 3 random services
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
      setDisplayedServices(getRandomServices(allServices, 3))
    }, 5000)

    return () => clearInterval(interval)
  }, [allServices])

  if (loading) {
    return (
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-6">
          {displayedServices.map((service, index) => (
            <Link
              key={service.id}
              to={`/service/${service.id}`}
              className="group relative h-64 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              {/* Background Image */}
              <img
                src={service.cover_image_full_path || "/placeholder.svg"}
                alt={service.name}
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${gradients[index % gradients.length]}`} />

              {/* Content */}
              <div className="relative h-full flex flex-col justify-end p-6 text-white">
                <h3 className="text-xl font-bold mb-2">{service.name}</h3>
                {service.short_description && (
                  <p className="text-sm mb-4 text-white/90 line-clamp-2">{service.short_description}</p>
                )}
                <Button variant="secondary" size="sm" className="w-fit bg-white text-foreground hover:bg-white/90">
                  Book now
                </Button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PromoGrid
