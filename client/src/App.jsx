import React, { useContext } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

/* =========================
   PUBLIC UI
========================= */
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

/* =========================
   PAGES
========================= */
import Home from "./pages/Home";
import PostDetails from "./pages/PostDetails";
import EditProfile from "./pages/EditProfile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NewsDetail from "./pages/NewsDetail";
import Notifications from "./pages/Notifications";
import CreatePost from "./pages/CreatePost";
import SearchResults from "./pages/SearchResults";

import About from "./components/About";
import Contact from "./components/Contact";
import PrivacyPolice from "./components/PrivacyPolice";
import Terms from "./components/Terms";
import Disclaimer from "./components/Disclaimer";
import Editorial from "./components/Editorial";
import Category from "./components/Category";
import PendingPosts from "./pages/admin/PendingPosts";

/* =========================
   ADMIN
========================= */
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import AdminUsers from "./admin/AdminUsers";
import AdminPosts from "./admin/AdminPosts";

/* =========================
   AUTH
========================= */
import { AuthContext } from "./context/AuthContext";

/* =========================
   PROTECTED USER ROUTE
========================= */
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

/* =========================
   ADMIN ROUTE
========================= */
function AdminRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;

  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  const location = useLocation();

  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">

      {/* PUBLIC NAVBAR */}
      {!isAdminPage && <Navbar />}

      <main className={!isAdminPage ? "container mx-auto px-4 py-6" : ""}>
        <Routes>

          {/* ================= PUBLIC ================= */}
          <Route path="/" element={<Home />} />
          <Route path="/post/:id" element={<PostDetails />} />
          <Route path="/news/:id" element={<NewsDetail />} />
          <Route path="/search" element={<SearchResults />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/PrivacyPolice" element={<PrivacyPolice />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/editorial" element={<Editorial />} />
          <Route path="/category" element={<Category />} />
          <Route path="/admin/posts/pending" element={<PendingPosts />} />
          {/* ================= USER PROTECTED ================= */}
          <Route path="/editprofile" element={
            <ProtectedRoute><EditProfile /></ProtectedRoute>
          } />

          <Route path="/notifications" element={
            <ProtectedRoute><Notifications /></ProtectedRoute>
          } />

          <Route path="/createpost" element={
            <ProtectedRoute><CreatePost /></ProtectedRoute>
          } />

          {/* ================= ADMIN (NEW CLEAN STRUCTURE) ================= */}
          <Route path="/admin" element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }>

            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="posts" element={<AdminPosts />} />

          </Route>

          {/* ================= 404 ================= */}
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
              <h1 className="text-5xl font-bold text-orange-500">404</h1>
              <p className="mt-4">Page not found</p>
            </div>
          } />

        </Routes>
      </main>

      {/* PUBLIC FOOTER */}
      {!isAdminPage && <Footer />}
    </div>
  );
}