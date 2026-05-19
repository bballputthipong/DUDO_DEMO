import { NextRequest, NextResponse } from 'next/server';

/**
 * Next.js Middleware — protects all dashboard routes.
 * Redirects unauthenticated users to /login.
 *
 * We check for the auth token cookie or localStorage-synced header.
 * Since middleware runs on the edge, we verify presence only (not JWT validity).
 * JWT validation happens server-side via the backend API.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes — skip auth check
  const publicPaths = ['/login', '/signup', '/forgot-password', '/_next', '/favicon.ico'];
  if (publicPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Check for auth token in cookies
  const token = request.cookies.get('partner_auth_token')?.value;

  // If no token, redirect to login
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, images, etc.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
