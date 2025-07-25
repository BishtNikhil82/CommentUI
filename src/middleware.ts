import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

console.log('🔐 MIDDLEWARE: loaded');

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  // Add security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // Create Supabase client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookies) => {
          cookies.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        }
      }
    }
  );

  // DO NOT REMOVE — this sets up the auth state
  const { data: { session }, error } = await supabase.auth.getSession();

  const pathname = request.nextUrl.pathname;

  const isAuthRoute = pathname.startsWith('/auth');
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

  // Allow public and API auth routes
  if (isPublicRoute || isApiAuthRoute) {
    return response;
  }

  // Redirect if protected route and user is not signed in
  if (isProtectedRoute && !session) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/auth/login';
    redirectUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect logged-in users away from /auth routes
  if (isAuthRoute && session) {
    const next = request.nextUrl.searchParams.get('next') || '/dashboard';
    return NextResponse.redirect(new URL(next, request.url));
  }

  // Optional: Check for YouTube token if required
  if (isProtectedRoute && session) {
    const hasYouTubeToken =
      (session.provider_token && session.provider_token.includes('ya29')) ||
      (session.user?.user_metadata?.provider_token?.includes('ya29'));

    if (!hasYouTubeToken) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/auth/reauth';
      redirectUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Always return the original `response` to preserve cookies
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
