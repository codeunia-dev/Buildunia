import Link from 'next/link'
import { CheckCircle, Clock, Users, Video, MessageCircle, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const mentorshipPackages = [
  {
    id: 'single',
    name: 'Single Session',
    price: 49,
    description: 'Perfect for getting unstuck on a specific problem or getting quick guidance.',
    duration: '1 hour',
    features: [
      '1-on-1 video call with IoT expert',
      'Code review and debugging help',
      'Project guidance and recommendations',
      'Career advice and industry insights',
      'Follow-up notes and resources'
    ],
    popular: false
  },
  {
    id: 'monthly',
    name: 'Monthly Package',
    price: 149,
    description: 'Ongoing support throughout your IoT learning journey.',
    duration: '4 sessions per month',
    features: [
      '4 one-hour sessions per month',
      'Priority scheduling and support',
      'Custom learning roadmap',
      'Code reviews and project feedback',
      'Access to exclusive resources',
      'Direct messaging between sessions',
      'Resume and portfolio review'
    ],
    popular: true
  },
  {
    id: 'intensive',
    name: 'Intensive Program',
    price: 399,
    description: 'Comprehensive 3-month program for serious learners.',
    duration: '3 months',
    features: [
      '12 one-hour sessions over 3 months',
      'Structured learning curriculum',
      'Personal project development',
      'Industry networking opportunities',
      'Job search and interview preparation',
      'Certification upon completion',
      '24/7 community access',
      'Lifetime access to resources'
    ],
    popular: false
  }
]

const mentorProfile = {
  name: 'Dr. Alex Chen',
  title: 'Senior IoT Engineer & Mentor',
  experience: '8+ years',
  companies: ['Google', 'Tesla', 'Startup Founder'],
  expertise: ['IoT Architecture', 'Embedded Systems', 'Cloud Integration', 'AI/ML'],
  students: '200+',
  rating: 4.9,
  bio: `Dr. Alex Chen is a senior IoT engineer with over 8 years of experience building large-scale IoT systems at leading tech companies. He has mentored over 200 students and professionals, helping them transition into IoT careers and advance their skills. Alex is passionate about making IoT accessible to everyone and believes in hands-on learning combined with strong theoretical foundations.`
}

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Software Engineer at Microsoft',
    content: 'Alex helped me transition from web development to IoT. His mentorship was instrumental in landing my dream job.',
    rating: 5
  },
  {
    name: 'Michael Rodriguez',
    role: 'IoT Consultant',
    content: 'The monthly package gave me the consistent support I needed. Alex is incredibly knowledgeable and patient.',
    rating: 5
  },
  {
    name: 'Emily Chen',
    role: 'Engineering Student',
    content: 'The intensive program was life-changing. I went from complete beginner to building complex IoT systems.',
    rating: 5
  }
]

export default function MentorshipPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Accelerate Your IoT Journey with
            <span className="text-blue-600"> Expert Mentorship</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Get personalized guidance from industry experts who have built IoT systems at scale. 
            From code reviews to career advice, we're here to help you succeed.
          </p>
          <Button size="lg" asChild>
            <Link href="#packages">Choose Your Package</Link>
          </Button>
        </div>
      </section>

      {/* Mentor Profile */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Your Mentor</h2>
            <p className="text-xl text-gray-600">Learn from an industry expert with real-world experience</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="w-64 h-64 bg-gray-200 rounded-full mx-auto mb-8 flex items-center justify-center">
                {/* Placeholder for mentor photo */}
                <span className="text-gray-400">Mentor Photo</span>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{mentorProfile.name}</h3>
              <p className="text-lg text-blue-600 mb-4">{mentorProfile.title}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Experience</p>
                  <p className="font-semibold">{mentorProfile.experience}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Students Mentored</p>
                  <p className="font-semibold">{mentorProfile.students}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Rating</p>
                  <p className="font-semibold">{mentorProfile.rating} ⭐</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Companies</p>
                  <p className="font-semibold">{mentorProfile.companies.join(', ')}</p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-2">Expertise</p>
                <div className="flex flex-wrap gap-2">
                  {mentorProfile.expertise.map((skill) => (
                    <Badge key={skill} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </div>

              <p className="text-gray-600">{mentorProfile.bio}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mentorship Packages */}
      <section id="packages" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Mentorship Package</h2>
            <p className="text-xl text-gray-600">Flexible options to fit your learning style and budget</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {mentorshipPackages.map((pkg) => (
              <Card key={pkg.id} className={`relative ${pkg.popular ? 'ring-2 ring-blue-500' : ''}`}>
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                  <CardDescription>{pkg.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">${pkg.price}</span>
                    <span className="text-gray-500">/{pkg.duration}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" variant={pkg.popular ? "default" : "outline"}>
                    {pkg.id === 'single' ? 'Book Session' : 'Get Started'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How Mentorship Works</h2>
            <p className="text-xl text-gray-600">A simple process designed for maximum learning</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">1. Schedule</h3>
              <p className="text-gray-600">Book your session at a time that works for you</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Video className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">2. Connect</h3>
              <p className="text-gray-600">Join a 1-on-1 video call with your mentor</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">3. Learn</h3>
              <p className="text-gray-600">Get personalized guidance and feedback</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">4. Apply</h3>
              <p className="text-gray-600">Implement what you learned in your projects</p>
            </div>
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What You Get</h2>
            <p className="text-xl text-gray-600">Comprehensive support for your IoT journey</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <Video className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Live Video Sessions</h3>
              <p className="text-gray-600">Face-to-face guidance with screen sharing and interactive problem solving</p>
            </div>
            
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Code Reviews</h3>
              <p className="text-gray-600">Get your code reviewed by experts and learn best practices</p>
            </div>
            
            <div className="text-center">
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Career Guidance</h3>
              <p className="text-gray-600">Resume reviews, interview prep, and industry networking</p>
            </div>
            
            <div className="text-center">
              <MessageCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Ongoing Support</h3>
              <p className="text-gray-600">Message your mentor between sessions for quick questions</p>
            </div>
            
            <div className="text-center">
              <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Flexible Scheduling</h3>
              <p className="text-gray-600">Book sessions at times that work with your schedule</p>
            </div>
            
            <div className="text-center">
              <Badge className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Resources & Tools</h3>
              <p className="text-gray-600">Access to exclusive learning materials and development tools</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Success Stories</h2>
            <p className="text-xl text-gray-600">Hear from students who transformed their careers</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400">⭐</span>
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
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

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Mentorship Journey?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of students who have accelerated their IoT careers with expert guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary">
              Book a Free Consultation
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              View All Packages
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
