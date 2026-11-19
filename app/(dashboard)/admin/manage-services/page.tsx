/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { Service } from "@/components/shared/ServiceCard"
import { Button } from "@/components/ui/button"
import { apiClient, ServicePayload } from "@/lib/api-client"
import { Loader2, Pencil, ShieldAlert, Trash2, Upload, X } from "lucide-react"
import Image from "next/image"
import React, { useEffect, useState } from "react"

const CATEGORIES = [
  "Haircut & Styling",
  "Hair Treatment",
  "Facial & Skincare",
  "Makeup",
  "Massage & Spa",
]

const INITIAL_EDIT = {
  name: "",
  category: CATEGORIES[0],
  description: "",
  price: "",
  duration: "",
  status: "Active" as "Active" | "Inactive",
  file: null as File | null,
  preview: "",
}

export default function ManageServicesPage() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [editForm, setEditForm] = useState(INITIAL_EDIT)
  const [ui, setUi] = useState({
    loading: true,
    updating: false,
    deletingId: null as string | null,
    editingId: null as string | null,
    feedback: null as { type: "success" | "error"; message: string } | null,
  })

  const updateUi = (patch: Partial<typeof ui>) =>
    setUi((prev) => ({ ...prev, ...patch }))

  const loadServices = async () => {
    updateUi({ loading: true })
    try {
      const res = await apiClient.services.getAll()
      if (res.success && Array.isArray(res.data)) {
        setServices(res.data)
      }
    } catch (err) {
      console.error("Failed to load services:", err)
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
          await loadServices()
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

  const closeEdit = () => {
    setEditForm(INITIAL_EDIT)
    updateUi({ editingId: null })
  }

  const handleEditClick = (service: Service) => {
    setEditForm({
      name: service.name,
      category: service.category,
      description: service.description,
      price: String(service.price),
      duration: String(service.duration),
      status: service.status === "Inactive" ? "Inactive" : "Active",
      file: null,
      preview: service.image,
    })
    updateUi({ editingId: service._id, feedback: null })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      updateUi({
        feedback: {
          type: "error",
          message: "Please select a valid image file.",
        },
      })
      return
    }

    setEditForm((prev) => ({
      ...prev,
      file,
      preview: URL.createObjectURL(file),
    }))
    updateUi({ feedback: null })
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!ui.editingId) return

    updateUi({ feedback: null })
    const numericPrice = Number(editForm.price)
    const numericDuration = Number(editForm.duration)

    if (!editForm.name.trim()) {
      updateUi({
        feedback: { type: "error", message: "Service name is required." },
      })
      return
    }

    if (Number.isNaN(numericPrice) || numericPrice <= 0) {
      updateUi({
        feedback: {
          type: "error",
          message: "Price must be a positive number greater than 0.",
        },
      })
      return
    }

    if (Number.isNaN(numericDuration) || numericDuration <= 0) {
      updateUi({
        feedback: {
          type: "error",
          message: "Estimated duration must be a positive number of minutes.",
        },
      })
      return
    }

    updateUi({ updating: true })
    try {
      const existing = services.find((s) => s._id === ui.editingId)
      const imageUrl = editForm.file
        ? await apiClient.uploadImage(editForm.file)
        : existing?.image || ""

      const payload: ServicePayload = {
        name: editForm.name.trim(),
        category: editForm.category,
        description: editForm.description.trim(),
        price: numericPrice,
        duration: numericDuration,
        image: imageUrl,
        status: editForm.status,
      }

      const result = await apiClient.services.update(ui.editingId, payload)

      if (result.success) {
        updateUi({
          feedback: {
            type: "success",
            message: result.message || "Service updated successfully!",
          },
        })
        closeEdit()
        await loadServices()
      } else {
        updateUi({
          feedback: {
            type: "error",
            message: result.message || "Failed to update service.",
          },
        })
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      updateUi({
        feedback: {
          type: "error",
          message: err?.message || "Something went wrong while updating.",
        },
      })
    } finally {
      updateUi({ updating: false })
    }
  }

  const handleDelete = async (id: string) => {
    updateUi({ deletingId: id, feedback: null })
    try {
      const res = await apiClient.services.delete(id)
      if (res.success) {
        setServices((prev) => prev.filter((item) => item._id !== id))
        if (ui.editingId === id) closeEdit()
        updateUi({
          feedback: {
            type: "success",
            message: "Service deleted successfully.",
          },
        })
      } else {
        updateUi({
          feedback: {
            type: "error",
            message: res.message || "Failed to delete service.",
          },
        })
      }
    } catch {
      updateUi({
        feedback: {
          type: "error",
          message: "Error occurred while deleting service.",
        },
      })
    } finally {
      updateUi({ deletingId: null })
    }
  }

  if (isAdmin === null) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-zinc-950 text-zinc-400">
        <Loader2 className="mr-2 h-5 w-5 animate-spin text-[#a63d61]" />
        <span>Verifying admin permissions...</span>
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
          Only administrators can update or delete salon services.
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-10 text-zinc-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-10">
        <div className="border-b border-zinc-800 pb-6">
          <span className="text-xs font-semibold tracking-widest text-[#d65a82] uppercase">
            Admin Console
          </span>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">
            Manage Services
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

        {/* Update Service Form (শুধুমাত্র কোনো সার্ভিস Edit করলে দেখাবে) */}
        {ui.editingId && (
          <form
            onSubmit={handleUpdate}
            className="space-y-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 sm:p-8"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                Update Service
              </h2>
              <Button
                type="button"
                variant="outline"
                onClick={closeEdit}
                className="border-zinc-700 bg-zinc-950 text-zinc-300 hover:bg-zinc-800"
              >
                <X className="mr-1.5 h-4 w-4" />
                Cancel
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-xs font-medium text-zinc-300">
                  Service Name *
                </label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="h-11 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 text-sm text-white focus:border-[#a63d61] focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-zinc-300">
                  Service Category *
                </label>
                <select
                  value={editForm.category}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  className="h-11 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 text-sm text-white focus:border-[#a63d61] focus:outline-none"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-zinc-300">
                  Price (BDT) *
                </label>
                <input
                  type="number"
                  min={1}
                  step="any"
                  required
                  value={editForm.price}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, price: e.target.value }))
                  }
                  className="h-11 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 text-sm text-white focus:border-[#a63d61] focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-zinc-300">
                  Estimated Duration (Minutes) *
                </label>
                <input
                  type="number"
                  min={1}
                  step="1"
                  required
                  value={editForm.duration}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      duration: e.target.value,
                    }))
                  }
                  className="h-11 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 text-sm text-white focus:border-[#a63d61] focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-zinc-300">
                  Service Status
                </label>
                <select
                  value={editForm.status}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      status:
                        e.target.value === "Inactive" ? "Inactive" : "Active",
                    }))
                  }
                  className="h-11 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 text-sm text-white focus:border-[#a63d61] focus:outline-none"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-zinc-300">
                  Replace Service Image (Optional)
                </label>
                <label className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-700 bg-zinc-950 px-4 text-xs font-medium text-zinc-300 transition hover:border-[#a63d61] hover:text-white">
                  <Upload className="h-4 w-4 text-[#e06c91]" />
                  <span>
                    {editForm.file
                      ? editForm.file.name
                      : "Choose new image file"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-zinc-300">
                Description *
              </label>
              <textarea
                rows={3}
                required
                value={editForm.description}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3.5 text-sm text-white focus:border-[#a63d61] focus:outline-none"
              />
            </div>

            {editForm.preview && (
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-28 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
                  <Image
                    src={editForm.preview}
                    alt="Service preview"
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                </div>
                <span className="text-xs text-zinc-400">
                  {editForm.file
                    ? "New image ready for upload"
                    : "Current image"}
                </span>
              </div>
            )}

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={ui.updating}
                className="h-11 rounded-xl bg-[#a63d61] px-6 font-medium text-white hover:bg-[#8e3252]"
              >
                {ui.updating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <Pencil className="mr-2 h-4 w-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        )}

        {/* Services Table */}
        <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
          <div className="border-b border-zinc-800 px-6 py-4">
            <h2 className="text-lg font-semibold text-white">
              All Services ({services.length})
            </h2>
          </div>

          {ui.loading ? (
            <div className="flex items-center justify-center py-12 text-sm text-zinc-400">
              <Loader2 className="mr-2 h-5 w-5 animate-spin text-[#a63d61]" />
              <span>Loading services...</span>
            </div>
          ) : services.length === 0 ? (
            <div className="py-12 text-center text-sm text-zinc-500">
              No services found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-zinc-800 bg-zinc-950/60 text-xs text-zinc-400 uppercase">
                  <tr>
                    <th className="px-6 py-3.5">Service</th>
                    <th className="px-6 py-3.5">Category</th>
                    <th className="px-6 py-3.5">Duration</th>
                    <th className="px-6 py-3.5">Price</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/80">
                  {services.map((service) => {
                    const active = service.status === "Active"
                    return (
                      <tr
                        key={service._id}
                        className="transition hover:bg-zinc-800/40"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative h-11 w-14 shrink-0 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950">
                              <Image
                                src={
                                  service.image ||
                                  "https://images.unsplash.com/photo-1560066984-138dadb4c035"
                                }
                                alt={service.name}
                                fill
                                sizes="56px"
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-medium text-white">
                                {service.name}
                              </p>
                              <p className="line-clamp-1 max-w-xs text-xs text-zinc-400">
                                {service.description}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-zinc-300">
                          {service.category}
                        </td>
                        <td className="px-6 py-4 text-zinc-300">
                          {service.duration} min
                        </td>
                        <td className="px-6 py-4 font-semibold text-white">
                          ৳ {service.price}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                              active
                                ? "border border-emerald-800/50 bg-emerald-950/70 text-emerald-400"
                                : "border border-rose-800/50 bg-rose-950/70 text-rose-400"
                            }`}
                          >
                            {service.status || "Active"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleEditClick(service)}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-950 text-zinc-300 transition hover:border-[#a63d61] hover:text-white"
                              title="Edit Service"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={ui.deletingId === service._id}
                              onClick={() => handleDelete(service._id)}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-950 text-rose-400 transition hover:border-rose-500 hover:bg-rose-950/40 disabled:opacity-50"
                              title="Delete Service"
                            >
                              {ui.deletingId === service._id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Trash2 className="h-3.5 w-3.5" />
                              )}
                            </button>
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
      </div>
    </div>
  )
}
