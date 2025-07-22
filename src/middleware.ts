import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Add security headers
  res.headers.set('X-Frame-Options', 'DENY')
  res.headers.set('X-Content-Type-Options', 'nosniff')
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.headers.set('X-XSS-Protection', '1; mode=block')

  try {
    const supabase = createMiddlewareClient({ req, res })

    // Refresh session if expired
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error) {
      console.error('Middleware auth error:', {
        error: error.message,
        path: req.nextUrl.pathname,
        timestamp: new Date().toISOString()
      })
      // Don't block the request, let the page handle the error
    }

    // Route patterns
    const isAuthRoute = req.nextUrl.pathname.startsWith('/auth')
    const isApiAuthRoute = req.nextUrl.pathname.startsWith('/api/auth')
    const isPublicRoute = req.nextUrl.pathname === '/' ||
      req.nextUrl.pathname.startsWith('/public') ||
      req.nextUrl.pathname.startsWith('/_next') ||
      req.nextUrl.pathname.startsWith('/favicon')

    // Protected routes
    const protectedRoutes = ['/dashboard', '/api/analytics']
    const isProtectedRoute = protectedRoutes.some(route =>
      req.nextUrl.pathname.startsWith(route)
    )

    // Allow API auth routes and public routes
    if (isApiAuthRoute || isPublicRoute) {
      return res
    }

    // Handle protected routes
    if (isProtectedRoute) {
      if (!session) {
        console.log('Redirecting unauthenticated user:', {
          path: req.nextUrl.pathname,
          timestamp: new Date().toISOString()
        })
        const redirectUrl = new URL('/auth/login', req.url)
        redirectUrl.searchParams.set('next', req.nextUrl.pathname)
        return NextResponse.redirect(redirectUrl)
      }
    }

    // Redirect authenticated users away from auth pages
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
    // On error, allow the request to continue
    return res
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}