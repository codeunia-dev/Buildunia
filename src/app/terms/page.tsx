import React from 'react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a5 5 0 00-10 0v2M5 9h14a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7a2 2 0 012-2z" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Codeunia Terms & Conditions
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Last Updated: July 26, 2025
          </p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 space-y-10">
          {/* Introduction */}
          <div>
            <p className="text-gray-300 leading-relaxed mb-4">
              The Codeunia services, including its community platform, courses, content, mentoring services, events, training platforms, and products such as BuildUnia (collectively, the &quot;Service&quot;), are provided through our website <a href="https://codeunia.com" className="text-blue-400 underline">https://codeunia.com</a> (and its subdomains like <a href="https://buildunia.codeunia.com" className="text-blue-400 underline">https://buildunia.codeunia.com</a>), and applications (collectively, the &quot;Platform&quot;), operated by Codeunia, a sole proprietorship registered in India under the ownership of Deepak (&quot;us,&quot; &quot;we,&quot; or &quot;the Company&quot;).
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              By accessing or using our Platform or using our Services, you signify that you have read, understood, and agree to be bound by these Terms. These Terms describe the basis on which you may access and use our Services. Please read this Agreement carefully as it contains important information regarding your legal rights, remedies, and obligations.
            </p>
          </div>

          {/* Sectioned Terms */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <svg className="w-6 h-6 text-purple-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              1. Accounts
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>You need an account for most activities on the Platform. You must be at least 13 years old (or older if required by your jurisdiction) to create an account. If you are not of age, please use a parent or guardian&apos;s assistance.</li>
              <li>Provide true, correct, accurate, and complete information. Do not share your account details with others.</li>
              <li>Linked Accounts: When you register for Codeunia, you are automatically registered for BuildUnia, and vice versa. Your account and data are linked across both platforms.</li>
              <li>Contact <a href="mailto:connect@codeunia.com" className="text-blue-400 underline">connect@codeunia.com</a> for account issues or termination.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 mt-8">2. User Conduct and Behavior</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Participate sincerely and do not engage in unethical, corrupt, or illegal practices.</li>
              <li>Do not harass, defame, or create disharmony among users or third parties.</li>
              <li>Do not post or transmit phishing, spam, or attempts to obtain personal information.</li>
              <li>Do not tamper with, reverse engineer, or attempt to access non-public areas of the Platform.</li>
              <li>Do not use bots, scrapers, or other automated means to access the Platform.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 mt-8">3. Content and Services</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Access to content, courses, and mentoring is for your personal, non-commercial use only.</li>
              <li>You are granted a limited, non-exclusive, non-transferable license to use the Services.</li>
              <li>Do not resell, distribute, or make available any content or courses to third parties.</li>
              <li>We may revoke access or modify services at any time for legal or policy reasons.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 mt-8">4. Payments, Credits, and Refunds</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Prices are displayed on the Platform and may vary. Payment is required for access to paid services.</li>
              <li>All sales on BuildUnia (for software projects, hardware projects) and for mentoring sessions are final. No refunds, exchanges, or credits are provided.</li>
              <li>Review all project and mentor details before purchase. Contact us for clarification before buying.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 mt-8">5. Codeunia&apos;s Rights to Content You Post</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>You retain ownership of content you post, but grant Codeunia a license to use, reproduce, and display it as needed for the Services.</li>
              <li>We may remove any content that violates these Terms at our discretion.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 mt-8">6. Using the Platform at Your Own Risk</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>All services are provided &quot;as-is&quot; without warranty or guarantee.</li>
              <li>Be prudent in your interactions and do not share sensitive information with mentors or support officers.</li>
              <li>We are not liable for disputes, claims, or losses arising from user or mentor conduct.</li>
              <li>We are not responsible for third-party websites or services linked from the Platform.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 mt-8">7. Our Role</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Codeunia is not a registered or accredited educational institution.</li>
              <li>Any recognition or credential is at Codeunia&apos;s discretion and not equivalent to a formal degree or certificate.</li>
              <li>No guarantee of admission, job, or remunerative opportunity is provided.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 mt-8">8. Events and Activities</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Third-party events are not the responsibility of Codeunia. Participate at your own risk.</li>
              <li>Codeunia-organized events may be cancelled, postponed, or modified at any time.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 mt-8">9. BuildUnia Specifics (Products and Sales)</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>All transactions are subject to these Terms and any specific terms at the point of sale.</li>
              <li>Sellers are responsible for accurate listings and timely delivery. Buyers must review details and pay promptly.</li>
              <li>Disputes between users are not the responsibility of Codeunia. Disputes with Codeunia as seller will be handled by Codeunia.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 mt-8">10. Intellectual Property</h2>
            <p className="text-gray-300">All original content, features, and functionality are the exclusive property of Codeunia and its licensors. Trademarks and trade dress may not be used without written consent.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 mt-8">11. Termination and Suspension</h2>
            <p className="text-gray-300">We may terminate or suspend your account immediately for any reason, including violation of these Terms. Upon termination, your right to use the Service ceases immediately.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 mt-8">12. Indemnification</h2>
            <p className="text-gray-300">You agree to defend, indemnify, and hold harmless Codeunia and its owner, Deepak, from any claims, damages, or expenses arising from your use of the Service or violation of these Terms.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 mt-8">13. Limitation of Liability</h2>
            <div className="bg-red-500/10 rounded-xl p-6 border border-red-500/20 mb-4">
              <p className="text-red-200 font-semibold">Our liability is limited. We are not liable for indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill.</p>
            </div>
            <p className="text-gray-300">Use the Service at your own risk.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 mt-8">14. Disclaimer of Warranties</h2>
            <div className="bg-yellow-500/10 rounded-xl p-6 border border-yellow-500/20 mb-4">
              <p className="text-yellow-200 font-semibold">The Service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind. We do not guarantee uninterrupted, secure, or error-free service.</p>
            </div>
          </section>

                                <section>
                        <h2 className="text-2xl font-bold text-white mb-4 mt-8">15. Governing Law and Dispute Resolution</h2>
                        <p className="text-gray-300">These Terms are governed by the laws of India. Disputes are subject to the courts of Mohali.</p>
                      </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 mt-8">16. Changes to These Terms</h2>
            <p className="text-gray-300">We may modify these Terms at any time. Continued use of the Service after changes constitutes acceptance of the new Terms.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 mt-8">17. Miscellaneous Terms</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>You agree to receive communications from Codeunia regarding your use of Services.</li>
              <li>You are responsible for your interactions with other members. Codeunia may monitor disputes but is not obligated to do so.</li>
              <li>Use of the Services is also governed by our Privacy Policy.</li>
              <li>These Terms may not be transferred by you, but may be assigned by Codeunia.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 mt-8">18. Mechanism for Complaints</h2>
            <div className="bg-blue-500/10 rounded-xl p-6 border border-blue-500/20">
              <p className="text-gray-300 mb-2">For any transaction or attempted transaction in violation of these Terms, or for any queries or concerns, contact our grievance officer:</p>
              <p className="text-blue-200"><strong>Email:</strong> <a href="mailto:connect@codeunia.com" className="text-blue-400 underline">connect@codeunia.com</a></p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 mt-8">19. Contact Us</h2>
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
              <p className="text-gray-300 mb-2">If you have any questions about these Terms, please contact us:</p>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-300">Email: <a href="mailto:connect@codeunia.com" className="text-blue-400 underline">connect@codeunia.com</a></span>
                </div>
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                  </svg>
                  <span className="text-gray-300">Website: <a href="https://codeunia.com" className="text-blue-400 underline">codeunia.com</a></span>
                </div>
              </div>
            </div>
          </section>

          {/* Footer Note */}
          <div className="mt-12 text-center">
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 max-w-2xl mx-auto">
              <p className="text-gray-400 text-sm">
                <strong className="text-white">Note:</strong> These Terms & Conditions constitute a legally binding agreement between you and Codeunia regarding your use of the Platform and Services. By using our services, you acknowledge that you have read, understood, and agreed to these terms.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 