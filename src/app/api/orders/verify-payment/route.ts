import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';
import { verifyPaymentSignature } from '@/lib/razorpay';
import { csrfMiddleware } from '@/lib/csrf';

export async function POST(request: NextRequest) {
  try {
    // Apply CSRF protection
    const csrfResult = await csrfMiddleware(request);
    if (csrfResult) {
      return csrfResult;
    }

    console.log('Payment verification started...');
    
    const body = await request.json();
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      orderId 
    } = body;

    console.log('Payment verification data:', {
      razorpay_order_id,
      razorpay_payment_id,
      orderId,
      has_signature: !!razorpay_signature
    });

    const supabase = await createServerClient();
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError) {
      console.error('Authentication error in payment verification:', authError);
      return NextResponse.json({ 
        error: 'Authentication failed', 
        details: authError.message 
      }, { status: 401 })
    }

    if (!user) {
      console.error('No user found in payment verification');
      return NextResponse.json({ 
        error: 'User not authenticated' 
      }, { status: 401 })
    }

    console.log('User authenticated for payment verification:', user.email);

    // Verify payment signature
    const isValidSignature = verifyPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    console.log('Payment signature verification result:', isValidSignature);

    if (!isValidSignature) {
      console.error('Invalid payment signature');
      
      // Update order status to failed
      await supabase
        .from('orders')
        .update({
          status: 'failed',
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .eq('user_id', user.id);
      
      return NextResponse.json({ 
        error: 'Invalid payment signature',
        details: 'Payment signature verification failed'
      }, { status: 400 });
    }

    // Update order status to paid
    const { data: order, error: updateError } = await supabase
      .from('orders')
      .update({
        status: 'paid',
        razorpay_order_id: razorpay_order_id,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .eq('user_id', user.id) // Ensure user owns this order
      .select()
      .single();

    if (updateError) {
      console.error('Error updating order:', updateError);
      return NextResponse.json({ 
        error: 'Failed to update order',
        details: updateError.message
      }, { status: 500 });
    }

    console.log('Order updated successfully:', order.id);

    // Send receipt emails
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/orders/${orderId}/email-receipt`, {
        method: 'POST',
      });
      console.log('Receipt email sent successfully');
    } catch (emailError) {
      console.error('Error sending receipt emails:', emailError);
      // Don't fail the payment verification if email fails
    }

    console.log('Payment verification completed successfully');

    return NextResponse.json({
      success: true,
      orderId: order.id,
      payment_status: 'completed',
      message: 'Payment verified successfully'
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    
    // Try to update order status to failed
    try {
      const supabase = await createServerClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Get orderId from request body
        const body = await request.json().catch(() => ({}));
        const orderId = body.orderId;
        
        if (orderId) {
          await supabase
            .from('orders')
            .update({
              status: 'failed',
              updated_at: new Date().toISOString()
            })
            .eq('id', orderId)
            .eq('user_id', user.id);
        }
      }
    } catch (updateError) {
      console.error('Failed to update order status to failed:', updateError);
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to verify payment',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 