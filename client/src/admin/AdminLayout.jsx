import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import tnLogo from "../assets/tn.png";
import axios from "axios";

export default function AdminLayout() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    users: 0,
    posts: 0,
    aiPosts: 0,
    pending: 0,
  });

  // ===============================
  // FETCH DASHBOARD STATS
  // ===============================
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:5000/api/admin/stats",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // we will enhance backend later, but fallback safe
        setStats({
          users: res.data.users || 0,
          posts: res.data.posts || 0,
          aiPosts: res.data.aiPosts || 0,
          pending: res.data.pending || 0,
        });
      } catch (err) {
        console.log("Stats error:", err.message);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">

      {/* ================= SIDEBAR ================= */}
      <aside className="hidden md:block">
        <AdminSidebar />
      </aside>

      {/* ================= MAIN ================= */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* ================= TOP BAR ================= */}
        <header className="flex items-center justify-between px-3 sm:px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">

          {/* LOGO */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-2 cursor-pointer"
          >
            <img
              src={tnLogo}
              alt="TopNews"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-md object-cover"
            />

            <span className="text-base sm:text-lg font-bold text-orange-500 hidden sm:block">
              TopNews Admin
            </span>
          </div>

          {/* CENTER QUICK STATS */}
          <div className="hidden lg:flex items-center gap-4 text-xs">

            <div className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-lg">
              👥 Users: {stats.users}
            </div>

            <div className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-lg">
              📰 Posts: {stats.posts}
            </div>

            <div className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-lg">
              🤖 AI: {stats.aiPosts}
            </div>

            <div className="px-3 py-1 bg-orange-500 text-white rounded-lg font-semibold">
              ⏳ Pending: {stats.pending}
            </div>

          </div>

          {/* RIGHT BUTTONS */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* 🔥 REVIEW BUTTON */}
            <Link
              to="/admin/posts/pending"
              className="hidden sm:block px-3 py-2 text-xs sm:text-sm rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition"
            >
              Review Posts {stats.pending > 0 && `(${stats.pending})`}
            </Link>

            {/* BACK */}
            <button
              onClick={() => navigate(-1)}
              className="px-2 sm:px-3 py-2 text-xs sm:text-sm rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              ← Back
            </button>

          </div>
        </header>

        {/* ================= CONTENT ================= */}
        <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-auto bg-gray-50 dark:bg-gray-900">

          <div className="text-gray-900 dark:text-gray-100">
            <Outlet />
          </div>

        </main>

      </div>
    </div>
  );
}