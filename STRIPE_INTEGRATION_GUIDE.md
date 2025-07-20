# Stripe Integration Guide for BuildUnia

## 🎯 Overview
This guide shows how to integrate Stripe payments into your BuildUnia IoT e-commerce platform.

## 📋 Prerequisites

### 1. Stripe Account Setup
1. Create a Stripe account at https://stripe.com
2. Get your API keys from the Dashboard:
   - **Publishable Key** (starts with `pk_test_` or `pk_live_`)
   - **Secret Key** (starts with `sk_test_` or `sk_live_`)
   - **Webhook Secret** (starts with `whsec_`)

### 2. Environment Configuration
Update your `.env.local` file:
```bash
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## 🚀 Implementation Status

### ✅ Completed Components

1. **Stripe Configuration** (`src/lib/stripe.ts`)
   - Client and server-side Stripe instances
   - Payment intent creation
   - Checkout session creation
   - Price formatting utilities

2. **API Routes**
   - `/api/stripe/create-payment-intent` - For custom payment flows
   - `/api/stripe/create-checkout-session` - For Stripe Checkout
   - `/api/stripe/webhook` - For handling Stripe events

3. **Enhanced Checkout Page**
   - Modern UI with black theme
   - Stripe Checkout integration
   - Order summary with calculations
   - Security indicators

## 💳 How to Use Stripe

### Method 1: Stripe Checkout (Recommended)
```typescript
// Redirect to Stripe's hosted checkout page
const response = await fetch('/api/stripe/create-checkout-session', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    items: [
      {
        id: 'project-1',
        name: 'Arduino Starter Kit',
        price: 49.99,
        currency: 'usd'
      }
    ],
    successUrl: 'http://localhost:3001/order-success',
    cancelUrl: 'http://localhost:3001/checkout',
    customerEmail: 'customer@example.com'
  })
})

const { url } = await response.json()
window.location.href = url // Redirect to Stripe
```

### Method 2: Custom Payment Form
```typescript
// Create payment intent for custom forms
const response = await fetch('/api/stripe/create-payment-intent', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    amount: 49.99,
    currency: 'usd'
  })
})

const { clientSecret } = await response.json()
// Use with Stripe Elements for custom forms
```

## 🔄 Webhook Handling

The webhook endpoint handles these events:
- `checkout.session.completed` - Payment succeeded
- `payment_intent.succeeded` - Payment confirmed
- `payment_intent.payment_failed` - Payment failed

### Webhook URL Setup
In your Stripe Dashboard, add this webhook endpoint:
```
https://your-domain.com/api/stripe/webhook
```

## 🎨 UI Features

### Checkout Page Features:
- **Modern Black Theme**: Consistent with BuildUnia design
- **Glass-morphism Cards**: Professional appearance
- **Gradient Buttons**: Eye-catching CTAs
- **Security Indicators**: SSL and encryption badges
- **Order Summary**: Real-time total calculations
- **Loading States**: Smooth user feedback

### Payment Flow:
1. User fills shipping information
2. Reviews order summary
3. Clicks "Pay" button
4. Redirects to Stripe Checkout
5. Completes payment
6. Returns to success page

## 🛡️ Security Features

- **SSL Encryption**: All data encrypted in transit
- **PCI Compliance**: Stripe handles card data
- **Webhook Verification**: Signed webhook events
- **Environment Variables**: Secure key storage

## 📱 Testing

### Test Cards
Use these test card numbers:
- **Success**: `4242424242424242`
- **Decline**: `4000000000000002`
- **3D Secure**: `4000002500003155`

### Test Mode
- All keys with `test` work in development
- No real money is charged
- Use Stripe Dashboard to monitor test payments

## 🔧 Customization

### Adding New Payment Methods
```typescript
// In stripe.ts, update STRIPE_CONFIG
export const STRIPE_CONFIG = {
  payment_method_types: ['card', 'apple_pay', 'google_pay'],
  // ... other options
}
```

### Custom Styling
The checkout page uses:
- `bg-black` - Pure black background
- `bg-gray-900/50` - Semi-transparent cards
- `border-gray-700` - Visible borders
- `text-white` - High contrast text

## 📊 Order Management

After successful payment:
1. Webhook updates order status in database
2. Inventory is reduced
3. Confirmation email sent
4. Customer redirected to success page

## 🚀 Next Steps

1. **Add Your Stripe Keys** to `.env.local`
2. **Test the Integration** with test cards
3. **Set up Webhooks** in Stripe Dashboard
4. **Customize Styling** as needed
5. **Go Live** with real Stripe keys

## 💡 Tips

- Test thoroughly with different card types
- Monitor webhook delivery in Stripe Dashboard
- Use Stripe's documentation for advanced features
- Consider adding Apple Pay/Google Pay for mobile users

## 🔗 Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Checkout Guide](https://stripe.com/docs/checkout)
- [Webhook Events](https://stripe.com/docs/webhooks)
- [Test Cards](https://stripe.com/docs/testing)

Your BuildUnia platform is now ready for secure payment processing! 🎉
