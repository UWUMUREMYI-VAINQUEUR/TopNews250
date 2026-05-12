import React, { useEffect, useState } from "react";
import axios from "axios";

export default function PendingPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(null); // post id being previewed

  const token = localStorage.getItem("token");

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError("");
      if (!token) {
        setError("No token found. Please login as admin.");
        setLoading(false);
        return;
      }
      const res = await axios.get("http://localhost:5000/api/posts/pending", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load pending posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const approvePost = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/posts/approve/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts((prev) => prev.filter((p) => p.id !== id));
      if (expanded === id) setExpanded(null);
    } catch (err) {
      console.log(err.message);
    }
  };

  const rejectPost = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/posts/reject/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts((prev) => prev.filter((p) => p.id !== id));
      if (expanded === id) setExpanded(null);
    } catch (err) {
      console.log(err.message);
    }
  };

  const expandedPost = posts.find((p) => p.id === expanded);

  if (loading) return <p className="p-6 text-gray-500">Loading posts...</p>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Pending Posts Review</h1>

      {posts.length === 0 ? (
        <p className="text-gray-500">No pending posts 🎉</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden"
            >
              {/* ── COLLAPSED ROW ── */}
              <div className="p-4 flex flex-col sm:flex-row sm:items-start gap-4">

                {/* Thumbnail */}
                {post.image_url && (
                  <img
                    src={post.image_url}
                    alt=""
                    className="w-full sm:w-32 h-24 object-cover rounded-lg flex-shrink-0"
                  />
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-base font-bold leading-snug line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {post.snippet}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 mt-3">
                    <span className="text-xs text-gray-400">
                      By <strong>{post.author || "Unknown"}</strong>
                    </span>
                    <span className="text-xs text-gray-400">
                      ID: {post.id}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        post.is_ai
                          ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                          : "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                      }`}
                    >
                      {post.is_ai ? "🤖 AI" : "✍️ Manual"}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex sm:flex-col gap-2 flex-shrink-0">
                  <button
                    onClick={() =>
                      setExpanded(expanded === post.id ? null : post.id)
                    }
                    className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    {expanded === post.id ? "▲ Collapse" : "▼ Full Story"}
                  </button>
                  <button
                    onClick={() => approvePost(post.id)}
                    className="px-3 py-1.5 text-sm rounded-lg bg-green-500 hover:bg-green-600 text-white transition"
                  >
                    ✓ Approve
                  </button>
                  <button
                    onClick={() => rejectPost(post.id)}
                    className="px-3 py-1.5 text-sm rounded-lg bg-red-500 hover:bg-red-600 text-white transition"
                  >
                    ✕ Reject
                  </button>
                </div>
              </div>

              {/* ── EXPANDED FULL STORY ── */}
              {expanded === post.id && (
                <div className="border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-6 py-6">

                  {/* Full image */}
                  {post.image_url && (
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="w-full max-h-80 object-cover rounded-xl mb-6"
                    />
                  )}

                  {/* Snippet callout */}
                  {post.snippet && (
                    <p className="text-base italic text-gray-600 dark:text-gray-400 border-l-4 border-blue-500 pl-4 mb-6">
                      {post.snippet}
                    </p>
                  )}

                  {/* Full body */}
                  <div className="prose prose-sm dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                    {post.body
                      ? post.body
                          .split(/\n{2,}/)
                          .map((para, i) => (
                            <p key={i} className="mb-4">
                              {para.trim()}
                            </p>
                          ))
                      : <p className="text-gray-400 italic">No body content.</p>
                    }
                  </div>

                  {/* Bottom action bar */}
                  <div className="flex gap-3 mt-8 pt-5 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => approvePost(post.id)}
                      className="flex-1 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold transition"
                    >
                      ✓ Approve Post
                    </button>
                    <button
                      onClick={() => rejectPost(post.id)}
                      className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition"
                    >
                      ✕ Reject Post
                    </button>
                    <button
                      onClick={() => setExpanded(null)}
                      className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}