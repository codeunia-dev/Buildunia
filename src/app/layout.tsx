import type { Metadata } from 'next'
import { BuilduniaAuthProvider } from "@/contexts/BuilduniaAuthContext";
import { CartProvider } from '@/contexts/CartContext'
import './globals.css'
import Navbar from '@/components/Navbar'
import { Footer } from '@/components/Footer'

export const metadata: Metadata = {
  title: 'BuildUnia - Learn IoT Through Hands-On Projects',
  description: 'A Codeunia product - Build your future with IoT project kits and expert mentorship. Perfect for college students and tech enthusiasts.',
  icons: {
    icon: [
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
      },
      {
        url: '/favicon-light.svg',
        type: 'image/svg+xml',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/favicon-dark.svg',
        type: 'image/svg+xml',
        media: '(prefers-color-scheme: dark)',
      },
    ],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon-light.svg" type="image/svg+xml" media="(prefers-color-scheme: light)" />
        <link rel="icon" href="/favicon-dark.svg" type="image/svg+xml" media="(prefers-color-scheme: dark)" />
        {/* Temporarily disabled CSP for development - will be re-enabled with proper values */}
        {/* <meta httpEquiv="Content-Security-Policy" content="script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://api.razorpay.com https://*.razorpay.com; frame-src 'self' https://checkout.razorpay.com https://api.razorpay.com https://*.razorpay.com; connect-src 'self' https://*.razorpay.com https://api.razorpay.com https://lumberjack.razorpay.com https://*.supabase.co;" /> */}
      </head>
      <body className="antialiased min-h-screen flex flex-col !bg-black text-white" suppressHydrationWarning>
        <BuilduniaAuthProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-1 !bg-black w-full overflow-x-hidden">
              <div className="w-full max-w-full">
                {children}
              </div>
            </main>
            <Footer />
          </CartProvider>
        </BuilduniaAuthProvider>
      </body>
    </html>
  )
}
