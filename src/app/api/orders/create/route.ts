import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase';

// Initialize Stripe only if the secret key is available
let stripe: Stripe | null = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-06-30.basil',
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, total, customerInfo, isMentorship, selectedMentor } = body;

    // Check if Stripe is configured
    if (!stripe) {
      console.warn('Stripe not configured, returning mock response');
      return NextResponse.json({
        paymentIntent: { id: 'mock_session_id' },
        orderId: 'mock_order_id',
      });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: isMentorship ? 'Mentorship Session' : 'IoT Project Kit',
              description: isMentorship 
                ? `Mentorship session with ${selectedMentor}`
                : items[0]?.project?.title || 'IoT Project',
            },
            unit_amount: Math.round(total * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${request.nextUrl.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/checkout`,
      metadata: {
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        notes: customerInfo.notes,
        isMentorship: isMentorship.toString(),
        selectedMentor: selectedMentor || '',
        items: JSON.stringify(items),
      },
    });

    // Save order to database
    const supabase = createClient();
    
    // Get user from auth context (you might need to pass this from the frontend)
    // For now, we'll create an anonymous order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          total: total,
          status: 'pending',
          shipping_address: {
            name: customerInfo.name,
            email: customerInfo.email,
            phone: customerInfo.phone,
          },
          metadata: {
            isMentorship,
            selectedMentor,
            notes: customerInfo.notes,
            stripe_session_id: session.id,
          },
        },
      ])
      .select()
      .single();

    if (orderError) {
      console.error('Database error:', orderError);
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      paymentIntent: session,
      orderId: order.id,
    });
  } catch (error) {
    console.error('Payment error:', error);
    return NextResponse.json(
      { error: 'Payment processing failed' },
      { status: 500 }
    );
  }
} 