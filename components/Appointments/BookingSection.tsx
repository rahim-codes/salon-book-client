"use client"

import { Button } from "@/components/ui/button"
import { apiClient } from "@/lib/api-client"
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  Loader2,
  X,
} from "lucide-react"
import React, { useEffect, useState } from "react"

const TIME_SLOTS = [
  "10:00 AM - 11:00 AM",
  "11:30 AM - 12:30 PM",
  "02:00 PM - 03:00 PM",
  "03:30 PM - 04:30 PM",
  "05:00 PM - 06:00 PM",
  "06:30 PM - 07:30 PM",
]

interface BookingSectionProps {
  service: {
    _id: string
    name: string
    category?: string
    image?: string
    price: number
    duration: number
    status?: string
  }
}

export default function BookingSection({ service }: BookingSectionProps) {
  const isActive = service.status === "Active"

  const [customer, setCustomer] = useState({ name: "", email: "" })
  const [state, setState] = useState({
    isOpen: false,
    submitting: false,
    date: "",
    timeSlot: TIME_SLOTS[0],
    message: "",
    feedback: null as { type: "success" | "error"; text: string } | null,
  })

  useEffect(() => {
    async function loadCustomer() {
      try {
        const res = await fetch("/api/auth/get-session", { cache: "no-store" })
        if (!res.ok) return
        const session = await res.json()
        const user = session?.user || session?.data?.user
        setCustomer({
          name: user?.name?.trim() || "",
          email: user?.email?.trim().toLowerCase() || "",
        })
      } catch {
        // সেশন না থাকলে খালি থাকবে
      }
    }
    loadCustomer()
  }, [])

  if (!isActive) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-center text-sm text-zinc-400">
        This service is currently inactive and not available for appointment
        booking.
      </div>
    )
  }

  const today = new Date().toISOString().split("T")[0]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setState((prev) => ({ ...prev, feedback: null }))

    if (!customer.email) {
      setState((prev) => ({
        ...prev,
        feedback: {
          type: "error",
          text: "Please sign in first so your name and email can be attached to the appointment.",
        },
      }))
      return
    }

    if (!state.date) {
      setState((prev) => ({
        ...prev,
        feedback: { type: "error", text: "Please select an appointment date." },
      }))
      return
    }

    setState((prev) => ({ ...prev, submitting: true }))
    try {
      const result = await apiClient.appointments.create({
        serviceId: service._id,
        serviceName: service.name,
        serviceCategory: service.category,
        serviceImage: service.image,
        price: service.price,
        duration: service.duration,
        appointmentDate: state.date,
        timeSlot: state.timeSlot,
        message: state.message,
        customerName: customer.name || "Customer",
        customerEmail: customer.email,
      })

      if (result.success) {
        setState((prev) => ({
          ...prev,
          date: "",
          timeSlot: TIME_SLOTS[0],
          message: "",
          feedback: {
            type: "success",
            text: "Appointment booked successfully! Status: Pending • Payment: Unpaid.",
          },
        }))
      } else {
        setState((prev) => ({
          ...prev,
          feedback: {
            type: "error",
            text: result.message || "Could not complete booking.",
          },
        }))
      }
    } catch {
      setState((prev) => ({
        ...prev,
        feedback: {
          type: "error",
          text: "Something went wrong while booking your appointment.",
        },
      }))
    } finally {
      setState((prev) => ({ ...prev, submitting: false }))
    }
  }

  if (!state.isOpen) {
    return (
      <Button
        type="button"
        onClick={() =>
          setState((prev) => ({ ...prev, isOpen: true, feedback: null }))
        }
        className="h-12 w-full rounded-xl bg-[#a63d61] font-medium text-white shadow-lg shadow-rose-950/20 transition-all hover:bg-[#8e3252]"
      >
        <Calendar className="mr-2 h-4 w-4" />
        <span>Book Appointment</span>
      </Button>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-5"
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div>
          <h3 className="text-base font-semibold text-white">
            Book Appointment
          </h3>
          <p className="text-xs text-zinc-400">
            {service.name} • ৳ {service.price} ({service.duration} min)
          </p>
        </div>
        <button
          type="button"
          onClick={() => setState((prev) => ({ ...prev, isOpen: false }))}
          className="rounded-lg p-1.5 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
          aria-label="Close booking form"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* লগইন করা কাস্টমারের তথ্য প্রিভিউ */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 px-3.5 py-2.5 text-xs text-zinc-300">
        <p>
          <span className="text-zinc-500">Customer: </span>
          <span className="font-medium text-white">
            {customer.name || "Not signed in"}
          </span>
        </p>
        <p className="mt-0.5">
          <span className="text-zinc-500">Email: </span>
          <span className="font-medium text-[#e06c91]">
            {customer.email || "No email found"}
          </span>
        </p>
      </div>

      {state.feedback && (
        <div
          className={`flex items-start gap-2 rounded-xl border px-3.5 py-2.5 text-xs ${
            state.feedback.type === "success"
              ? "border-emerald-800/60 bg-emerald-950/50 text-emerald-300"
              : "border-rose-800/60 bg-rose-950/50 text-rose-300"
          }`}
        >
          {state.feedback.type === "success" ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          )}
          <span>{state.feedback.text}</span>
        </div>
      )}

      {/* Appointment Date */}
      <div className="space-y-1.5">
        <label className="flex items-center gap-1.5 text-xs font-medium text-zinc-300">
          <Calendar className="h-3.5 w-3.5 text-[#e06c91]" />
          <span>Appointment Date *</span>
        </label>
        <input
          type="date"
          min={today}
          required
          value={state.date}
          onChange={(e) =>
            setState((prev) => ({ ...prev, date: e.target.value }))
          }
          className="h-11 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 text-sm text-white focus:border-[#a63d61] focus:outline-none"
        />
      </div>

      {/* Available Time Slot */}
      <div className="space-y-1.5">
        <label className="flex items-center gap-1.5 text-xs font-medium text-zinc-300">
          <Clock className="h-3.5 w-3.5 text-[#e06c91]" />
          <span>Available Time Slot *</span>
        </label>
        <select
          value={state.timeSlot}
          onChange={(e) =>
            setState((prev) => ({ ...prev, timeSlot: e.target.value }))
          }
          className="h-11 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 text-sm text-white focus:border-[#a63d61] focus:outline-none"
        >
          {TIME_SLOTS.map((slot) => (
            <option key={slot} value={slot}>
              {slot}
            </option>
          ))}
        </select>
      </div>

      {/* Additional Message (Optional) */}
      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-zinc-300">
          Additional Message (Optional)
        </label>
        <textarea
          rows={3}
          value={state.message}
          onChange={(e) =>
            setState((prev) => ({ ...prev, message: e.target.value }))
          }
          placeholder="Any stylist preference, hair/skin notes, or special request..."
          className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-sm text-white placeholder-zinc-500 focus:border-[#a63d61] focus:outline-none"
        />
      </div>

      <Button
        type="submit"
        disabled={state.submitting}
        className="h-11 w-full rounded-xl bg-[#a63d61] font-medium text-white transition-all hover:bg-[#8e3252]"
      >
        {state.submitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span>Confirming Booking...</span>
          </>
        ) : (
          <span>Confirm Appointment</span>
        )}
      </Button>
    </form>
  )
}
