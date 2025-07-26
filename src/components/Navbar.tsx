'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, ShoppingCart, User, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/ui/logo'
import { useBuilduniaAuth } from '@/contexts/BuilduniaAuthContext'
import { useCart } from '@/contexts/CartContext'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  // NOTE: In the future, admin/auth should be handled by Codeunia SSO/auth.
  const [isOpen, setIsOpen] = useState(false)
  const { user, loading, signOut, hasCodeuniaAccess } = useBuilduniaAuth()
  const { state } = useCart()
  const router = useRouter()
  // Only codeunia@gmail.com is admin
  const isAdmin = user?.email === 'codeunia@gmail.com';

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Projects', href: '/projects' },
    { name: 'Mentorship', href: '/mentorship' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ]

  // Helper for sign out with redirect
  const handleSignOut = async () => {
    console.log('Sign Out button clicked');
    try {
      await signOut();
      console.log('Sign out successful, redirecting...');
      router.push('/auth/signin');
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  }

  return (
    <nav className="bg-black shadow-lg sticky top-0 z-50 border-b border-gray-800 !pointer-events-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center space-x-3">
                <Logo size="md" />
                <span className="text-2xl font-bold text-white">BuildUnia</span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="border-transparent text-gray-300 hover:border-gray-400 hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="sm:ml-6 flex items-center space-x-4">
            <Link href="/cart" className="relative p-2">
              <ShoppingCart className="h-6 w-6 text-gray-300" />
              {state.items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {state.items.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </Link>
            
            {hasCodeuniaAccess && (
              <div className="hidden sm:flex items-center space-x-2">
                <span className="text-xs text-green-400 bg-green-900/20 px-2 py-1 rounded">
                  Codeunia Access
                </span>
              </div>
            )}
            
            {user ? (
              <div className="flex items-center space-x-3">
                <User className="h-6 w-6 text-gray-500" />
                <span className="text-sm text-gray-700">{user?.email || 'Guest'}</span>
                {isAdmin && (
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/admin" className="flex items-center gap-1">
                      <Settings className="h-4 w-4" />
                      Admin
                    </Link>
                  </Button>
                )}
                <Button
                  id="signout-btn"
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="!opacity-100 !pointer-events-auto"
                  title="Sign out of your account"
                  disabled={false}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>

          <div className="sm:hidden flex items-center">
            <Link href="/cart" className="relative p-2 mr-2">
              <ShoppingCart className="h-6 w-6 text-gray-500" />
              {state.items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {state.items.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="sm:hidden fixed inset-0 z-[100] bg-black bg-opacity-95">
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <span className="text-white font-semibold">Menu</span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-1 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="border-transparent text-gray-300 hover:bg-gray-800 hover:border-gray-600 hover:text-white block pl-4 pr-4 py-3 border-l-4 text-base font-medium transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="pt-4 pb-6 border-t border-gray-700 px-4">
              {user ? (
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <User className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-white">{user?.email || 'Guest'}</div>
                      {hasCodeuniaAccess && (
                        <div className="text-xs text-green-400 bg-green-900/20 px-2 py-1 rounded mt-1 w-fit">
                          Codeunia Access
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {isAdmin && (
                      <Button variant="outline" size="sm" asChild className="w-full">
                        <Link href="/admin" className="flex items-center justify-center gap-2">
                          <Settings className="h-4 w-4" />
                          Admin
                        </Link>
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={handleSignOut} className="w-full !opacity-100 !pointer-events-auto">
                      Sign Out
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <Link href="/auth/signin">Sign In</Link>
                  </Button>
                  <Button size="sm" asChild className="w-full">
                    <Link href="/auth/signup">Sign Up</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
