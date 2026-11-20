import { Sparkles } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-zinc-950 px-4 py-16 text-zinc-100">
      <div className="flex flex-col items-center justify-center rounded-3xl border border-zinc-800 bg-zinc-900/90 px-10 py-12 text-center shadow-2xl shadow-rose-950/10">
        {/* Animated Spinner Ring + Brand Icon */}
        <div className="relative flex h-16 w-16 items-center justify-center">
          <span className="absolute inset-0 animate-spin rounded-full border-2 border-zinc-800 border-t-[#a63d61]" />
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#a63d61]/30 bg-[#a63d61]/15 text-[#e06c91]">
            <Sparkles className="h-5 w-5 animate-pulse" />
          </div>
        </div>

        {/* Brand & Status Text */}
        <p className="mt-5 text-base font-bold tracking-tight text-white">
          Salon<span className="text-[#e06c91]">Book</span>
        </p>
        <p className="mt-1 text-xs font-medium tracking-wide text-zinc-400">
          Preparing your experience...
        </p>
      </div>
    </div>
  )
}
