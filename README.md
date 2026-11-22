# SalonBook — Salon Appointment Booking Platform (Client)

SalonBook is a role-based salon appointment booking web application built with **Next.js**, **TypeScript**, and **Tailwind CSS**[cite: 2, 4]. Customers can browse salon services, search and filter services, book appointments, pay for confirmed appointments via **Stripe**, and manage their bookings[cite: 2, 3, 12, 17]. Administrators can manage services, appointments, users, and payment transactions through a dedicated dashboard[cite: 2, 3, 14, 15, 16].

## Live & Repository Links

- **Live Website:** https://salon-book-client-eight.vercel.app/
- **Client Repository:** https://github.com/rahim-codes/salon-book-client
- **Server Repository:** https://github.com/rahim-codes/salon-book-server

## Important Features

- **Customer Features:**
  - Browse active salon services, view service details, and search/filter/sort services[cite: 2, 9, 10, 20].
  - Authenticate via **Better Auth** (Email/Password and Google OAuth)[cite: 11].
  - Request appointments with date, time slot, and optional message; cancel pending appointments[cite: 12, 17].
  - Pay for confirmed appointments using **Stripe Checkout** and view appointment & payment history[cite: 2, 12, 17].
  - Manage customer profile information[cite: 13, 18].
- **Admin Features:**
  - View dashboard analytics/overview metrics[cite: 14].
  - Create, update, delete, and activate/deactivate services with image uploads via **ImgBB**[cite: 3, 14].
  - Review, confirm, or cancel customer appointment requests[cite: 2, 15].
  - View registered users and block/unblock users[cite: 15, 16].
  - Monitor payment transactions (read-only status integrity)[cite: 16].

## Technology Stack

- **Framework:** Next.js (App Router)[cite: 2]
- **Language:** TypeScript[cite: 2]
- **Styling & UI:** Tailwind CSS, Lucide Icons / shadcn/ui
- **Authentication:** Better Auth (Credentials + Google OAuth)[cite: 11]
- **Payments:** Stripe Checkout[cite: 2, 17]
- **Image Hosting:** ImgBB API[cite: 3, 4]
- **Deployment:** Vercel[cite: 5]

## Installation Instructions

1. Clone the client repository:
   ```bash
   git clone [https://github.com/rahim-codes/salon-book-client.git](https://github.com/rahim-codes/salon-book-client.git)
   cd salon-book-client
   ```
