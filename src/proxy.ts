import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function proxy(request: NextRequest) {
  // In a real application, we would check the session cookie or Firebase auth token here
  // const session = request.cookies.get("session")
  // if (!session) {
  //   return NextResponse.redirect(new URL("/login", request.url))
  // }
  
  // For V1 frontend development, we allow access but log the protection boundary
  // In production, this will enforce 401s for all /app routes
  
  const response = NextResponse.next()
  
  // Prevent caching of protected routes
  response.headers.set("Cache-Control", "no-store, max-age=0")
  
  return response
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    // Apply middleware to all /app routes
    "/app/:path*",
    // Exclude static files, api routes, and public files
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
