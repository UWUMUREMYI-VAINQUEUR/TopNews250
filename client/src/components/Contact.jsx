import React from "react";
import { FaEnvelope, FaPhoneAlt, FaLinkedin, FaTools } from "react-icons/fa";
import devImage from "../assets/dev.jpg";

const Contact = () => {
  return (
    <div className="bg-gray-50 min-h-screen text-gray-800">

      {/* HERO */}
      <section className="bg-gradient-to-r from-black via-gray-900 to-black text-white py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Contact Us
          </h1>

          <p className="text-lg md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Get in touch with the TopNews AI development, engineering, and support team.
          </p>
        </div>
      </section>

      {/* CARDS */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* OWNER */}
          <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition duration-300">
            <div className="p-8">

              <div className="flex flex-col items-center text-center">
                <img
                  src={devImage}
                  alt="Developer"
                  className="w-40 h-40 rounded-full object-cover border-4 border-gray-200 shadow-md"
                />

                <h2 className="text-3xl font-bold mt-6">
                  Uwumuremyi Vainqueur
                </h2>

                <p className="text-gray-500 mt-2">
                  Fullstack & Owner Developer
                </p>
              </div>

              <div className="mt-8 space-y-4">

                <div className="flex items-center gap-4 bg-gray-100 p-4 rounded-2xl">
                  <FaPhoneAlt />
                  <div>
                    <p className="font-semibold">Phone</p>
                    <p className="text-gray-600">+250 795 251 475</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-gray-100 p-4 rounded-2xl">
                  <FaEnvelope />
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-gray-600">vainqeur@example.com</p>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* ENGINEER (FIXED ALIGNMENT) */}
          <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition duration-300">
            <div className="p-8">

              <div className="flex flex-col items-center text-center">
                <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center text-5xl font-bold text-gray-500 shadow-md">
                  KF
                </div>

                <h2 className="text-3xl font-bold mt-6">
                  Kwizera François
                </h2>

                <p className="text-gray-500 mt-2 flex items-center gap-2">
                  <FaTools /> System Engineer
                </p>
              </div>

              <div className="mt-8 space-y-4">

                <div className="flex items-center gap-4 bg-gray-100 p-4 rounded-2xl">
                  <FaPhoneAlt />
                  <div>
                    <p className="font-semibold">Phone</p>
                    <p className="text-gray-600">0789633930</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-gray-100 p-4 rounded-2xl">
                  <FaEnvelope />
                  <div>
                    <p className="font-semibold">Blog Email</p>
                    <p className="text-gray-600">topnews250@gmail.com</p>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* FRONTEND DEV */}
          <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition duration-300">
            <div className="p-8">

              <div className="flex flex-col items-center text-center">
                <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center text-5xl font-bold text-gray-500 shadow-md">
                  AR
                </div>

                <h2 className="text-3xl font-bold mt-6">
                  Abayo Rafiki Nicolas
                </h2>

                <p className="text-gray-500 mt-2">
                  Frontend Developer
                </p>
              </div>

              <div className="mt-8 space-y-4">

                <div className="flex items-center gap-4 bg-gray-100 p-4 rounded-2xl">
                  <FaPhoneAlt />
                  <div>
                    <p className="font-semibold">Phone</p>
                    <p className="text-gray-600">+250 795 118 889</p>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FOOTER SECTION */}
      <section className="pb-20 px-6">
        <div className="max-w-5xl mx-auto bg-black text-white rounded-3xl p-10 text-center shadow-xl">

          <h2 className="text-3xl font-bold mb-6">
            TopNews AI Engineering Team
          </h2>

          <p className="text-gray-300">
            We build intelligent AI-powered news systems for global readers.
          </p>

        </div>
      </section>

    </div>
  );
};

export default Contact;