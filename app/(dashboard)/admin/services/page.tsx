"use client"

import { Button } from "@/components/ui/button"
import { apiClient } from "@/lib/api-client"
import { Loader2, PlusCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "react-toastify"

export default function AddServicePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [serviceImage, setServiceImage] = useState<File | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    category: "Hair Treatment",
    price: "",
    duration: "",
    description: "",
    status: "Active",
  })

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const numericPrice = Number(formData.price)
    if (isNaN(numericPrice) || numericPrice <= 0) {
      toast.error("Price must be a positive number.")
      return
    }

    const numericDuration = Number(formData.duration)
    if (isNaN(numericDuration) || numericDuration <= 0) {
      toast.error("Estimated duration must be a positive number (in minutes).")
      return
    }

    setLoading(true)

    try {
      let imageUrl = ""

      if (serviceImage) {
        const imgData = new FormData()
        imgData.append("image", serviceImage)

        const imgbbApiKey = process.env.NEXT_PUBLIC_IMGBB_KEY
        if (!imgbbApiKey) {
          toast.error("ImgBB API Key is missing.")
          setLoading(false)
          return
        }

        const imgRes = await fetch(
          `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
          {
            method: "POST",
            body: imgData,
          }
        )

        const imgResult = await imgRes.json()
        if (imgResult.success) {
          imageUrl = imgResult.data.url
        } else {
          toast.error("Image upload failed.")
          setLoading(false)
          return
        }
      } else {
        toast.error("Please select a service image file.")
        setLoading(false)
        return
      }

      const payload = {
        ...formData,
        price: numericPrice,
        duration: String(numericDuration),
        image: imageUrl,
      }

      const result = await apiClient.services.create(payload)
      console.log(result)

      if (result.success) {
        toast.success("Service added successfully!")
        router.push("/admin")
        router.refresh()
      } else {
        toast.error(result.message || "Failed to add service.")
      }
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "An unexpected error occurred."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="border-b border-zinc-200 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          Add Service
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Create a new salon service easily.
        </p>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-8 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Service Name */}
          <div>
            <label className="mb-2 block text-xs font-semibold tracking-wider text-zinc-700 uppercase">
              Service Name
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Keratin Treatment"
              className="h-11 w-full rounded-lg border border-zinc-300 bg-white px-3.5 text-sm text-zinc-900 focus:border-[#a63d61] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* Category */}
            <div>
              <label className="mb-2 block text-xs font-semibold tracking-wider text-zinc-700 uppercase">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="h-11 w-full rounded-lg border border-zinc-300 bg-white px-3.5 text-sm text-zinc-900 focus:border-[#a63d61] focus:outline-none"
              >
                <option value="Hair Treatment">Hair Treatment</option>
                <option value="Makeup">Makeup</option>
                <option value="Facial & Skincare">Facial & Skincare</option>
                <option value="Massage & Spa">Massage & Spa</option>
                <option value="Haircut & Styling">Haircut & Styling</option>
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="mb-2 block text-xs font-semibold tracking-wider text-zinc-700 uppercase">
                Price (৳)
              </label>
              <input
                type="number"
                name="price"
                required
                min="1"
                value={formData.price}
                onChange={handleChange}
                placeholder="3000"
                className="h-11 w-full rounded-lg border border-zinc-300 bg-white px-3.5 text-sm text-zinc-900 focus:border-[#a63d61] focus:outline-none"
              />
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="mb-2 block text-xs font-semibold tracking-wider text-zinc-700 uppercase">
              Estimated Duration (minutes)
            </label>
            <input
              type="number"
              name="duration"
              required
              min="1"
              value={formData.duration}
              onChange={handleChange}
              placeholder="45"
              className="h-11 w-full rounded-lg border border-zinc-300 bg-white px-3.5 text-sm text-zinc-900 focus:border-[#a63d61] focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-xs font-semibold tracking-wider text-zinc-700 uppercase">
              Description
            </label>
            <textarea
              name="description"
              rows={4}
              required
              value={formData.description}
              onChange={handleChange}
              placeholder="Write details..."
              className="w-full rounded-lg border border-zinc-300 bg-white p-3.5 text-sm text-zinc-900 focus:border-[#a63d61] focus:outline-none"
            />
          </div>

          {/* Image */}
          <div>
            <label className="mb-2 block text-xs font-semibold tracking-wider text-zinc-700 uppercase">
              Service Image
            </label>
            <input
              type="file"
              accept="image/*"
              required
              onChange={(e) => setServiceImage(e.target.files?.[0] || null)}
              className="w-full cursor-pointer rounded-lg border border-zinc-300 bg-zinc-50 text-xs text-zinc-500 file:mr-4 file:rounded-lg file:border-0 file:bg-zinc-100 file:px-4 file:py-2.5 file:text-xs file:font-semibold file:text-zinc-700"
            />
          </div>

          {/* Submit */}
          <div className="pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#a63d61] font-medium text-white shadow-sm transition-all hover:bg-[#8e3252] disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <PlusCircle className="h-4 w-4" />
              )}
              <span>{loading ? "Adding Service..." : "Add Service"}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
