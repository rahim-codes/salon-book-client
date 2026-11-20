import ServiceCard, { Service } from "@/components/shared/ServiceCard"
import { apiClient } from "@/lib/api-client"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface CategoryServicesPageProps {
  params: Promise<{
    category: string
  }>
}

export default async function CategoryServicesPage({
  params,
}: CategoryServicesPageProps) {
  const { category } = await params
  const decodedCategory = decodeURIComponent(category)

  let services: Service[] = []

  try {
    const res = await apiClient.services.getAll()
    if (res.success && Array.isArray(res.data)) {
      services = res.data.filter(
        (item: Service) =>
          item.category?.toLowerCase() === decodedCategory.toLowerCase()
      )
    }
  } catch (error) {
    console.error("Failed to fetch category services:", error)
  }

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-12 text-zinc-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-col justify-between gap-4 border-b border-zinc-800 pb-6 sm:flex-row sm:items-end">
          <div>
            <Link
              href="/categories"
              className="mb-3 inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>All Categories</span>
            </Link>
            <span className="block text-xs font-semibold tracking-widest text-[#d65a82] uppercase">
              Category
            </span>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {decodedCategory}
            </h1>
          </div>

          <span className="text-xs font-medium text-zinc-400">
            {services.length} {services.length === 1 ? "Service" : "Services"}{" "}
            found
          </span>
        </div>

        {services.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 px-6 py-14 text-center">
            <p className="text-sm text-zinc-400">
              No services available under{" "}
              <span className="font-semibold text-white">
                {decodedCategory}
              </span>{" "}
              right now.
            </p>
            <Link
              href="/categories"
              className="mt-4 inline-flex h-10 items-center justify-center rounded-xl bg-[#a63d61] px-5 text-xs font-medium text-white transition hover:bg-[#8e3252]"
            >
              Browse Other Categories
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
