import { Clock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export interface Service {
  _id: string
  name: string
  category: string
  price: number
  duration: number
  description: string
  image: string
  status?: string
}

interface ServiceCardProps {
  service: Service
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const { _id, name, category, price, duration, description, image } = service

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 transition-all duration-300 hover:border-[#a63d61]/50 hover:shadow-xl hover:shadow-rose-950/20">
      {/* Service Image */}
      <div className="relative h-52 w-full overflow-hidden bg-zinc-950">
        <Image
          src={
            image || "https://images.unsplash.com/photo-1560066984-138dadb4c035"
          }
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute top-3 right-3 rounded-full bg-zinc-950/80 px-3 py-1 text-xs font-medium text-[#e06c91] backdrop-blur-md">
          {category}
        </span>
      </div>

      {/* Content Area */}
      <div className="flex flex-1 flex-col justify-between p-6">
        <div>
          <div className="mb-2 flex items-center justify-between gap-2">
            <h3 className="text-lg font-bold text-white transition-colors group-hover:text-[#e06c91]">
              {name}
            </h3>
            <span className="text-lg font-bold text-white">৳ {price}</span>
          </div>

          {/* Short Description */}
          <p className="mb-4 line-clamp-2 text-xs text-zinc-400">
            {description}
          </p>
        </div>

        <div>
          {/* Duration */}
          <div className="mb-4 flex items-center gap-1.5 text-xs text-zinc-400">
            <Clock className="h-3.5 w-3.5 text-[#a63d61]" />
            <span>{duration} Minutes</span>
          </div>

          {/* View Details Button */}
          <Link
            href={`/service-details/${_id}`}
            className="flex h-10 w-full items-center justify-center rounded-lg bg-[#a63d61] font-medium text-white shadow-sm transition-all hover:bg-[#8e3252]"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}
