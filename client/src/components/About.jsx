export default function About() {
  return (
    <div className="bg-gray-50 min-h-screen text-gray-800">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-black via-gray-900 to-black text-white py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            About TopNews AI
          </h1>
          <p className="text-lg md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            TopNews AI is a modern AI-powered news platform focused on delivering
            fast, reliable, and accessible news coverage across technology,
            business, world affairs, entertainment, sports, artificial
            intelligence, and emerging global trends.
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Who We Are
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              TopNews AI combines artificial intelligence with responsible
              editorial practices to help readers stay informed in a rapidly
              changing world. Our platform is designed to make discovering news
              faster, easier, and more accessible for everyone.
            </p>

            <p className="text-lg text-gray-600 leading-relaxed">
              We cover breaking stories, technology developments, business insights, entertainment updates, sports coverage, AI innovation, and global trends using a combination of AI-powered systems, registered user contributions, and editorial review processes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl shadow-md hover:shadow-xl transition duration-300">
              <h3 className="text-2xl font-bold mb-3">Fast Updates</h3>
              <p className="text-gray-600">
                AI-assisted systems help identify trending and important stories
                quickly.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-md hover:shadow-xl transition duration-300">
              <h3 className="text-2xl font-bold mb-3">Trusted Sources</h3>
              <p className="text-gray-600">
                We prioritize credible and publicly available information from
                trusted reporting channels.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-md hover:shadow-xl transition duration-300">
              <h3 className="text-2xl font-bold mb-3">AI Innovation</h3>
              <p className="text-gray-600">
                Modern AI technology helps organize and deliver news more
                efficiently.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-md hover:shadow-xl transition duration-300">
              <h3 className="text-2xl font-bold mb-3">Global Reach</h3>
              <p className="text-gray-600">
                Our vision is to build a globally trusted digital news platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Our Mission
          </h2>

          <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
            Our mission is to combine artificial intelligence with responsible
            journalism practices to help readers stay informed with accurate,
            timely, and easy-to-understand news content. We aim to improve how
            people discover and consume information in the digital age.
          </p>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-6 bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            News Categories We Cover
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              'World News',
              'Technology',
              'Business',
              'Artificial Intelligence',
              'Sports',
              'Entertainment',
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 text-center shadow hover:shadow-lg transition duration-300"
              >
                <h3 className="font-semibold text-lg">{item}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Transparency Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-gray-50 p-8 rounded-3xl shadow-sm">
            <h2 className="text-3xl font-bold mb-6">
              AI Transparency
            </h2>

            <p className="text-gray-600 leading-relaxed text-lg">
              Some content published on TopNews AI may be generated or assisted using artificial intelligence tools, while other articles may be submitted by registered users and contributors on our platform. Our editorial process includes review, verification, formatting, moderation, and quality checks to improve clarity and maintain content standards.
            </p>
          </div>

          <div className="bg-gray-50 p-8 rounded-3xl shadow-sm">
            <h2 className="text-3xl font-bold mb-6">
              Editorial Standards
            </h2>

            <p className="text-gray-600 leading-relaxed text-lg">
              We aim to publish informative, accurate, and balanced content sourced from credible public information, trusted reporting channels, and community contributions. We continuously improve our moderation systems, editorial standards, and AI-assisted workflows to reduce misinformation and improve reader trust.
            </p>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="bg-black text-white py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Our Vision
          </h2>

          <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
            We aim to grow into a globally trusted digital news platform powered
            by innovative AI technology, modern publishing systems, and
            responsible reporting practices that help readers worldwide stay
            connected to important events and trends.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-6 bg-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Contact Us
          </h2>

          <p className="text-lg text-gray-600 mb-4">
            For inquiries, support, partnerships, or feedback, feel free to
            contact the TopNews AI team.
          </p>

          <div className="bg-white rounded-3xl shadow-md p-8 mt-8">
            <p className="text-xl font-semibold mb-3">
              Email: support@topnewsai.com
            </p>

            <p className="text-gray-600">
              We aim to respond to inquiries as quickly as possible.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
