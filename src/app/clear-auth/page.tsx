'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { clearAuthState, recoverAuthSession, forceRestartSupabaseClient } from '@/lib/clearAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Trash2, CheckCircle, AlertCircle, RefreshCw, RotateCcw } from 'lucide-react'

export default function ClearAuthPage() {
  const [status, setStatus] = useState<'idle' | 'clearing' | 'recovering' | 'restarting' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleClearAuth = async () => {
    setStatus('clearing')
    setMessage('Clearing authentication state...')
    
    try {
      const result = await clearAuthState()
      
      if (result.success) {
        setStatus('success')
        setMessage('Authentication state cleared successfully! Redirecting to signin...')
        
        // Clear browser storage manually as well
        if (typeof window !== 'undefined') {
          localStorage.clear()
          sessionStorage.clear()
        }
        
        setTimeout(() => {
          router.push('/auth/signin?redirect=/admin')
        }, 2000)
      } else {
        setStatus('error')
        setMessage('Failed to clear authentication state. Please try again.')
      }
    } catch (error) {
      setStatus('error')
      setMessage('An error occurred while clearing authentication state.')
    }
  }

  const handleRecoverSession = async () => {
    setStatus('recovering')
    setMessage('Attempting to recover authentication session...')
    
    try {
      const result = await recoverAuthSession()
      
      if (result.success) {
        setStatus('success')
        setMessage('Session recovered successfully! Redirecting to dashboard...')
        
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      } else {
        setStatus('error')
        setMessage('Failed to recover session. Please clear auth state and sign in again.')
      }
    } catch (error) {
      setStatus('error')
      setMessage('An error occurred while recovering session.')
    }
  }

  const handleForceRestart = () => {
    setStatus('restarting')
    setMessage('Force restarting Supabase client...')
    
    // Small delay to show the message
    setTimeout(() => {
      forceRestartSupabaseClient()
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="bg-gray-900 border-gray-700 max-w-md w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Trash2 className="h-5 w-5 text-red-400" />
            Clear Authentication State
          </CardTitle>
          <CardDescription className="text-gray-300">
            This will clear all authentication tokens and sign you out.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === 'idle' && (
            <div className="space-y-3">
              <p className="text-sm text-gray-400">
                Choose an option to resolve authentication issues:
              </p>
              <div className="space-y-2">
                <Button 
                  onClick={handleRecoverSession} 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try to Recover Session
                </Button>
                <Button 
                  onClick={handleClearAuth} 
                  className="w-full bg-red-600 hover:bg-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Authentication State
                </Button>
                <Button 
                  onClick={handleForceRestart} 
                  className="w-full bg-orange-600 hover:bg-orange-700"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Force Restart (Nuclear Option)
                </Button>
              </div>
            </div>
          )}
          
          {status === 'clearing' && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
              <p className="text-white">{message}</p>
            </div>
          )}
          
          {status === 'recovering' && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
              <p className="text-white">{message}</p>
            </div>
          )}
          
          {status === 'restarting' && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
              <p className="text-white">{message}</p>
            </div>
          )}
          
          {status === 'success' && (
            <div className="text-center">
              <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <p className="text-green-400">{message}</p>
            </div>
          )}
          
          {status === 'error' && (
            <div className="text-center">
              <AlertCircle className="h-8 w-8 text-red-400 mx-auto mb-2" />
              <p className="text-red-400">{message}</p>
              <div className="mt-4 space-y-2">
                <Button 
                  onClick={handleRecoverSession} 
                  variant="outline" 
                  className="w-full"
                >
                  Try Recovery Again
                </Button>
                <Button 
                  onClick={handleClearAuth} 
                  variant="outline" 
                  className="w-full"
                >
                  Clear Auth State
                </Button>
                <Button 
                  onClick={handleForceRestart} 
                  variant="outline" 
                  className="w-full"
                >
                  Force Restart
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 