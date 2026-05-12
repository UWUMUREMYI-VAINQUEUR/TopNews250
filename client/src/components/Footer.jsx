// src/components/Footer.jsx
import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaWhatsapp,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

// ── ScrollToTop: scrolls to top on every route change ──────────────────────
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
};

// ── Footer ──────────────────────────────────────────────────────────────────
const Footer = () => {
  return (
    <>
      {/* Mounted here so it works site-wide whenever Footer is rendered */}
      <ScrollToTop />

      <footer className="bg-gray-950 text-white mt-14">

        <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* LOGO */}
          <div>
            <h2 className="text-3xl font-bold mb-4">TopNews AI</h2>
            <p className="text-gray-400 leading-relaxed">
              TopNews AI is a modern AI-powered news platform delivering
              breaking news, trending stories, and global updates.
            </p>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="text-xl font-semibold mb-5">Quick Links</h3>
            <ul className="space-y-3 text-gray-400">
              <li><Link to="/" className="hover:text-white">Home</Link></li>
              <li><Link to="/Category" className="hover:text-white">Categories</Link></li>
              <li><Link to="/about" className="hover:text-white">About</Link></li>
              <li><Link to="/Contact" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>

          {/* LEGAL */}
          <div>
            <h3 className="text-xl font-semibent mb-5">Legal</h3>
            <ul className="space-y-3 text-gray-400">
              <li><Link to="/PrivacyPolice" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/Terms" className="hover:text-white">Terms</Link></li>
              <li><Link to="/Disclaimer" className="hover:text-white">Disclaimer</Link></li>
              <li><Link to="/Editorial" className="hover:text-white">Editorial</Link></li>
            </ul>
          </div>

          {/* SOCIAL */}
          <div>
            <h3 className="text-xl font-semibold mb-5">Follow Us</h3>
            <p className="text-gray-400 mb-5">
              Stay connected with TopNews AI across all platforms.
            </p>
            <div className="flex flex-wrap gap-4">

              <a
                href="https://www.instagram.com/topnews_250/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-3 rounded-full hover:bg-pink-500 transition"
              >
                <FaInstagram />
              </a>

              <a
                href="https://www.facebook.com/profile.php?id=61589240739153"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-3 rounded-full hover:bg-blue-600 transition"
              >
                <FaFacebookF />
              </a>

              <a
                href="https://x.com/topnews250"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-3 rounded-full hover:bg-black transition"
              >
                <FaXTwitter />
              </a>

              <a
                href="https://www.youtube.com/@TOPNEWS25000"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-3 rounded-full hover:bg-red-600 transition"
              >
                <FaYoutube />
              </a>

              <a
                href="https://whatsapp.com/channel/0029VbB7WfJG3R3kkf7WeV0g"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-3 rounded-full hover:bg-green-500 transition"
              >
                <FaWhatsapp />
              </a>

            </div>
          </div>

        </div>

        {/* BOTTOM */}
        <div className="border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row justify-between text-sm text-gray-500">
            <p>© {new Date().getFullYear()} TopNews AI</p>
            <p>Powered by AI & Community Journalism</p>
          </div>
        </div>

      </footer>
    </>
  );
};

export default Footer;