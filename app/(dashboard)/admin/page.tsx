"use client"

import { apiClient } from "@/lib/api-client"
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  Clock,
  CreditCard,
  Loader2,
  Scissors,
  Users,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

interface ServiceItem {
  _id: string
  status?: string
}

interface AppointmentItem {
  _id: string
  status?: string
  paymentStatus?: string
}

interface UserItem {
  _id: string
  role?: string
}

interface TransactionItem {
  _id: string
  paymentStatus?: string
}

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [users, setUsers] = useState<UserItem[]>([])
  const [services, setServices] = useState<ServiceItem[]>([])
  const [appointments, setAppointments] = useState<AppointmentItem[]>([])
  const [transactions, setTransactions] = useState<TransactionItem[]>([])

  useEffect(() => {
    let active = true

    async function loadOverviewData() {
      try {
        setLoading(true)
        setError("")

        const [usersRes, servicesRes, appointmentsRes, txRes] =
          await Promise.allSettled([
            apiClient.users.getAllCustomers(),
            apiClient.services.getAll(),
            apiClient.appointments.getAll(),
            apiClient.payments.getAll(),
          ])

        if (!active) return

        if (usersRes.status === "fulfilled" && usersRes.value?.success) {
          setUsers(
            Array.isArray(usersRes.value.data) ? usersRes.value.data : []
          )
        }

        if (servicesRes.status === "fulfilled" && servicesRes.value?.success) {
          setServices(
            Array.isArray(servicesRes.value.data) ? servicesRes.value.data : []
          )
        }

        if (
          appointmentsRes.status === "fulfilled" &&
          appointmentsRes.value?.success
        ) {
          setAppointments(
            Array.isArray(appointmentsRes.value.data)
              ? appointmentsRes.value.data
              : []
          )
        }

        if (txRes.status === "fulfilled" && txRes.value?.success) {
          setTransactions(
            Array.isArray(txRes.value.data) ? txRes.value.data : []
          )
        }
      } catch {
        if (active) setError("Failed to load admin overview data.")
      } finally {
        if (active) setLoading(false)
      }
    }

    loadOverviewData()
    return () => {
      active = false
    }
  }, [])

  const customersCount = users.filter(
    (u) => !u.role || u.role.toLowerCase() === "customer"
  ).length

  const activeServicesCount = services.filter(
    (s) => (s.status || "Active").toLowerCase() === "active"
  ).length

  const requestsCount = appointments.length

  const pendingCount = appointments.filter(
    (a) => (a.status || "").toLowerCase() === "pending"
  ).length

  const confirmedCount = appointments.filter(
    (a) => (a.status || "").toLowerCase() === "confirmed"
  ).length

  const successfulPaymentsCount =
    transactions.length > 0
      ? transactions.filter(
          (t) => (t.paymentStatus || "Paid").toLowerCase() === "paid"
        ).length
      : appointments.filter(
          (a) => (a.paymentStatus || "").toLowerCase() === "paid"
        ).length

  const stats = [
    {
      title: "Customers",
      count: customersCount,
      icon: Users,
      accent: "text-sky-400",
    },
    {
      title: "Active Services",
      count: activeServicesCount,
      icon: Scissors,
      accent: "text-[#e06c91]",
    },
    {
      title: "Total Requests",
      count: requestsCount,
      icon: CalendarCheck,
      accent: "text-violet-400",
    },
    {
      title: "Pending",
      count: pendingCount,
      icon: Clock,
      accent: "text-amber-400",
    },
    {
      title: "Confirmed",
      count: confirmedCount,
      icon: CheckCircle2,
      accent: "text-emerald-400",
    },
    {
      title: "Successful Payments",
      count: successfulPaymentsCount,
      icon: CreditCard,
      accent: "text-emerald-400",
    },
  ]

  const quickActions = [
    {
      title: "Manage Services",
      description: "Add, edit, or delete salon services and pricing",
      href: "/admin/manage-services",
    },
    {
      title: "Manage Appointments",
      description: "Review pending requests and confirm bookings",
      href: "/admin/appointments",
    },
    {
      title: "Manage Users",
      description: "View customer profiles and manage account access",
      href: "/admin/users",
    },
    {
      title: "Transactions",
      description: "Inspect verified Stripe payment records",
      href: "/admin/transactions",
    },
  ]

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-zinc-950 text-zinc-400">
        <Loader2 className="mr-2 h-6 w-6 animate-spin text-[#a63d61]" />
        <span>Loading overview...</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-10 text-zinc-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="border-b border-zinc-800 pb-6">
          <span className="text-xs font-semibold tracking-widest text-[#d65a82] uppercase">
            Admin Console
          </span>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">
            Admin Overview
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Live summary of customers, services, appointments, and verified
            payments.
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-rose-800/60 bg-rose-950/50 px-4 py-3 text-sm text-rose-300">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.title}
                className="flex flex-col justify-between rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition hover:border-zinc-700"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-zinc-400">
                    {stat.title}
                  </span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950">
                    <Icon className={`h-4 w-4 ${stat.accent}`} />
                  </div>
                </div>
                <span className="mt-4 text-3xl font-bold text-white">
                  {stat.count}
                </span>
              </div>
            )
          })}
        </div>

        {/* Quick Navigation to Existing Admin Pages */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Quick Access</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {quickActions.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900 p-5 transition hover:border-[#a63d61]/70 hover:bg-zinc-900/80"
              >
                <div>
                  <h3 className="font-semibold text-white group-hover:text-[#e06c91]">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs text-zinc-400">
                    {item.description}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-zinc-500 transition-transform group-hover:translate-x-1 group-hover:text-[#e06c91]" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
