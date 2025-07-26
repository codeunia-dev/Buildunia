'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, CheckCircle } from 'lucide-react'

export default function VerifyEmailPage() {
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
            Check Your Email
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            We've sent you a verification link
          </p>
        </div>

        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-center flex items-center justify-center gap-2">
              <Mail className="h-5 w-5 text-blue-400" />
              Verify Your Email
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="space-y-4">
              <p className="text-gray-300">
                We've sent a verification link to your email address. Please check your inbox and click the link to verify your account.
              </p>
              
              <div className="bg-blue-900/20 border border-blue-500 text-blue-400 px-4 py-3 rounded">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">Verification email sent successfully!</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Button asChild className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                <Link href="/auth/signin">
                  Back to Sign In
                </Link>
              </Button>
              
              <p className="text-gray-400 text-sm">
                Didn't receive the email?{' '}
                <Link href="/auth/signup" className="text-blue-400 hover:text-blue-300">
                  Try signing up again
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 