"use client"

import { Button } from "@/components/ui/button"
import { apiClient } from "@/lib/api-client"
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Mail,
  Phone,
  Save,
  Shield,
  Upload,
  User,
} from "lucide-react"
import Image from "next/image"
import React, { useEffect, useState } from "react"

interface UserProfile {
  name: string
  email: string
  image: string
  phone: string
  role: string
  blocked: boolean
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    image: "",
    phone: "",
    role: "customer",
    blocked: false,
  })

  const [ui, setUi] = useState({
    loading: true,
    saving: false,
    uploading: false,
    fileName: "",
    feedback: null as { type: "success" | "error"; message: string } | null,
  })

  const updateUi = (patch: Partial<typeof ui>) =>
    setUi((prev) => ({ ...prev, ...patch }))

  useEffect(() => {
    async function loadProfile() {
      try {
        const sessionRes = await fetch("/api/auth/get-session", {
          cache: "no-store",
        })
        const session = sessionRes.ok ? await sessionRes.json() : null
        const sessionUser = session?.user || session?.data?.user
        const email = sessionUser?.email?.trim().toLowerCase() || ""

        if (!email) {
          updateUi({ loading: false })
          return
        }

        const res = await apiClient.profile.get(email)
        if (res.success && res.data) {
          setProfile({
            name: res.data.name || sessionUser?.name || "",
            email: res.data.email || email,
            image: res.data.image || sessionUser?.image || "",
            phone: res.data.phone || "",
            role: res.data.role || sessionUser?.role || "customer",
            blocked: Boolean(res.data.blocked),
          })
        } else {
          setProfile((prev) => ({
            ...prev,
            name: sessionUser?.name || "",
            email,
            image: sessionUser?.image || "",
            role: sessionUser?.role || "customer",
          }))
        }
      } catch (err) {
        console.error("Failed to load profile:", err)
        updateUi({
          feedback: {
            type: "error",
            message: "Unable to load your profile information.",
          },
        })
      } finally {
        updateUi({ loading: false })
      }
    }

    loadProfile()
  }, [])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      updateUi({
        feedback: {
          type: "error",
          message: "Please choose a valid image file.",
        },
      })
      return
    }

    updateUi({ uploading: true, feedback: null, fileName: file.name })
    try {
      const uploadedUrl = await apiClient.uploadImage(file)
      setProfile((prev) => ({ ...prev, image: uploadedUrl }))
      updateUi({
        feedback: {
          type: "success",
          message: "Profile image uploaded. Click Save Changes to apply.",
        },
      })
    } catch (err: unknown) {
      updateUi({
        feedback: {
          type: "error",
          message:
            err instanceof Error ? err.message : "Failed to upload image.",
        },
      })
    } finally {
      updateUi({ uploading: false })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    updateUi({ feedback: null })

    if (!profile.email) {
      updateUi({
        feedback: {
          type: "error",
          message: "You must be signed in to update your profile.",
        },
      })
      return
    }

    if (!profile.name.trim()) {
      updateUi({
        feedback: {
          type: "error",
          message: "Name cannot be empty.",
        },
      })
      return
    }

    updateUi({ saving: true })
    try {
      const res = await apiClient.profile.update({
        name: profile.name.trim(),
        image: profile.image.trim(),
        phone: profile.phone.trim(),
        actorEmail: profile.email,
        targetEmail: profile.email,
      })

      if (res.success) {
        updateUi({
          feedback: {
            type: "success",
            message: res.message || "Profile updated successfully!",
          },
        })
      } else {
        updateUi({
          feedback: {
            type: "error",
            message: res.message || "Failed to update profile.",
          },
        })
      }
    } catch {
      updateUi({
        feedback: {
          type: "error",
          message: "Something went wrong while updating your profile.",
        },
      })
    } finally {
      updateUi({ saving: false })
    }
  }

  if (ui.loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-zinc-950 text-zinc-400">
        <Loader2 className="mr-2 h-5 w-5 animate-spin text-[#a63d61]" />
        <span>Loading profile...</span>
      </div>
    )
  }

  if (!profile.email) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-zinc-950 px-4 text-center text-zinc-100">
        <h2 className="text-xl font-bold text-white">Sign In Required</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Please log in to view and update your profile information.
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-12 text-zinc-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="border-b border-zinc-800 pb-6">
          <span className="text-xs font-semibold tracking-widest text-[#d65a82] uppercase">
            Account Settings
          </span>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">
            Profile Management
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Update your personal details and profile picture.
          </p>
        </div>

        {ui.feedback && (
          <div
            className={`flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm ${
              ui.feedback.type === "success"
                ? "border-emerald-800/60 bg-emerald-950/50 text-emerald-300"
                : "border-rose-800/60 bg-rose-950/50 text-rose-300"
            }`}
          >
            {ui.feedback.type === "success" ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            ) : (
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            )}
            <span>{ui.feedback.message}</span>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 sm:p-8"
        >
          {/* Avatar + Read-Only Role & Email */}
          <div className="flex flex-col items-start gap-5 border-b border-zinc-800 pb-6 sm:flex-row sm:items-center">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-950">
              {profile.image ? (
                <Image
                  src={profile.image}
                  alt={profile.name || "User avatar"}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-zinc-500">
                  <User className="h-9 w-9" />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full border border-[#a63d61]/50 bg-[#a63d61]/15 px-3 py-0.5 text-xs font-semibold text-[#e06c91] capitalize">
                  <Shield className="h-3 w-3" />
                  {profile.role}
                </span>

                <span
                  className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                    profile.blocked
                      ? "border-rose-800/60 bg-rose-950/60 text-rose-300"
                      : "border-emerald-800/60 bg-emerald-950/60 text-emerald-300"
                  }`}
                >
                  {profile.blocked ? "Blocked" : "Active Account"}
                </span>
              </div>

              <p className="flex items-center gap-1.5 text-xs text-zinc-400">
                <Mail className="h-3.5 w-3.5 text-zinc-500" />
                <span>{profile.email}</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* Name */}
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-xs font-medium text-zinc-300">
                <User className="h-3.5 w-3.5 text-[#e06c91]" />
                <span>Full Name *</span>
              </label>
              <input
                type="text"
                required
                value={profile.name}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter your full name"
                className="h-11 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 text-sm text-white placeholder-zinc-500 focus:border-[#a63d61] focus:outline-none"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-xs font-medium text-zinc-300">
                <Phone className="h-3.5 w-3.5 text-[#e06c91]" />
                <span>Phone Number</span>
              </label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, phone: e.target.value }))
                }
                placeholder="e.g., +880 1700-000000"
                className="h-11 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 text-sm text-white placeholder-zinc-500 focus:border-[#a63d61] focus:outline-none"
              />
            </div>
          </div>

          {/* Profile Image Upload + Image URL */}
          <div className="space-y-3">
            <label className="block text-xs font-medium text-zinc-300">
              Profile Image (Upload File or Paste Image URL)
            </label>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-700 bg-zinc-950 px-4 text-xs font-medium text-zinc-300 transition hover:border-[#a63d61] hover:text-white">
                {ui.uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-[#e06c91]" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 text-[#e06c91]" />
                    <span>
                      {ui.fileName ? ui.fileName : "Upload image file"}
                    </span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              <input
                type="url"
                value={profile.image}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, image: e.target.value }))
                }
                placeholder="https://example.com/avatar.jpg"
                className="h-11 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 text-sm text-white placeholder-zinc-500 focus:border-[#a63d61] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end border-t border-zinc-800 pt-5">
            <Button
              type="submit"
              disabled={ui.saving || ui.uploading}
              className="h-11 rounded-xl bg-[#a63d61] px-6 font-medium text-white transition-all hover:bg-[#8e3252]"
            >
              {ui.saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Saving Profile...</span>
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  <span>Save Changes</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
