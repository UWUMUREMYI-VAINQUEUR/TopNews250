import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import image from '../assets/tn.png';
import {
  FaBusinessTime, FaLaptopCode, FaFilm, FaMusic, FaHeartbeat,
  FaChartLine, FaFutbol, FaShieldAlt,
  FaShareAlt, FaUserPlus, FaUserCheck
} from 'react-icons/fa';

/* =======================
   CATEGORY ICONS
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

const TOPNEWS_AVATAR = image;

/* =======================
   CLOUDINARY FIX
======================= */
const cloudinaryTransform = (url) => {
  if (!url) return '';
  if (!url.includes('res.cloudinary.com')) return url;
  return url.replace('/upload/', '/upload/c_fill,w_800,h_450,q_auto,f_auto/');
};

const Home = () => {
  const { user } = useContext(AuthContext);

  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [trending, setTrending] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const limit = 6;

  /* FETCH CATEGORIES */
  useEffect(() => {
    axios.get('http://localhost:5000/api/categories')
      .then(res => setCategories(res.data))
      .catch(console.error);
  }, []);

  /* FETCH TRENDING */
  useEffect(() => {
    axios.get('http://localhost:5000/api/posts?limit=5')
      .then(res => setTrending(res.data))
      .catch(console.error);
  }, []);

  /* LOAD POSTS */
  const loadPosts = async (reset = false) => {
    if (loading) return;
    setLoading(true);

    const offset = reset ? 0 : page * limit;

    let url = `http://localhost:5000/api/posts?limit=${limit}&offset=${offset}`;
    if (selectedCategory) url += `&category=${selectedCategory}`;
    if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;

    try {
      const res = await axios.get(url);
      setPosts(prev => reset ? res.data : [...prev, ...res.data]);
      setHasMore(res.data.length === limit);
      setPage(reset ? 1 : page + 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts(true);
  }, [selectedCategory]);

  const onSearch = (e) => {
    e.preventDefault();
    loadPosts(true);
  };

  /* FOLLOW */
  const handleFollow = async (authorId) => {
    const token = localStorage.getItem('token');
    await axios.post(
      'http://localhost:5000/api/followers/follow',
      { followed_user_id: authorId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setPosts(prev =>
      prev.map(p => p.author_id === authorId ? { ...p, followed: true } : p)
    );
  };

  const handleUnfollow = async (authorId) => {
    const token = localStorage.getItem('token');
    await axios.post(
      'http://localhost:5000/api/followers/unfollow',
      { followed_user_id: authorId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setPosts(prev =>
      prev.map(p => p.author_id === authorId ? { ...p, followed: false } : p)
    );
  };

  /* SHARE */
  const handleShare = async (post) => {
    const url = `${window.location.origin}/post/${post.id}`;
    if (navigator.share) {
      await navigator.share({ title: post.title, text: post.snippet, url });
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied!');
    }
  };

  const formatName = (name) =>
    name?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="p-3 sm:p-4 max-w-7xl mx-auto">

      {/* SEARCH */}
      <form onSubmit={onSearch} className="flex gap-2 mb-4">
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search news..."
          className="border p-2 rounded flex-1 dark:bg-gray-800"
        />
        <button className="bg-blue-600 text-white px-4 rounded">
          Search
        </button>
      </form>

      {/* TRENDING */}
      <div className="mb-6">
        <h2 className="font-bold text-lg mb-3">🔥 Trending News</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {trending.map(t => (
            <Link
              key={t.id}
              to={`/post/${t.id}`}
              className="bg-white dark:bg-gray-800 rounded shadow p-2"
            >
              {t.image_url ? (
                <img
                  src={cloudinaryTransform(t.image_url)}
                  className="h-24 w-full object-cover rounded"
                  alt={t.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = TOPNEWS_AVATAR;
                  }}
                />
              ) : (
                <div className="h-24 w-full bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                  <img src={TOPNEWS_AVATAR} className="h-10 opacity-40" alt="placeholder" />
                </div>
              )}
              <p className="text-xs mt-1 line-clamp-2">{t.title}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-5">

        {/* SIDEBAR */}
        <aside className="md:w-64 w-full md:sticky md:top-20 self-start">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-3">
            <h3 className="text-xs font-bold text-gray-500 mb-3 uppercase">
              Categories
            </h3>
            <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible">

              <button
                onClick={() => setSelectedCategory('')}
                className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium transition ${
                  selectedCategory === ''
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-gray-700'
                }`}
              >
                📋 <span>All News</span>
              </button>

              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium transition ${
                    selectedCategory === cat.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="text-lg">
                    {categoryIcons[cat.name.toLowerCase()] || '📰'}
                  </span>
                  <span className="truncate">{formatName(cat.name)}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* POSTS GRID */}
        <main className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map(post => (
            <div key={post.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-3 flex flex-col">

              {/* =====================
                  AUTHOR ROW
                  author + author_avatar_url now come from
                  LEFT JOIN users in postController listPosts
              ===================== */}
              <div className="flex items-center gap-2 mb-2">
                <img
                  src={post.author_avatar_url || TOPNEWS_AVATAR}
                  className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-gray-600"
                  alt="author"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = TOPNEWS_AVATAR;
                  }}
                />
                <span className="text-sm font-medium truncate">
                  {post.author || (post.is_ai ? 'TopNews AI' : 'TopNews')}
                </span>
              </div>

              {/* =====================
                  POST IMAGE
              ===================== */}
              {post.image_url ? (
                <img
                  src={cloudinaryTransform(post.image_url)}
                  className="h-52 w-full object-cover rounded mb-2"
                  alt={post.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="h-52 w-full bg-gray-100 dark:bg-gray-700 rounded mb-2 flex items-center justify-center">
                  <img src={TOPNEWS_AVATAR} className="h-16 opacity-30" alt="no img" />
                </div>
              )}

              {/* POST INFO */}
              <h2 className="font-bold mt-1 line-clamp-2">{post.title}</h2>
              <p className="text-sm text-gray-500 line-clamp-2 mt-1">{post.snippet}</p>

              {/* ACTIONS */}
              <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100 dark:border-gray-700">

                {user && user.id !== post.author_id && (
                  <button
                    onClick={() =>
                      post.followed
                        ? handleUnfollow(post.author_id)
                        : handleFollow(post.author_id)
                    }
                    className={`text-xs px-3 py-1 rounded flex items-center gap-1 ${
                      post.followed
                        ? 'bg-gray-300 dark:bg-gray-700'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    {post.followed ? <FaUserCheck /> : <FaUserPlus />}
                  </button>
                )}

                <button
                  onClick={() => handleShare(post)}
                  className="text-gray-500 hover:text-blue-500"
                >
                  <FaShareAlt />
                </button>

                <Link to={`/post/${post.id}`} className="text-blue-600 text-sm font-medium">
                  Read
                </Link>

              </div>
            </div>
          ))}
        </main>
      </div>

      {/* LOAD MORE */}
      {hasMore && (
        <div className="text-center mt-6">
          <button
            onClick={() => loadPosts()}
            className="px-6 py-2 bg-blue-600 text-white rounded"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}

    </div>
  );
};

export default Home;