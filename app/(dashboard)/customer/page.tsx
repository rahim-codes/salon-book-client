export default function CustomerDashboardPage() {
  // static data
  const stats = [
    { title: "Total", count: 12 },
    { title: "Pending", count: 3 },
    { title: "Confirmed", count: 7 },
    { title: "Cancelled", count: 2 },
  ]

  const appointments = [
    {
      id: 1,
      service: "Glow Facial",
      dateTime: "20 Nov, 11:00 AM",
      price: 1500,
      status: "Pending",
      payment: "Unpaid",
      actionType: "cancel",
    },
    {
      id: 2,
      service: "Spa Massage",
      dateTime: "22 Nov, 3:00 PM",
      price: 2000,
      status: "Confirmed",
      payment: "Unpaid",
      actionType: "pay",
    },
    {
      id: 3,
      service: "Classic Haircut",
      dateTime: "10 Nov, 10:00 AM",
      price: 500,
      status: "Cancelled",
      payment: "Unpaid",
      actionType: "details",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header & Stats Cards */}
      <div>
        <h1 className="mb-6 text-2xl font-bold tracking-tight text-zinc-900">
          Customer Overview
        </h1>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-6 shadow-xs"
            >
              <span className="text-sm font-medium text-zinc-500">
                {stat.title}
              </span>
              <span className="mt-3 text-3xl font-bold text-zinc-900">
                {stat.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* My Appointments Section */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-xs">
        <h2 className="mb-6 text-xl font-bold tracking-tight text-zinc-900">
          My Appointments
        </h2>

        {/* Appointments Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-zinc-200 text-xs font-semibold tracking-wider text-zinc-500 uppercase">
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Date / Time</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-sm">
              {appointments.map((apt) => (
                <tr key={apt.id} className="hover:bg-zinc-50/50">
                  <td className="px-4 py-4 font-medium text-zinc-900">
                    {apt.service}
                  </td>
                  <td className="px-4 py-4 text-zinc-600">{apt.dateTime}</td>
                  <td className="px-4 py-4 font-medium text-zinc-900">
                    ৳ {apt.price}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        apt.status === "Confirmed"
                          ? "bg-emerald-100 text-emerald-700"
                          : apt.status === "Pending"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {apt.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-zinc-600">{apt.payment}</td>
                  <td className="px-4 py-4">
                    {apt.actionType === "cancel" && (
                      <button className="rounded-lg border border-rose-300 px-3.5 py-1.5 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50">
                        Cancel
                      </button>
                    )}
                    {apt.actionType === "pay" && (
                      <button className="rounded-lg bg-[#a63d61] px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#8e3252]">
                        Pay Now
                      </button>
                    )}
                    {apt.actionType === "details" && (
                      <span className="text-xs font-medium text-zinc-600">
                        Details
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
