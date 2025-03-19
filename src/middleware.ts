import { NextResponse } from "next/server";
import authConfig from "./lib/auth.config"
import NextAuth from "next-auth"
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  publicRoutes,
  authRoutes
} from "./routes"

// Use only one of the two middleware options below
// 1. Use middleware directly
// export const { auth: middleware } = NextAuth(authConfig)

// 2. Wrapped middleware option
const { auth } = NextAuth(authConfig)
export default auth(async function middleware(req) {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl.origin));
    }
    return NextResponse.next();
  }

  if(!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/auth/login", nextUrl.origin));
  }

  return NextResponse.next();
})

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}