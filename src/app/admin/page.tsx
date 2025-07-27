'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useBuilduniaAuth } from '@/contexts/BuilduniaAuthContext'
import AdminDashboard from '@/components/admin/AdminDashboard'
import { Loader2, Shield, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function AdminPage() {
  const { user, loading, isAdmin } = useBuilduniaAuth()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Wait for authentication to load
    if (!loading) {
      setIsChecking(false)
      
      // If user is not authenticated, redirect to signin
      if (!user) {
        router.push('/auth/signin?redirect=/admin')
        return
      }
    }
  }, [user, loading, router])

  // Show loading state while checking authentication
  if (loading || isChecking) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-white mx-auto mb-4" />
          <p className="text-white">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  // Show unauthorized message for non-admin users
  if (user && !isAdmin) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Card className="bg-gray-900 border-gray-700 max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              Access Denied
            </CardTitle>
            <CardDescription className="text-gray-300">
              You don't have permission to access the admin dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-gray-400">
                Logged in as: <span className="text-white">{user.email}</span>
              </p>
              <p className="text-sm text-gray-400">
                Admin status: <span className="text-red-400">No</span>
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/">Go Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show admin dashboard
  if (user && isAdmin) {
    return (
      <div className="min-h-screen bg-black">
        <AdminDashboard />
      </div>
    )
  }

  // Fallback - should not reach here
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Card className="bg-gray-900 border-gray-700 max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Shield className="h-5 w-5 text-red-400" />
            Authentication Required
          </CardTitle>
          <CardDescription className="text-gray-300">
            Please sign in to access the admin dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link href="/auth/signin?redirect=/admin">Sign In</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
