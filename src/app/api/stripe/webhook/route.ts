import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event

  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object
        console.log('Payment succeeded:', session.id)
        
        // Here you can:
        // 1. Update order status in database
        // 2. Send confirmation email
        // 3. Fulfill the order
        
        await handleSuccessfulPayment(session)
        break

      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object
        console.log('PaymentIntent succeeded:', paymentIntent.id)
        break

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object
        console.log('PaymentIntent failed:', failedPayment.id)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function handleSuccessfulPayment(session: any) {
  try {
    // Example: Update order status in Supabase
    const { data, error } = await supabase
      .from('orders')
      .update({ 
        status: 'paid',
        stripe_session_id: session.id,
        paid_at: new Date().toISOString()
      })
      .eq('stripe_session_id', session.id)

    if (error) {
      console.error('Error updating order:', error)
    } else {
      console.log('Order updated successfully:', data)
    }
  } catch (error) {
    console.error('Error in handleSuccessfulPayment:', error)
  }
}
