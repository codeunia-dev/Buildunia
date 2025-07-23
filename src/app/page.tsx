import Link from 'next/link'
import { ArrowRight, Code, Cpu, Users, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// Mock data - replace with real data from Supabase
const featuredProjects = [
  {
    id: '1',
    name: 'Smart Home Automation',
    description: 'Build a complete IoT system to control lights, fans, and security',
    price: 89.99,
    image_url: '/placeholder-project.jpg',
    difficulty: 'intermediate' as const,
    category: 'Arduino',
    skills: ['Arduino', 'WiFi', 'Sensors', 'Mobile App']
  },
  {
    id: '2',
    name: 'Weather Station',
    description: 'Create a professional weather monitoring system with cloud data',
    price: 69.99,
    image_url: '/placeholder-project.jpg',
    difficulty: 'beginner' as const,
    category: 'ESP32',
    skills: ['ESP32', 'Sensors', 'Cloud', 'Dashboard']
  },
  {
    id: '3',
    name: 'Smart Agriculture Monitor',
    description: 'Monitor soil moisture, temperature, and automate irrigation',
    price: 99.99,
    image_url: '/placeholder-project.jpg',
    difficulty: 'advanced' as const,
    category: 'Raspberry Pi',
    skills: ['Raspberry Pi', 'Python', 'Automation', 'ML']
  }
]

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Computer Science Student',
    content: 'BuildUnia helped me understand IoT concepts through hands-on projects. The mentorship was invaluable for my career.',
    rating: 5
  },
  {
    name: 'Michael Rodriguez',
    role: 'Engineering Student',
    content: 'The project kits are well-designed and the instructions are clear. Perfect for learning while building real things.',
    rating: 5
  },
  {
    name: 'Emma Thompson',
    role: 'Tech Enthusiast',
    content: 'Amazing platform! I built my first IoT project in just a weekend. The community support is fantastic.',
    rating: 5
  }
]

const features = [
  {
    icon: Code,
    title: 'Hands-On Learning',
    description: 'Learn by building real IoT projects with complete component kits and step-by-step guides.'
  },
  {
    icon: Users,
    title: 'Expert Mentorship',
    description: 'Get personalized guidance from experienced IoT professionals to accelerate your learning.'
  },
  {
    icon: Cpu,
    title: 'Latest Technology',
    description: 'Work with cutting-edge IoT platforms like Arduino, ESP32, and Raspberry Pi.'
  }
]

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner': return 'bg-green-500/20 text-green-300 border border-green-600 shadow-sm rounded-full px-3 py-1 font-semibold tracking-wide backdrop-blur-sm'
    case 'intermediate': return 'bg-yellow-400/20 text-yellow-200 border border-yellow-500 shadow-sm rounded-full px-3 py-1 font-semibold tracking-wide backdrop-blur-sm'
    case 'advanced': return 'bg-red-500/20 text-red-300 border border-red-600 shadow-sm rounded-full px-3 py-1 font-semibold tracking-wide backdrop-blur-sm'
    default: return 'bg-gray-700 text-gray-200 border border-gray-500 shadow-sm rounded-full px-3 py-1 font-semibold tracking-wide backdrop-blur-sm'
  }
}

export default function HomePage() {
  return (
    <div className="min-h-screen !bg-black">
      {/* Hero Section */}
      <section className="!bg-black py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              From Idea to IoT:
              <span className="text-blue-400"> Build Your Future, Today</span>
            </h1>
            <p className="text-xl text-gray-100 mb-8 max-w-3xl mx-auto">
              Unlock the world of Internet of Things through hands-on project kits designed for college students and tech enthusiasts. Learn, build, and get mentored by experts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/projects">
                  Explore Projects <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/mentorship">Learn About Mentorship</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 !bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-100">
              Your journey to IoT mastery in three simple steps
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Pick a Project</h3>
              <p className="text-gray-200">Choose from our curated collection of IoT projects designed for different skill levels.</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Build & Learn</h3>
              <p className="text-gray-200">Follow our detailed guides and build real IoT solutions with all components included.</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Get Mentorship</h3>
              <p className="text-gray-200">Connect with IoT experts for personalized guidance and career advice.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Featured Projects
            </h2>
            <p className="text-xl text-gray-100">
              Start your IoT journey with these popular projects
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {featuredProjects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gray-200 rounded-t-lg"></div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{project.name}</CardTitle>
                    <Badge className={getDifficultyColor(project.difficulty)}>
                      {project.difficulty}
                    </Badge>
                  </div>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.skills.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-blue-600">
                      ${project.price}
                    </span>
                    <Button asChild>
                      <Link href={`/projects/${project.id}`}>View Details</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" asChild>
              <Link href="/projects">View All Projects</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 !bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose BuildUnia?
            </h2>
            <p className="text-xl text-gray-100">
              Everything you need to master IoT development
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                <p className="text-gray-200">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mentorship CTA */}
      <section className="py-20 bg-blue-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Level Up Your IoT Skills?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Get personalized mentorship from IoT experts and accelerate your learning journey. 
            From code reviews to career guidance, we&apos;re here to help you succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/mentorship">
                Learn About Mentorship <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              What Students Say
            </h2>
            <p className="text-xl text-gray-100">
              Join thousands of students who&apos;ve transformed their IoT skills
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">&quot;{testimonial.content}&quot;</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
