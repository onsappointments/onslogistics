import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token =
    req.cookies.get("__Secure-next-auth.session-token")?.value ||
    req.cookies.get("next-auth.session-token")?.value;

  const { pathname } = req.nextUrl;

  // Protected routes
  if (pathname.startsWith("/dashboard/") ) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}   

export const config = {
  matcher: ["/dashboard/:path*"],
};  
