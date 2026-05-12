import React from "react";

const Disclaimer = () => {
  return (
    <div className="bg-gray-50 min-h-screen text-gray-800">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-black via-gray-900 to-black text-white py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Disclaimer
          </h1>
          <p className="text-lg md:text-2xl text-gray-300">
            Important information about using TopNews AI.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg p-8 md:p-12 space-y-10">
          <div>
            <h2 className="text-3xl font-bold mb-4">General Disclaimer</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              All information provided on TopNews AI is for general informational
              purposes only. We do not guarantee accuracy, completeness, or
              reliability of any content.
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-4">AI Content</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Some articles may be generated or assisted by artificial intelligence.
              AI-generated content may contain errors or outdated information.
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-4">External Links</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              We may include links to external websites. We are not responsible
              for their content or practices.
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-4">No Professional Advice</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Content on this platform does not constitute financial, legal, or
              professional advice. Always consult qualified professionals.
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

export default Disclaimer;
