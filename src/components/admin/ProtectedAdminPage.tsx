'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useBuilduniaAuth } from '@/contexts/BuilduniaAuthContext'
import AdminDashboard from './AdminDashboard'
import { Loader2, Shield, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function ProtectedAdminPage() {
  const { user, loading, isAdmin } = useBuilduniaAuth()
  const router = useRouter()

  useEffect(() => {
    // If not loading and user is not authenticated, redirect to signin
    if (!loading && !user) {
      router.push('/auth/signin?redirect=/admin')
      return
    }

    // If not loading, user is authenticated but not admin, redirect to home
    if (!loading && user && !isAdmin) {
      router.push('/?error=unauthorized')
      return
    }
  }, [user, loading, isAdmin, router])

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-300">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  // Show unauthorized message if user is authenticated but not admin
  if (user && !isAdmin) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-gray-900 border-gray-700">
          <CardHeader className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-white">Access Denied</CardTitle>
            <CardDescription className="text-gray-400">
              You don't have permission to access the admin panel.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-300 mb-4">
              Only administrators can access this area. If you believe this is an error, 
              please contact support.
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => router.push('/')}>
                Go Home
              </Button>
              <Button variant="outline" onClick={() => router.push('/contact')}>
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show not authenticated message
  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-gray-900 border-gray-700">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <CardTitle className="text-white">Authentication Required</CardTitle>
            <CardDescription className="text-gray-400">
              Please sign in to access the admin panel.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-300 mb-4">
              You need to be signed in with admin privileges to access this area.
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => router.push('/auth/signin?redirect=/admin')}>
                Sign In
              </Button>
              <Button variant="outline" onClick={() => router.push('/')}>
                Go Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // User is authenticated and is admin - show admin dashboard
  return (
    <div className="min-h-screen bg-black">
      <AdminDashboard />
    </div>
  )
} 