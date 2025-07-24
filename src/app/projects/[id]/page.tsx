'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ShoppingCart, Star, CheckCircle, Cpu, Wrench } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/contexts/CartContext'
import { Project } from '@/lib/supabase';

// Mock data - replace with real data from Supabase
const projectData: { [key: string]: Project } = {
  '1': {
    id: '1',
    name: 'Smart Home Automation',
    description: 'Build a complete IoT system to control lights, fans, and security systems using WiFi and mobile app. This comprehensive project teaches you the fundamentals of home automation while giving you hands-on experience with real IoT hardware.',
    price: 89.99,
    prices: {
      complete: 89.99,
      hardware: 69.99,
      mentorship: 49.99,
      mentorship_hardware: 109.99,
      other: 59.99,
    },
    image_url: '/placeholder-project.jpg',
    difficulty: 'intermediate',
    category: 'Arduino',
    skills: ['Arduino Programming', 'WiFi Connectivity', 'Sensor Integration', 'Mobile App Development'],
    components: [
      'Arduino Uno R3',
      'ESP8266 WiFi Module',
      'Relay Module (4-channel)',
      'PIR Motion Sensor',
      'Temperature & Humidity Sensor',
      'LED Strips',
      'Breadboard & Jumper Wires',
      'Power Supply',
      'Project Enclosure'
    ],
    image_path: '',
    created_at: '',
    updated_at: ''
  },
  '2': {
    id: '2',
    name: 'Weather Station',
    description: 'Create a professional weather monitoring system with cloud data logging and real-time dashboard.',
    price: 69.99,
    prices: {
      complete: 69.99,
      hardware: 49.99,
      mentorship: 39.99,
      mentorship_hardware: 89.99,
      other: 29.99,
    },
    image_url: '/placeholder-project.jpg',
    difficulty: 'beginner',
    category: 'ESP32',
    skills: ['ESP32', 'Sensors', 'Cloud', 'Dashboard'],
    components: [
      'ESP32 Development Board',
      'BME280 Sensor',
      'Rain Sensor',
      'Wind Speed Sensor',
      'Solar Panel',
      'Battery Pack',
      'Weatherproof Enclosure'
    ],
    image_path: '',
    created_at: '',
    updated_at: ''
  }
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner': return 'bg-green-100 text-green-800'
    case 'intermediate': return 'bg-yellow-100 text-yellow-800'
    case 'advanced': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

export default function ProjectDetailPage() {
  const params = useParams()
  const { addItem } = useCart()
  const [addedToCart, setAddedToCart] = useState(false)
  
  const projectId = params.id as string
  const project = projectData[projectId]

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h1>
          <p className="text-gray-600 mb-6">The project you&apos;re looking for doesn&apos;t exist.</p>
          <Button asChild>
            <Link href="/projects">Back to Projects</Link>
          </Button>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    addItem(project)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button variant="ghost" asChild className="mb-2">
            <Link href="/projects">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Link>
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column - Images */}
          <div>
            <div className="aspect-square bg-gray-200 rounded-lg mb-4">
              {/* Placeholder for project image */}
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                Project Image
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded cursor-pointer hover:opacity-80">
                  {/* Placeholder for additional images */}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Details */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Badge className={getDifficultyColor(project.difficulty)}>
                {project.difficulty}
              </Badge>
              <Badge variant="outline">{project.category}</Badge>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {project.name}
            </h1>
            
            <p className="text-gray-600 text-lg mb-6">
              {project.description}
            </p>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold text-blue-600">
                ₹{project.price}
              </span>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
                <span className="ml-2 text-gray-600">(4.8) 127 reviews</span>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              
            </div>

            <div className="flex gap-4 mb-8">
              <Button 
                size="lg" 
                className="flex-1"
                onClick={handleAddToCart}
                disabled={addedToCart}
              >
                {addedToCart ? (
                  <>
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart
                  </>
                )}
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/mentorship">Get Mentorship</Link>
              </Button>
            </div>

            {/* Skills You'll Gain */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Skills You&apos;ll Gain
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {project.skills.map((skill: string) => (
                    <Badge key={skill} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Detailed Information */}
        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Components Included */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Components Included
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {project.components.map((component: string, index: number) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">You&apos;ll get hands-on experience with real IoT hardware.</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Key Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Key Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                
              </ul>
            </CardContent>
          </Card>

          {/* What You'll Learn */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="h-5 w-5" />
                What You&apos;ll Learn
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
