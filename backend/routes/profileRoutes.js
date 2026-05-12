const express = require('express');
const router = express.Router();

const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');

/* =====================================================
   VALIDATE POST ID
===================================================== */
const validatePostId = (req, res, next) => {
  const { id } = req.params;

  if (!/^\d+$/.test(id)) {
    return res.status(400).json({ error: 'Invalid post ID' });
  }

  next();
};

/* =====================================================
   ROUTES
===================================================== */

// LIST POSTS
router.get('/', postController.listPosts);

// CREATE POST
router.post('/', authMiddleware, postController.createPost);

// GET SINGLE POST
router.get('/:id', validatePostId, postController.getPostById);

// ADMIN
router.get('/pending', postController.getPendingPosts);
router.put('/approve/:id', validatePostId, postController.approvePost);
router.put('/reject/:id', validatePostId, postController.rejectPost);

// REACTIONS
router.get('/:id/likes-dislikes-count', validatePostId, postController.getLikesDislikesCount);
router.get('/:id/user-reaction', authMiddleware, validatePostId, postController.getUserReaction);
router.post('/:id/like', authMiddleware, validatePostId, postController.likeDislikePost);

module.exports = router;