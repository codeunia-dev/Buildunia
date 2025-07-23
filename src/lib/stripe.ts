// TODO: Uncomment and set the correct Stripe API version and key when ready
// import { loadStripe } from '@stripe/stripe-js';
// import Stripe from 'stripe';
// export const stripePromise = loadStripe('YOUR_STRIPE_PUBLISHABLE_KEY');
// export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: '2025-06-30.basil',
//   typescript: true,
// });

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
