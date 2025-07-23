// TODO: Replace this auth logic with Codeunia SSO/auth integration in production.
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase'

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  signOut: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // get initial session here 
    const getInitialSession = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getInitialSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const isAdmin = user?.user_metadata?.role === 'admin'

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    // Optionally, you can redirect to the sign-in page here if desired
    // window.location.href = '/auth/signin';
  }

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
