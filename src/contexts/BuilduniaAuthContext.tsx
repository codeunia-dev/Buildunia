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
  signInWithOAuth: (provider: 'google' | 'github') => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  hasCodeuniaAccess: boolean;
  refreshSession: () => Promise<void>;
}

const BuilduniaAuthContext = createContext<BuilduniaAuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  platform: 'buildunia',
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signInWithOAuth: async () => ({ error: null }),
  signOut: async () => {},
  hasCodeuniaAccess: false,
  refreshSession: async () => {},
})

export const useBuilduniaAuth = () => useContext(BuilduniaAuthContext)

export function BuilduniaAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [hasCodeuniaAccess, setHasCodeuniaAccess] = useState(false)
  const supabase = createClient()

  const refreshSession = async () => {
    try {
      // First, try to get the current session without refreshing
      const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        console.log('Session error:', sessionError.message)
        setUser(null)
        setHasCodeuniaAccess(false)
        setLoading(false)
        return
      }
      
      if (!currentSession) {
        console.log('No current session found, clearing user state')
        setUser(null)
        setHasCodeuniaAccess(false)
        setLoading(false)
        return
      }

      // Only try to refresh if we have a valid session with refresh token
      if (currentSession.refresh_token) {
        const { data: { session }, error } = await supabase.auth.refreshSession(currentSession)
        
        if (error) {
          console.log('Error refreshing session:', error.message)
          // Clear user state for any refresh error
          setUser(null)
          setHasCodeuniaAccess(false)
          setLoading(false)
        } else if (session?.user) {
          console.log('Session refreshed successfully for:', session.user.email)
          setUser(session.user)
          const platform = session.user.user_metadata?.platform
          setHasCodeuniaAccess(platform === 'codeunia' || platform === 'buildunia')
          setLoading(false)
        } else {
          console.log('No session available after refresh')
          setUser(null)
          setHasCodeuniaAccess(false)
          setLoading(false)
        }
      } else {
        // Use current session if no refresh token
        setUser(currentSession.user)
        const platform = currentSession.user.user_metadata?.platform
        setHasCodeuniaAccess(platform === 'codeunia' || platform === 'buildunia')
        setLoading(false)
      }
    } catch (error: any) {
      console.log('Error in refreshSession:', error.message)
      // For any error, clear the state and stop loading
      setUser(null)
      setHasCodeuniaAccess(false)
      setLoading(false)
    }
  }

  useEffect(() => {
    // Get initial user
    const getInitialUser = async () => {
      try {
        // First check if we have a session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.log('Session error on initial load:', sessionError.message)
          setUser(null)
          setHasCodeuniaAccess(false)
          setLoading(false)
          return
        }
        
        if (session?.user) {
          console.log('Initial session found for:', session.user.email)
          setUser(session.user)
          const platform = session.user.user_metadata?.platform
          setHasCodeuniaAccess(platform === 'codeunia' || platform === 'buildunia')
          setLoading(false)
        } else {
          console.log('No initial session found')
          setUser(null)
          setHasCodeuniaAccess(false)
          setLoading(false)
        }
      } catch (error: any) {
        console.log('Error in getInitialUser:', error.message)
        setUser(null)
        setHasCodeuniaAccess(false)
        setLoading(false)
      }
    }

    getInitialUser()

    // Listen to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: string, session: any) => {
        console.log('Auth state change:', event, session?.user?.email)
        
        if (event === 'SIGNED_OUT') {
          setUser(null)
          setHasCodeuniaAccess(false)
          setLoading(false)
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setUser(session?.user ?? null)
          
          if (session?.user) {
            const platform = session.user.user_metadata?.platform
            setHasCodeuniaAccess(platform === 'codeunia' || platform === 'buildunia')
          }
          setLoading(false)
        } else if (event === 'INITIAL_SESSION') {
          setUser(session?.user ?? null)
          
          if (session?.user) {
            const platform = session.user.user_metadata?.platform
            setHasCodeuniaAccess(platform === 'codeunia' || platform === 'buildunia')
          }
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const isAdmin = Boolean(user?.user_metadata?.role === 'admin')

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

  const signInWithOAuth = async (provider: 'google' | 'github') => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: typeof window !== 'undefined'
            ? `${window.location.origin}/auth/callback`
            : undefined,
        },
      })

      if (error) {
        return { error }
      }

      return { error: null }
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
      signInWithOAuth,
      signOut,
      hasCodeuniaAccess,
      refreshSession
    }}>
      {children}
    </BuilduniaAuthContext.Provider>
  )
} 