'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useBuilduniaAuth } from '@/contexts/BuilduniaAuthContext'
import { Github, Mail } from 'lucide-react'
import { createClient } from '@/lib/supabase'

function SignInForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const { signIn, user, loading: authLoading } = useBuilduniaAuth()

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && user) {
      const redirectTo = searchParams.get('redirect') || '/'
      router.push(redirectTo)
    }
  }, [user, authLoading, router, searchParams])

const getRedirectUrl = () => {
    if (typeof window === 'undefined') return undefined;
    
    // Get current origin
    const origin = window.location.origin;
    
    // If we're on localhost, use localhost callback
    if (origin.includes('localhost')) {
      return `${origin}/auth/callback`;
    }
    
    // For production, always use the current domain's callback
    return `${origin}/auth/callback`;
  };

  const handleGitHubSignIn = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const redirectUrl = getRedirectUrl();
      console.log('GitHub OAuth redirect URL:', redirectUrl);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      if (error) {
        throw error;
      }
      setError('');
    } catch (error) {
      console.error('GitHub sign in error:', error);
      setError('GitHub sign in failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const redirectUrl = getRedirectUrl();
      console.log('Google OAuth redirect URL:', redirectUrl);
      
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      setError('');
    } catch (error) {
      console.error('Google sign in error:', error);
      setError('Google sign in failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await signIn(email, password);

      if (error) {
        setError(error.message);
      } else {
        router.push('/');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // Don't render the form if user is already authenticated
  if (user) {
    return null
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="terminal-ghost-logo relative flex items-center justify-center w-16 h-16">
              <svg className="terminal-ghost-svg w-16 h-16" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path className="body-shape" d="M100,20 C40,20 40,120 40,120 L40,180 L160,180 L160,120 C160,120 160,20 100,20 Z" fill="#FFFFFF"></path>
                <g className="face-element">
                  <path d="M80 85 L100 105 L80 125" stroke="#000000" strokeWidth="15" fill="none" strokeLinecap="round" strokeLinejoin="round"></path>
                  <line x1="110" y1="125" x2="140" y2="125" stroke="#000000" strokeWidth="15" strokeLinecap="round"></line>
                </g>
              </svg>
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-white">
            Welcome to BuildUnia
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Sign in to your account to continue
          </p>
        </div>

        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-center">Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
                <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}
            
            {/* OAuth buttons */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Button 
                variant="outline" 
                className="w-full bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                onClick={handleGitHubSignIn}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Connecting...
                  </div>
                ) : (
                  <>
                    <Github className="mr-2 h-4 w-4" />
                    GitHub
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                className="w-full bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                onClick={handleGoogleSignIn}
                disabled={loading}
              >
                <Mail className="mr-2 h-4 w-4" />
                Google
              </Button>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-gray-900 px-2 text-gray-400">Or continue with email</span>
              </div>
            </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-gray-800 border-gray-600 text-white"
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="Enter your password"
                />
            </div>

            <Button 
              type="submit" 
              disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                {loading ? 'Signing in...' : 'Sign In'}
            </Button>
            
            <div className="text-center">
                <p className="text-gray-400 text-sm">
                  Don't have an account?{' '}
                  <Link href="/auth/signup" className="text-blue-400 hover:text-blue-300">
                    Sign up
              </Link>
                </p>
            </div>
            </form>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInForm />
    </Suspense>
  )
}
