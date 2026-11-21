"use client"

import { apiClient } from "@/lib/api-client"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"

interface TransactionInfo {
  transactionId: string
  serviceName: string
  amount: number
  currency: string
  paymentStatus: string
  customerEmail: string
}

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const startedSessionRef = useRef<string | null>(null)

  const [state, setState] = useState({
    loading: Boolean(sessionId),
    error: sessionId ? "" : "Missing Stripe session ID.",
    tx: null as TransactionInfo | null,
  })

  useEffect(() => {
    if (!sessionId) return
    if (startedSessionRef.current === sessionId) return
    startedSessionRef.current = sessionId

    apiClient.payments
      .verifySession(sessionId)
      .then((res) => {
        if (res?.success && res?.data) {
          setState({ loading: false, error: "", tx: res.data })
        } else {
          setState({
            loading: false,
            error: res?.message || "Payment verification failed.",
            tx: null,
          })
        }
      })
      .catch(() => {
        setState({
          loading: false,
          error: "Error verifying payment.",
          tx: null,
        })
      })
  }, [sessionId])

  if (state.loading) {
    return (
      <div className="flex min-h-[75vh] items-center justify-center bg-zinc-950 text-zinc-200">
        <Loader2 className="mr-2 h-6 w-6 animate-spin text-[#a63d61]" />
        <span>Confirming your payment...</span>
      </div>
    )
  }

  if (state.error || !state.tx) {
    return (
      <div className="flex min-h-[75vh] items-center justify-center bg-zinc-950 px-4 text-zinc-100">
        <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center">
          <AlertCircle className="mx-auto mb-3 h-10 w-10 text-rose-400" />
          <h1 className="text-xl font-bold text-white">Payment Issue</h1>
          <p className="mt-2 text-sm text-zinc-400">{state.error}</p>
          <Link
            href="/customer/my-appointments"
            className="mt-6 inline-flex h-10 items-center justify-center rounded-xl bg-[#a63d61] px-5 text-sm font-medium text-white"
          >
            Back to My Appointments
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-[75vh] items-center justify-center bg-zinc-950 px-4 text-zinc-100">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center">
        <CheckCircle2 className="mx-auto mb-3 h-12 w-12 text-emerald-400" />
        <h1 className="text-2xl font-bold text-white">Payment Successful!</h1>
        <p className="mt-1 text-xs text-zinc-400">
          Your payment is confirmed and saved in transactions.
        </p>

        <div className="mt-6 space-y-2.5 rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-left text-xs">
          <div className="flex justify-between">
            <span className="text-zinc-400">Service:</span>
            <span className="font-semibold text-white">
              {state.tx.serviceName}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Amount:</span>
            <span className="font-bold text-emerald-400">
              {state.tx.currency} {state.tx.amount}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Status:</span>
            <span className="font-semibold text-emerald-300">
              {state.tx.paymentStatus}
            </span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-zinc-400">Transaction ID:</span>
            <span className="truncate font-mono text-zinc-300">
              {state.tx.transactionId}
            </span>
          </div>
        </div>

        <Link
          href="/customer/my-appointments"
          className="mt-6 inline-flex h-10 w-full items-center justify-center rounded-xl bg-[#a63d61] px-5 text-sm font-medium text-white hover:bg-[#8e3252]"
        >
          Go to My Appointments
        </Link>
      </div>
    </div>
  )
}
