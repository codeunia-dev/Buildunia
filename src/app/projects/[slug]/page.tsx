'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ShoppingCart, Star, CheckCircle, Cpu, Wrench, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/contexts/CartContext'
import { Product } from '@/lib/supabase'
import { createClient } from '@/lib/supabase'

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner': return 'bg-green-100 text-green-800'
    case 'intermediate': return 'bg-yellow-100 text-yellow-800'
    case 'advanced': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

// Function to convert title to slug
const titleToSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default function ProjectDetailPage() {
  const params = useParams()
  const { addItem, clearCart, getCartLimits } = useCart()
  const [addedToCart, setAddedToCart] = useState(false)
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const productSlug = params.slug as string

  useEffect(() => {
    fetchProduct()
  }, [productSlug])

  const fetchProduct = async () => {
    try {
      const supabase = createClient()
      
      // First, get all products and find the one with matching slug
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('platform', 'buildunia')

      if (error) {
        console.error('Error fetching products:', error)
        return
      }

      // Find the product with matching slug
      const foundProduct = data?.find(p => titleToSlug(p.title as string) === productSlug)
      
      if (!foundProduct) {
        console.error('Product not found for slug:', productSlug)
        return
      }

      setProduct(foundProduct as unknown as Product)
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Loading...</h1>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Product Not Found</h1>
          <p className="text-gray-400 mb-6">The product you&apos;re looking for doesn&apos;t exist.</p>
          <Button asChild>
            <Link href="/projects">Back to Products</Link>
          </Button>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    console.log('Add to cart clicked for product:', product.title)
    setError(null)
    const result = addItem(product)
    console.log('Add to cart result:', result)
    
    if (result.success) {
      setAddedToCart(true)
      setTimeout(() => setAddedToCart(false), 2000)
    } else {
      setError(result.error || 'Failed to add item to cart')
    }
  }

  const handleBuyNow = async () => {
    console.log('Buy now clicked for product:', product.title)
    setError(null)
    clearCart()
    const result = addItem(product)
    console.log('Buy now result:', result)
    
    if (result.success) {
      window.location.href = '/checkout'
    } else {
      setError(result.error || 'Failed to add item to cart')
    }
  }

  const formatPrice = (price: number) => {
    if (!price || isNaN(price)) return '₹0'
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const getProductPrice = (product: Product, priceType: string) => {
    try {
      // If prices is a string, parse it
      const prices = typeof product.prices === 'string' 
        ? JSON.parse(product.prices) 
        : product.prices
      
      return prices[priceType] || 0
    } catch (error) {
      console.error('Error parsing prices for product:', product.id, error)
      return 0
    }
  }

  const limits = getCartLimits()
  const itemType = product.category || 'unknown'
  const currentTypeCount = limits.typeCounts[itemType] || 0

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild className="text-white hover:bg-gray-800">
            <Link href="/projects">
              <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Products
            </Link>
          </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white">{product.title}</h1>
              <p className="text-gray-400">{product.category} • {product.difficulty}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="bg-gray-900 rounded-lg overflow-hidden shadow-sm border border-gray-800">
            <div className="aspect-square bg-gray-800 flex items-center justify-center">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-gray-400 text-lg">No Image Available</div>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-900 border border-red-700 rounded-lg p-4">
                <div className="flex items-center gap-2 text-red-300">
                  <AlertCircle className="h-5 w-5" />
                  <span className="font-medium">Cannot add to cart</span>
                </div>
                <p className="text-red-400 mt-1">{error}</p>
              </div>
            )}

            {/* Cart Limits Info */}
            <div className="bg-blue-900 border border-blue-700 rounded-lg p-4">
              <div className="flex items-center gap-2 text-blue-300 mb-2">
                <ShoppingCart className="h-4 w-4" />
                <span className="font-medium">Cart Limits</span>
              </div>
              <div className="text-sm text-blue-400 space-y-1">
                <p>• Total items: {limits.totalItems}/{limits.maxTotalItems}</p>
                <p>• {itemType} items: {currentTypeCount}/{limits.maxSameType}</p>
              </div>
            </div>

            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{product.title}</h1>
              <div className="flex items-center gap-2 mb-4">
                <Badge className={getDifficultyColor(product.difficulty)}>
                  {product.difficulty}
              </Badge>
                <Badge variant="outline" className="text-white border-white">{product.category}</Badge>
                <Badge variant="outline" className="text-white border-white">{product.duration}</Badge>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed">{product.description}</p>
            </div>
            
            {/* Pricing */}
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              {/* For Hardware Projects */}
              {['iot', 'arduino', 'esp32', 'raspberry pi', 'hardware'].includes(product.category?.toLowerCase() || '') ? (
                <>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-3xl font-bold text-green-400">
                      {formatPrice(getProductPrice(product, 'full'))}
                    </span>
                    <span className="text-gray-400">Full Kit</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Hardware Only:</span>
                      <span className="font-medium ml-2 text-white">{formatPrice(getProductPrice(product, 'hardware'))}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Code Only:</span>
                      <span className="font-medium ml-2 text-white">{formatPrice(getProductPrice(product, 'code'))}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Mentorship:</span>
                      <span className="font-medium ml-2 text-white">{formatPrice(getProductPrice(product, 'mentorship'))}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Hardware + Mentor:</span>
                      <span className="font-medium ml-2 text-white">{formatPrice(getProductPrice(product, 'hardware_mentorship'))}</span>
                    </div>
                  </div>
                </>
              ) : (
                /* For Software Projects (Gaming, Data, AI/ML, Wearable, Web Development, etc.) */
                <>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-3xl font-bold text-green-400">
                      {formatPrice(getProductPrice(product, 'code'))}
                    </span>
                    <span className="text-gray-400">Code Only</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Code + Mentorship:</span>
                      <span className="font-medium ml-2 text-white">{formatPrice(getProductPrice(product, 'code_mentorship'))}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Mentorship Only:</span>
                      <span className="font-medium ml-2 text-white">{formatPrice(getProductPrice(product, 'mentorship'))}</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button 
                onClick={handleAddToCart}
                className="flex-1"
                size="lg"
                disabled={limits.totalItems >= limits.maxTotalItems || currentTypeCount >= limits.maxSameType}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {addedToCart ? 'Added to Cart!' : 'Add to Cart'}
              </Button>
              <Button 
                onClick={handleBuyNow}
                variant="outline"
                size="lg"
                disabled={limits.totalItems >= limits.maxTotalItems || currentTypeCount >= limits.maxSameType}
              >
                Buy Now
              </Button>
            </div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    What You'll Learn
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
            )}

            {/* Requirements */}
            {product.requirements && product.requirements.length > 0 && (
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                    <Wrench className="h-5 w-5 text-blue-500" />
                    Requirements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                    {product.requirements.map((requirement, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Cpu className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300">{requirement}</span>
                      </li>
                    ))}
              </ul>
            </CardContent>
          </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 