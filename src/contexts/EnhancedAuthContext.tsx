// Enhanced AuthContext for cross-platform support
'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase'

interface UserProfile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  role: 'user' | 'admin' | 'mentor' | string
  subscription_tier?: 'free' | 'premium' | 'enterprise' | string
  preferences?: Record<string, unknown>
  platform_access?: string[]
  last_active?: string
  created_at?: string
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  hasRole: (role: string) => boolean;
  hasPlatformAccess: (platform: string) => boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  refreshProfile: async () => {},
  hasRole: () => false,
  hasPlatformAccess: () => false,
})

export const useEnhancedAuth = () => useContext(AuthContext)

export function EnhancedAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchProfile = useCallback(async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      if (error) {
        return null
      }
      return data as unknown as UserProfile
    } catch {
      return null
    }
  }, [supabase])

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }: { data: { session: any } }) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)
      if (currentUser) {
        const userProfile = await fetchProfile(currentUser.id)
        setProfile(userProfile)
      }
      setLoading(false)
    }).catch((error: any) => {
      console.error('Error getting initial session:', error);
      setLoading(false);
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event: any, session: any) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)
      if (currentUser) {
        const userProfile = await fetchProfile(currentUser.id)
        setProfile(userProfile)
      } else {
        setProfile(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth, fetchProfile])

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

  return (
    <AuthContext.Provider value={{ user, profile, loading, refreshProfile, hasRole, hasPlatformAccess }}>
      {children}
    </AuthContext.Provider>
  )
}
