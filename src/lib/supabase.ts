import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Create a singleton instance to avoid multiple GoTrueClient instances
let supabaseInstance: ReturnType<typeof createSupabaseClient> | null = null;

export function createClient() {
  if (!supabaseInstance) {
    supabaseInstance = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
  }
  return supabaseInstance;
}

// Types for our database tables
export interface Project {
  id: string
  name: string
  description: string
  price: number // base price (for backward compatibility)
  prices: {
    complete: number
    hardware: number
    mentorship: number
    mentorship_hardware: number
    other: number
  }
  image_url: string
  image_path?: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  category: string
  components: string[]
  skills: string[]
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  created_at: string
}

export interface Order {
  id: string
  user_id: string
  total: number
  status: 'pending' | 'paid' | 'shipped' | 'delivered'
  created_at: string
  items: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  project_id: string
  quantity: number
  price: number
}

export interface CartItem {
  project: Project
  quantity: number
}
