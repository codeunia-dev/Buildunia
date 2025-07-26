import { NextRequest, NextResponse } from 'next/server';

// Simulate PhonePe payment initiation (test mode)
export async function POST(req: NextRequest) {
  const data = await req.json();
  // Normally, you'd use PhonePe API here. For now, simulate a payment URL.
  const { amount, name, email, phone } = data;

  // Simulate a payment URL (replace with real PhonePe URL in production)
  const paymentUrl = `https://test.phonepe.com/pay?amount=${amount}&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}`;

  return NextResponse.json({ paymentUrl });
} 