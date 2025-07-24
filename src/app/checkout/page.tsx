'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

import { formatPrice } from '@/lib/stripe';

export default function CheckoutPage() {
  const { state } = useCart();
  const router = useRouter();
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [inquiry, setInquiry] = useState({
    type: '',
    name: '',
    email: '',
    phone: '',
    notes: '',
  });
  // Track selected option for price
  const [selectedOption, setSelectedOption] = useState('');

  // Get the first cart item (assuming single project checkout for now)
  const cartItem = state.items[0]?.project as (typeof state.items[0]['project']) & { prices?: { [key: string]: number } };
  // Map select value to price key
  const optionKeyMap: Record<string, string> = {
    complete: 'complete',
    hardware: 'hardware',
    mentorship: 'mentorship',
    mentorship_hardware: 'mentorship_hardware',
    other: 'other',
  };
  // Determine price based on selected option
  let price = cartItem?.price || 0;
  if (cartItem?.prices && selectedOption && optionKeyMap[selectedOption]) {
    price = cartItem.prices[optionKeyMap[selectedOption]] || price;
  }
  const shipping = 9.99;
  const tax = price * 0.08;
  const total = price + shipping + tax;

  const handleInquiryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setInquiry({
      ...inquiry,
      [e.target.name]: e.target.value,
    });
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Send inquiry to backend or email service
    setInquirySubmitted(true);
  };

  if (inquirySubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="bg-gray-900 p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Thank you for your inquiry!</h2>
          <p className="text-gray-300">We will reach out to you soon with more details.</p>
        </div>
      </div>
    );
  }

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="h-24 w-24 text-gray-600 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-white mb-4">Your cart is empty</h1>
          <p className="text-gray-400 mb-8">Add some projects to your cart before checking out.</p>
          <Button onClick={() => router.push('/projects')}>Browse Projects</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Checkout</h1>
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Checkout Form */}
          <div>
            <form onSubmit={handleInquirySubmit} className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-lg space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Project Inquiry</h2>
              <div>
                <label htmlFor="type" className="block text-gray-200 mb-2">What do you want?</label>
                <select
                  id="type"
                  name="type"
                  value={selectedOption}
                  onChange={e => {
                    setSelectedOption(e.target.value);
                    setInquiry({ ...inquiry, type: e.target.value });
                  }}
                  required
                  className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
                >
                  <option value="">Select an option</option>
                  <option value="complete">Complete Project</option>
                  <option value="hardware">Hardware Only</option>
                  <option value="mentorship">Mentorship</option>
                  <option value="mentorship_hardware">Mentorship + Hardware</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="name" className="block text-gray-200 mb-2">Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={inquiry.name}
                  onChange={handleInquiryChange}
                  required
                  className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-gray-200 mb-2">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={inquiry.email}
                  onChange={handleInquiryChange}
                  required
                  className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-gray-200 mb-2">Phone (optional)</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={inquiry.phone}
                  onChange={handleInquiryChange}
                  className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
                />
              </div>
              <div>
                <label htmlFor="notes" className="block text-gray-200 mb-2">Additional Notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={inquiry.notes}
                  onChange={handleInquiryChange}
                  rows={3}
                  className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 rounded transition-all duration-200"
              >
                Submit Inquiry
              </button>
              {/*
              // TODO: Stripe payment integration here
              // import { loadStripe } from '@stripe/stripe-js';
              // const stripePromise = loadStripe('YOUR_STRIPE_PUBLISHABLE_KEY');
              */}
            </form>
          </div>
          {/* Order Summary */}
          <div>
            <Card className="bg-gray-900/50 border-gray-700 sticky top-8">
              <CardHeader>
                <CardTitle className="text-white">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3">
                  {state.items.map((item) => (
                    <div key={item.project.id} className="flex items-center space-x-3 py-3 border-b border-gray-700 last:border-b-0">
                      <div className="w-16 h-16 bg-gray-800 rounded-lg flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-medium truncate">
                          {item.project.name}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {item.project.category} • {item.project.difficulty}
                        </p>
                      </div>
                      <div className="text-white font-medium">
                        {formatPrice(price)}
                      </div>
                    </div>
                  ))}
                </div>
                {/* Order Totals */}
                <div className="space-y-2 pt-4 border-t border-gray-700">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal</span>
                    <span>{formatPrice(price)}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Shipping</span>
                    <span>{formatPrice(shipping)}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Tax</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  <div className="flex justify-between text-white font-semibold text-lg pt-2 border-t border-gray-700">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
                {/* Security Badge */}
                <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-600">
                  <div className="flex items-center text-green-400 text-sm">
                    <Lock className="w-4 h-4 mr-2" />
                    <span>256-bit SSL encryption</span>
                  </div>
                  <div className="text-gray-400 text-xs mt-1">
                    Your payment is processed securely by Stripe
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}