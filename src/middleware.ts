import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Simple debug logging for middleware (no import to avoid client-side issues)
const safeLog = {
  log: (...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(...args)
    }
  },
  error: (...args: any[]) => {
    console.error(...args)
  }
}

export async function middleware(req: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => req.cookies.set(name, value))
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    }
  )

  // Refresh session for all routes
  await supabase.auth.getSession()

  // For API routes, ensure session is refreshed and cookies are properly set
  if (req.nextUrl.pathname.startsWith('/api/')) {
    try {
      // This ensures the session is refreshed and cookies are updated
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error) {
        safeLog.log('Middleware auth error:', error.message)
        // Don't block the request, let the API handle authentication
      } else if (user) {
        safeLog.log('Middleware: User authenticated:', user.email)
      }
    } catch (error) {
      safeLog.error('Middleware error:', error)
      // Don't block the request, let the API handle authentication
    }
  }

  // For admin routes, check if user is authenticated
  if (req.nextUrl.pathname.startsWith('/admin')) {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return NextResponse.redirect(new URL('/auth/signin?redirect=/admin', req.url))
    }
  }
  
  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
} 