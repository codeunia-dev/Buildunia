import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch all orders for the user
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (ordersError) {
      console.error('Error fetching user orders:', ordersError)
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
    }

    // For each order, fetch the order items
    const ordersWithItems = await Promise.all(
      (orders || []).map(async (order) => {
        const { data: items, error: itemsError } = await supabase
          .from('order_items')
          .select(`
            *,
            product:products(title, category)
          `)
          .eq('order_id', order.id)

        if (itemsError) {
          console.error('Error fetching order items:', itemsError)
        }

        return {
          ...order,
          items: items || []
        }
      })
    )

    return NextResponse.json({ 
      success: true, 
      orders: ordersWithItems 
    })

  } catch (error) {
    console.error('Error in user orders API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 