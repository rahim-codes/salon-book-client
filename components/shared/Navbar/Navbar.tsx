import { Scissors, Sparkles } from "lucide-react"
import Link from "next/link"
import { UserInfo } from "./UserInfo"

export default function Navbar() {
  // TODO: আপনার Better Auth বা সেশন লজিক এখানে যুক্ত করবেন
  const user: {
    name: string
    email: string
    role: "customer" | "admin"
  } | null = null
  /*
  const user = {
    name: "Abdur Rahim",
    email: "rahim@example.com",
    role: "customer" as const,
  };
  */

  const handleLogout = async () => {
    "use server"
    // লজআউট হ্যান্ডলার
  }

  const dashboardHref =
    user?.role === "admin" ? "/dashboard/admin" : "/dashboard/customer"

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Browse Services", href: "/services" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/90 text-zinc-100 backdrop-blur-md">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Professional Brand Logo */}
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-tr from-[#a63d61] to-rose-500 text-white shadow-md shadow-rose-950/50 transition-transform duration-200 group-hover:scale-105">
            <Scissors className="h-5 w-5 -rotate-45" />
            <Sparkles className="absolute -top-1 -right-1 h-3.5 w-3.5 text-amber-300" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-white">
              Salon<span className="text-[#d65a82]">Book</span>
            </span>
            <span className="-mt-1 text-[10px] font-medium tracking-widest text-zinc-400 uppercase">
              Studio & Spa
            </span>
          </div>
        </Link>

        {/* Center/Left: Desktop Menu Items */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-zinc-300 transition-colors hover:text-[#e06c91]"
            >
              {link.name}
            </Link>
          ))}

          {user && (
            <Link
              href={dashboardHref}
              className="text-sm font-medium text-zinc-300 transition-colors hover:text-[#e06c91]"
            >
              Dashboard
            </Link>
          )}
        </nav>

        {/* Right: UserInfo Component (Auth & Dropdown & Mobile Toggle) */}
        <UserInfo user={user} onLogout={handleLogout} />
      </div>
    </header>
  )
}
