import Link from 'next/link'
import { Code, Heart, Users, Target, Award, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const values = [
  {
    icon: Code,
    title: 'Hands-On Learning',
    description: 'We believe in learning by doing. Every project is designed to give you practical, real-world experience.'
  },
  {
    icon: Users,
    title: 'Community First',
    description: 'Building a supportive community where learners help each other grow and succeed together.'
  },
  {
    icon: Target,
    title: 'Quality Focus',
    description: 'We curate only the best projects and components, ensuring you get maximum value from your investment.'
  },
  {
    icon: Globe,
    title: 'Accessible Education',
    description: 'Making IoT education accessible to students and enthusiasts worldwide, regardless of background.'
  }
]

const stats = [
  { number: '500+', label: 'Students Taught' },
  { number: '50+', label: 'Projects Created' },
  { number: '25+', label: 'Countries Reached' },
  { number: '98%', label: 'Satisfaction Rate' }
]

const team = [
  {
    name: 'Dr. Alex Chen',
    role: 'Founder & Lead Mentor',
    bio: 'Former IoT engineer at Google and Tesla with 8+ years of experience building large-scale IoT systems.',
    image: '/placeholder-team.jpg'
  },
  {
    name: 'Sarah Kim',
    role: 'Content Creator',
    bio: 'Educational specialist with a passion for making complex technical concepts accessible to everyone.',
    image: '/placeholder-team.jpg'
  },
  {
    name: 'Michael Rodriguez',
    role: 'Hardware Specialist',
    bio: 'Electronics engineer with expertise in embedded systems and hardware design for IoT applications.',
    image: '/placeholder-team.jpg'
  }
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About BuildUnia
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            A Codeunia product on a mission to democratize IoT education by providing hands-on learning experiences 
            that bridge the gap between theory and real-world application.
          </p>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Mission</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            At BuildUnia, a Codeunia product, we believe that the best way to learn IoT is through hands-on experience. 
            We create comprehensive project kits that combine carefully selected hardware with 
            expert guidance, making it easy for students and enthusiasts to build real IoT solutions. 
            Our goal is to empower the next generation of innovators with the skills and confidence 
            to shape the connected world of tomorrow.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Impact</h2>
            <p className="text-xl text-gray-600">Making a difference in IoT education worldwide</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600">The principles that guide everything we do</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <value.icon className="h-8 w-8 text-blue-600" />
                    {value.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
          </div>
          <div className="prose prose-lg mx-auto text-gray-600">
            <p>
              BuildUnia was born from a simple observation: while IoT technology was revolutionizing 
              industries worldwide, there was a significant gap between academic theory and 
              practical application for students and enthusiasts.
            </p>
            <p>
              As an IoT engineer working at major tech companies, our founder Dr. Alex Chen 
              noticed that many brilliant computer science and engineering students struggled 
              to translate their theoretical knowledge into working IoT systems. The missing 
              piece wasn't intelligence or motivation—it was access to proper guidance and 
              real-world project experience.
            </p>
            <p>
              In 2023, Alex decided to change that. He started by mentoring a few students 
              personally, creating custom project kits that combined all the necessary hardware 
              with detailed instructions and expert support. The results were remarkable—students 
              who had been struggling with IoT concepts suddenly found themselves building 
              sophisticated systems with confidence.
            </p>
            <p>
              Word spread quickly, and what started as informal mentoring grew into BuildUnia—a 
              comprehensive platform under the Codeunia umbrella that makes high-quality IoT education accessible to 
              students and enthusiasts worldwide. Today, we continue to expand our offerings 
              while staying true to our core mission: empowering learners through hands-on 
              experience and expert guidance.
            </p>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600">The passionate people behind BuildUnia</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index}>
                <CardContent className="pt-6 text-center">
                  <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
                  <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
                  <p className="text-blue-600 mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your IoT Journey?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of students who have transformed their understanding of IoT through 
            hands-on learning and expert mentorship.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/projects">Browse Projects</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600" asChild>
              <Link href="/mentorship">Get Mentorship</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
