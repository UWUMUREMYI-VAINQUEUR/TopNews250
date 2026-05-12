import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  getPost,
  getLikesDislikes,
  getUserReaction,
  reactToPost,
  getCommentsByPost,
  addComment,
  followUser,
  unfollowUser,
  addBookmark,
  removeBookmark,
} from '../services/api';
import { AuthContext } from '../context/AuthContext';
import {
  FaThumbsUp, FaThumbsDown, FaArrowLeft,
  FaUserPlus, FaUserCheck,
  FaBookmark, FaRegBookmark, FaShareAlt,
} from 'react-icons/fa';

/* =======================
   API BASE URL
======================= */
const API = import.meta.env.VITE_API_URL;

export default function PostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const postId = parseInt(id, 10);

  const [post, setPost] = useState(null);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userReaction, setUserReaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentBody, setCommentBody] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      try {
        await Promise.all([loadPost(), loadCounts(), loadComments()]);
        if (user) {
          await loadUserReaction();
          await checkBookmark();
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, [id, user]);

  const loadPost = async () => {
    const res = await getPost(postId);
    const data = res.data;
    setPost({
      ...data,
      author_id: parseInt(data.author_id || data.user_id, 10),
      followed: data.followed ?? false,
    });
  };

  const loadCounts = async () => {
    const res = await getLikesDislikes(postId);
    setLikes(res.data.likes || 0);
    setDislikes(res.data.dislikes || 0);
  };

  const loadUserReaction = async () => {
    try {
      const res = await getUserReaction(postId);
      setUserReaction(res.data.reaction);
    } catch (err) {
      console.error(err);
    }
  };

  const loadComments = async () => {
    try {
      const res = await getCommentsByPost(postId);
      setComments(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const checkBookmark = async () => {
    try {
      const res = await fetch(`${API}/api/bookmarks`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const bookmarks = await res.json();
      setBookmarked(Array.isArray(bookmarks) && bookmarks.some((b) => b.id === postId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleReact = async (type) => {
    if (!user) { navigate('/login', { state: { from: `/post/${id}` } }); return; }
    try {
      await reactToPost(postId, type);
      await loadCounts();
      await loadUserReaction();
    } catch (err) {
      console.error('React error:', err.response?.data || err.message);
    }
  };

  const handleFollow = async () => {
    if (!user) { navigate('/login', { state: { from: `/post/${id}` } }); return; }
    const authorId = parseInt(post.author_id || post.user_id, 10);
    const userId = parseInt(user.id, 10);
    if (!authorId) { console.error('author_id is missing'); return; }
    if (authorId === userId) { console.warn('Cannot follow yourself'); return; }
    try {
      if (post.followed) {
        await unfollowUser({ followed_user_id: authorId });
      } else {
        await followUser({ followed_user_id: authorId });
      }
      setPost((prev) => ({ ...prev, followed: !prev.followed }));
    } catch (err) {
      console.error('Follow error:', err.response?.data || err.message);
    }
  };

  const handleBookmark = async () => {
    if (!user) { navigate('/login', { state: { from: `/post/${id}` } }); return; }
    try {
      if (bookmarked) {
        await removeBookmark({ post_id: postId });
      } else {
        await addBookmark({ post_id: postId });
      }
      setBookmarked(!bookmarked);
    } catch (err) {
      console.error('Bookmark error:', err.response?.data || err.message);
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/post/${id}`;
    if (navigator.share) {
      try { await navigator.share({ title: post?.title, text: post?.snippet, url }); }
      catch (err) { console.log(err); }
    } else {
      try { await navigator.clipboard.writeText(url); alert('Link copied!'); }
      catch (err) { console.error(err); }
    }
  };

  const handleSubmitComment = async () => {
    if (!user) { navigate('/login', { state: { from: `/post/${id}` } }); return; }
    if (!commentBody.trim()) return;
    try {
      await addComment({
        post_id: postId,
        body: commentBody.trim(),
        parent_comment_id: replyTo || null,
      });
      setCommentBody('');
      setReplyTo(null);
      await loadComments();
    } catch (err) {
      console.error('Comment error:', err.response?.data || err.message);
    }
  };

  /* =====================================================
     RENDER REPLIES
  ===================================================== */
  const renderReplies = (parentId) =>
    comments
      .filter((c) => c.parent_comment_id === parentId)
      .map((reply) => (
        <div key={reply.id} className="ml-6 mt-3 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">{reply.commenter_name}</span>
            <span className="text-xs text-gray-500">{new Date(reply.created_at).toLocaleString()}</span>
            {user && user.id === reply.user_id && <span className="text-xs text-green-600">(You)</span>}
          </div>
          <p className="text-sm mt-1">{reply.body}</p>
          {user && (
            <button onClick={() => setReplyTo(reply.id)} className="mt-1 text-blue-600 text-xs hover:underline">
              Reply
            </button>
          )}
          {renderReplies(reply.id)}
        </div>
      ));

  /* =====================================================
     AD SLOT COMPONENT
  ===================================================== */
  const AdSlot = ({ label = 'Advertisement' }) => (
    <div className="my-8 w-full">
      <p className="text-center text-xs font-semibold uppercase tracking-widest text-gray-300 dark:text-gray-600 mb-2">
        {label}
      </p>
      <div className="w-full min-h-[100px] bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-dashed border-gray-300 dark:border-gray-600 rounded-2xl flex items-center justify-center shadow-inner">
        <span className="text-gray-400 dark:text-gray-500 text-sm font-medium tracking-wide">
          Google AdSense — 728×90
        </span>
      </div>
    </div>
  );

  /* =====================================================
     SMART PARAGRAPH SPLITTER
  ===================================================== */
  const splitIntoParagraphs = (html) => {
    if (!html) return [];

    const doc = new DOMParser().parseFromString(html, 'text/html');
    const pTags = doc.querySelectorAll('p');

    // Case 1: Has proper <p> tags
    if (pTags.length > 1) {
      return Array.from(pTags)
        .map((p) => p.textContent.trim())
        .filter((t) => t.length > 0);
    }

    // Case 2: Plain text — split smartly
    const rawText = doc.body.textContent || html.replace(/<[^>]+>/g, '');

    const sentences = rawText
      .replace(/([.!?])\s*([A-Z])/g, '$1\n$2')
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 10); // relaxed from 20

    // Hard fallback: if no sentences found, chunk every ~500 chars
    if (sentences.length === 0) {
      const chunks = [];
      let remaining = rawText.trim();
      while (remaining.length > 0) {
        if (remaining.length <= 500) { chunks.push(remaining); break; }
        let cut = remaining.lastIndexOf(' ', 500);
        if (cut === -1) cut = 500;
        chunks.push(remaining.slice(0, cut).trim());
        remaining = remaining.slice(cut).trim();
      }
      return chunks;
    }

    // Group sentences into paragraphs of ~3 sentences each
    const paragraphs = [];
    let current = '';

    sentences.forEach((sentence) => {
      current += (current ? ' ' : '') + sentence;
      const sentenceCount = (current.match(/[.!?]/g) || []).length;
      if (sentenceCount >= 3 || current.length > 400) {
        paragraphs.push(current.trim());
        current = '';
      }
    });

    if (current.trim()) paragraphs.push(current.trim());

    return paragraphs.filter((p) => p.length > 0);
  };

  /* =====================================================
     BLOG CONTENT — paragraph by paragraph with ads
  ===================================================== */
  const renderBlogContent = () => {
    const paragraphs = splitIntoParagraphs(post.body);

    if (paragraphs.length === 0) {
      return <p className="text-gray-500 italic">No content available.</p>;
    }

    const elements = [];

    paragraphs.forEach((text, index) => {

      elements.push(
        <p
          key={`p-${index}`}
          className="mb-6 text-gray-800 dark:text-gray-200 leading-9 text-lg"
        >
          {text}
        </p>
      );

      // PULL QUOTE after 2nd paragraph
      if (index === 1 && paragraphs.length > 3) {
        const quote = text.slice(0, 130).trim();
        elements.push(
          <blockquote
            key={`quote-${index}`}
            className="my-8 px-6 py-5 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-r-xl text-blue-800 dark:text-blue-300 text-xl italic font-medium leading-relaxed"
          >
            "{quote}..."
          </blockquote>
        );
      }

      // AD SLOT after every 3rd paragraph (not at the very end)
      if ((index + 1) % 3 === 0 && index !== paragraphs.length - 1) {
        elements.push(<AdSlot key={`ad-${index}`} />);
      }
    });

    // Final ad at end of article
    elements.push(<AdSlot key="ad-final" label="Sponsored" />);

    return elements;
  };

  /* =====================================================
     LOADING / ERROR
  ===================================================== */
  if (loading) return (
    <div className="flex items-center justify-center py-20 gap-3 text-gray-500">
      <svg className="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
      Loading post...
    </div>
  );
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!post) return <div className="text-center py-20 text-gray-500">Post not found</div>;

  const authorId = parseInt(post.author_id || post.user_id, 10);
  const userId = user ? parseInt(user.id, 10) : null;
  const isOwnPost = userId && authorId && userId === authorId;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">

      {/* BACK */}
      <Link to="/" className="inline-flex items-center gap-2 text-blue-600 hover:underline mb-8 text-sm font-medium">
        <FaArrowLeft /> Back to News
      </Link>

      {/* POST HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white leading-snug mb-4">
          {post.title}
        </h1>

        <div className="flex items-center justify-between flex-wrap gap-3 text-sm text-gray-500">
          <div className="flex items-center gap-3">
            {post.author_avatar_url ? (
              <img
                src={post.author_avatar_url}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500"
                alt="author"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                {(post.author || 'T')[0].toUpperCase()}
              </div>
            )}
            <div>
              <p className="font-semibold text-gray-800 dark:text-gray-100">
                {post.author || 'TopNews'}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(post.created_at).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric'
                })}
              </p>
            </div>
          </div>

          {post.category && (
            <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-semibold">
              {post.category}
            </span>
          )}
        </div>
      </div>

      {/* TOP AD */}
      <AdSlot label="Advertisement" />

      {/* SNIPPET */}
      {post.snippet && (
        <p className="text-xl italic text-gray-600 dark:text-gray-400 mb-6 border-l-4 border-blue-500 pl-5 leading-relaxed">
          {post.snippet}
        </p>
      )}

      {/* POST IMAGE */}
      {post.image_url && (
        <figure className="mb-8">
          <img
            src={post.image_url}
            alt={post.title}
            className="w-full h-80 object-cover rounded-2xl shadow-lg"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <figcaption className="text-center text-xs text-gray-400 mt-2">
            {post.title}
          </figcaption>
        </figure>
      )}

      {/* ACTION BAR */}
      <div className="flex flex-wrap gap-3 mb-10 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">

        <button
          onClick={() => handleReact('like')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
            userReaction === 'like'
              ? 'bg-blue-600 text-white shadow-md scale-105'
              : 'bg-white dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-gray-600 border dark:border-gray-600'
          }`}
        >
          <FaThumbsUp /> {likes}
        </button>

        <button
          onClick={() => handleReact('dislike')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
            userReaction === 'dislike'
              ? 'bg-red-600 text-white shadow-md scale-105'
              : 'bg-white dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-gray-600 border dark:border-gray-600'
          }`}
        >
          <FaThumbsDown /> {dislikes}
        </button>

        {user && !isOwnPost && (
          <button
            onClick={handleFollow}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
              post.followed
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
            }`}
          >
            {post.followed ? <FaUserCheck /> : <FaUserPlus />}
            {post.followed ? 'Following' : 'Follow'}
          </button>
        )}

        {user && (
          <button
            onClick={handleBookmark}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
              bookmarked
                ? 'bg-yellow-500 text-white shadow-md'
                : 'bg-white dark:bg-gray-700 hover:bg-yellow-50 dark:hover:bg-gray-600 border dark:border-gray-600'
            }`}
          >
            {bookmarked ? <FaBookmark /> : <FaRegBookmark />}
            {bookmarked ? 'Saved' : 'Save'}
          </button>
        )}

        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium bg-green-600 text-white hover:bg-green-700 transition-all shadow-md ml-auto"
        >
          <FaShareAlt /> Share
        </button>
      </div>

      {/* BLOG CONTENT WITH ADS + PULL QUOTE */}
      <article className="mb-12">
        {renderBlogContent()}
      </article>

      {/* COMMENTS */}
      <div className="border-t dark:border-gray-700 pt-10">
        <h2 className="text-2xl font-bold mb-6">
          💬 Comments ({comments.length})
        </h2>

        {replyTo && (
          <div className="mb-3 text-sm text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg flex items-center gap-2">
            <span>Replying to comment #{replyTo}</span>
            <button onClick={() => setReplyTo(null)} className="text-red-500 hover:underline ml-auto">
              Cancel
            </button>
          </div>
        )}

        <textarea
          value={commentBody}
          onChange={(e) => setCommentBody(e.target.value)}
          className="w-full p-4 border rounded-xl dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm leading-relaxed"
          placeholder={replyTo ? 'Write your reply...' : 'Share your thoughts...'}
          rows={4}
        />

        <div className="flex justify-end gap-3 mt-3">
          {replyTo && (
            <button onClick={() => setReplyTo(null)} className="px-4 py-2 text-gray-500 hover:text-gray-700 text-sm">
              Cancel
            </button>
          )}
          <button
            onClick={handleSubmitComment}
            disabled={!commentBody.trim()}
            className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-40 text-sm font-medium"
          >
            {replyTo ? 'Post Reply' : 'Post Comment'}
          </button>
        </div>

        <AdSlot label="Advertisement" />

        <div className="mt-2 space-y-5">
          {comments.length === 0 && (
            <p className="text-center text-gray-400 py-8">
              No comments yet. Be the first to share your thoughts!
            </p>
          )}
          {comments
            .filter((c) => !c.parent_comment_id)
            .map((comment) => (
              <div key={comment.id} className="border rounded-2xl p-4 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold text-sm">
                    {(comment.commenter_name || 'U')[0].toUpperCase()}
                  </div>
                  <div>
                    <span className="font-semibold text-sm">{comment.commenter_name}</span>
                    <p className="text-xs text-gray-400">{new Date(comment.created_at).toLocaleString()}</p>
                  </div>
                  {user && user.id === comment.user_id && (
                    <span className="text-xs text-green-600 ml-auto bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">
                      You
                    </span>
                  )}
                </div>

                <p className="mb-3 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  {comment.body}
                </p>

                {user && (
                  <button onClick={() => setReplyTo(comment.id)} className="text-xs text-blue-600 hover:underline font-medium">
                    ↩ Reply
                  </button>
                )}

                {renderReplies(comment.id)}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}