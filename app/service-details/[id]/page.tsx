import BookingSection from "@/components/Appointments/BookingSection"
import { apiClient } from "@/lib/api-client"
import { AlertCircle, ArrowLeft, CheckCircle2, Clock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface ServiceDetailsPageProps {
  params: {
    id: string
  }
}

export default async function ServiceDetailsPage({
  params,
}: ServiceDetailsPageProps) {
  const { id } = await params

  let service = null
  let errorMessage = ""

  try {
    const result = await apiClient.services.getById(id)
    console.log(result)
    if (result.success && result.data) {
      service = result.data
    } else {
      errorMessage = "Service not found or invalid service ID."
    }
  } catch (error) {
    errorMessage = `An error occurred while fetching service details. ${error}`
  }

  // Rule: Invalid service IDs should show an appropriate error message
  if (errorMessage || !service) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center bg-zinc-950 px-4 text-center text-zinc-100">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-rose-900/50 bg-rose-950/50 text-rose-500">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Oops! Service Not Found
        </h1>
        <p className="mt-2 max-w-md text-sm text-zinc-400">
          {errorMessage ||
            "The service you are looking for does not exist or the ID is invalid."}
        </p>
        <div className="mt-6">
          <Link
            href="/services"
            className="flex items-center gap-2 rounded-xl bg-[#a63d61] px-4 py-2 text-white hover:bg-[#8e3252]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Services</span>
          </Link>
        </div>
      </div>
    )
  }

  const isActive = service.status === "Active"

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-16 text-zinc-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Back Button */}
        <div>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-xs font-medium text-zinc-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to All Services</span>
          </Link>
        </div>

        {/* Main Details Grid */}
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2">
          {/* Service Image */}
          <div className="relative h-[350px] w-full overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 sm:h-[420px]">
            <Image
              src={
                service.image ||
                "https://images.unsplash.com/photo-1560066984-138dadb4c035"
              }
              alt={service.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
            <span className="absolute top-4 right-4 rounded-full bg-zinc-950/80 px-4 py-1.5 text-xs font-semibold text-[#e06c91] backdrop-blur-md">
              {service.category}
            </span>
          </div>

          {/* Service Info */}
          <div className="space-y-6">
            <div>
              <div className="mb-3 flex items-center justify-between gap-4">
                <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  {service.name}
                </h1>
                <span className="text-2xl font-bold text-[#e06c91]">
                  ৳ {service.price}
                </span>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2">
                {isActive ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-800/50 bg-emerald-950/60 px-3 py-1 text-xs font-medium text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Available for Booking
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-800/50 bg-rose-950/60 px-3 py-1 text-xs font-medium text-rose-400">
                    <AlertCircle className="h-3.5 w-3.5" />
                    Currently Inactive
                  </span>
                )}
              </div>
            </div>

            {/* Duration */}
            <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 text-sm text-zinc-300">
              <Clock className="h-5 w-5 text-[#a63d61]" />
              <div>
                <span className="font-semibold text-white">
                  Estimated Duration:{" "}
                </span>
                <span>{service.duration} Minutes</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
                Service Description
              </h3>
              <p className="text-sm leading-relaxed text-zinc-300">
                {service.description}
              </p>
            </div>

            {/* Appointment Booking Option */}
            <div className="border-t border-zinc-800 pt-4">
              <BookingSection service={service} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
