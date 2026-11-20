import {
  Camera,
  Clock,
  Mail,
  MapPin,
  Phone,
  Share2,
  Sparkles,
  Video,
} from "lucide-react"
import Link from "next/link"

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
]

const SOCIAL_LINKS = [
  {
    name: "Facebook",
    href: "https://facebook.com",
    icon: Share2,
  },
  {
    name: "Instagram",
    href: "https://instagram.com",
    icon: Camera,
  },
  {
    name: "YouTube",
    href: "https://youtube.com",
    icon: Video,
  },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 text-zinc-300">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* 1. Logo and Short Description */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#a63d61] text-white shadow-md shadow-rose-950/30">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Salon<span className="text-[#e06c91]">Book</span>
              </span>
            </Link>

            <p className="text-xs leading-relaxed text-zinc-400">
              Modern hair care, skincare, grooming, and spa experiences made
              effortless. Browse active salon services, pick your preferred time
              slot, and manage appointments smoothly in one place.
            </p>

            {/* Social Media Links */}
            <div className="flex items-center gap-2.5 pt-1">
              {SOCIAL_LINKS.map(({ name, href, icon: Icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={name}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-400 transition hover:border-[#a63d61] hover:bg-[#a63d61]/15 hover:text-[#e06c91]"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* 2. Important Navigation Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wider text-white uppercase">
              Quick Navigation
            </h3>
            <ul className="space-y-2.5 text-xs">
              {NAV_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-zinc-400 transition hover:text-[#e06c91]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Salon Contact Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wider text-white uppercase">
              Contact Us
            </h3>
            <ul className="space-y-3 text-xs text-zinc-400">
              <li className="flex items-start gap-2.5">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#a63d61]" />
                <a
                  href="tel:+8801700000000"
                  className="transition hover:text-white"
                >
                  +880 1700-000000
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#a63d61]" />
                <a
                  href="mailto:support@salonbook.com"
                  className="transition hover:text-white"
                >
                  support@salonbook.com
                </a>
              </li>
            </ul>
          </div>

          {/* 4. Salon Address and Opening Hours */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wider text-white uppercase">
              Location & Hours
            </h3>
            <div className="space-y-3 text-xs text-zinc-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#a63d61]" />
                <span>House 24, Road 11, Banani, Dhaka 1213, Bangladesh</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[#a63d61]" />
                <div className="space-y-1">
                  <p>Sat – Thu: 10:00 AM – 08:00 PM</p>
                  <p>Friday: 02:00 PM – 08:30 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-zinc-800/80 pt-6 text-xs text-zinc-500 sm:flex-row">
          <p>© {currentYear} SalonBook. All rights reserved.</p>
          <p>Crafted for seamless salon booking & management.</p>
        </div>
      </div>
    </footer>
  )
}
