import { auth } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"

export async function proxy(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session?.user) {
      return NextResponse.redirect(new URL("/signin", request.url))
    }

    return NextResponse.next()
  } catch {
    return NextResponse.redirect(new URL("/signin", request.url))
  }
}

export const config = {
  matcher: [
    "/category",
    "/category/:path*",
    "/service-details/:path*",
    "/admin",
    "/admin/:path*",
    "/customer",
    "/customer/:path*",
  ],
}
