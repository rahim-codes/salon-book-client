const API_BASE_URL = process.env.SERVER_BASE_URL
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

export interface AppointmentPayload {
  serviceId: string
  serviceName: string
  serviceImage?: string
  serviceCategory?: string
  price: number
  duration: number
  appointmentDate: string
  timeSlot: string
  message?: string
  customerName?: string
  customerEmail: string
}

export interface ProfileUpdatePayload {
  name: string
  image: string
  phone: string
  actorEmail: string
  targetEmail?: string
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
        next: { revalidate: 60 },
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

  appointments: {
    create: async (appointmentData: AppointmentPayload) => {
      const res = await fetch(`${API_BASE_URL}/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointmentData),
      })
      return await res.json()
    },

    getByCustomer: async (email: string) => {
      const res = await fetch(
        `${API_BASE_URL}/appointments?email=${encodeURIComponent(email)}`,
        { cache: "no-store" }
      )
      return await res.json()
    },

    cancel: async (id: string, customerEmail: string) => {
      const res = await fetch(`${API_BASE_URL}/appointments/${id}/cancel`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerEmail }),
      })
      return await res.json()
    },

    pay: async (id: string, customerEmail: string) => {
      const res = await fetch(`${API_BASE_URL}/appointments/${id}/pay`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerEmail }),
      })
      return await res.json()
    },

    getAll: async () => {
      const res = await fetch(`${API_BASE_URL}/appointments`, {
        cache: "no-store",
      })
      return await res.json()
    },

    confirm: async (id: string) => {
      const res = await fetch(`${API_BASE_URL}/appointments/${id}/confirm`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      })
      return await res.json()
    },

    adminCancel: async (id: string) => {
      const res = await fetch(
        `${API_BASE_URL}/appointments/${id}/admin-cancel`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
        }
      )
      return await res.json()
    },
  },

  profile: {
    get: async (email: string) => {
      const res = await fetch(
        `${API_BASE_URL}/profile?email=${encodeURIComponent(email)}`,
        {
          cache: "no-store",
          headers: {
            "x-user-email": email,
          },
        }
      )
      return await res.json()
    },

    update: async (payload: ProfileUpdatePayload) => {
      const res = await fetch(`${API_BASE_URL}/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-email": payload.actorEmail,
        },
        body: JSON.stringify(payload),
      })
      return await res.json()
    },
  },

  users: {
    getAllCustomers: async () => {
      const res = await fetch(`${API_BASE_URL}/users`, {
        cache: "no-store",
      })
      return await res.json()
    },

    updateBlockStatus: async (id: string, blocked: boolean) => {
      const res = await fetch(`${API_BASE_URL}/users/${id}/block-status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blocked }),
      })
      return await res.json()
    },
  },
  payments: {
    createCheckoutSession: async (
      appointmentId: string,
      customerEmail: string
    ) => {
      const res = await fetch(
        `${API_BASE_URL}/payments/create-checkout-session`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ appointmentId, customerEmail }),
        }
      )
      return await res.json()
    },

    verifySession: async (sessionId: string) => {
      const res = await fetch(
        `${API_BASE_URL}/payments/verify-session?session_id=${encodeURIComponent(
          sessionId
        )}`,
        { cache: "no-store" }
      )
      return await res.json()
    },
    getAll: async () => {
      const res = await fetch(`${API_BASE_URL}/transactions`, {
        cache: "no-store",
      })
      return await res.json()
    },
  },
}
