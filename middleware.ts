import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  console.error('middleware')
  return new Response('Middleware test', { status: 500 });
  
}

export const config = {
    // Match all request paths except for the ones starting with:
    // - api (API routes)
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
}; 