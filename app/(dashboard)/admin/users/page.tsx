"use client"

import { Button } from "@/components/ui/button"
import { apiClient } from "@/lib/api-client"
import {
  Ban,
  CheckCircle2,
  Eye,
  Loader2,
  Mail,
  Phone,
  Search,
  ShieldAlert,
  User,
  X,
} from "lucide-react"
import Image from "next/image"
import { useEffect, useMemo, useState } from "react"

export interface CustomerUser {
  _id: string
  name?: string
  email: string
  image?: string
  phone?: string
  role?: string
  blocked?: boolean
  createdAt?: string
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "—"
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return "—"
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export default function ManageUsersPage() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [users, setUsers] = useState<CustomerUser[]>([])
  const [ui, setUi] = useState({
    loading: true,
    search: "",
    statusFilter: "all" as "all" | "active" | "blocked",
    actionId: null as string | null,
    selected: null as CustomerUser | null,
    feedback: null as { type: "success" | "error"; message: string } | null,
  })

  const updateUi = (patch: Partial<typeof ui>) =>
    setUi((prev) => ({ ...prev, ...patch }))

  const loadCustomers = async () => {
    try {
      const res = await apiClient.users.getAllCustomers()
      if (res.success && Array.isArray(res.data)) {
        setUsers(res.data)
      }
    } catch (err) {
      console.error("Failed to fetch customers:", err)
    } finally {
      updateUi({ loading: false })
    }
  }

  useEffect(() => {
    async function init() {
      try {
        const res = await fetch("/api/auth/get-session", { cache: "no-store" })
        const session = res.ok ? await res.json() : null
        const role = session?.user?.role || session?.data?.user?.role
        const allowed = role === "admin" || role === "Admin"
        setIsAdmin(allowed)
        if (allowed) {
          await loadCustomers()
        } else {
          updateUi({ loading: false })
        }
      } catch {
        setIsAdmin(false)
        updateUi({ loading: false })
      }
    }
    init()
  }, [])

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const isBlocked = Boolean(u.blocked)
      const matchesStatus =
        ui.statusFilter === "all" ||
        (ui.statusFilter === "blocked" && isBlocked) ||
        (ui.statusFilter === "active" && !isBlocked)

      const q = ui.search.trim().toLowerCase()
      const matchesSearch =
        !q ||
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.phone?.toLowerCase().includes(q)

      return matchesStatus && matchesSearch
    })
  }, [users, ui.search, ui.statusFilter])

  const handleToggleBlock = async (user: CustomerUser) => {
    const nextBlocked = !Boolean(user.blocked)
    updateUi({ actionId: user._id, feedback: null })

    try {
      const res = await apiClient.users.updateBlockStatus(user._id, nextBlocked)
      if (res.success) {
        setUsers((prev) =>
          prev.map((item) =>
            item._id === user._id ? { ...item, blocked: nextBlocked } : item
          )
        )
        updateUi({
          selected:
            ui.selected?._id === user._id
              ? { ...ui.selected, blocked: nextBlocked }
              : ui.selected,
          feedback: {
            type: "success",
            message:
              res.message ||
              (nextBlocked
                ? "User blocked successfully."
                : "User unblocked successfully."),
          },
        })
      } else {
        updateUi({
          feedback: {
            type: "error",
            message: res.message || "Failed to update user status.",
          },
        })
      }
    } catch {
      updateUi({
        feedback: {
          type: "error",
          message: "Error occurred while updating user status.",
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
        <span>Loading registered customers...</span>
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
          Only administrators can view and manage customer accounts.
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen rounded-2xl bg-zinc-950 px-4 py-10 text-zinc-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header & Search */}
        <div className="flex flex-col justify-between gap-4 border-b border-zinc-800 pb-6 md:flex-row md:items-end">
          <div>
            <span className="text-xs font-semibold tracking-widest text-[#d65a82] uppercase">
              Admin Console
            </span>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">
              Manage Users ({users.length})
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={ui.statusFilter}
              onChange={(e) =>
                updateUi({
                  statusFilter: e.target.value as "all" | "active" | "blocked",
                })
              }
              className="h-10 rounded-xl border border-zinc-800 bg-zinc-900 px-3 text-xs text-white focus:border-[#a63d61] focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="blocked">Blocked Only</option>
            </select>

            <div className="relative w-full sm:w-64">
              <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                value={ui.search}
                onChange={(e) => updateUi({ search: e.target.value })}
                placeholder="Search name, email, phone..."
                className="h-10 w-full rounded-xl border border-zinc-800 bg-zinc-900 pr-3.5 pl-10 text-xs text-white placeholder-zinc-500 focus:border-[#a63d61] focus:outline-none"
              />
            </div>
          </div>
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

        {/* Customers Table */}
        <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
          {filteredUsers.length === 0 ? (
            <div className="py-14 text-center text-sm text-zinc-400">
              No registered customers match your filter.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-zinc-800 bg-zinc-950/60 text-xs text-zinc-400 uppercase">
                  <tr>
                    <th className="px-6 py-3.5">Customer</th>
                    <th className="px-6 py-3.5">Phone</th>
                    <th className="px-6 py-3.5">Joined</th>
                    <th className="px-6 py-3.5">Account Status</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/80">
                  {filteredUsers.map((customer) => {
                    const isBlocked = Boolean(customer.blocked)
                    const isBusy = ui.actionId === customer._id

                    return (
                      <tr
                        key={customer._id}
                        className="transition hover:bg-zinc-800/40"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
                              {customer.image ? (
                                <Image
                                  src={customer.image}
                                  alt={customer.name || "Customer"}
                                  fill
                                  sizes="40px"
                                  className="object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-zinc-500">
                                  <User className="h-4 w-4" />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-white">
                                {customer.name || "Unnamed Customer"}
                              </p>
                              <p className="text-xs text-zinc-400">
                                {customer.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-xs text-zinc-300">
                          {customer.phone || "—"}
                        </td>

                        <td className="px-6 py-4 text-xs text-zinc-400">
                          {formatDate(customer.createdAt)}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                              isBlocked
                                ? "border-rose-800/60 bg-rose-950/60 text-rose-300"
                                : "border-emerald-800/60 bg-emerald-950/60 text-emerald-300"
                            }`}
                          >
                            {isBlocked ? "Blocked" : "Active"}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <div className="inline-flex items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => updateUi({ selected: customer })}
                              className="h-8 rounded-lg border-zinc-700 bg-zinc-950 px-3 text-xs text-zinc-200 hover:bg-zinc-800"
                            >
                              <Eye className="mr-1.5 h-3.5 w-3.5" />
                              Details
                            </Button>

                            {isBlocked ? (
                              <Button
                                type="button"
                                disabled={isBusy}
                                onClick={() => handleToggleBlock(customer)}
                                className="h-8 rounded-lg bg-emerald-600 px-3 text-xs font-medium text-white hover:bg-emerald-700"
                              >
                                {isBusy ? (
                                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                                )}
                                Unblock
                              </Button>
                            ) : (
                              <Button
                                type="button"
                                disabled={isBusy}
                                onClick={() => handleToggleBlock(customer)}
                                className="h-8 rounded-lg border border-rose-800/60 bg-rose-950/80 px-3 text-xs font-medium text-rose-300 hover:bg-rose-900/70"
                              >
                                {isBusy ? (
                                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <Ban className="mr-1.5 h-3.5 w-3.5" />
                                )}
                                Block
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* User Details Modal */}
        {ui.selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs">
            <div className="w-full max-w-md space-y-5 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-zinc-100">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <h3 className="text-lg font-bold text-white">User Details</h3>
                <button
                  type="button"
                  onClick={() => updateUi({ selected: null })}
                  className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
                  {ui.selected.image ? (
                    <Image
                      src={ui.selected.image}
                      alt={ui.selected.name || "User"}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-zinc-500">
                      <User className="h-7 w-7" />
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-base font-bold text-white">
                    {ui.selected.name || "Unnamed Customer"}
                  </h4>
                  <span
                    className={`mt-1 inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                      ui.selected.blocked
                        ? "border-rose-800/60 bg-rose-950/60 text-rose-300"
                        : "border-emerald-800/60 bg-emerald-950/60 text-emerald-300"
                    }`}
                  >
                    {ui.selected.blocked ? "Blocked" : "Active"}
                  </span>
                </div>
              </div>

              <div className="space-y-2.5 rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-xs">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-zinc-400">
                    <Mail className="h-3.5 w-3.5 text-[#a63d61]" />
                    Email:
                  </span>
                  <span className="font-medium text-white">
                    {ui.selected.email}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-zinc-400">
                    <Phone className="h-3.5 w-3.5 text-[#a63d61]" />
                    Phone:
                  </span>
                  <span className="text-zinc-200">
                    {ui.selected.phone || "Not provided"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Role:</span>
                  <span className="text-zinc-200 capitalize">
                    {ui.selected.role || "customer"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Registered On:</span>
                  <span className="text-zinc-200">
                    {formatDate(ui.selected.createdAt)}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-zinc-800 pt-4">
                <Button
                  type="button"
                  disabled={ui.actionId === ui.selected._id}
                  onClick={() => handleToggleBlock(ui.selected!)}
                  className={`rounded-xl text-xs text-white ${
                    ui.selected.blocked
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-rose-700 hover:bg-rose-800"
                  }`}
                >
                  {ui.selected.blocked ? "Unblock User" : "Block User"}
                </Button>
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
