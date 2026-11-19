const API_BASE_URL = process.env.SERVER_BASE_URL || "http://localhost:5000"
const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY

export interface ServicePayload {
  name: string
  category: string
  description: string
  price: number
  duration: number
  image: string
  status: "Active" | "Inactive"
}

export const apiClient = {
  // ==================== Service Actions ====================
  uploadImage: async (file: File): Promise<string> => {
    if (!IMGBB_API_KEY) {
      throw new Error("NEXT_PUBLIC_IMGBB_API_KEY is not configured.")
    }

    const formData = new FormData()
    formData.append("image", file)

    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
      {
        method: "POST",
        body: formData,
      }
    )

    const data = await res.json()
    if (!res.ok || !data.success) {
      throw new Error(data.error?.message || "Image upload failed.")
    }

    return data.data.url as string
  },
  services: {
    getAll: async () => {
      const res = await fetch(`${API_BASE_URL}/services`)
      const result = await res.json()
      return result
    },

    getFeatured: async () => {
      const res = await fetch(`${API_BASE_URL}/services/featured`, {
        cache: "no-store",
      })
      return await res.json()
    },

    // new service add (Admin)
    create: async (serviceData: {
      name: string
      category: string
      price: number
      duration: string
      description: string
      image: string
      status: string
    }) => {
      const res = await fetch(`${API_BASE_URL}/services`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(serviceData),
      })
      return await res.json()
    },

    // get service details

    getById: async (id: string) => {
      const res = await fetch(`${API_BASE_URL}/services/${id}`, {
        cache: "no-store",
      })
      return await res.json()
    },

    // Update service

    update: async (id: string, serviceData: Partial<ServicePayload>) => {
      const res = await fetch(`${API_BASE_URL}/services/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(serviceData),
      })
      return await res.json()
    },

    // delete service
    delete: async (id: string) => {
      const res = await fetch(`${API_BASE_URL}/services/${id}`, {
        method: "DELETE",
      })
      return await res.json()
    },
  },

  // ==================== Appointment Actions ====================
  //   appointments: {
  //
  //     create: async (appointmentData: any) => {
  //       const res = await fetch(`${API_BASE_URL}/appointments`, {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify(appointmentData),
  //       });
  //       return await res.json();
  //     },
  //   },
}
