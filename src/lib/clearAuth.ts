import { createClient } from '@/lib/supabase'

export async function clearAuthState() {
  const supabase = createClient()
  
  try {
    // Sign out to clear all tokens
    await supabase.auth.signOut()
    
    // Clear any stored tokens
    if (typeof window !== 'undefined') {
      localStorage.removeItem('supabase.auth.token')
      sessionStorage.removeItem('supabase.auth.token')
      localStorage.removeItem('sb-codeunia-dev.supabase.auth.token')
      sessionStorage.removeItem('sb-codeunia-dev.supabase.auth.token')
      
      // Clear all Supabase-related storage
      const keysToRemove = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.includes('supabase')) {
          keysToRemove.push(key)
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key))
      
      // Clear sessionStorage as well
      const sessionKeysToRemove = []
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i)
        if (key && key.includes('supabase')) {
          sessionKeysToRemove.push(key)
        }
      }
      sessionKeysToRemove.forEach(key => sessionStorage.removeItem(key))
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error clearing auth state:', error)
    return { error }
  }
}

export async function refreshAuthSession() {
  const supabase = createClient()
  
  try {
    // Try to refresh the session
    const { data, error } = await supabase.auth.refreshSession()
    
    if (error) {
      console.error('Error refreshing session:', error)
      // If refresh fails, clear the auth state
      await clearAuthState()
      return { error }
    }
    
    return { success: true, data }
  } catch (error) {
    console.error('Error refreshing session:', error)
    await clearAuthState()
    return { error }
  }
}

export async function recoverAuthSession() {
  const supabase = createClient()
  
  try {
    // First, try to get the current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.log('Session error detected, attempting recovery...')
      // Clear auth state and return
      await clearAuthState()
      return { error: sessionError }
    }
    
    if (!session) {
      console.log('No session found, clearing auth state')
      await clearAuthState()
      return { error: 'No session available' }
    }
    
    // Try to refresh the session
    const { data, error: refreshError } = await supabase.auth.refreshSession()
    
    if (refreshError) {
      console.log('Refresh failed, clearing auth state')
      await clearAuthState()
      return { error: refreshError }
    }
    
    return { success: true, data }
  } catch (error) {
    console.error('Error in session recovery:', error)
    await clearAuthState()
    return { error }
  }
}

export function forceRestartSupabaseClient() {
  // This function will force a restart of the Supabase client
  // by clearing the singleton instance
  if (typeof window !== 'undefined') {
    // Clear all Supabase-related storage
    localStorage.removeItem('supabase.auth.token')
    sessionStorage.removeItem('supabase.auth.token')
    localStorage.removeItem('sb-codeunia-dev.supabase.auth.token')
    sessionStorage.removeItem('sb-codeunia-dev.supabase.auth.token')
    
    // Clear all Supabase-related storage
    const keysToRemove = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.includes('supabase')) {
        keysToRemove.push(key)
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key))
    
    // Clear sessionStorage as well
    const sessionKeysToRemove = []
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i)
      if (key && key.includes('supabase')) {
        sessionKeysToRemove.push(key)
      }
    }
    sessionKeysToRemove.forEach(key => sessionStorage.removeItem(key))
    
    // Force page reload to restart the client
    window.location.reload()
  }
} 