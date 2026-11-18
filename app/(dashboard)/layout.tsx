"use client"

import {
  CalendarCheck,
  ConciergeBell,
  CreditCard,
  LayoutDashboard,
  LogOut,
  PlusCircle,
  Scissors,
  User,
  Users,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith("/admin")

  // Admin sidebar
  const adminLinks = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    {
      name: "Manage Services",
      href: "/dashboard/admin/services",
      icon: ConciergeBell,
    },
    {
      name: "Add Service",
      href: "/admin/services",
      icon: PlusCircle,
    },
    {
      name: "Manage Appointments",
      href: "/dashboard/admin/appointments",
      icon: CalendarCheck,
    },
    { name: "Manage Users", href: "/dashboard/admin/users", icon: Users },
    {
      name: "Transactions",
      href: "/dashboard/admin/transactions",
      icon: CreditCard,
    },
    { name: "My Profile", href: "/dashboard/admin/profile", icon: User },
  ]

  // Customer sidebar
  const customerLinks = [
    { name: "Overview", href: "/dashboard/customer", icon: LayoutDashboard },
    {
      name: "My Appointments",
      href: "/dashboard/customer/appointments",
      icon: CalendarCheck,
    },
    { name: "My Profile", href: "/dashboard/customer/profile", icon: User },
  ]

  const links = isAdmin ? adminLinks : customerLinks

  return (
    <div className="flex min-h-screen bg-zinc-50 text-zinc-900">
      {/* Sidebar (Dark Theme as per Screenshot) */}
      <aside className="flex w-64 shrink-0 flex-col justify-between border-r border-zinc-800 bg-[#23171f] text-zinc-100">
        <div>
          {/* Logo Area */}
          <div className="flex h-20 items-center gap-2.5 px-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-[#a63d61] to-rose-500 text-white shadow-md">
              <Scissors className="h-4 w-4 -rotate-45" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Salon<span className="text-[#d65a82]">Book</span>
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="mt-4 space-y-1.5 px-3">
            {links.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-3 rounded-lg px-3.5 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#a63d61] text-white shadow-sm"
                      : "text-zinc-300 hover:bg-zinc-800/60 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{link.name}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Bottom Logout Button */}
        <div className="border-t border-zinc-800/80 p-4">
          <button
            onClick={() => console.log("Logging out...")}
            className="flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium text-rose-300 transition-colors hover:bg-rose-950/40 hover:text-rose-200"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8 md:p-10">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  )
}
