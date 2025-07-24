'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Image from 'next/image';

// Mock data - replace with real data from Supabase
const allProjects = [
  {
    id: '1',
    name: 'Smart Home Automation',
    description: 'Build a complete IoT system to control lights, fans, and security systems using WiFi and mobile app.',
    price: 89.99,
    prices: {
      complete: 89.99,
      hardware: 69.99,
      mentorship: 49.99,
      mentorship_hardware: 109.99,
      other: 59.99,
    },
    image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80', // Smart home (living room with smart devices)
    difficulty: 'intermediate' as const,
    category: 'Arduino',
    skills: ['Arduino', 'WiFi', 'Sensors', 'Mobile App']
  },
  {
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
    image_url: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80', // Weather station (weather instruments)
    difficulty: 'beginner' as const,
    category: 'ESP32',
    skills: ['ESP32', 'Sensors', 'Cloud', 'Dashboard']
  },
  {
    id: '3',
    name: 'Smart Agriculture Monitor',
    description: 'Monitor soil moisture, temperature, humidity and automate irrigation systems with ML predictions.',
    price: 99.99,
    prices: {
      complete: 99.99,
      hardware: 79.99,
      mentorship: 59.99,
      mentorship_hardware: 119.99,
      other: 69.99,
    },
    image_url: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80', // Agriculture (field with sensors)
    difficulty: 'advanced' as const,
    category: 'Raspberry Pi',
    skills: ['Raspberry Pi', 'Python', 'Automation', 'ML']
  },
  {
    id: '4',
    name: 'Security Camera System',
    description: 'Build an intelligent security system with motion detection, alerts, and live streaming.',
    price: 129.99,
    prices: {
      complete: 129.99,
      hardware: 109.99,
      mentorship: 69.99,
      mentorship_hardware: 149.99,
      other: 89.99,
    },
    image_url: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80', // Security camera (CCTV)
    difficulty: 'advanced' as const,
    category: 'Raspberry Pi',
    skills: ['Raspberry Pi', 'Camera', 'AI', 'Streaming']
  },
  {
    id: '5',
    name: 'LED Matrix Display',
    description: 'Create colorful LED displays with animations, text scrolling, and app control.',
    price: 49.99,
    prices: {
      complete: 49.99,
      hardware: 39.99,
      mentorship: 29.99,
      mentorship_hardware: 59.99,
      other: 19.99,
    },
    image_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80', // LED display (LED wall)
    difficulty: 'beginner' as const,
    category: 'Arduino',
    skills: ['Arduino', 'LED', 'Animation', 'Bluetooth']
  },
  {
    id: '6',
    name: 'Environmental Monitor',
    description: 'Track air quality, noise levels, and environmental conditions with data visualization.',
    price: 79.99,
    prices: {
      complete: 79.99,
      hardware: 59.99,
      mentorship: 39.99,
      mentorship_hardware: 99.99,
      other: 49.99,
    },
    image_url: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80', // Environmental monitor (air quality sensor)
    difficulty: 'intermediate' as const,
    category: 'ESP32',
    skills: ['ESP32', 'Sensors', 'Data Viz', 'API']
  }
]

const categories = ['All', 'Arduino', 'ESP32', 'Raspberry Pi']
const difficulties = ['All', 'beginner', 'intermediate', 'advanced']

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedDifficulty, setSelectedDifficulty] = useState('All')

  const filteredProjects = allProjects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === 'All' || project.difficulty === selectedDifficulty
    
    return matchesSearch && matchesCategory && matchesDifficulty
  })

  return (
    <div className="min-h-screen bg-black">
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {difficulties.map(difficulty => (
                    <SelectItem key={difficulty} value={difficulty}>
                      {difficulty === 'All' ? 'All Levels' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No projects found matching your criteria.</p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('All')
                  setSelectedDifficulty('All')
                }}
                className="mt-4"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-gray-600">
                  Showing {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map((project) => (
                  <Card key={project.id} className="hover:shadow-lg transition-shadow">
                    <Image src={project.image_url} alt={project.name} width={600} height={338} className="aspect-video w-full object-cover rounded-t-lg" />
                    <div className="aspect-video bg-gray-200 rounded-t-lg relative hidden" />
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl">{project.name}</CardTitle>
                        <Badge variant="outline">{project.category}</Badge>
                      </div>
                      <CardDescription className="line-clamp-2">
                        {project.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.skills.slice(0, 4).map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-blue-600">
                          ₹{project.price}
                        </span>
                        <Button asChild>
                          <Link href={`/projects/${project.id}`}>View Details</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
      {/* Custom Project CTA */}
      <section className="py-12 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-4">Want a Custom Project?</h2>
          <p className="text-lg text-gray-300 mb-4">
            If you want to get or build any custom IoT project, feel free to contact us at
            <a href="mailto:buildunia.codeunia@gmail.com" className="text-blue-400 underline ml-1">buildunia.codeunia@gmail.com</a>.
            We love helping you bring your ideas to life!
          </p>
        </div>
      </section>
    </div>
  )
}
