'use client'

import Link from 'next/link'
import { CheckCircle, Users, Video, MessageCircle, Calendar, X, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'
import { useCart } from '@/contexts/CartContext'
import { useBuilduniaAuth } from '@/contexts/BuilduniaAuthContext'
import { useRouter } from 'next/navigation'

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

const mentors = [
  {
    name: 'Aayush Bhardwaj',
    title: 'Core Team Member, Codeunia | IoT & Java Backend Mentor',
    experience: '2+ years in tech education, backend development, and community leadership',
    students: '400+ learners through technical workshops, community sessions, and project guidance',
    rating: 4.8,
    highlights: [
      'Key contributor at Codeunia, one of India\'s fastest-growing student tech communities',
      'Guided 30+ real-world IoT and Java backend projects',
      'Hosted sessions on IoT systems, REST APIs, and real-world backend development',
      'Collaborated with GeeksforGeeks, Unstop, and university innovation platforms',
    ],
    expertise: ['Java Backend Development', 'IoT & Embedded Systems', 'REST APIs', 'Community-driven Learning', 'Project Building'],
    avatar: 'AB',
    bio: `Aayush believes in learning by building. From late-night coding sessions to mentoring student teams on real-world projects, he thrives on sharing knowledge and solving problems together. As a passionate contributor to Codeunia and the broader student tech ecosystem, Aayush inspires others to build with confidence and purpose.`
  },
  {
    name: 'Deepak Pandey',
    title: 'Founder, Codeunia | IoT & Embedded Systems Mentor',
    experience: '3+ years in tech education & product development',
    students: '600+ learners across India',
    rating: 4.9,
    highlights: [
      'Led national workshops on IoT, AI, and automation',
      'Built and mentored 50+ real-world IoT + AI student projects',
      'Founder of Codeunia, India\'s fastest-growing tech student community',
      'Featured in university innovation showcases and tech meetups',
    ],
    expertise: ['IoT Architecture', 'Embedded Systems', 'Firebase & Cloud', 'Automation', 'AI/ML Integration'],
    avatar: 'DP',
    bio: `Deepak combines deep technical knowledge with a passion for mentorship. As the driving force behind Codeunia and BuildUnia, he's helped hundreds of students overcome technical blocks and build projects they're proud to show off. His approach is simple: learn by doing, fail fast, and build with purpose.`
  },
  {
    name: 'Akshay Kumar',
    title: 'Full Stack Developer | Web Dev Lead at Codeunia | AI & Web Development Mentor',
    experience: '4+ years in full-stack development, AI integration & product innovation',
    students: '500+ learners through workshops, hackathons, and project guidance',
    rating: 4.9,
    highlights: [
      'Led 20+ national hackathons and tech events',
      'Built and deployed 15+ production web applications',
      'Key contributor at Codeunia, mentoring 100+ student projects',
      'Expert in AI integration and modern web technologies',
      'Collaborated with major tech platforms and universities',
    ],
    expertise: ['Full Stack Development', 'AI/ML Integration', 'React & Next.js', 'Node.js & Python', 'Product Development'],
    avatar: 'AK',
    bio: `Akshay is passionate about bridging the gap between theory and practice. With extensive experience in full-stack development and AI integration, he helps students build real-world applications that solve actual problems. His mentorship focuses on practical skills and industry best practices.`
  }
]

export default function MentorshipPage() {
  const { user } = useBuilduniaAuth()
  const { addItem } = useCart()
  const router = useRouter()
  const [selectedMentor, setSelectedMentor] = useState<typeof mentors[0] | null>(null)

  const handleBookSession = (pkg: typeof mentorshipPackages[0]) => {
    if (!user) {
      // Redirect to sign in if not authenticated
      router.push('/auth/signin')
      return
    }

    // Create a mentorship product object
    const mentorshipProduct = {
      id: `mentorship-${pkg.id}`,
      title: `${pkg.name} - IoT Mentorship`,
      description: pkg.description,
      image_url: '/images/mentorship.jpg',
      platform: 'buildunia' as const,
      category: 'Mentorship',
      difficulty: 'all-levels',
      duration: pkg.duration,
      price: pkg.price,
      prices: {
        full: pkg.price,
        hardware: 0,
        code: 0,
        mentorship: pkg.price,
        hardware_mentorship: 0,
        code_mentorship: 0
      },
      features: pkg.features,
      requirements: ['Basic programming knowledge', 'Computer with internet', 'Video calling capability'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // Add to cart and redirect to checkout
    addItem(mentorshipProduct)
    router.push('/checkout')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-gray-900 w-screen max-w-none overflow-x-hidden">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-black via-gray-950 to-gray-900 py-24 w-screen max-w-none px-0 sm:px-6 lg:px-8">
        <div className="w-full px-4 md:max-w-4xl md:mx-auto text-center">
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
      <section className="py-24 md:py-24 py-12 bg-gradient-to-b from-gray-950 to-black border-b border-blue-900/30 w-screen max-w-none px-0">
        <div className="w-full px-4 md:max-w-6xl md:mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 md:mb-4 tracking-tight">Meet Your Mentors</h2>
            <p className="text-base md:text-xl text-gray-400 font-light">Learn from real-world builders leading India&apos;s next-gen IoT movement</p>
          </div>
          <MentorCards onMentorClick={setSelectedMentor} />
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
                    <span className="text-5xl font-extrabold text-white drop-shadow-lg">₹{pkg.price}</span>
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
                  <Button 
                    className="w-full py-3 text-lg font-semibold shadow-md hover:scale-[1.03] transition-transform" 
                    variant={pkg.popular ? "default" : "outline"}
                    onClick={() => handleBookSession(pkg)}
                  >
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
                <Users className="h-10 w-10 text-blue-400 group-hover:animate-bounce" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">4. Grow</h3>
              <p className="text-gray-400 font-light">Apply your learning and continue building</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-b from-black to-gray-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6 tracking-tight">Ready to Accelerate Your Learning?</h2>
          <p className="text-xl text-gray-300 mb-8 font-light">
            Join hundreds of students who have transformed their IoT skills through expert mentorship.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-4 shadow-xl hover:scale-105 transition-transform" asChild>
              <Link href="#packages">View Packages</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-gray-900 transition-all" asChild>
              <Link href="/projects">Browse Projects</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Mentor Modal */}
      {selectedMentor && (
        <MentorModal mentor={selectedMentor} onClose={() => setSelectedMentor(null)} />
      )}
    </div>
  )
}

function MentorCards({ onMentorClick }: { onMentorClick: (mentor: typeof mentors[0]) => void }) {
  return (
    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
      {mentors.map((mentor, index) => (
        <Card 
          key={index} 
          className="bg-gradient-to-br from-gray-800 to-gray-900 border-0 shadow-xl rounded-xl overflow-hidden hover:scale-105 transition-transform cursor-pointer group max-w-sm mx-auto"
          onClick={() => onMentorClick(mentor)}
        >
          <CardHeader className="text-center pb-3">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform">
              <span className="text-white font-bold text-lg">{mentor.avatar}</span>
            </div>
            <CardTitle className="text-xl text-white font-bold mb-1">{mentor.name}</CardTitle>
            <CardDescription className="text-gray-300 text-xs font-medium line-clamp-2">{mentor.title}</CardDescription>
            <div className="flex items-center justify-center gap-2 mt-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-3 h-3 ${i < Math.floor(mentor.rating) ? 'text-yellow-400 fill-current' : 'text-gray-600'}`}
                  />
                ))}
              </div>
              <span className="text-gray-400 text-xs">({mentor.rating})</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 px-4 pb-4">
            <div className="text-center">
              <p className="text-gray-300 text-xs mb-2 line-clamp-2">{mentor.bio}</p>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-1">Experience</h4>
              <p className="text-gray-400 text-xs mb-1">{mentor.experience}</p>
              <p className="text-gray-400 text-xs">{mentor.students} students mentored</p>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-1">Expertise</h4>
              <div className="flex flex-wrap gap-1">
                {mentor.expertise.slice(0, 2).map((skill, skillIndex) => (
                  <Badge key={skillIndex} variant="outline" className="text-xs bg-blue-900/20 border-blue-500/30 text-blue-300 px-1 py-0">
                    {skill}
                  </Badge>
                ))}
                {mentor.expertise.length > 2 && (
                  <Badge variant="outline" className="text-xs bg-gray-700/20 border-gray-500/30 text-gray-300 px-1 py-0">
                    +{mentor.expertise.length - 2} more
                  </Badge>
                )}
              </div>
            </div>
            <div className="text-center pt-1">
              <Button variant="outline" size="sm" className="text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-white text-xs px-3 py-1">
                View Full Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function MentorModal({ mentor, onClose }: { mentor: typeof mentors[0]; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">{mentor.avatar}</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{mentor.name}</h2>
                <p className="text-gray-300 text-sm">{mentor.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < Math.floor(mentor.rating) ? 'text-yellow-400 fill-current' : 'text-gray-600'}`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-400 text-sm">({mentor.rating})</span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white hover:bg-gray-700"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">About</h3>
              <p className="text-gray-300 leading-relaxed">{mentor.bio}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Experience</h3>
              <p className="text-gray-300 mb-2">{mentor.experience}</p>
              <p className="text-gray-300">{mentor.students} students mentored</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {mentor.expertise.map((skill, skillIndex) => (
                  <Badge key={skillIndex} variant="outline" className="bg-blue-900/20 border-blue-500/30 text-blue-300">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Highlights & Achievements</h3>
              <ul className="space-y-2">
                {mentor.highlights.map((highlight, highlightIndex) => (
                  <li key={highlightIndex} className="text-gray-300 flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex gap-4 mt-8 pt-6 border-t border-gray-700">
            <Button 
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => {
                onClose()
                // Scroll to packages section
                document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              Book Session with {mentor.name}
            </Button>
            <Button 
              variant="outline" 
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
