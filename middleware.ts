import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Define your routes
const publicRoutes = ["/", "/auth/new-verification"];
const authRoutes = ["/auth/register", "/auth/login", "/auth/error"];
const apiAuthPrefix = "/api/auth";
const DEFAULT_LOGIN_REDIRECT = "/dashboard";

export default async function middleware(req: NextRequest) {
  const { nextUrl } = req;

  // Decrypt session cookie with NEXTAUTH_SECRET
  const cookieStore = await cookies();
  const token = cookieStore.get('__Secure-authjs.session-token')?.value;
  const isLoggedIn = !!token;
  console.log('token', token);
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(
        new URL(DEFAULT_LOGIN_REDIRECT, nextUrl.origin)
      );
    }
    return NextResponse.next();
  }

  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/auth/login", nextUrl.origin));
  }

  return NextResponse.next();
}

// Run middleware for all routes except static files and _next
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
