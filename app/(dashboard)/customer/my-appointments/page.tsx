"use client"

import { Button } from "@/components/ui/button"
import { apiClient } from "@/lib/api-client"
import {
  Calendar,
  Clock,
  CreditCard,
  Eye,
  Loader2,
  X,
  XCircle,
} from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"

export interface AppointmentItem {
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
  customerEmail: string
  status: "Pending" | "Confirmed" | "Cancelled"
  paymentStatus: "Unpaid" | "Paid"
  createdAt: string
}

const STATUS_STYLE: Record<AppointmentItem["status"], string> = {
  Pending: "border-amber-800/60 bg-amber-950/60 text-amber-300",
  Confirmed: "border-emerald-800/60 bg-emerald-950/60 text-emerald-300",
  Cancelled: "border-rose-800/60 bg-rose-950/60 text-rose-300",
}

const PAYMENT_STYLE: Record<AppointmentItem["paymentStatus"], string> = {
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

export default function MyAppointmentsPage() {
  const [userEmail, setUserEmail] = useState<string>("")
  const [appointments, setAppointments] = useState<AppointmentItem[]>([])
  const [ui, setUi] = useState({
    loading: true,
    actionId: null as string | null,
    selected: null as AppointmentItem | null,
    feedback: null as { type: "success" | "error"; message: string } | null,
  })

  const updateUi = (patch: Partial<typeof ui>) =>
    setUi((prev) => ({ ...prev, ...patch }))

  const fetchAppointments = async (email: string) => {
    try {
      const res = await apiClient.appointments.getByCustomer(email)
      if (res.success && Array.isArray(res.data)) {
        setAppointments(res.data)
      }
    } catch (err) {
      console.error("Failed to fetch appointments:", err)
    } finally {
      updateUi({ loading: false })
    }
  }

  useEffect(() => {
    async function loadSessionAndData() {
      try {
        const res = await fetch("/api/auth/get-session", { cache: "no-store" })
        const session = res.ok ? await res.json() : null
        const email =
          session?.user?.email?.trim().toLowerCase() ||
          session?.data?.user?.email?.trim().toLowerCase() ||
          ""

        setUserEmail(email)
        if (!email) {
          updateUi({ loading: false })
          return
        }
        await fetchAppointments(email)
      } catch {
        updateUi({ loading: false })
      }
    }
    loadSessionAndData()
  }, [])

  const handleCancel = async (id: string) => {
    updateUi({ actionId: id, feedback: null })
    try {
      const res = await apiClient.appointments.cancel(id, userEmail)
      if (res.success) {
        setAppointments((prev) =>
          prev.map((item) =>
            item._id === id ? { ...item, status: "Cancelled" } : item
          )
        )
        if (ui.selected?._id === id) {
          updateUi({
            selected: { ...ui.selected, status: "Cancelled" },
            feedback: {
              type: "success",
              message: res.message || "Appointment cancelled.",
            },
          })
        } else {
          updateUi({
            feedback: {
              type: "success",
              message: res.message || "Appointment cancelled.",
            },
          })
        }
      } else {
        updateUi({
          feedback: {
            type: "error",
            message: res.message || "Cannot cancel this appointment.",
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

  // const handlePay = async (id: string) => {
  //   updateUi({ actionId: id, feedback: null })
  //   try {
  //     const res = await apiClient.appointments.pay(id, userEmail)
  //     if (res.success) {
  //       setAppointments((prev) =>
  //         prev.map((item) =>
  //           item._id === id ? { ...item, paymentStatus: "Paid" } : item
  //         )
  //       )
  //       if (ui.selected?._id === id) {
  //         updateUi({
  //           selected: { ...ui.selected, paymentStatus: "Paid" },
  //           feedback: {
  //             type: "success",
  //             message: res.message || "Payment completed!",
  //           },
  //         })
  //       } else {
  //         updateUi({
  //           feedback: {
  //             type: "success",
  //             message: res.message || "Payment completed!",
  //           },
  //         })
  //       }
  //     } else {
  //       updateUi({
  //         feedback: {
  //           type: "error",
  //           message: res.message || "Payment could not be processed.",
  //         },
  //       })
  //     }
  //   } catch {
  //     updateUi({
  //       feedback: {
  //         type: "error",
  //         message: "Failed to process payment.",
  //       },
  //     })
  //   } finally {
  //     updateUi({ actionId: null })
  //   }
  // }

  const handlePay = async (id: string) => {
    updateUi({ actionId: id, feedback: null })
    try {
      const res = await apiClient.payments.createCheckoutSession(id, userEmail)

      if (res.success && res.url) {
        window.location.href = res.url
        return
      }

      updateUi({
        feedback: {
          type: "error",
          message: res.message || "Could not start Stripe checkout.",
        },
        actionId: null,
      })
    } catch {
      updateUi({
        feedback: {
          type: "error",
          message: "Failed to initiate payment. Please try again.",
        },
        actionId: null,
      })
    }
  }

  if (ui.loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-zinc-950 text-zinc-400">
        <Loader2 className="mr-2 h-5 w-5 animate-spin text-[#a63d61]" />
        <span>Loading your appointments...</span>
      </div>
    )
  }

  if (!userEmail) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-zinc-950 px-4 text-center text-zinc-100">
        <h2 className="text-xl font-bold text-white">Please Sign In</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Log in to view and manage your salon appointments.
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-10 text-zinc-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="border-b border-zinc-800 pb-6">
          <span className="text-xs font-semibold tracking-widest text-[#d65a82] uppercase">
            Customer Dashboard
          </span>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">
            My Appointments ({appointments.length})
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
            You have not submitted any appointment requests yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5">
            {appointments.map((item) => {
              const canCancel = item.status === "Pending"
              const canPay =
                item.status === "Confirmed" && item.paymentStatus === "Unpaid"
              const isBusy = ui.actionId === item._id

              return (
                <div
                  key={item._id}
                  className="flex flex-col justify-between gap-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-5 transition hover:border-zinc-700 lg:flex-row lg:items-center"
                >
                  {/* Service Info */}
                  <div className="flex items-start gap-4">
                    <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
                      <Image
                        src={
                          item.image ||
                          "https://images.unsplash.com/photo-1560066984-138dadb4c035"
                        }
                        alt={item.serviceName}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-bold text-white">
                          {item.serviceName}
                        </h2>
                        {item.category && (
                          <span className="rounded-full bg-zinc-950 px-3 py-0.5 text-xs font-medium text-[#e06c91]">
                            {item.category}
                          </span>
                        )}
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

                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <span
                          className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                            STATUS_STYLE[item.status] || STATUS_STYLE.Pending
                          }`}
                        >
                          {item.status}
                        </span>
                        <span
                          className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                            PAYMENT_STYLE[item.paymentStatus] ||
                            PAYMENT_STYLE.Unpaid
                          }`}
                        >
                          Payment: {item.paymentStatus}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Price & Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-800 pt-4 lg:justify-end lg:border-t-0 lg:pt-0">
                    <span className="mr-2 text-xl font-bold text-white">
                      ৳ {item.price}
                    </span>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => updateUi({ selected: item })}
                      className="h-9 rounded-xl border-zinc-700 bg-zinc-950 text-xs text-zinc-200 hover:bg-zinc-800"
                    >
                      <Eye className="mr-1.5 h-3.5 w-3.5" />
                      Details
                    </Button>

                    {canPay && (
                      <Button
                        type="button"
                        disabled={isBusy}
                        onClick={() => handlePay(item._id)}
                        className="h-9 rounded-xl bg-emerald-600 text-xs font-medium text-white hover:bg-emerald-700"
                      >
                        {isBusy ? (
                          <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <CreditCard className="mr-1.5 h-3.5 w-3.5" />
                        )}
                        Pay Now
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
                  <span className="text-zinc-400">Price:</span>
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
                  <span className="text-zinc-400">Request Date:</span>
                  <span>{formatDate(ui.selected.createdAt)}</span>
                </div>
                {ui.selected.message && (
                  <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-xs text-zinc-300">
                    <p className="mb-1 font-semibold text-zinc-400">
                      Additional Message:
                    </p>
                    <p>{ui.selected.message}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 border-t border-zinc-800 pt-4">
                {ui.selected.status === "Confirmed" &&
                  ui.selected.paymentStatus === "Unpaid" && (
                    <Button
                      type="button"
                      disabled={ui.actionId === ui.selected._id}
                      onClick={() => handlePay(ui.selected!._id)}
                      className="rounded-xl bg-emerald-600 text-xs text-white hover:bg-emerald-700"
                    >
                      Pay Now
                    </Button>
                  )}
                {ui.selected.status === "Pending" && (
                  <Button
                    type="button"
                    disabled={ui.actionId === ui.selected._id}
                    onClick={() => handleCancel(ui.selected!._id)}
                    className="rounded-xl bg-rose-700 text-xs text-white hover:bg-rose-800"
                  >
                    Cancel Request
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
