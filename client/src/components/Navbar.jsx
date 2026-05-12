import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaHome,
  FaPlus,
  FaBell,
  FaUserCircle,
  FaBars,
  FaTimes,
  FaCrown,
} from 'react-icons/fa';

import { AuthContext } from '../context/AuthContext';
import tnLogo from '../assets/tn.png';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [mobileMenu, setMobileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* =========================
          TOP ADSENSE SPACE
      ========================= */}
      <div className="w-full bg-gray-100 border-b border-gray-200 text-center py-2 text-sm text-gray-500">
        Advertisement Space
      </div>

      {/* =========================
          NAVBAR
      ========================= */}
      <nav className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">

          {/* NAVBAR CONTENT */}
          <div className="flex items-center justify-between h-16">

            {/* ================= LOGO ================= */}
            <Link to="/" className="flex items-center gap-3">

              <img
                src={tnLogo}
                alt="TopNews"
                className="w-12 h-12 rounded-full object-cover border-2 border-orange-500"
              />

              <div className="flex flex-col">
                <span className="text-2xl font-extrabold text-orange-500">
                  TopNews
                </span>

                <span className="text-xs text-gray-500 hidden sm:block">
                  AI & Community News Platform
                </span>
              </div>
            </Link>

            {/* ================= DESKTOP MENU ================= */}
            <div className="hidden md:flex items-center gap-6">

              <Link
                to="/"
                className="flex items-center gap-2 text-gray-700 hover:text-orange-500 font-medium transition"
              >
                <FaHome />
                Home
              </Link>

              <Link
                to="/category"
                className="text-gray-700 hover:text-orange-500 font-medium transition"
              >
                Categories
              </Link>

              <Link
                to="/about"
                className="text-gray-700 hover:text-orange-500 font-medium transition"
              >
                About
              </Link>

              <Link
                to="/contact"
                className="text-gray-700 hover:text-orange-500 font-medium transition"
              >
                Contact
              </Link>

              {/* ================= ADMIN LINK ================= */}
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold transition"
                >
                  <FaCrown />
                  Admin
                </Link>
              )}

              {/* ================= USER AREA ================= */}
              {user ? (
                <>
                  <Link
                    to="/CreatePost"
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition"
                  >
                    <FaPlus />
                    Create
                  </Link>

                  <Link
                    to="/notifications"
                    className="text-gray-700 hover:text-orange-500 transition"
                  >
                    <FaBell size={20} />
                  </Link>

                  <Link
                    to="/EditProfile"
                    className="flex items-center gap-2 text-gray-700 hover:text-orange-500 font-medium transition"
                  >
                    <FaUserCircle size={22} />
                    <span className="max-w-[100px] truncate">
                      {user.username}
                    </span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-blue-600 hover:text-orange-500 font-medium transition"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>

            {/* ================= MOBILE BUTTON ================= */}
            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="md:hidden text-2xl text-gray-700"
            >
              {mobileMenu ? <FaTimes /> : <FaBars />}
            </button>
          </div>

          {/* ================= MOBILE MENU ================= */}
          {mobileMenu && (
            <div className="md:hidden py-5 border-t border-gray-200 flex flex-col gap-4">

              <Link
                to="/"
                onClick={() => setMobileMenu(false)}
                className="text-gray-700 hover:text-orange-500 font-medium"
              >
                Home
              </Link>

              <Link
                to="/categories"
                onClick={() => setMobileMenu(false)}
                className="text-gray-700 hover:text-orange-500 font-medium"
              >
                Categories
              </Link>

              <Link
                to="/about"
                onClick={() => setMobileMenu(false)}
                className="text-gray-700 hover:text-orange-500 font-medium"
              >
                About
              </Link>

              <Link
                to="/contact"
                onClick={() => setMobileMenu(false)}
                className="text-gray-700 hover:text-orange-500 font-medium"
              >
                Contact
              </Link>

              {/* ADMIN */}
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenu(false)}
                  className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-3 rounded-lg font-semibold"
                >
                  <FaCrown />
                  Admin Dashboard
                </Link>
              )}

              {/* USER */}
              {user ? (
                <>
                  <Link
                    to="/CreatePost"
                    onClick={() => setMobileMenu(false)}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg"
                  >
                    <FaPlus />
                    Create Post
                  </Link>

                  <Link
                    to="/notifications"
                    onClick={() => setMobileMenu(false)}
                    className="flex items-center gap-2 text-gray-700"
                  >
                    <FaBell />
                    Notifications
                  </Link>

                  <Link
                    to="/EditProfile"
                    onClick={() => setMobileMenu(false)}
                    className="flex items-center gap-2 text-gray-700"
                  >
                    <FaUserCircle />
                    {user.username}
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-4 py-3 rounded-lg"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenu(false)}
                    className="text-blue-600 font-medium"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={() => setMobileMenu(false)}
                    className="bg-orange-500 text-white px-4 py-3 rounded-lg font-medium"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </nav>
    </>
  );
}