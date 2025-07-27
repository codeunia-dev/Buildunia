import { NextRequest, NextResponse } from 'next/server';
import { getCSRFToken } from '@/lib/csrf';
import { createServerClient } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    // Get user session for CSRF token
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Use user ID as session ID for CSRF token
    const token = getCSRFToken(user.id);
    
    return NextResponse.json({ token });
  } catch (error) {
    console.error('Error getting CSRF token:', error);
    return NextResponse.json(
      { error: 'Failed to get CSRF token' },
      { status: 500 }
    );
  }
} 