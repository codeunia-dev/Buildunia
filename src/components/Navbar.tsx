'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Menu, X, ShoppingCart, User, Settings, Sparkles, Crown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/ui/logo'
import { useBuilduniaAuth } from '@/contexts/BuilduniaAuthContext'
import { useCart } from '@/contexts/CartContext'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, loading, signOut, hasCodeuniaAccess, isAdmin } = useBuilduniaAuth()
  const { state } = useCart()
  const router = useRouter()

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
      setIsOpen(false); // Close menu after sign out
      router.push('/auth/signin');
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  }

  const handleLinkClick = () => {
    setIsOpen(false);
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
    <nav className="bg-gradient-to-r from-black via-gray-900 to-black shadow-2xl sticky top-0 z-50 border-b border-gray-800/50 backdrop-blur-sm !pointer-events-auto w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between h-16 w-full">
          <div className="flex items-center min-w-0 flex-1">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="relative">
                  <Logo size="md" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent truncate group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-300 group-hover:scale-105 transform">
                  BuildUnia
                </span>
              </Link>
            </div>
            <div className="hidden lg:ml-12 lg:flex lg:space-x-10 xl:space-x-12">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="relative border-transparent text-gray-300 hover:text-white inline-flex items-center px-3 py-2 text-sm font-medium transition-all duration-300 whitespace-nowrap group"
                >
                  {item.name}
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 group-hover:w-full transition-all duration-300"></div>
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden lg:flex items-center space-x-4 xl:space-x-6 min-w-0 flex-shrink-0">
            <Link href="/cart" className="relative p-2 flex-shrink-0 group">
              <div className="relative">
                <ShoppingCart className="h-6 w-6 text-gray-300 group-hover:text-blue-400 transition-colors duration-300" />
                {state.items.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    {state.items.reduce((total, item) => total + item.quantity, 0)}
                  </span>
                )}
              </div>
            </Link>
            {user ? (
              <div className="flex items-center space-x-3 xl:space-x-4 min-w-0">
                <div className="flex items-center space-x-2 group">
                  <div className="relative">
                    <User className="h-5 w-5 text-gray-400 group-hover:text-blue-400 transition-colors duration-300" />
                    <div className="absolute inset-0 bg-blue-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <span className="text-xs text-gray-300 truncate max-w-28 xl:max-w-40 group-hover:text-white transition-colors duration-300">
                    {user?.email || 'Guest'}
                  </span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  asChild 
                  className="flex-shrink-0 bg-gray-800/50 border-gray-600 hover:bg-gray-700/50 hover:border-gray-500 transition-all duration-300"
                >
                  <Link href="/dashboard" className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span className="hidden lg:inline">Dashboard</span>
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="flex space-x-3 flex-shrink-0">
                <Button 
                  variant="outline" 
                  size="sm" 
                  asChild
                  className="bg-gray-800/50 border-gray-600 hover:bg-gray-700/50 hover:border-gray-500 transition-all duration-300"
                >
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
                <Button 
                  size="sm" 
                  asChild
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <Link href="/auth/signup" className="flex items-center gap-1">
                    <Sparkles className="h-4 w-4" />
                    Sign Up
                  </Link>
                </Button>
              </div>
            )}
          </div>
          <div className="lg:hidden flex items-center space-x-2">
            <Link href="/cart" className="relative p-2 group" onClick={handleLinkClick}>
              <div className="relative">
                <ShoppingCart className="h-6 w-6 text-gray-400 group-hover:text-blue-400 transition-colors duration-300" />
                {state.items.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    {state.items.reduce((total, item) => total + item.quantity, 0)}
                  </span>
                )}
              </div>
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all duration-300"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      {isOpen && createPortal(
        <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-sm !opacity-100 flex items-center justify-center">
          <div className="relative w-full max-w-sm mx-auto bg-gradient-to-b from-gray-900 to-gray-800 !opacity-100 rounded-2xl shadow-2xl border border-gray-600/50 flex flex-col overflow-hidden">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800/50 focus:outline-none transition-all duration-300"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="flex flex-col gap-1 py-8 px-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-200 hover:bg-gray-800/50 hover:text-white rounded-lg px-4 py-3 text-base font-medium transition-all duration-300 group"
                  onClick={handleLinkClick}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-1 bg-gray-500 rounded-full group-hover:bg-blue-400 transition-colors duration-300"></div>
                    {item.name}
                  </div>
                </Link>
              ))}
            </div>
            <div className="border-t border-gray-700/50 px-6 py-6">
              {user ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center">
                    <div className="relative">
                      <User className="h-8 w-8 text-gray-400" />
                      <div className="absolute inset-0 bg-blue-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-white">{user?.email || 'Guest'}</div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      asChild 
                      className="w-full bg-gray-800/50 border-gray-600 hover:bg-gray-700/50 hover:border-gray-500 transition-all duration-300"
                    >
                      <Link href="/dashboard" className="flex items-center justify-center gap-2" onClick={handleLinkClick}>
                        <User className="h-4 w-4" />
                        Dashboard
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    asChild 
                    className="w-full bg-gray-800/50 border-gray-600 hover:bg-gray-700/50 hover:border-gray-500 transition-all duration-300"
                  >
                    <Link href="/auth/signin" onClick={handleLinkClick}>Sign In</Link>
                  </Button>
                  <Button 
                    size="sm" 
                    asChild 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <Link href="/auth/signup" onClick={handleLinkClick} className="flex items-center justify-center gap-1">
                      <Sparkles className="h-4 w-4" />
                      Sign Up
                    </Link>
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