import { createBrowserClient } from '@supabase/ssr';

// Create a singleton instance to avoid multiple GoTrueClient instances
let supabaseInstance: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  if (!supabaseInstance) {
    // Validate environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase environment variables');
      throw new Error('Missing Supabase environment variables');
    }

    supabaseInstance = createBrowserClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
          flowType: 'pkce'
        },
        global: {
          headers: {
            'X-Client-Info': 'buildunia-web'
          }
        }
      }
    );

    // Add error handling for session-related errors
    const originalGetUser = supabaseInstance.auth.getUser;
    supabaseInstance.auth.getUser = async () => {
      try {
        const result = await originalGetUser.call(supabaseInstance.auth);
        return result;
      } catch (error: any) {
        if (error.message?.includes('Auth session missing')) {
          // Clear invalid session data
          if (typeof window !== 'undefined') {
            localStorage.removeItem('supabase.auth.token');
            sessionStorage.removeItem('supabase.auth.token');
            localStorage.removeItem('sb-codeunia-dev.supabase.auth.token');
            sessionStorage.removeItem('sb-codeunia-dev.supabase.auth.token');
          }
          // Return empty user instead of throwing
          return { data: { user: null }, error: null };
        }
        throw error;
      }
    };

    const originalRefreshSession = supabaseInstance.auth.refreshSession;
    supabaseInstance.auth.refreshSession = async () => {
      try {
        const result = await originalRefreshSession.call(supabaseInstance.auth);
        return result;
      } catch (error: any) {
        if (error.message?.includes('Auth session missing')) {
          // Clear invalid session data
          if (typeof window !== 'undefined') {
            localStorage.removeItem('supabase.auth.token');
            sessionStorage.removeItem('supabase.auth.token');
            localStorage.removeItem('sb-codeunia-dev.supabase.auth.token');
            sessionStorage.removeItem('sb-codeunia-dev.supabase.auth.token');
          }
          // Return empty session instead of throwing
          return { data: { session: null, user: null }, error: null };
        }
        throw error;
      }
    };

    const originalGetSession = supabaseInstance.auth.getSession;
    supabaseInstance.auth.getSession = async () => {
      try {
        const result = await originalGetSession.call(supabaseInstance.auth);
        return result;
      } catch (error: any) {
        // Return empty session instead of throwing
        return { data: { session: null }, error: null };
      }
    };
  }
  return supabaseInstance;
}

// Types for our database tables
export interface Project {
  id: string
  title: string
  description: string
  image_url: string
  image_path?: string // Add support for storage bucket path
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
  image_url?: string // Keep for backward compatibility
  image_path?: string // New field for storage bucket path
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
