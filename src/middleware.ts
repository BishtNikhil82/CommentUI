import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Security headers
  res.headers.set('X-Frame-Options', 'DENY')
  res.headers.set('X-Content-Type-Options', 'nosniff')
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.headers.set('X-XSS-Protection', '1; mode=block')

  try {
    const supabase = createMiddlewareClient({ req, res })

    // Refresh session if needed
    const {
      data: { session },
      error
    } = await supabase.auth.getSession()

    const pathname = req.nextUrl.pathname
    const isPublicRoute =
      pathname === '/' ||
      pathname.startsWith('/public') ||
      pathname.startsWith('/_next') ||
      pathname.startsWith('/favicon')

    const isAuthRoute = pathname.startsWith('/auth')
    const isApiAuthRoute = pathname.startsWith('/api/auth')

    // ✅ Your protected routes (requires YouTube token too)
    const protectedRoutes = ['/dashboard', '/api/analytics']
    const isProtectedRoute = protectedRoutes.some(route =>
      pathname.startsWith(route)
    )

    console.log('middleware: testJobId', process.env.NEXT_PUBLIC_SUPABASE_TEST_JOB_ID, 'path:', req.nextUrl.pathname);

    if (isPublicRoute || isApiAuthRoute) {
      return res
    }

    const testJobId = process.env.NEXT_PUBLIC_SUPABASE_TEST_JOB_ID;
    if (isProtectedRoute && testJobId) {
      // Bypass YouTube token check in test mode
      return res;
    }

    if (isProtectedRoute) {
      if (!session) {
        console.warn('Redirecting unauthenticated user:', {
          pathname,
          timestamp: new Date().toISOString()
        })
        const redirectUrl = new URL('/auth/login', req.url)
        redirectUrl.searchParams.set('next', pathname)
        return NextResponse.redirect(redirectUrl)
      }

      // Debug: Log session and provider_token
      console.log('Session object:', JSON.stringify(session, null, 2))
      console.log('provider_token (top-level):', session.provider_token)
      console.log('provider_token (user_metadata):', session.user?.user_metadata?.provider_token)

      // 🔐 ✅ YouTube Access Check (important!)
      const hasYouTubeToken =
        (session.provider_token && session.provider_token.includes('ya29')) ||
        (session.user?.user_metadata?.provider_token && session.user.user_metadata.provider_token.includes('ya29'))
      if (!hasYouTubeToken) {
        console.warn('Redirecting: Missing YouTube permission:', {
          pathname,
          user: session.user?.email,
          timestamp: new Date().toISOString()
        })
        const redirectUrl = new URL('/auth/reauth', req.url)
        redirectUrl.searchParams.set('next', pathname)
        return NextResponse.redirect(redirectUrl)
      }
    }

    // Redirect logged-in user away from /auth/* to /dashboard
    if (isAuthRoute && session) {
      const next = req.nextUrl.searchParams.get('next') || '/dashboard'
      return NextResponse.redirect(new URL(next, req.url))
    }

    return res
  } catch (error) {
    console.error('Middleware error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      path: req.nextUrl.pathname,
      timestamp: new Date().toISOString()
    })
    return res // fail open
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
