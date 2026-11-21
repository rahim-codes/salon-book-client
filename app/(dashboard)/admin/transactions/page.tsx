"use client"

import { apiClient } from "@/lib/api-client"
import { Loader2, Receipt, ShieldCheck } from "lucide-react"
import { useEffect, useState } from "react"

interface TransactionRecord {
  _id: string
  customerName?: string
  customerEmail?: string
  serviceName: string
  appointmentDate?: string
  amount: number
  currency: string
  stripeSessionId: string
  paymentStatus: string
  createdAt: string
}

function shortenSessionId(sessionId: string) {
  if (!sessionId) return "N/A"
  if (sessionId.length <= 18) return sessionId
  return `${sessionId.slice(0, 10)}...${sessionId.slice(-6)}`
}

function formatDate(value?: string) {
  if (!value) return "N/A"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<TransactionRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let active = true

    apiClient.payments
      .getAll()
      .then((res) => {
        if (!active) return
        if (res?.success && Array.isArray(res.data)) {
          setTransactions(res.data)
          setError("")
        } else {
          setError(res?.message || "Failed to load transactions.")
        }
      })
      .catch(() => {
        if (!active) return
        setError("Error loading transactions.")
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-zinc-950 text-zinc-200">
        <Loader2 className="mr-2 h-6 w-6 animate-spin text-[#a63d61]" />
        <span>Loading transactions...</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 p-6 text-zinc-100">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-[#a63d61]">
              <Receipt className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Transactions</h1>
              <p className="text-xs text-zinc-400">
                Verified Stripe payment records (read-only audit log).
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-300">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Stripe Verified Only</span>
          </div>
        </div>

        {error ? (
          <div className="rounded-xl border border-rose-900/60 bg-rose-950/30 p-4 text-sm text-rose-300">
            {error}
          </div>
        ) : transactions.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-10 text-center text-sm text-zinc-400">
            No transactions recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900">
            <table className="w-full min-w-[980px] border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-950/60 text-zinc-400">
                  <th className="px-4 py-3.5 font-medium">Customer Info</th>
                  <th className="px-4 py-3.5 font-medium">Service</th>
                  <th className="px-4 py-3.5 font-medium">Appointment Date</th>
                  <th className="px-4 py-3.5 font-medium">Amount</th>
                  <th className="px-4 py-3.5 font-medium">Currency</th>
                  <th className="px-4 py-3.5 font-medium">Checkout Session</th>
                  <th className="px-4 py-3.5 font-medium">Status</th>
                  <th className="px-4 py-3.5 font-medium">Transaction Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80">
                {transactions.map((tx) => {
                  const isPaid = tx.paymentStatus?.toLowerCase() === "paid"
                  return (
                    <tr
                      key={tx._id}
                      className="transition-colors hover:bg-zinc-800/40"
                    >
                      <td className="px-4 py-3.5">
                        <div className="font-medium text-white">
                          {tx.customerName || "Customer"}
                        </div>
                        <div className="text-[11px] text-zinc-400">
                          {tx.customerEmail || "N/A"}
                        </div>
                      </td>

                      <td className="px-4 py-3.5 font-medium text-zinc-200">
                        {tx.serviceName}
                      </td>

                      <td className="px-4 py-3.5 text-zinc-300">
                        {formatDate(tx.appointmentDate)}
                      </td>

                      <td className="px-4 py-3.5 font-semibold text-emerald-400">
                        {Number(tx.amount).toFixed(2)}
                      </td>

                      <td className="px-4 py-3.5 font-medium text-zinc-300">
                        {tx.currency || "BDT"}
                      </td>

                      <td className="px-4 py-3.5 font-mono text-[11px] text-zinc-400">
                        <span title={tx.stripeSessionId}>
                          {shortenSessionId(tx.stripeSessionId)}
                        </span>
                      </td>

                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${
                            isPaid
                              ? "border border-emerald-800/60 bg-emerald-950/80 text-emerald-300"
                              : "border border-amber-800/60 bg-amber-950/80 text-amber-300"
                          }`}
                        >
                          {tx.paymentStatus}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-zinc-300">
                        {formatDate(tx.createdAt)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
