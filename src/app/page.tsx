"use client"

import Link from "next/link"
import { ArrowRight, Code, Cpu, Users, Star, Zap, Shield, Sparkles, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"
import type { Product } from "@/lib/supabase"

// Function to convert title to slug
const titleToSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

const features = [
  {
    icon: Code,
    title: "Hands-On Learning",
    description: "Learn by building real IoT projects with complete component kits and step-by-step guides.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Users,
    title: "Expert Mentorship",
    description: "Get personalized guidance from experienced IoT professionals to accelerate your learning.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Cpu,
    title: "Latest Technology",
    description: "Work with cutting-edge IoT platforms like Arduino, ESP32, and Raspberry Pi.",
    gradient: "from-emerald-500 to-teal-500",
  },
]

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "beginner":
      return "bg-gradient-to-r from-emerald-500 to-emerald-400 text-white border border-emerald-300 shadow-lg shadow-emerald-500/25 rounded-full px-4 py-2 font-semibold tracking-wide backdrop-blur-sm"
    case "intermediate":
      return "bg-gradient-to-r from-amber-500 to-orange-400 text-white border border-amber-300 shadow-lg shadow-amber-500/25 rounded-full px-4 py-2 font-semibold tracking-wide backdrop-blur-sm"
    case "advanced":
      return "bg-gradient-to-r from-red-500 to-pink-400 text-white border border-red-300 shadow-lg shadow-red-500/25 rounded-full px-4 py-2 font-semibold tracking-wide backdrop-blur-sm"
    default:
      return "bg-gradient-to-r from-gray-500 to-gray-400 text-white border border-gray-300 shadow-lg shadow-gray-500/25 rounded-full px-4 py-2 font-semibold tracking-wide backdrop-blur-sm"
  }
}

export default function HomePage() {
  const [featuredProjects, setFeaturedProjects] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedProjects()
  }, [])

  const fetchFeaturedProjects = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("platform", "buildunia")
        .order("created_at", { ascending: false })
        .limit(3)

      if (error) {
        console.error("Error fetching featured projects:", error)
        return
      }

      // Parse the prices JSON for each product
      const parsedProducts =
        data?.map((product: any) => ({
          ...product,
          prices: typeof product.prices === "string" ? JSON.parse(product.prices) : product.prices,
        })) || []

      setFeaturedProjects((parsedProducts as unknown as Product[]) || [])
    } catch (error) {
      console.error("Error fetching featured projects:", error)
    } finally {
      setLoading(false)
    }
  }

  const getProductPrice = (product: Product) => {
    try {
      const prices = typeof product.prices === "string" ? JSON.parse(product.prices) : product.prices
      return prices.full || product.price || 0
    } catch (error) {
      return product.price || 0
    }
  }

  const formatPrice = (price: number) => {
    if (!price || isNaN(price)) return "₹0"
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-black overflow-hidden relative">
      {/* Enhanced Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-purple-500 to-pink-500 opacity-10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] bg-gradient-to-r from-emerald-500 to-teal-500 opacity-5 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Floating Particles */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-white opacity-20 rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-purple-400 opacity-30 rounded-full animate-bounce delay-700"></div>
        <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-blue-400 opacity-25 rounded-full animate-bounce delay-1100"></div>
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-emerald-400 opacity-20 rounded-full animate-bounce delay-1500"></div>
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      {/* Enhanced Hero Section */}
      <section className="relative py-20 overflow-hidden min-h-[80vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/50 to-black"></div>
        
        {/* Animated Lines */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
          <div className="absolute top-2/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center">
            {/* Enhanced Floating Badge */}
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-full px-6 py-3 mb-8 shadow-2xl backdrop-blur-md hover:scale-105 transition-all duration-500 group">
              <div className="relative">
                <Star className="w-4 h-4 text-yellow-400 animate-spin group-hover:animate-pulse" />
                <div className="absolute inset-0 bg-yellow-400 opacity-20 rounded-full blur-md"></div>
              </div>
              <span className="text-sm font-semibold text-white tracking-wide">{"#1 IoT Learning Platform"}</span>
              <Sparkles className="w-3 h-3 text-purple-400 animate-pulse" />
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight">
              <span className="inline-block hover:scale-105 transition-transform duration-500">From Idea to IoT:</span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent animate-pulse bg-[length:200%_100%] animate-[gradient_3s_ease-in-out_infinite]">
                Build Your Future, Today
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
              Master IoT development with hands-on projects, expert mentorship, and a supportive community.
              <br />
              <span className="text-white font-semibold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Build real-world solutions that matter.
              </span>
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Button
                size="lg"
                className="text-lg px-10 py-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-2xl shadow-purple-500/25 transform hover:scale-110 hover:-translate-y-1 transition-all duration-500 font-bold rounded-2xl border border-purple-400/20 group"
                asChild
              >
                <Link href="/projects" className="flex items-center gap-3">
                  <Zap className="w-5 h-5 group-hover:animate-pulse" />
                  Explore Projects
                  <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-10 py-6 border-2 border-white/20 text-white hover:bg-white hover:text-black shadow-2xl transform hover:scale-110 hover:-translate-y-1 transition-all duration-500 font-bold rounded-2xl backdrop-blur-md bg-white/5 group"
                asChild
              >
                <Link href="/mentorship" className="flex items-center gap-3">
                  <Users className="w-5 h-5 group-hover:animate-bounce" />
                  Get Mentorship
                </Link>
              </Button>
            </div>

            {/* Enhanced Stats with Animation */}
            <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
              <div className="text-center group cursor-pointer">
                <div className="text-3xl md:text-5xl font-black text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text mb-2 group-hover:scale-110 transition-transform duration-500">500+</div>
                <div className="text-gray-400 text-xs uppercase tracking-wider font-semibold group-hover:text-white transition-colors">Projects Built</div>
                <div className="w-12 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mt-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <div className="text-center border-x border-gray-700/50 group cursor-pointer">
                <div className="text-3xl md:text-5xl font-black text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text mb-2 group-hover:scale-110 transition-transform duration-500">50+</div>
                <div className="text-gray-400 text-xs uppercase tracking-wider font-semibold group-hover:text-white transition-colors">Expert Mentors</div>
                <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto mt-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <div className="text-center group cursor-pointer">
                <div className="text-3xl md:text-5xl font-black text-transparent bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text mb-2 group-hover:scale-110 transition-transform duration-500">10k+</div>
                <div className="text-gray-400 text-xs uppercase tracking-wider font-semibold group-hover:text-white transition-colors">Students</div>
                <div className="w-12 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto mt-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce">
              <ChevronDown className="w-5 h-5 text-white/50" />
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Featured Projects */}
      <section className="relative py-20 bg-gradient-to-b from-black via-gray-900/50 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-full px-6 py-3 mb-6 shadow-xl backdrop-blur-md">
              <Code className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-semibold text-white uppercase tracking-wider">Featured Projects</span>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
              Start Your 
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent"> IoT Journey</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Discover our most popular projects designed to take you from beginner to expert
            </p>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center gap-4 text-white text-xl">
                <div className="w-6 h-6 border-3 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="font-medium">Loading featured projects...</span>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {featuredProjects.map((project, index) => (
                <Card
                  key={project.id}
                  className="bg-gradient-to-b from-gray-900/80 to-gray-800/80 border border-gray-700/50 hover:border-purple-500/50 shadow-2xl shadow-black/50 transform hover:scale-105 hover:-translate-y-4 transition-all duration-700 group overflow-hidden backdrop-blur-md relative"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  {/* Card Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-lg"></div>
                  
                  <CardHeader className="p-0 relative">
                    <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 relative overflow-hidden rounded-t-lg">
                      {project.image_url ? (
                        <img
                          src={project.image_url || "/placeholder.svg"}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-6xl text-gray-600 group-hover:text-purple-400 transition-colors duration-500">
                            <Code />
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>

                    <div className="p-8">
                      <div className="flex items-center justify-between mb-6">
                        <Badge
                          variant="outline"
                          className="border-purple-500/30 text-purple-300 bg-purple-500/10 backdrop-blur-sm font-semibold px-3 py-1"
                        >
                          {project.category}
                        </Badge>
                        <span className={getDifficultyColor(project.difficulty)}>{project.difficulty}</span>
                      </div>

                      <CardTitle className="text-white text-2xl mb-4 group-hover:text-purple-200 transition-colors font-bold">
                        {project.title}
                      </CardTitle>
                      <CardDescription className="text-gray-400 leading-relaxed text-base group-hover:text-gray-300 transition-colors">
                        {project.description}
                      </CardDescription>
                    </div>
                  </CardHeader>

                  <CardContent className="p-8 pt-0">
                    <div className="flex flex-wrap gap-2 mb-8">
                      {project.features?.slice(0, 3).map((feature: string) => (
                        <Badge
                          key={feature}
                          variant="secondary"
                          className="bg-gray-800/80 text-gray-300 border border-gray-600/50 hover:bg-purple-500/20 hover:border-purple-500/50 transition-all duration-300 backdrop-blur-sm"
                        >
                          {feature}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-black text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text">
                        {formatPrice(getProductPrice(project))}
                      </span>
                      <Button
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/25 transform hover:scale-110 transition-all duration-300 font-bold px-6 py-3 rounded-xl"
                        asChild
                      >
                        <Link href={`/projects/${titleToSlug(project.title)}`}>
                          View Details
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-16">
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-purple-500/50 text-white hover:bg-purple-500 hover:text-white shadow-2xl shadow-purple-500/25 transform hover:scale-110 hover:-translate-y-1 transition-all duration-500 font-bold px-8 py-5 text-lg bg-purple-500/10 backdrop-blur-md rounded-2xl"
              asChild
            >
              <Link href="/projects" className="flex items-center gap-3">
                View All Projects
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Enhanced Features */}
      <section className="relative py-20 bg-gradient-to-b from-black via-gray-900/30 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-full px-6 py-3 mb-6 shadow-xl backdrop-blur-md">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold text-white uppercase tracking-wider">Why Choose Us</span>
              <Sparkles className="w-3 h-3 text-emerald-400 animate-pulse" />
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
              Everything 
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent"> You Need</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Comprehensive tools and support to master IoT development from ground up
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center group transform hover:scale-110 transition-all duration-700 cursor-pointer"
                style={{ animationDelay: `${index * 300}ms` }}
              >
                <div className="relative mb-8">
                  <div className={`bg-gradient-to-br ${feature.gradient} rounded-2xl w-20 h-20 flex items-center justify-center mx-auto shadow-2xl group-hover:shadow-purple-500/25 transition-all duration-700 group-hover:rotate-12 relative z-10`}>
                    <feature.icon className="h-10 w-10 text-white" />
                  </div>
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-20 rounded-2xl w-20 h-20 mx-auto blur-2xl group-hover:opacity-60 group-hover:scale-150 transition-all duration-700`}></div>
                  
                  {/* Floating particles around icon */}
                  <div className="absolute top-0 left-1/2 w-1.5 h-1.5 bg-white opacity-0 group-hover:opacity-60 rounded-full transform -translate-x-1/2 group-hover:-translate-y-3 transition-all duration-700 delay-100"></div>
                  <div className="absolute bottom-0 left-1/3 w-1 h-1 bg-purple-400 opacity-0 group-hover:opacity-40 rounded-full group-hover:translate-y-3 transition-all duration-700 delay-200"></div>
                  <div className="absolute top-1/2 right-0 w-1 h-1 bg-cyan-400 opacity-0 group-hover:opacity-50 rounded-full group-hover:translate-x-3 transition-all duration-700 delay-300"></div>
                </div>

                <h3 className="text-2xl font-black mb-4 text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition-all duration-500">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed text-base group-hover:text-gray-300 transition-colors duration-500 max-w-sm mx-auto">
                  {feature.description}
                </p>
                
                {/* Hover line */}
                <div className="w-12 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 mx-auto mt-4 rounded-full opacity-0 group-hover:opacity-100 transform scale-x-0 group-hover:scale-x-100 transition-all duration-500"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Mentorship CTA */}
      <section className="relative py-20 bg-gradient-to-r from-purple-900/20 via-black to-cyan-900/20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
        
        {/* Enhanced Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-full px-6 py-3 mb-8 shadow-xl backdrop-blur-md">
            <Users className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-semibold text-white uppercase tracking-wider">Expert Mentorship</span>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          </div>

          <h2 className="text-4xl md:text-6xl font-black mb-8 text-white leading-tight">
            Ready to Level Up Your
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">IoT Skills?</span>
          </h2>

          <p className="text-xl md:text-2xl mb-12 text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Get personalized mentorship from IoT experts and accelerate your learning journey.
            <br />
            <span className="text-white font-semibold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              From code reviews to career guidance, we're here to help you succeed.
            </span>
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-2xl shadow-purple-500/25 transform hover:scale-110 hover:-translate-y-1 transition-all duration-500 font-bold px-10 py-6 text-lg rounded-2xl"
              asChild
            >
              <Link href="/mentorship" className="flex items-center gap-3">
                Learn About Mentorship
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white/20 text-white hover:bg-white hover:text-black shadow-2xl transform hover:scale-110 hover:-translate-y-1 transition-all duration-500 font-bold px-10 py-6 text-lg backdrop-blur-md bg-white/5 rounded-2xl"
              asChild
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>

          {/* Enhanced Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 max-w-3xl mx-auto">
            {[
              { value: "24/7", label: "Support", gradient: "from-purple-400 to-pink-400" },
              { value: "100%", label: "Satisfaction", gradient: "from-blue-400 to-cyan-400" },
              { value: "1:1", label: "Mentoring", gradient: "from-emerald-400 to-teal-400" },
              { value: "Live", label: "Sessions", gradient: "from-orange-400 to-red-400" }
            ].map((item, index) => (
              <div key={index} className="text-center group cursor-pointer">
                <div className={`text-2xl font-black text-transparent bg-gradient-to-r ${item.gradient} bg-clip-text mb-2 group-hover:scale-110 transition-transform duration-500`}>
                  {item.value}
                </div>
                <div className="text-gray-400 text-xs uppercase tracking-wider font-semibold group-hover:text-white transition-colors">
                  {item.label}
                </div>
                <div className={`w-10 h-1 bg-gradient-to-r ${item.gradient} mx-auto mt-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Testimonials Section */}
      <section className="relative py-20 bg-gradient-to-b from-black via-gray-900/30 to-black overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-64 h-64 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-full px-6 py-3 mb-6 shadow-xl backdrop-blur-md">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-xs font-semibold text-white uppercase tracking-wider">Success Stories</span>
              <Sparkles className="w-3 h-3 text-yellow-400 animate-pulse" />
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
              What Our 
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent"> Students Say</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Priya Sharma",
                role: "IoT Developer",
                content: "The hands-on approach transformed my understanding of IoT. From zero to building smart home systems!",
                rating: 5,
                avatar: "PS"
              },
              {
                name: "Arjun Patel",
                role: "Electronics Engineer",
                content: "Expert mentorship made all the difference. I landed my dream job at a leading IoT company.",
                rating: 5,
                avatar: "AP"
              },
              {
                name: "Sneha Reddy",
                role: "Tech Entrepreneur",
                content: "The projects are industry-relevant and practical. I started my own IoT consultancy firm!",
                rating: 5,
                avatar: "SR"
              }
            ].map((testimonial, index) => (
              <Card key={index} className="bg-gradient-to-b from-gray-900/80 to-gray-800/80 border border-gray-700/50 hover:border-yellow-500/50 shadow-2xl backdrop-blur-md transform hover:scale-105 hover:-translate-y-2 transition-all duration-500 group">
                <CardContent className="p-8">
                  {/* Stars */}
                  <div className="flex gap-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  
                  <p className="text-gray-300 leading-relaxed mb-8 text-lg group-hover:text-white transition-colors">
                    "{testimonial.content}"
                  </p>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-white text-lg">{testimonial.name}</div>
                      <div className="text-gray-400 text-sm">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Footer CTA */}
      <section className="relative py-16 bg-gradient-to-t from-gray-900 to-black border-t border-gray-800/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Start Your IoT Journey?
          </h3>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of students who are already building the future with IoT
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-xl transform hover:scale-105 transition-all duration-300 font-semibold px-8 py-5 text-base rounded-xl"
              asChild
            >
              <Link href="/projects">Get Started Today</Link>
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="text-white hover:text-purple-300 font-semibold px-8 py-5 text-base"
              asChild
            >
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}