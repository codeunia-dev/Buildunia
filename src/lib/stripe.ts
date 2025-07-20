import { loadStripe } from '@stripe/stripe-js'
import Stripe from 'stripe'

// Client-side Stripe instance
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

// Server-side Stripe instance
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
})

export { stripePromise }

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}

// Stripe configuration
export const STRIPE_CONFIG = {
  currency: 'usd',
  payment_method_types: ['card'],
  billing_address_collection: 'required',
  shipping_address_collection: {
    allowed_countries: ['US', 'CA', 'GB', 'AU', 'IN'],
  },
}

// Product types for Stripe
export interface StripeProduct {
  id: string
  name: string
  description?: string
  price: number
  currency: string
  metadata?: Record<string, string>
}

// Create a payment intent
export async function createPaymentIntent(amount: number, currency = 'usd') {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return { success: true, clientSecret: paymentIntent.client_secret }
  } catch (error) {
    console.error('Error creating payment intent:', error)
    return { success: false, error: 'Failed to create payment intent' }
  }
}

// Create a checkout session
export async function createCheckoutSession(
  items: StripeProduct[],
  successUrl: string,
  cancelUrl: string,
  customerEmail?: string
) {
  try {
    const lineItems = items.map(item => ({
      price_data: {
        currency: STRIPE_CONFIG.currency,
        product_data: {
          name: item.name,
          description: item.description,
          metadata: item.metadata || {},
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: 1,
    }))

    const session = await stripe.checkout.sessions.create({
      payment_method_types: STRIPE_CONFIG.payment_method_types,
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      billing_address_collection: STRIPE_CONFIG.billing_address_collection,
      shipping_address_collection: STRIPE_CONFIG.shipping_address_collection,
      customer_email: customerEmail,
      metadata: {
        source: 'buildunia',
      },
    })

    return { success: true, sessionId: session.id, url: session.url }
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return { success: false, error: 'Failed to create checkout session' }
  }
}
