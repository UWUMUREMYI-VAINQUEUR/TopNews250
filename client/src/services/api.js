import axios from 'axios';

// =====================================================
// BASE URL (PRODUCTION + LOCAL SAFE)
// =====================================================
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL + '/api'
    : 'http://localhost:5000/api',
});

// =====================================================
// AUTH INTERCEPTOR
// =====================================================
API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// =====================================================
// POSTS
// =====================================================
export const searchPosts = (params) => API.get('/posts/search', { params });
export const getPostsByAuthor = (userId) => API.get(`/posts/author/${userId}`);
export const getPost = (id) => API.get(`/posts/${id}`);
export const createPost = (data) => API.post('/posts', data);
export const fetchPosts = () => API.get('/posts');

export const getLikesDislikes = (id) => API.get(`/posts/${id}/likes-dislikes-count`);
export const getUserReaction = (id) => API.get(`/posts/${id}/user-reaction`);

export const reactToPost = (post_id, type) =>
  API.post('/likes', { post_id, type });

// =====================================================
// COMMENTS
// =====================================================
export const getCommentsByPost = (postId) => API.get(`/comments/post/${postId}`);
export const addComment = (payload) => API.post('/comments', payload);
export const reactToComment = (payload) => API.post('/comments/react', payload);

// =====================================================
// AUTH
// =====================================================
export const loginApi = (payload) => API.post('/auth/login', payload);
export const signupApi = (payload) => API.post('/auth/signup', payload);
export const verify2FA = (payload) => API.post('/auth/verify-2fa', payload);

// =====================================================
// USERS
// =====================================================
export const getUserProfile = (username) => API.get(`/users/${username}`);
export const updateUserProfile = (payload) => API.put('/users/update', payload);

// =====================================================
// FOLLOW SYSTEM
// =====================================================
export const followUser = (payload) => API.post('/followers/follow', payload);
export const unfollowUser = (payload) => API.post('/followers/unfollow', payload);

// =====================================================
// CATEGORIES & TAGS
// =====================================================
export const fetchCategories = () => API.get('/categories');
export const fetchTags = () => API.get('/tags');

// =====================================================
// BOOKMARKS
// =====================================================
export const addBookmark = (payload) => API.post('/bookmarks/add', payload);
export const removeBookmark = (payload) => API.post('/bookmarks/remove', payload);
export const getBookmarks = () => API.get('/bookmarks');

// =====================================================
// UPLOADS
// =====================================================
export const uploadImage = (formData) =>
  API.post('/upload/image', formData);

export const uploadVideo = (formData) =>
  API.post('/upload/video', formData);

// =====================================================
// NOTIFICATIONS
// =====================================================
export const getNotifications = () => API.get('/notifications');
export const markNotificationRead = (payload) =>
  API.post('/notifications/read', payload);

// =====================================================
// PROFILE
// =====================================================
export const getProfile = (username) => API.get(`/profile/${username}`);
export const updateProfile = (formData) =>
  API.put('/profile/update', formData);

export default API;