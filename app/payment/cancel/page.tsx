import { XCircle } from "lucide-react"
import Link from "next/link"

export default function PaymentCancelPage() {
  return (
    <div className="flex min-h-[75vh] items-center justify-center bg-zinc-950 px-4 text-zinc-100">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center">
        <XCircle className="mx-auto mb-3 h-12 w-12 text-amber-400" />
        <h1 className="text-2xl font-bold text-white">Payment Cancelled</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Your payment was cancelled. Your appointment remains Unpaid and you
          can try paying again anytime.
        </p>

        <Link
          href="/customer/my-appointments"
          className="mt-6 inline-flex h-10 w-full items-center justify-center rounded-xl bg-[#a63d61] px-5 text-sm font-medium text-white hover:bg-[#8e3252]"
        >
          Back to My Appointments
        </Link>
      </div>
    </div>
  )
}
