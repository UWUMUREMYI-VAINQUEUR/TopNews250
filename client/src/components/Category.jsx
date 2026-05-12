import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  FaBusinessTime,
  FaLaptopCode,
  FaFilm,
  FaMusic,
  FaHeartbeat,
  FaChartLine,
  FaFutbol,
  FaShieldAlt,
  FaArrowRight,
} from 'react-icons/fa';

/* =======================
   Category Icons
======================= */
const categoryIcons = {
  business: <FaBusinessTime />,
  technology: <FaLaptopCode />,
  showbiz: <FaFilm />,
  music: <FaMusic />,
  healthy: <FaHeartbeat />,
  economic: <FaChartLine />,
  sports: <FaFutbol />,
  security: <FaShieldAlt />,
};

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =======================
     Fetch Categories
  ======================= */
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/categories')
      .then((res) => {
        setCategories(res.data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* =======================
          Hero Section
      ======================= */}
      <section className="bg-gradient-to-r from-black via-gray-900 to-black text-white py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            News Categories
          </h1>

          <p className="text-lg md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Explore trending stories, breaking updates, and AI-powered news
            coverage across multiple categories on TopNews AI.
          </p>
        </div>
      </section>

      {/* =======================
          Categories Grid
      ======================= */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Loading */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(8)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-3xl p-8 shadow animate-pulse h-60"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {categories.map((cat) => {
                const lower = cat.name.toLowerCase();
                const icon = categoryIcons[lower] || <FaBusinessTime />;

                return (
                  <Link
                    key={cat.id}
                    to={`/?category=${cat.id}`}
                    className="group bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 hover:-translate-y-2"
                  >
                    {/* Icon */}
                    <div className="w-20 h-20 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-4xl mb-6 group-hover:bg-blue-600 group-hover:text-white transition duration-300">
                      {icon}
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-bold text-gray-900 capitalize mb-4">
                      {cat.name}
                    </h2>

                    {/* Description */}
                    <p className="text-gray-600 leading-relaxed mb-6 line-clamp-3">
                      Explore the latest {cat.name} news, trending stories,
                      breaking updates, and important developments from around
                      the world.
                    </p>

                    {/* Button */}
                    <div className="inline-flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-3 transition-all duration-300">
                      Explore Category
                      <FaArrowRight />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* =======================
          Extra Section
      ======================= */}
      <section className="pb-20 px-6">
        <div className="max-w-7xl mx-auto bg-black text-white rounded-3xl p-10 md:p-16 text-center shadow-2xl">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Discover News Without Limits
          </h2>

          <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-4xl mx-auto mb-8">
            TopNews AI combines artificial intelligence with community-driven
            journalism to deliver modern, fast, and engaging news experiences
            for readers worldwide.
          </p>

          <Link
            to="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl text-lg font-semibold transition duration-300"
          >
            Back To Home
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Categories;
