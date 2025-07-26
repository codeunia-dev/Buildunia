import { createClient } from '@/lib/supabase';

// Shared authentication utilities for cross-domain auth
export interface SharedUser {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role?: string;
  platform?: 'codeunia' | 'buildunia';
}

export class SharedAuth {
  private supabase = createClient();
  
  // Check if user is authenticated in either platform
  async getCurrentUser(): Promise<SharedUser | null> {
    try {
      const { data: { user }, error } = await this.supabase.auth.getUser();
      
      if (error || !user) {
        return null;
      }
      
      return {
        id: user.id,
        email: user.email || '',
        full_name: user.user_metadata?.full_name,
        avatar_url: user.user_metadata?.avatar_url,
        role: user.user_metadata?.role,
        platform: user.user_metadata?.platform || 'buildunia'
      };
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // Sign in with shared credentials
  async signIn(email: string, password: string, platform: 'codeunia' | 'buildunia' = 'buildunia') {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      // Update user metadata to include platform
      if (data.user) {
        await this.supabase.auth.updateUser({
          data: { 
            platform,
            last_login: new Date().toISOString()
          }
        });
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Sign up with shared credentials
  async signUp(email: string, password: string, fullName: string, platform: 'codeunia' | 'buildunia' = 'buildunia') {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            platform,
            created_at: new Date().toISOString()
          }
        }
      });

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Sign out from both platforms
  async signOut() {
    try {
      const { error } = await this.supabase.auth.signOut();
      return { error };
    } catch (error) {
      return { error };
    }
  }

  // Check if user has access to specific platform
  async hasPlatformAccess(platform: 'codeunia' | 'buildunia'): Promise<boolean> {
    const user = await this.getCurrentUser();
    if (!user) return false;
    
    // If user is from Codeunia, they have access to Buildunia
    if (user.platform === 'codeunia') return true;
    
    // If user is from Buildunia, they have access to Buildunia
    if (user.platform === 'buildunia') return true;
    
    return false;
  }

  // Get user profile from shared database
  async getUserProfile(): Promise<any> {
    try {
      const user = await this.getCurrentUser();
      if (!user) return null;

      const { data, error } = await this.supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  // Listen to auth state changes
  onAuthStateChange(callback: (user: SharedUser | null) => void) {
    return this.supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const user: SharedUser = {
          id: session.user.id,
          email: session.user.email || '',
          full_name: session.user.user_metadata?.full_name,
          avatar_url: session.user.user_metadata?.avatar_url,
          role: session.user.user_metadata?.role,
          platform: session.user.user_metadata?.platform || 'buildunia'
        };
        callback(user);
      } else if (event === 'SIGNED_OUT') {
        callback(null);
      }
    });
  }
}

// Export singleton instance
export const sharedAuth = new SharedAuth(); 
 
 
 