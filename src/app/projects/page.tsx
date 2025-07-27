'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Image from 'next/image'
import { createClient } from '@/lib/supabase'
import { Product } from '@/lib/supabase'
import { getImageUrl } from '@/lib/imageUpload'

const categories = ['All', 'IoT', 'Arduino', 'ESP32', 'Raspberry Pi']
const difficulties = ['All', 'beginner', 'intermediate', 'advanced']

// Function to convert title to slug
const titleToSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default function ProjectsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedDifficulty, setSelectedDifficulty] = useState('All')

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const supabase = createClient()
      console.log('Fetching products from database...')
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('platform', 'buildunia')
        .order('created_at', { ascending: false })

      console.log('Supabase response:', { data, error })

      if (error) {
        console.error('Error fetching products:', error)
        return
      }

      console.log('Products found:', data?.length || 0)
      
      // Parse the prices JSON for each product
      const parsedProducts = data?.map(product => ({
        ...product,
        prices: typeof product.prices === 'string' ? JSON.parse(product.prices) : product.prices
      })) || []
      
      setProducts((parsedProducts as unknown as Product[]) || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === 'All' || product.difficulty === selectedDifficulty
    
    return matchesSearch && matchesCategory && matchesDifficulty
  })

  const formatPrice = (price: number) => {
    if (!price || isNaN(price)) return '₹0'
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const getProductPrice = (product: Product) => {
    try {
      // If prices is a string, parse it
      const prices = typeof product.prices === 'string' 
        ? JSON.parse(product.prices) 
        : product.prices
      
      // For software projects, use 'code' price, for hardware use 'full' price
      if (['Data', 'AI/ML', 'Wearable', 'Gaming'].includes(product.category)) {
        return prices.code || product.price || 0
      } else {
        return prices.full || product.price || 0
      }
    } catch (error) {
      console.error('Error parsing prices for product:', product.id, error)
      return product.price || 0
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading products...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black w-full overflow-x-hidden">
      {/* Header */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              IoT Project Kits
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover hands-on IoT projects designed to teach you real-world skills. 
              Each kit includes all components, detailed instructions, and code examples.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {difficulties.map((difficulty) => (
                    <SelectItem key={difficulty} value={difficulty}>
                      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="bg-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48 bg-gray-100">
                    {(() => {
                      // Priority: use image_path from storage bucket, fallback to image_url
                      const imageUrl = product.image_path 
                        ? getImageUrl(product.image_path) 
                        : product.image_url
                      
                      return imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={product.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No Image
                        </div>
                      )
                    })()}
                    <Badge className="absolute top-2 right-2">
                      {product.difficulty}
                    </Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">{product.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                      {product.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                      <span className="text-xl sm:text-2xl font-bold text-green-600">
                        {formatPrice(getProductPrice(product))}
                      </span>
                      <Badge variant="outline" className="w-fit">{product.category}</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button asChild className="flex-1">
                        <Link href={`/projects/${titleToSlug(product.title)}`}>
                          View Details
                        </Link>
                      </Button>
                    </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
          )}
        </div>
      </section>
    </div>
  )
}
