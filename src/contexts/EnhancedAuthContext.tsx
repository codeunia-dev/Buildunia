// Enhanced AuthContext for future cross-platform support
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface UserProfile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  role: 'user' | 'admin' | 'mentor'
  subscription_tier: 'free' | 'premium' | 'enterprise'
  preferences: {
    theme?: 'light' | 'dark' | 'system'
    notifications?: boolean
    newsletter?: boolean
    mentorship_available?: boolean
  }
  platform_access: string[]
  last_active?: string
  created_at: string
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<unknown>;
  signUp: (email: string, password: string, metadata?: Record<string, unknown>) => Promise<unknown>;
  signOut: () => Promise<unknown>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<unknown>;
  refreshProfile: () => Promise<void>;
  hasRole: (role: string) => boolean;
  hasPlatformAccess: (platform: string) => boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  updateProfile: async () => {},
  refreshProfile: async () => {},
  hasRole: () => false,
  hasPlatformAccess: () => false,
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  // Create user session for tracking
  const createUserSession = async (userId: string) => {
    try {
      await supabase.from('user_sessions').insert({
        user_id: userId,
        platform: 'buildunia',
        session_data: {
          login_time: new Date().toISOString(),
          user_agent: navigator.userAgent,
        },
        ip_address: await fetch('https://api.ipify.org?format=json')
          .then(res => res.json())
          .then(data => data.ip)
          .catch(() => null),
      })
    } catch (error) {
      console.error('Error creating user session:', error)
    }
  }

  // Fetch user profile
  const fetchProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        return null
      }

      return data as UserProfile
    } catch (error) {
      console.error('Error fetching profile:', error)
      return null
    }
  }

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)
      
      if (currentUser) {
        const userProfile = await fetchProfile(currentUser.id)
        setProfile(userProfile)
        await createUserSession(currentUser.id)
      }
      
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)

      if (currentUser && event === 'SIGNED_IN') {
        const userProfile = await fetchProfile(currentUser.id)
        setProfile(userProfile)
        await createUserSession(currentUser.id)
      } else if (event === 'SIGNED_OUT') {
        setProfile(null)
      }

      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const result = await supabase.auth.signInWithPassword({ email, password })
    
    if (result.data.user) {
      const userProfile = await fetchProfile(result.data.user.id)
      setProfile(userProfile)
    }
    
    return result
  }

  const signUp = async (email: string, password: string, metadata?: Record<string, unknown>) => {
    const result = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: metadata || {}
      }
    })
    
    return result
  }

  const signOut = async () => {
    const result = await supabase.auth.signOut()
    setProfile(null)
    return result
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { error: 'Not authenticated' }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()

      if (error) throw error

      setProfile(data as UserProfile)
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const refreshProfile = async () => {
    if (!user) return

    const userProfile = await fetchProfile(user.id)
    setProfile(userProfile)
  }

  const hasRole = (role: string): boolean => {
    return profile?.role === role
  }

  const hasPlatformAccess = (platform: string): boolean => {
    return profile?.platform_access?.includes(platform) ?? false
  }

  const value = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    refreshProfile,
    hasRole,
    hasPlatformAccess,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
