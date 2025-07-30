import { NextResponse, type NextRequest } from 'next/server';
import { validateAndRefreshSession } from '@/lib/session';

console.log('🔐 MIDDLEWARE: loaded');

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  // Add security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  const pathname = request.nextUrl.pathname;

  const isAuthRoute = pathname.startsWith('/auth');
  const isCallbackRoute = pathname === '/auth/callback';
  const isLogoutRoute = pathname === '/auth/logout';
  const isApiAuthRoute = pathname.startsWith('/api/auth');
  const isPublicRoute =
    pathname === '/' ||
    pathname.startsWith('/public') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon');

  const protectedRoutes = ['/dashboard', '/api/analytics'];
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );

  // Allow public routes, API auth routes, callback route, and logout route
  if (isPublicRoute || isApiAuthRoute || isCallbackRoute || isLogoutRoute) {
    return response;
  }

  // Validate session for protected routes
  if (isProtectedRoute) {
    const { session, response: sessionResponse } = await validateAndRefreshSession(request);
    
    if (!session) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/auth/login';
      redirectUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // If session was refreshed, use the updated response
    if (sessionResponse) {
      response = sessionResponse;
    }
  }

  // Redirect logged-in users away from /auth routes (except callback and logout)
  if (isAuthRoute && !isCallbackRoute && !isLogoutRoute) {
    const { session } = await validateAndRefreshSession(request);
    
    if (session) {
      const next = request.nextUrl.searchParams.get('next') || '/dashboard';
      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  // Always return the response to preserve cookies
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
