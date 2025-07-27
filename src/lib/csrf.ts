import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createServerClient } from '@/lib/supabase-server'

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

export async function csrfMiddleware(req: NextRequest) {
  // Skip CSRF for GET requests
  if (req.method === 'GET') {
    return null
  }
  
  try {
    // Get user from Supabase session
    const supabase = await createServerClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    // Use user ID as session ID for CSRF token
    const sessionId = user.id
    
    const token = req.headers.get('x-csrf-token') || req.nextUrl.searchParams.get('csrf_token')
    
    if (!token || !validateCSRFToken(sessionId, token)) {
      return NextResponse.json(
        { error: 'Invalid CSRF token' },
        { status: 403 }
      )
    }
    
    return null // Allow request
  } catch (error) {
    console.error('CSRF middleware error:', error)
    return NextResponse.json(
      { error: 'CSRF validation failed' },
      { status: 500 }
    )
  }
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