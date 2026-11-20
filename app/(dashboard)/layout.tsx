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
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function fetchRole() {
      try {
        const res = await fetch("/api/auth/get-session", { cache: "no-store" })
        if (!res.ok) return
        const session = await res.json()
        const userRole =
          session?.user?.role || session?.data?.user?.role || null
        if (active && userRole) {
          setRole(String(userRole).toLowerCase())
        }
      } catch {
        // সেশন না পাওয়া গেলে পাথওয়ে ফলব্যাক ব্যবহার হবে
      }
    }

    fetchRole()
    return () => {
      active = false
    }
  }, [pathname])

  const isAdmin = role ? role === "admin" : pathname.startsWith("/admin")

  // Admin sidebar
  const adminLinks = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    {
      name: "Manage Services",
      href: "/admin/manage-services",
      icon: ConciergeBell,
    },
    {
      name: "Add Service",
      href: "/admin/services",
      icon: PlusCircle,
    },
    {
      name: "Manage Appointments",
      href: "/admin/manage-appointments",
      icon: CalendarCheck,
    },
    { name: "Manage Users", href: "/dashboard/admin/users", icon: Users },
    {
      name: "Transactions",
      href: "/dashboard/admin/transactions",
      icon: CreditCard,
    },
    { name: "My Profile", href: "/profile", icon: User },
  ]

  // Customer sidebar
  const customerLinks = [
    { name: "Overview", href: "/customer", icon: LayoutDashboard },
    {
      name: "My Appointments",
      href: "/customer/my-appointments",
      icon: CalendarCheck,
    },
    { name: "My Profile", href: "/profile", icon: User },
  ]

  const links = isAdmin ? adminLinks : customerLinks

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/sign-out", { method: "POST" })
    } catch {
      // ইগনোর করা হয়েছে
    } finally {
      setRole(null)
      router.push("/login")
      router.refresh()
    }
  }

  return (
    <div className="flex min-h-screen bg-zinc-50 text-zinc-900">
      {/* Sidebar */}
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
            type="button"
            onClick={handleLogout}
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
