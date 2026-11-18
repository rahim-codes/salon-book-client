const API_BASE_URL = process.env.SERVER_BASE_URL || "http://localhost:5000"

export const apiClient = {
  // ==================== Service Actions ====================
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
