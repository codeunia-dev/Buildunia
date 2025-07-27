import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// CSRF token store (use Redis in production)
const csrfTokens = new Map<string, { token: string; expires: number }>()

const CSRF_SECRET = process.env.CSRF_SECRET || crypto.randomBytes(32).toString('hex')
const TOKEN_EXPIRY = 24 * 60 * 60 * 1000 // 24 hours

export function generateCSRFToken(sessionId: string): string {
  const token = crypto.randomBytes(32).toString('hex')
  const expires = Date.now() + TOKEN_EXPIRY
  
  csrfTokens.set(sessionId, { token, expires })
  
  // Clean up expired tokens
  for (const [key, value] of csrfTokens.entries()) {
    if (value.expires < Date.now()) {
      csrfTokens.delete(key)
    }
  }
  
  return token
}

export function validateCSRFToken(sessionId: string, token: string): boolean {
  const stored = csrfTokens.get(sessionId)
  
  if (!stored || stored.expires < Date.now()) {
    csrfTokens.delete(sessionId)
    return false
  }
  
  return stored.token === token
}

export function getCSRFToken(sessionId: string): string {
  const existing = csrfTokens.get(sessionId)
  
  if (existing && existing.expires > Date.now()) {
    return existing.token
  }
  
  return generateCSRFToken(sessionId)
}

export function csrfMiddleware(req: NextRequest) {
  // Skip CSRF for GET requests
  if (req.method === 'GET') {
    return null
  }
  
  const sessionId = req.cookies.get('session')?.value || req.headers.get('x-session-id')
  
  if (!sessionId) {
    return NextResponse.json(
      { error: 'CSRF token required' },
      { status: 403 }
    )
  }
  
  const token = req.headers.get('x-csrf-token') || req.nextUrl.searchParams.get('csrf_token')
  
  if (!token || !validateCSRFToken(sessionId, token)) {
    return NextResponse.json(
      { error: 'Invalid CSRF token' },
      { status: 403 }
    )
  }
  
  return null // Allow request
}

// Helper function to add CSRF token to forms
export function addCSRFTokenToForm(formData: FormData, sessionId: string): FormData {
  const token = getCSRFToken(sessionId)
  formData.append('csrf_token', token)
  return formData
}

// Helper function to add CSRF token to headers
export function addCSRFTokenToHeaders(headers: Headers, sessionId: string): Headers {
  const token = getCSRFToken(sessionId)
  headers.set('x-csrf-token', token)
  return headers
} 