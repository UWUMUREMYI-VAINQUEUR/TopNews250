import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="bg-gray-50 min-h-screen text-gray-800">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-black via-gray-900 to-black text-white py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Privacy Policy
          </h1>

          <p className="text-lg md:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
            Learn how TopNews AI collects, uses, protects, and manages user
            information while providing AI-powered and community-driven news
            services.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg p-8 md:p-12 space-y-12">
          {/* Intro */}
          <div>
            <h2 className="text-3xl font-bold mb-4">
              Introduction
            </h2>

            <p className="text-gray-600 leading-relaxed text-lg">
              At TopNews AI, we value your privacy and are committed to
              protecting your personal information. This Privacy Policy explains
              how we collect, use, store, and safeguard user data when you use
              our website, services, and platform features.
            </p>
          </div>

          {/* Information We Collect */}
          <div>
            <h2 className="text-3xl font-bold mb-4">
              Information We Collect
            </h2>

            <div className="space-y-5 text-gray-600 text-lg leading-relaxed">
              <p>
                We may collect certain information when users interact with the
                TopNews AI platform, including:
              </p>

              <ul className="list-disc pl-6 space-y-3">
                <li>Name and account information during registration</li>
                <li>Email addresses used for account creation or contact</li>
                <li>Comments, posts, or news articles submitted by users</li>
                <li>Browser, device, and usage analytics information</li>
                <li>Cookies and similar technologies for personalization</li>
              </ul>
            </div>
          </div>

          {/* How We Use Information */}
          <div>
            <h2 className="text-3xl font-bold mb-4">
              How We Use Information
            </h2>

            <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
              <p>
                TopNews AI uses collected information to:
              </p>

              <ul className="list-disc pl-6 space-y-3">
                <li>Provide and improve platform services</li>
                <li>Personalize news recommendations and user experience</li>
                <li>Manage registered user accounts and content submissions</li>
                <li>Improve website performance and security</li>
                <li>Respond to support requests and inquiries</li>
                <li>Prevent spam, abuse, and harmful activity</li>
              </ul>
            </div>
          </div>

          {/* AI and User Content */}
          <div className="bg-gray-100 rounded-3xl p-8">
            <h2 className="text-3xl font-bold mb-4">
              AI-Generated & User-Contributed Content
            </h2>

            <p className="text-gray-600 text-lg leading-relaxed mb-5">
              TopNews AI is a hybrid publishing platform where content may be
              generated using artificial intelligence tools or submitted by
              registered users and contributors.
            </p>

            <p className="text-gray-600 text-lg leading-relaxed">
              We may review, moderate, edit, or remove content that violates our
              platform policies, spreads misinformation, or contains harmful
              material.
            </p>
          </div>

          {/* Cookies */}
          <div>
            <h2 className="text-3xl font-bold mb-4">
              Cookies & Advertising
            </h2>

            <p className="text-gray-600 text-lg leading-relaxed mb-5">
              TopNews AI may use cookies and similar technologies to improve
              user experience, analyze traffic, remember preferences, and serve
              relevant advertisements.
            </p>

            <p className="text-gray-600 text-lg leading-relaxed">
              Third-party vendors, including Google, may use cookies to serve
              ads based on a user’s previous visits to this website or other
              websites. Google’s advertising cookies enable personalized ads
              where applicable.
            </p>
          </div>

          {/* Google Adsense */}
          <div className="bg-black text-white rounded-3xl p-8">
            <h2 className="text-3xl font-bold mb-4">
              Google AdSense Compliance
            </h2>

            <p className="text-gray-300 text-lg leading-relaxed mb-5">
              TopNews AI may display advertisements provided by Google AdSense
              and other advertising partners.
            </p>

            <p className="text-gray-300 text-lg leading-relaxed">
              Google may use cookies, web beacons, or similar technologies to
              personalize ads and measure advertising performance in accordance
              with Google advertising policies.
            </p>
          </div>

          {/* Data Security */}
          <div>
            <h2 className="text-3xl font-bold mb-4">
              Data Security
            </h2>

            <p className="text-gray-600 text-lg leading-relaxed">
              We implement reasonable security measures to protect user
              information against unauthorized access, misuse, disclosure, or
              destruction. However, no internet-based platform can guarantee
              complete security.
            </p>
          </div>

          {/* User Rights */}
          <div>
            <h2 className="text-3xl font-bold mb-4">
              User Rights
            </h2>

            <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
              <p>
                Users may request to:
              </p>

              <ul className="list-disc pl-6 space-y-3">
                <li>Access their stored information</li>
                <li>Update account details</li>
                <li>Delete their account where applicable</li>
                <li>Request removal of submitted content</li>
              </ul>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-gray-100 rounded-3xl p-8">
            <h2 className="text-3xl font-bold mb-4">
              Contact Information
            </h2>

            <p className="text-gray-600 text-lg leading-relaxed mb-5">
              If you have questions regarding this Privacy Policy or your data,
              you may contact the TopNews AI team.
            </p>

            <div className="space-y-3 text-lg">
              <p>
                📞 +250 795 251 475
              </p>

              <p>
                ✉️ vainqeur@example.com
              </p>
            </div>
          </div>

          {/* Last Update */}
          <div className="text-center border-t pt-8 border-gray-200">
            <p className="text-gray-500 text-sm">
              Last Updated: May 2026
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
