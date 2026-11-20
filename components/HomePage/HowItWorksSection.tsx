import {
  ArrowRight,
  Award,
  CalendarCheck2,
  Clock,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react"
import Link from "next/link"

const STEPS = [
  {
    step: "01",
    title: "Explore Salon Services",
    description:
      "Browse active hair, skincare, nail, and spa treatments with transparent pricing and estimated duration.",
    icon: Sparkles,
  },
  {
    step: "02",
    title: "Pick Date & Time Slot",
    description:
      "Choose your preferred appointment date, convenient time slot, and add any special stylist notes.",
    icon: CalendarCheck2,
  },
  {
    step: "03",
    title: "Instant Confirmation & Care",
    description:
      "Track your request status in real time, pay easily once confirmed, and enjoy a stress-free salon visit.",
    icon: ShieldCheck,
  },
]

const HIGHLIGHTS = [
  {
    label: "Certified Stylists",
    value: "15+ Specialists",
    icon: Award,
  },
  {
    label: "On-Time Slots",
    value: "Zero Long Waits",
    icon: Clock,
  },
  {
    label: "Client Rating",
    value: "4.9 / 5 Average",
    icon: Star,
  },
]

export default function HowItWorksSection() {
  return (
    <section className="border-t border-zinc-800/80 bg-zinc-950 px-4 py-16 text-zinc-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-12">
        {/* Section Header */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="max-w-xl">
            <span className="text-xs font-semibold tracking-widest text-[#d65a82] uppercase">
              Simple 3-Step Experience
            </span>
            <h2 className="mt-1.5 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              How SalonBook Works
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              Skip phone calls and waiting queues—book your next self-care
              session in under a minute.
            </p>
          </div>

          <Link
            href="/browser-services"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#a63d61] px-5 text-xs font-semibold text-white shadow-lg shadow-rose-950/20 transition-all hover:bg-[#8e3252] sm:text-sm"
          >
            <span>Explore Services</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* 3 Steps Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {STEPS.map(({ step, title, description, icon: Icon }) => (
            <div
              key={step}
              className="group relative flex flex-col justify-between rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition-all duration-300 hover:border-[#a63d61]/50 hover:shadow-xl hover:shadow-rose-950/15"
            >
              <div>
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950 text-[#e06c91] transition-colors group-hover:border-[#a63d61] group-hover:bg-[#a63d61] group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-2xl font-extrabold tracking-tight text-zinc-800 transition-colors group-hover:text-[#a63d61]/50">
                    {step}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white">{title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Trust / Highlights Strip */}
        <div className="grid grid-cols-1 gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 sm:grid-cols-3">
          {HIGHLIGHTS.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="flex items-center gap-3.5 rounded-xl border border-zinc-800/80 bg-zinc-950/80 px-4 py-3.5"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#a63d61]/15 text-[#e06c91]">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-zinc-400">{label}</p>
                <p className="text-sm font-bold text-white">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
