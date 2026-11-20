import { Geist, Geist_Mono } from "next/font/google"

import Footer from "@/components/shared/Footer"
import Navbar from "@/components/shared/Navbar/Navbar"
import { cn } from "@/lib/utils"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "./globals.css"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        geist.variable
      )}
    >
      <body suppressHydrationWarning={true}>
        <Navbar />
        {children}
        <Footer />
        <ToastContainer />
      </body>
    </html>
  )
}
