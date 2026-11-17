import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

export default function HeroSection() {
  return (
    <section className="relative flex h-100 items-center justify-center overflow-hidden bg-zinc-950 sm:h-115 md:h-125">
      {/* Background Image & Overlay */}
      <div
        className="absolute inset-0 scale-100 bg-cover bg-center bg-no-repeat transition-transform duration-1000"
        style={{
          // আপনার নিজের ইমেজ পাথ এখানে বসাবেন (যেমন: /images/hero-bg.jpg বা পাবলিক ফোল্ডারের যেকোনো ছবি)
          backgroundImage: "url('/images/salon-hero-bg.jpg')",
        }}
      >
        {/* Dark Gradient Overlay for Professional Contrast and Readability */}
        <div className="absolute inset-0 bg-linear-to-r from-zinc-950/90 via-zinc-950/70 to-zinc-950/40 backdrop-blur-[2px]" />
      </div>

      {/* Content Container */}
      <div className="relative container mx-auto flex max-w-7xl flex-col items-start justify-center px-4 py-20 sm:px-6 md:py-32 lg:px-8">
        {/* Top Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#a63d61]/40 bg-[#a63d61]/20 px-3.5 py-1.5 text-xs font-medium text-rose-300 shadow-sm backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5 text-amber-300" />
          <span>Welcome to SalonBook Studio & Spa</span>
        </div>

        {/* Main Heading (Requirement: Title & Short Description) */}
        <h1 className="mb-6 max-w-3xl text-4xl leading-[1.1] font-bold tracking-tight text-white sm:text-5xl md:text-4xl lg:text-5xl">
          Look good. Feel great. Book in minutes.
        </h1>

        {/* Short Description */}
        <p className="mb-8 max-w-xl text-base leading-relaxed font-normal text-zinc-300 sm:text-lg md:text-xl">
          Pick a service, choose a time, and pay securely after
          confirmation[cite: 24]. Experience professional salon care tailored
          just for you.
        </p>

        {/* CTA Buttons */}
        <div className="flex w-full flex-col items-stretch gap-4 sm:w-auto sm:flex-row sm:items-center">
          <Link
            href="/services"
            className="group flex h-12 items-center justify-center gap-2 rounded-xl bg-[#a63d61] px-8 font-semibold text-white shadow-lg shadow-rose-950/50 transition-all duration-200 hover:bg-[#8e3252]"
          >
            <span>Explore Salon Services</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="/sign-in"
            className="flex h-12 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900/50 px-8 text-zinc-200 backdrop-blur-md hover:bg-zinc-800 hover:text-white"
          >
            Sign In to Account
          </Link>
        </div>
      </div>
    </section>
  )
}
