import Link from 'next/link'
import { Github, Linkedin, Mail, ExternalLink } from 'lucide-react'
import { Logo } from '@/components/ui/logo'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <div>
              <div className="flex items-center space-x-3">
                <Logo size="sm" />
                <div className="text-2xl font-bold text-blue-400">BuildUnia</div>
              </div>
              <p className="mt-2 text-gray-300 text-sm">
                A Codeunia product - Empowering the next generation of IoT innovators through hands-on learning and mentorship.
              </p>
            </div>
            <div className="flex space-x-6">
              <a href="https://github.com/codeunia" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-300">
                <Github className="h-6 w-6" />
              </a>
              <a href="https://linkedin.com/company/codeunia" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-300">
                <Linkedin className="h-6 w-6" />
              </a>
              <a href="mailto:contact@codeunia.com" className="text-gray-400 hover:text-gray-300">
                <Mail className="h-6 w-6" />
              </a>
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  Products
                </h3>
                <ul role="list" className="mt-4 space-y-4">
                  <li>
                    <Link href="/projects" className="text-base text-gray-300 hover:text-white">
                      IoT Projects
                    </Link>
                  </li>
                  <li>
                    <Link href="/mentorship" className="text-base text-gray-300 hover:text-white">
                      Mentorship
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  Resources
                </h3>
                <ul role="list" className="mt-4 space-y-4">
                  <li>
                    <a href="https://www.codeunia.com/opportunities" target="_blank" rel="noopener noreferrer" className="text-base text-gray-300 hover:text-white flex items-center gap-1">
                      Opportunities
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </li>
                  <li>
                    <a href="https://www.codeunia.com" target="_blank" rel="noopener noreferrer" className="text-base text-gray-300 hover:text-white flex items-center gap-1">
                      Codeunia
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  Support
                </h3>
                <ul role="list" className="mt-4 space-y-4">
                  <li>
                    <Link href="/contact" className="text-base text-gray-300 hover:text-white">
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="text-base text-gray-300 hover:text-white">
                      About
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  Legal
                </h3>
                <ul role="list" className="mt-4 space-y-4">
                  <li>
                    <Link href="/terms" className="text-base text-gray-300 hover:text-white">
                      Terms & Conditions
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy" className="text-base text-gray-300 hover:text-white">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/refund" className="text-base text-gray-300 hover:text-white">
                      Refund Policy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-700 pt-8">
          <p className="text-base text-gray-400 xl:text-center">
            &copy; 2025 BuildUnia by Codeunia. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
