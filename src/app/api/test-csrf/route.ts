import { NextRequest, NextResponse } from 'next/server';
import { getCSRFToken, validateCSRFToken } from '@/lib/csrf';
import { createServerClient } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    // Get user session for CSRF token
    const supabase = await createServerClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Use user ID as session ID for CSRF token
    const token = getCSRFToken(user.id);
    
    return NextResponse.json({ 
      success: true,
      token,
      userId: user.id,
      message: 'CSRF token generated successfully'
    });
  } catch (error) {
    console.error('Error in test CSRF endpoint:', error);
    return NextResponse.json(
      { error: 'Failed to generate CSRF token' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get user session for CSRF token validation
    const supabase = await createServerClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { token } = body;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }
    
    // Validate the token
    const isValid = validateCSRFToken(user.id, token);
    
    return NextResponse.json({ 
      success: true,
      isValid,
      userId: user.id,
      message: isValid ? 'CSRF token is valid' : 'CSRF token is invalid'
    });
  } catch (error) {
    console.error('Error in test CSRF validation:', error);
    return NextResponse.json(
      { error: 'Failed to validate CSRF token' },
      { status: 500 }
    );
  }
} 