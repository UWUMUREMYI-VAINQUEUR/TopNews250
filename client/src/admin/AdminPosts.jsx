import React, { useEffect, useState } from "react";
import API from "./adminApi";

const AdminPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================
     FETCH POSTS
  ========================= */
  const fetchPosts = async () => {
    try {
      const res = await API.get("/posts");
      setPosts(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  /* =========================
     DELETE POST
  ========================= */
  const deletePost = async (id) => {
    if (!window.confirm("Delete this post?")) return;

    try {
      await API.delete(`/posts/${id}`);
      setPosts(posts.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading posts...
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Posts Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white shadow rounded-lg overflow-hidden"
          >

            {/* IMAGE */}
            {post.image_url && (
              <img
                src={post.image_url}
                alt={post.title}
                className="w-full h-40 object-cover"
              />
            )}

            {/* CONTENT */}
            <div className="p-4">
              <h2 className="font-bold text-lg line-clamp-2">
                {post.title}
              </h2>

              <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                {post.snippet || post.content}
              </p>

              {/* BADGES */}
              <div className="flex gap-2 mt-3">
                <span
                  className={`text-xs px-2 py-1 rounded text-white ${
                    post.is_ai ? "bg-purple-600" : "bg-blue-600"
                  }`}
                >
                  {post.is_ai ? "AI Post" : "User Post"}
                </span>

                <span className="text-xs bg-gray-500 text-white px-2 py-1 rounded">
                  ID: {post.id}
                </span>
              </div>

              {/* ACTIONS */}
              <button
                onClick={() => deletePost(post.id)}
                className="mt-4 w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
              >
                Delete Post
              </button>
            </div>

          </div>
        ))}

      </div>
    </div>
  );
};

export default AdminPosts;