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
  refreshSession: () => Promise<void>;
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
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      
      if (!currentSession) {
        console.log('No current session found, clearing user state')
        setUser(null)
        setHasCodeuniaAccess(false)
        setLoading(false)
        return
      }

      // Only try to refresh if we have a session
      const { data: { session }, error } = await supabase.auth.refreshSession()
      
      if (error) {
        console.error('Error refreshing session:', error)
        // Handle specific error types
        if (error.message.includes('refresh_token_not_found') || 
            error.message.includes('Invalid Refresh Token') ||
            error.message.includes('Auth session missing')) {
          console.log('Session invalid or missing, clearing user state')
          setUser(null)
          setHasCodeuniaAccess(false)
          setLoading(false)
        }
      } else if (session?.user) {
        console.log('Session refreshed successfully for:', session.user.email)
        setUser(session.user)
        const platform = session.user.user_metadata?.platform
        setHasCodeuniaAccess(platform === 'codeunia' || platform === 'buildunia')
        setLoading(false)
      } else {
        // No session available
        console.log('No session available after refresh')
        setUser(null)
        setHasCodeuniaAccess(false)
        setLoading(false)
      }
    } catch (error: any) {
      console.error('Error refreshing session:', error)
      // Handle AuthSessionMissingError specifically
      if (error.message?.includes('Auth session missing')) {
        console.log('Auth session missing error caught, clearing user state')
        setUser(null)
        setHasCodeuniaAccess(false)
        setLoading(false)
      } else {
        // For other errors, also clear the state
        setUser(null)
        setHasCodeuniaAccess(false)
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    // Get initial user
    const getInitialUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        
        if (error) {
          console.error('Error getting initial user:', error)
          // Try to refresh the session first for specific errors
          if (error.message.includes('refresh_token_not_found') || 
              error.message.includes('Invalid Refresh Token') ||
              error.message.includes('Auth session missing')) {
            console.log('Attempting to refresh session...')
            await refreshSession()
          } else {
            // For other errors, just set loading to false
            setLoading(false)
          }
        } else {
          console.log('Initial user loaded:', user?.email)
          setUser(user)
          
          if (user) {
            // Check if user has Codeunia access (simplified for now)
            const platform = user.user_metadata?.platform
            setHasCodeuniaAccess(platform === 'codeunia' || platform === 'buildunia')
          }
          setLoading(false)
        }
      } catch (error: any) {
        console.error('Error getting initial user:', error)
        // Handle AuthSessionMissingError specifically
        if (error.message?.includes('Auth session missing')) {
          console.log('Auth session missing error in initial load, clearing state')
          setUser(null)
          setHasCodeuniaAccess(false)
          setLoading(false)
        } else {
          setLoading(false)
        }
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
      hasCodeuniaAccess,
      refreshSession
    }}>
      {children}
    </BuilduniaAuthContext.Provider>
  )
} 