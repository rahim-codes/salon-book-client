import { ArrowLeft, Compass, Home, Sparkles } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-zinc-950 px-4 py-16 text-zinc-100 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg rounded-3xl border border-zinc-800 bg-zinc-900 p-8 text-center shadow-2xl shadow-rose-950/10 sm:p-10">
        {/* Top Icon Badge */}
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#a63d61]/40 bg-[#a63d61]/15 text-[#e06c91]">
          <Compass className="h-8 w-8" />
        </div>

        {/* 404 Label */}
        <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-950 px-3.5 py-1 text-xs font-semibold tracking-widest text-[#e06c91] uppercase">
          <Sparkles className="h-3.5 w-3.5" />
          Error 404
        </span>

        {/* Heading & Message */}
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Page Not Found
        </h1>
        <p className="mt-2.5 text-sm leading-relaxed text-zinc-400">
          The page or salon service you are looking for might have been moved,
          removed, or the link is incorrect.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#a63d61] px-5 text-sm font-medium text-white shadow-lg shadow-rose-950/20 transition-all hover:bg-[#8e3252] sm:w-auto"
          >
            <Home className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>

          <Link
            href="/browser-services"
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-950 px-5 text-sm font-medium text-zinc-200 transition-colors hover:border-[#a63d61]/60 hover:text-white sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Browse Services</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
