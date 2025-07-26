"use client";
import { Suspense } from "react";
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Mail, Phone, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function SuccessPageInner() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [orderDetails, setOrderDetails] = useState<{
    total?: number;
    isMentorship?: boolean;
    selectedMentor?: string;
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (sessionId) {
      // Fetch order details from your backend
      fetchOrderDetails(sessionId)
    } else {
      setLoading(false)
    }
  }, [sessionId])

  const fetchOrderDetails = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/orders/verify?session_id=${sessionId}`)
      if (response.ok) {
        const data = await response.json()
        setOrderDetails(data)
      }
    } catch (error) {
      console.error('Error fetching order details:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Verifying your payment...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Payment Successful!
          </h1>
          <p className="text-xl text-gray-300">
            Thank you for your purchase. We&apos;ll be in touch soon!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Order Summary */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-gray-300">
                <span>Order ID</span>
                <span className="font-mono text-sm">{sessionId?.slice(-8)}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Status</span>
                <span className="text-green-400 font-semibold">Paid</span>
              </div>
              {orderDetails?.isMentorship && (
                <div className="flex justify-between text-gray-300">
                  <span>Mentor</span>
                  <span>{orderDetails.selectedMentor}</span>
                </div>
              )}
              <div className="pt-4 border-t border-gray-700">
                <div className="flex justify-between text-white font-semibold">
                  <span>Total Paid</span>
                  <span>₹{orderDetails?.total || 'N/A'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">What&apos;s Next?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {orderDetails?.isMentorship ? (
                <>
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-blue-400 mt-0.5" />
                    <div>
                      <p className="text-white font-medium">Email Confirmation</p>
                      <p className="text-gray-400 text-sm">You&apos;ll receive a confirmation email within 24 hours</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-blue-400 mt-0.5" />
                    <div>
                      <p className="text-white font-medium">Schedule Session</p>
                      <p className="text-gray-400 text-sm">We&apos;ll contact you to schedule your mentorship session</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-blue-400 mt-0.5" />
                    <div>
                      <p className="text-white font-medium">Support</p>
                      <p className="text-gray-400 text-sm">Need help? Contact us at support@buildunia.com</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-blue-400 mt-0.5" />
                    <div>
                      <p className="text-white font-medium">Project Details</p>
                      <p className="text-gray-400 text-sm">You&apos;ll receive project details and shipping information</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-blue-400 mt-0.5" />
                    <div>
                      <p className="text-white font-medium">Shipping</p>
                      <p className="text-gray-400 text-sm">Your order will be shipped within 2-3 business days</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-blue-400 mt-0.5" />
                    <div>
                      <p className="text-white font-medium">Support</p>
                      <p className="text-gray-400 text-sm">Need help? Contact us at support@buildunia.com</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12 space-y-4">
          <Button size="lg" asChild>
            <Link href="/">Back to Home</Link>
          </Button>
          <div>
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black" asChild>
              <Link href="/projects">Browse More Projects</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SuccessPageWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>}>
      <SuccessPageInner />
    </Suspense>
  );
} 