import React from "react";

const EditorialPolicy = () => {
  return (
    <div className="bg-gray-50 min-h-screen text-gray-800">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-black via-gray-900 to-black text-white py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Editorial Policy
          </h1>
          <p className="text-lg md:text-2xl text-gray-300">
            How TopNews AI creates, reviews, and publishes news content.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg p-8 md:p-12 space-y-10">
          <div>
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              TopNews AI is committed to delivering fast, accurate, and
              easy-to-understand news using a combination of artificial
              intelligence and human oversight. Our goal is to make news
              accessible and reliable for everyone.
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-4">Content Creation</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Content on TopNews AI may be created by AI systems or submitted by
              registered users. All content is reviewed or moderated before
              being published when necessary to ensure quality and safety.
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-4">Fact Checking</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              We aim to verify information using trusted and publicly available
              sources. However, due to the fast nature of news, some details may
              change over time.
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-4">User Contributions</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Registered users can publish news articles and content. We reserve
              the right to edit, approve, or remove any content that violates
              our policies or quality standards.
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-4">Corrections & Updates</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              If errors are identified, we will update or correct content to
              maintain accuracy and clarity for our readers.
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-4">Transparency</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              We clearly disclose when AI is used in content creation and aim to
              maintain full transparency in our editorial process.
            </p>
          </div>

          <div className="text-center border-t pt-6">
            <p className="text-gray-500 text-sm">
              Last Updated: May 2026
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EditorialPolicy;
