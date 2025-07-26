import React from 'react';

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-purple-600 rounded-full mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            BuildUnia Pricing & Refund Policy
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Last Updated: July 26, 2025
          </p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 space-y-10">
          {/* Introduction */}
          <div>
            <p className="text-gray-300 leading-relaxed mb-4">
              Thank you for engaging with BuildUnia&apos;s offerings. We strive to ensure that our users have a rewarding experience while they discover, assess, and purchase our projects and services.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              As with any online purchase experience, there are terms and conditions that govern the Pricing and Refund Policy. When you purchase a project or service on BuildUnia (a product of Codeunia, a sole proprietorship registered in India under the ownership of Deepak), you agree to our Privacy Policy, Terms and Conditions, and this Pricing Policy & Refund Policy.
            </p>
          </div>

          {/* Pricing Policy Section */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <svg className="w-6 h-6 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Pricing Policy
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Customized pricing is provided for each service or project, reflecting effort, complexity, and value.</li>
              <li>Price range: INR 49/- to INR 50,000/- depending on the nature and scope of the project or session.</li>
              <li>Payment schedules or durations are specified in the service/project description if applicable.</li>
              <li>We are committed to competitive pricing and accuracy. If a pricing error occurs, your order may be cancelled and you will be notified.</li>
              <li>Shopping cart prices reflect current product page prices and may change without notice.</li>
              <li>All services and projects are for personal use only, not for resale. We may refuse sales to suspected resellers.</li>
            </ul>
          </section>

          {/* Refund Policy Section */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 mt-8 flex items-center">
              <svg className="w-6 h-6 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Refund Policy
            </h2>
            <div className="bg-gradient-to-r from-red-500/20 to-red-600/20 border-l-4 border-red-500 rounded-r-xl p-6 mb-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">All Sales Are Final</h3>
                  <p className="text-red-200 leading-relaxed">
                    All sales on BuildUnia (for software projects, hardware projects) and for mentoring sessions are final.
                  </p>
                </div>
              </div>
            </div>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4 mb-4">
              <li>No refunds, exchanges, or credits are provided once a purchase or payment is completed.</li>
              <li>This policy applies under all circumstances, including but not limited to:</li>
              <ul className="list-disc list-inside text-gray-400 space-y-1 ml-8">
                <li>Dissatisfaction with the purchased software project, hardware project, or mentoring session</li>
                <li>Change of mind after purchase</li>
                <li>Technical issues on the user&apos;s end (e.g., incompatible software, lack of necessary skills, connectivity issues during a mentoring session)</li>
                <li>Misinterpretation of project descriptions, features, mentor profiles, or session details</li>
                <li>Non-attendance or missed mentoring sessions</li>
              </ul>
            </ul>
            <div className="bg-blue-500/10 rounded-xl p-6 border border-blue-500/20 mb-4">
              <h3 className="text-lg font-semibold text-white mb-2">Before You Purchase</h3>
              <p className="text-blue-200 leading-relaxed">
                Carefully review project descriptions, previews, documentation, and mentor profiles before making a purchase or booking a session. Contact the relevant seller/mentor (or Codeunia) for clarification before completing your transaction.
              </p>
            </div>
            <div className="bg-gray-700/30 rounded-xl p-6 border border-gray-600/30">
              <p className="text-gray-300 text-center font-medium">
                By completing a purchase or booking a session, you confirm that you have read, understood, and agreed to this Refund Policy.
              </p>
            </div>
          </section>

          {/* Contact Section */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 mt-8">Contact Us</h2>
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
              <p className="text-gray-300 mb-2">If you have any questions about this Pricing Policy & Refund Policy, please contact us:</p>
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
                <strong className="text-white">Note:</strong> This Pricing Policy & Refund Policy constitutes a legally binding agreement between you and Codeunia regarding your purchases on BuildUnia. By making a purchase, you acknowledge that you have read, understood, and agreed to these terms.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 