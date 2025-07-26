'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Menu, X, ShoppingCart, User, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/ui/logo'
import { useBuilduniaAuth } from '@/contexts/BuilduniaAuthContext'
import { useCart } from '@/contexts/CartContext'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, loading, signOut, hasCodeuniaAccess } = useBuilduniaAuth()
  const { state } = useCart()
  const router = useRouter()
  const isAdmin = user?.email === 'codeunia@gmail.com';

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Projects', href: '/projects' },
    { name: 'Mentorship', href: '/mentorship' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ]

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/auth/signin');
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  }

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isOpen]);

  return (
    <nav className="bg-black shadow-lg sticky top-0 z-50 border-b border-gray-800 !pointer-events-auto w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between h-16 w-full">
          <div className="flex items-center min-w-0">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center space-x-2 sm:space-x-3">
                <Logo size="md" />
                <span className="text-xl sm:text-2xl font-bold text-white truncate">BuildUnia</span>
              </Link>
            </div>
            <div className="hidden lg:ml-6 lg:flex lg:space-x-6 xl:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="border-transparent text-gray-300 hover:border-gray-400 hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors whitespace-nowrap"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden lg:flex items-center space-x-3 xl:space-x-4 min-w-0">
            <Link href="/cart" className="relative p-2 flex-shrink-0">
              <ShoppingCart className="h-6 w-6 text-gray-300" />
              {state.items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {state.items.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </Link>
            {hasCodeuniaAccess && (
              <div className="hidden xl:flex items-center space-x-2 flex-shrink-0">
                <span className="text-xs text-green-400 bg-green-900/20 px-2 py-1 rounded whitespace-nowrap">
                  Codeunia Access
                </span>
              </div>
            )}
            {user ? (
              <div className="flex items-center space-x-2 xl:space-x-3 min-w-0">
                <User className="h-6 w-6 text-gray-500 flex-shrink-0" />
                <span className="text-sm text-gray-700 truncate max-w-32 xl:max-w-48">{user?.email || 'Guest'}</span>
                {isAdmin && (
                  <Button variant="outline" size="sm" asChild className="flex-shrink-0">
                    <Link href="/admin" className="flex items-center gap-1">
                      <Settings className="h-4 w-4" />
                      <span className="hidden xl:inline">Admin</span>
                    </Link>
                  </Button>
                )}
                <Button
                  id="signout-btn"
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="!opacity-100 !pointer-events-auto flex-shrink-0"
                  title="Sign out of your account"
                  disabled={false}
                >
                  <span className="hidden xl:inline">Sign Out</span>
                  <span className="xl:hidden">Logout</span>
                </Button>
              </div>
            ) : (
              <div className="flex space-x-2 flex-shrink-0">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
          <div className="lg:hidden flex items-center space-x-2">
            <Link href="/cart" className="relative p-2">
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
      {isOpen && createPortal(
        <div className="fixed inset-0 z-[99999] bg-black/95 flex items-center justify-center">
          <div className="relative w-full max-w-sm mx-auto bg-gray-900 rounded-xl shadow-2xl border border-gray-700 flex flex-col">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-md hover:bg-gray-800 focus:outline-none"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="flex flex-col gap-2 py-8 px-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-200 hover:bg-gray-800 hover:text-white rounded-md px-4 py-3 text-base font-medium transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="border-t border-gray-700 px-6 py-6">
              {user ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center">
                    <User className="h-8 w-8 text-gray-400" />
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
                <div className="flex flex-col gap-3">
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
        </div>,
        document.body
      )}
    </nav>
  )
} 