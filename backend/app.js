const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

const authRoutes         = require('./routes/authRoutes');
const postRoutes         = require('./routes/postRoutes');
const postSearchRoutes   = require('./routes/postSearchRoutes');
const testRoutes         = require('./routes/testRoutes');
const commentRoutes      = require('./routes/commentRoutes');
const likeRoutes         = require('./routes/likeRoutes');
const followRoutes       = require('./routes/followRoutes');
const bookmarkRoutes     = require('./routes/bookmarkRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const uploadRoutes       = require('./routes/uploadRoutes');
const userRoutes         = require('./routes/userRoutes');
const categoryRoutes     = require('./routes/categoryRoutes');
const tagRoutes          = require('./routes/tagRoutes');
const profileRoutes      = require('./routes/profileRoutes');
const adminRoutes        = require('./routes/adminRoutes');
const ogRoute            = require('./routes/ogRoute');

// ----------------------------------
// OG Share Route — BEFORE CORS
// So WhatsApp/Facebook crawlers are never blocked
// ----------------------------------
app.use('/share', ogRoute);

// ----------------------------------
// CORS
// ----------------------------------
app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    'https://www.topnews250.com',
    'https://topnews250.com',
    'https://topnews250.vercel.app',
    'https://topnews-frontend.onrender.com',
    'http://localhost:5173',
  ].filter(Boolean),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

// ----------------------------------
// Static uploads folder
// ----------------------------------
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ----------------------------------
// Body parser  ← MUST come before routes
// ----------------------------------
app.use(express.json());

// ----------------------------------
// Routes  (one mount per router)
// ----------------------------------
app.use('/api/admin',          adminRoutes);
app.use('/api/posts/search',   postSearchRoutes);  // specific before generic
app.use('/api/posts',          postRoutes);
app.use('/api/tags',           tagRoutes);
app.use('/api/categories',     categoryRoutes);
app.use('/api/auth',           authRoutes);
app.use('/api/comments',       commentRoutes);
app.use('/api/likes',          likeRoutes);
app.use('/api/followers',      followRoutes);
app.use('/api/bookmarks',      bookmarkRoutes);
app.use('/api/notifications',  notificationRoutes);
app.use('/api/upload',         uploadRoutes);
app.use('/api/profile',        profileRoutes);
app.use('/api/users',          userRoutes);
app.use('/api',                testRoutes);

app.get('/', (req, res) => res.send('News Blog API running...'));

module.exports = app;