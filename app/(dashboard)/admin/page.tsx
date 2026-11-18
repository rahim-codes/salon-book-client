import Link from "next/link"

export default function AdminDashboardPage() {
  // static data
  const stats = [
    { title: "Customers", count: 48 },
    { title: "Active services", count: 14 },
    { title: "Requests", count: 62 },
    { title: "Pending", count: 9 },
    { title: "Confirmed", count: 40 },
    { title: "Successful payments", count: 31 },
  ]

  const services = [
    {
      id: 1,
      name: "Keratin Treatment",
      category: "Hair Treatment",
      price: 3000,
      status: "Active",
    },
    {
      id: 2,
      name: "Bridal Makeup",
      category: "Makeup",
      price: 6000,
      status: "Inactive",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header & Stats Cards */}
      <div>
        <h1 className="mb-6 text-2xl font-bold tracking-tight text-zinc-900">
          Admin Overview
        </h1>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
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

      {/* Manage Services Section */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-xs">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight text-zinc-900">
            Manage Services
          </h2>
          <Link
            href="/dashboard/admin/services/add"
            className="rounded-lg bg-[#a63d61] px-4 py-2 font-medium text-white shadow-sm hover:bg-[#8e3252]"
          >
            Add Service
          </Link>
        </div>

        {/* Services Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-zinc-200 text-xs font-semibold tracking-wider text-zinc-500 uppercase">
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-sm">
              {services.map((service) => (
                <tr key={service.id} className="hover:bg-zinc-50/50">
                  <td className="px-4 py-4 text-zinc-500">[img]</td>
                  <td className="px-4 py-4 font-medium text-zinc-900">
                    {service.name}
                  </td>
                  <td className="px-4 py-4 text-zinc-600">
                    {service.category}
                  </td>
                  <td className="px-4 py-4 font-medium text-zinc-900">
                    ৳ {service.price}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        service.status === "Active"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {service.status}
                    </span>
                  </td>
                  <td className="space-x-2 px-4 py-4 font-medium text-zinc-600">
                    <button className="text-zinc-600 hover:text-zinc-900">
                      Edit
                    </button>
                    <span>·</span>
                    <button className="text-zinc-600 hover:text-zinc-900">
                      {service.status === "Active" ? "Deactivate" : "Activate"}
                    </button>
                    <span>·</span>
                    <button className="text-rose-600 hover:text-rose-700">
                      Delete
                    </button>
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
