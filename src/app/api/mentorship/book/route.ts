import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';
import { csrfMiddleware } from '@/lib/csrf';

export async function POST(req: NextRequest) {
  // Apply CSRF protection
  const csrfResult = await csrfMiddleware(req);
  if (csrfResult) {
    return csrfResult;
  }

  const supabase = await createServerClient();
  const data = await req.json();

  const { user_id, package_id, package_name, price, mentor_preference, preferred_time, notes } = data;

  // Insert mentorship booking
  const { data: booking, error: bookingError } = await supabase
    .from('mentorship')
    .insert([
      {
        user_id: user_id || null,
        title: package_name,
        description: `Mentorship booking for ${package_name}`,
        duration: package_id === 'single' ? '1 hour' : package_id === 'monthly' ? '4 sessions' : '3 months',
        price,
        platform: 'buildunia',
        status: 'pending',
        mentor_preference,
        preferred_time,
        notes
      },
    ])
    .select()
    .single();

  if (bookingError || !booking) {
    return NextResponse.json({ error: bookingError?.message || 'Failed to create mentorship booking' }, { status: 500 });
  }

  return NextResponse.json({ 
    bookingId: booking.id,
    message: 'Mentorship booking created successfully. We will contact you soon to schedule your session.'
  });
} 