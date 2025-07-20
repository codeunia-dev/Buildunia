import Link from 'next/link'
import { Calendar, User, ArrowRight, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// Mock blog posts - replace with real data from CMS or database
const blogPosts = [
  {
    id: '1',
    title: 'Getting Started with Arduino: Your First IoT Project',
    excerpt: 'Learn the basics of Arduino programming and build your first connected device that can send data to the cloud.',
    content: 'Full blog post content here...',
    author: 'Dr. Alex Chen',
    publishedAt: '2024-01-15',
    readTime: '8 min read',
    category: 'Beginner',
    tags: ['Arduino', 'IoT', 'Beginner'],
    featured: true
  },
  {
    id: '2',
    title: 'ESP32 vs Raspberry Pi: Choosing the Right Platform',
    excerpt: 'A comprehensive comparison of ESP32 and Raspberry Pi for different IoT applications and use cases.',
    content: 'Full blog post content here...',
    author: 'Sarah Kim',
    publishedAt: '2024-01-10',
    readTime: '12 min read',
    category: 'Hardware',
    tags: ['ESP32', 'Raspberry Pi', 'Hardware'],
    featured: true
  },
  {
    id: '3',
    title: '5 Essential IoT Protocols Every Developer Should Know',
    excerpt: 'Understanding MQTT, HTTP, CoAP, and other protocols that power modern IoT communications.',
    content: 'Full blog post content here...',
    author: 'Michael Rodriguez',
    publishedAt: '2024-01-05',
    readTime: '10 min read',
    category: 'Protocols',
    tags: ['MQTT', 'HTTP', 'Protocols'],
    featured: false
  },
  {
    id: '4',
    title: 'Building a Weather Station with Cloud Integration',
    excerpt: 'Step-by-step guide to creating a professional weather monitoring system that sends data to the cloud.',
    content: 'Full blog post content here...',
    author: 'Dr. Alex Chen',
    publishedAt: '2024-01-01',
    readTime: '15 min read',
    category: 'Tutorial',
    tags: ['Weather Station', 'Cloud', 'Tutorial'],
    featured: false
  },
  {
    id: '5',
    title: 'IoT Security Best Practices for Beginners',
    excerpt: 'Essential security considerations when building and deploying IoT devices in production environments.',
    content: 'Full blog post content here...',
    author: 'Sarah Kim',
    publishedAt: '2023-12-28',
    readTime: '7 min read',
    category: 'Security',
    tags: ['Security', 'Best Practices'],
    featured: false
  },
  {
    id: '6',
    title: 'Career Guide: Breaking into the IoT Industry',
    excerpt: 'Tips and strategies for students and professionals looking to start or advance their career in IoT.',
    content: 'Full blog post content here...',
    author: 'Dr. Alex Chen',
    publishedAt: '2023-12-20',
    readTime: '11 min read',
    category: 'Career',
    tags: ['Career', 'Industry', 'Jobs'],
    featured: false
  }
]

const categories = ['All', 'Beginner', 'Hardware', 'Protocols', 'Tutorial', 'Security', 'Career']

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getCategoryColor = (category: string) => {
  const colors: { [key: string]: string } = {
    Beginner: 'bg-green-100 text-green-800',
    Hardware: 'bg-blue-100 text-blue-800',
    Protocols: 'bg-purple-100 text-purple-800',
    Tutorial: 'bg-yellow-100 text-yellow-800',
    Security: 'bg-red-100 text-red-800',
    Career: 'bg-gray-100 text-gray-800'
  }
  return colors[category] || 'bg-gray-100 text-gray-800'
}

export default function BlogPage() {
  const featuredPosts = blogPosts.filter(post => post.featured)
  const recentPosts = blogPosts.filter(post => !post.featured)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            IoT Learning Hub
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Tutorials, guides, and insights to help you master IoT development. 
            From beginner tips to advanced techniques, we've got you covered.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Articles</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {featuredPosts.map((post) => (
                <Card key={post.id} className="hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-gray-200 rounded-t-lg"></div>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={getCategoryColor(post.category)}>
                        {post.category}
                      </Badge>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {post.readTime}
                      </div>
                    </div>
                    <CardTitle className="text-xl line-clamp-2">{post.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <User className="h-4 w-4 mr-1" />
                        {post.author}
                        <Calendar className="h-4 w-4 ml-3 mr-1" />
                        {formatDate(post.publishedAt)}
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/blog/${post.id}`}>
                          Read More <ArrowRight className="h-4 w-4 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Category Filter */}
        <section className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant="outline"
                size="sm"
                className="text-sm"
              >
                {category}
              </Button>
            ))}
          </div>
        </section>

        {/* Recent Posts */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Recent Articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gray-200 rounded-t-lg"></div>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {post.category}
                    </Badge>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      {post.readTime}
                    </div>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
                  <CardDescription className="line-clamp-3">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {post.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      <div className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        {post.author}
                      </div>
                      <div className="flex items-center mt-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(post.publishedAt)}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/blog/${post.id}`}>
                        Read <ArrowRight className="h-3 w-3 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="mt-20">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Stay Updated with IoT Trends
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Get the latest tutorials, project ideas, and IoT industry insights 
                delivered to your inbox every week.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button>Subscribe</Button>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                No spam, unsubscribe at any time.
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
