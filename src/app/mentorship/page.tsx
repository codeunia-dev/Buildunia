'use client'

import Link from 'next/link'
import { CheckCircle, Clock, Users, Video, MessageCircle, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react';

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
    name: 'Deepak Pandey',
    title: 'Founder, Codeunia | IoT & Embedded Systems Mentor',
    experience: '3+ years in tech education & product development',
    students: '600+ learners across India',
    rating: 4.9,
    highlights: [
      'Led national workshops on IoT, AI, and automation',
      'Built and mentored 50+ real-world IoT + AI student projects',
      'Founder of Codeunia, India’s fastest-growing tech student community',
      'Featured in university innovation showcases and tech meetups',
    ],
    expertise: ['IoT Architecture', 'Embedded Systems', 'Firebase & Cloud', 'Automation', 'AI/ML Integration'],
    avatar: 'DP',
    bio: `Deepak combines deep technical knowledge with a passion for mentorship. As the driving force behind Codeunia and BuildUnia, he’s helped hundreds of students overcome technical blocks and build projects they’re proud to show off. His approach is simple: learn by doing, fail fast, and build with purpose.`
  },
  {
    name: 'Aayush Bhardwaj',
    title: 'Core Team Member, Codeunia | IoT & Java Backend Mentor',
    experience: '2+ years in tech education, backend development, and community leadership',
    students: '400+ learners through technical workshops, community sessions, and project guidance',
    rating: 4.8,
    highlights: [
      'Organized and led national-level hackathons and tech events',
      'Key contributor at Codeunia, one of India’s fastest-growing student tech communities',
      'Guided 30+ real-world IoT and Java backend projects',
      'Hosted sessions on IoT systems, REST APIs, and real-world backend development',
      'Collaborated with GeeksforGeeks, Unstop, and university innovation platforms',
    ],
    expertise: ['Java Backend Development', 'IoT & Embedded Systems', 'REST APIs', 'Community-driven Learning', 'Project Building'],
    avatar: 'AB',
    bio: `Aayush believes in learning by building. From late-night coding sessions to mentoring student teams on real-world projects, he thrives on sharing knowledge and solving problems together. As a passionate contributor to Codeunia and the broader student tech ecosystem, Aayush inspires others to build with confidence and purpose.`
  },
  {
    name: 'Akshay Kumar',
    title: 'Full Stack Developer | Web Dev Lead at Codeunia | AI & Web Development Mentor',
    experience: '4+ years in full-stack development, AI integration & product innovation',
    students: '800+ learners across India',
    rating: 4.9,
    highlights: [
      'Mentored 100+ full-stack, AI, and cybersecurity student projects',
      'Web Dev Lead at Codeunia – one of India’s fastest-growing developer communities',
      'Led initiatives across MERN stack, digital marketing, and scalable cloud applications',
      'Collaborated with startups to deliver AI-driven web products',
    ],
    expertise: ['MERN Stack', 'JavaScript', 'AI/ML', 'Node.js & Express', 'Cybersecurity', 'SQL & NoSQL', 'Firebase', 'Digital Strategy'],
    avatar: 'AK',
    bio: `Akshay blends strong technical expertise with an eye for scalable product thinking. As a self-taught full stack developer and Web Dev Lead at Codeunia, he empowers aspiring tech enthusiasts to build, iterate, and launch real-world projects that matter. His motto? "Don’t just learn—ship it, share it, and scale it."`
  }
];

export default function MentorshipPage() {
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
            <p className="text-base md:text-xl text-gray-400 font-light">Learn from real-world builders leading India’s next-gen IoT movement</p>
          </div>
          <MentorCards />
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

      {/* CTA Section */}
      <section className="py-8 md:py-20 bg-gradient-to-b from-black to-blue-950 text-white sticky bottom-0 z-40 w-screen max-w-none px-0">
        <div className="w-full px-4 md:max-w-4xl md:mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4 tracking-tight">Ready to Start Your Mentorship Journey?</h2>
          <p className="text-base md:text-xl mb-4 md:mb-8 opacity-90 font-light">
            Join hundreds of students who have accelerated their IoT careers with expert guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 md:gap-4 justify-center">
            <Button size="lg" variant="secondary" className="w-full sm:w-auto text-base md:text-lg px-6 md:px-8 py-3 md:py-4 shadow-xl hover:scale-105 transition-transform">
              Book a Free Consultation
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-blue-600 text-base md:text-lg px-6 md:px-8 py-3 md:py-4 shadow-xl hover:scale-105 transition-transform">
              View All Packages
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

function MentorCards() {
  const [openMentor, setOpenMentor] = useState<number | null>(null);
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-start justify-center">
        {mentors.map((mentor, idx) => (
          <div
            key={mentor.name}
            className="relative bg-gradient-to-br from-blue-900/40 to-gray-800/80 rounded-2xl shadow-2xl p-4 md:p-6 flex flex-col items-center border border-blue-800 cursor-pointer hover:shadow-blue-700/30 transition-all duration-300 min-h-[120px] max-h-[120px] h-[120px] md:min-h-[256px] md:max-h-[256px] md:h-[256px] w-full mb-4"
            style={{ maxWidth: 380 }}
            onClick={() => setOpenMentor(idx)}
            tabIndex={0}
            role="button"
            aria-expanded={openMentor === idx}
          >
            <h3 className="text-base md:text-xl font-bold text-white mb-1 text-center">{mentor.name}</h3>
            <p className="text-blue-400 font-medium mb-2 text-center text-xs md:text-base">{mentor.title}</p>
            <span className="mt-2 text-blue-300 text-xs font-semibold flex items-center gap-1">Click to learn more
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </span>
          </div>
        ))}
      </div>
      {/* Modal Overlay */}
      {openMentor !== null && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm transition-all">
          <div className="relative bg-gradient-to-br from-blue-900/80 to-gray-900/90 rounded-3xl shadow-2xl p-4 md:p-10 w-full max-w-sm md:max-w-xl min-h-[80vh] max-h-[95vh] overflow-y-auto flex flex-col justify-center animate-fadeIn">
            <button
              className="sticky top-2 right-2 float-right text-gray-300 hover:text-white text-2xl font-bold focus:outline-none z-10"
              onClick={() => setOpenMentor(null)}
              aria-label="Close"
            >
              &times;
            </button>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-1 text-center mt-2">{mentors[openMentor].name}</h3>
            <p className="text-blue-400 font-medium mb-2 text-center text-sm md:text-base">{mentors[openMentor].title}</p>
            <div className="grid grid-cols-2 gap-4 mb-4 w-full max-w-xs mx-auto">
              <div>
                <p className="text-xs text-gray-400">Experience</p>
                <p className="font-semibold text-white text-xs md:text-sm">{mentors[openMentor].experience}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Students Mentored</p>
                <p className="font-semibold text-white text-xs md:text-sm">{mentors[openMentor].students}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Rating</p>
                <p className="font-semibold text-white text-xs md:text-sm flex items-center">{mentors[openMentor].rating} <span className="ml-1">⭐</span></p>
              </div>
            </div>
            <div className="mb-4 w-full max-w-xs mx-auto">
              <p className="text-xs text-gray-400 mb-1">Highlights</p>
              <ul className="list-disc list-inside text-gray-200 text-left text-xs md:text-sm">
                {mentors[openMentor].highlights.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="mb-4 w-full max-w-xs mx-auto">
              <p className="text-xs text-gray-400 mb-1">Expertise</p>
              <div className="flex flex-wrap gap-2">
                {mentors[openMentor].expertise.map((skill) => (
                  <Badge key={skill} variant="secondary" className="bg-blue-800 text-white px-3 py-1 rounded-full text-xs font-medium">{skill}</Badge>
                ))}
              </div>
            </div>
            <p className="text-gray-300 text-xs md:text-sm font-light mt-2 mb-2 text-center">{mentors[openMentor].bio}</p>
          </div>
        </div>
      )}
    </>
  );
}
