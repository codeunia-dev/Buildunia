'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Download, Mail, CheckCircle, Package, MapPin, Phone, Mail as MailIcon, Calendar, CreditCard, Building, FileText, Shield, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { useBuilduniaAuth } from '@/contexts/BuilduniaAuthContext'

interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price: number
  option_selected: string
  created_at: string
  product?: {
    title?: string
    category?: string
  }
}

interface Order {
  id: string
  user_id: string
  total: number
  status: string
  platform: string
  shipping_address: {
    name: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    pincode: string
    country: string
  }
  digipin?: string
  created_at: string
  updated_at: string
  items?: OrderItem[]
}

export default function ReceiptPage() {
  const params = useParams()
  const router = useRouter()
  const { user, loading: authLoading, isAdmin } = useBuilduniaAuth()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [downloading, setDownloading] = useState(false)
  const receiptRef = useRef<HTMLDivElement>(null)

  const orderId = params.orderId as string

  useEffect(() => {
    // Check authentication first
    if (authLoading) return // Wait for auth to load
    
    if (!user) {
      setError('Authentication required. Please sign in to view this receipt.')
      setLoading(false)
      return
    }
    
    fetchOrder()
  }, [orderId, user, authLoading])

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        credentials: 'include' // Include authentication cookies
      })
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication required')
        } else if (response.status === 403) {
          throw new Error('Access denied. You can only view your own orders.')
        } else if (response.status === 404) {
        throw new Error('Order not found')
        } else {
          throw new Error('Failed to fetch order')
        }
      }

      const orderData = await response.json()
      
      // Additional security check: ensure user can only view their own orders (unless admin)
      if (!isAdmin && orderData.user_id !== user?.id) {
        setError('Access denied. You can only view your own orders.')
        setLoading(false)
        return
      }
      
      setOrder(orderData)
    } catch (error) {
      console.error('Error fetching order:', error)
      setError(error instanceof Error ? error.message : 'Order not found or access denied')
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-500/20 text-green-300 border-green-600'
      case 'processing': return 'bg-blue-500/20 text-blue-300 border-blue-600'
      case 'shipped': return 'bg-purple-500/20 text-purple-300 border-purple-600'
      case 'delivered': return 'bg-green-500/20 text-green-300 border-green-600'
      case 'cancelled': return 'bg-red-500/20 text-red-300 border-red-600'
      default: return 'bg-yellow-500/20 text-yellow-300 border-yellow-600'
    }
  }

  const calculateTax = (total: number) => {
    return Math.round(total * 0.08) // 8% GST
  }

  const calculateSubtotal = (total: number) => {
    const tax = calculateTax(total)
    const shipping = 10
    return total - tax - shipping
  }

  const handleDownloadReceipt = async () => {
    if (!receiptRef.current || downloading || !order) return
    
    setDownloading(true)
    try {
      // Clone the receipt element to avoid modifying the original
      const receiptClone = receiptRef.current.cloneNode(true) as HTMLElement
      
      // Apply print styles to the clone
      receiptClone.style.cssText = `
        position: absolute;
        left: -9999px;
        top: 0;
        background: white !important;
        color: black !important;
        font-family: 'Arial', 'Helvetica', sans-serif;
        padding: 20px;
        width: 800px;
        border: 1px solid #ddd;
        border-radius: 8px;
        line-height: 1.4;
        font-size: 12px;
      `
      
      // Apply print styles to all elements in the clone
      const allElements = receiptClone.querySelectorAll('*')
      allElements.forEach((element) => {
        if (element instanceof HTMLElement) {
          element.style.background = 'white !important'
          element.style.color = 'black !important'
          element.style.borderColor = '#ccc !important'
          element.style.boxShadow = 'none !important'
          
          // Ensure text is black
          if (element.style.color === 'white' || element.style.color === 'rgb(255, 255, 255)') {
            element.style.color = 'black !important'
          }
          if (element.style.color === 'rgb(156, 163, 175)' || element.style.color === 'rgb(107, 114, 128)') {
            element.style.color = '#666 !important'
          }
          if (element.style.color === 'rgb(209, 213, 219)' || element.style.color === 'rgb(156, 163, 175)') {
            element.style.color = '#333 !important'
          }
          
          // Ensure billing section text is black
          const billingSection = element.closest('.billing-section')
          if (billingSection && billingSection instanceof HTMLElement) {
            billingSection.style.color = 'black !important'
          }
        }
      })
      
      // Hide the footer in the clone
      const footer = receiptClone.querySelector('.receipt-footer')
      if (footer && footer instanceof HTMLElement) {
        footer.style.display = 'none !important'
        footer.style.visibility = 'hidden !important'
        footer.style.height = '0 !important'
        footer.style.overflow = 'hidden !important'
      }
      
      // Hide any navigation or buttons
      const buttons = receiptClone.querySelectorAll('button, .no-print')
      buttons.forEach((button) => {
        const btn = button as HTMLElement
        btn.style.display = 'none !important'
      })
      
      // Add to DOM temporarily
      document.body.appendChild(receiptClone)
      
      // Configure html2canvas options for better quality
      const canvas = await html2canvas(receiptClone, {
        scale: 3, // Higher scale for better quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff', // White background for PDF
        width: receiptClone.scrollWidth,
        height: receiptClone.scrollHeight,
        scrollX: 0,
        scrollY: 0,
        logging: false, // Disable logging for cleaner output
        imageTimeout: 0, // No timeout for images
        ignoreElements: (element) => {
          // Ignore elements that should not be in PDF
          const className = element.className || ''
          return className.includes('receipt-footer') || 
                 className.includes('no-print') ||
                 element.tagName === 'BUTTON'
        }
      })
      
      // Remove the temporary clone
      document.body.removeChild(receiptClone)

      // Create PDF
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      
      // Calculate dimensions
      const imgWidth = 210 // A4 width in mm
      const pageHeight = 295 // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight
      let position = 0

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      // Download the PDF
      const fileName = `BuildUnia_Invoice_${orderId.slice(-8).toUpperCase()}_${new Date().toISOString().split('T')[0]}.pdf`
      pdf.save(fileName)
      
      // Show success message
      setTimeout(() => {
        alert('PDF generated successfully! Check your downloads folder.')
      }, 500)
      
    } catch (error) {
      console.error('Error generating PDF:', error)
      console.error('Error details:', error)
      
      // Fallback: try to print the current receipt
      try {
    window.print()
      } catch (printError) {
        console.error('Print fallback also failed:', printError)
        alert('PDF generation failed. Please try the print option instead.')
      }
    } finally {
      setDownloading(false)
    }
  }

  const handleEmailReceipt = async () => {
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

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">
            {authLoading ? 'Checking authentication...' : 'Loading receipt...'}
          </p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="mb-6">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-4">
              {error?.includes('Authentication') ? 'Authentication Required' : 'Receipt Not Found'}
            </h1>
          <p className="text-gray-400 mb-6">{error || 'The receipt you\'re looking for doesn\'t exist.'}</p>
          </div>
          
          <div className="space-y-3">
            {error?.includes('Authentication') ? (
              <>
                <Button asChild className="w-full">
                  <Link href="/auth/signin">Sign In to Continue</Link>
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/">Back to Home</Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild className="w-full">
            <Link href="/">Back to Home</Link>
          </Button>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  const subtotal = calculateSubtotal(order.total)
  const tax = calculateTax(order.total)
  const shipping = 10

  return (
    <div className="min-h-screen bg-black">
      <style jsx>{`
        @media print {
          .billing-section h3,
          .billing-section p,
          .billing-section span {
            color: black !important;
          }
          .billing-section {
            background: white !important;
          }
        }
      `}</style>
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 no-print">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild className="text-white hover:bg-gray-800">
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
              <h1 className="text-xl font-bold text-white">Invoice</h1>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-xs text-gray-400 mr-2">
                <Shield className="h-3 w-3" />
                <span>Secure</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleEmailReceipt} className="text-white border-gray-600 hover:bg-gray-800">
                <Mail className="h-4 w-4 mr-2" />
                Email Receipt
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDownloadReceipt} 
                disabled={downloading}
                className="text-white border-gray-600 hover:bg-gray-800 disabled:opacity-50 transition-all duration-300"
              >
                {downloading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating PDF...
                  </>
                ) : (
                  <>
                <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => window.print()}
                className="text-white border-gray-600 hover:bg-gray-800 transition-all duration-300"
              >
                <FileText className="h-4 w-4 mr-2" />
                Print
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Single Unified Receipt Card */}
        <Card className="bg-gray-900 border-gray-800 shadow-2xl receipt-card print-receipt" ref={receiptRef}>
          <CardContent className="p-0">
            {/* Company Header */}
            <div className="bg-gradient-to-r from-blue-900 to-purple-900 p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Building className="h-8 w-8 text-blue-400" />
                  <div>
                    <h1 className="text-2xl font-bold text-white">BuildUnia</h1>
                    <p className="text-gray-300">A Codeunia Product</p>
                    <p className="text-gray-400 text-sm">IoT Project Kits & Mentorship</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-5 w-5 text-blue-400" />
                    <h2 className="text-xl font-bold text-white">Invoice</h2>
                  </div>
                  <p className="text-gray-300 text-sm">Invoice #: {order.id.slice(-8).toUpperCase()}</p>
                  <p className="text-gray-300 text-sm">Date: {formatDate(order.created_at)}</p>
                  <Badge className={`mt-2 ${getStatusColor(order.status)}`}>
                    {order.status.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Billing Information */}
            <div className="p-6 border-b border-gray-700 billing-section">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Company Information */}
                <div className="flex-1">
                  <h3 className="text-black font-semibold mb-3 flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Bill From
                  </h3>
                  <div className="text-black space-y-1 text-sm">
                    <p className="font-medium">BuildUnia</p>
                    <p>A Codeunia Product</p>
                    <p>SAS Nagar Mohali</p>
                    <p>Punjab, India</p>
                    <p className="mt-2">
                      <span className="text-gray-600">Phone:</span> +91 8699025107
                    </p>
                    <p>
                      <span className="text-gray-600">Email:</span> buildunia.codeunia@gmail.com
                    </p>
                  </div>
                </div>

                {/* Customer Information */}
                <div className="flex-1">
                  <h3 className="text-black font-semibold mb-3 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Bill To
                  </h3>
                  <div className="text-black space-y-1 text-sm">
                    <p className="font-medium">{order.shipping_address.name}</p>
                    <p>{order.shipping_address.address}</p>
                    <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.pincode}</p>
                    <p>{order.shipping_address.country}</p>
                    <p className="mt-2">
                      <span className="text-gray-600">Phone:</span> {order.shipping_address.phone}
                    </p>
                    <p>
                      <span className="text-gray-600">Email:</span> {order.shipping_address.email}
                    </p>
                    {order.digipin && (
                      <p>
                        <span className="text-gray-600">DIGIPIN:</span> {order.digipin}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="p-6 border-b border-gray-700">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Package className="h-4 w-4" />
                Item Details
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4 text-white font-medium">Item</th>
                      <th className="text-center py-3 px-4 text-white font-medium">Qty</th>
                      <th className="text-right py-3 px-4 text-white font-medium">Rate</th>
                      <th className="text-right py-3 px-4 text-white font-medium">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item, index) => (
                        <tr key={index} className="border-b border-gray-700">
                          <td className="py-3 px-4">
                            <div>
                              <p className="text-white font-medium">
                                {item.product?.title || `Product ${item.product_id ? item.product_id.slice(0, 8) : 'Unknown'}`}
                              </p>
                              <p className="text-gray-400 text-sm">
                                {item.product?.category || 'IoT Project'}
                              </p>
                              {item.option_selected !== 'full' && (
                                <p className="text-blue-400 text-xs capitalize">
                                  {item.option_selected.replace('_', ' + ')} option
                                </p>
                              )}
                            </div>
                          </td>
                          <td className="text-center py-3 px-4 text-gray-300">{item.quantity}</td>
                          <td className="text-right py-3 px-4 text-gray-300">{formatPrice(item.price)}</td>
                          <td className="text-right py-3 px-4 text-white font-medium">{formatPrice(item.price * item.quantity)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="text-center py-8 text-gray-400">
                          No items found for this order
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Payment Summary and Terms */}
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Terms and Conditions */}
                <div>
                  <h3 className="text-white font-semibold mb-3">Terms & Conditions</h3>
                  <div className="text-sm text-gray-300 space-y-2">
                    <p>• Payment is due upon receipt of this invoice</p>
                    <p>• Goods once sold will not be taken back</p>
                    <p>• Warranty is as per manufacturer's terms</p>
                    <p>• Delivery within 8-14 business days</p>
                    <p>• For support, contact: buildunia.codeunia@gmail.com</p>
                  </div>
                </div>

                {/* Payment Summary */}
                <div>
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Payment Summary
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-300">
                      <span>Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Shipping</span>
                      <span>{formatPrice(shipping)}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>GST (8%)</span>
                      <span>{formatPrice(tax)}</span>
                    </div>
                    <div className="flex justify-between text-white font-bold text-lg pt-3 border-t border-gray-700">
                      <span>Total</span>
                      <span>{formatPrice(order.total)}</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-2">
                      <p>Amount in words: {numberToWords(order.total)} Rupees Only</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-800 p-6 border-t border-gray-700 receipt-footer no-print" style={{ display: 'none' }}>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <h4 className="text-white font-medium mb-2">Payment Method</h4>
                  <p className="text-gray-300">Online Payment</p>
                  <p className="text-gray-400 text-sm">Status: Paid</p>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-2">Delivery</h4>
                  <p className="text-gray-300">Standard Shipping</p>
                  <p className="text-gray-400 text-sm">8-14 business days</p>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-2">Support</h4>
                  <p className="text-gray-300">buildunia.codeunia@gmail.com</p>
                  <p className="text-gray-400 text-sm">+91 8699025107</p>
                </div>
              </div>
              <div className="text-center mt-6 pt-6 border-t border-gray-700">
                <p className="text-gray-400 text-sm">
                  Thank you for choosing BuildUnia! For any queries, please contact our support team.
                </p>
                <p className="text-gray-500 text-xs mt-2">
                  This is a computer generated invoice. No signature required.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Helper function to convert number to words
function numberToWords(num: number): string {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine']
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen']

  function convertLessThanOneThousand(n: number): string {
    if (n === 0) return ''

    if (n < 10) return ones[n] || ''
    if (n < 20) return teens[n - 10] || ''
    if (n < 100) {
      const tenDigit = Math.floor(n / 10)
      const oneDigit = n % 10
      return tens[tenDigit] + (oneDigit !== 0 ? ' ' + ones[oneDigit] : '')
    }
    if (n < 1000) {
      const hundredDigit = Math.floor(n / 100)
      const remainder = n % 100
      return ones[hundredDigit] + ' Hundred' + (remainder !== 0 ? ' and ' + convertLessThanOneThousand(remainder) : '')
    }
    
    return ''
  }

  if (num === 0) return 'Zero'
  
  // Handle decimal numbers by converting to integer
  const integerPart = Math.floor(num)
  
  const crores = Math.floor(integerPart / 10000000)
  const lakhs = Math.floor((integerPart % 10000000) / 100000)
  const thousands = Math.floor((integerPart % 100000) / 1000)
  const remainder = integerPart % 1000

  let result = ''

  if (crores > 0) {
    result += convertLessThanOneThousand(crores) + ' Crore '
  }
  if (lakhs > 0) {
    result += convertLessThanOneThousand(lakhs) + ' Lakh '
  }
  if (thousands > 0) {
    result += convertLessThanOneThousand(thousands) + ' Thousand '
  }
  if (remainder > 0) {
    result += convertLessThanOneThousand(remainder)
  }

  return result.trim()
} 