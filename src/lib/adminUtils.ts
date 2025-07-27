import { createClient } from '@/lib/supabase'

export async function setUserAsAdmin(userId: string) {
  const supabase = createClient()
  
  try {
    const { error } = await supabase.auth.admin.updateUserById(userId, {
      user_metadata: { role: 'admin' }
    })
    
    if (error) {
      console.error('Error setting user as admin:', error)
      return { error }
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error setting user as admin:', error)
    return { error }
  }
}

export async function checkIfUserIsAdmin(userId: string) {
  const supabase = createClient()
  
  try {
    const { data: { user }, error } = await supabase.auth.admin.getUserById(userId)
    
    if (error) {
      console.error('Error checking admin status:', error)
      return false
    }
    
    return user?.user_metadata?.role === 'admin'
  } catch (error) {
    console.error('Error checking admin status:', error)
    return false
  }
} 