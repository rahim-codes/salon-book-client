"use client"

import { LayoutDashboard, LogOut, Menu, User as UserIcon } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

interface UserSession {
  name: string
  email: string
  image?: string
  role: "customer" | "admin"
}

interface UserInfoProps {
  user: UserSession | null
  onLogout: () => void
}

export function UserInfo({ user, onLogout }: UserInfoProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const dashboardHref =
    user?.role === "admin" ? "/dashboard/admin" : "/dashboard/customer"

  return (
    <div className="flex items-center gap-4">
      {/* Desktop View */}
      <div className="hidden items-center gap-4 md:flex">
        {!user ? (
          <div className="flex items-center gap-4">
            <Link
              href="/sign-in"
              className="text-sm font-medium text-zinc-300 transition-colors hover:text-white"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="rounded-lg bg-[#a63d61] px-5 py-2 font-medium text-white shadow-sm hover:bg-[#8e3252]"
            >
              Sign Up
            </Link>
          </div>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger className="relative flex items-center gap-2.5 rounded-full border border-zinc-800 bg-transparent py-1.5 pr-3 pl-2 text-sm font-medium text-zinc-200 hover:bg-zinc-900">
              <Avatar className="h-7 w-7 border border-[#a63d61]">
                <AvatarImage src={user.image} alt={user.name} />
                <AvatarFallback className="bg-[#a63d61]/20 text-xs font-bold text-[#e06c91]">
                  {user.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="max-w-30 truncate text-sm font-medium text-zinc-200">
                {user.name}
              </span>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-56 border-zinc-800 bg-zinc-900 text-zinc-200"
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm leading-none font-medium text-white">
                    {user.name}
                  </p>
                  <p className="text-xs leading-none text-zinc-400">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-zinc-800" />
              <DropdownMenuItem className="cursor-pointer focus:bg-zinc-800 focus:text-white">
                <Link
                  href={dashboardHref}
                  className="flex w-full items-center gap-2"
                >
                  <LayoutDashboard className="h-4 w-4 text-[#e06c91]" />
                  <span>Dashboard</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer focus:bg-zinc-800 focus:text-white">
                <Link
                  href={`${dashboardHref}/profile`}
                  className="flex w-full items-center gap-2"
                >
                  <UserIcon className="h-4 w-4 text-zinc-400" />
                  <span>My Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-zinc-800" />
              <DropdownMenuItem
                onClick={onLogout}
                className="flex cursor-pointer items-center gap-2 text-rose-400 focus:bg-rose-950/50 focus:text-rose-300"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Mobile Menu (Sheet Trigger) */}
      <div className="flex md:hidden">
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger>
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-md text-zinc-300 hover:bg-zinc-900 hover:text-white">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </span>
          </SheetTrigger>

          <SheetContent
            side="right"
            className="flex w-70 flex-col justify-between border-zinc-800 bg-zinc-950 text-zinc-100"
          >
            <div>
              <SheetHeader className="border-b border-zinc-800 pb-4 text-left">
                <SheetTitle className="text-base text-white">
                  Salon<span className="text-[#d65a82]">Book</span> Menu
                </SheetTitle>
              </SheetHeader>

              <nav className="mt-6 flex flex-col gap-3">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-md px-3 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-900 hover:text-white"
                >
                  Home
                </Link>
                <Link
                  href="/services"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-md px-3 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-900 hover:text-white"
                >
                  Browse Services
                </Link>
                {user && (
                  <Link
                    href={dashboardHref}
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-md px-3 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-900 hover:text-white"
                  >
                    Dashboard
                  </Link>
                )}
              </nav>
            </div>

            <div className="border-t border-zinc-800 pt-4">
              {!user ? (
                <div className="flex flex-col gap-2.5">
                  <Link
                    href="/sign-in"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full rounded-md border border-zinc-700 bg-transparent px-4 py-2 text-center text-sm font-medium text-zinc-200 hover:bg-zinc-900"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/sign-up"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full rounded-md bg-[#a63d61] px-4 py-2 text-center text-sm font-medium text-white hover:bg-[#8e3252]"
                  >
                    Sign Up
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 px-2">
                    <Avatar className="h-9 w-9 border border-[#a63d61]">
                      <AvatarImage src={user.image} alt={user.name} />
                      <AvatarFallback className="bg-[#a63d61]/20 text-xs font-bold text-[#e06c91]">
                        {user.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col overflow-hidden">
                      <span className="truncate text-sm font-medium text-white">
                        {user.name}
                      </span>
                      <span className="truncate text-xs text-zinc-400">
                        {user.email}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      onLogout()
                      setMobileMenuOpen(false)
                    }}
                    className="w-full border border-rose-800/50 bg-rose-950/60 text-rose-300 hover:bg-rose-900/80"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
