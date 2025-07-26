'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase'

interface BuilduniaAuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  platform: 'buildunia';
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  hasCodeuniaAccess: boolean;
}

const BuilduniaAuthContext = createContext<BuilduniaAuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  platform: 'buildunia',
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
  hasCodeuniaAccess: false,
})

export const useBuilduniaAuth = () => useContext(BuilduniaAuthContext)

export function BuilduniaAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [hasCodeuniaAccess, setHasCodeuniaAccess] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    // Get initial user
    const getInitialUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
        
        if (user) {
          // Check if user has Codeunia access (simplified for now)
          const platform = user.user_metadata?.platform
          setHasCodeuniaAccess(platform === 'codeunia' || platform === 'buildunia')
        }
      } catch (error) {
        console.error('Error getting initial user:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialUser()

    // Listen to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        
        if (session?.user) {
          const platform = session.user.user_metadata?.platform
          setHasCodeuniaAccess(platform === 'codeunia' || platform === 'buildunia')
        } else {
          setHasCodeuniaAccess(false)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const isAdmin = user?.user_metadata?.role === 'admin'

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { error }
      }

      // Update user metadata to include platform
      if (data.user) {
        await supabase.auth.updateUser({
          data: { 
            platform: 'buildunia',
            last_login: new Date().toISOString()
          }
        })
      }

      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            platform: 'buildunia',
            created_at: new Date().toISOString()
          }
        }
      })

      return { error }
    } catch (error) {
      return { error }
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <BuilduniaAuthContext.Provider value={{ 
      user, 
      loading, 
      isAdmin, 
      platform: 'buildunia',
      signIn, 
      signUp, 
      signOut,
      hasCodeuniaAccess
    }}>
      {children}
    </BuilduniaAuthContext.Provider>
  )
} 