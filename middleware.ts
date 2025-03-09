import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of public routes that don't require authentication
const publicRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
    // Check if the requested path is a public route
    if (publicRoutes.includes(request.nextUrl.pathname)) {
        return NextResponse.next();
    }

    // Check if user is authenticated by checking for auth cookie
    return NextResponse.next();
}

export const config = {
    // Match all request paths except for the ones starting with:
    // - api (API routes)
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
}; 