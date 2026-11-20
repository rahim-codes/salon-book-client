import {
  ArrowRight,
  Droplets,
  Flower2,
  Hand,
  Palette,
  Scissors,
  Smile,
  Wand2,
} from "lucide-react"
import Link from "next/link"

const CATEGORIES = [
  {
    name: "Haircut & Styling",
    description:
      "Precision cuts, blowouts, and modern styling tailored to you.",
    icon: Scissors,
  },
  {
    name: "Hair Coloring",
    description: "Vibrant shades, balayage, highlights, and root touch-ups.",
    icon: Palette,
  },
  {
    name: "Hair Treatment",
    description:
      "Keratin smoothing, deep hydration, and hair repair therapies.",
    icon: Droplets,
  },
  {
    name: "Facial & Skincare",
    description: "Glow facials, deep cleansing, and revitalizing skin care.",
    icon: Smile,
  },
  {
    name: "Makeup",
    description: "Bridal, party, and editorial makeup for every occasion.",
    icon: Wand2,
  },
  {
    name: "Manicure & Pedicure",
    description:
      "Nail shaping, cuticle care, gel polish, and soothing foot care.",
    icon: Hand,
  },
  {
    name: "Spa & Massage",
    description: "Relaxing aromatherapy, body massage, and stress relief spa.",
    icon: Flower2,
  },
]

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-12 text-zinc-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-10">
        <div className="border-b border-zinc-800 pb-6">
          <span className="text-xs font-semibold tracking-widest text-[#d65a82] uppercase">
            Salon Specialties
          </span>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Service Categories
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Select a category to explore available services.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map(({ name, description, icon: Icon }) => (
            <Link
              key={name}
              href={`/categories/${encodeURIComponent(name)}`}
              className="group flex flex-col justify-between rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition-all duration-300 hover:border-[#a63d61]/60 hover:shadow-xl hover:shadow-rose-950/20"
            >
              <div className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950 text-[#e06c91] transition-colors group-hover:border-[#a63d61] group-hover:bg-[#a63d61] group-hover:text-white">
                  <Icon className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-white transition-colors group-hover:text-[#e06c91]">
                    {name}
                  </h2>
                  <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">
                    {description}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-[#e06c91]">
                <span>Explore Services</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
