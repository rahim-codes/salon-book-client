"use client"

import { Button } from "@/components/ui/button"
import { apiClient } from "@/lib/api-client"
import {
  Calendar,
  CheckCircle2,
  Clock,
  Eye,
  Loader2,
  ShieldAlert,
  User,
  X,
  XCircle,
} from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"

export interface AdminAppointment {
  _id: string
  serviceId: string
  serviceName: string
  image?: string
  category?: string
  price: number
  duration?: number
  appointmentDate: string
  timeSlot: string
  message?: string
  customerName?: string
  customerEmail?: string
  status: "Pending" | "Confirmed" | "Cancelled"
  paymentStatus: "Unpaid" | "Paid"
  createdAt: string
}

const STATUS_BADGE: Record<AdminAppointment["status"], string> = {
  Pending: "border-amber-800/60 bg-amber-950/60 text-amber-300",
  Confirmed: "border-emerald-800/60 bg-emerald-950/60 text-emerald-300",
  Cancelled: "border-rose-800/60 bg-rose-950/60 text-rose-300",
}

const PAYMENT_BADGE: Record<AdminAppointment["paymentStatus"], string> = {
  Paid: "border-emerald-800/60 bg-emerald-950/60 text-emerald-400",
  Unpaid: "border-zinc-700 bg-zinc-800/80 text-zinc-300",
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "—"
  const date = new Date(dateStr)
  if (Number.isNaN(date.getTime())) return dateStr
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export default function ManageAppointmentsPage() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [appointments, setAppointments] = useState<AdminAppointment[]>([])
  const [ui, setUi] = useState({
    loading: true,
    actionId: null as string | null,
    selected: null as AdminAppointment | null,
    feedback: null as { type: "success" | "error"; message: string } | null,
  })

  const updateUi = (patch: Partial<typeof ui>) =>
    setUi((prev) => ({ ...prev, ...patch }))

  const loadAllAppointments = async () => {
    try {
      const res = await apiClient.appointments.getAll()
      if (res.success && Array.isArray(res.data)) {
        setAppointments(res.data)
      }
    } catch (err) {
      console.error("Failed to load appointments:", err)
    } finally {
      updateUi({ loading: false })
    }
  }

  useEffect(() => {
    async function checkAdminAndLoad() {
      try {
        const res = await fetch("/api/auth/get-session", { cache: "no-store" })
        const session = res.ok ? await res.json() : null
        const role = session?.user?.role || session?.data?.user?.role
        const allowed = role === "admin" || role === "Admin"
        setIsAdmin(allowed)
        if (allowed) {
          await loadAllAppointments()
        } else {
          updateUi({ loading: false })
        }
      } catch {
        setIsAdmin(false)
        updateUi({ loading: false })
      }
    }
    checkAdminAndLoad()
  }, [])

  const handleConfirm = async (id: string) => {
    updateUi({ actionId: id, feedback: null })
    try {
      const res = await apiClient.appointments.confirm(id)
      if (res.success) {
        setAppointments((prev) =>
          prev.map((item) =>
            item._id === id ? { ...item, status: "Confirmed" } : item
          )
        )
        updateUi({
          selected:
            ui.selected?._id === id
              ? { ...ui.selected, status: "Confirmed" }
              : ui.selected,
          feedback: {
            type: "success",
            message: res.message || "Appointment confirmed successfully!",
          },
        })
      } else {
        updateUi({
          feedback: {
            type: "error",
            message:
              res.message || "Only pending appointments can be confirmed.",
          },
        })
      }
    } catch {
      updateUi({
        feedback: {
          type: "error",
          message: "Failed to confirm appointment.",
        },
      })
    } finally {
      updateUi({ actionId: null })
    }
  }

  const handleCancel = async (id: string) => {
    updateUi({ actionId: id, feedback: null })
    try {
      const res = await apiClient.appointments.adminCancel(id)
      if (res.success) {
        setAppointments((prev) =>
          prev.map((item) =>
            item._id === id ? { ...item, status: "Cancelled" } : item
          )
        )
        updateUi({
          selected:
            ui.selected?._id === id
              ? { ...ui.selected, status: "Cancelled" }
              : ui.selected,
          feedback: {
            type: "success",
            message: res.message || "Appointment cancelled successfully.",
          },
        })
      } else {
        updateUi({
          feedback: {
            type: "error",
            message: res.message || "Could not cancel appointment.",
          },
        })
      }
    } catch {
      updateUi({
        feedback: {
          type: "error",
          message: "Failed to cancel appointment.",
        },
      })
    } finally {
      updateUi({ actionId: null })
    }
  }

  if (isAdmin === null || ui.loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-zinc-950 text-zinc-400">
        <Loader2 className="mr-2 h-5 w-5 animate-spin text-[#a63d61]" />
        <span>Loading appointments...</span>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-zinc-950 px-4 text-center text-zinc-100">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-rose-900/50 bg-rose-950/50 text-rose-400">
          <ShieldAlert className="h-7 w-7" />
        </div>
        <h2 className="text-xl font-bold text-white">Admin Access Required</h2>
        <p className="mt-1 max-w-md text-sm text-zinc-400">
          Only administrators can view and manage all customer appointments.
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-10 text-zinc-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="border-b border-zinc-800 pb-6">
          <span className="text-xs font-semibold tracking-widest text-[#d65a82] uppercase">
            Admin Console
          </span>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">
            Manage Appointments ({appointments.length})
          </h1>
        </div>

        {ui.feedback && (
          <div
            className={`rounded-xl border px-4 py-3 text-sm ${
              ui.feedback.type === "success"
                ? "border-emerald-800/60 bg-emerald-950/50 text-emerald-300"
                : "border-rose-800/60 bg-rose-950/50 text-rose-300"
            }`}
          >
            {ui.feedback.message}
          </div>
        )}

        {appointments.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 py-14 text-center text-sm text-zinc-400">
            No appointment requests found.
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((item) => {
              const canConfirm = item.status === "Pending"
              const canCancel =
                item.status === "Pending" || item.status === "Confirmed"
              const isBusy = ui.actionId === item._id

              return (
                <div
                  key={item._id}
                  className="flex flex-col justify-between gap-5 rounded-2xl border border-zinc-800 bg-zinc-900 p-5 transition hover:border-zinc-700 xl:flex-row xl:items-center"
                >
                  {/* Service & Customer Info */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-4">
                      <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
                        <Image
                          src={
                            item.image ||
                            "https://images.unsplash.com/photo-1560066984-138dadb4c035"
                          }
                          alt={item.serviceName}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-base font-bold text-white">
                            {item.serviceName}
                          </h2>
                          {item.category && (
                            <span className="rounded-full bg-zinc-950 px-2.5 py-0.5 text-xs font-medium text-[#e06c91]">
                              {item.category}
                            </span>
                          )}
                          <span className="text-sm font-bold text-white">
                            • ৳ {item.price}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-400">
                          <span className="inline-flex items-center gap-1 text-zinc-300">
                            <User className="h-3.5 w-3.5 text-[#a63d61]" />
                            {item.customerName || "Customer"} (
                            {item.customerEmail || "No email"})
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-400">
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-[#a63d61]" />
                            {formatDate(item.appointmentDate)}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-[#a63d61]" />
                            {item.timeSlot}
                          </span>
                          <span>Requested: {formatDate(item.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    {item.message && (
                      <p className="rounded-xl border border-zinc-800/80 bg-zinc-950/70 px-3 py-2 text-xs text-zinc-300">
                        <span className="font-semibold text-zinc-400">
                          Message:{" "}
                        </span>
                        {item.message}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                          STATUS_BADGE[item.status] || STATUS_BADGE.Pending
                        }`}
                      >
                        {item.status}
                      </span>
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                          PAYMENT_BADGE[item.paymentStatus] ||
                          PAYMENT_BADGE.Unpaid
                        }`}
                      >
                        Payment: {item.paymentStatus}
                      </span>
                    </div>
                  </div>

                  {/* Admin Actions */}
                  <div className="flex flex-wrap items-center gap-2.5 border-t border-zinc-800 pt-4 xl:justify-end xl:border-t-0 xl:pt-0">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => updateUi({ selected: item })}
                      className="h-9 rounded-xl border-zinc-700 bg-zinc-950 text-xs text-zinc-200 hover:bg-zinc-800"
                    >
                      <Eye className="mr-1.5 h-3.5 w-3.5" />
                      Details
                    </Button>

                    {canConfirm && (
                      <Button
                        type="button"
                        disabled={isBusy}
                        onClick={() => handleConfirm(item._id)}
                        className="h-9 rounded-xl bg-emerald-600 text-xs font-medium text-white hover:bg-emerald-700"
                      >
                        {isBusy ? (
                          <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                        )}
                        Confirm
                      </Button>
                    )}

                    {canCancel && (
                      <Button
                        type="button"
                        disabled={isBusy}
                        onClick={() => handleCancel(item._id)}
                        className="h-9 rounded-xl border border-rose-800/60 bg-rose-950/80 text-xs font-medium text-rose-300 hover:bg-rose-900/70"
                      >
                        {isBusy ? (
                          <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <XCircle className="mr-1.5 h-3.5 w-3.5" />
                        )}
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Appointment Details Modal */}
        {ui.selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs">
            <div className="w-full max-w-lg space-y-5 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-zinc-100">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <h3 className="text-lg font-bold text-white">
                  Appointment Details
                </h3>
                <button
                  type="button"
                  onClick={() => updateUi({ selected: null })}
                  className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Customer Name:</span>
                  <span className="font-medium text-white">
                    {ui.selected.customerName || "Customer"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Customer Email:</span>
                  <span>{ui.selected.customerEmail || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Service:</span>
                  <span className="font-medium text-white">
                    {ui.selected.serviceName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Category:</span>
                  <span>{ui.selected.category || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Appointment Date:</span>
                  <span>{formatDate(ui.selected.appointmentDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Time Slot:</span>
                  <span>{ui.selected.timeSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Service Price:</span>
                  <span className="font-semibold text-[#e06c91]">
                    ৳ {ui.selected.price}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Appointment Status:</span>
                  <span>{ui.selected.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Payment Status:</span>
                  <span>{ui.selected.paymentStatus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Booking Request Date:</span>
                  <span>{formatDate(ui.selected.createdAt)}</span>
                </div>
                {ui.selected.message && (
                  <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-xs text-zinc-300">
                    <p className="mb-1 font-semibold text-zinc-400">
                      Customer Message:
                    </p>
                    <p>{ui.selected.message}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 border-t border-zinc-800 pt-4">
                {ui.selected.status === "Pending" && (
                  <Button
                    type="button"
                    disabled={ui.actionId === ui.selected._id}
                    onClick={() => handleConfirm(ui.selected!._id)}
                    className="rounded-xl bg-emerald-600 text-xs text-white hover:bg-emerald-700"
                  >
                    Confirm
                  </Button>
                )}
                {(ui.selected.status === "Pending" ||
                  ui.selected.status === "Confirmed") && (
                  <Button
                    type="button"
                    disabled={ui.actionId === ui.selected._id}
                    onClick={() => handleCancel(ui.selected!._id)}
                    className="rounded-xl bg-rose-700 text-xs text-white hover:bg-rose-800"
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => updateUi({ selected: null })}
                  className="rounded-xl border-zinc-700 bg-zinc-950 text-xs text-zinc-200 hover:bg-zinc-800"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
