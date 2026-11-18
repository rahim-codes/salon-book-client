"use client"

import ServiceCard, { Service } from "@/components/shared/ServiceCard"
import { apiClient } from "@/lib/api-client"
import { Loader2, Search } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

export default function BrowseServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  // Search, Filter & Sort States
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortOrder, setSortOrder] = useState("default")

  useEffect(() => {
    async function fetchServices() {
      try {
        const result = await apiClient.services.getAll()
        if (result.success) {
          const activeServices = result.data.filter(
            (service: Service) => service.status === "Active"
          )
          setServices(activeServices)
        }
      } catch (error) {
        console.error("Failed to fetch services", error)
      } finally {
        setLoading(false)
      }
    }
    fetchServices()
  }, [])

  const categories = useMemo(() => {
    const cats = services.map((s) => s.category)
    return ["All", ...Array.from(new Set(cats))]
  }, [services])

  const filteredServices = useMemo(() => {
    return services
      .filter((service) => {
        // Search by Name
        const matchesSearch = service.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
        // Category Filtering
        const matchesCategory =
          selectedCategory === "All" || service.category === selectedCategory
        return matchesSearch && matchesCategory
      })
      .sort((a, b) => {
        // Sort Services by Price
        if (sortOrder === "low-to-high") return a.price - b.price
        if (sortOrder === "high-to-low") return b.price - a.price
        return 0
      })
  }, [services, searchQuery, selectedCategory, sortOrder])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-400">
        <Loader2 className="h-6 w-6 animate-spin text-[#a63d61]" />
        <span className="ml-2 text-sm">Loading available services...</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-16 text-zinc-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-10">
        {/* Page Header */}
        <div className="space-y-2 text-center">
          <span className="text-xs font-semibold tracking-widest text-[#d65a82] uppercase">
            Explore & Book
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Our Salon Services
          </h1>
          <p className="mx-auto max-w-xl text-sm text-zinc-400">
            Discover our premium range of hair, makeup, skincare, and spa
            treatments tailored just for you.
          </p>
        </div>

        {/* Search, Filter & Sorting Bar */}
        <div className="grid grid-cols-1 gap-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-4 md:grid-cols-3">
          {/* Search by Name */}
          <div className="relative">
            <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search service by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 w-full rounded-xl border border-zinc-800 bg-zinc-950 pr-4 pl-10 text-sm text-white placeholder-zinc-500 focus:border-[#a63d61] focus:outline-none"
            />
          </div>

          {/* Category-Based Filtering */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-11 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 text-sm text-white focus:border-[#a63d61] focus:outline-none"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "All" ? "All Categories" : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Services by Price */}
          <div className="relative">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="h-11 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 text-sm text-white focus:border-[#a63d61] focus:outline-none"
            >
              <option value="default">Sort by Price (Default)</option>
              <option value="low-to-high">Price: Low to High</option>
              <option value="high-to-low">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Services Grid (Using the ServiceCard Component) */}
        {filteredServices.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 py-20 text-center text-zinc-500">
            <p className="text-base font-medium">
              No services found matching your criteria.
            </p>
            <button
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("All")
                setSortOrder("default")
              }}
              className="mt-3 text-xs font-semibold text-[#e06c91] hover:underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredServices.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
