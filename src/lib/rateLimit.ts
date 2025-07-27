import { NextRequest, NextResponse } from 'next/server'

// In-memory store for rate limiting (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  max: number // Max requests per window
  message?: string
  statusCode?: number
}

export function createRateLimiter(config: RateLimitConfig) {
  const { windowMs, max, message = 'Too many requests', statusCode = 429 } = config

  return function rateLimit(req: NextRequest) {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    const now = Date.now()
    const windowStart = now - windowMs

    // Clean up old entries
    for (const [key, value] of rateLimitStore.entries()) {
      if (value.resetTime < now) {
        rateLimitStore.delete(key)
      }
    }

    // Get current rate limit data
    const current = rateLimitStore.get(ip)
    
    if (!current || current.resetTime < now) {
      // First request or window expired
      rateLimitStore.set(ip, {
        count: 1,
        resetTime: now + windowMs
      })
      return null // Allow request
    }

    if (current.count >= max) {
      // Rate limit exceeded
      return NextResponse.json(
        { error: message },
        { 
          status: statusCode,
          headers: {
            'X-RateLimit-Limit': max.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(current.resetTime).toISOString(),
            'Retry-After': Math.ceil(windowMs / 1000).toString()
          }
        }
      )
    }

    // Increment count
    current.count++
    rateLimitStore.set(ip, current)

    // Add rate limit headers
    const response = NextResponse.next()
    response.headers.set('X-RateLimit-Limit', max.toString())
    response.headers.set('X-RateLimit-Remaining', (max - current.count).toString())
    response.headers.set('X-RateLimit-Reset', new Date(current.resetTime).toISOString())

    return response
  }
}

// Pre-configured rate limiters
export const authRateLimit = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per 15 minutes
  message: 'Too many authentication attempts. Please try again later.'
})

export const apiRateLimit = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: 'Too many API requests. Please try again later.'
})

export const paymentRateLimit = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 payment requests per minute
  message: 'Too many payment attempts. Please try again later.'
})

export const uploadRateLimit = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 uploads per minute
  message: 'Too many upload attempts. Please try again later.'
}) 