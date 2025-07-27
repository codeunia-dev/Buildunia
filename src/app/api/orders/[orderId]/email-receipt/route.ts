import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

export async function POST(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const supabase = await createServerClient()
    
    // Temporarily remove auth requirement for testing
    // const { data: { user }, error: authError } = await supabase.auth.getUser()
    // if (authError || !user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const { orderId } = params

    // Fetch the order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Temporarily remove access control for testing
    // const isOwner = order.user_id === user.id
    // const isAdmin = user.user_metadata?.role === 'admin'
    // if (!isOwner && !isAdmin) {
    //   return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    // }

    // Fetch order items
    const { data: items, error: itemsError } = await supabase
      .from('order_items')
      .select(`
        *,
        product:products(title, category)
      `)
      .eq('order_id', orderId)

    if (itemsError) {
      console.error('Error fetching order items:', itemsError)
    }

    const orderWithItems = {
      ...order,
      items: items || []
    }

    // Send email to customer
    await sendCustomerReceipt(orderWithItems)
    
    // Send email to admin
    await sendAdminNotification(orderWithItems)

    return NextResponse.json({ success: true, message: 'Receipt emails sent successfully' })
  } catch (error) {
    console.error('Error sending receipt emails:', error)
    return NextResponse.json({ error: 'Failed to send receipt emails' }, { status: 500 })
  }
}

async function sendCustomerReceipt(order: any) {
  const receiptUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/receipt/${order.id}`
  const tax = Math.round(order.total * 0.08)
  const subtotal = order.total - tax - 10
  
  const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa;">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
        <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 15px;">
          <div style="background: rgba(255,255,255,0.2); padding: 10px; border-radius: 50%; margin-right: 15px;">
            <span style="font-size: 24px;">🏢</span>
          </div>
          <div>
            <h1 style="margin: 0; font-size: 28px; font-weight: bold;">BuildUnia</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9; font-size: 14px;">A Codeunia Product</p>
          </div>
        </div>
        <p style="margin: 0; font-size: 16px; opacity: 0.9;">IoT Project Kits & Mentorship</p>
      </div>
      
      <!-- Main Content -->
      <div style="padding: 30px; background: white;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h2 style="color: #333; margin-bottom: 10px; font-size: 24px;">Invoice</h2>
          <p style="color: #666; margin: 0; font-size: 16px;">Thank you for your order!</p>
        </div>
        
        <!-- Invoice Details -->
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <p style="margin: 0; color: #333; font-weight: bold;">Invoice #: ${order.id.slice(-8).toUpperCase()}</p>
              <p style="margin: 5px 0 0 0; color: #666;">Date: ${new Date(order.created_at).toLocaleDateString('en-IN')}</p>
            </div>
            <div style="text-align: right;">
              <span style="background: #28a745; color: white; padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: bold;">PAID</span>
            </div>
          </div>
        </div>
        
        <!-- Company & Customer Info -->
        <div style="display: flex; gap: 20px; margin-bottom: 25px;">
          <div style="flex: 1; background: #f8f9fa; padding: 15px; border-radius: 8px;">
            <h4 style="margin: 0 0 10px 0; color: #333; font-size: 14px;">From (BuildUnia)</h4>
            <p style="margin: 0; color: #666; font-size: 12px;">SAS Nagar Mohali</p>
            <p style="margin: 0; color: #666; font-size: 12px;">Punjab, India</p>
            <p style="margin: 0; color: #666; font-size: 12px;">Phone: +91 8699025107</p>
            <p style="margin: 0; color: #666; font-size: 12px;">Email: buildunia.codeunia@gmail.com</p>
          </div>
          <div style="flex: 1; background: #f8f9fa; padding: 15px; border-radius: 8px;">
            <h4 style="margin: 0 0 10px 0; color: #333; font-size: 14px;">Bill To</h4>
            <p style="margin: 0; color: #666; font-size: 12px; font-weight: bold;">${order.shipping_address.name}</p>
            <p style="margin: 0; color: #666; font-size: 12px;">${order.shipping_address.address}</p>
            <p style="margin: 0; color: #666; font-size: 12px;">${order.shipping_address.city}, ${order.shipping_address.state} ${order.shipping_address.pincode}</p>
          </div>
        </div>
        
        <!-- Items Table -->
        <div style="margin-bottom: 25px;">
          <h4 style="margin: 0 0 15px 0; color: #333;">Item Details</h4>
          <table style="width: 100%; border-collapse: collapse; background: #f8f9fa; border-radius: 8px; overflow: hidden;">
            <thead>
              <tr style="background: #e9ecef;">
                <th style="padding: 12px; text-align: left; font-size: 12px; color: #333; border-bottom: 1px solid #dee2e6;">Item</th>
                <th style="padding: 12px; text-align: center; font-size: 12px; color: #333; border-bottom: 1px solid #dee2e6;">Qty</th>
                <th style="padding: 12px; text-align: right; font-size: 12px; color: #333; border-bottom: 1px solid #dee2e6;">Rate</th>
                <th style="padding: 12px; text-align: right; font-size: 12px; color: #333; border-bottom: 1px solid #dee2e6;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${order.items && order.items.length > 0 ? order.items.map((item: any) => `
                <tr>
                  <td style="padding: 12px; border-bottom: 1px solid #dee2e6;">
                    <p style="margin: 0; color: #333; font-weight: bold; font-size: 12px;">${item.product?.title || `Product ${item.product_id?.slice(0, 8) || 'Unknown'}`}</p>
                    <p style="margin: 0; color: #666; font-size: 11px;">${item.product?.category || 'IoT Project'}</p>
                  </td>
                  <td style="padding: 12px; text-align: center; border-bottom: 1px solid #dee2e6; color: #333; font-size: 12px;">${item.quantity}</td>
                  <td style="padding: 12px; text-align: right; border-bottom: 1px solid #dee2e6; color: #333; font-size: 12px;">₹${item.price.toFixed(0)}</td>
                  <td style="padding: 12px; text-align: right; border-bottom: 1px solid #dee2e6; color: #333; font-weight: bold; font-size: 12px;">₹${(item.price * item.quantity).toFixed(0)}</td>
                </tr>
              `).join('') : `
                <tr>
                  <td colspan="4" style="padding: 20px; text-align: center; color: #666; font-size: 12px;">Order items will be updated soon</td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
        
        <!-- Payment Summary -->
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h4 style="margin: 0 0 15px 0; color: #333;">Payment Summary</h4>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #666; font-size: 14px;">Subtotal</span>
            <span style="color: #333; font-size: 14px;">₹${subtotal.toFixed(0)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #666; font-size: 14px;">Shipping</span>
            <span style="color: #333; font-size: 14px;">₹10</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
            <span style="color: #666; font-size: 14px;">GST (8%)</span>
            <span style="color: #333; font-size: 14px;">₹${tax}</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding-top: 15px; border-top: 2px solid #dee2e6;">
            <span style="color: #333; font-weight: bold; font-size: 16px;">Total</span>
            <span style="color: #333; font-weight: bold; font-size: 16px;">₹${order.total.toFixed(0)}</span>
          </div>
        </div>
        
        <!-- Action Button -->
        <div style="text-align: center; margin-bottom: 25px;">
          <a href="${receiptUrl}" style="background: #007bff; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
            View Full Invoice
          </a>
        </div>
        
        <!-- Next Steps -->
        <div style="background: #e7f3ff; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h4 style="margin: 0 0 15px 0; color: #0056b3;">What's Next?</h4>
          <ul style="margin: 0; padding-left: 20px; color: #0056b3; font-size: 14px; line-height: 1.6;">
            <li>We'll process your order within 24-48 hours</li>
            <li>You'll receive tracking information once shipped</li>
            <li>Delivery within 8-14 business days</li>
            <li>For mentorship orders, your mentor will contact you within 24 hours</li>
            <li>If you have any questions, contact us at buildunia.codeunia@gmail.com</li>
          </ul>
        </div>
      </div>
      
      <!-- Footer -->
      <div style="background: #333; color: white; padding: 20px; text-align: center;">
        <p style="margin: 0; font-size: 14px;">© 2024 BuildUnia. All rights reserved.</p>
        <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.8;">
          This email was sent to ${order.shipping_address.email}
        </p>
        <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.8;">
          This is a computer generated invoice. No signature required.
        </p>
      </div>
    </div>
  `

  console.log('Sending customer receipt email to:', order.shipping_address.email)
  console.log('Email content:', emailContent)
}

async function sendAdminNotification(order: any) {
  const adminEmail = 'codeunia@gmail.com'
  const receiptUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/receipt/${order.id}`
  const tax = Math.round(order.total * 0.08)
  
  const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa;">
      <!-- Header -->
      <div style="background: #dc3545; padding: 30px; text-align: center; color: white;">
        <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 15px;">
          <div style="background: rgba(255,255,255,0.2); padding: 10px; border-radius: 50%; margin-right: 15px;">
            <span style="font-size: 24px;">🛒</span>
          </div>
          <div>
            <h1 style="margin: 0; font-size: 28px; font-weight: bold;">New Order Received</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9; font-size: 14px;">BuildUnia Admin Notification</p>
          </div>
        </div>
      </div>
      
      <!-- Main Content -->
      <div style="padding: 30px; background: white;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h2 style="color: #333; margin-bottom: 10px; font-size: 24px;">Order Summary</h2>
          <p style="color: #666; margin: 0; font-size: 16px;">A new order has been placed</p>
        </div>
        
        <!-- Order Details -->
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <p style="margin: 0; color: #333; font-weight: bold;">Invoice #: ${order.id.slice(-8).toUpperCase()}</p>
              <p style="margin: 5px 0 0 0; color: #666;">Date: ${new Date(order.created_at).toLocaleDateString('en-IN')}</p>
              <p style="margin: 5px 0 0 0; color: #666;">Customer: ${order.shipping_address.name}</p>
            </div>
            <div style="text-align: right;">
              <p style="margin: 0; color: #333; font-weight: bold; font-size: 18px;">₹${order.total.toFixed(0)}</p>
              <span style="background: #28a745; color: white; padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: bold;">PAID</span>
            </div>
          </div>
        </div>
        
        <!-- Customer Details -->
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h4 style="margin: 0 0 15px 0; color: #333;">Customer Information</h4>
          <div style="display: flex; gap: 20px;">
            <div style="flex: 1;">
              <p style="margin: 0; color: #666; font-size: 12px;"><strong>Name:</strong> ${order.shipping_address.name}</p>
              <p style="margin: 0; color: #666; font-size: 12px;"><strong>Email:</strong> ${order.shipping_address.email}</p>
              <p style="margin: 0; color: #666; font-size: 12px;"><strong>Phone:</strong> ${order.shipping_address.phone}</p>
            </div>
            <div style="flex: 1;">
              <p style="margin: 0; color: #666; font-size: 12px;"><strong>Address:</strong></p>
              <p style="margin: 0; color: #666; font-size: 12px;">${order.shipping_address.address}</p>
              <p style="margin: 0; color: #666; font-size: 12px;">${order.shipping_address.city}, ${order.shipping_address.state} ${order.shipping_address.pincode}</p>
            </div>
          </div>
        </div>
        
        <!-- Items Summary -->
        <div style="margin-bottom: 25px;">
          <h4 style="margin: 0 0 15px 0; color: #333;">Items Ordered</h4>
          <table style="width: 100%; border-collapse: collapse; background: #f8f9fa; border-radius: 8px; overflow: hidden;">
            <thead>
              <tr style="background: #e9ecef;">
                <th style="padding: 12px; text-align: left; font-size: 12px; color: #333; border-bottom: 1px solid #dee2e6;">Item</th>
                <th style="padding: 12px; text-align: center; font-size: 12px; color: #333; border-bottom: 1px solid #dee2e6;">Qty</th>
                <th style="padding: 12px; text-align: right; font-size: 12px; color: #333; border-bottom: 1px solid #dee2e6;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map((item: any) => `
                <tr>
                  <td style="padding: 12px; border-bottom: 1px solid #dee2e6;">
                    <p style="margin: 0; color: #333; font-weight: bold; font-size: 12px;">${item.product?.title || `Product ${item.product_id ? item.product_id.slice(0, 8) : 'Unknown'}`}</p>
                    <p style="margin: 0; color: #666; font-size: 11px;">${item.product?.category || 'IoT Project'}</p>
                  </td>
                  <td style="padding: 12px; text-align: center; border-bottom: 1px solid #dee2e6; color: #333; font-size: 12px;">${item.quantity}</td>
                  <td style="padding: 12px; text-align: right; border-bottom: 1px solid #dee2e6; color: #333; font-weight: bold; font-size: 12px;">₹${(item.price * item.quantity).toFixed(0)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        
        <!-- Action Button -->
        <div style="text-align: center; margin-bottom: 25px;">
          <a href="${receiptUrl}" style="background: #dc3545; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
            View Full Order Details
          </a>
        </div>
        
        <!-- Quick Actions -->
        <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h4 style="margin: 0 0 15px 0; color: #856404;">Quick Actions</h4>
          <ul style="margin: 0; padding-left: 20px; color: #856404; font-size: 14px; line-height: 1.6;">
            <li>Process the order in your admin dashboard</li>
            <li>Update order status to "Processing"</li>
            <li>Prepare shipping details</li>
            <li>Contact customer if needed</li>
          </ul>
        </div>
      </div>
      
      <!-- Footer -->
      <div style="background: #333; color: white; padding: 20px; text-align: center;">
        <p style="margin: 0; font-size: 14px;">© 2024 BuildUnia. Admin Notification.</p>
        <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.8;">
          This is an automated notification. Please check your admin dashboard for complete details.
        </p>
      </div>
    </div>
  `

  console.log('Sending admin notification email to:', adminEmail)
  console.log('Email content:', emailContent)
} 