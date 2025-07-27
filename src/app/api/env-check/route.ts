import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const csrfSecret = process.env.CSRF_SECRET;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    
    return NextResponse.json({
      success: true,
      environment: {
        csrfSecret: csrfSecret ? 'SET' : 'NOT SET',
        csrfSecretLength: csrfSecret ? csrfSecret.length : 0,
        supabaseUrl: supabaseUrl ? 'SET' : 'NOT SET',
        supabaseKey: supabaseKey ? 'SET' : 'NOT SET',
        razorpayKey: razorpayKey ? 'SET' : 'NOT SET',
        nodeEnv: process.env.NODE_ENV || 'NOT SET'
      },
      message: 'Environment variables check completed'
    });
  } catch (error) {
    console.error('Error in environment check:', error);
    return NextResponse.json(
      { error: 'Failed to check environment variables' },
      { status: 500 }
    );
  }
} 