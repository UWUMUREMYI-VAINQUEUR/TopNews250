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
// ----------------------------------
app.use('/share', ogRoute);

// ----------------------------------
// CORS
// ----------------------------------
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL_2,
  'https://www.topnews250.com',
  'https://topnews250.com',
  'https://topnews250.vercel.app',
  'https://topnews-frontend.onrender.com',
  'http://localhost:5173',
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS not allowed: ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
};

app.use(cors(corsOptions));

// ----------------------------------
// Static uploads folder
// ----------------------------------
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ----------------------------------
// Body parser
// ----------------------------------
app.use(express.json());

// ----------------------------------
// Test Email Route (REMOVE AFTER TESTING)
// ----------------------------------
app.get('/test-email', async (req, res) => {
  const { send2FACode } = require('./services/mailService');
  try {
    await send2FACode('lockercylon@gmail.com', '123456');
    res.json({ message: 'Email sent! Check your inbox and spam.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed', error: err.message });
  }
});

// ----------------------------------
// Routes
// ----------------------------------
app.use('/api/admin',          adminRoutes);
app.use('/api/posts/search',   postSearchRoutes);
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