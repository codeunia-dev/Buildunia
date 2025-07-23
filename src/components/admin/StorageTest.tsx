'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase'
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react'

interface TestResult {
  test: string
  status: 'pending' | 'success' | 'error'
  message: string
  details?: unknown
}

export default function StorageTest() {
  const supabase = createClient();
  const [tests, setTests] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const updateTest = (testName: string, status: TestResult['status'], message: string, details?: unknown) => {
    setTests(prev => {
      const newTests = [...prev]
      const existingIndex = newTests.findIndex(t => t.test === testName)
      const testResult = { test: testName, status, message, details }
      
      if (existingIndex >= 0) {
        newTests[existingIndex] = testResult
      } else {
        newTests.push(testResult)
      }
      
      return newTests
    })
  }

  const runTests = async () => {
    setIsRunning(true)
    setTests([])

    // Test 1: Check Supabase client
    updateTest('Supabase Client', 'pending', 'Checking Supabase client...')
    try {
      if (!supabase) {
        updateTest('Supabase Client', 'error', 'Supabase client not available')
      } else {
        updateTest('Supabase Client', 'success', 'Supabase client available')
      }
    } catch (error) {
      updateTest('Supabase Client', 'error', `Error: ${error}`)
    }

    // Test 2: Check authentication
    updateTest('Authentication', 'pending', 'Checking user authentication...')
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) {
        updateTest('Authentication', 'error', `Auth error: ${error.message}`)
      } else if (!user) {
        updateTest('Authentication', 'error', 'No authenticated user')
      } else {
        updateTest('Authentication', 'success', `Authenticated as: ${user.email}`, { userId: user.id })
      }
    } catch (error) {
      updateTest('Authentication', 'error', `Auth check failed: ${error}`)
    }

    // Test 3: Check user profile and role
    updateTest('User Profile', 'pending', 'Checking user profile and role...')
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single()

      if (error) {
        updateTest('User Profile', 'error', `Profile error: ${error.message}`)
      } else if (!profile) {
        updateTest('User Profile', 'error', 'No profile found')
      } else {
        const isAdmin = profile.role === 'admin'
        updateTest('User Profile', isAdmin ? 'success' : 'error', 
          `Role: ${profile.role} ${isAdmin ? '(Admin access ✓)' : '(Need admin role)'}`, profile)
      }
    } catch (error) {
      updateTest('User Profile', 'error', `Profile check failed: ${error}`)
    }

    // Test 4: Check storage bucket
    updateTest('Storage Bucket', 'pending', 'Checking storage bucket...')
    try {
      const { data: buckets, error } = await supabase.storage.listBuckets()
      if (error) {
        updateTest('Storage Bucket', 'error', `Bucket list error: ${error.message}`)
      } else {
        const projectBucket = buckets.find(b => b.id === 'project-images')
        if (projectBucket) {
          updateTest('Storage Bucket', 'success', 'project-images bucket found', projectBucket)
        } else {
          updateTest('Storage Bucket', 'error', 'project-images bucket not found', { availableBuckets: buckets.map(b => b.id) })
        }
      }
    } catch (error) {
      updateTest('Storage Bucket', 'error', `Bucket check failed: ${error}`)
    }

    // Test 5: Test storage permissions
    updateTest('Storage Permissions', 'pending', 'Testing storage permissions...')
    try {
      const { data, error } = await supabase.storage
        .from('project-images')
        .list('', { limit: 1 })

      if (error) {
        updateTest('Storage Permissions', 'error', `Permission error: ${error.message}`)
      } else {
        updateTest('Storage Permissions', 'success', 'Storage access granted', { fileCount: data?.length || 0 })
      }
    } catch (error) {
      updateTest('Storage Permissions', 'error', `Permission test failed: ${error}`)
    }

    setIsRunning(false)
  }

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'error': return <XCircle className="w-5 h-5 text-red-600" />
      case 'pending': return <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
      default: return <AlertCircle className="w-5 h-5 text-gray-400" />
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Storage Upload Diagnostics</CardTitle>
        <CardDescription>
          Run this test to diagnose image upload issues
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={runTests} disabled={isRunning} className="w-full">
          {isRunning ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Running Tests...
            </>
          ) : (
            'Run Diagnostic Tests'
          )}
        </Button>

        {tests.length > 0 && (
          <div className="space-y-3">
            {tests.map((test, index) => {
              let detailsString: string | null = null;
              if (test.details) {
                if (typeof test.details === 'string') {
                  detailsString = test.details;
                } else {
                  try {
                    detailsString = JSON.stringify(test.details, null, 2);
                  } catch {
                    detailsString = String(test.details);
                  }
                }
              }
              return (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                  {getStatusIcon(test.status)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{test.test}</h4>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{test.message}</p>
                    {detailsString && (
                      <details className="mt-2">
                        <summary className="text-xs text-gray-500 cursor-pointer">Show details</summary>
                        <pre className="text-xs bg-gray-50 p-2 rounded mt-1 overflow-auto">{detailsString}</pre>
                      </details>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tests.length > 0 && !isRunning && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Next Steps:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              {tests.some(t => t.test === 'Authentication' && t.status === 'error') && (
                <li>• Please sign in to your account</li>
              )}
              {tests.some(t => t.test === 'User Profile' && t.status === 'error') && (
                <li>• Run the admin-setup.sql script to make yourself an admin</li>
              )}
              {tests.some(t => t.test === 'Storage Bucket' && t.status === 'error') && (
                <li>• Run the simple-storage-setup.sql script to create the storage bucket</li>
              )}
              {tests.some(t => t.test === 'Storage Permissions' && t.status === 'error') && (
                <li>• Check storage policies in your Supabase dashboard</li>
              )}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
