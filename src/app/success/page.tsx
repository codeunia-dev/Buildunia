'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, ArrowRight, Download, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function SuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [orderId, setOrderId] = useState<string | null>(null)
  const [orderStatus, setOrderStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get order ID from URL params or localStorage
    const urlOrderId = searchParams.get('orderId')
    const storedOrderId = localStorage.getItem('lastOrderId')
    
    if (urlOrderId) {
      setOrderId(urlOrderId)
      localStorage.setItem('lastOrderId', urlOrderId)
    } else if (storedOrderId) {
      setOrderId(storedOrderId)
    } else {
      // No order ID found, redirect to checkout
      alert('No order found. Please complete your purchase.')
      router.push('/checkout')
    }
  }, [searchParams, router])

  // Check order status when orderId is available
  useEffect(() => {
    if (orderId) {
      checkOrderStatus()
    }
  }, [orderId])

  const checkOrderStatus = async () => {
    if (!orderId) return
    
    try {
      const response = await fetch(`/api/orders/${orderId}`)
      if (response.ok) {
        const orderData = await response.json()
        setOrderStatus(orderData.status)
        
        // If order is still pending, redirect to checkout
        if (orderData.status === 'pending') {
          alert('Payment was not completed. Please try again.')
          router.push('/checkout')
          return
        }
        
        // If order is cancelled or failed, redirect to checkout
        if (orderData.status === 'cancelled' || orderData.status === 'failed') {
          alert('Payment was not successful. Please try again.')
          router.push('/checkout')
          return
        }
        
        // Only show success if order is actually paid
        if (orderData.status !== 'paid') {
          alert('Payment status is unclear. Please contact support.')
          router.push('/checkout')
          return
        }
      } else {
        console.error('Failed to fetch order status')
        alert('Could not verify payment status. Please contact support.')
        router.push('/checkout')
        return
      }
    } catch (error) {
      console.error('Error checking order status:', error)
      alert('Error verifying payment. Please contact support.')
      router.push('/checkout')
      return
    } finally {
      setLoading(false)
    }
  }

  const handleViewReceipt = () => {
    if (orderId) {
      router.push(`/receipt/${orderId}`)
    }
  }

  const handleEmailReceipt = async () => {
    if (!orderId) return
    
    try {
      const response = await fetch(`/api/orders/${orderId}/email-receipt`, {
        method: 'POST',
      })
      
      if (response.ok) {
        alert('Receipt sent to your email!')
      } else {
        alert('Failed to send receipt email')
      }
    } catch (error) {
      console.error('Error sending receipt email:', error)
      alert('Failed to send receipt email')
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      {loading ? (
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Verifying payment...</p>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-8">
              {/* Success Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
              </div>

              {/* Success Message */}
              <CardTitle className="text-3xl font-bold text-white mb-4">
                Payment Successful!
              </CardTitle>
              
              <p className="text-gray-300 text-lg mb-6">
                Thank you for your purchase. Your order has been confirmed and we'll start processing it right away.
              </p>

              {/* Order ID */}
              {orderId && (
                <div className="bg-gray-800 rounded-lg p-4 mb-6">
                  <p className="text-gray-400 text-sm mb-2">Order ID</p>
                  <p className="text-white font-mono text-lg">{orderId.slice(-8).toUpperCase()}</p>
                </div>
              )}

              {/* Next Steps */}
              <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-6 mb-8">
                <h3 className="text-white font-semibold mb-4">What happens next?</h3>
                <div className="space-y-3 text-left">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-300 text-sm">We'll process your order within 24-48 hours</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-300 text-sm">You'll receive tracking information once shipped</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-300 text-sm">For mentorship orders, your mentor will contact you within 24 hours</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-300 text-sm">Check your email for order confirmation and receipt</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                {orderId && (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button onClick={handleViewReceipt} className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      View Receipt
                    </Button>
                    <Button onClick={handleEmailReceipt} variant="outline" className="flex-1">
                      <Mail className="h-4 w-4 mr-2" />
                      Email Receipt
                    </Button>
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="outline" asChild className="flex-1">
                    <Link href="/dashboard">
                      View My Orders
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="flex-1">
                    <Link href="/projects">
                      Continue Shopping
                    </Link>
                  </Button>
                  <Button asChild className="flex-1">
                    <Link href="/">
                      Back to Home
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Support Info */}
              <div className="mt-8 pt-6 border-t border-gray-700">
                <p className="text-gray-400 text-sm">
                  Need help? Contact us at{' '}
                  <a href="mailto:buildunia.codeunia@gmail.com" className="text-blue-400 hover:underline">
                    buildunia.codeunia@gmail.com
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  )
} 