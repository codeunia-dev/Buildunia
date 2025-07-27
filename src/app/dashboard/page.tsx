'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Package, 
  CreditCard, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  LogOut,
  Download,
  Eye,
  Settings,
  Crown
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
  razorpay_order_id?: string
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
  created_at: string
  updated_at: string
  items?: OrderItem[]
}

export default function DashboardPage() {
  const { user, signOut, hasCodeuniaAccess, isAdmin } = useBuilduniaAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      router.push('/auth/signin?redirect=/dashboard')
      return
    }
    fetchUserOrders()
  }, [user, router])

  const fetchUserOrders = async () => {
    try {
      const response = await fetch('/api/orders/user', {
        credentials: 'include'
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders')
      }

      const data = await response.json()
      setOrders(data.orders || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
      setError('Failed to load order history')
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

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild className="text-white hover:bg-gray-800">
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
              <h1 className="text-xl font-bold text-white">My Dashboard</h1>
            </div>
            <div className="flex items-center gap-3">
              {hasCodeuniaAccess && (
                <div className="relative group">
                  <span className="text-xs text-green-400 bg-gradient-to-r from-green-900/30 to-emerald-900/30 px-2.5 py-1 rounded-full whitespace-nowrap border border-green-500/30 flex items-center gap-1">
                    <Crown className="h-3 w-3" />
                    Codeunia Access
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              )}
              {isAdmin && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  asChild 
                  className="bg-purple-900/30 border-purple-600/50 hover:bg-purple-800/50 hover:border-purple-500 transition-all duration-300"
                >
                  <Link href="/admin" className="flex items-center gap-1">
                    <Settings className="h-4 w-4" />
                    Admin
                  </Link>
                </Button>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSignOut} 
                className="bg-red-900/30 border-red-600/50 hover:bg-red-800/50 hover:border-red-500 transition-all duration-300"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Profile Section */}
        <Card className="bg-gray-900 border-gray-800 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <User className="h-5 w-5" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-white font-semibold mb-3">Personal Details</h3>
                <div className="space-y-2 text-gray-300">
                  <p><span className="text-gray-400">Name:</span> {user.user_metadata?.full_name || user.email}</p>
                  <p><span className="text-gray-400">Email:</span> {user.email}</p>
                  <p><span className="text-gray-400">Member since:</span> {formatDate(user.created_at)}</p>
                </div>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-3">Account Stats</h3>
                <div className="space-y-2 text-gray-300">
                  <p><span className="text-gray-400">Total Orders:</span> {orders.length}</p>
                  <p><span className="text-gray-400">Total Spent:</span> {formatPrice(orders.reduce((sum, order) => sum + order.total, 0))}</p>
                  <p><span className="text-gray-400">Last Order:</span> {orders.length > 0 ? formatDate(orders[0].created_at) : 'No orders yet'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Package className="h-6 w-6" />
              Order History
            </h2>
            {orders.length > 0 && (
              <p className="text-gray-400">Showing {orders.length} order{orders.length !== 1 ? 's' : ''}</p>
            )}
          </div>

          {error && (
            <Card className="bg-red-900/20 border-red-800">
              <CardContent className="pt-6">
                <p className="text-red-300">{error}</p>
              </CardContent>
            </Card>
          )}

          {orders.length === 0 ? (
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="pt-6 text-center">
                <Package className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">No Orders Yet</h3>
                <p className="text-gray-400 mb-4">You haven't placed any orders yet.</p>
                <Button asChild>
                  <Link href="/projects">Browse Projects</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id} className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      {/* Order Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-white font-semibold">Order #{order.id.slice(-8).toUpperCase()}</h3>
                            <p className="text-gray-400 text-sm">{formatDate(order.created_at)}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-white font-bold text-lg">{formatPrice(order.total)}</p>
                            <Badge className={`mt-1 ${getStatusColor(order.status)}`}>
                              {order.status.toUpperCase()}
                            </Badge>
                          </div>
                        </div>

                        {/* Order Items Preview */}
                        {order.items && order.items.length > 0 && (
                          <div className="mb-3">
                            <p className="text-gray-400 text-sm mb-1">Items:</p>
                            <div className="space-y-1">
                              {order.items.slice(0, 2).map((item, index) => (
                                <p key={index} className="text-gray-300 text-sm">
                                  {item.product?.title || `Product ${item.product_id?.slice(0, 8) || 'Unknown'}`} 
                                  <span className="text-gray-500"> × {item.quantity}</span>
                                </p>
                              ))}
                              {order.items.length > 2 && (
                                <p className="text-gray-500 text-sm">+{order.items.length - 2} more items</p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Shipping Address */}
                        <div className="text-gray-400 text-sm">
                          <p className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {order.shipping_address.city}, {order.shipping_address.state}
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button variant="outline" size="sm" asChild className="text-white border-gray-600 hover:bg-gray-800">
                          <Link href={`/receipt/${order.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Receipt
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild className="text-white border-gray-600 hover:bg-gray-800">
                          <Link href={`/receipt/${order.id}`} onClick={() => window.print()}>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Link>
                        </Button>
                      </div>
                    </div>

                    {/* Payment Details */}
                    {order.razorpay_order_id && (
                      <div className="mt-4 pt-4 border-t border-gray-700">
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                          <CreditCard className="h-4 w-4" />
                          <span>Payment ID: {order.razorpay_order_id}</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Button variant="outline" asChild className="text-white border-gray-600 hover:bg-gray-800">
                <Link href="/projects">
                  <Package className="h-4 w-4 mr-2" />
                  Browse Projects
                </Link>
              </Button>
              <Button variant="outline" asChild className="text-white border-gray-600 hover:bg-gray-800">
                <Link href="/cart">
                  <Package className="h-4 w-4 mr-2" />
                  View Cart
                </Link>
              </Button>
              <Button variant="outline" asChild className="text-white border-gray-600 hover:bg-gray-800">
                <Link href="/contact">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Support
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 