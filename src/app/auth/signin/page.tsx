'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Logo } from '@/components/ui/logo'
import { useAuth } from '@/contexts/AuthContext'
import type { AuthError } from '@supabase/supabase-js';

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { signIn, signInWithGitHub } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await signIn(email, password);
      const error = (result as { error: AuthError | null }).error;
      if (error) {
        setError(error.message)
      } else {
        router.push('/')
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-white rounded-xl flex items-center justify-center mb-4">
            <Logo size="md" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400">Sign in to continue to BuildUnia</p>
        </div>

        <Card className="w-full border-gray-700 bg-gray-900/50 backdrop-blur-sm shadow-2xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl font-semibold text-white">Sign In</CardTitle>
          </CardHeader>
        <CardContent className="pt-4">
          <Button
            type="button"
            onClick={signInWithGitHub}
            className="w-full mb-6 bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 flex items-center justify-center gap-2"
          >
            <svg height="20" width="20" viewBox="0 0 16 16" fill="currentColor" className="inline-block mr-2"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>
            Sign in with GitHub
          </Button>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gray-900 text-gray-400">or sign in with email</span>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-sm backdrop-blur-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-200 font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20 transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-200 font-medium">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20 transition-colors pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 transition-all duration-200 transform hover:scale-[1.02]" 
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <div className="mt-8 space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-900 text-gray-400">New to BuildUnia?</span>
              </div>
            </div>
            
            <div className="text-center">
              <Link 
                href="/auth/signup" 
                className="inline-flex items-center justify-center w-full px-4 py-3 border border-gray-600 rounded-lg text-gray-200 hover:bg-gray-800/50 hover:border-gray-500 transition-all duration-200 font-medium"
              >
                Create an account
              </Link>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link 
              href="/auth/forgot-password" 
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              Forgot your password?
            </Link>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}
