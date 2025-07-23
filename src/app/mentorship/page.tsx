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
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-black via-gray-950 to-gray-900 py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight drop-shadow-lg">
            Accelerate Your IoT Journey with
            <span className="text-blue-500"> Expert Mentorship</span>
          </h1>
          <p className="text-2xl text-gray-300 mb-10 font-light">
            Get personalized guidance from industry experts who have built IoT systems at scale. 
            From code reviews to career advice, we&apos;re here to help you succeed.
          </p>
          <Button size="lg" className="text-lg px-8 py-4 shadow-xl hover:scale-105 transition-transform" asChild>
            <Link href="#packages">Choose Your Package</Link>
          </Button>
        </div>
      </section>

      {/* Mentor Profile */}
      <section className="py-20 bg-gradient-to-b from-gray-950 to-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">Meet Your Mentor</h2>
            <p className="text-xl text-gray-400 font-light">Learn from an industry expert with real-world experience</p>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="w-64 h-64 bg-gradient-to-br from-blue-900 to-gray-800 rounded-full mx-auto mb-8 flex items-center justify-center shadow-2xl border-4 border-blue-700">
                {/* Placeholder for mentor photo */}
                <span className="text-gray-400 text-2xl font-bold">AC</span>
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-white mb-2">{mentorProfile.name}</h3>
              <p className="text-lg text-blue-400 mb-4 font-semibold">{mentorProfile.title}</p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-400">Experience</p>
                  <p className="font-semibold text-white">{mentorProfile.experience}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Students Mentored</p>
                  <p className="font-semibold text-white">{mentorProfile.students}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Rating</p>
                  <p className="font-semibold text-white flex items-center">{mentorProfile.rating} <span className="ml-1">⭐</span></p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Companies</p>
                  <p className="font-semibold text-white">{mentorProfile.companies.join(', ')}</p>
                </div>
              </div>
              <div className="mb-6">
                <p className="text-sm text-gray-400 mb-2">Expertise</p>
                <div className="flex flex-wrap gap-2">
                  {mentorProfile.expertise.map((skill) => (
                    <Badge key={skill} variant="secondary" className="bg-blue-800 text-white px-3 py-1 rounded-full text-xs font-medium">{skill}</Badge>
                  ))}
                </div>
              </div>
              <p className="text-gray-300 text-lg font-light">{mentorProfile.bio}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mentorship Packages */}
      <section id="packages" className="py-24 bg-gradient-to-b from-gray-900 to-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">Choose Your Mentorship Package</h2>
            <p className="text-xl text-gray-300 font-light">Flexible options to fit your learning style and budget</p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {mentorshipPackages.map((pkg) => (
              <Card key={pkg.id} className={`relative bg-gradient-to-br from-gray-800 to-gray-900 border-0 shadow-xl rounded-2xl transition-transform hover:scale-105 ${pkg.popular ? 'ring-4 ring-blue-500' : ''}`}>
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white px-4 py-1 rounded-full shadow-lg">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-3xl text-white font-bold mb-2">{pkg.name}</CardTitle>
                  <CardDescription className="text-gray-300 text-lg mb-2 font-light">{pkg.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-5xl font-extrabold text-white drop-shadow-lg">${pkg.price}</span>
                    <span className="text-gray-400 text-lg">/{pkg.duration}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0 mt-0.5 transition-transform hover:scale-110" />
                        <span className="text-base text-gray-200 font-light">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full py-3 text-lg font-semibold shadow-md hover:scale-[1.03] transition-transform" variant={pkg.popular ? "default" : "outline"}>
                    {pkg.id === 'single' ? 'Book Session' : 'Get Started'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gradient-to-b from-gray-950 to-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">How Mentorship Works</h2>
            <p className="text-xl text-gray-300 font-light">A simple process designed for maximum learning</p>
          </div>
          <div className="grid md:grid-cols-4 gap-10">
            <div className="text-center group">
              <div className="bg-gradient-to-br from-blue-900 to-gray-800 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform">
                <Calendar className="h-10 w-10 text-blue-400 group-hover:animate-bounce" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">1. Schedule</h3>
              <p className="text-gray-400 font-light">Book your session at a time that works for you</p>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-br from-blue-900 to-gray-800 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform">
                <Video className="h-10 w-10 text-blue-400 group-hover:animate-bounce" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">2. Connect</h3>
              <p className="text-gray-400 font-light">Join a 1-on-1 video call with your mentor</p>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-br from-blue-900 to-gray-800 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform">
                <MessageCircle className="h-10 w-10 text-blue-400 group-hover:animate-bounce" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">3. Learn</h3>
              <p className="text-gray-400 font-light">Get personalized guidance and feedback</p>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-br from-blue-900 to-gray-800 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform">
                <CheckCircle className="h-10 w-10 text-blue-400 group-hover:animate-bounce" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">4. Apply</h3>
              <p className="text-gray-400 font-light">Implement what you learned in your projects</p>
            </div>
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="py-24 bg-gradient-to-b from-gray-900 to-gray-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">What You Get</h2>
            <p className="text-xl text-gray-300 font-light">Comprehensive support for your IoT journey</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            <div className="text-center group">
              <div className="bg-gradient-to-br from-blue-900 to-gray-800 rounded-2xl w-24 h-24 flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-105 transition-transform">
                <Video className="h-12 w-12 text-blue-400 group-hover:animate-bounce" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Live Video Sessions</h3>
              <p className="text-gray-300 font-light">Face-to-face guidance with screen sharing and interactive problem solving</p>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-br from-blue-900 to-gray-800 rounded-2xl w-24 h-24 flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-105 transition-transform">
                <CheckCircle className="h-12 w-12 text-blue-400 group-hover:animate-bounce" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Code Reviews</h3>
              <p className="text-gray-300 font-light">Get your code reviewed by experts and learn best practices</p>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-br from-blue-900 to-gray-800 rounded-2xl w-24 h-24 flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-105 transition-transform">
                <Users className="h-12 w-12 text-blue-400 group-hover:animate-bounce" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Career Guidance</h3>
              <p className="text-gray-300 font-light">Resume reviews, interview prep, and industry networking</p>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-br from-blue-900 to-gray-800 rounded-2xl w-24 h-24 flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-105 transition-transform">
                <MessageCircle className="h-12 w-12 text-blue-400 group-hover:animate-bounce" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Ongoing Support</h3>
              <p className="text-gray-300 font-light">Message your mentor between sessions for quick questions</p>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-br from-blue-900 to-gray-800 rounded-2xl w-24 h-24 flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-105 transition-transform">
                <Clock className="h-12 w-12 text-blue-400 group-hover:animate-bounce" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Flexible Scheduling</h3>
              <p className="text-gray-300 font-light">Book sessions at times that work with your schedule</p>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-br from-blue-900 to-gray-800 rounded-2xl w-24 h-24 flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-105 transition-transform">
                <Badge className="h-12 w-12 text-blue-400 group-hover:animate-bounce" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Resources & Tools</h3>
              <p className="text-gray-300 font-light">Access to exclusive learning materials and development tools like &quot;IoT Starter Kit&quot; and &quot;Mentor Q&amp;A&quot;.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gradient-to-b from-black to-gray-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">Success Stories</h2>
            <p className="text-xl text-gray-300 font-light">
              Hear from students who transformed their careers
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-gradient-to-br from-gray-800 to-gray-900 border-0 shadow-xl rounded-2xl p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-blue-900 flex items-center justify-center mb-4 text-2xl font-bold text-white shadow-lg">
                  {testimonial.name.split(' ').map(n => n[0]).join('')}
                </div>
                <CardContent className="pt-0">
                  <div className="flex mb-4 justify-center">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-xl">⭐</span>
                    ))}
                  </div>
                  <p className="text-gray-200 mb-4 italic text-lg">&quot;{testimonial.content}&quot;</p>
                  <div>
                    <p className="font-semibold text-white">{testimonial.name}</p>
                    <p className="text-sm text-blue-300">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-black to-blue-950 text-white sticky bottom-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4 tracking-tight">Ready to Start Your Mentorship Journey?</h2>
          <p className="text-xl mb-8 opacity-90 font-light">
            Join hundreds of students who have accelerated their IoT careers with expert guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-4 shadow-xl hover:scale-105 transition-transform">
              Book a Free Consultation
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4 shadow-xl hover:scale-105 transition-transform">
              View All Packages
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
