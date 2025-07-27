import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';
import { createRazorpayOrder, SUPPORTED_CURRENCIES, type SupportedCurrency } from '@/lib/razorpay';
import { csrfMiddleware } from '@/lib/csrf';
import { safeLog } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    // CSRF protection
    const csrfResult = await csrfMiddleware(request);
    if (csrfResult) {
      return csrfResult;
    }

    safeLog.log('Starting order creation...');

    // Parse request body
    const body = await request.json().catch(() => ({}));
    safeLog.log('Request body parsed:', { 
      items: body.items?.length || 0, 
      total: body.total, 
      customerInfo: !!body.customerInfo 
    });

    const { items, total, customerInfo, isMentorship, selectedMentor } = body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Items are required' }, { status: 400 });
    }

    if (!total || typeof total !== 'number' || total <= 0) {
      return NextResponse.json({ error: 'Valid total amount is required' }, { status: 400 });
    }

    if (!customerInfo || typeof customerInfo !== 'object') {
      return NextResponse.json({ error: 'Customer information is required' }, { status: 400 });
    }

    // Get authenticated user
    const supabase = await createServerClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    safeLog.log('Supabase client created');
    safeLog.log('User authenticated:', user.email);

    const { name, email, phone, address, city, state, pincode, country } = customerInfo;

    // Validate required fields
    const requiredFields = ['name', 'email', 'phone', 'address', 'city', 'state', 'pincode', 'country'];
    for (const field of requiredFields) {
      if (!customerInfo[field] || typeof customerInfo[field] !== 'string' || customerInfo[field].trim() === '') {
        return NextResponse.json({ error: `Missing or invalid ${field}` }, { status: 400 });
      }
    }

    // Create order data
    const orderData = {
      user_id: user.id,
      total: total,
      status: 'pending',
      platform: 'buildunia',
      shipping_address: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
        country: country.trim()
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    safeLog.log('Creating order in database...');
    safeLog.log('Order data:', JSON.stringify(orderData, null, 2));

    // Insert order into database
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([orderData])
      .select();

    if (orderError) {
      safeLog.error('Order creation error:', orderError);
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }

    if (!order || order.length === 0) {
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }

    safeLog.log('Order created successfully:', order[0].id);

    // Create order items
    const orderItems = items.map((item: any) => ({
      order_id: order[0].id,
      product_id: item.id,
      quantity: item.quantity || 1,
      price: item.price,
      option_selected: item.option || 'full',
      created_at: new Date().toISOString()
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      safeLog.error('Order items creation error:', itemsError);
      return NextResponse.json({ error: 'Failed to create order items' }, { status: 500 });
    }

    safeLog.log('Order items created successfully');

    // Create Razorpay order with enhanced currency support
    safeLog.log('Creating Razorpay order...');
    
    // Use INR as default currency (can be made configurable)
    const currency: SupportedCurrency = 'INR';
    
    try {
      const razorpayOrder = await createRazorpayOrder(total, currency, `order_${Date.now()}`);

      if (!razorpayOrder) {
        return NextResponse.json({ error: 'Failed to create payment order' }, { status: 500 });
      }

      // Return order details with payment information
      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      safeLog.log('Razorpay key from env:', razorpayKey ? 'SET' : 'NOT SET');
      safeLog.log('Key length:', razorpayKey ? razorpayKey.length : 0);

      return NextResponse.json({
        success: true,
        order: {
          id: order[0].id,
          total: order[0].total,
          status: order[0].status,
          razorpay_order_id: razorpayOrder.id,
          key: razorpayKey,
          currency: currency,
          amount: razorpayOrder.amount,
          receipt: razorpayOrder.receipt,
          supported_currencies: Object.keys(SUPPORTED_CURRENCIES)
        }
      });
    } catch (razorpayError) {
      safeLog.error('Razorpay order creation failed:', razorpayError);
      
      // Update order status to failed
      await supabase
        .from('orders')
        .update({ 
          status: 'failed', 
          updated_at: new Date().toISOString() 
        })
        .eq('id', order[0].id);
      
      return NextResponse.json({ 
        error: 'Payment gateway error. Please try again.',
        details: razorpayError instanceof Error ? razorpayError.message : 'Unknown error'
      }, { status: 500 });
    }

  } catch (error) {
    safeLog.error('Order creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 