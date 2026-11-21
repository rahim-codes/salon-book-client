"use client"

import { apiClient } from "@/lib/api-client"
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  Loader2,
  XCircle,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

interface AppointmentSummary {
  _id: string
  serviceName: string
  appointmentDate: string
  timeSlot: string
  price: number
  status: "Pending" | "Confirmed" | "Cancelled"
  paymentStatus: "Unpaid" | "Paid"
}

export default function CustomerDashboardPage() {
  const [appointments, setAppointments] = useState<AppointmentSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function loadOverview() {
      try {
        const res = await fetch("/api/auth/get-session", { cache: "no-store" })
        const session = res.ok ? await res.json() : null
        const email =
          session?.user?.email?.trim().toLowerCase() ||
          session?.data?.user?.email?.trim().toLowerCase() ||
          ""

        if (!email) {
          if (active) setLoading(false)
          return
        }

        const dataRes = await apiClient.appointments.getByCustomer(email)
        if (!active) return

        if (dataRes.success && Array.isArray(dataRes.data)) {
          setAppointments(dataRes.data)
        }
      } catch (err) {
        console.error("Failed to load customer overview:", err)
      } finally {
        if (active) setLoading(false)
      }
    }

    loadOverview()
    return () => {
      active = false
    }
  }, [])

  const stats = [
    {
      title: "Total",
      count: appointments.length,
      icon: Calendar,
      accent: "text-sky-400",
    },
    {
      title: "Pending",
      count: appointments.filter((a) => a.status === "Pending").length,
      icon: Clock,
      accent: "text-amber-400",
    },
    {
      title: "Confirmed",
      count: appointments.filter((a) => a.status === "Confirmed").length,
      icon: CheckCircle2,
      accent: "text-emerald-400",
    },
    {
      title: "Cancelled",
      count: appointments.filter((a) => a.status === "Cancelled").length,
      icon: XCircle,
      accent: "text-rose-400",
    },
  ]

  const recentAppointments = appointments.slice(0, 3)

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-zinc-950 text-zinc-400">
        <Loader2 className="mr-2 h-5 w-5 animate-spin text-[#a63d61]" />
        <span>Loading overview...</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-10 text-zinc-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-6">
          <div>
            <span className="text-xs font-semibold tracking-widest text-[#d65a82] uppercase">
              Customer Dashboard
            </span>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">
              Customer Overview
            </h1>
          </div>

          <Link
            href="/customer/my-appointments"
            className="inline-flex items-center gap-2 rounded-xl bg-[#a63d61] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#8e3252]"
          >
            <span>Go to My Appointments</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
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

        {/* Recent Appointments Preview */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              Recent Appointments
            </h2>
            <Link
              href="/customer/my-appointments"
              className="text-xs font-medium text-[#e06c91] hover:underline"
            >
              Manage all ({appointments.length})
            </Link>
          </div>

          {recentAppointments.length === 0 ? (
            <p className="py-6 text-center text-sm text-zinc-400">
              No appointments booked yet.
            </p>
          ) : (
            <div className="divide-y divide-zinc-800">
              {recentAppointments.map((apt) => (
                <div
                  key={apt._id}
                  className="flex flex-wrap items-center justify-between gap-3 py-3.5 text-sm"
                >
                  <div>
                    <p className="font-medium text-white">{apt.serviceName}</p>
                    <p className="text-xs text-zinc-400">
                      {apt.appointmentDate} · {apt.timeSlot}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-zinc-200">
                      ৳ {apt.price}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        apt.status === "Confirmed"
                          ? "border border-emerald-800/50 bg-emerald-950/70 text-emerald-300"
                          : apt.status === "Pending"
                            ? "border border-amber-800/50 bg-amber-950/70 text-amber-300"
                            : "border border-rose-800/50 bg-rose-950/70 text-rose-300"
                      }`}
                    >
                      {apt.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
