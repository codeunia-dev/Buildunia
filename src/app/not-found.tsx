import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-white mb-4">404</h2>
        <h3 className="text-2xl font-semibold text-white mb-4">Page Not Found</h3>
        <p className="text-gray-300 mb-6">The page you're looking for doesn't exist.</p>
        <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-black">
          <Link href="/">Go back home</Link>
        </Button>
      </div>
    </div>
  )
} 