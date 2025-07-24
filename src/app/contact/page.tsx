'use client'

import { Mail, Phone, MapPin, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const contactInfo = [
  {
    icon: Mail,
    title: 'Email',
    value: 'buildunia.codeunia@gmail.com',
    description: 'Send us an email anytime!'
  },
  {
    icon: Phone,
    title: 'Phone',
    value: '+91 8699025107',
    description: 'Mon-Fri from 8am to 6pm IST'
  },
  {
    icon: MapPin,
    title: 'Office',
    value: 'Mohali, Punjab',
    description: 'Come say hello at our HQ'
  }
]

const faqs = [
  {
    question: 'What skill level do I need to start?',
    answer: 'Our projects are designed for all skill levels! We have beginner-friendly projects that assume no prior experience, as well as advanced projects for experienced developers. Each project clearly indicates its difficulty level.'
  },
  {
    question: 'Do the kits include all necessary components?',
    answer: 'Yes! Each project kit includes all the electronic components, cables, and hardware you need to complete the project. You will also get detailed instructions, code examples, and access to our support community.'
  },
  {
    question: 'How does the mentorship program work?',
    answer: 'Our mentorship program connects you with experienced IoT professionals for 1-on-1 guidance. You can book individual sessions or choose from our monthly packages. Sessions are conducted via video call and include code reviews, project guidance, and career advice.'
  },
  {
    question: 'What programming languages do you teach?',
    answer: 'We primarily focus on C/C++ for Arduino projects, Python for Raspberry Pi projects, and JavaScript for web-based IoT applications. We also cover various IoT protocols and cloud platforms as part of our comprehensive curriculum.'
  },
  {
    question: 'Do you offer refunds?',
    answer: 'All sales are final. We do not offer refunds on any products or services.'
  }
]

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Have questions about our projects or mentorship? We&apos;re here to help! 
            Reach out to us and we&apos;ll get back to you as soon as possible.
          </p>
        </div>
      </section>

      <div className="flex flex-col items-center justify-center min-h-[60vh] py-16">
        <div className="w-full max-w-2xl flex flex-col gap-8">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="bg-blue-100 rounded-full p-2 flex-shrink-0">
                    <info.icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{info.title}</h3>
                    <p className="text-gray-600">{info.value}</p>
                    <p className="text-sm text-gray-500">{info.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Response Time */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Response Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                We typically respond to messages within:
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span>General inquiries:</span>
                  <span className="font-semibold">24 hours</span>
                </li>
                <li className="flex justify-between">
                  <span>Technical support:</span>
                  <span className="font-semibold">12 hours</span>
                </li>
                <li className="flex justify-between">
                  <span>Mentorship questions:</span>
                  <span className="font-semibold">6 hours</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Quick answers to common questions
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Additional Help */}
        <div className="mt-20 text-center">
          <Card className="bg-gray-900 border-gray-600">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Need immediate help?
              </h3>
              <p className="text-gray-600 mb-4">
                Check out our community for quick answers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" asChild>
                  <a href="https://codeunia.com" target="_blank" rel="noopener noreferrer">
                    Join Community
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
    </div>
  )
}
