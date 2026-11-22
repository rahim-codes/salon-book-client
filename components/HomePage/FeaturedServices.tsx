import { ArrowRight } from "lucide-react"
import Link from "next/link"

import ServiceCard, { type Service } from "@/components/shared/ServiceCard"
import { apiClient } from "@/lib/api-client"

export default async function FeaturedServices() {
  let services: Service[] = []

  try {
    const result = await apiClient.services.getFeatured()
    if (result.success) {
      services = result.data
    }
  } catch (error) {
    console.error("Failed to fetch featured services", error)
  }

  return (
    <section className="w-full bg-zinc-950 px-4 py-20 text-zinc-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-12 flex flex-col items-center justify-between gap-4 md:flex-row">
          <div>
            <span className="text-xs font-semibold tracking-widest text-[#d65a82] uppercase">
              Exclusive Offerings
            </span>
            <h2 className="mt-1 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Featured Salon Services
            </h2>
          </div>
          <Link
            href="/browser-services"
            className="group flex items-center gap-2 text-sm font-medium text-[#e06c91] transition-colors hover:text-white"
          >
            <span>View All Services</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Services Grid */}
        {services.length === 0 ? (
          <div className="py-12 text-center text-zinc-500">
            No active services found.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
