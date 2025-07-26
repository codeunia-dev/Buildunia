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
  title: string
  description: string
  image_url: string
  platform: 'codeunia' | 'buildunia'
  category: string
  difficulty: string
  duration: string
  price: number // base price (for backward compatibility)
  prices: {
    full: number
    hardware: number
    code: number
    mentorship: number
    hardware_mentorship: number
    code_mentorship: number
  }
  features: string[]
  requirements: string[]
  created_at: string
  updated_at: string
}

// New Product interface for Buildunia
export interface Product {
  id: string
  title: string
  description: string
  image_url: string
  platform: 'buildunia' // always 'buildunia'
  category: string
  difficulty: string
  duration: string
  price: number // base price (for backward compatibility)
  prices: {
    full: number
    hardware: number
    code: number
    mentorship: number
    hardware_mentorship: number
    code_mentorship: number
  }
  features: string[]
  requirements: string[]
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  email: string
  full_name?: string
  platform: 'codeunia' | 'buildunia'
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  user_id: string | null
  total: number
  status: 'pending' | 'paid' | 'shipped' | 'delivered'
  platform: 'codeunia' | 'buildunia'
  shipping_address: {
    name: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    pincode: string
  }
  digipin: string
  created_at: string
  updated_at: string
  items: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string // Changed from project_id for Buildunia
  quantity: number
  price: number
  option_selected: string
  created_at: string
}

export interface CartItem {
  project: Project | Product // Can be either Project (Codeunia) or Product (Buildunia)
  quantity: number
}

export interface Mentorship {
  id: string
  user_id: string
  title: string
  description: string
  duration: string
  price: number
  platform: 'codeunia' | 'buildunia'
  created_at: string
  updated_at: string
}
