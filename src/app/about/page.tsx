import Link from 'next/link'
import { Code, Users, Target, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 to-blue-900 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            About BuildUnia
          </h1>
          <p className="text-xl text-gray-300">
            We&apos;re passionate about making IoT accessible to everyone.
          </p>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">Our Mission</h2>
          <p className="text-lg text-gray-300 leading-relaxed">
            At BuildUnia, a Codeunia product, we believe that the best way to learn IoT is through hands-on experience. We create comprehensive project kits that combine carefully selected hardware with expert guidance, making it easy for students and enthusiasts to build real IoT solutions. Our goal is to empower the next generation of innovators with the skills and confidence to shape the connected world of tomorrow.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Our Impact</h2>
            <p className="text-xl text-gray-300">Making a difference in IoT education worldwide</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-blue-400 mb-2">{stat.number}</div>
                <div className="text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Our Values</h2>
            <p className="text-xl text-gray-300">The principles that guide everything we do</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-white">
                    <value.icon className="h-8 w-8 text-blue-400" />
                    {value.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Story / Mission Section */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">BuildUnia: Bridging the Gap Between Learning and Building</h2>
          <p className="text-xl mb-8 opacity-90">
            BuildUnia was born from a simple yet powerful insight: while IoT is transforming industries globally, students often lack the hands-on experience and practical exposure needed to truly grasp and implement these technologies.
          </p>
          <p className="mb-6">
            In 2025, Deepak Pandey, the founder of Codeunia, recognized this gap while leading workshops and mentoring hundreds of engineering students across India. Despite having strong theoretical knowledge, many students found it difficult to apply IoT concepts to real-world projects. The issue wasn’t a lack of potential—it was the absence of structured guidance, accessible tools, and community-driven support.
          </p>
          <p className="mb-6">
            Determined to change this, Deepak launched BuildUnia—a practical initiative under the Codeunia umbrella aimed at delivering end-to-end IoT learning experiences. It began with curated IoT project kits, live mentoring sessions, and an active support network. Students who once hesitated to even connect a sensor were soon building their own smart home systems, environmental monitors, and campus automation projects.
          </p>
          <p className="mb-6">
            Today, BuildUnia continues to empower learners with industry-relevant IoT experiences, turning classrooms into innovation labs. With a growing community and partnerships in progress, our goal remains the same: to make hands-on IoT education accessible, engaging, and impactful for every student, everywhere.
          </p>
        </div>
      </section>

      {/* Team section removed as requested */}

      {/* CTA */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your IoT Journey?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of students who&apos;ve transformed their understanding of IoT through 
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
