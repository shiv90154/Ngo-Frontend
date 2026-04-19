// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Note: Token is stored in localStorage on the client.
  // Middleware runs on the server and cannot access localStorage.
  // Therefore, we delegate route protection to the client-side AuthContext.
  // This middleware simply allows all requests to pass through.

  return NextResponse.next();
}

// See: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - uploads (public uploaded files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|uploads).*)',
  ],
};