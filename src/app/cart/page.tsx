'use client'

import Link from 'next/link'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCart } from '@/contexts/CartContext'
import { formatPrice } from '@/lib/stripe'

export default function CartPage() {
  const { state, updateQuantity, removeItem } = useCart()

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">
            Looks like you haven&apos;t added any projects to your cart yet.
          </p>
          <Button asChild>
            <Link href="/projects">Browse Projects</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        <p className="text-gray-500 mb-8">You&apos;re almost there! Review your items and proceed to checkout.</p>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {state.items.map((item) => (
              <Card key={item.project.id}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0"></div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {item.project.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {item.project.category} • {item.project.difficulty}
                      </p>
                      <p className="text-lg font-semibold text-blue-600 mt-2">
                        {formatPrice(item.project.price)}
                      </p>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="flex items-center border rounded-md">
                        <button
                          onClick={() => updateQuantity(item.project.id, item.quantity - 1)}
                          className="p-2 hover:bg-gray-100"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-4 py-2 text-center min-w-[3rem]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.project.id, item.quantity + 1)}
                          className="p-2 hover:bg-gray-100"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <button
                        onClick={() => removeItem(item.project.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal ({state.items.reduce((total, item) => total + item.quantity, 0)} items)</span>
                  <span>{formatPrice(state.total)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>{formatPrice(state.total)}</span>
                  </div>
                </div>

                <Button className="w-full" size="lg" asChild>
                  <Link href="/checkout">
                    Proceed to Checkout
                  </Link>
                </Button>

                <div className="text-center">
                  <Link href="/projects" className="text-blue-600 hover:underline text-sm">
                    Continue Shopping
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
