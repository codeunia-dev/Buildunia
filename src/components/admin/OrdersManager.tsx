'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ShoppingCart, Search, DollarSign, Package, Calendar, User } from 'lucide-react'
import { createClient } from '@/lib/supabase'

interface Order {
  id: string
  user_id: string | null
  total: number
  status: string
  platform: string
  shipping_address: any
  digipin?: string
  created_at: string
  updated_at: string
  user?: {
    email?: string
    full_name?: string
  }
  items?: OrderItem[]
}

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

export default function OrdersManager() {
  const supabase = createClient();
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [platformFilter, setPlatformFilter] = useState('all')

  const filterOrders = useCallback(() => {
    let filtered = orders;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.user?.email && order.user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (order.user?.full_name && order.user.full_name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Filter by platform
    if (platformFilter !== 'all') {
      filtered = filtered.filter(order => order.platform === platformFilter);
    }

    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, platformFilter, orders]);

  const fetchOrders = useCallback(async () => {
    try {
      console.log('Fetching orders...')
      
      // Fetch orders with user information
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          user:profiles!orders_user_id_fkey(email, full_name)
        `)
        .order('created_at', { ascending: false })

      if (ordersError) throw ordersError

      console.log('Fetched orders:', ordersData?.length || 0, 'orders')

      // Fetch order items for each order
      const ordersWithItems = await Promise.all(
        (ordersData || []).map(async (order) => {
          const { data: itemsData, error: itemsError } = await supabase
            .from('order_items')
            .select(`
              *,
              product:products(title, category)
            `)
            .eq('order_id', order.id as string)

          if (itemsError) {
            console.error('Error fetching items for order', order.id, itemsError)
            return { ...order, items: [] }
          }

          return { ...order, items: itemsData || [] }
        })
      )

      setOrders(ordersWithItems as unknown as Order[])
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setIsLoading(false)
    }
  }, [supabase]);

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders]);

  useEffect(() => {
    filterOrders()
  }, [filterOrders]);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId)

      if (error) throw error
      await fetchOrders()
    } catch (error) {
      console.error('Error updating order status:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      case 'shipped': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'buildunia': return 'bg-purple-100 text-purple-800'
      case 'codeunia': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0)
  const totalOrders = orders.length
  const paidOrders = orders.filter(order => order.status === 'paid').length
  const pendingOrders = orders.filter(order => order.status === 'pending').length

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="text-gray-500">Loading orders...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Orders Management</h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>
      </div>

      {/* Order Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{totalOrders}</div>
                <div className="text-xs text-gray-500">Total Orders</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-500" />
              <div>
                <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
                <div className="text-xs text-gray-500">Total Revenue</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-green-500" />
              <div>
                <div className="text-2xl font-bold">{paidOrders}</div>
                <div className="text-xs text-gray-500">Paid Orders</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-yellow-500" />
              <div>
                <div className="text-2xl font-bold">{pendingOrders}</div>
                <div className="text-xs text-gray-500">Pending Orders</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md bg-white"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="shipped">Shipped</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <select
          value={platformFilter}
          onChange={(e) => setPlatformFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md bg-white"
        >
          <option value="all">All Platforms</option>
          <option value="buildunia">Buildunia</option>
          <option value="codeunia">Codeunia</option>
        </select>
      </div>

      {/* Orders List */}
      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
          <CardDescription>
            Manage orders and track revenue
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredOrders.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">
                {searchTerm || statusFilter !== 'all' || platformFilter !== 'all' ? 'No orders found' : 'No orders yet'}
              </h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== 'all' || platformFilter !== 'all' ? 'Try adjusting your filters.' : 'Orders will appear here when customers make purchases.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">Order #{order.id.slice(0, 8)}</h4>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                          <Badge className={getPlatformColor(order.platform)}>
                            {order.platform}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          {order.user?.email || 'Guest User'}
                          {order.user?.full_name && ` (${order.user.full_name})`}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-bold">₹{order.total}</div>
                      <div className="text-sm text-gray-500">
                        {order.items?.length || 0} items
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  {order.items && order.items.length > 0 && (
                    <div className="mt-3 pl-4 border-l-2 border-gray-200">
                      <h5 className="text-sm font-medium mb-2">Items:</h5>
                      <div className="space-y-1">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span>
                              {item.product?.title || `Product ${item.product_id.slice(0, 8)}`}
                              {item.option_selected && item.option_selected !== 'full' && (
                                <span className="text-gray-500 ml-1">({item.option_selected})</span>
                              )}
                            </span>
                            <span className="text-gray-600">
                              {item.quantity}x ₹{item.price}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Shipping Address */}
                  {order.shipping_address && (
                    <div className="mt-3 pl-4 border-l-2 border-gray-200">
                      <h5 className="text-sm font-medium mb-2">Shipping Address:</h5>
                      <div className="text-sm text-gray-600">
                        {order.shipping_address.name && <div>{order.shipping_address.name}</div>}
                        {order.shipping_address.address && <div>{order.shipping_address.address}</div>}
                        {order.shipping_address.city && order.shipping_address.state && (
                          <div>{order.shipping_address.city}, {order.shipping_address.state}</div>
                        )}
                        {order.shipping_address.pincode && <div>Pincode: {order.shipping_address.pincode}</div>}
                        {order.digipin && <div>DIGIPIN: {order.digipin}</div>}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-3 pt-3 border-t">
                    {order.status === 'pending' && (
                      <Button
                        size="sm"
                        onClick={() => updateOrderStatus(order.id, 'paid')}
                      >
                        Mark as Paid
                      </Button>
                    )}
                    {order.status === 'paid' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateOrderStatus(order.id, 'shipped')}
                      >
                        Mark as Shipped
                      </Button>
                    )}
                    {order.status !== 'cancelled' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateOrderStatus(order.id, 'cancelled')}
                      >
                        Cancel Order
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 
 
 
 